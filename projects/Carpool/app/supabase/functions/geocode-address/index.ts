// @ts-nocheck — Deno / Supabase Edge Runtime
//
// POST { address: string } — Geocode via Google Geocoding API (server-side key).
// Same auth model as compute-leg-route: valid user JWT required.

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
const googleKey = Deno.env.get('GOOGLE_MAPS_API_KEY') ?? '';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });
  if (req.method !== 'POST') return json(405, { ok: false, reason: 'method_not_allowed' });

  if (!googleKey) return json(503, { ok: false, reason: 'missing_google_maps_key' });

  const authHeader = req.headers.get('Authorization');
  if (!authHeader) return json(401, { ok: false, reason: 'missing_auth' });

  let payload: { address?: string };
  try {
    payload = (await req.json()) as { address?: string };
  } catch {
    return json(400, { ok: false, reason: 'invalid_json' });
  }
  const address = typeof payload.address === 'string' ? payload.address.trim() : '';
  if (!address) return json(400, { ok: false, reason: 'invalid_payload' });

  const supabaseAsCaller = createClient(supabaseUrl, supabaseAnonKey, {
    global: { headers: { Authorization: authHeader } },
  });
  const { data: callerUser, error: callerErr } = await supabaseAsCaller.auth.getUser();
  if (callerErr || !callerUser?.user?.id) {
    return json(401, { ok: false, reason: 'auth_invalid' });
  }

  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${googleKey}`;
  const res = await fetch(url);
  if (!res.ok) return json(502, { ok: false, reason: `geocode_http_${res.status}` });
  const data = await res.json();
  if (data.status !== 'OK' || !data.results?.[0]) {
    return json(200, { ok: false, reason: data.status || 'geocode_empty' });
  }
  const loc = data.results[0].geometry?.location;
  if (!loc || typeof loc.lat !== 'number' || typeof loc.lng !== 'number') {
    return json(200, { ok: false, reason: 'no_location' });
  }
  return json(200, {
    ok: true,
    lat: loc.lat,
    lng: loc.lng,
    label: data.results[0].formatted_address || address,
  });
});
