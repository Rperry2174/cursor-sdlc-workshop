import { useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import { prepareGooglePolylineOverlay } from '../lib/decodeGooglePolyline.js';

/**
 * Real interactive map for the Active Ride screen.
 *
 * Uses Leaflet + OpenStreetMap tiles (no API key, free, attributed).
 * Renders one pin per stop in the pickup order plus a separate
 * "driver" pin for the current position.
 *
 * When `encodedPolyline` is set (from Google Directions via Edge), draws the
 * road-following route (decoded safely, decimated for performance); otherwise
 * a dashed straight line connects geocoded stops.
 */

function pinIcon({ label, color = 'var(--green-700)', textColor = 'white', size = 30 }) {
  const html = `
    <div style="
      width:${size}px;
      height:${size}px;
      border-radius:999px;
      background:${color};
      color:${textColor};
      display:flex;
      align-items:center;
      justify-content:center;
      font-weight:800;
      font-size:13px;
      border:3px solid white;
      box-shadow:0 2px 6px rgba(0,0,0,0.35);
    ">${label}</div>
  `;
  return L.divIcon({
    html,
    className: 'ride-map-pin',
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

function carIcon() {
  const html = `
    <div style="
      width:38px;
      height:38px;
      border-radius:999px;
      background:#1f2937;
      color:white;
      display:flex;
      align-items:center;
      justify-content:center;
      font-size:20px;
      border:3px solid #fbbf24;
      box-shadow:0 3px 10px rgba(0,0,0,0.4);
    ">🚗</div>
  `;
  return L.divIcon({
    html,
    className: 'ride-map-car',
    iconSize: [38, 38],
    iconAnchor: [19, 19],
  });
}

function FitBounds({ points }) {
  const map = useMap();
  useEffect(() => {
    if (!points.length) return;
    const bounds = L.latLngBounds(points.map((p) => [p.lat, p.lng]));
    map.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 });
  }, [map, points]);
  return null;
}

/**
 * @param {object} props
 * @param {Array<{ lat?: number, lng?: number, id?: string, label?: string, state?: string }>} props.stops
 * @param {{ lat?: number, lng?: number } | null} props.driverPos
 * @param {number} [props.height]
 * @param {string | null | undefined} props.encodedPolyline — Google overview polyline (Directions API)
 */
export function RideMap({ stops, driverPos, height = 240, encodedPolyline = null }) {
  const validStops = useMemo(
    () => stops.filter((s) => s && Number.isFinite(s.lat) && Number.isFinite(s.lng)),
    [stops],
  );

  const roadOverlay = useMemo(
    () => prepareGooglePolylineOverlay(encodedPolyline || null),
    [encodedPolyline],
  );
  const roadRoute = roadOverlay.positions;

  const allPoints = useMemo(() => {
    const pts = [...validStops.map((s) => ({ lat: s.lat, lng: s.lng }))];
    if (roadRoute.length >= 2) {
      for (const [lat, lng] of roadRoute) {
        pts.push({ lat, lng });
      }
    }
    if (driverPos && Number.isFinite(driverPos.lat) && Number.isFinite(driverPos.lng)) {
      pts.push({ lat: driverPos.lat, lng: driverPos.lng });
    }
    return pts;
  }, [validStops, driverPos, roadRoute]);

  const center = validStops[0] || { lat: 41.751, lng: -88.153 };
  const stopToStopLine = validStops.map((s) => [s.lat, s.lng]);

  const mapInstanceKey = useMemo(() => {
    const stopKey = validStops.map((s) => s.id ?? `${s.lat},${s.lng}`).join('|');
    const polyKey = encodedPolyline ? String(encodedPolyline.length) : '0';
    return `${stopKey}__${polyKey}`;
  }, [validStops, encodedPolyline]);

  return (
    <div
      style={{
        height,
        borderRadius: 14,
        overflow: 'hidden',
        border: '1px solid var(--gray-200)',
      }}
    >
      <MapContainer
        key={mapInstanceKey}
        center={[center.lat, center.lng]}
        zoom={13}
        scrollWheelZoom={false}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
        {roadRoute.length >= 2 ? (
          <Polyline
            positions={roadRoute}
            pathOptions={{
              color: '#1d4ed8',
              weight: 5,
              opacity: 0.88,
              lineCap: 'round',
              lineJoin: 'round',
            }}
          />
        ) : (
          stopToStopLine.length >= 2 && (
            <Polyline
              positions={stopToStopLine}
              pathOptions={{ color: '#1b4332', weight: 4, opacity: 0.55, dashArray: '6 8' }}
            />
          )
        )}
        {validStops.map((s, i) => (
          <Marker
            key={s.id || i}
            position={[s.lat, s.lng]}
            icon={pinIcon({
              label: s.label || String(i + 1),
              color: s.state === 'done'
                ? 'var(--gray-500)'
                : s.state === 'current'
                  ? '#f59e0b'
                  : s.state === 'destination'
                    ? '#dc2626'
                    : 'var(--green-700)',
            })}
          />
        ))}
        {driverPos && Number.isFinite(driverPos.lat) && (
          <Marker position={[driverPos.lat, driverPos.lng]} icon={carIcon()} />
        )}
        <FitBounds points={allPoints} />
      </MapContainer>
    </div>
  );
}
