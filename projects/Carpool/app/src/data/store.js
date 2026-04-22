/**
 * Local-first data store for the Carpool prototype.
 *
 * Tables mirror the Supabase schema in the production blueprint:
 *   parents, children, parent_children, teams, team_members,
 *   child_teams, events, carpool_legs, seats, ride_status_events,
 *   sub_requests, sub_request_responses, notifications.
 *
 * Persistence: localStorage, single key. Swap this module's read/write
 * for Supabase queries when porting to production.
 */

import { seed } from './seed.js';

const STORAGE_KEY = 'carpool.db.v1';
const SESSION_KEY = 'carpool.session.v1';
const ONBOARD_KEY = 'carpool.onboarded.v1';

const subscribers = new Set();
let cache = null;

function load() {
  if (cache) return cache;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      cache = JSON.parse(raw);
      migrate(cache);
      // Pre-existing demo data should be treated as already onboarded so the
      // wizard doesn't surprise returning users. Only an explicit "Start fresh"
      // (or first-ever load + onboarding completion) forces the wizard.
      if (cache.parents?.length && !localStorage.getItem(ONBOARD_KEY)) {
        localStorage.setItem(ONBOARD_KEY, 'true');
      }
      return cache;
    }
  } catch {
    // fall through to seed
  }
  cache = seed();
  // First-ever load: treat the seed as a guided demo, mark onboarded so we
  // don't force the wizard. Users opt in to the wizard via "Start fresh".
  localStorage.setItem(ONBOARD_KEY, 'true');
  persist();
  return cache;
}

// Add any new tables introduced after the original seed without wiping demo data.
function migrate(d) {
  const fresh = seed();
  const ensure = (key) => {
    if (!Array.isArray(d[key]) && !d[key]) d[key] = fresh[key];
  };
  ensure('recurring_commitments');
  ensure('blackout_dates');
  ensure('chat_messages');
  ensure('notification_preferences');
  ensure('schedule_sources');
  ensure('auto_claim_rules');
  if (!d.app_config) d.app_config = fresh.app_config;
}

function persist() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cache));
  for (const fn of subscribers) fn();
}

export function subscribe(fn) {
  subscribers.add(fn);
  return () => subscribers.delete(fn);
}

export function resetDb() {
  cache = seed();
  // Re-seeded demo data should stay "already onboarded" so the wizard
  // doesn't pop up. Use startFreshOnboarding() to invoke the wizard.
  localStorage.setItem(ONBOARD_KEY, 'true');
  persist();
}

/* ---------- onboarding ---------- */

export function isOnboarded() {
  return localStorage.getItem(ONBOARD_KEY) === 'true';
}

export function markOnboarded() {
  localStorage.setItem(ONBOARD_KEY, 'true');
  for (const fn of subscribers) fn();
}

const GC_HINT_KEY = 'carpool.hint.gamechanger';

// True when the post-onboarding GameChanger nudge should be shown for this
// parent: they explicitly deferred during onboarding, they have a team, and
// they haven't connected a real (non-sample) feed yet. Used by both the home
// screen banner and the Profile-tab pulse coach-mark.
export function shouldShowGcHint(parentId) {
  if (typeof window === 'undefined') return false;
  if (localStorage.getItem(GC_HINT_KEY) !== 'show') return false;
  if (!parentId) return false;
  const data = load();
  const teamIds = data.team_members
    .filter((m) => m.parent_id === parentId)
    .map((m) => m.team_id);
  if (teamIds.length === 0) return false;
  const team = data.teams.find((t) => teamIds.includes(t.id));
  if (!team) return false;
  const sources = data.schedule_sources.filter((s) => s.team_id === team.id);
  return !sources.some((s) => s.kind !== 'sample');
}

export function dismissGcHint() {
  localStorage.setItem(GC_HINT_KEY, 'dismissed');
  for (const fn of subscribers) fn();
}

