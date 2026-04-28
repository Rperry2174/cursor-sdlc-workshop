/**
 * Leg lifecycle rules from §11 of the production blueprint.
 *
 * These are intentionally pulled into their own module so the same
 * decisions move 1:1 to Postgres triggers / RPC functions when the
 * data layer is swapped to Supabase.
 */

import {
  db,
  getLeg,
  getSeatsForLeg,
  getKidsInLeg,
  getCoParentsForChild,
  getMembersForTeam,
  getEvent,
  getParent,
  addRecurringCommitment,
  postChatMessage,
  updateScheduleSource,
  getAutoClaimRules,
  getOpenLegsForParent,
  _internals,
} from './store.js';
import { parseIcs } from './ics.js';
import { capture } from './analytics.js';

const {
  persist,
  pushNotif,
  pushStatus,
  removeNotifs,
  removeStatusEvents,
  updateLeg,
  newId,
  nowIso,
} = _internals;

/* ---------- helpers ---------- */

function minutesUntil(iso) {
  return (new Date(iso).getTime() - Date.now()) / 60000;
}

function teamOf(leg) {
  const evt = getEvent(leg.event_id);
  return evt?.team_id;
}

/* ---------- §11.1 — claim conflicts ---------- */

/**
 * Claim a leg as driver. Returns { ok: true, leg } or { ok: false, reason, currentDriver }.
 *
 * Tie-break rule: if the leg is already claimed but the existing driver
 * claimed it within CLAIM_CONTENTION_WINDOW_SECONDS, swap to whichever
 * parent has the earlier `parents.created_at` (here: tenure approximated
 * by parents array order; in production this is parents.created_at ASC).
 */
export function claimLeg(legId, parentId, seatCapacity) {
  const data = db();
  const leg = getLeg(legId);
  if (!leg) return { ok: false, reason: 'not_found' };

  const config = data.app_config || { claim_contention_window_seconds: 5 };
  const me = getParent(parentId);

  if (leg.driver_id && leg.driver_id !== parentId) {
    const incumbent = getParent(leg.driver_id);
    const claimedAgoSec = (Date.now() - new Date(leg.claimed_at).getTime()) / 1000;
    const tenure = (p) => data.parents.findIndex((x) => x.id === p.id);

    if (claimedAgoSec <= config.claim_contention_window_seconds && tenure(me) < tenure(incumbent)) {
      // Swap: I have longer tenure, take the leg.
      const next = updateLeg(legId, (l) => ({
        ...l,
        driver_id: parentId,
        claimed_at: nowIso(),
        status: 'filled',
        seat_capacity: seatCapacity ?? l.seat_capacity,
      }));
      pushStatus(legId, 'driver_swapped', parentId, { from: incumbent.id });
      pushNotif(parentId, 'leg_assigned', `You've been assigned the ${leg.direction === 'to_event' ? 'drop-off' : 'pick-up'}.`, legId);
      pushNotif(incumbent.id, 'leg_swapped', `Someone with longer-standing tenure was assigned this leg — sorry!`, legId);
      persist();
      return { ok: true, leg: next, swapped: true };
    }

    return { ok: false, reason: 'taken', currentDriver: incumbent };
  }

  const prev = {
    driver_id: leg.driver_id,
    claimed_at: leg.claimed_at,
    status: leg.status,
    seat_capacity: leg.seat_capacity,
  };
  const next = updateLeg(legId, (l) => ({
    ...l,
    driver_id: parentId,
    claimed_at: nowIso(),
    status: 'filled',
    seat_capacity: seatCapacity ?? l.seat_capacity,
  }));
  const statusId = pushStatus(legId, 'driver_claimed', parentId);

  const seatedChildren = getKidsInLeg(legId);
  const seen = new Set();
  const notifIds = [];
  for (const c of seatedChildren) {
    for (const cp of getCoParentsForChild(c.id)) {
      if (cp.id !== parentId && !seen.has(cp.id)) {
        seen.add(cp.id);
        notifIds.push(
          pushNotif(
            cp.id,
            'driver_claimed',
            `${me.name} is now driving the ${leg.direction === 'to_event' ? 'drop-off' : 'pick-up'}.`,
            legId,
          ),
        );
      }
    }
  }
  persist();

  // Undo restores the leg to its prior state and removes the audit/notif
  // breadcrumbs we just dropped. Safe within a few seconds of the claim;
  // not a generic "release" — that path uses releaseLeg() for sub flow.
  const undo = () => {
    const cur = getLeg(legId);
    if (!cur || cur.driver_id !== parentId) return false;
    updateLeg(legId, () => ({ ...cur, ...prev }));
    removeStatusEvents([statusId]);
    removeNotifs(notifIds);
    persist();
    return true;
  };

  // Funnel event — fired after persist() so a downstream failure doesn't
  // produce a phantom claim in PostHog. No PII; just IDs + leg shape so we
  // can chart claim volume, hours-out distribution, and seat utilization.
  capture('leg_claimed', {
    leg_id: legId,
    direction: leg.direction,
    hours_out: Math.max(
      0,
      Math.round((new Date(leg.departure_time).getTime() - Date.now()) / 3_600_000),
    ),
    seats_taken: seatedChildren.length,
    seat_capacity: next.seat_capacity,
  });

  return { ok: true, leg: next, undo };
}

