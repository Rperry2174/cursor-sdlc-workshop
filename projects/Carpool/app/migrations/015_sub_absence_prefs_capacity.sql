-- ============================================================
-- Sub requests (backend), child absences, notification prefs JSON,
-- capacity-safe seating, and auto-seat trigger updates
--
-- Apply AFTER 001–014.
-- ============================================================

-- ----------------------------------------------------------------
-- 1) Rich notification preferences (client merges into this blob)
-- ----------------------------------------------------------------

alter table notification_preferences
  add column if not exists prefs_json jsonb not null default '{}'::jsonb;

-- ----------------------------------------------------------------
-- 2) child_absences — "kid out" on a calendar day (blocks auto-seat)
-- ----------------------------------------------------------------

create table if not exists child_absences (
  id                     uuid primary key default gen_random_uuid(),
  child_id               uuid not null references children(id) on delete cascade,
  created_by_parent_id   uuid not null references parents(id) on delete cascade,
  absence_date           date not null,
  reason                 text,
  created_at             timestamptz not null default now(),
  unique (child_id, absence_date)
);

create index if not exists child_absences_child_date_idx
  on child_absences (child_id, absence_date);

alter table child_absences enable row level security;

create policy child_absences_select
  on child_absences for select
  using (
    exists (
      select 1 from parent_children pc
       where pc.child_id = child_absences.child_id
         and pc.parent_id = auth_parent_id()
    )
    or exists (
      select 1 from child_teams ct
       where ct.child_id = child_absences.child_id
         and ct.team_id in (select team_ids_of_current_parent())
    )
  );

create policy child_absences_insert_self
  on child_absences for insert
  with check (
    created_by_parent_id = auth_parent_id()
    and exists (
      select 1 from parent_children pc
       where pc.child_id = child_id
         and pc.parent_id = auth_parent_id()
    )
  );

create policy child_absences_delete_self
  on child_absences for delete
  using (created_by_parent_id = auth_parent_id());

create policy child_absences_update_self
  on child_absences for update
  using (created_by_parent_id = auth_parent_id())
  with check (created_by_parent_id = auth_parent_id());

-- ----------------------------------------------------------------
-- 3) Auto-seat triggers: skip kids with an absence on that leg day
--    (team timezone from teams.timezone, default America/Chicago)
-- ----------------------------------------------------------------

create or replace function auto_seat_team_kid_on_team_legs()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into seats (leg_id, child_id, added_by)
  select cl.id, new.child_id, null
    from carpool_legs cl
    join events e on e.id = cl.event_id
    join teams tm on tm.id = e.team_id
   where e.team_id = new.team_id
     and cl.departure_time > now()
     and (cl.status is null or cl.status not in ('completed', 'cancelled'))
     and not exists (
       select 1
         from child_absences ca
        where ca.child_id = new.child_id
          and ca.absence_date = (
            timezone(coalesce(nullif(trim(tm.timezone), ''), 'America/Chicago'), cl.departure_time)
          )::date
     )
   on conflict (leg_id, child_id) do nothing;
  return new;
end;
$$;

create or replace function auto_seat_team_kids_on_new_leg()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_team_id uuid;
begin
  select team_id into v_team_id from events where id = new.event_id;
  if v_team_id is null then
    return new;
  end if;

  insert into seats (leg_id, child_id, added_by)
  select new.id, ct.child_id, null
    from child_teams ct
    join teams tm on tm.id = ct.team_id
   where ct.team_id = v_team_id
     and not exists (
       select 1
         from child_absences ca
        where ca.child_id = ct.child_id
          and ca.absence_date = (
            timezone(coalesce(nullif(trim(tm.timezone), ''), 'America/Chicago'), new.departure_time)
          )::date
     )
   on conflict (leg_id, child_id) do nothing;

  return new;
end;
$$;

-- ----------------------------------------------------------------
-- 4) seat_child_on_leg — enforce seat_capacity atomically
-- ----------------------------------------------------------------

