-- ============================================================
-- Supabase RPC: find_team_by_invite_code(p_code text)
--
-- Purpose:
--   The onboarding wizard needs to validate an invite code BEFORE the
--   parent commits to joining. RLS on the `teams` table (policy
--   teams_select_member in 002) only lets you SELECT teams you already
--   belong to, so a fresh signup cannot read the row via PostgREST.
--
--   This SECURITY DEFINER RPC returns the matching team's
--   (id, name, sport, season, invite_code) WITHOUT exposing anything
--   else. It's safe to expose to anonymous + authenticated callers
--   because invite codes are themselves the access secret — possessing
--   the code is the membership credential.
--
-- Returns:
--   The matching row as jsonb, or NULL if no team exists.
--
-- Apply order: AFTER 001-008.
-- ============================================================

create or replace function find_team_by_invite_code(p_code text)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_code text := upper(trim(coalesce(p_code, '')));
  v_row  teams;
begin
  if length(v_code) < 3 then
    return null;
  end if;

  select * into v_row from teams where upper(invite_code) = v_code limit 1;
  if v_row.id is null then
    return null;
  end if;

  return jsonb_build_object(
    'id',          v_row.id,
    'name',        v_row.name,
    'sport',       v_row.sport,
    'season',      v_row.season,
    'invite_code', v_row.invite_code
  );
end;
$$;

grant execute on function find_team_by_invite_code(text) to anon, authenticated;
