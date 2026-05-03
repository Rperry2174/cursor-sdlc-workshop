-- ============================================================
-- Auto-seat team kids on team legs
--
-- Mental model change: a kid on a team is, by default, a RIDER on every
-- leg of every event for that team. Parents opt OUT for special cases
-- (sick day, family conflict) by removing the seat. Previously, seats
-- were opt-IN — every parent had to manually add their kid to every leg,
-- which both burdens the user and made the "who needs to know about this
-- claim?" notification audience perpetually empty.
--
-- This migration installs three triggers + one backfill so the data
-- behaves like the product mental model regardless of how a row got
-- written:
--
--   1. After INSERT on child_teams (kid joins team) -> seat that kid on
--      every existing future leg of that team.
--   2. After DELETE on child_teams (kid leaves team) -> remove that kid's
--      seats from every future leg of that team. Past + completed legs
--      are intentionally untouched so history stays intact.
--   3. After INSERT on carpool_legs (schedule import creates a new leg)
--      -> seat every current team kid on that new leg.
--
-- Plus a one-time INSERT that backfills seats for every existing kid on
-- every existing future leg of their team.
--
-- All trigger functions are SECURITY DEFINER so they bypass the seats
-- table's RLS policy. The triggers themselves act on the team-membership
-- relationship, which is the same trust boundary RLS would use.
--
-- Apply order: AFTER 001-012.
-- ============================================================

-- ----------------------------------------------------------------
-- Trigger: when a kid joins a team, seat them on all future team legs.
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
   where e.team_id = new.team_id
     and cl.departure_time > now()
     and (cl.status is null or cl.status not in ('completed', 'cancelled'))
   on conflict (leg_id, child_id) do nothing;
  return new;
end;
$$;

drop trigger if exists trg_auto_seat_team_kid_on_team_legs on child_teams;
create trigger trg_auto_seat_team_kid_on_team_legs
  after insert on child_teams
  for each row execute function auto_seat_team_kid_on_team_legs();

-- ----------------------------------------------------------------
-- Trigger: when a kid leaves a team, drop their future seats.
-- Past + completed legs are preserved as history.
-- ----------------------------------------------------------------

create or replace function auto_unseat_kid_from_team_legs()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  delete from seats
   where child_id = old.child_id
     and leg_id in (
       select cl.id
         from carpool_legs cl
         join events e on e.id = cl.event_id
        where e.team_id = old.team_id
          and cl.departure_time > now()
          and (cl.status is null or cl.status not in ('completed', 'cancelled'))
     );
  return old;
end;
$$;

drop trigger if exists trg_auto_unseat_kid_from_team_legs on child_teams;
create trigger trg_auto_unseat_kid_from_team_legs
  after delete on child_teams
  for each row execute function auto_unseat_kid_from_team_legs();

-- ----------------------------------------------------------------
-- Trigger: when a new leg is inserted (e.g. schedule import created it),
-- seat every current team kid on that leg.
-- ----------------------------------------------------------------

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
   where ct.team_id = v_team_id
   on conflict (leg_id, child_id) do nothing;

  return new;
end;
$$;

drop trigger if exists trg_auto_seat_team_kids_on_new_leg on carpool_legs;
create trigger trg_auto_seat_team_kids_on_new_leg
  after insert on carpool_legs
  for each row execute function auto_seat_team_kids_on_new_leg();

-- ----------------------------------------------------------------
-- One-time backfill: seat every current team kid on every existing
-- future leg of their team. Idempotent via on conflict do nothing.
-- ----------------------------------------------------------------

insert into seats (leg_id, child_id, added_by)
select cl.id, ct.child_id, null
  from carpool_legs cl
  join events e on e.id = cl.event_id
  join child_teams ct on ct.team_id = e.team_id
 where cl.departure_time > now()
   and (cl.status is null or cl.status not in ('completed', 'cancelled'))
on conflict (leg_id, child_id) do nothing;
