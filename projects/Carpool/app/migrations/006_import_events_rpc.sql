-- ============================================================
-- Supabase RPC: import_events(p_source_id uuid, p_events jsonb)
--
-- Purpose:
--   Take a normalized batch of events scraped from an external
--   schedule (GameChanger, an iCal feed, …) and reconcile them
--   into public.events + public.carpool_legs in one round-trip.
--
-- The client (or an edge worker) does the parsing and hands us a
-- jsonb array of plain objects:
--   [
--     {
--       "uid":       "abc-123",          -- stable per-source id
--       "title":     "vs. North Stars",
--       "start":     "2026-05-04T23:00:00Z",
--       "end":       "2026-05-05T01:00:00Z",
--       "location":  "Lincoln Park 4",
--       "cancelled": false               -- optional
--     },
--     …
--   ]
--
-- Behavior:
--   * Skips events whose start is in the past (relative to the
--     server's "today midnight"). Those count toward removed_past.
--   * Garbage-collects any local copies of past events for this
--     source so the schedule view doesn't grow forever.
--   * For each future event:
--       - matched + cancelled  -> soft-cancel (events.cancelled_at,
--         non-completed legs flipped to status='cancelled')
--       - matched + drifted    -> patch title/start/end/location
--         and shift each non-completed leg's departure_time by the
--         start delta
--       - missing + cancelled  -> ignored (nothing to soft-cancel)
--       - missing + active     -> insert event + 2 legs (to_event,
--         from_event) seeded from the source's default_legs knobs
--   * Updates the source row's sync metadata at the end.
--
-- Apply order: AFTER 001_initial_schema.sql, 002_rls_policies.sql,
-- 003_fix_auth_helper_recursion.sql, 004_complete_onboarding_rpc.sql,
-- 005_schedule_sources_rpc.sql.
-- ============================================================

create or replace function import_events(p_source_id uuid, p_events jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_source                 schedule_sources;
  v_default_legs           jsonb;
  v_drop_off_min           int;
  v_pick_up_min            int;
  v_today_start            timestamptz := date_trunc('day', now());
  v_event                  jsonb;
  v_uid                    text;
  v_title                  text;
  v_start                  timestamptz;
  v_end                    timestamptz;
  v_location               text;
  v_cancelled_flag         bool;
  v_existing               events;
  v_new_event_id           uuid;
  v_delta                  interval;
  v_added                  int := 0;
  v_updated                int := 0;
  v_cancelled              int := 0;
  v_removed_past           int := 0;
  v_removed_past_existing  int := 0;
  v_existing_future        int := 0;
begin
  if auth.uid() is null then
    raise exception 'import_events requires an authenticated user';
  end if;

  select * into v_source from schedule_sources where id = p_source_id;

  if v_source.id is null then
    raise exception 'import_events: source % not found', p_source_id;
  end if;

  if v_source.team_id not in (select team_ids_of_current_parent()) then
    raise exception 'import_events: caller is not a member of team %', v_source.team_id;
  end if;

  v_default_legs := coalesce(
    v_source.default_legs,
    '{"drop_off_minutes_before":15,"pick_up_minutes_after":0}'::jsonb
  );
  v_drop_off_min := coalesce((v_default_legs->>'drop_off_minutes_before')::int, 15);
  v_pick_up_min  := coalesce((v_default_legs->>'pick_up_minutes_after')::int, 0);

  -- Walk the incoming batch. Each iteration touches at most one event row
  -- and (for inserts) two carpool_legs rows.
  for v_event in select * from jsonb_array_elements(coalesce(p_events, '[]'::jsonb))
  loop
    v_uid            := nullif(v_event->>'uid', '');
    v_title          := coalesce(nullif(trim(v_event->>'title'), ''), 'Event');
    v_start          := nullif(v_event->>'start', '')::timestamptz;
    v_end            := nullif(v_event->>'end', '')::timestamptz;
    v_location       := nullif(trim(v_event->>'location'), '');
    v_cancelled_flag := coalesce((v_event->>'cancelled')::boolean, false);

    -- Anything without a stable uid or start time we can't reconcile.
    if v_uid is null or v_start is null then
      continue;
    end if;

    if v_start < v_today_start then
      v_removed_past := v_removed_past + 1;
      continue;
    end if;

    select * into v_existing
      from events
     where source = p_source_id::text
       and source_uid = v_uid
     limit 1;

    if v_existing.id is not null then
      if v_cancelled_flag then
        if v_existing.cancelled_at is null then
          update events
             set cancelled_at = now()
           where id = v_existing.id;

          update carpool_legs
             set status = 'cancelled'
           where event_id = v_existing.id
             and status <> 'completed';

          v_cancelled := v_cancelled + 1;
        end if;
      elsif v_existing.title    is distinct from v_title
         or v_existing.start_at is distinct from v_start
         or v_existing.end_at   is distinct from v_end
         or v_existing.location is distinct from v_location then

        v_delta := v_start - v_existing.start_at;

        update events
           set title    = v_title,
               start_at = v_start,
               end_at   = v_end,
               location = v_location
         where id = v_existing.id;

        if v_delta <> interval '0' then
          update carpool_legs
             set departure_time = departure_time + v_delta
           where event_id = v_existing.id
             and status <> 'completed';
        end if;

        v_updated := v_updated + 1;
      end if;
    elsif v_cancelled_flag then
      -- Source says it's cancelled, but we never imported it locally.
      -- Nothing to soft-cancel, so just drop it.
      continue;
    else
      insert into events (
        team_id, title, type, start_at, end_at, location, source, source_uid
      )
      values (
        v_source.team_id, v_title, 'imported', v_start, v_end, v_location,
        p_source_id::text, v_uid
      )
      returning id into v_new_event_id;

      insert into carpool_legs (
        event_id, direction, departure_time,
        departure_location, arrival_location,
        status, seat_capacity
      )
      values (
        v_new_event_id,
        'to_event',
        v_start - (v_drop_off_min * interval '1 minute'),
        'Pickup TBD',
        coalesce(v_location, 'Event'),
        'open',
        4
      );

      insert into carpool_legs (
        event_id, direction, departure_time,
        departure_location, arrival_location,
        status, seat_capacity
      )
      values (
        v_new_event_id,
        'from_event',
        coalesce(v_end, v_start) + (v_pick_up_min * interval '1 minute'),
        coalesce(v_location, 'Event'),
        'Drop-off TBD',
        'open',
        4
      );

      v_added := v_added + 1;
    end if;
  end loop;

  -- Garbage-collect locally stored past events for this source so the
  -- schedule list doesn't grow forever. notifications.leg_id has no
  -- ON DELETE CASCADE, so we have to clear those by hand before the
  -- carpool_legs rows disappear via events->legs cascade.
  delete from notifications
   where leg_id in (
     select cl.id
       from carpool_legs cl
       join events e on e.id = cl.event_id
      where e.source = p_source_id::text
        and e.start_at < v_today_start
   );

  with deleted as (
    delete from events
     where source = p_source_id::text
       and start_at < v_today_start
     returning id
  )
  select count(*)::int into v_removed_past_existing from deleted;

  -- "How many future events does this source own right now?"
  -- This is what the UI shows next to the source card, and naturally
  -- equals (added + updated + unchanged) post-reconcile.
  select count(*)::int into v_existing_future
    from events
   where source = p_source_id::text
     and start_at >= v_today_start;

  update schedule_sources
     set last_synced_at   = now(),
         last_event_count = v_existing_future,
         last_status      = 'ok',
         last_error       = null
   where id = p_source_id;

  return jsonb_build_object(
    'added',        v_added,
    'updated',      v_updated,
    'cancelled',    v_cancelled,
    'removed_past', v_removed_past + v_removed_past_existing
  );
end;
$$;

grant execute on function import_events(uuid, jsonb) to authenticated;
