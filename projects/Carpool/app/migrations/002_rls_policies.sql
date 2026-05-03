-- ============================================================
-- Row-Level Security policies
--
-- Mental model: every meaningful row in this database belongs to a
-- TEAM (directly via team_id, or transitively through events ->
-- carpool_legs -> seats etc.). A logged-in parent can read/write a
-- row iff they're a member of that team.
--
-- This file:
--   1. Turns RLS on for every table
--   2. Defines a SQL helper auth_parent_id() that resolves the
--      currently-authenticated Supabase auth.uid() to the parents.id
--   3. Defines a SECURITY DEFINER helper team_ids_of_current_parent()
--      that returns the set of team IDs the caller belongs to (used
--      everywhere instead of repeating the join, both for clarity and
--      so the planner can use the team_members index)
--   4. Writes one SELECT/INSERT/UPDATE/DELETE policy per table
--
-- Because every "expensive" check goes through team_ids_of_current_parent(),
-- adding a new team or new policy never changes per-query cost: O(member-of)
-- which is one indexed lookup.
-- ============================================================

-- Turn RLS on for every table. Without this the policies below have no effect.
alter table parents                  enable row level security;
alter table children                 enable row level security;
alter table parent_children          enable row level security;
alter table teams                    enable row level security;
alter table team_members             enable row level security;
alter table child_teams              enable row level security;
alter table events                   enable row level security;
alter table carpool_legs             enable row level security;
alter table seats                    enable row level security;
alter table ride_status_events       enable row level security;
alter table sub_requests             enable row level security;
alter table sub_request_responses    enable row level security;
alter table notifications            enable row level security;
alter table chat_messages            enable row level security;
alter table schedule_sources         enable row level security;
alter table recurring_commitments    enable row level security;
alter table blackout_dates           enable row level security;
alter table notification_preferences enable row level security;
alter table auto_claim_rules         enable row level security;

-- ============================================================
-- Helpers
-- ============================================================

create or replace function auth_parent_id()
returns uuid
language sql
stable
as $$
  select id from parents where auth_user_id = auth.uid()
$$;

create or replace function team_ids_of_current_parent()
returns setof uuid
language sql
stable
security definer
set search_path = public
as $$
  select team_id
    from team_members
   where parent_id = auth_parent_id()
     and removed_at is null
$$;

-- ============================================================
-- parents
-- A parent can always read & update their own row. They can also
-- read other parents who share at least one team with them (so we
-- can show driver names, photos, phone numbers in the UI).
-- ============================================================

create policy "parents_select_self_or_teammates"
  on parents for select
  using (
    id = auth_parent_id()
    or exists (
      select 1
        from team_members tm_self
        join team_members tm_other on tm_self.team_id = tm_other.team_id
       where tm_self.parent_id  = auth_parent_id()
         and tm_other.parent_id = parents.id
         and tm_self.removed_at is null
         and tm_other.removed_at is null
    )
  );

create policy "parents_update_self"
  on parents for update
  using (id = auth_parent_id())
  with check (id = auth_parent_id());

-- INSERT happens via the signup edge function with service-role key.

-- ============================================================
-- children + parent_children
-- A parent can read children that are either (a) their own, or
-- (b) on a team they belong to. Insert/update/delete restricted
-- to a child's own parent.
-- ============================================================

create policy "children_select"
  on children for select
  using (
    exists (
      select 1 from parent_children pc
       where pc.child_id = children.id and pc.parent_id = auth_parent_id()
    )
    or exists (
      select 1 from child_teams ct
       where ct.child_id = children.id
         and ct.team_id  in (select team_ids_of_current_parent())
    )
  );

create policy "children_insert_own"
  on children for insert
  with check (true);  -- linked via parent_children below; row-only insert is fine

create policy "children_update_own"
  on children for update
  using (
    exists (
      select 1 from parent_children pc
       where pc.child_id = children.id and pc.parent_id = auth_parent_id()
    )
  );

create policy "parent_children_rw_self"
  on parent_children for all
  using (parent_id = auth_parent_id())
  with check (parent_id = auth_parent_id());

-- ============================================================
-- teams + team_members + child_teams
-- ============================================================

create policy "teams_select_member"
  on teams for select
  using (id in (select team_ids_of_current_parent()));

-- "I joined via invite code" creates the team_member row server-side via
-- a SECURITY DEFINER function (see signup helper). Direct INSERT is denied.

create policy "teams_update_admin"
  on teams for update
  using (
    exists (
      select 1 from team_members
       where team_id = teams.id
         and parent_id = auth_parent_id()
         and role = 'admin'
         and removed_at is null
    )
  );

create policy "team_members_select_own_teams"
  on team_members for select
  using (team_id in (select team_ids_of_current_parent()));

create policy "team_members_insert_self"
  on team_members for insert
  with check (parent_id = auth_parent_id());