/* ---------- digest builder (Phase 3) ---------- */

/**
 * Build the 7pm digest for a given parent: highlights, your-turn-tomorrow,
 * still-needs-driver in the next 5 days, and recent activity.
 */
export function buildDigest(parentId) {
  const data = db();
  const myTeams = data.team_members
    .filter((tm) => tm.parent_id === parentId)
    .map((tm) => tm.team_id);
  const myKidIds = data.parent_children
    .filter((pc) => pc.parent_id === parentId)
    .map((pc) => pc.child_id);

  const horizon = Date.now() + 5 * 86400000;
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowKey = tomorrow.toISOString().slice(0, 10);

  const yourTurnTomorrow = data.carpool_legs.filter(
    (l) =>
      l.driver_id === parentId &&
      l.departure_time.slice(0, 10) === tomorrowKey,
  );

  const teamEventIds = new Set(
    data.events
      .filter((e) => myTeams.includes(e.team_id))
      .map((e) => e.id),
  );

  const stillNeedsDriver = data.carpool_legs.filter((l) => {
    if (!teamEventIds.has(l.event_id)) return false;
    if (l.driver_id) return false;
    const t = new Date(l.departure_time).getTime();
    return t > Date.now() && t < horizon;
  });

  const yourKidNeedsRide = stillNeedsDriver.filter((l) => {
    const evt = data.events.find((e) => e.id === l.event_id);
    if (!evt) return false;
    return data.child_teams.some(
      (ct) => ct.team_id === evt.team_id && myKidIds.includes(ct.child_id),
    );
  });

  const recentActivity = (data.ride_status_events || [])
    .filter((rse) => Date.now() - new Date(rse.created_at).getTime() < 86400000)
    .slice(-8)
    .reverse();

  return {
    builtAt: nowIso(),
    yourTurnTomorrow,
    yourKidNeedsRide,
    stillNeedsDriver,
    recentActivity,
  };
}

/* ---------- §11.2 — cancellation windows ---------- */

/**
 * Add a child to a leg. Always allowed (until the leg is in_progress).
 */
export function seatKid(legId, childId, addedBy) {
  const data = db();
  const leg = getLeg(legId);
  if (!leg) return { ok: false, reason: 'not_found' };
  if (leg.status === 'in_progress' || leg.status === 'completed') {
    return { ok: false, reason: 'leg_locked' };
  }
  const seats = getSeatsForLeg(legId);
  if (seats.some((s) => s.child_id === childId)) {
    return { ok: false, reason: 'already_seated' };
  }
  if (seats.length >= leg.seat_capacity) {
    return { ok: false, reason: 'no_seats' };
  }
  data.seats.push({
    id: newId('seat'),
    leg_id: legId,
    child_id: childId,
    added_by: addedBy,
    created_at: nowIso(),
  });
  pushStatus(legId, 'kid_seated', addedBy, { child_id: childId });
  if (leg.driver_id && leg.driver_id !== addedBy) {
    pushNotif(leg.driver_id, 'kid_added', `A kid was added to your carpool.`, legId);
  }
  persist();
  return { ok: true };
}