// Wipe the database and session so the wizard can start from a true blank slate.
export function startFreshOnboarding() {
  cache = {
    parents: [],
    children: [],
    parent_children: [],
    teams: [],
    team_members: [],
    child_teams: [],
    events: [],
    carpool_legs: [],
    seats: [],
    ride_status_events: [],
    sub_requests: [],
    sub_request_responses: [],
    notifications: [],
    recurring_commitments: [],
    blackout_dates: [],
    chat_messages: [],
    notification_preferences: [],
    schedule_sources: [],
    auto_claim_rules: [],
    app_config: { weather_alerts: true },
  };
  localStorage.removeItem(SESSION_KEY);
  localStorage.removeItem(ONBOARD_KEY);
  persist();
}

/**
 * Atomically create the onboarding parent + their kids + (optionally) a team they
 * either created or joined via invite code, set them as the current session,
 * and mark onboarding complete. Returns { parent, team }.
 */
export function completeOnboarding({ phone, name, avatarColor, kids, team }) {
  const data = load();
  const parentId = newId('p');
  const parent = {
    id: parentId,
    name: name.trim(),
    phone: phone.trim(),
    avatar_color: avatarColor || 'green',
    default_seats: 4,
    home_address: '',
    school_address: '',
  };
  data.parents.push(parent);

  const createdKids = [];
  for (const k of kids || []) {
    if (!k.name?.trim()) continue;
    const childId = newId('c');
    const ageFromBirthday = k.birthday ? ageFromDob(k.birthday) : null;
    const child = {
      id: childId,
      name: k.name.trim(),
      birthday: k.birthday || null,
      age: ageFromBirthday ?? (Number(k.age) || null),
      avatar_color: k.color || avatarColor || 'green',
      school: k.school?.trim() || '',
      position: k.position?.trim() || '',
    };
    data.children.push(child);
    data.parent_children.push({ parent_id: parentId, child_id: childId });
    createdKids.push(child);
  }

  let resolvedTeam = null;
  if (team?.mode === 'join' && team.inviteCode) {
    const code = team.inviteCode.trim().toUpperCase();
    const existing = data.teams.find((t) => (t.invite_code || '').toUpperCase() === code);
    if (existing) {
      resolvedTeam = existing;
      const already = data.team_members.find(
        (m) => m.team_id === existing.id && m.parent_id === parentId,
      );
      if (!already) {
        data.team_members.push({
          team_id: existing.id,
          parent_id: parentId,
          role: 'member',
          driver_approved: true,
        });
      }
      for (const c of createdKids) {
        const linked = data.child_teams.find(
          (ct) => ct.team_id === existing.id && ct.child_id === c.id,
        );
        if (!linked) data.child_teams.push({ team_id: existing.id, child_id: c.id });
      }
    }
  } else if (team?.mode === 'create' && team.name?.trim()) {
    const teamId = newId('t');
    const code = generateInviteCode(team.name);
    resolvedTeam = {
      id: teamId,
      name: team.name.trim(),
      sport: (team.sport || 'Activity').trim(),
      age_group: '',
      season: (team.season || 'Spring 2026').trim(),
      invite_code: code,
      plan: 'free',
      stripe_customer_id: null,
      created_at: nowIso(),
    };
    data.teams.push(resolvedTeam);
    data.team_members.push({
      team_id: teamId,
      parent_id: parentId,
      role: 'admin',
      driver_approved: true,
    });
    for (const c of createdKids) {
      data.child_teams.push({ team_id: teamId, child_id: c.id });
    }
  }

  persist();
  setCurrentParentId(parentId);
  // NOTE: we intentionally do NOT call markOnboarded() here. The wizard sets
  // the flag itself once the user actually leaves (Done step or "take me to
  // the import screen"). Otherwise flipping the gate mid-step unmounts the
  // wizard while async work (e.g. ICS sync) is still in flight.
  return { parent, team: resolvedTeam };
}

function generateInviteCode(name) {
  const slug = (name || '')
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '')
    .slice(0, 6) || 'GROUP';
  const num = Math.floor(1000 + Math.random() * 9000);
  return `${slug}-${num}`;
}

export function db() {
  return load();
}

/* ---------- session (which parent is "logged in") ---------- */