-- Removing a member: only admins of that team can do it.
create policy "team_members_update_admin"
  on team_members for update
  using (
    exists (
      select 1 from team_members tm
       where tm.team_id   = team_members.team_id
         and tm.parent_id = auth_parent_id()
         and tm.role      = 'admin'
         and tm.removed_at is null
    )
  );

create policy "child_teams_rw_member"
  on child_teams for all
  using (team_id in (select team_ids_of_current_parent()))
  with check (team_id in (select team_ids_of_current_parent()));

-- ============================================================
-- events
-- ============================================================

create policy "events_select_team"
  on events for select
  using (team_id in (select team_ids_of_current_parent()));

create policy "events_insert_team"
  on events for insert
  with check (team_id in (select team_ids_of_current_parent()));

create policy "events_update_team"
  on events for update
  using (team_id in (select team_ids_of_current_parent()));

-- ============================================================
-- carpool_legs (no team_id directly; routed via events.team_id)
-- ============================================================

create policy "legs_select_via_event"
  on carpool_legs for select
  using (
    event_id in (
      select id from events where team_id in (select team_ids_of_current_parent())
    )
  );

create policy "legs_update_via_event"
  on carpool_legs for update
  using (
    event_id in (
      select id from events where team_id in (select team_ids_of_current_parent())
    )
  );

create policy "legs_insert_via_event"
  on carpool_legs for insert
  with check (
    event_id in (
      select id from events where team_id in (select team_ids_of_current_parent())
    )
  );

-- ============================================================
-- seats (routed via legs -> events -> team_id)
-- ============================================================

create policy "seats_select_via_leg"
  on seats for select
  using (
    leg_id in (
      select id from carpool_legs
       where event_id in (
         select id from events where team_id in (select team_ids_of_current_parent())
       )
    )
  );

create policy "seats_rw_via_leg"
  on seats for all
  using (
    leg_id in (
      select id from carpool_legs
       where event_id in (
         select id from events where team_id in (select team_ids_of_current_parent())
       )
    )
  );

-- ============================================================
-- ride_status_events
-- ============================================================

create policy "ride_status_select_team"
  on ride_status_events for select
  using (
    leg_id in (
      select id from carpool_legs
       where event_id in (
         select id from events where team_id in (select team_ids_of_current_parent())
       )
    )
  );

create policy "ride_status_insert_self"
  on ride_status_events for insert
  with check (parent_id = auth_parent_id());

-- ============================================================
-- sub_requests + responses
-- ============================================================

create policy "sub_requests_select_team"
  on sub_requests for select
  using (
    leg_id in (
      select id from carpool_legs
       where event_id in (
         select id from events where team_id in (select team_ids_of_current_parent())
       )
    )
  );

create policy "sub_requests_insert_self"
  on sub_requests for insert
  with check (requested_by = auth_parent_id());

create policy "sub_requests_update_team"
  on sub_requests for update
  using (
    leg_id in (
      select id from carpool_legs
       where event_id in (
         select id from events where team_id in (select team_ids_of_current_parent())
       )
    )
  );

create policy "sub_responses_select_team"
  on sub_request_responses for select
  using (
    sub_request_id in (
      select id from sub_requests
       where leg_id in (
         select id from carpool_legs
          where event_id in (
            select id from events where team_id in (select team_ids_of_current_parent())
          )
       )
    )
  );

create policy "sub_responses_insert_self"
  on sub_request_responses for insert
  with check (parent_id = auth_parent_id());

-- ============================================================
-- notifications, chat, schedule_sources, recurring, blackouts, prefs, auto_claim_rules
-- ============================================================

create policy "notifications_rw_self"
  on notifications for all
  using (parent_id = auth_parent_id())
  with check (parent_id = auth_parent_id());

create policy "chat_select_team"
  on chat_messages for select
  using (team_id in (select team_ids_of_current_parent()));

create policy "chat_insert_self"
  on chat_messages for insert
  with check (
    parent_id = auth_parent_id()
    and team_id in (select team_ids_of_current_parent())
  );

create policy "schedule_sources_rw_team"
  on schedule_sources for all
  using (team_id in (select team_ids_of_current_parent()))
  with check (team_id in (select team_ids_of_current_parent()));

create policy "recurring_rw_self"
  on recurring_commitments for all
  using (parent_id = auth_parent_id())
  with check (parent_id = auth_parent_id());

create policy "blackouts_rw_self"
  on blackout_dates for all
  using (parent_id = auth_parent_id())
  with check (parent_id = auth_parent_id());

create policy "notification_prefs_rw_self"
  on notification_preferences for all
  using (parent_id = auth_parent_id())
  with check (parent_id = auth_parent_id());

create policy "auto_claim_rw_self"
  on auto_claim_rules for all
  using (parent_id = auth_parent_id())
  with check (parent_id = auth_parent_id());
