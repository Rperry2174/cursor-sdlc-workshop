import { getSupabase, isSupabaseConfigured } from './supabase.js';

/**
 * Supabase-backed operational read + claim helpers for Today and
 * OpenShifts.
 *
 * Mirrors the {ok, skipped, reason}-style envelope used by
 * scheduleBackend.js / onboardingSupabase.js so screens can degrade to
 * the local prototype path when Supabase is unconfigured or no session
 * exists. Every helper is a plain async function — no React imports,
 * no module state.
 */

async function getSessionResult() {
  if (!isSupabaseConfigured()) {
    return { ok: false, skipped: true, reason: 'supabase_not_configured' };
  }
  const supabase = getSupabase();
  const { data, error } = await supabase.auth.getSession();
  if (error) return { ok: false, reason: error.message };
  if (!data.session) return { ok: false, skipped: true, reason: 'not_signed_in' };
  return { ok: true, session: data.session, supabase };
}

async function findAuthParent(supabase, authUserId) {
  const { data, error } = await supabase
    .from('parents')
    .select('*')
    .eq('auth_user_id', authUserId)
    .maybeSingle();
  if (error) return { ok: false, reason: error.message };
  if (!data) return { ok: false, reason: 'parent_not_found' };
  return { ok: true, parent: data };
}

/**
 * Pull the bag of state Today / OpenShifts need from Supabase: parent,
 * teams, events, legs, seats, teammates-as-drivers, my children, open
 * sub_requests on visible legs, and child_teams rows for joinable-leg
 * logic.
 */
export async function loadBackendOperationalState() {
  const session = await getSessionResult();
  if (!session.ok) return session;
  const { supabase } = session;

  const { data: userResult, error: userError } = await supabase.auth.getUser();
  if (userError) return { ok: false, reason: userError.message };
  const authUserId = userResult?.user?.id;
  if (!authUserId) return { ok: false, skipped: true, reason: 'not_signed_in' };

  const parentLookup = await findAuthParent(supabase, authUserId);
  if (!parentLookup.ok) return { ok: false, reason: parentLookup.reason };
  const parent = parentLookup.parent;

  const { data: memberships, error: memberError } = await supabase
    .from('team_members')
    .select('team_id')
    .eq('parent_id', parent.id)
    .is('removed_at', null);
  if (memberError) return { ok: false, reason: memberError.message };

  const teamIds = (memberships || []).map((row) => row.team_id);
  if (teamIds.length === 0) {
    return {
      ok: true,
      parent,
      teamIds: [],
      events: [],
      legs: [],
      seats: [],
      parents: [],
      parentChildren: [],
      seatChildren: [],
      myChildren: [],
      subRequests: [],
      subResponseCounts: {},
      childTeams: [],
    };
  }

  const { data: events, error: eventsError } = await supabase
    .from('events')
    .select('*')
    .in('team_id', teamIds)
    .is('cancelled_at', null)
    .order('start_at', { ascending: true });
  if (eventsError) return { ok: false, reason: eventsError.message };

  const eventList = events || [];
  const eventIds = eventList.map((e) => e.id);
  if (eventIds.length === 0) {
    return {
      ok: true,
      parent,
      teamIds,
      events: [],
      legs: [],
      seats: [],
      parents: [],
      parentChildren: [],
      seatChildren: [],
      myChildren: [],
      subRequests: [],
      subResponseCounts: {},
      childTeams: [],
    };
  }

  const { data: legs, error: legsError } = await supabase
    .from('carpool_legs')
    .select('*')
    .in('event_id', eventIds);
  if (legsError) return { ok: false, reason: legsError.message };
  const legList = legs || [];

  const legIds = legList.map((l) => l.id);
  let seatList = [];
  if (legIds.length > 0) {
    const { data: seatRows, error: seatsError } = await supabase
      .from('seats')
      .select('*')
      .in('leg_id', legIds);
    if (seatsError) return { ok: false, reason: seatsError.message };
    seatList = seatRows || [];
  }

  const { data: teamMemberRows, error: tmErr } = await supabase
    .from('team_members')
    .select('parent_id')
    .in('team_id', teamIds)
    .is('removed_at', null);
  if (tmErr) return { ok: false, reason: tmErr.message };
  const teamParentIds = [...new Set((teamMemberRows || []).map((r) => r.parent_id).filter(Boolean))];

  let parentsList = [];
  if (teamParentIds.length > 0) {
    const { data: plist, error: pListErr } = await supabase
      .from('parents')
      .select('*')
      .in('id', teamParentIds);
    if (pListErr) return { ok: false, reason: pListErr.message };
    parentsList = plist || [];
  }

  const seatedChildIds = [...new Set(seatList.map((s) => s.child_id).filter(Boolean))];
  let parentChildrenForSeats = [];
  if (seatedChildIds.length > 0) {
    const { data: pcSeatRows, error: pcSeatErr } = await supabase
      .from('parent_children')
      .select('parent_id, child_id')
      .in('child_id', seatedChildIds);
    if (pcSeatErr) return { ok: false, reason: pcSeatErr.message };
    parentChildrenForSeats = pcSeatRows || [];
  }

  const { data: childLinks, error: clErr } = await supabase
    .from('parent_children')
    .select('child_id')
    .eq('parent_id', parent.id);
  if (clErr) return { ok: false, reason: clErr.message };
  const myChildIds = (childLinks || []).map((r) => r.child_id);
  let myChildren = [];
  if (myChildIds.length > 0) {
    const { data: kids, error: kidsErr } = await supabase
      .from('children')
      .select('*')
      .in('id', myChildIds);
    if (kidsErr) return { ok: false, reason: kidsErr.message };
    myChildren = kids || [];
  }

  let seatChildren = [];
  if (seatedChildIds.length > 0) {
    const { data: seatChildRows, error: scErr } = await supabase
      .from('children')
      .select('*')
      .in('id', seatedChildIds);
    if (scErr) return { ok: false, reason: scErr.message };
    seatChildren = seatChildRows || [];
  }

  let subRequests = [];
  let subResponseCounts = {};
  if (legIds.length > 0) {
    const { data: subs, error: subsErr } = await supabase
      .from('sub_requests')
      .select('*')
      .in('leg_id', legIds)
      .eq('status', 'open');
    if (subsErr) return { ok: false, reason: subsErr.message };
    subRequests = subs || [];
    const subIds = subRequests.map((s) => s.id);
    if (subIds.length > 0) {
      const { data: respRows, error: respErr } = await supabase
        .from('sub_request_responses')
        .select('sub_request_id')
        .in('sub_request_id', subIds);
      if (respErr) return { ok: false, reason: respErr.message };
      subResponseCounts = {};
      for (const row of respRows || []) {
        const k = row.sub_request_id;
        subResponseCounts[k] = (subResponseCounts[k] || 0) + 1;
      }
    }
  }

  const { data: childTeams, error: ctErr } = await supabase
    .from('child_teams')
    .select('team_id, child_id')
    .in('team_id', teamIds);
  if (ctErr) return { ok: false, reason: ctErr.message };

  return {
    ok: true,
    parent,
    teamIds,
    events: eventList,
    legs: legList,
    seats: seatList,
    parents: parentsList,
    parentChildren: parentChildrenForSeats,
    seatChildren,
    myChildren,
    subRequests,
    subResponseCounts,
    childTeams: childTeams || [],
  };
}