export function getCurrentParentId() {
  const stored = localStorage.getItem(SESSION_KEY);
  if (stored) return stored;
  const first = load().parents[0]?.id;
  if (first) localStorage.setItem(SESSION_KEY, first);
  return first;
}

export function setCurrentParentId(parentId) {
  localStorage.setItem(SESSION_KEY, parentId);
  for (const fn of subscribers) fn();
}

export function getCurrentParent() {
  const id = getCurrentParentId();
  return load().parents.find((p) => p.id === id);
}

/* ---------- queries ---------- */

export function listParents() {
  return load().parents;
}

export function getParent(parentId) {
  return load().parents.find((p) => p.id === parentId);
}

export function getKidsForParent(parentId) {
  const data = load();
  const childIds = data.parent_children
    .filter((pc) => pc.parent_id === parentId)
    .map((pc) => pc.child_id);
  return data.children.filter((c) => childIds.includes(c.id));
}

export function getCoParentsForChild(childId) {
  const data = load();
  const parentIds = data.parent_children
    .filter((pc) => pc.child_id === childId)
    .map((pc) => pc.parent_id);
  return data.parents.filter((p) => parentIds.includes(p.id));
}

export function getTeam(teamId) {
  return load().teams.find((t) => t.id === teamId) || null;
}

export function getTeamsForParent(parentId) {
  const data = load();
  const teamIds = data.team_members
    .filter((tm) => tm.parent_id === parentId)
    .map((tm) => tm.team_id);
  return data.teams.filter((t) => teamIds.includes(t.id));
}

export function getKidsOnTeam(teamId) {
  const data = load();
  const childIds = data.child_teams
    .filter((ct) => ct.team_id === teamId)
    .map((ct) => ct.child_id);
  return data.children.filter((c) => childIds.includes(c.id));
}

export function getInvitablePeopleForParent(parentId) {
  const data = load();
  const seen = new Set([parentId]);
  const out = [];
  for (const t of getTeamsForParent(parentId)) {
    for (const m of getMembersForTeam(t.id)) {
      if (!seen.has(m.id)) {
        seen.add(m.id);
        out.push(m);
      }
    }
  }
  for (const k of getKidsForParent(parentId)) {
    for (const cp of getCoParentsForChild(k.id)) {
      if (!seen.has(cp.id)) {
        seen.add(cp.id);
        out.push(cp);
      }
    }
  }
  return out;
}

export function getMembersForTeam(teamId) {
  const data = load();
  const parentIds = data.team_members
    .filter((tm) => tm.team_id === teamId)
    .map((tm) => tm.parent_id);
  return data.parents.filter((p) => parentIds.includes(p.id));
}

export function getEventsForParent(parentId, { from, to } = {}) {
  const data = load();
  const teams = getTeamsForParent(parentId).map((t) => t.id);
  let events = data.events.filter(
    (e) =>
      (e.team_id && teams.includes(e.team_id)) ||
      e.created_by === parentId ||
      (Array.isArray(e.invited_parent_ids) && e.invited_parent_ids.includes(parentId)),
  );
  if (from) events = events.filter((e) => e.start_at >= from);
  if (to) events = events.filter((e) => e.start_at <= to);
  return events.sort((a, b) => a.start_at.localeCompare(b.start_at));
}

export function getEventsByDate(parentId, dateStr) {
  return getEventsForParent(parentId).filter((e) => e.start_at.slice(0, 10) === dateStr);
}

export function getEvent(eventId) {
  return load().events.find((e) => e.id === eventId);
}

export function getLegsForEvent(eventId) {
  return load()
    .carpool_legs.filter((l) => l.event_id === eventId)
    .sort((a, b) => (a.direction === 'to_event' ? -1 : 1));
}

export function getLeg(legId) {
  return load().carpool_legs.find((l) => l.id === legId);
}

export function getSeatsForLeg(legId) {
  return load().seats.filter((s) => s.leg_id === legId);
}

export function getKidsInLeg(legId) {
  const data = load();
  const childIds = data.seats.filter((s) => s.leg_id === legId).map((s) => s.child_id);
  return data.children.filter((c) => childIds.includes(c.id));
}