create or replace function seat_child_on_leg(p_leg_id uuid, p_child_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_parent_id uuid := auth_parent_id();
  v_leg       carpool_legs;
  v_event     events;
  v_cnt       int;
  v_cap       int;
begin
  if auth.uid() is null then
    raise exception 'seat_child_on_leg requires an authenticated user';
  end if;
  if v_parent_id is null then
    return jsonb_build_object('ok', false, 'reason', 'no_parent');
  end if;

  if not exists (
    select 1 from parent_children pc
     where pc.child_id = p_child_id and pc.parent_id = v_parent_id
  ) then
    return jsonb_build_object('ok', false, 'reason', 'not_your_child');
  end if;

  select * into v_leg from carpool_legs where id = p_leg_id;
  if v_leg.id is null then
    return jsonb_build_object('ok', false, 'reason', 'leg_not_found');
  end if;

  select * into v_event from events where id = v_leg.event_id;
  if v_event.id is null
     or v_event.team_id is null
     or v_event.team_id not in (select team_ids_of_current_parent())
  then
    return jsonb_build_object('ok', false, 'reason', 'not_member');
  end if;

  select count(*)::int into v_cnt from seats where leg_id = p_leg_id;
  v_cap := coalesce(v_leg.seat_capacity, 4);
  if v_cnt >= v_cap then
    return jsonb_build_object('ok', false, 'reason', 'full');
  end if;

  if exists (select 1 from seats where leg_id = p_leg_id and child_id = p_child_id) then
    return jsonb_build_object('ok', false, 'reason', 'already_seated');
  end if;

  insert into seats (leg_id, child_id, added_by)
  values (p_leg_id, p_child_id, v_parent_id);

  return jsonb_build_object('ok', true);
end;
$$;

grant execute on function seat_child_on_leg(uuid, uuid) to authenticated;

-- ----------------------------------------------------------------
-- 5) open_sub_request_for_leg — driver asks team to cover (mirrors
--    local releaseLeg + broadcast sub_request)
-- ----------------------------------------------------------------

create or replace function open_sub_request_for_leg(
  p_leg_id uuid,
  p_reason text,
  p_emergency boolean default false
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_parent_id uuid := auth_parent_id();
  v_leg       carpool_legs;
  v_event     events;
  v_sub_id    uuid;
  v_mins      numeric;
  v_cfg_mins  int := 30;
  v_updated   carpool_legs;
  v_req_name  text;
  v_dir_label text;
  v_member    uuid;
begin
  if auth.uid() is null then
    raise exception 'open_sub_request_for_leg requires an authenticated user';
  end if;
  if v_parent_id is null then
    return jsonb_build_object('ok', false, 'reason', 'no_parent');
  end if;

  select * into v_leg from carpool_legs where id = p_leg_id;
  if v_leg.id is null then
    return jsonb_build_object('ok', false, 'reason', 'not_found');
  end if;

  select * into v_event from events where id = v_leg.event_id;
  if v_event.id is null
     or v_event.team_id is null
     or v_event.team_id not in (select team_ids_of_current_parent())
  then
    return jsonb_build_object('ok', false, 'reason', 'not_member');
  end if;

  if v_leg.driver_id is distinct from v_parent_id then
    return jsonb_build_object('ok', false, 'reason', 'not_driver');
  end if;

  v_mins := extract(epoch from (v_leg.departure_time - now())) / 60.0;
  if v_mins <= v_cfg_mins and coalesce(p_emergency, false) is not true then
    return jsonb_build_object('ok', false, 'reason', 'requires_emergency');
  end if;

  if exists (
    select 1 from sub_requests sr
     where sr.leg_id = p_leg_id and sr.status = 'open'
  ) then
    return jsonb_build_object('ok', false, 'reason', 'sub_already_open');
  end if;

  insert into sub_requests (leg_id, requested_by, reason, mode, status, expires_at)
  values (
    p_leg_id,
    v_parent_id,
    coalesce(p_reason, ''),
    'broadcast',
    'open',
    v_leg.departure_time
  )
  returning id into v_sub_id;

  update carpool_legs
     set driver_id  = null,
         status     = 'open',
         claimed_at = null
   where id = p_leg_id
   returning * into v_updated;

  insert into ride_status_events (leg_id, parent_id, status, metadata)
  values (
    v_updated.id,
    v_parent_id,
    'driver_released',
    jsonb_build_object('sub_request_id', v_sub_id)
  );

  select name into v_req_name from parents where id = v_parent_id;
  v_dir_label := case when v_leg.direction = 'to_event' then 'drop-off' else 'pick-up' end;

  for v_member in
    select tm.parent_id
      from team_members tm
     where tm.team_id = v_event.team_id
       and tm.removed_at is null
       and tm.parent_id is distinct from v_parent_id
  loop
    insert into notifications (parent_id, kind, body, leg_id)
    values (
      v_member,
      'sub_request_open',
      coalesce(v_req_name, 'A parent') || ' needs a sub for the ' || v_dir_label || '.',
      p_leg_id
    );
  end loop;

  return jsonb_build_object(
    'ok',               true,
    'sub_request_id',  v_sub_id,
    'leg',             to_jsonb(v_updated)
  );
end;
$$;

grant execute on function open_sub_request_for_leg(uuid, text, boolean) to authenticated;

-- ----------------------------------------------------------------
-- 6) accept_sub_request — first parent to accept claims the leg
-- ----------------------------------------------------------------

