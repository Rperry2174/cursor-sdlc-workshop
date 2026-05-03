-- ============================================================
-- Co-parent onboarding flow
--
-- Two parents who share kids (Mike + Jessica, both parents of
-- Lucas/Claire/Ben) need the second parent to LINK to the existing
-- children on the team rather than create duplicate child rows.
--
-- This migration:
--   1. Adds list_team_children_for_invite(p_code) — a SECURITY DEFINER
--      lookup that lets a not-yet-member parent see the team's existing
--      kids before they commit to joining. Possessing the invite code
--      is the access credential, same security model as
--      find_team_by_invite_code (migration 009).
--   2. Replaces complete_onboarding(payload) with a version that
--      accepts an `existing_child_ids` array. Each id in that array
--      becomes a parent_children link to an existing children row,
--      gated by membership in the same team being joined. The original
--      `kids` array still creates brand-new children rows.
--
-- Returned children jsonb in complete_onboarding now includes both the
-- newly-created kids and the existing kids the caller linked to.
--
-- Apply order: AFTER 001-009.
-- ============================================================

-- ----------------------------------------------------------------
-- list_team_children_for_invite(p_code) -> jsonb
--   Returns an array of:
--     { id, name, age, avatar_color, photo_url, parent_names[] }
--   for the kids currently on the team identified by p_code. Returns
--   '[]' if the code doesn't match a team or is too short.
-- ----------------------------------------------------------------

create or replace function list_team_children_for_invite(p_code text)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_code text := upper(trim(coalesce(p_code, '')));
  v_team teams;
  v_result jsonb;
begin
  if length(v_code) < 3 then
    return '[]'::jsonb;
  end if;

  select * into v_team from teams where upper(invite_code) = v_code limit 1;
  if v_team.id is null then
    return '[]'::jsonb;
  end if;

  select coalesce(
    jsonb_agg(
      jsonb_build_object(
        'id',           c.id,
        'name',         c.name,
        'age',          c.age,
        'avatar_color', c.avatar_color,
        'photo_url',    c.photo_url,
        'parent_names', coalesce(
          (select to_jsonb(array_agg(p.name order by p.name))
             from parent_children pc
             join parents p on p.id = pc.parent_id
            where pc.child_id = c.id),
          '[]'::jsonb
        )
      )
      order by c.name
    ),
    '[]'::jsonb
  )
  into v_result
  from children c
  join child_teams ct on ct.child_id = c.id
  where ct.team_id = v_team.id;

  return v_result;
end;
$$;

grant execute on function list_team_children_for_invite(text) to anon, authenticated;

-- ----------------------------------------------------------------
-- complete_onboarding(payload jsonb) -> jsonb (REPLACES migration 004)
--
-- New payload field:
--   "existing_child_ids": [uuid, uuid, ...]
--     Each id becomes a parent_children link instead of a new
--     children row. Silently ignored if the kid isn't on the team
--     the caller is joining (defensive against forged payloads).
--
-- Everything else is unchanged from 004.
-- ----------------------------------------------------------------

