-- ============================================================
-- Supabase RPC: claim_leg(p_leg_id uuid)
--
-- Purpose:
--   Atomically assign the calling parent as the driver of an open
--   carpool leg. This is the hot path that runs every time a parent
--   taps "I can drive" in the app, so it has to handle the
--   double-tap race without ever leaving a leg in a half-claimed
--   state.
--
-- The lock-and-check pattern here is a single conditional UPDATE
-- (`where id = p_leg_id and driver_id is null`). Postgres takes a
-- row lock as part of that statement, so two concurrent callers
-- can't both win — exactly one update affects 1 row, the other
-- affects 0 rows and falls through to the diagnostic branch.
--
-- Returns:
--   { ok: true,  leg: <row as jsonb> }
--   { ok: false, reason: 'not_found' }
--   { ok: false, reason: 'not_member' }
--   { ok: false, reason: 'taken', driver_id: <uuid> }
--
-- Side effects (success only):
--   * carpool_legs.{driver_id, status, claimed_at} updated
--   * one ride_status_events row inserted, status='driver_claimed'
--
-- Apply order: AFTER 001_initial_schema.sql, 002_rls_policies.sql,
-- 003_fix_auth_helper_recursion.sql, 004_complete_onboarding_rpc.sql,
-- 005_schedule_sources_rpc.sql, 006_import_events_rpc.sql.
-- ============================================================

create or replace function claim_leg(p_leg_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_parent_id uuid := auth_parent_id();
  v_updated   carpool_legs;
  v_existing  carpool_legs;
  v_event     events;
begin
  if auth.uid() is null then
    raise exception 'claim_leg requires an authenticated user';
  end if;

  if v_parent_id is null then
    raise exception 'claim_leg: no parent record linked to auth user %', auth.uid();
  end if;

  -- The conditional update IS the lock-and-check. If the leg is
  -- already taken, this affects 0 rows and v_updated.id stays null.
  update carpool_legs
     set driver_id  = v_parent_id,
         status     = 'filled',
         claimed_at = now()
   where id = p_leg_id
     and driver_id is null
   returning * into v_updated;

  if v_updated.id is not null then
    insert into ride_status_events (leg_id, parent_id, status)
    values (v_updated.id, v_parent_id, 'driver_claimed');

    return jsonb_build_object(
      'ok',  true,
      'leg', to_jsonb(v_updated)
    );
  end if;

  -- 0 rows updated. Figure out *why* so the client can show a
  -- meaningful message instead of a generic "couldn't claim".
  select * into v_existing from carpool_legs where id = p_leg_id;

  if v_existing.id is null then
    return jsonb_build_object('ok', false, 'reason', 'not_found');
  end if;

  select * into v_event from events where id = v_existing.event_id;

  if v_event.id is null
     or v_event.team_id is null
     or v_event.team_id not in (select team_ids_of_current_parent())
  then
    return jsonb_build_object('ok', false, 'reason', 'not_member');
  end if;

  return jsonb_build_object(
    'ok',        false,
    'reason',    'taken',
    'driver_id', v_existing.driver_id
  );
end;
$$;

grant execute on function claim_leg(uuid) to authenticated;