/**
 * Find upcoming seats for any of this parent's kids — used by the
 * "Kid out today" quick action. Groups by event so drop-off + pick-up
 * appear together.
 */
export function getUpcomingSeatsForMyKids(parentId, hoursAhead = 36) {
  const data = load();
  const myKidIds = getKidsForParent(parentId).map((k) => k.id);
  if (myKidIds.length === 0) return [];
  const now = Date.now();
  const horizon = now + hoursAhead * 60 * 60 * 1000;

  const rows = [];
  for (const seat of data.seats) {
    if (!myKidIds.includes(seat.child_id)) continue;
    const leg = data.carpool_legs.find((l) => l.id === seat.leg_id);
    if (!leg) continue;
    const t = new Date(leg.departure_time).getTime();
    if (t < now - 30 * 60 * 1000 || t > horizon) continue;
    if (leg.status === 'cancelled' || leg.status === 'completed') continue;
    const event = data.events.find((e) => e.id === leg.event_id);
    if (!event) continue;
    const child = data.children.find((c) => c.id === seat.child_id);
    const driver = leg.driver_id ? data.parents.find((p) => p.id === leg.driver_id) : null;
    rows.push({ seat, leg, event, child, driver });
  }
  rows.sort((a, b) => a.leg.departure_time.localeCompare(b.leg.departure_time));
  return rows;
}

/**
 * Find upcoming legs my kid could ride in — used by the "Add my kid"
 * quick action. Returns rows of { leg, event, kid, driver, seatsLeft }
 * for any combination where seats are available and the kid isn't
 * already on board.
 */
export function getJoinableLegsForMyKids(parentId, hoursAhead = 14 * 24) {
  const data = load();
  const myKids = getKidsForParent(parentId);
  if (myKids.length === 0) return [];

  const now = Date.now();
  const horizon = now + hoursAhead * 60 * 60 * 1000;
  const visibleEvents = new Set(
    getEventsForParent(parentId, {
      from: new Date(now).toISOString(),
      to: new Date(horizon).toISOString(),
    }).map((e) => e.id),
  );

  const rows = [];
  for (const leg of data.carpool_legs) {
    if (!visibleEvents.has(leg.event_id)) continue;
    const t = new Date(leg.departure_time).getTime();
    if (t < now + 30 * 60 * 1000 || t > horizon) continue;
    if (leg.status === 'cancelled' || leg.status === 'completed' || leg.status === 'in_progress') {
      continue;
    }

    const seats = data.seats.filter((s) => s.leg_id === leg.id);
    const seatsLeft = (leg.seat_capacity || 0) - seats.length;
    if (seatsLeft <= 0 && leg.driver_id) continue;

    const event = data.events.find((e) => e.id === leg.event_id);
    if (!event) continue;
    const driver = leg.driver_id ? data.parents.find((p) => p.id === leg.driver_id) : null;

    for (const kid of myKids) {
      if (seats.some((s) => s.child_id === kid.id)) continue;
      const kidOnTeam =
        !leg.event_id || !event.team_id
          ? true
          : data.child_teams.some((ct) => ct.team_id === event.team_id && ct.child_id === kid.id);
      if (!kidOnTeam && !event.invited_parent_ids?.includes(parentId)) continue;
      rows.push({ leg, event, kid, driver, seatsLeft });
    }
  }

  rows.sort((a, b) => a.leg.departure_time.localeCompare(b.leg.departure_time));
  return rows;
}

export function getNotificationsForParent(parentId) {
  return load()
    .notifications.filter((n) => n.recipient_id === parentId)
    .sort((a, b) => b.created_at.localeCompare(a.created_at));
}

export function unreadCount(parentId) {
  return load().notifications.filter((n) => n.recipient_id === parentId && !n.read_at).length;
}

