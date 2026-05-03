import { useEffect, useMemo, useState } from 'react';
import {
  db,
  getEvent,
  getKidsInLeg,
  getCoParentsForChild,
  getParent,
} from '../data/store.js';
import { postRideStatus } from '../data/lifecycle.js';
import { lookupAddress, geocodeAddress } from '../data/geocode.js';
import { loadBackendLegDetail, fetchLegRouteEstimate } from '../data/operationalBackend.js';
import { isSupabaseConfigured } from '../data/supabase.js';
import { buildActiveRideStopsFromLegDetail } from '../lib/mapsStopPlan.js';
import { buildGoogleDrivingSegmentUrl } from '../lib/mapsDeepLinks.js';
import { prepareGooglePolylineOverlay, polylineDecodeUserMessage } from '../lib/decodeGooglePolyline.js';
import { Avatar } from '../components/Avatar.jsx';
import { RideMap } from '../components/RideMap.jsx';
import { TopNav } from '../components/TopNav.jsx';

/* ---------- helpers ---------- */

function fmtTime(iso) {
  return new Date(iso).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}

function buildStops(leg, event) {
  const kids = getKidsInLeg(leg.id);

  // For each kid, look up their primary co-parent's home address
  // (used for both pickup AND drop-off, since they live there).
  const kidStops = kids.map((kid, i) => {
    const parents = getCoParentsForChild(kid.id);
    const homeAddr = parents[0]?.home_address || '';
    const coords = lookupAddress(homeAddr);
    return {
      kind: leg.direction === 'to_event' ? 'pickup' : 'dropoff',
      id: `kid_${kid.id}`,
      kid,
      parent: parents[0],
      address: homeAddr,
      lat: coords?.lat,
      lng: coords?.lng,
      orderHint: i,
    };
  });

  const eventCoords = lookupAddress(event?.location || leg.arrival_location);
  const eventStop = {
    kind: 'destination',
    id: 'destination',
    label: event?.title || 'Event',
    address: event?.location || leg.arrival_location,
    lat: eventCoords?.lat,
    lng: eventCoords?.lng,
  };

  if (leg.direction === 'to_event') {
    // Pickups in seat order, then destination
    return [...kidStops, eventStop];
  }
  // from_event: start at event, then drop each kid
  return [
    {
      kind: 'event_pickup',
      id: 'event_pickup',
      label: event?.title || 'Event',
      address: event?.location || leg.departure_location,
      lat: eventCoords?.lat,
      lng: eventCoords?.lng,
    },
    ...kidStops,
  ];
}

function isLikelyUuid(id) {
  return (
    typeof id === 'string' &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)
  );
}

/* ---------- screen ---------- */