/**
 * Atomic "I'll drive" → claim_leg RPC.
 *
 * Returns the same envelope as the read helpers so screens can fall
 * back to local mutation on `skipped: true`. The RPC's snake_case
 * payload is mapped to camelCase here so callers don't have to.
 */
export async function claimLegBackend(legId) {
  const session = await getSessionResult();
  if (!session.ok) return session;

  const { data, error } = await session.supabase.rpc('claim_leg', {
    p_leg_id: legId,
  });
  if (error) return { ok: false, reason: error.message };

  return {
    ok: data?.ok === true,
    reason: data?.reason,
    driverId: data?.driver_id,
    leg: data?.leg,
  };
}

/**
 * Inverse of claimLegBackend — release_leg RPC. Same envelope shape.
 *
 * Not wired into the UI yet by this slice; surfaced so future agents
 * (or a sub flow) can call it without re-discovering the RPC.
 */
export async function releaseLegBackend(legId) {
  const session = await getSessionResult();
  if (!session.ok) return session;

  const { data, error } = await session.supabase.rpc('release_leg', {
    p_leg_id: legId,
  });
  if (error) return { ok: false, reason: error.message };

  return {
    ok: data?.ok === true,
    reason: data?.reason,
    leg: data?.leg,
  };
}

/**
 * Fire-and-forget notify-team-leg-claimed Edge Function. Used after a
 * successful claim_leg or release_leg RPC to email every other team
 * member that coverage has changed.
 *
 * Returns { ok, sent?, reason?, skipped? }. We surface skipped/error
 * cases to the caller so the toast can include "(notification failed)"
 * when needed, but the surrounding flow should never block on email.
 */