export function getOpenLegsForParent(parentId, daysAhead = 14) {
  const teams = getTeamsForParent(parentId).map((t) => t.id);
  const data = load();
  const now = new Date().toISOString();
  const horizon = new Date(Date.now() + daysAhead * 86400000).toISOString();
  const eventIds = data.events
    .filter((e) => teams.includes(e.team_id) && e.start_at >= now && e.start_at <= horizon)
    .map((e) => e.id);
  return data.carpool_legs.filter(
    (l) => eventIds.includes(l.event_id) && l.status === 'open' && !l.driver_id,
  );
}

/* ---------- mutations ---------- */

let counter = Date.now();
export function newId(prefix = 'id') {
  counter += 1;
  return `${prefix}_${counter.toString(36)}`;
}

function nowIso() {
  return new Date().toISOString();
}

export function ageFromDob(birthday) {
  if (!birthday) return null;
  const dob = new Date(birthday + 'T00:00:00');
  if (Number.isNaN(dob.getTime())) return null;
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const m = today.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age -= 1;
  return age >= 0 ? age : null;
}

function pushNotif(recipient_id, kind, body, leg_id = null) {
  const id = newId('notif');
  cache.notifications.push({
    id,
    recipient_id,
    kind,
    body,
    leg_id,
    created_at: nowIso(),
    read_at: null,
  });
  return id;
}

function pushStatus(leg_id, kind, actor_id, payload = {}) {
  const id = newId('rse');
  cache.ride_status_events.push({
    id,
    leg_id,
    kind,
    actor_id,
    payload,
    created_at: nowIso(),
  });
  return id;
}

function removeNotifs(ids) {
  if (!ids?.length) return;
  cache.notifications = cache.notifications.filter((n) => !ids.includes(n.id));
}

function removeStatusEvents(ids) {
  if (!ids?.length) return;
  cache.ride_status_events = cache.ride_status_events.filter((s) => !ids.includes(s.id));
}

function removeSeats(ids) {
  if (!ids?.length) return;
  cache.seats = cache.seats.filter((s) => !ids.includes(s.id));
}

export function markNotificationsRead(parentId) {
  const t = nowIso();
  for (const n of cache.notifications) {
    if (n.recipient_id === parentId && !n.read_at) n.read_at = t;
  }
  persist();
}

/**
 * Mutates the leg through a transactional pipeline. Pass a function that
 * receives the current leg object and either returns a patched leg or throws.
 * The mutator should not write `cache` directly; just return the new leg.
 */
function updateLeg(legId, mutator) {
  load();
  const idx = cache.carpool_legs.findIndex((l) => l.id === legId);
  if (idx === -1) throw new Error('Leg not found');
  const next = mutator({ ...cache.carpool_legs[idx] });
  cache.carpool_legs[idx] = next;
  return next;
}

/* ---------- recurring commitments ---------- */

export function getRecurringCommitmentsForParent(parentId) {
  const data = load();
  if (!data.recurring_commitments) return [];
  return data.recurring_commitments.filter((rc) => rc.parent_id === parentId);
}

export function addRecurringCommitment(rc) {
  const data = load();
  data.recurring_commitments = data.recurring_commitments || [];
  const full = { id: newId('rc'), paused: false, created_at: nowIso(), ...rc };
  data.recurring_commitments.push(full);
  persist();
  return full;
}

export function setRecurringPaused(rcId, paused) {
  const data = load();
  const rc = data.recurring_commitments?.find((r) => r.id === rcId);
  if (!rc) return null;
  rc.paused = paused;
  persist();
  return rc;
}

export function deleteRecurringCommitment(rcId) {
  const data = load();
  if (!data.recurring_commitments) return;
  data.recurring_commitments = data.recurring_commitments.filter((r) => r.id !== rcId);
  persist();
}

/* ---------- blackout dates ---------- */

export function getBlackoutsForParent(parentId) {
  const data = load();
  return (data.blackout_dates || []).filter((b) => b.parent_id === parentId);
}

export function addBlackout(b) {
  const data = load();
  data.blackout_dates = data.blackout_dates || [];
  const full = { id: newId('bo'), created_at: nowIso(), ...b };
  data.blackout_dates.push(full);
  persist();
  return full;
}