create or replace function complete_onboarding(payload jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_auth_user_id uuid := auth.uid();
  v_parent_id uuid;
  v_team_id uuid;
  v_team record;
  v_kid jsonb;
  v_child_id uuid;
  v_existing_child_id uuid;
  v_created_children jsonb := '[]'::jsonb;
  v_team_payload jsonb := coalesce(payload->'team', 'null'::jsonb);
  v_team_mode text := v_team_payload->>'mode';
  v_invite_code text;
  v_driver_attestation jsonb := payload->'driverAttestation';
begin
  if v_auth_user_id is null then
    raise exception 'complete_onboarding requires an authenticated user';
  end if;

  -- Idempotency guard for accidental double taps / replays.
  select id into v_parent_id
    from parents
   where auth_user_id = v_auth_user_id
   limit 1;

  if v_parent_id is not null then
    return jsonb_build_object(
      'parent', (select to_jsonb(p) from parents p where p.id = v_parent_id),
      'team', (
        select to_jsonb(t)
          from teams t
          join team_members tm on tm.team_id = t.id
         where tm.parent_id = v_parent_id
           and tm.removed_at is null
         order by t.created_at desc
         limit 1
      ),
      'already_exists', true
    );
  end if;

  insert into parents (
    auth_user_id, name, phone, avatar_color, default_seats,
    home_address, school_address, driver_attestation
  )
  values (
    v_auth_user_id,
    nullif(trim(payload->>'name'), ''),
    nullif(trim(payload->>'phone'), ''),
    coalesce(nullif(payload->>'avatarColor', ''), 'green'),
    4,
    '',
    '',
    case
      when jsonb_typeof(v_driver_attestation) = 'object' then v_driver_attestation
      else null
    end
  )
  returning id into v_parent_id;

  -- Create or join the team before linking kids so child_teams can be written.
  if v_team_mode = 'join' then
    v_invite_code := upper(trim(v_team_payload->>'inviteCode'));

    select * into v_team
      from teams
     where upper(invite_code) = v_invite_code
     limit 1;

    if found then
      v_team_id := v_team.id;
      insert into team_members (team_id, parent_id, role, driver_approved)
      values (v_team_id, v_parent_id, 'member', jsonb_typeof(v_driver_attestation) = 'object')
      on conflict (team_id, parent_id) do update
        set removed_at = null,
            driver_approved = excluded.driver_approved;
    end if;
  elsif v_team_mode = 'create' then
    v_invite_code :=
      coalesce(
        nullif(upper(regexp_replace(v_team_payload->>'name', '[^a-zA-Z0-9]', '', 'g')), ''),
        'GROUP'
      );
    v_invite_code := left(v_invite_code, 6) || '-' || lpad((floor(random() * 9000) + 1000)::int::text, 4, '0');

    insert into teams (name, sport, age_group, season, invite_code, plan)
    values (
      nullif(trim(v_team_payload->>'name'), ''),
      coalesce(nullif(trim(v_team_payload->>'sport'), ''), 'Activity'),
      '',
      coalesce(nullif(trim(v_team_payload->>'season'), ''), 'Spring 2026'),
      v_invite_code,
      'free'
    )
    returning * into v_team;

    v_team_id := v_team.id;

    insert into team_members (team_id, parent_id, role, driver_approved)
    values (v_team_id, v_parent_id, 'admin', jsonb_typeof(v_driver_attestation) = 'object');
  end if;

  -- Brand-new kids the parent entered in the kids step.
  for v_kid in select * from jsonb_array_elements(coalesce(payload->'kids', '[]'::jsonb))
  loop
    if nullif(trim(v_kid->>'name'), '') is null then
      continue;
    end if;

    insert into children (name, birthday, age, avatar_color, school, position)
    values (
      trim(v_kid->>'name'),
      nullif(v_kid->>'birthday', '')::date,
      nullif(v_kid->>'age', '')::int,
      coalesce(nullif(v_kid->>'color', ''), payload->>'avatarColor', 'green'),
      coalesce(v_kid->>'school', ''),
      coalesce(v_kid->>'position', '')
    )
    returning id into v_child_id;

    insert into parent_children (parent_id, child_id)
    values (v_parent_id, v_child_id);

    if v_team_id is not null and coalesce((v_kid->>'include_in_team')::boolean, true) then
      insert into child_teams (team_id, child_id)
      values (v_team_id, v_child_id)
      on conflict do nothing;
    end if;

    v_created_children := v_created_children || jsonb_build_array(
      (select to_jsonb(c) from children c where c.id = v_child_id)
    );
  end loop;

  -- Existing kids the caller is claiming as their own (co-parent path).
  -- Each id must already be linked to the team being joined; otherwise
  -- silently skip so a forged payload can't grant cross-team access.
  if v_team_id is not null then
    for v_existing_child_id in
      select (value)::uuid
        from jsonb_array_elements_text(coalesce(payload->'existing_child_ids', '[]'::jsonb))
    loop
      if not exists (
        select 1 from child_teams ct
         where ct.child_id = v_existing_child_id
           and ct.team_id = v_team_id
      ) then
        continue;
      end if;

      insert into parent_children (parent_id, child_id)
      values (v_parent_id, v_existing_child_id)
      on conflict (parent_id, child_id) do nothing;

      v_created_children := v_created_children || jsonb_build_array(
        (select to_jsonb(c) from children c where c.id = v_existing_child_id)
      );
    end loop;
  end if;

  return jsonb_build_object(
    'parent', (select to_jsonb(p) from parents p where p.id = v_parent_id),
    'children', v_created_children,
    'team', case
      when v_team_id is null then null
      else (select to_jsonb(t) from teams t where t.id = v_team_id)
    end,
    'already_exists', false
  );
end;
$$;

grant execute on function complete_onboarding(jsonb) to authenticated;