/**
 * Unseat a child. Blocks if within the 30-min cancellation window.
 * The actor must be a co-parent of the child.
 */
export function unseatKid(legId, childId, actorId, { reason = '' } = {}) {
  const data = db();
  const leg = getLeg(legId);
  if (!leg) return { ok: false, reason: 'not_found' };
  const config = data.app_config || { cancellation_window_minutes: 30 };

  if (minutesUntil(leg.departure_time) <= config.cancellation_window_minutes) {
    return { ok: false, reason: 'within_cancel_window', driver: getParent(leg.driver_id) };
  }

  const seatIdx = data.seats.findIndex((s) => s.leg_id === legId && s.child_id === childId);
  if (seatIdx === -1) return { ok: false, reason: 'not_seated' };

  const removedSeat = data.seats[seatIdx];
  data.seats.splice(seatIdx, 1);
  const statusId = pushStatus(legId, 'kid_unseated', actorId, { child_id: childId, reason });
  const notifIds = [];
  if (leg.driver_id && leg.driver_id !== actorId) {
    const child = data.children.find((c) => c.id === childId);
    const actor = getParent(actorId);
    const direction = leg.direction === 'to_event' ? 'drop-off' : 'pick-up';
    const reasonText = reason ? ` (${reason.toLowerCase()})` : '';
    const body = `${actor?.name?.split(' ')[0] || 'A parent'} pulled ${child?.name || 'a kid'} from the ${direction}${reasonText}.`;
    notifIds.push(pushNotif(leg.driver_id, 'kid_removed', body, legId));
  }
  persist();

  const undo = () => {
    const cur = db();
    cur.seats.push(removedSeat);
    removeStatusEvents([statusId]);
    removeNotifs(notifIds);
    persist();
  };

  return { ok: true, removedSeat, undo };
}

/**
 * Driver releases a leg they claimed. Allowed if >30 min out (auto-opens
 * a sub_request); blocked within the window unless `emergency = true`.
 */
export function releaseLeg(legId, parentId, { emergency = false, reason = '' } = {}) {
  const data = db();
  const leg = getLeg(legId);
  if (!leg) return { ok: false, reason: 'not_found' };
  if (leg.driver_id !== parentId) return { ok: false, reason: 'not_driver' };

  const config = data.app_config || { cancellation_window_minutes: 30 };
  const within = minutesUntil(leg.departure_time) <= config.cancellation_window_minutes;

  if (within && !emergency) {
    return { ok: false, reason: 'requires_emergency' };
  }

  const me = getParent(parentId);
  const seatedKids = getKidsInLeg(legId);

  if (within && emergency) {
    // §11.2 emergency cancellation path
    updateLeg(legId, (l) => ({ ...l, status: 'cancelled', driver_id: null }));
    pushStatus(legId, 'driver_cancelled', parentId, { reason, emergency: true });

    const seen = new Set();
    for (const c of seatedKids) {
      for (const cp of getCoParentsForChild(c.id)) {
        if (cp.id !== parentId && !seen.has(cp.id)) {
          seen.add(cp.id);
          pushNotif(
            cp.id,
            'driver_cancelled_emergency',
            `The driver of your carpool had to cancel due to an emergency. Can you sub in?`,
            legId,
          );
        }
      }
    }
    persist();
    return { ok: true, mode: 'emergency_cancel' };
  }

  // Normal release: open a broadcast sub_request and clear driver.
  const subId = newId('sub');
  data.sub_requests.push({
    id: subId,
    leg_id: legId,
    requested_by: parentId,
    reason: reason || '',
    mode: 'broadcast',
    target_parent_id: null,
    expires_at: leg.departure_time,
    status: 'open',
    created_at: nowIso(),
  });
  updateLeg(legId, (l) => ({ ...l, driver_id: null, status: 'open' }));
  pushStatus(legId, 'driver_released', parentId, { sub_request_id: subId });

  const team = teamOf(leg);
  for (const m of getMembersForTeam(team)) {
    if (m.id !== parentId) {
      pushNotif(
        m.id,
        'sub_request_open',
        `${me.name} needs a sub for the ${leg.direction === 'to_event' ? 'drop-off' : 'pick-up'}.`,
        legId,
      );
    }
  }
  persist();

  // Funnel event — pair this with sub_request_response_received later to
  // measure response time and gap rate. `reason` is a short pre-defined
  // chip ('Sick' | 'Work conflict' | …) or free text — log the chip
  // category but truncate free text so we don't leak personal detail.
  capture('sub_requested', {
    sub_request_id: subId,
    leg_id: legId,
    direction: leg.direction,
    hours_until_departure: Math.max(
      0,
      Math.round((new Date(leg.departure_time).getTime() - Date.now()) / 3_600_000),
    ),
    reason_kind: reason && reason.length <= 32 ? reason : 'custom',
    team_size: getMembersForTeam(teamOf(leg)).length,
  });

  return { ok: true, mode: 'released_with_sub_request', sub_request_id: subId };
}