export function deleteBlackout(boId) {
  const data = load();
  data.blackout_dates = (data.blackout_dates || []).filter((b) => b.id !== boId);
  persist();
}

/* ---------- chat ---------- */

export function getChatMessages(teamId) {
  const data = load();
  return (data.chat_messages || [])
    .filter((m) => m.team_id === teamId)
    .sort((a, b) => a.created_at.localeCompare(b.created_at));
}

export function postChatMessage({ team_id, author_id, body, kind = 'text', pinned_event_id = null }) {
  const data = load();
  data.chat_messages = data.chat_messages || [];
  const msg = {
    id: newId('msg'),
    team_id,
    author_id,
    kind,
    body,
    pinned_event_id,
    created_at: nowIso(),
  };
  data.chat_messages.push(msg);
  persist();
  return msg;
}

/* ---------- notification preferences ---------- */

export function getNotificationPrefs(parentId) {
  const data = load();
  let prefs = (data.notification_preferences || []).find((p) => p.parent_id === parentId);
  if (!prefs) {
    prefs = {
      parent_id: parentId,
      style: 'balanced',
      channels: { push: true, sms: false, email: false },
      by_type: {},
      by_team: {},
      quiet_hours: { enabled: true, start: '21:00', end: '07:00' },
      always_alert_my_kid: true,
      snoozed_until: null,
      wizard_completed: false,
    };
    data.notification_preferences = data.notification_preferences || [];
    data.notification_preferences.push(prefs);
    persist();
  }
  return prefs;
}

export function updateNotificationPrefs(parentId, patch) {
  const data = load();
  data.notification_preferences = data.notification_preferences || [];
  let prefs = data.notification_preferences.find((p) => p.parent_id === parentId);
  if (!prefs) {
    prefs = getNotificationPrefs(parentId);
  }
  Object.assign(prefs, patch);
  persist();
  return prefs;
}

/* ---------- sub requests ---------- */

export function getOpenSubRequestsForTeam(teamId) {
  const data = load();
  return (data.sub_requests || [])
    .filter((s) => {
      if (s.status !== 'open') return false;
      const leg = data.carpool_legs.find((l) => l.id === s.leg_id);
      if (!leg) return false;
      const evt = data.events.find((e) => e.id === leg.event_id);
      return evt?.team_id === teamId;
    })
    .sort((a, b) => a.created_at.localeCompare(b.created_at));
}

export function getSubRequest(subRequestId) {
  const data = load();
  return (data.sub_requests || []).find((s) => s.id === subRequestId);
}

export function getOpenSubRequestForLeg(legId) {
  const data = load();
  return (data.sub_requests || []).find((s) => s.leg_id === legId && s.status === 'open');
}

/* ---------- aggregate views ---------- */

export function getSeasonBalance(teamId) {
  const data = load();
  const memberIds = data.team_members
    .filter((tm) => tm.team_id === teamId)
    .map((tm) => tm.parent_id);
  const teamLegIds = new Set(
    data.carpool_legs
      .filter((l) => {
        const e = data.events.find((ev) => ev.id === l.event_id);
        return e?.team_id === teamId;
      })
      .map((l) => l.id),
  );
  const counts = {};
  for (const id of memberIds) counts[id] = { driven: 0, requested: 0, scheduled: 0 };
  for (const l of data.carpool_legs) {
    if (!teamLegIds.has(l.id)) continue;
    if (!l.driver_id || !counts[l.driver_id]) continue;
    if (l.status === 'completed') counts[l.driver_id].driven += 1;
    else if (l.status === 'filled' || l.status === 'in_progress') counts[l.driver_id].scheduled += 1;
  }
  for (const sub of data.sub_requests || []) {
    if (counts[sub.requested_by]) counts[sub.requested_by].requested += 1;
  }
  return counts;
}

/* ---------- one-off carpools ---------- */

/**
 * Create an ad-hoc carpool from the home-screen "Create a carpool" flow.
 *
 * Spawns one event + two carpool_legs (drop-off + pick-up). The creator is
 * the admin owner. Other parents can be invited with a per-parent role
 * ('driver' or 'rider'). The creator can pre-claim either leg as the driver
 * and pre-seat any of their own kids.
 */
