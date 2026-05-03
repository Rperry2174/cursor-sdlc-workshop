-- ============================================================
-- Supabase RPC: complete_onboarding(payload jsonb)
--
-- This is the first real backend write path for the app.
-- The React onboarding flow still creates local demo rows so existing
-- screens keep working, but it now also calls this RPC to create:
--   - parent linked to auth.uid()
--   - children
--   - parent_children
--   - team (create) OR membership (join)
--   - child_teams for the kids included in the team
--
-- Requires a Supabase auth session. The browser client signs users in
-- anonymously for now; later we can replace that with Apple/Google/email
-- auth without changing this RPC contract.
-- ============================================================

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
    auth_user_id,
    name,
    phone,
    avatar_color,
    default_seats,
    home_address,
    school_address,
    driver_attestation
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

  for v_kid in select * from jsonb_array_elements(coalesce(payload->'kids', '[]'::jsonb))
  loop
    if nullif(trim(v_kid->>'name'), '') is null then
      continue;
    end if;

    insert into children (
      name,
      birthday,
      age,
      avatar_color,
      school,
      position
    )
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