/* ---------- §11.3 — sub request response ---------- */

export function acceptSubRequest(subRequestId, parentId) {
  const data = db();
  const sub = data.sub_requests.find((s) => s.id === subRequestId);
  if (!sub) return { ok: false, reason: 'not_found' };
  if (sub.status !== 'open') return { ok: false, reason: 'closed' };

  // First-accept-wins
  sub.status = 'accepted';
  data.sub_request_responses.push({
    id: newId('subresp'),
    sub_request_id: subRequestId,
    parent_id: parentId,
    response: 'accepted',
    reason: '',
    responded_at: nowIso(),
  });

  const result = claimLeg(sub.leg_id, parentId);
  return result;
}

/* ---------- §recurring commitments materializer ---------- */

/**
 * Create a recurring commitment for the given parent + team + day-of-week + direction,
 * then immediately materialize: claim every matching open leg in the next horizon
 * (default 12 weeks). Returns { commitment, claimed: number, conflicts: number }.
 *
 * Skips legs that already have a driver and legs that fall on a blackout for this parent.
 */
export function createRecurringCommitmentAndMaterialize({
  parent_id,
  team_id,
  day_of_week,
  direction,
  seat_capacity,
  horizon_weeks = 12,
}) {
  const data = db();
  const commitment = addRecurringCommitment({
    parent_id,
    team_id,
    day_of_week,
    direction,
    seat_capacity,
    starts_on: nowIso().slice(0, 10),
    ends_on: new Date(Date.now() + horizon_weeks * 7 * 86400000).toISOString().slice(0, 10),
  });

  const blackouts = (data.blackout_dates || []).filter((b) => b.parent_id === parent_id);
  const isBlackedOut = (iso) =>
    blackouts.some((b) => iso.slice(0, 10) >= b.starts_on && iso.slice(0, 10) <= b.ends_on);

  let claimed = 0;
  let conflicts = 0;
  const horizonMs = Date.now() + horizon_weeks * 7 * 86400000;
  for (const evt of data.events) {
    if (evt.team_id !== team_id) continue;
    const start = new Date(evt.start_at);
    if (start.getTime() < Date.now()) continue;
    if (start.getTime() > horizonMs) continue;
    if (start.getDay() !== day_of_week) continue;
    if (isBlackedOut(evt.start_at)) continue;

    const leg = data.carpool_legs.find((l) => l.event_id === evt.id && l.direction === direction);
    if (!leg) continue;
    if (leg.driver_id && leg.driver_id !== parent_id) {
      conflicts += 1;
      continue;
    }
    if (leg.driver_id === parent_id) continue;

    const r = claimLeg(leg.id, parent_id, seat_capacity);
    if (r.ok) claimed += 1;
  }

  return { commitment, claimed, conflicts };
}

/**
 * When a parent goes on blackout, release any of their commitments that overlap
 * the dates and open broadcast sub_requests for them. Returns { releasedCount }.
 */
