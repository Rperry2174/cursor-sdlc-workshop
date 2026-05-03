-- ============================================================
-- Add a per-team timezone for human-readable formatting
--
-- All event times are stored as timestamptz (UTC under the hood),
-- which is correct. The bug was on the formatting side: the
-- notify-team-leg-claimed Edge Function used toLocaleString without
-- a timezone, so emails showed times in the host server's UTC
-- (e.g. "11:00 PM") instead of the team's local clock ("6:00 PM").
--
-- A carpool team is always in one geographic area — everyone driving
-- the same kids to the same field — so the natural unit for timezone
-- is the team, not the parent.
--
-- Default 'America/Chicago' matches the current pilot. Edit per-team
-- (Profile screen later, or a one-line UPDATE today) for teams in
-- other regions.
--
-- Apply order: AFTER 001-011.
-- ============================================================

alter table teams
  add column if not exists timezone text not null default 'America/Chicago';