export function createOneOffCarpool({
  creator_id,
  team_id = null,
  name,
  location,
  date,
  drop_off_time,
  pick_up_time,
  pickup_from = '',
  seat_capacity = 4,
  kid_ids = [],
  invitees = [],
  driving_drop_off = false,
  driving_pick_up = false,
  notes = '',
}) {
  const data = load();
  const eventId = newId('evt');

  const startIso = `${date}T${drop_off_time || '09:00'}:00`;
  const endIso = `${date}T${pick_up_time || '11:00'}:00`;
  const startUtc = new Date(startIso).toISOString();
  const endUtc = new Date(endIso).toISOString();

  const permissions = { [creator_id]: 'admin' };
  for (const inv of invitees) {
    permissions[inv.parent_id] = inv.role || 'rider';
  }

  data.events.push({
    id: eventId,
    title: name,
    type: 'one_off',
    start_at: startUtc,
    end_at: endUtc,
    location,
    team_id,
    source: 'manual',
    source_uid: null,
    cancelled_at: null,
    created_by: creator_id,
    invited_parent_ids: invitees.map((i) => i.parent_id),
    permissions,
    notes,
  });

  const toLegId = newId('leg');
  data.carpool_legs.push({
    id: toLegId,
    event_id: eventId,
    direction: 'to_event',
    departure_time: startUtc,
    departure_location: pickup_from || 'TBD',
    arrival_location: location,
    driver_id: driving_drop_off ? creator_id : null,
    seat_capacity,
    notes: '',
    status: driving_drop_off ? 'filled' : 'open',
    claimed_at: driving_drop_off ? nowIso() : null,
  });

  const fromLegId = newId('leg');
  data.carpool_legs.push({
    id: fromLegId,
    event_id: eventId,
    direction: 'from_event',
    departure_time: endUtc,
    departure_location: location,
    arrival_location: pickup_from || 'Home',
    driver_id: driving_pick_up ? creator_id : null,
    seat_capacity,
    notes: '',
    status: driving_pick_up ? 'filled' : 'open',
    claimed_at: driving_pick_up ? nowIso() : null,
  });

  for (const childId of kid_ids) {
    if (driving_drop_off) {
      data.seats.push({
        id: newId('seat'),
        leg_id: toLegId,
        child_id: childId,
        added_by: creator_id,
        created_at: nowIso(),
      });
    }
    if (driving_pick_up) {
      data.seats.push({
        id: newId('seat'),
        leg_id: fromLegId,
        child_id: childId,
        added_by: creator_id,
        created_at: nowIso(),
      });
    }
  }

  const me = data.parents.find((p) => p.id === creator_id);
  for (const inv of invitees) {
    pushNotif(
      inv.parent_id,
      'carpool_invite',
      `${me?.name?.split(' ')[0]} invited you to "${name}" — tap to RSVP.`,
      toLegId,
    );
  }

  persist();
  return { event_id: eventId, to_leg_id: toLegId, from_leg_id: fromLegId };
}

/* ---------- schedule sources (calendar feeds) ---------- */

export function getSourcesForTeam(teamId) {
  return load().schedule_sources.filter((s) => s.team_id === teamId);
}

export function getSource(sourceId) {
  return load().schedule_sources.find((s) => s.id === sourceId) || null;
}

export function addScheduleSource({ team_id, name, kind, url, default_legs }) {
  const data = load();
  const src = {
    id: newId('src'),
    team_id,
    name: name || 'Untitled feed',
    kind, // 'webcal' | 'ics_url' | 'sample'
    url: url || null,
    default_legs: default_legs || {
      drop_off_minutes_before: 15,
      pick_up_minutes_after: 0,
    },
    last_synced_at: null,
    last_event_count: 0,
    last_status: 'pending',
    last_error: null,
    created_at: nowIso(),
  };
  data.schedule_sources.push(src);
  persist();
  return src;
}

