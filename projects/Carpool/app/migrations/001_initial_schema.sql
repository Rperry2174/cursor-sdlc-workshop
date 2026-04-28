-- ============================================================
-- Carpool app — initial schema
-- Mirrors the table shapes already in src/data/store.js.
-- Apply this once on a fresh Supabase project, then 002_rls_policies.sql.
-- ============================================================

-- Supabase auth manages the auth.users table; we link parents to it via auth_user_id.
-- Every parent row should be created in the same transaction as auth.user signup.

create table parents (
  id              uuid primary key default gen_random_uuid(),
  auth_user_id    uuid unique references auth.users(id) on delete cascade,
  name            text not null,
  phone           text,
  avatar_color    text default 'green',
  photo_url       text,
  default_seats   int default 4,
  home_address    text,
  school_address  text,

  -- Self-attested driver verification (null = "I won't drive, coordinator only")
  driver_attestation jsonb,

  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create table children (
  id              uuid primary key default gen_random_uuid(),
  name            text not null,
  birthday        date,
  age             int,
  avatar_color    text,
  photo_url       text,
  school          text,
  position        text,
  created_at      timestamptz not null default now()
);

create table parent_children (
  parent_id  uuid not null references parents(id) on delete cascade,
  child_id   uuid not null references children(id) on delete cascade,
  primary key (parent_id, child_id)
);

create table teams (
  id                 uuid primary key default gen_random_uuid(),
  name               text not null,
  sport              text,
  age_group          text,
  season             text,
  invite_code        text unique not null,
  plan               text default 'free',
  stripe_customer_id text,
  created_at         timestamptz not null default now()
);

create table team_members (
  team_id          uuid not null references teams(id) on delete cascade,
  parent_id        uuid not null references parents(id) on delete cascade,
  role             text not null default 'member',  -- 'admin' | 'member'
  driver_approved  bool default true,
  removed_at       timestamptz,                     -- soft-remove for audit
  primary key (team_id, parent_id)
);

create table child_teams (
  team_id   uuid not null references teams(id) on delete cascade,
  child_id  uuid not null references children(id) on delete cascade,
  primary key (team_id, child_id)
);

create table events (
  id              uuid primary key default gen_random_uuid(),
  team_id         uuid references teams(id) on delete cascade,
  title           text not null,
  type            text,                              -- 'practice' | 'game' | 'imported' | …
  start_at        timestamptz not null,
  end_at          timestamptz,
  location        text,
  source          text default 'manual',
  source_uid      text,
  created_by      uuid references parents(id),
  invited_parent_ids uuid[],
  cancelled_at    timestamptz
);

create table carpool_legs (
  id                  uuid primary key default gen_random_uuid(),
  event_id            uuid not null references events(id) on delete cascade,
  direction           text not null,                  -- 'to_event' | 'from_event'
  departure_time      timestamptz not null,
  departure_location  text,
  arrival_location    text,
  driver_id           uuid references parents(id),
  seat_capacity       int default 4,
  notes               text,
  status              text not null default 'open',   -- 'open' | 'filled' | 'in_progress' | 'completed' | 'cancelled'
  claimed_at          timestamptz
);

create table seats (
  id          uuid primary key default gen_random_uuid(),
  leg_id      uuid not null references carpool_legs(id) on delete cascade,
  child_id    uuid not null references children(id) on delete cascade,
  added_by    uuid references parents(id),
  created_at  timestamptz not null default now(),
  unique (leg_id, child_id)
);

create table ride_status_events (
  id          uuid primary key default gen_random_uuid(),
  leg_id      uuid not null references carpool_legs(id) on delete cascade,
  parent_id   uuid references parents(id),
  status      text not null,                          -- 'en_route' | 'arrived_pickup' | 'running_late' | …
  metadata    jsonb,
  created_at  timestamptz not null default now()
);

create table sub_requests (
  id              uuid primary key default gen_random_uuid(),
  leg_id          uuid not null references carpool_legs(id) on delete cascade,
  requested_by    uuid not null references parents(id),
  reason          text,
  mode            text default 'broadcast',
  target_parent_id uuid references parents(id),
  expires_at      timestamptz,
  status          text not null default 'open',       -- 'open' | 'accepted' | 'cancelled'
  created_at      timestamptz not null default now()
);

create table sub_request_responses (
  id              uuid primary key default gen_random_uuid(),
  sub_request_id  uuid not null references sub_requests(id) on delete cascade,
  parent_id       uuid not null references parents(id),
  response        text not null,                      -- 'accepted' | 'declined'
  created_at      timestamptz not null default now()
);

create table notifications (
  id          uuid primary key default gen_random_uuid(),
  parent_id   uuid not null references parents(id) on delete cascade,
  kind        text not null,
  body        text,
  leg_id      uuid references carpool_legs(id),
  read_at     timestamptz,
  created_at  timestamptz not null default now()
);

create table chat_messages (
  id          uuid primary key default gen_random_uuid(),
  team_id     uuid not null references teams(id) on delete cascade,
  parent_id   uuid not null references parents(id),
  body        text not null,
  created_at  timestamptz not null default now()
);

create table schedule_sources (
  id          uuid primary key default gen_random_uuid(),
  team_id     uuid not null references teams(id) on delete cascade,
  kind        text not null,                          -- 'gamechanger' | 'ics' | 'sample' | …
  url         text,
  label       text,
  last_synced_at timestamptz,
  created_at  timestamptz not null default now()
);

create table recurring_commitments (
  id          uuid primary key default gen_random_uuid(),
  parent_id   uuid not null references parents(id) on delete cascade,
  team_id     uuid not null references teams(id) on delete cascade,
  weekday     int not null,                           -- 0=Sunday … 6=Saturday
  direction   text not null,                          -- 'to_event' | 'from_event'
  active      bool default true,
  created_at  timestamptz not null default now()
);

create table blackout_dates (
  id          uuid primary key default gen_random_uuid(),
  parent_id   uuid not null references parents(id) on delete cascade,
  date        date not null,
  reason      text
);

create table notification_preferences (
  parent_id        uuid primary key references parents(id) on delete cascade,
  push_enabled     bool default true,
  sms_enabled      bool default true,
  digest_time      text default '20:00',
  quiet_hours_start text,
  quiet_hours_end   text
);

create table auto_claim_rules (
  id          uuid primary key default gen_random_uuid(),
  parent_id   uuid not null references parents(id) on delete cascade,
  team_id     uuid not null references teams(id) on delete cascade,
  weekday     int not null,
  direction   text not null,
  active      bool default true,
  created_at  timestamptz not null default now()
);

-- ============================================================
-- Indexes — every query in store.js boils down to "by team_id"
-- or "by parent_id within a team". These cover them.
-- ============================================================

create index events_team_start_idx     on events (team_id, start_at);
create index legs_event_idx            on carpool_legs (event_id);
create index legs_driver_dep_idx       on carpool_legs (driver_id, departure_time);
create index legs_open_idx             on carpool_legs (event_id, status) where driver_id is null;
create index seats_leg_idx             on seats (leg_id);
create index seats_child_idx           on seats (child_id);
create index team_members_parent_idx   on team_members (parent_id);
create index team_members_team_idx     on team_members (team_id);
create index parent_children_parent_idx on parent_children (parent_id);
create index parent_children_child_idx  on parent_children (child_id);
create index sub_requests_leg_idx      on sub_requests (leg_id, status);
create index notifications_parent_idx  on notifications (parent_id, created_at desc);
create index chat_team_idx             on chat_messages (team_id, created_at desc);
create index ride_status_leg_idx       on ride_status_events (leg_id, created_at desc);
create index schedule_sources_team_idx on schedule_sources (team_id);