export function applyBlackoutAndFindSubs({ parent_id, starts_on, ends_on }) {
  const data = db();
  let released = 0;
  for (const leg of [...data.carpool_legs]) {
    if (leg.driver_id !== parent_id) continue;
    const date = leg.departure_time.slice(0, 10);
    if (date < starts_on || date > ends_on) continue;
    if (leg.status === 'in_progress' || leg.status === 'completed') continue;
    const r = releaseLeg(leg.id, parent_id, { reason: 'Out of town' });
    if (r.ok) released += 1;
  }
  return { releasedCount: released };
}

/**
 * Helper: post a system event into the team chat ("Sarah claimed Wed pick-up", etc).
 * Used by lifecycle handlers to keep the group conversation in sync.
 */
export function postSystemChat(teamId, body, pinnedEventId = null) {
  if (!teamId) return null; // one-off carpools have no team chat
  return postChatMessage({
    team_id: teamId,
    author_id: 'system',
    kind: 'system_event',
    body,
    pinned_event_id: pinnedEventId,
  });
}

/* ---------- ride status updates (active ride) ---------- */

export function postRideStatus(legId, parentId, kind, meta = {}) {
  const leg = getLeg(legId);
  if (!leg) return { ok: false, reason: 'not_found' };
  if (leg.driver_id !== parentId) return { ok: false, reason: 'not_driver' };

  const statusId = pushStatus(legId, kind, parentId, meta);
  if (kind === 'en_route') updateLeg(legId, (l) => ({ ...l, status: 'in_progress' }));
  if (kind === 'kid_dropped_off') updateLeg(legId, (l) => ({ ...l, status: 'completed' }));

  const verb = {
    en_route: 'is on their way',
    kid_picked_up: 'has the kids in the car',
    arrived: 'has arrived',
    kid_dropped_off: 'dropped off the kids',
    running_late: meta.delay_minutes
      ? `is running ~${meta.delay_minutes} min late`
      : 'is running late',
    on_time: 'is back on time',
  }[kind] || 'updated the ride';

  let extra = '';
  if (kind === 'running_late' && meta.delay_minutes) {
    const newEta = new Date(
      new Date(leg.departure_time).getTime() + meta.delay_minutes * 60000,
    ).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    extra = ` New ETA ${newEta}.`;
  }

  const me = getParent(parentId);
  const seen = new Set();
  const notifIds = [];
  for (const c of getKidsInLeg(legId)) {
    for (const cp of getCoParentsForChild(c.id)) {
      if (cp.id !== parentId && !seen.has(cp.id)) {
        seen.add(cp.id);
        notifIds.push(pushNotif(cp.id, kind, `${me.name} ${verb}.${extra}`, legId));
      }
    }
  }
  persist();

  const undo = () => {
    removeStatusEvents([statusId]);
    removeNotifs(notifIds);
    persist();
  };

  return { ok: true, undo };
}

/* ---------- §calendar feed import (GameChanger / ICS) ---------- */

/**
 * Fetch a remote ICS feed via the dev proxy. Returns the raw text or
 * throws an Error with a useful message.
 */
export async function fetchIcs(url) {
  let target = url.trim();
  if (target.startsWith('webcal://')) target = 'https://' + target.slice('webcal://'.length);
  const proxied = `/api/ics?url=${encodeURIComponent(target)}`;
  const res = await fetch(proxied);
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`Could not fetch (${res.status}) ${body || ''}`.trim());
  }
  return res.text();
}

/**
 * Import (or re-sync) parsed ICS events for a team. Idempotent: events
 * matched by (source.id, source_uid) are updated in place rather than
 * duplicated. Newly-imported events also spawn a drop-off + pick-up
 * carpool_legs pair using the source's default leg config. Cancelled
 * upstream events get soft-deleted (cancelled_at set) and their open
 * legs get marked cancelled.
 *
 * Returns counts so the UI can show "12 added · 2 updated · 1 cancelled".
 */