export async function notifyTeamLegChange(legId, kind) {
  const session = await getSessionResult();
  if (!session.ok) return session;

  const { data, error } = await session.supabase.functions.invoke(
    'notify-team-leg-claimed',
    { body: { legId, kind } },
  );
  if (error) return { ok: false, reason: error.message };
  return { ok: true, sent: data?.sent ?? 0, failures: data?.failures || [] };
}

/**
 * Server-side driving time / distance for a leg (Google Directions via Edge).
 * Requires GOOGLE_MAPS_API_KEY on the compute-leg-route function.
 */
export async function fetchLegRouteEstimate(legId) {
  const session = await getSessionResult();
  if (!session.ok) return session;

  const { data, error } = await session.supabase.functions.invoke('compute-leg-route', {
    body: { legId },
  });
  if (error) return { ok: false, reason: error.message };
  return { ok: true, ...data };
}

/**
 * Server-side geocode (Google Geocoding via Edge). Used when Supabase is on.
 */
export async function fetchGeocodeAddressEdge(address) {
  const session = await getSessionResult();
  if (!session.ok) return session;

  const { data, error } = await session.supabase.functions.invoke('geocode-address', {
    body: { address },
  });
  if (error) return { ok: false, reason: error.message };
  if (!data?.ok) return { ok: false, reason: data?.reason || 'geocode_failed' };
  return { ok: true, lat: data.lat, lng: data.lng, label: data.label };
}

/**
 * Load the bag of state the LegDetail screen needs from Supabase:
 *   - the leg + its event
 *   - current driver (if any)
 *   - all seated kids on the leg
 *   - the caller's parent record + their kids (so we know which "Add my
 *     kid to ride" button to render)
 *
 * Falls back to {ok:false, skipped:true} when Supabase is unconfigured or
 * the caller isn't signed in. Returns {ok:false, reason:'leg_not_found'}
 * for a missing leg id.
 */
export async function loadBackendLegDetail(legId) {
  const session = await getSessionResult();
  if (!session.ok) return session;
  const { supabase } = session;

  const { data: userResult, error: userError } = await supabase.auth.getUser();
  if (userError) return { ok: false, reason: userError.message };
  const authUserId = userResult?.user?.id;
  if (!authUserId) return { ok: false, skipped: true, reason: 'not_signed_in' };

  const { data: parent, error: parentErr } = await supabase
    .from('parents')
    .select('*')
    .eq('auth_user_id', authUserId)
    .maybeSingle();
  if (parentErr) return { ok: false, reason: parentErr.message };
  if (!parent) return { ok: false, reason: 'parent_not_found' };

  const { data: leg, error: legErr } = await supabase
    .from('carpool_legs')
    .select('*')
    .eq('id', legId)
    .maybeSingle();
  if (legErr) return { ok: false, reason: legErr.message };
  if (!leg) return { ok: false, reason: 'leg_not_found' };

  const { data: event, error: eventErr } = await supabase
    .from('events')
    .select('*')
    .eq('id', leg.event_id)
    .maybeSingle();
  if (eventErr) return { ok: false, reason: eventErr.message };

  let driver = null;
  if (leg.driver_id) {
    const { data: driverData } = await supabase
      .from('parents')
      .select('id, name, phone, avatar_color, photo_url, home_address')
      .eq('id', leg.driver_id)
      .maybeSingle();
    driver = driverData || null;
  }

  const { data: seats } = await supabase
    .from('seats')
    .select('*')
    .eq('leg_id', leg.id);
  const childIds = Array.from(new Set((seats || []).map((s) => s.child_id)));
  let seatedKids = [];
  if (childIds.length > 0) {
    const { data } = await supabase
      .from('children')
      .select('id, name, age, avatar_color, photo_url')
      .in('id', childIds);
    seatedKids = data || [];
  }

  let parentChildrenLinks = [];
  if (childIds.length > 0) {
    const { data: pcRows, error: pcErr } = await supabase
      .from('parent_children')
      .select('parent_id, child_id')
      .in('child_id', childIds);
    if (pcErr) return { ok: false, reason: pcErr.message };
    parentChildrenLinks = pcRows || [];
  }

  const relatedParentIdSet = new Set(parentChildrenLinks.map((r) => r.parent_id).filter(Boolean));
  if (leg.driver_id) relatedParentIdSet.add(leg.driver_id);
  const relatedParentIds = [...relatedParentIdSet];
  let relatedParentsById = {};
  if (relatedParentIds.length > 0) {
    const { data: relParents, error: rpErr } = await supabase
      .from('parents')
      .select('*')
      .in('id', relatedParentIds);
    if (rpErr) return { ok: false, reason: rpErr.message };
    relatedParentsById = Object.fromEntries((relParents || []).map((p) => [p.id, p]));
    if (leg.driver_id && relatedParentsById[leg.driver_id]) {
      driver = relatedParentsById[leg.driver_id];
    }
  }

  const { data: myLinks } = await supabase
    .from('parent_children')
    .select('child_id')
    .eq('parent_id', parent.id);
  const myKidIds = (myLinks || []).map((row) => row.child_id);
  let myKids = [];
  if (myKidIds.length > 0) {
    const { data } = await supabase
      .from('children')
      .select('id, name, age, avatar_color, photo_url')
      .in('id', myKidIds);
    myKids = data || [];
  }

  return {
    ok: true,
    parent,
    leg,
    event,
    driver,
    seats: seats || [],
    seatedKids,
    myKids,
    parentChildrenLinks,
    relatedParentsById,
  };
}

