/**
 * Decode Google Encoded Polyline + optional decimation for smooth Leaflet rendering.
 *
 * @see https://developers.google.com/maps/documentation/utilities/polylinealgorithm
 */

/** Hard cap while decoding to avoid runaway CPU / memory on garbage input */
const MAX_DECODE_COORDINATES = 25_000;

/** Target max vertices sent to Leaflet Polyline (overview polylines can be huge) */
const DEFAULT_MAX_RENDER_VERTICES = 480;

/**
 * @param {{ lat: number, lng: number }[]} points
 * @param {number} maxPoints
 * @returns {{ lat: number, lng: number }[]}
 */
export function decimateLatLngPoints(points, maxPoints) {
  if (!points?.length || maxPoints < 2) return points || [];
  if (points.length <= maxPoints) return points;

  const n = points.length;
  const out = [];
  const target = maxPoints;
  for (let j = 0; j < target; j++) {
    const t = j / (target - 1);
    const idx = Math.min(n - 1, Math.round(t * (n - 1)));
    out.push(points[idx]);
  }
  // Remove consecutive duplicates from rounding
  const deduped = [];
  for (const p of out) {
    const prev = deduped[deduped.length - 1];
    if (!prev || prev.lat !== p.lat || prev.lng !== p.lng) deduped.push(p);
  }
  return deduped;
}

/**
 * @param {string} encoded
 * @returns {{ ok: true, points: { lat: number, lng: number }[] } | { ok: false, error: string }}
 */
function tryDecodeGooglePolyline(encoded) {
  if (!encoded || typeof encoded !== 'string') {
    return { ok: true, points: [] };
  }

  let index = 0;
  let lat = 0;
  let lng = 0;
  const coordinates = [];
  const len = encoded.length;

  const readChunk = () => {
    let shift = 0;
    let result = 0;
    let b;
    do {
      if (index >= len) return { error: 'truncated' };
      const c = encoded.charCodeAt(index++);
      if (c < 63 || c > 126) return { error: 'invalid_char' };
      b = c - 63;
      if (shift > 28) return { error: 'chunk_overflow' };
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    return { value: result };
  };

  while (index < len) {
    const latChunk = readChunk();
    if ('error' in latChunk) return { ok: false, error: latChunk.error };
    const dlat = (latChunk.value & 1) !== 0 ? ~(latChunk.value >> 1) : latChunk.value >> 1;
    lat += dlat;

    const lngChunk = readChunk();
    if ('error' in lngChunk) return { ok: false, error: lngChunk.error };
    const dlng = (lngChunk.value & 1) !== 0 ? ~(lngChunk.value >> 1) : lngChunk.value >> 1;
    lng += dlng;

    coordinates.push({ lat: lat * 1e-5, lng: lng * 1e-5 });

    if (coordinates.length > MAX_DECODE_COORDINATES) {
      return { ok: false, error: 'too_many_points' };
    }
  }

  return { ok: true, points: coordinates };
}

/**
 * Decode + decimate for map overlay.
 *
 * @param {string | null | undefined} encoded
 * @param {{ maxVertices?: number }} [options]
 * @returns {{
 *   positions: [number, number][];
 *   error: string | null;
 *   decimated: boolean;
 *   sourcePointCount: number;
 * }}
 */
export function prepareGooglePolylineOverlay(encoded, options = {}) {
  const maxVertices = options.maxVertices ?? DEFAULT_MAX_RENDER_VERTICES;
  const decoded = tryDecodeGooglePolyline(encoded);
  if (!decoded.ok) {
    return {
      positions: [],
      error: decoded.error,
      decimated: false,
      sourcePointCount: 0,
    };
  }
  const raw = decoded.points;
  if (raw.length < 2) {
    return { positions: [], error: null, decimated: false, sourcePointCount: raw.length };
  }

  const thinned = decimateLatLngPoints(raw, maxVertices);
  const positions = thinned.map((p) => [p.lat, p.lng]);
  return {
    positions,
    error: null,
    decimated: thinned.length < raw.length,
    sourcePointCount: raw.length,
  };
}

/** Short phrase for map footers (not for logs). */
export function polylineDecodeUserMessage(code) {
  if (!code) return '';
  const m = {
    truncated: 'the route data was incomplete',
    invalid_char: 'the route data looked corrupted',
    chunk_overflow: 'the route data was unreadable',
    too_many_points: 'the route had too many points to load safely',
  };
  return m[code] || 'the route line could not be drawn';
}

/**
 * @deprecated Use {@link prepareGooglePolylineOverlay} for map rendering (handles errors + decimation).
 * @param {string} encoded
 * @returns {{ lat: number, lng: number }[]}
 */
export function decodeGooglePolyline(encoded) {
  const r = tryDecodeGooglePolyline(encoded);
  if (!r.ok) return [];
  return r.points;
}