export function importIcsForTeam({ source, team_id, parsed }) {
  const data = db();
  if (!parsed) return { added: 0, updated: 0, cancelled: 0 };
  const { skipped } = parsed;
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const incoming = (parsed.events || []).filter(
    (event) => new Date(event.start).getTime() >= todayStart.getTime(),
  );
  const skippedPast = (parsed.events || []).length - incoming.length;

  let added = 0;
  let updated = 0;
  let cancelled = 0;

  // If a previous import accidentally pulled historical feed entries, remove
  // those local imported events now. Parents care about the operational window:
  // today forward. This only touches events from this schedule source.
  const pastEventIds = data.events
    .filter(
      (event) =>
        event.source === source.id &&
        new Date(event.start_at).getTime() < todayStart.getTime(),
    )
    .map((event) => event.id);
  if (pastEventIds.length > 0) {
    const pastLegIds = data.carpool_legs
      .filter((leg) => pastEventIds.includes(leg.event_id))
      .map((leg) => leg.id);
    data.events = data.events.filter((event) => !pastEventIds.includes(event.id));
    data.carpool_legs = data.carpool_legs.filter((leg) => !pastLegIds.includes(leg.id));
    data.seats = data.seats.filter((seat) => !pastLegIds.includes(seat.leg_id));
    data.ride_status_events = data.ride_status_events.filter(
      (status) => !pastLegIds.includes(status.leg_id),
    );
    data.sub_requests = data.sub_requests.filter((request) => !pastLegIds.includes(request.leg_id));
    data.notifications = data.notifications.filter(
      (notification) => !pastLegIds.includes(notification.leg_id),
    );
  }

  for (const inc of incoming) {
    const existing = data.events.find(
      (e) => e.source === source.id && e.source_uid === inc.uid,
    );

    if (inc.cancelled) {
      if (existing && !existing.cancelled_at) {
        existing.cancelled_at = nowIso();
        for (const leg of data.carpool_legs.filter((l) => l.event_id === existing.id)) {
          if (leg.status !== 'completed') {
            leg.status = 'cancelled';
          }
        }
        cancelled++;
      }
      continue;
    }

    if (existing) {
      const timeShift =
        new Date(inc.start).getTime() - new Date(existing.start_at).getTime();
      const changed =
        existing.title !== inc.title ||
        timeShift !== 0 ||
        existing.location !== inc.location;
      if (changed) {
        existing.title = inc.title;
        existing.start_at = inc.start;
        existing.end_at = inc.end;
        existing.location = inc.location;
        if (timeShift !== 0) {
          for (const leg of data.carpool_legs.filter((l) => l.event_id === existing.id)) {
            leg.departure_time = new Date(
              new Date(leg.departure_time).getTime() + timeShift,
            ).toISOString();
          }
        }
        updated++;
      }
      continue;
    }

    const eventId = newId('evt');
    data.events.push({
      id: eventId,
      title: inc.title,
      type: 'imported',
      start_at: inc.start,
      end_at: inc.end,
      location: inc.location || 'TBD',
      team_id,
      source: source.id,
      source_uid: inc.uid,
      source_label: source.name,
      cancelled_at: null,
      created_by: null,
      invited_parent_ids: [],
      permissions: {},
      notes: inc.description || '',
    });
    spawnDefaultLegs({
      event_id: eventId,
      start: inc.start,
      end: inc.end,
      location: inc.location || 'TBD',
      defaults: source.default_legs,
    });
    added++;
  }

  updateScheduleSource(source.id, {
    last_synced_at: nowIso(),
    last_event_count: incoming.length,
    last_status: 'ok',
    last_error: null,
  });
  persist();

  return {
    added,
    updated,
    cancelled,
    removedPast: pastEventIds.length,
    skippedPast,
    skipped,
  };
}

function spawnDefaultLegs({ event_id, start, end, location, defaults }) {
  const data = db();
  const dropOffDepart = new Date(
    new Date(start).getTime() - (defaults?.drop_off_minutes_before ?? 15) * 60000,
  ).toISOString();
  const pickUpDepart = new Date(
    new Date(end).getTime() + (defaults?.pick_up_minutes_after ?? 0) * 60000,
  ).toISOString();

  data.carpool_legs.push({
    id: newId('leg'),
    event_id,
    direction: 'to_event',
    departure_time: dropOffDepart,
    departure_location: 'Pickup TBD',
    arrival_location: location,
    driver_id: null,
    seat_capacity: 4,
    notes: '',
    status: 'open',
    claimed_at: null,
  });
  data.carpool_legs.push({
    id: newId('leg'),
    event_id,
    direction: 'from_event',
    departure_time: pickUpDepart,
    departure_location: location,
    arrival_location: 'Drop-off TBD',
    driver_id: null,
    seat_capacity: 4,
    notes: '',
    status: 'open',
    claimed_at: null,
  });
}

