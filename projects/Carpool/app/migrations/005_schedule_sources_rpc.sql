-- ============================================================
-- Schedule sources: schema add-ons + write RPCs
--
-- Purpose:
--   The Carpool app lets each team wire up an external schedule
--   feed (GameChanger, an iCal URL, a sample fixture, etc.). The
--   001 schema only models the bare minimum (team_id, kind, url,
--   label, last_synced_at). To actually drive the import flow and
--   surface sync status in the UI, schedule_sources needs a few
--   more columns plus two writer RPCs the React client can call.
--
-- What this migration changes:
--   * Adds nullable columns to public.schedule_sources:
--       - name              (display name; label kept for back-compat)
--       - default_legs      (jsonb knobs for the auto-built carpool legs)
--       - last_event_count  (number of future events after last sync)
--       - last_status       ('ok' | 'error' | …)
--       - last_error        (free-form error string from the last sync)
--   * Defines add_schedule_source(payload jsonb) — create a new feed
--     for a team the caller belongs to.
--   * Defines update_schedule_source(source_id uuid, patch jsonb) —
--     patch a whitelisted set of columns on an existing feed.
--
-- Apply order: AFTER 001_initial_schema.sql, 002_rls_policies.sql,
-- 003_fix_auth_helper_recursion.sql, 004_complete_onboarding_rpc.sql.
-- ============================================================

alter table schedule_sources add column if not exists name text;
alter table schedule_sources add column if not exists default_legs jsonb
  default '{"drop_off_minutes_before":15,"pick_up_minutes_after":0}'::jsonb;
alter table schedule_sources add column if not exists last_event_count int;
alter table schedule_sources add column if not exists last_status text;
alter table schedule_sources add column if not exists last_error text;

-- ============================================================
-- add_schedule_source(payload jsonb) -> jsonb
--
-- Creates one schedule_sources row for a team the caller belongs
-- to. `label` is mirrored from `name` so older queries that still
-- read `label` keep working.
--
-- Payload shape:
--   {
--     "team_id":      uuid,        -- required
--     "name":         "Team feed", -- required (also stored as label)
--     "kind":         "ics",       -- defaults to 'manual'
--     "url":          "https://…",
--     "default_legs": { "drop_off_minutes_before": 15,
--                       "pick_up_minutes_after":   0 }
--   }
-- ============================================================

create or replace function add_schedule_source(payload jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_team_id      uuid := nullif(payload->>'team_id', '')::uuid;
  v_name         text := nullif(trim(payload->>'name'), '');
  v_kind         text := coalesce(nullif(trim(payload->>'kind'), ''), 'manual');
  v_url          text := nullif(trim(payload->>'url'), '');
  v_default_legs jsonb := coalesce(
    payload->'default_legs',
    '{"drop_off_minutes_before":15,"pick_up_minutes_after":0}'::jsonb
  );
  v_row schedule_sources;
begin
  if auth.uid() is null then
    raise exception 'add_schedule_source requires an authenticated user';
  end if;

  if v_team_id is null then
    raise exception 'add_schedule_source: team_id is required';
  end if;

  if v_team_id not in (select team_ids_of_current_parent()) then
    raise exception 'add_schedule_source: caller is not a member of team %', v_team_id;
  end if;

  insert into schedule_sources (team_id, kind, url, label, name, default_legs)
  values (v_team_id, v_kind, v_url, v_name, v_name, v_default_legs)
  returning * into v_row;

  return to_jsonb(v_row);
end;
$$;

-- ============================================================
-- update_schedule_source(source_id uuid, patch jsonb) -> jsonb
--
-- Patches a whitelisted subset of columns on a schedule_sources
-- row the caller's team owns. Anything not in the whitelist is
-- silently ignored, so a buggy client can't accidentally rewrite
-- team_id or created_at.
--
-- Whitelisted keys:
--   name, label, url, last_synced_at, last_event_count,
--   last_status, last_error, default_legs
-- ============================================================

create or replace function update_schedule_source(source_id uuid, patch jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_row schedule_sources;
begin
  if auth.uid() is null then
    raise exception 'update_schedule_source requires an authenticated user';
  end if;

  if source_id is null then
    raise exception 'update_schedule_source: source_id is required';
  end if;

  select * into v_row from schedule_sources where id = source_id;

  if v_row.id is null then
    raise exception 'update_schedule_source: source % not found', source_id;
  end if;

  if v_row.team_id not in (select team_ids_of_current_parent()) then
    raise exception 'update_schedule_source: caller is not a member of team %', v_row.team_id;
  end if;

  update schedule_sources set
    name             = case when patch ? 'name'
                              then nullif(trim(patch->>'name'), '')
                              else name end,
    label            = case when patch ? 'label'
                              then nullif(trim(patch->>'label'), '')
                              else label end,
    url              = case when patch ? 'url'
                              then nullif(trim(patch->>'url'), '')
                              else url end,
    last_synced_at   = case when patch ? 'last_synced_at'
                              then nullif(patch->>'last_synced_at', '')::timestamptz
                              else last_synced_at end,
    last_event_count = case when patch ? 'last_event_count'
                              then nullif(patch->>'last_event_count', '')::int
                              else last_event_count end,
    last_status      = case when patch ? 'last_status'
                              then nullif(patch->>'last_status', '')
                              else last_status end,
    last_error       = case when patch ? 'last_error'
                              then nullif(patch->>'last_error', '')
                              else last_error end,
    default_legs     = case when patch ? 'default_legs'
                              then patch->'default_legs'
                              else default_legs end
  where id = source_id
  returning * into v_row;

  return to_jsonb(v_row);
end;
$$;

grant execute on function add_schedule_source(jsonb) to authenticated;
grant execute on function update_schedule_source(uuid, jsonb) to authenticated;