/**
 * Add the caller's kid to a leg. RLS on `seats` already gates INSERTs to
 * team members; we additionally guard parent ownership of the child via
 * the supabase client's built-in error handling (a parent_id mismatch
 * surfaces as a constraint or RLS violation we surface to the caller).
 */
export async function seatKidBackend({ legId, childId }) {
  const session = await getSessionResult();
  if (!session.ok) return session;

  const { data, error } = await session.supabase.rpc('seat_child_on_leg', {
    p_leg_id: legId,
    p_child_id: childId,
  });
  if (error) return { ok: false, reason: error.message };
  if (data?.ok === true) return { ok: true };
  return { ok: false, reason: data?.reason || 'seat_failed' };
}

/**
 * Driver asks the team to cover this leg (opens sub_request + clears driver).
 * Requires migration 015 `open_sub_request_for_leg`.
 */
export async function openSubRequestForLegBackend({ legId, reason, emergency = false }) {
  const session = await getSessionResult();
  if (!session.ok) return session;

  const { data, error } = await session.supabase.rpc('open_sub_request_for_leg', {
    p_leg_id: legId,
    p_reason: reason || '',
    p_emergency: emergency,
  });
  if (error) return { ok: false, reason: error.message };
  return {
    ok: data?.ok === true,
    reason: data?.reason,
    subRequestId: data?.sub_request_id,
    leg: data?.leg,
  };
}

/**
 * Accept an open sub_request and atomically claim its leg.
 */
export async function acceptSubRequestBackend(subRequestId) {
  const session = await getSessionResult();
  if (!session.ok) return session;

  const { data, error } = await session.supabase.rpc('accept_sub_request', {
    p_sub_request_id: subRequestId,
  });
  if (error) return { ok: false, reason: error.message };
  return {
    ok: data?.ok === true,
    reason: data?.reason,
    leg: data?.leg,
  };
}

/**
 * Mark a child absent on a calendar day: removes their seats on team legs
 * that day and records absence so auto-seat skips them. Clearing absent
 * deletes the row and re-seats for that day.
 */
export async function markChildAbsenceBackend({ childId, onDate, absent, reason }) {
  const session = await getSessionResult();
  if (!session.ok) return session;

  const { data, error } = await session.supabase.rpc('mark_child_absence', {
    p_child_id: childId,
    p_on_date: onDate,
    p_absent: absent,
    p_reason: reason || '',
  });
  if (error) return { ok: false, reason: error.message };
  return {
    ok: data?.ok === true,
    reason: data?.reason,
    mode: data?.mode,
    seatsRemoved: data?.seats_removed,
  };
}

/**
 * Load one sub_request plus leg/event/requester/kids for SubResponse screen.
 */
