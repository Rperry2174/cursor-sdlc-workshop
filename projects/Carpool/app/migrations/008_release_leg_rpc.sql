-- ============================================================
-- Supabase RPC: release_leg(p_leg_id uuid)
--
-- Purpose:
--   Inverse of claim_leg(): the parent currently assigned as the
--   driver of a carpool leg gives it back to the open pool. This
--   is the path behind the "I can't drive this anymore" button.
--
-- Authorization rules:
--   * Caller must be authenticated.
--   * The leg must belong to a team the caller is a member of
--     (routed via events.team_id, mirroring the legs RLS policy).
--   * The caller's parent_id must be the leg's current driver_id.
--     Releasing someone else's leg is the sub_request flow, not
--     this one.
--
-- Returns:
--   { ok: true,  leg: <row as jsonb> }
--   { ok: false, reason: 'not_found' }
--   { ok: false, reason: 'not_member' }
--   { ok: false, reason: 'not_driver' }
--
-- Side effects (success only):
--   * carpool_legs.{driver_id, status, claimed_at} reset
--   * one ride_status_events row inserted, status='driver_released'
--
-- Apply order: AFTER 001_initial_schema.sql, 002_rls_policies.sql,
-- 003_fix_auth_helper_recursion.sql, 004_complete_onboarding_rpc.sql,
-- 005_schedule_sources_rpc.sql, 006_import_events_rpc.sql,
-- 007_claim_leg_rpc.sql.
-- ============================================================

create or replace function release_leg(p_leg_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_parent_id uuid := auth_parent_id();
  v_existing  carpool_legs;
  v_event     events;
  v_updated   carpool_legs;
begin
  if auth.uid() is null then
    raise exception 'release_leg requires an authenticated user';
  end if;

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

  -- A null parent_id can never match a non-null driver_id, so we
  -- handle the "no parent record" case here without raising.
  if v_parent_id is null
     or v_existing.driver_id is distinct from v_parent_id then
    return jsonb_build_object('ok', false, 'reason', 'not_driver');
  end if;

  update carpool_legs
     set driver_id  = null,
         status     = 'open',
         claimed_at = null
   where id = p_leg_id
   returning * into v_updated;

  insert into ride_status_events (leg_id, parent_id, status)
  values (v_updated.id, v_parent_id, 'driver_released');

  return jsonb_build_object(
    'ok',  true,
    'leg', to_jsonb(v_updated)
  );
end;
$$;

grant execute on function release_leg(uuid) to authenticated;
