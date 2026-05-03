/**
 * Build Apple Maps and Google Maps deep links for multi-stop driving.
 * No API keys required — opens the native / web maps app.
 *
 * Google supports origin + destination + waypoints (pipe-separated).
 * Apple supports multiple `daddr` query params for sequential destinations.
 */

/** Max addresses in links (origin + intermediate + destination). Keeps URLs within typical limits. */
const MAX_ADDRESSES_IN_LINK = 10;

/**
 * Fully dedupe consecutive trimmed addresses (no length cap).
 * @param {string[]} rawAddresses
 * @returns {string[]}
 */
export function dedupeMapAddresses(rawAddresses) {
  const out = [];
  let prev = null;
  for (const a of rawAddresses) {
    const s = typeof a === 'string' ? a.trim() : '';
    if (!s) continue;
    if (s === prev) continue;
    out.push(s);
    prev = s;
  }
  return out;
}

/**
 * @param {string[]} rawAddresses ordered stops (full strings)
 * @returns {{ stops: string[], truncated: boolean, totalDedupedCount: number }}
 */
export function normalizeMapAddressList(rawAddresses) {
  const full = dedupeMapAddresses(rawAddresses);
  const stops = full.slice(0, MAX_ADDRESSES_IN_LINK);
  return {
    stops,
    truncated: full.length > stops.length,
    totalDedupedCount: full.length,
  };
}

/**
 * @param {string[]} addresses ordered from first stop to last (2+ recommended)
 * @returns {{ googleUrl: string, appleUrl: string, truncated: boolean, includedStopCount: number, totalStopCount: number } | null}
 */
export function buildMapsDeepLinks(addresses) {
  const { stops, truncated, totalDedupedCount } = normalizeMapAddressList(addresses);
  if (stops.length === 0) return null;
  if (stops.length === 1) {
    const q = encodeURIComponent(stops[0]);
    return {
      googleUrl: `https://www.google.com/maps/dir/?api=1&travelmode=driving&destination=${q}`,
      appleUrl: `https://maps.apple.com/?daddr=${q}&dirflg=d`,
      truncated,
      includedStopCount: 1,
      totalStopCount: totalDedupedCount,
    };
  }
  const origin = stops[0];
  const destination = stops[stops.length - 1];
  const middle = stops.slice(1, -1);
  let googleUrl = `https://www.google.com/maps/dir/?api=1&travelmode=driving&origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}`;
  if (middle.length > 0) {
    googleUrl += `&waypoints=${middle.map(encodeURIComponent).join('%7C')}`;
  }

  const appleParts = ['https://maps.apple.com/?dirflg=d'];
  for (const addr of stops) {
    appleParts.push(`daddr=${encodeURIComponent(addr)}`);
  }
  const appleUrl = appleParts.join('&');

  return {
    googleUrl,
    appleUrl,
    truncated,
    includedStopCount: stops.length,
    totalStopCount: totalDedupedCount,
  };
}

/** Prefer Apple on iOS/iPadOS; otherwise Google as default external maps. */
export function defaultExternalMapsUrl(links) {
  if (!links) return null;
  const ua = typeof navigator !== 'undefined' ? navigator.userAgent || '' : '';
  const isAppleMobile = /iPhone|iPad|iPod/i.test(ua);
  return isAppleMobile ? links.appleUrl : links.googleUrl;
}

/**
 * Format a stop (or plain address string) for Google origin/destination query params.
 * Prefers `lat,lng` when both coordinates are finite; otherwise uses trimmed `address`.
 *
 * @param {string | { address?: string, lat?: number, lng?: number }} endpoint
 * @returns {string}
 */
export function formatMapRouteEndpoint(endpoint) {
  if (endpoint == null) return '';
  if (typeof endpoint === 'string') return endpoint.trim();
  const lat = endpoint.lat;
  const lng = endpoint.lng;
  if (Number.isFinite(lat) && Number.isFinite(lng)) {
    return `${Number(lat.toFixed(5))},${Number(lng.toFixed(5))}`;
  }
  return (endpoint.address || '').trim();
}

/**
 * Single driving leg in Google Maps (no API key).
 *
 * @param {string | { address?: string, lat?: number, lng?: number }} fromStop
 * @param {string | { address?: string, lat?: number, lng?: number }} toStop
 * @returns {string | null}
 */
export function buildGoogleDrivingSegmentUrl(fromStop, toStop) {
  const origin = formatMapRouteEndpoint(fromStop);
  const destination = formatMapRouteEndpoint(toStop);
  if (!origin || !destination) return null;
  return `https://www.google.com/maps/dir/?api=1&travelmode=driving&origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}`;
}