export async function loadBackendSubRequestDetail(subRequestId) {
  const session = await getSessionResult();
  if (!session.ok) return session;
  const { supabase } = session;

  const { data: sub, error: subErr } = await supabase
    .from('sub_requests')
    .select('*')
    .eq('id', subRequestId)
    .maybeSingle();
  if (subErr) return { ok: false, reason: subErr.message };
  if (!sub) return { ok: false, reason: 'not_found' };

  const { data: leg, error: legErr } = await supabase
    .from('carpool_legs')
    .select('*')
    .eq('id', sub.leg_id)
    .maybeSingle();
  if (legErr) return { ok: false, reason: legErr.message };
  if (!leg) return { ok: false, reason: 'leg_missing' };

  const { data: event, error: evErr } = await supabase
    .from('events')
    .select('*')
    .eq('id', leg.event_id)
    .maybeSingle();
  if (evErr) return { ok: false, reason: evErr.message };

  const { data: requester } = await supabase
    .from('parents')
    .select('id, name, phone, avatar_color, photo_url')
    .eq('id', sub.requested_by)
    .maybeSingle();

  const { data: seatRows } = await supabase.from('seats').select('child_id').eq('leg_id', leg.id);
  const kidIds = Array.from(new Set((seatRows || []).map((s) => s.child_id)));
  let kids = [];
  if (kidIds.length > 0) {
    const { data: krows } = await supabase
      .from('children')
      .select('id, name, age, avatar_color, photo_url')
      .in('id', kidIds);
    kids = krows || [];
  }

  return {
    ok: true,
    sub,
    leg,
    event,
    requester: requester || null,
    kids,
  };
}

export async function addCoparentToChild({ childId, parentId }) {
  const session = await getSessionResult();
  if (!session.ok) return session;
  const { data, error } = await session.supabase.rpc('add_coparent_to_child', {
    p_child_id: childId,
    p_parent_id: parentId,
  });
  if (error) return { ok: false, reason: error.message };
  return { ok: true, inserted: data?.inserted };
}

export async function removeCoparentFromChild({ childId, parentId }) {
  const session = await getSessionResult();
  if (!session.ok) return session;
  const { error } = await session.supabase.rpc('remove_coparent_from_child', {
    p_child_id: childId,
    p_parent_id: parentId,
  });
  if (error) return { ok: false, reason: error.message };
  return { ok: true };
}

/**
 * Pull every parent the caller shares at least one team with — used by the
 * Kid Profile co-parent picker so Mike can grant Jessica co-parent status
 * on Lucas without typing her name.
 */
export async function loadShareableTeammates() {
  const session = await getSessionResult();
  if (!session.ok) return session;
  const { supabase } = session;

  const { data: userResult } = await supabase.auth.getUser();
  const authUserId = userResult?.user?.id;
  if (!authUserId) return { ok: false, skipped: true, reason: 'not_signed_in' };

  const { data: parent } = await supabase
    .from('parents')
    .select('id')
    .eq('auth_user_id', authUserId)
    .maybeSingle();
  if (!parent) return { ok: false, reason: 'parent_not_found' };

  const { data: myMemberships } = await supabase
    .from('team_members')
    .select('team_id')
    .eq('parent_id', parent.id)
    .is('removed_at', null);
  const teamIds = (myMemberships || []).map((m) => m.team_id);
  if (teamIds.length === 0) return { ok: true, parents: [] };

  const { data: allMemberships } = await supabase
    .from('team_members')
    .select('parent_id')
    .in('team_id', teamIds)
    .is('removed_at', null);
  const otherParentIds = Array.from(
    new Set((allMemberships || []).map((m) => m.parent_id).filter((id) => id && id !== parent.id)),
  );
  if (otherParentIds.length === 0) return { ok: true, parents: [] };

  const { data: parents } = await supabase
    .from('parents')
    .select('id, name, avatar_color, photo_url')
    .in('id', otherParentIds);
  return { ok: true, parents: parents || [] };
}

export async function unseatKidBackend({ legId, childId }) {
  const session = await getSessionResult();
  if (!session.ok) return session;

  const { error } = await session.supabase
    .from('seats')
    .delete()
    .eq('leg_id', legId)
    .eq('child_id', childId);
  if (error) return { ok: false, reason: error.message };
  return { ok: true };
}

/**
 * Subscribe to realtime changes on carpool_legs and call onChange whenever
 * a row is inserted, updated, or deleted. Returns an unsubscribe function;
 * callers should invoke it on component unmount or session change.
 *
 * Realtime respects RLS, so subscribers only see events for legs in events
 * of teams the auth parent belongs to. We don't filter by event_id here —
 * the database does the right thing.
 *
 * If Supabase isn't configured or the user isn't signed in, this no-ops
 * and returns a noop unsubscribe so callers don't have to special-case it.
 */
export function subscribeToCarpoolLegs(onChange) {
  if (!isSupabaseConfigured()) return () => {};

  const supabase = getSupabase();
  const channel = supabase
    .channel('carpool_legs_changes')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'carpool_legs' },
      (payload) => {
        try {
          onChange(payload);
        } catch (err) {
          // Don't let a buggy listener tear down the channel.
          console.error('subscribeToCarpoolLegs onChange threw:', err);
        }
      },
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}