create or replace function accept_sub_request(p_sub_request_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_parent_id uuid := auth_parent_id();
  v_sub       sub_requests;
  v_leg       carpool_legs;
  v_updated   carpool_legs;
  v_event     events;
begin
  if auth.uid() is null then
    raise exception 'accept_sub_request requires an authenticated user';
  end if;
  if v_parent_id is null then
    return jsonb_build_object('ok', false, 'reason', 'no_parent');
  end if;

  select * into v_sub
    from sub_requests
   where id = p_sub_request_id
     and status = 'open'
   for update;

  if v_sub.id is null then
    return jsonb_build_object('ok', false, 'reason', 'closed');
  end if;

  select * into v_leg from carpool_legs where id = v_sub.leg_id for update;
  if v_leg.id is null then
    update sub_requests set status = 'cancelled' where id = p_sub_request_id;
    return jsonb_build_object('ok', false, 'reason', 'leg_missing');
  end if;

  select * into v_event from events where id = v_leg.event_id;
  if v_event.team_id is null
     or v_event.team_id not in (select team_ids_of_current_parent())
  then
    return jsonb_build_object('ok', false, 'reason', 'not_member');
  end if;

  if v_sub.requested_by = v_parent_id then
    return jsonb_build_object('ok', false, 'reason', 'cannot_accept_own');
  end if;

  update carpool_legs
     set driver_id  = v_parent_id,
         status     = 'filled',
         claimed_at = now()
   where id = v_leg.id
     and driver_id is null
   returning * into v_updated;

  if v_updated.id is null then
    return jsonb_build_object('ok', false, 'reason', 'taken');
  end if;

  update sub_requests
     set status = 'accepted'
   where id = p_sub_request_id;

  insert into sub_request_responses (sub_request_id, parent_id, response)
  values (p_sub_request_id, v_parent_id, 'accepted');

  insert into ride_status_events (leg_id, parent_id, status, metadata)
  values (
    v_updated.id,
    v_parent_id,
    'driver_claimed',
    jsonb_build_object('via_sub_request', true, 'sub_request_id', p_sub_request_id)
  );

  return jsonb_build_object(
    'ok',  true,
    'leg', to_jsonb(v_updated)
  );
end;
$$;

grant execute on function accept_sub_request(uuid) to authenticated;

-- ----------------------------------------------------------------
-- 7) mark_child_absence — unseat + absence row; clear re-seats team legs
-- ----------------------------------------------------------------

create or replace function mark_child_absence(
  p_child_id uuid,
  p_on_date date,
  p_absent boolean,
  p_reason text
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_parent_id uuid := auth_parent_id();
  v_deleted   int := 0;
begin
  if auth.uid() is null then
    raise exception 'mark_child_absence requires an authenticated user';
  end if;
  if v_parent_id is null then
    return jsonb_build_object('ok', false, 'reason', 'no_parent');
  end if;

  if not exists (
    select 1 from parent_children pc
     where pc.child_id = p_child_id and pc.parent_id = v_parent_id
  ) then
    return jsonb_build_object('ok', false, 'reason', 'not_your_child');
  end if;

  if coalesce(p_absent, true) then
    insert into child_absences (child_id, created_by_parent_id, absence_date, reason)
    values (p_child_id, v_parent_id, p_on_date, nullif(trim(coalesce(p_reason, '')), ''))
    on conflict (child_id, absence_date)
    do update set reason = excluded.reason, created_by_parent_id = excluded.created_by_parent_id;

    delete from seats s
     using carpool_legs cl
     join events e on e.id = cl.event_id
     join teams tm on tm.id = e.team_id
     where s.leg_id = cl.id
       and s.child_id = p_child_id
       and cl.departure_time > now()
       and (cl.status is null or cl.status not in ('completed', 'cancelled'))
       and (
         timezone(coalesce(nullif(trim(tm.timezone), ''), 'America/Chicago'), cl.departure_time)
       )::date = p_on_date;

    get diagnostics v_deleted = row_count;

    return jsonb_build_object('ok', true, 'mode', 'marked_absent', 'seats_removed', v_deleted);
  end if;

  delete from child_absences
   where child_id = p_child_id and absence_date = p_on_date;

  insert into seats (leg_id, child_id, added_by)
  select cl.id, p_child_id, null
    from carpool_legs cl
    join events e on e.id = cl.event_id
    join child_teams ct on ct.team_id = e.team_id and ct.child_id = p_child_id
    join teams tm on tm.id = e.team_id
   where cl.departure_time > now()
     and (cl.status is null or cl.status not in ('completed', 'cancelled'))
     and (
       timezone(coalesce(nullif(trim(tm.timezone), ''), 'America/Chicago'), cl.departure_time)
     )::date = p_on_date
   on conflict (leg_id, child_id) do nothing;

  return jsonb_build_object('ok', true, 'mode', 'cleared_absent');
end;
$$;

grant execute on function mark_child_absence(uuid, date, boolean, text) to authenticated;
