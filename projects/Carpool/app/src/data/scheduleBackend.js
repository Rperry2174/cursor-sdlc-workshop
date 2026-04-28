import { getSupabase, isSupabaseConfigured } from './supabase.js';

/**
 * Supabase-backed schedule import + read helpers.
 *
 * Mirrors the same {ok, skipped, reason}-style envelope used by
 * onboardingSupabase.js so callers can handle "not configured" and
 * "not signed in" cases without try/catch noise. Every helper is a
 * plain async function — no React imports, no module state.
 */

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const isUuid = (value) => typeof value === 'string' && UUID_RE.test(value);

/**
 * Resolve the caller's backend team_id from a hint (typically the local
 * prototype's string team id like "t_xxx", paired with the local team name).
 * The wizard creates parallel local + backend teams, so the local id is not
 * a UUID; we have to look up the real backend team via the parent's
 * team_members rows. If the parent has multiple teams, prefer one whose
 * name matches; otherwise fall back to the only team they belong to.
 */
async function resolveBackendTeamId(supabase, { teamId, teamName }) {
  if (isUuid(teamId)) return teamId;

  const { data: userResult, error: userErr } = await supabase.auth.getUser();
  if (userErr) return null;
  const authUserId = userResult?.user?.id;
  if (!authUserId) return null;

  const { data: parent, error: parentErr } = await supabase
    .from('parents')
    .select('id')
    .eq('auth_user_id', authUserId)
    .maybeSingle();
  if (parentErr || !parent) return null;

  const { data: memberships, error: memberErr } = await supabase
    .from('team_members')
    .select('team_id')
    .eq('parent_id', parent.id)
    .is('removed_at', null);
  if (memberErr) return null;

  const teamIds = (memberships || []).map((m) => m.team_id);
  if (teamIds.length === 0) return null;
  if (teamIds.length === 1 && !teamName) return teamIds[0];

  const { data: teams, error: teamsErr } = await supabase
    .from('teams')
    .select('id, name')
    .in('id', teamIds);
  if (teamsErr || !teams?.length) return null;

  if (teamName) {
    const wanted = teamName.trim().toLowerCase();
    const match = teams.find((t) => (t.name || '').trim().toLowerCase() === wanted);
    if (match) return match.id;
  }
  return teams.length === 1 ? teams[0].id : null;
}

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

/**
 * Create a schedule_sources row via the add_schedule_source RPC.
 *
 * The RPC validates that the caller belongs to team_id and persists the
 * default_legs jsonb knobs the importer reads later.
 *
 * `teamId` may be either a real backend UUID or — more commonly today — a
 * local prototype id like "t_xxxx". When it's not a UUID we look up the
 * real backend team via the caller's team_members rows, preferring a name
 * match against `teamName` so multi-team users land in the right one.
 */
export async function addBackendScheduleSource({ teamId, teamName, name, kind, url, defaultLegs }) {
  const session = await getSessionResult();
  if (!session.ok) return session;

  const backendTeamId = await resolveBackendTeamId(session.supabase, { teamId, teamName });
  if (!backendTeamId) {
    return { ok: false, reason: 'no_matching_backend_team' };
  }

  const payload = {
    team_id: backendTeamId,
    name,
    kind,
    url: url || null,
    default_legs: defaultLegs || undefined,
  };

  const { data, error } = await session.supabase.rpc('add_schedule_source', { payload });
  if (error) return { ok: false, reason: error.message };
  return { ok: true, source: data };
}

/**
 * Push a parsed event batch through import_events.
 *
 * The parser already emits {uid, title, start, end, location, cancelled}
 * in the exact shape the RPC expects, so we just normalize defensively
 * (drop unknown keys, coerce cancelled to bool) without rewriting timestamps.
 */
export async function importBackendEvents(sourceId, parsedEvents) {
  const session = await getSessionResult();
  if (!session.ok) return session;

  const normalized = (parsedEvents || []).map((event) => ({
    uid: event.uid,
    title: event.title,
    start: event.start,
    end: event.end,
    location: event.location,
    cancelled: Boolean(event.cancelled),
  }));

  const { data, error } = await session.supabase.rpc('import_events', {
    p_source_id: sourceId,
    p_events: normalized,
  });
  if (error) return { ok: false, reason: error.message };
  return { ok: true, counts: data };
}

async function findAuthParentId(supabase, authUserId) {
  const { data, error } = await supabase
    .from('parents')
    .select('id')
    .eq('auth_user_id', authUserId)
    .maybeSingle();
  if (error) return { ok: false, reason: error.message };
  if (!data) return { ok: false, reason: 'parent_not_found' };
  return { ok: true, parentId: data.id };
}

/**
 * Pull every future, non-cancelled event for the signed-in parent's
 * teams along with their carpool_legs, grouped by event_id.
 */
export async function loadBackendScheduleEvents() {
  const session = await getSessionResult();
  if (!session.ok) return session;
  const { supabase } = session;

  const { data: userResult, error: userError } = await supabase.auth.getUser();
  if (userError) return { ok: false, reason: userError.message };
  const authUserId = userResult?.user?.id;
  if (!authUserId) return { ok: false, skipped: true, reason: 'not_signed_in' };

  const parentLookup = await findAuthParentId(supabase, authUserId);
  if (!parentLookup.ok) return { ok: false, reason: parentLookup.reason };

  const { data: memberships, error: memberError } = await supabase
    .from('team_members')
    .select('team_id')
    .eq('parent_id', parentLookup.parentId)
    .is('removed_at', null);
  if (memberError) return { ok: false, reason: memberError.message };

  const teamIds = (memberships || []).map((row) => row.team_id);
  if (teamIds.length === 0) {
    return { ok: true, events: [], legsByEvent: {} };
  }

  const { data: events, error: eventsError } = await supabase
    .from('events')
    .select('*')
    .in('team_id', teamIds)
    .is('cancelled_at', null)
    .order('start_at', { ascending: true });
  if (eventsError) return { ok: false, reason: eventsError.message };

  const eventList = events || [];
  const eventIds = eventList.map((event) => event.id);
  if (eventIds.length === 0) {
    return { ok: true, events: eventList, legsByEvent: {} };
  }

  const { data: legs, error: legsError } = await supabase
    .from('carpool_legs')
    .select('*')
    .in('event_id', eventIds);
  if (legsError) return { ok: false, reason: legsError.message };

  const legsByEvent = {};
  for (const leg of legs || []) {
    if (!legsByEvent[leg.event_id]) legsByEvent[leg.event_id] = [];
    legsByEvent[leg.event_id].push(leg);
  }
  for (const eventId of Object.keys(legsByEvent)) {
    legsByEvent[eventId].sort((a, b) => (a.direction === 'to_event' ? -1 : 1));
  }

  return { ok: true, events: eventList, legsByEvent };
}
