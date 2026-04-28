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
 * Pull the bag of state Today / OpenShifts need to render from the
 * backend: my parent row, my team ids, every active event for those
 * teams, the carpool_legs under those events, the seats under those
 * legs, and any other parents who appear as drivers (so the UI can
 * resolve names without an extra round trip per leg).
 *
 * Children, parent_children, sub_requests etc. are intentionally NOT
 * loaded — backend-mode UX for those features is degraded by design
 * for this slice.
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

  // Other drivers besides the auth parent — deduped, non-null.
  // The auth parent is already loaded above so we don't re-fetch them.
  const driverIds = Array.from(
    new Set(
      legList
        .map((l) => l.driver_id)
        .filter((id) => id && id !== parent.id),
    ),
  );
  let driverList = [];
  if (driverIds.length > 0) {
    const { data: drivers, error: driversError } = await supabase
      .from('parents')
      .select('id, name, phone, avatar_color, photo_url')
      .in('id', driverIds);
    if (driversError) return { ok: false, reason: driversError.message };
    driverList = drivers || [];
  }

  return {
    ok: true,
    parent,
    teamIds,
    events: eventList,
    legs: legList,
    seats: seatList,
    parents: driverList,
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