/**
 * Convenience wrapper: fetch + parse + import in one call.
 * Use this from the UI's "Sync now" buttons.
 */
export async function syncSource(source) {
  try {
    let icsText;
    if (source.kind === 'sample') {
      const res = await fetch('/sample/sample-baseball.ics');
      if (!res.ok) throw new Error('Could not load bundled sample');
      icsText = await res.text();
    } else {
      icsText = await fetchIcs(source.url);
    }
    let parsed = parseIcs(icsText, { horizonDays: 120 });
    if (source.kind === 'sample') {
      parsed = anchorParsedToToday(parsed);
    }
    return importIcsForTeam({ source, team_id: source.team_id, parsed });
  } catch (err) {
    updateScheduleSource(source.id, {
      last_status: 'error',
      last_error: err.message,
      last_synced_at: nowIso(),
    });
    throw err;
  }
}

/**
 * Shift every event in `parsed` so the earliest one lands "today
 * around its original time of day" and all others preserve their
 * offsets. Keeps the demo always-relevant regardless of when the
 * user runs it. Only used for the bundled sample.
 */
function anchorParsedToToday(parsed) {
  if (!parsed?.events?.length) return parsed;
  const earliest = parsed.events.reduce((min, e) =>
    new Date(e.start) < new Date(min.start) ? e : min,
  );
  const earliestDate = new Date(earliest.start);
  const today = new Date();
  today.setHours(
    earliestDate.getHours(),
    earliestDate.getMinutes(),
    earliestDate.getSeconds(),
    0,
  );
  const offsetMs = today.getTime() - earliestDate.getTime();
  return {
    ...parsed,
    events: parsed.events.map((e) => ({
      ...e,
      start: new Date(new Date(e.start).getTime() + offsetMs).toISOString(),
      end: new Date(new Date(e.end).getTime() + offsetMs).toISOString(),
    })),
  };
}

/* ---------- auto-claim rules engine ---------- */

/**
 * Walk every still-open leg in the parent's horizon and claim the ones
 * that match an enabled rule. Idempotent: re-running it after the same
 * legs are claimed is a no-op. Returns the legs that were just claimed
 * by this call so the caller can show a single confirmation toast.
 *
 * Notes on semantics:
 * - A rule with `team_id: null` matches legs from every team the parent
 *   belongs to. With a team_id, it scopes to that team's legs.
 * - Direction `any` matches both drop-off and pick-up legs.
 * - Already-claimed legs (whether by this parent or someone else) are
 *   skipped; auto-claim never steals.
 * - We don't run any rule whose `enabled` is false.
 */
export function applyAutoClaimRules(parentId, { horizonDays = 21 } = {}) {
  const rules = getAutoClaimRules(parentId).filter((r) => r.enabled);
  if (rules.length === 0) return { claimed: [] };

  const openLegs = getOpenLegsForParent(parentId, horizonDays);
  if (openLegs.length === 0) return { claimed: [] };

  const claimed = [];
  for (const leg of openLegs) {
    const evt = getEvent(leg.event_id);
    if (!evt) continue;
    const dt = new Date(leg.departure_time);
    const dow = dt.getDay();

    const match = rules.find((r) => {
      if (r.weekday !== dow) return false;
      if (r.direction !== 'any' && r.direction !== leg.direction) return false;
      if (r.team_id && r.team_id !== evt.team_id) return false;
      return true;
    });
    if (!match) continue;

    const result = claimLeg(leg.id, parentId);
    if (result.ok) {
      claimed.push({ leg: result.leg, ruleId: match.id });
    }
  }

  return { claimed };
}