export function ActiveRide({ legId, ctx }) {
  const data = db();
  const localLeg = data.carpool_legs.find((l) => l.id === legId);
  const localEvent = localLeg ? getEvent(localLeg.event_id) : null;

  const [backendDetail, setBackendDetail] = useState(null);
  const [backendMode, setBackendMode] = useState('idle'); // idle|loading|ready|local

  useEffect(() => {
    let cancelled = false;
    const d = db();
    const ll = d.carpool_legs.find((l) => l.id === legId);
    const ev = ll ? getEvent(ll.event_id) : null;
    if (ll && ev) {
      setBackendDetail(null);
      setBackendMode('local');
      return () => {
        cancelled = true;
      };
    }
    if (!isSupabaseConfigured() || !isLikelyUuid(legId)) {
      setBackendDetail(null);
      setBackendMode('local');
      return () => {
        cancelled = true;
      };
    }
    setBackendMode('loading');
    loadBackendLegDetail(legId).then((r) => {
      if (cancelled) return;
      if (r.ok) {
        setBackendDetail(r);
        setBackendMode('ready');
      } else {
        setBackendDetail(null);
        setBackendMode('local');
      }
    });
    return () => {
      cancelled = true;
    };
  }, [legId]);

  const leg = localLeg ?? backendDetail?.leg ?? null;
  const event = localEvent ?? backendDetail?.event ?? null;
  const me =
    leg && backendMode === 'ready' && backendDetail?.driver
      ? backendDetail.driver
      : leg
        ? getParent(leg.driver_id)
        : null;

  const stops = useMemo(() => {
    if (!leg || !event) return [];
    if (backendMode === 'ready' && backendDetail) {
      return buildActiveRideStopsFromLegDetail(backendDetail);
    }
    return buildStops(leg, event);
  }, [leg, event, backendMode, backendDetail]);

  // Index of the next stop the driver hasn't completed yet.
  const [currentIdx, setCurrentIdx] = useState(0);
  const [phase, setPhase] = useState('before_start'); // 'before_start' | 'driving' | 'complete'
  const [lateOpen, setLateOpen] = useState(false);
  const [routeEst, setRouteEst] = useState(null);

  useEffect(() => {
    setCurrentIdx(0);
    setPhase('before_start');
  }, [legId, leg?.id]);

  useEffect(() => {
    if (backendMode !== 'ready' || !leg?.id || !isSupabaseConfigured()) {
      setRouteEst(null);
      return undefined;
    }
    let cancelled = false;
    fetchLegRouteEstimate(leg.id).then((r) => {
      if (cancelled) return;
      if (!r.ok || r.skipped || !r.segments?.length) {
        setRouteEst(null);
        return;
      }
      setRouteEst(r);
    });
    return () => {
      cancelled = true;
    };
  }, [backendMode, leg?.id]);

  const routeLineMeta = useMemo(
    () => prepareGooglePolylineOverlay(routeEst?.encodedPolyline || null),
    [routeEst?.encodedPolyline],
  );

  // Trigger a one-time async geocode for any stops the sync lookup
  // missed (e.g. user-typed addresses for one-off carpools). We just
  // touch geocodeAddress to populate the localStorage cache; the
  // caller component re-renders on the next data tick.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      for (const s of stops) {
        if ((!s.lat || !s.lng) && s.address) {
          const r = await geocodeAddress(s.address);
          if (cancelled) return;
          if (r) {
            // Mutate the stop in place — we'll re-render via next tick.
            // Safe because stops is recomputed each render.
            s.lat = r.lat;
            s.lng = r.lng;
            // Force a re-render
            setCurrentIdx((i) => i);
          }
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [stops]);

  if (backendMode === 'loading') {
    return (
      <>
        <TopNav title="Ride" onBack={() => ctx.navigate('today')} />
        <div className="muted" style={{ padding: 24, textAlign: 'center', fontSize: 13 }}>
          Loading ride from Kinpala backend…
        </div>
      </>
    );
  }

  if (!leg || !event) {
    return (
      <>
        <TopNav title="Ride" onBack={() => ctx.navigate('today')} />
        <div className="section">
          <div className="empty">
            <div className="icon">🚗</div>
            <div className="h3">Couldn't load this ride</div>
          </div>
        </div>
      </>
    );
  }

  if (!me?.id) {
    return (
      <>
        <TopNav title="Ride" onBack={() => ctx.navigate('today')} />
        <div className="section">
          <div className="empty">
            <div className="icon">🚗</div>
            <div className="h3">No driver assigned</div>
          </div>
        </div>
      </>
    );
  }

  const stopsWithState = stops.map((s, i) => ({
    ...s,
    state:
      i < currentIdx ? 'done' : i === currentIdx ? 'current' : s.kind === 'destination' ? 'destination' : 'pending',
    label:
      s.kind === 'destination' || s.kind === 'event_pickup' ? '🏁' : String((s.orderHint ?? i) + 1),
  }));

  // Driver position: at first stop before start, then at the most recently
  // completed stop. Looks like a car icon advancing through the route.
  const driverPos =
    phase === 'before_start'
      ? null
      : currentIdx === 0
        ? stopsWithState[0]
        : stopsWithState[Math.min(currentIdx - 1, stopsWithState.length - 1)];

  const advance = (statusKind) => {
    if (statusKind) postRideStatus(leg.id, me.id, statusKind);
    setCurrentIdx((i) => Math.min(i + 1, stops.length));
  };

  const startRide = () => {
    postRideStatus(leg.id, me.id, 'en_route');
    setPhase('driving');
    ctx.showToast('Parents notified: on your way');
  };

  const completeRide = () => {
    postRideStatus(leg.id, me.id, leg.direction === 'to_event' ? 'kid_dropped_off' : 'arrived');
    setPhase('complete');
    ctx.showToast('Ride complete · all parents notified');
  };

  const sendLate = (minutes) => {
    postRideStatus(leg.id, me.id, 'running_late', { delay_minutes: minutes });
    setLateOpen(false);
    ctx.showToast(`Parents notified: ${minutes} min late`);
  };

  // Compute primary action label/handler based on phase + current stop
  const currentStop = stopsWithState[currentIdx];
  const allKidsHandled = currentIdx >= stops.length - 1; // last stop reached

  let primary;
  if (phase === 'before_start') {
    primary = { label: '🚗 Start ride — notify parents', onClick: startRide, color: 'green' };
  } else if (phase === 'complete') {
    primary = null;
  } else if (currentStop?.kind === 'pickup') {
    primary = {
      label: `✓ Picked up ${currentStop.kid.name}`,
      onClick: () => advance('kid_picked_up'),
      color: 'green',
    };
  } else if (currentStop?.kind === 'dropoff') {
    primary = {
      label: `✓ Dropped off ${currentStop.kid.name}`,
      onClick: () => advance(allKidsHandled ? 'kid_dropped_off' : null),
      color: 'green',
    };
  } else if (currentStop?.kind === 'event_pickup') {
    primary = {
      label: `✓ Got the kids — leaving ${event.title}`,
      onClick: () => advance('kid_picked_up'),
      color: 'green',
    };
  } else if (currentStop?.kind === 'destination') {
    primary = {
      label: `🏁 Arrived at ${event.title}`,
      onClick: completeRide,
      color: 'red',
    };
  }

  // After the last "dropped off" the loop falls through; offer a
  // single completion tap.
  if (phase === 'driving' && currentIdx >= stops.length && !primary) {
    primary = { label: '🏁 Finish ride', onClick: completeRide, color: 'green' };
  }

  return (
    <>
      <TopNav title="Active ride" onBack={() => ctx.navigate('today')} />

      <div className="section" style={{ paddingBottom: 24 }}>
        {/* Header card */}
        <div
          className="card"
          style={{
            background: 'linear-gradient(135deg, #1b4332 0%, #2d6a4f 100%)',
            color: 'white',
          }}
        >
          <div className="caps" style={{ opacity: 0.85 }}>
            {phase === 'complete'
              ? '✓ Ride complete'
              : phase === 'driving'
                ? '🚗 In progress'
                : leg.direction === 'to_event'
                  ? 'Drop-off'
                  : 'Pick-up'}{' '}
            · {event.title}
          </div>
          <div style={{ fontSize: 22, fontWeight: 800, marginTop: 6 }}>
            {phase === 'before_start'
              ? `Leaves at ${fmtTime(leg.departure_time)}`
              : phase === 'complete'
                ? 'All set'
                : currentStop?.kind === 'pickup'
                  ? `Heading to ${currentStop.kid?.name}`
                  : currentStop?.kind === 'dropoff'
                    ? `Dropping off ${currentStop.kid?.name}`
                    : currentStop?.kind === 'destination'
                      ? `Arriving at ${event.title}`
                      : `Picking up at ${event.title}`}
          </div>
          <div style={{ fontSize: 13, opacity: 0.85, marginTop: 6 }}>
            {stops.filter((s) => s.kind === 'pickup' || s.kind === 'dropoff').length} kid
            {stops.filter((s) => s.kind === 'pickup' || s.kind === 'dropoff').length === 1 ? '' : 's'} ·{' '}
            {leg.departure_location} → {leg.arrival_location}
          </div>
          {routeEst && routeEst.totalDurationSeconds > 0 && (
            <div style={{ fontSize: 12, opacity: 0.9, marginTop: 8 }}>
              About {Math.round(routeEst.totalDurationSeconds / 60)} min total drive
              {leg.direction === 'to_event' && event?.start_at
                ? ` · leave by ~${fmtTime(
                    new Date(
                      new Date(event.start_at).getTime() - routeEst.totalDurationSeconds * 1000 - 5 * 60 * 1000,
                    ).toISOString(),
                  )} for 5 min buffer`
                : ''}
            </div>
          )}
        </div>

        {/* Map — road path from Google Directions when Supabase routing returns a polyline */}
        <div>
          <RideMap
            stops={stopsWithState}
            driverPos={driverPos}
            height={260}
            encodedPolyline={routeEst?.encodedPolyline || null}
          />
          {routeEst?.encodedPolyline ? (
            <div className="muted" style={{ fontSize: 10, marginTop: 6, lineHeight: 1.45 }}>
              {routeLineMeta.error ? (
                <>
                  Couldn’t draw the blue route ({polylineDecodeUserMessage(routeLineMeta.error)}). The dashed
                  line shows stop order. Map tiles © OpenStreetMap.
                </>
              ) : routeLineMeta.decimated ? (
                <>
                  Blue line follows Google directions ({routeLineMeta.sourcePointCount.toLocaleString()} points
                  simplified for smooth scrolling). Map tiles © OpenStreetMap.
                </>
              ) : (
                <>Blue line follows driving directions from Google. Map tiles © OpenStreetMap.</>
              )}
            </div>
          ) : null}
        </div>

        {/* Stops list */}
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          {stopsWithState.map((s, i) => {
            const isCurrent = i === currentIdx && phase === 'driving';
            const isDone = i < currentIdx;
            const nextStop = stopsWithState[i + 1];
            const segmentUrl =
              i < stopsWithState.length - 1 ? buildGoogleDrivingSegmentUrl(s, nextStop) : null;
            const isActiveLeg =
              isCurrent && phase === 'driving' && i < stopsWithState.length - 1 && segmentUrl;
            return (
              <div
                key={s.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '12px 14px',
                  borderBottom:
                    i === stopsWithState.length - 1 ? 'none' : '1px solid var(--gray-100)',
                  background: isCurrent ? 'var(--green-50)' : 'transparent',
                }}
              >
                <div
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: 999,
                    background: isDone
                      ? 'var(--gray-300)'
                      : isCurrent
                        ? '#f59e0b'
                        : s.kind === 'destination'
                          ? '#dc2626'
                          : 'var(--green-700)',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 13,
                    fontWeight: 800,
                    flexShrink: 0,
                  }}
                >
                  {isDone ? '✓' : s.label}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>
                    {s.kid ? s.kid.name : s.kind === 'destination' ? `→ ${s.label}` : s.label}
                  </div>
                  <div className="muted" style={{ fontSize: 12, marginTop: 2 }}>
                    {s.address || 'TBD'}
                  </div>
                  {routeEst?.segments?.[i]?.durationSeconds > 0 && i < stopsWithState.length - 1 && (
                    <div style={{ fontSize: 11, opacity: 0.75, marginTop: 4 }}>
                      ~{Math.round(routeEst.segments[i].durationSeconds / 60)} min to next stop
                    </div>
                  )}
                </div>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-end',
                    gap: 6,
                    flexShrink: 0,
                  }}
                >
                  {segmentUrl ? (
                    <button
                      type="button"
                      className="btn btn-secondary"
                      style={{
                        width: 'auto',
                        padding: '6px 10px',
                        fontSize: isActiveLeg ? 12 : 11,
                        fontWeight: isActiveLeg ? 800 : 600,
                        border: isActiveLeg ? '2px solid var(--green-700)' : undefined,
                        whiteSpace: 'nowrap',
                      }}
                      onClick={() => window.open(segmentUrl, '_blank', 'noopener,noreferrer')}
                      aria-label="Open driving directions from this stop to the next in Google Maps"
                    >
                      {isActiveLeg ? 'Open leg in Google' : 'Google → next'}
                    </button>
                  ) : null}
                  {s.parent?.phone && (
                    <a
                      href={`tel:${s.parent.phone}`}
                      className="btn btn-ghost"
                      style={{ width: 'auto', padding: '6px 10px', fontSize: 16 }}
                      aria-label={`Call ${s.parent.name}`}
                    >
                      📞
                    </a>
                  )}
                  {s.kid && (
                    <Avatar name={s.kid.name} color={s.kid.avatar_color} photo={s.kid.photo_url || s.kid.photo} size="sm" />
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Primary action */}
        {primary && (
          <button
            type="button"
            onClick={primary.onClick}
            style={{
              width: '100%',
              padding: '16px',
              borderRadius: 14,
              fontWeight: 800,
              fontSize: 16,
              color: 'white',
              background:
                primary.color === 'red'
                  ? 'linear-gradient(135deg, #dc2626, #991b1b)'
                  : 'linear-gradient(135deg, var(--green-700), var(--green-900))',
              boxShadow: '0 6px 16px rgba(0,0,0,0.15)',
            }}
          >
            {primary.label}
          </button>
        )}

        {/* Late chips (always available while driving) */}
        {phase === 'driving' && (
          <div className="card">
            <div className="caps muted" style={{ marginBottom: 8 }}>Need to flag a delay?</div>
            {!lateOpen ? (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setLateOpen(true)}
              >
                ⏰ Send "running late"
              </button>
            ) : (
              <div className="row" style={{ gap: 6, flexWrap: 'wrap' }}>
                {[5, 10, 15, 30].map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => sendLate(m)}
                    style={{
                      padding: '8px 14px',
                      borderRadius: 999,
                      background: 'var(--yellow-100)',
                      color: 'var(--yellow-text, #92400e)',
                      fontWeight: 700,
                      fontSize: 14,
                      border: '1px solid #fde68a',
                    }}
                  >
                    +{m} min
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setLateOpen(false)}
                  className="btn btn-ghost"
                  style={{ width: 'auto', padding: '8px 12px', fontSize: 13 }}
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        )}

        {/* Complete state */}
        {phase === 'complete' && (
          <div className="card" style={{ textAlign: 'center', padding: 24 }}>
            <div style={{ fontSize: 36 }}>🎉</div>
            <div style={{ fontWeight: 800, fontSize: 18, marginTop: 8 }}>Ride complete</div>
            <div className="muted" style={{ fontSize: 13, marginTop: 6 }}>
              Every parent has been notified that you finished
              {leg.direction === 'to_event' ? ' the drop-off' : ' the pick-up'}.
            </div>
            <button
              type="button"
              className="btn btn-primary"
              style={{ marginTop: 14 }}
              onClick={() => ctx.navigate('today')}
            >
              Back to home
            </button>
          </div>
        )}
      </div>
    </>
  );
}
