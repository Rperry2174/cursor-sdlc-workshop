/**
 * Address → {lat, lng} resolver for the carpool map view.
 *
 * Strategy (in order, falls through):
 *   1. Hard-coded KNOWN table for our seeded demo addresses
 *      (zero network, always works, looks geographically realistic
 *      because all points are in the same Naperville, IL cluster)
 *   2. localStorage cache from prior Nominatim lookups
 *   3. When Supabase is configured, Supabase Edge `geocode-address` (Google)
 *      with the user's JWT — keys stay server-side.
 *   4. OpenStreetMap Nominatim API (free, no key, ~1 req/sec)
 *   5. null  → caller should hide the map / drop the pin gracefully
 *
 * In production, prefer the Edge path (see `geocode-address` function).
 */

import { isSupabaseConfigured } from './supabase.js';
import { fetchGeocodeAddressEdge } from './operationalBackend.js';

const CACHE_KEY = 'carpool.geocode.v1';

// Naperville, IL cluster — keeps demo coordinates tight and realistic
const KNOWN = {
  // Parent homes
  '124 Maple St': { lat: 41.7508, lng: -88.1535, label: '124 Maple St, Naperville' },
  '88 Oak Ave': { lat: 41.7480, lng: -88.1620, label: '88 Oak Ave, Naperville' },
  '56 Elm St': { lat: 41.7550, lng: -88.1480, label: '56 Elm St, Naperville' },
  '12 Pine Dr': { lat: 41.7460, lng: -88.1700, label: '12 Pine Dr, Naperville' },

  // School / event venues
  'Lincoln Elementary': { lat: 41.7535, lng: -88.1455 },
  'Lincoln Field — Diamond 2': { lat: 41.7568, lng: -88.1438 },
  'Lincoln Field — Bullpen': { lat: 41.7570, lng: -88.1442 },
  'Riverside Park — Field A': { lat: 41.7705, lng: -88.1300 },
  'Hometown Field': { lat: 41.7420, lng: -88.1572 },
  'Lions Field — 4480 W Belmont Ave': { lat: 41.9385, lng: -87.7382 }, // away game in Chicago
  'Eagles Stadium — 1200 N Lake Shore': { lat: 41.9015, lng: -87.6240 },
};

function loadCache() {
  try {
    return JSON.parse(localStorage.getItem(CACHE_KEY) || '{}');
  } catch {
    return {};
  }
}

function saveCache(c) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(c));
  } catch {
    // Swallow quota errors — geocode cache is non-essential.
  }
}

/**
 * Synchronous fast path. Returns coords for known seed addresses or
 * cached lookups. Returns null if the address needs a network round
 * trip — caller can then await `geocodeAddress` for the slow path.
 */
export function lookupAddress(address) {
  if (!address) return null;
  if (KNOWN[address]) return KNOWN[address];
  // Loose match: known key is a substring of address
  const lower = address.toLowerCase();
  for (const [k, v] of Object.entries(KNOWN)) {
    if (lower.includes(k.toLowerCase())) return v;
  }
  const cache = loadCache();
  if (cache[address]) return cache[address];
  return null;
}

let lastNominatimAt = 0;

/**
 * Async path. Tries the sync resolver first, then hits Nominatim with
 * a polite ~1.1s rate limit between calls. Caches successful lookups
 * in localStorage so the demo gets fast on the second use.
 */
export async function geocodeAddress(address) {
  const fast = lookupAddress(address);
  if (fast) return fast;

  if (isSupabaseConfigured()) {
    const edge = await fetchGeocodeAddressEdge(address);
    if (edge.ok && Number.isFinite(edge.lat) && Number.isFinite(edge.lng)) {
      const out = { lat: edge.lat, lng: edge.lng, label: edge.label || address };
      const cache = loadCache();
      cache[address] = out;
      saveCache(cache);
      return out;
    }
  }

  const wait = Math.max(0, 1100 - (Date.now() - lastNominatimAt));
  if (wait > 0) await new Promise((r) => setTimeout(r, wait));
  lastNominatimAt = Date.now();

  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(
      address,
    )}`;
    const res = await fetch(url, {
      headers: { 'Accept-Language': 'en' },
    });
    if (!res.ok) return null;
    const arr = await res.json();
    if (!Array.isArray(arr) || arr.length === 0) return null;
    const out = {
      lat: parseFloat(arr[0].lat),
      lng: parseFloat(arr[0].lon),
      label: arr[0].display_name,
    };
    if (Number.isFinite(out.lat) && Number.isFinite(out.lng)) {
      const cache = loadCache();
      cache[address] = out;
      saveCache(cache);
      return out;
    }
    return null;
  } catch {
    return null;
  }
}