export function updateScheduleSource(sourceId, patch) {
  const data = load();
  const src = data.schedule_sources.find((s) => s.id === sourceId);
  if (!src) return null;
  Object.assign(src, patch);
  persist();
  return src;
}

export function removeScheduleSource(sourceId) {
  const data = load();
  data.schedule_sources = data.schedule_sources.filter((s) => s.id !== sourceId);
  persist();
}

/* ---------- auto-claim rules ---------- */

/**
 * A rule auto-claims any open leg on `weekday` (0=Sun..6=Sat) matching
 * `direction` ('to_event'|'from_event'|'any') for the parent's specified
 * team (or any team when team_id is null).
 *
 * Rules are evaluated when the parent opens the OpenShifts screen, after
 * a calendar sync, and after a release-leg fires the broadcast sub-request.
 */
export function getAutoClaimRules(parentId) {
  const data = load();
  return (data.auto_claim_rules || [])
    .filter((r) => r.parent_id === parentId)
    .sort((a, b) => a.created_at.localeCompare(b.created_at));
}

export function addAutoClaimRule(parentId, { team_id = null, weekday, direction = 'any' }) {
  const data = load();
  const rule = {
    id: newId('acr'),
    parent_id: parentId,
    team_id,
    weekday,
    direction,
    enabled: true,
    created_at: new Date().toISOString(),
  };
  data.auto_claim_rules.push(rule);
  persist();
  return rule;
}

export function toggleAutoClaimRule(ruleId) {
  const data = load();
  const r = data.auto_claim_rules.find((x) => x.id === ruleId);
  if (!r) return null;
  r.enabled = !r.enabled;
  persist();
  return r;
}

export function removeAutoClaimRule(ruleId) {
  const data = load();
  data.auto_claim_rules = data.auto_claim_rules.filter((r) => r.id !== ruleId);
  persist();
}

/* ---------- open seats ---------- */

/**
 * Legs where someone else is driving and one of my kids isn't on board yet
 * but a seat is available. Powers the "Open seats" tab on Open Shifts.
 */
export function getOpenSeatsForMyKids(parentId, daysAhead = 21) {
  const data = load();
  const myKids = getKidsForParent(parentId);
  if (myKids.length === 0) return [];
  const myKidIds = new Set(myKids.map((k) => k.id));

  const teams = getTeamsForParent(parentId).map((t) => t.id);
  const now = Date.now();
  const horizon = now + daysAhead * 86400000;

  const rows = [];
  for (const leg of data.carpool_legs) {
    if (leg.status !== 'filled' && leg.status !== 'in_progress') continue;
    if (!leg.driver_id || leg.driver_id === parentId) continue;
    const t = new Date(leg.departure_time).getTime();
    if (t < now || t > horizon) continue;

    const event = data.events.find((e) => e.id === leg.event_id);
    if (!event) continue;
    if (event.team_id && !teams.includes(event.team_id)) continue;

    const seats = data.seats.filter((s) => s.leg_id === leg.id);
    const seatsLeft = (leg.seat_capacity || 0) - seats.length;
    if (seatsLeft <= 0) continue;

    const driver = data.parents.find((p) => p.id === leg.driver_id);

    for (const kid of myKids) {
      if (seats.some((s) => s.child_id === kid.id)) continue;
      const kidOnTeam =
        !event.team_id ||
        data.child_teams.some((ct) => ct.team_id === event.team_id && ct.child_id === kid.id);
      if (!kidOnTeam) continue;
      // Don't surface a kid that's not even on the relevant team.
      if (!myKidIds.has(kid.id)) continue;
      rows.push({ leg, event, kid, driver, seatsLeft });
    }
  }

  rows.sort((a, b) => a.leg.departure_time.localeCompare(b.leg.departure_time));
  return rows;
}

/* exported here so lifecycle.js can use them without circular import */
export const _internals = {
  load,
  persist,
  cache: () => cache,
  pushNotif,
  pushStatus,
  removeNotifs,
  removeStatusEvents,
  removeSeats,
  updateLeg,
  newId,
  nowIso,
};
