// @ts-nocheck — Deno / Supabase Edge Runtime
//
// POST { legId: string } with Authorization: Bearer <user JWT>
// Returns driving time/distance per Directions API leg segment.
//
// Secrets: GOOGLE_MAPS_API_KEY, SUPABASE_URL, SUPABASE_ANON_KEY,
// SUPABASE_SERVICE_ROLE_KEY (same pattern as notify-team-leg-claimed)

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'content-type': 'application/json' },
  });

const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
const googleKey = Deno.env.get('GOOGLE_MAPS_API_KEY') ?? '';

function orderedAddressesFromLeg(args: {
  leg: Record<string, unknown>;
  event: Record<string, unknown>;
  driver: Record<string, unknown> | null;
  seatedKids: Array<Record<string, unknown>>;
  parentChildrenLinks: Array<{ parent_id: string; child_id: string }>;
  parentsById: Map<string, Record<string, unknown>>;
}): string[] {
  const { leg, event, driver, seatedKids, parentChildrenLinks, parentsById } = args;
  const driverId = (driver?.id as string) || (leg.driver_id as string);
  const driverHome = String(driver?.home_address || leg.departure_location || '');
  const eventVenue = String(event?.location || leg.arrival_location || leg.departure_location || '');

  const pickupHomesOrdered: string[] = [];
  const seenParent = new Set<string>();
  for (const kid of seatedKids || []) {
    const kidId = kid.id as string;
    for (const link of parentChildrenLinks || []) {
      if (link.child_id !== kidId) continue;
      if (!link.parent_id || link.parent_id === driverId) continue;
      if (seenParent.has(link.parent_id)) continue;
      seenParent.add(link.parent_id);
      const p = parentsById.get(link.parent_id);
      const addr = String(p?.home_address || '').trim();
      if (addr) pickupHomesOrdered.push(addr);
    }
  }

  if (leg.direction === 'to_event') {
    const start = driverHome || String(leg.departure_location || '');
    const end = eventVenue || String(leg.arrival_location || '');
    return [start, ...pickupHomesOrdered, end].filter(Boolean);
  }
  const start = eventVenue || String(leg.departure_location || '');
  const end = driverHome || String(leg.arrival_location || '');
  return [start, ...pickupHomesOrdered, end].filter(Boolean);
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });
  if (req.method !== 'POST') return json(405, { ok: false, reason: 'method_not_allowed' });

  if (!googleKey) {
    return json(503, { ok: false, reason: 'missing_google_maps_key' });
  }

  const authHeader = req.headers.get('Authorization');
  if (!authHeader) return json(401, { ok: false, reason: 'missing_auth' });

  let payload: { legId?: string };
  try {
    payload = (await req.json()) as { legId?: string };
  } catch {
    return json(400, { ok: false, reason: 'invalid_json' });
  }
  const legId = payload.legId;
  if (!legId || typeof legId !== 'string') {
    return json(400, { ok: false, reason: 'invalid_payload' });
  }

  const supabaseAsCaller = createClient(supabaseUrl, supabaseAnonKey, {
    global: { headers: { Authorization: authHeader } },
  });
  const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

  const { data: callerUser, error: callerErr } = await supabaseAsCaller.auth.getUser();
  if (callerErr || !callerUser?.user?.id) {
    return json(401, { ok: false, reason: 'auth_invalid' });
  }
  const authUid = callerUser.user.id;

  const { data: callerParent, error: cpErr } = await supabaseAdmin
    .from('parents')
    .select('id')
    .eq('auth_user_id', authUid)
    .maybeSingle();
  if (cpErr || !callerParent) return json(403, { ok: false, reason: 'caller_not_a_parent' });

  const { data: leg, error: legErr } = await supabaseAdmin
    .from('carpool_legs')
    .select('*')
    .eq('id', legId)
    .maybeSingle();
  if (legErr || !leg) return json(404, { ok: false, reason: 'leg_not_found' });

  const { data: event, error: evErr } = await supabaseAdmin
    .from('events')
    .select('*')
    .eq('id', leg.event_id)
    .maybeSingle();
  if (evErr || !event?.team_id) return json(404, { ok: false, reason: 'event_not_found' });

  const { data: membership } = await supabaseAdmin
    .from('team_members')
    .select('parent_id')
    .eq('team_id', event.team_id)
    .eq('parent_id', callerParent.id)
    .is('removed_at', null)
    .maybeSingle();
  if (!membership) return json(403, { ok: false, reason: 'not_team_member' });

  let driver: Record<string, unknown> | null = null;
  if (leg.driver_id) {
    const { data: d } = await supabaseAdmin.from('parents').select('*').eq('id', leg.driver_id).maybeSingle();
    driver = d || null;
  }

  const { data: seats } = await supabaseAdmin.from('seats').select('*').eq('leg_id', leg.id);
  const seatList = seats || [];
  const childIds = [...new Set(seatList.map((s: { child_id: string }) => s.child_id).filter(Boolean))];
  let seatedKids: Array<Record<string, unknown>> = [];
  if (childIds.length > 0) {
    const { data: kids } = await supabaseAdmin.from('children').select('*').in('id', childIds);
    seatedKids = kids || [];
  }

  let parentChildrenLinks: Array<{ parent_id: string; child_id: string }> = [];
  if (childIds.length > 0) {
    const { data: pc } = await supabaseAdmin
      .from('parent_children')
      .select('parent_id, child_id')
      .in('child_id', childIds);
    parentChildrenLinks = pc || [];
  }

  const parentIdSet = new Set<string>(
    parentChildrenLinks.map((r) => r.parent_id).filter(Boolean) as string[],
  );
  if (leg.driver_id) parentIdSet.add(leg.driver_id as string);
  const parentIds = [...parentIdSet];
  const parentsById = new Map<string, Record<string, unknown>>();
  if (parentIds.length > 0) {
    const { data: plist } = await supabaseAdmin.from('parents').select('*').in('id', parentIds);
    for (const p of plist || []) parentsById.set(p.id as string, p as Record<string, unknown>);
  }

  const addresses = orderedAddressesFromLeg({
    leg,
    event,
    driver,
    seatedKids,
    parentChildrenLinks,
    parentsById,
  });
  if (addresses.length < 2) {
    return json(200, {
      ok: true,
      skipped: true,
      reason: 'not_enough_addresses',
      addresses,
      segments: [],
      totalDurationSeconds: 0,
      totalDistanceMeters: 0,
    });
  }

  const origin = addresses[0];
  const destination = addresses[addresses.length - 1];
  const middle = addresses.slice(1, -1);
  let url = `https://maps.googleapis.com/maps/api/directions/json?origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&mode=driving&key=${googleKey}`;
  if (middle.length > 0) {
    url += `&waypoints=${middle.map((a: string) => encodeURIComponent(a)).join('%7C')}`;
  }

  const dep = leg.departure_time as string;
  if (dep) {
    url += `&departure_time=${Math.floor(new Date(dep).getTime() / 1000)}`;
  }

  const dirRes = await fetch(url);
  if (!dirRes.ok) {
    return json(502, { ok: false, reason: `directions_http_${dirRes.status}` });
  }
  const dirJson = await dirRes.json();
  if (dirJson.status !== 'OK' && dirJson.status !== 'ZERO_RESULTS') {
    return json(200, {
      ok: false,
      reason: dirJson.status || 'directions_error',
      addresses,
    });
  }
  const route0 = dirJson.routes?.[0];
  if (!route0) {
    return json(200, {
      ok: true,
      addresses,
      segments: [],
      totalDurationSeconds: 0,
      totalDistanceMeters: 0,
    });
  }

  const legsOut: Array<{
    fromAddress: string;
    toAddress: string;
    durationSeconds: number;
    distanceMeters: number;
  }> = [];
  let totalDurationSeconds = 0;
  let totalDistanceMeters = 0;
  const rLegs = route0.legs || [];
  for (let i = 0; i < rLegs.length; i++) {
    const L = rLegs[i];
    const dur = Number(L.duration?.value ?? L.duration_in_traffic?.value ?? 0);
    const dist = Number(L.distance?.value ?? 0);
    totalDurationSeconds += dur;
    totalDistanceMeters += dist;
    legsOut.push({
      fromAddress: addresses[i] ?? origin,
      toAddress: addresses[i + 1] ?? destination,
      durationSeconds: dur,
      distanceMeters: dist,
    });
  }

  return json(200, {
    ok: true,
    addresses,
    segments: legsOut,
    totalDurationSeconds,
    totalDistanceMeters,
    encodedPolyline: route0.overview_polyline?.points || null,
  });
});
