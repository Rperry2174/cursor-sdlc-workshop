import { useState, useMemo, useEffect, useCallback } from 'react';
import {
  getCurrentParent,
  getEventsByDate,
  getLegsForEvent,
  getKidsInLeg,
  getParent,
  getKidsForParent,
  getOpenSubRequestsForTeam,
  getTeamsForParent,
  getUpcomingSeatsForMyKids,
  getJoinableLegsForMyKids,
  shouldShowGcHint,
  dismissGcHint,
  db,
} from '../data/store.js';
import {
  postRideStatus,
  releaseLeg,
  unseatKid,
  seatKid,
  claimLeg,
} from '../data/lifecycle.js';
import {
  loadBackendOperationalState,
  claimLegBackend,
} from '../data/operationalBackend.js';
import { Avatar } from '../components/Avatar.jsx';
import { Sheet } from '../components/Sheet.jsx';

/* ========================================================================
   Today / Home — redesigned around five principles:

     1. One answer visible without scrolling   → summary band
     2. The hero is an action, not a menu      → "Your next drive" card
     3. Status is always loud                  → green / amber / red pills
     4. Logistics belong to the app, not user  → computed stop chain + ETAs
     5. Actions live where the problem lives   → inline (no global grid)
   ======================================================================== */

function dateKey(d) {
  return d.toISOString().slice(0, 10);
}

function todayKey() {
  return dateKey(new Date());
}

function tomorrowKey() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return dateKey(d);
}

function fmtTime(iso) {
  return new Date(iso).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}

function fmtDayDate(d) {
  return d.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
}

/* ------------------------------------------------------------------ */
/* Stop-chain synthesis                                                */
/* The data model only stores depart/arrive endpoints, so we           */
/* reconstruct the realistic multi-stop route by walking through       */
/* each kid's parent's home_address. Times are estimated by            */
/* working BACKWARDS from the activity start, with a 5-min buffer.     */
/* ------------------------------------------------------------------ */

const MIN_PER_STOP = 10; // pickup-to-pickup hop
const PRE_ACTIVITY_BUFFER_MIN = 5;

function buildStopChain(leg) {
  const data = db();
  const event = data.events.find((e) => e.id === leg.event_id);
  if (!event || !leg.driver_id) return null;
  const driver = data.parents.find((p) => p.id === leg.driver_id);
  if (!driver) return null;

  const kids = getKidsInLeg(leg.id);
  // Map each kid -> their primary parent's home address (skip kids whose
  // parent IS the driver — they board at home base, no extra stop).
  const pickupStops = [];
  const seen = new Set();
  for (const kid of kids) {
    const link = data.parent_children.find(
      (pc) => pc.child_id === kid.id && pc.parent_id !== driver.id,
    );
    if (!link) continue;
    if (seen.has(link.parent_id)) continue;
    seen.add(link.parent_id);
    const p = data.parents.find((x) => x.id === link.parent_id);
    pickupStops.push({
      kid,
      parent: p,
      address: p?.home_address || 'Home',
    });
  }

  const isToEvent = leg.direction === 'to_event';

  // Calculate arrival timestamp at activity (target = event start - buffer)
  const eventStartMs = new Date(event.start_at).getTime();
  const eventEndMs = new Date(event.end_at).getTime();

  if (isToEvent) {
    const targetArriveMs = eventStartMs - PRE_ACTIVITY_BUFFER_MIN * 60 * 1000;
    // Stops: leave home, [pickup each], arrive
    const totalHops = 1 + pickupStops.length; // home->stop1, stop->stop, lastStop->arrival
    const hopMs = MIN_PER_STOP * 60 * 1000;
    const arriveMs = targetArriveMs;
    const departMs = arriveMs - totalHops * hopMs;

    const stops = [];
    let t = departMs;
    stops.push({
      time: new Date(t).toISOString(),
      label: 'Leave home',
      sub: driver.home_address || leg.departure_location,
      kind: 'home',
    });
    for (let i = 0; i < pickupStops.length; i++) {
      t += hopMs;
      const s = pickupStops[i];
      stops.push({
        time: new Date(t).toISOString(),
        label: `Pick up ${s.kid.name}`,
        sub: s.address,
        kind: 'stop',
      });
    }
    t += hopMs;
    stops.push({
      time: new Date(t).toISOString(),
      label: `Arrive ${event.location.split(',')[0]}`,
      sub: `${event.location.includes(',') ? event.location.split(',').slice(1).join(',').trim() + ' · ' : ''}activity starts ${fmtTime(event.start_at)}`,
      kind: 'end',
      bufferMin: PRE_ACTIVITY_BUFFER_MIN,
    });
    const totalMin = totalHops * MIN_PER_STOP;
    return {
      stops,
      totalMin,
      totalMi: Math.round(totalHops * 3.5), // rough — 3.5 mi per hop
      trafficMin: 4,
      departMs,
    };
  } else {
    // FROM event — reverse: leave event, drop each kid at home, end at home
    const departMs = eventEndMs;
    const totalHops = 1 + pickupStops.length;
    const hopMs = MIN_PER_STOP * 60 * 1000;

    const stops = [];
    let t = departMs;
    stops.push({
      time: new Date(t).toISOString(),
      label: `Leave ${event.location.split(',')[0]}`,
      sub: `activity ends ${fmtTime(event.end_at)}`,
      kind: 'home',
    });
    for (let i = 0; i < pickupStops.length; i++) {
      t += hopMs;
      const s = pickupStops[i];
      stops.push({
        time: new Date(t).toISOString(),
        label: `Drop off ${s.kid.name}`,
        sub: s.address,
        kind: 'stop',
      });
    }
    t += hopMs;
    stops.push({
      time: new Date(t).toISOString(),
      label: 'Home',
      sub: driver.home_address || 'Home',
      kind: 'end',
    });
    return {
      stops,
      totalMin: totalHops * MIN_PER_STOP,
      totalMi: Math.round(totalHops * 3.5),
      trafficMin: 4,
      departMs,
    };
  }
}

/* ------------------------------------------------------------------ */
/* Day status: all-covered vs needs-drivers                            */
/* ------------------------------------------------------------------ */

function dayStatus(parentId, dateStr) {
  const events = getEventsByDate(parentId, dateStr);
  let openLegs = 0;
  let totalLegs = 0;
  for (const e of events) {
    const legs = getLegsForEvent(e.id);
    for (const l of legs) {
      totalLegs += 1;
      if (!l.driver_id) openLegs += 1;
    }
  }
  return {
    events,
    openLegs,
    totalLegs,
    label:
      totalLegs === 0
        ? 'Nothing scheduled'
        : openLegs === 0
        ? 'All covered'
        : `${openLegs} ${openLegs === 1 ? 'gap' : 'gaps'}`,
    tone: totalLegs === 0 ? 'muted' : openLegs === 0 ? 'ok' : 'warn',
  };
}

/* ------------------------------------------------------------------ */
/* Backend-mode lookups + selectors                                    */
/*                                                                     */
/* When loadBackendOperationalState() succeeds, we index the flat      */
/* arrays it returns into Maps so the existing Today components can    */
/* resolve event/legs/seats/parent by id without a fresh round trip.   */
/* When backend mode is off (lookups === null), every component falls  */
/* back to the imported store.js helpers, so the local-only flow is    */
/* untouched.                                                          */
/* ------------------------------------------------------------------ */

function buildBackendLookups(backend) {
  if (!backend) return null;
  const eventsById = new Map();
  for (const e of backend.events || []) eventsById.set(e.id, e);

  const legsById = new Map();
  const legsByEventId = new Map();
  for (const l of backend.legs || []) {
    legsById.set(l.id, l);
    if (!legsByEventId.has(l.event_id)) legsByEventId.set(l.event_id, []);
    legsByEventId.get(l.event_id).push(l);
  }
  for (const arr of legsByEventId.values()) {
    arr.sort((a, b) => (a.direction === 'to_event' ? -1 : 1));
  }

  const seatsByLegId = new Map();
  for (const s of backend.seats || []) {
    if (!seatsByLegId.has(s.leg_id)) seatsByLegId.set(s.leg_id, []);
    seatsByLegId.get(s.leg_id).push(s);
  }

  // Normalize parents so the existing UI can read either `photo` or
  // `photo_url` without caring which side the row came from.
  const parentsById = new Map();
  const normalizeParent = (p) => ({ ...p, photo: p.photo || p.photo_url });
  if (backend.parent) parentsById.set(backend.parent.id, normalizeParent(backend.parent));
  for (const p of backend.parents || []) parentsById.set(p.id, normalizeParent(p));

  return {
    eventsById,
    legsById,
    legsByEventId,
    seatsByLegId,
    parentsById,
    parent: backend.parent || null,
    events: backend.events || [],
    legs: backend.legs || [],
  };
}

function getEventBE(eventId, lookups) {
  if (lookups) return lookups.eventsById.get(eventId) || null;
  return db().events.find((e) => e.id === eventId) || null;
}

function getLegsForEventBE(eventId, lookups) {
  return lookups ? lookups.legsByEventId.get(eventId) || [] : getLegsForEvent(eventId);
}

function getKidsInLegBE(legId, lookups) {
  if (lookups) {
    // Backend mode does not load children; we surface seat-level
    // placeholders so kid counts and seat-count math still work, but
    // names will be empty until a future slice loads child data.
    const seats = lookups.seatsByLegId.get(legId) || [];
    return seats.map((s) => ({ id: s.child_id, name: '' }));
  }
  return getKidsInLeg(legId);
}

function getParentBE(parentId, lookups) {
  if (!parentId) return null;
  return lookups ? lookups.parentsById.get(parentId) || null : getParent(parentId);
}

function dayStatusBackend(lookups, dateStr) {
  const events = (lookups.events || []).filter(
    (e) => typeof e.start_at === 'string' && e.start_at.slice(0, 10) === dateStr,
  );
  let openLegs = 0;
  let totalLegs = 0;
  for (const e of events) {
    const legs = lookups.legsByEventId.get(e.id) || [];
    for (const l of legs) {
      totalLegs += 1;
      if (!l.driver_id) openLegs += 1;
    }
  }
  return {
    events,
    openLegs,
    totalLegs,
    label:
      totalLegs === 0
        ? 'Nothing scheduled'
        : openLegs === 0
        ? 'All covered'
        : `${openLegs} ${openLegs === 1 ? 'gap' : 'gaps'}`,
    tone: totalLegs === 0 ? 'muted' : openLegs === 0 ? 'ok' : 'warn',
  };
}

function myUpcomingDrivingBackend(lookups) {
  const myId = lookups?.parent?.id;
  if (!myId) return [];
  const now = Date.now();
  const lower = now - 15 * 60 * 1000;
  const upper = now + 36 * 60 * 60 * 1000;
  return lookups.legs
    .filter(
      (l) =>
        l.driver_id === myId &&
        new Date(l.departure_time).getTime() > lower &&
        new Date(l.departure_time).getTime() < upper &&
        (l.status === 'filled' || l.status === 'in_progress'),
    )
    .sort((a, b) => a.departure_time.localeCompare(b.departure_time));
}

/* ------------------------------------------------------------------ */
/* Pretty "leaves in" countdown                                        */
/* ------------------------------------------------------------------ */

function leavesIn(iso) {
  const ms = new Date(iso).getTime() - Date.now();
  const min = Math.round(ms / 60000);
  if (min < 0) return 'departed';
  if (min < 60) return `${min} min`;
  const h = Math.floor(min / 60);
  const m = min % 60;
  if (h < 24) return m === 0 ? `${h} hr` : `${h} hr ${m} min`;
  const d = Math.floor(h / 24);
  return `${d}d ${h % 24}h`;
}

/* ================================================================== */
/* Main screen                                                         */
/* ================================================================== */

export function Today({ ctx }) {
  const me = getCurrentParent();
  const myKidIds = useMemo(() => getKidsForParent(me.id).map((k) => k.id), [me.id]);

  const [, force] = useState(0);
  useEffect(() => {
    const i = setInterval(() => force((x) => x + 1), 30_000);
    return () => clearInterval(i);
  }, []);

  // ---------- Backend read-mode state (Agent C slice) ----------
  // status === 'loading' renders local data (so the screen is never
  // blank); on success we flip to 'ready' and the existing components
  // re-derive from backend rows via `lookups`. 'fallback'/'error'
  // both keep the local-only behavior unchanged.
  const [backendState, setBackendState] = useState({
    status: 'loading',
    backend: null,
    reason: null,
  });

  useEffect(() => {
    let cancelled = false;
    loadBackendOperationalState().then((res) => {
      if (cancelled) return;
      if (res.ok) {
        setBackendState({ status: 'ready', backend: res, reason: null });
      } else if (res.skipped) {
        setBackendState({ status: 'fallback', backend: null, reason: res.reason });
      } else {
        setBackendState({ status: 'error', backend: null, reason: res.reason });
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const refreshBackend = useCallback(async () => {
    const res = await loadBackendOperationalState();
    if (res.ok) setBackendState({ status: 'ready', backend: res, reason: null });
  }, []);

  const lookups = useMemo(
    () => (backendState.status === 'ready' ? buildBackendLookups(backendState.backend) : null),
    [backendState],
  );

  // Sheets (kept from previous version so behavior is preserved)
  const [needSubOpen, setNeedSubOpen] = useState(false);
  const [needSubLegId, setNeedSubLegId] = useState(null);
  const [needSubReason, setNeedSubReason] = useState('');
  const [lateOpen, setLateOpen] = useState(false);
  const [lateLegId, setLateLegId] = useState(null);
  const [kidOutOpen, setKidOutOpen] = useState(false);
  const [addKidOpen, setAddKidOpen] = useState(false);

  const myUpcomingDriving = useMemo(() => {
    if (lookups) return myUpcomingDrivingBackend(lookups);
    return db()
      .carpool_legs.filter(
        (l) =>
          l.driver_id === me.id &&
          new Date(l.departure_time).getTime() > Date.now() - 15 * 60 * 1000 &&
          new Date(l.departure_time).getTime() < Date.now() + 36 * 60 * 60 * 1000 &&
          (l.status === 'filled' || l.status === 'in_progress'),
      )
      .sort((a, b) => a.departure_time.localeCompare(b.departure_time));
  }, [me.id, lookups]);

  // myUpcomingSeats and joinableLegs depend on knowing which children
  // belong to me — backend mode does not load parent_children/children
  // in this slice, so we leave these on the local store. Sheets that
  // consume them therefore continue to operate on local data, which
  // is the explicit requirement for this agent.
  const myUpcomingSeats = useMemo(() => getUpcomingSeatsForMyKids(me.id, 36), [me.id]);
  const joinableLegs = useMemo(() => getJoinableLegsForMyKids(me.id, 14 * 24), [me.id]);

  // The hero: my soonest upcoming drive (within 36 hrs)
  const nextDrive = myUpcomingDriving[0] || null;

  // Fallback hero: when I'm not driving, show my kid's next trip with someone
  // else driving. Soonest upcoming leg where my kid is seated and driver != me.
  // In backend mode we can't compute this without kid data, so the hero
  // falls through to NoNextDriveCard in that case.
  const nextKidTrip = useMemo(() => {
    if (nextDrive) return null;
    if (lookups) return null;
    const eligible = myUpcomingSeats
      .filter((row) => row.leg.driver_id && row.leg.driver_id !== me.id)
      .sort((a, b) => a.leg.departure_time.localeCompare(b.leg.departure_time));
    return eligible[0] || null;
  }, [nextDrive, myUpcomingSeats, me.id, lookups]);

  // Day blocks
  const today = useMemo(
    () => (lookups ? dayStatusBackend(lookups, todayKey()) : dayStatus(me.id, todayKey())),
    [me.id, lookups],
  );
  const tomorrow = useMemo(
    () => (lookups ? dayStatusBackend(lookups, tomorrowKey()) : dayStatus(me.id, tomorrowKey())),
    [me.id, lookups],
  );

  // Backend "I'll drive" callback — passed to LegRow when in backend
  // mode. Falls through to local claimLeg on `{ skipped: true }` so a
  // race with sign-out doesn't leave the user without a working button.
  const claimBackendCb = useCallback(
    async (leg) => {
      const dirLabel = leg.direction === 'to_event' ? 'drop-off' : 'pick-up';
      const r = await claimLegBackend(leg.id);
      if (r.skipped) {
        const localR = claimLeg(leg.id, me.id);
        if (localR.ok) ctx.showToast(`You're driving the ${dirLabel}`);
        else ctx.showToast(`Could not claim: ${localR.reason}`);
        return;
      }
      if (r.ok) {
        ctx.showToast('Claimed via Kinpala backend');
        refreshBackend();
      } else if (r.reason === 'taken') {
        ctx.showToast('Already claimed');
        refreshBackend();
      } else if (r.reason === 'not_found') {
        ctx.showToast('Could not claim — leg not found');
      } else if (r.reason === 'not_member') {
        ctx.showToast('Could not claim — not a team member');
      } else {
        ctx.showToast(`Could not claim: ${r.reason || 'unknown error'}`);
      }
    },
    [me.id, ctx, refreshBackend],
  );

  // Outstanding sub requests I'M waiting on (no responses yet)
  const myStalledSubs = useMemo(() => {
    const data = db();
    return (data.sub_requests || []).filter((s) => {
      if (s.requested_by !== me.id) return false;
      if (s.status !== 'open') return false;
      const responses = (data.sub_request_responses || []).filter(
        (r) => r.sub_request_id === s.id,
      );
      const hourOld = (Date.now() - new Date(s.created_at).getTime()) / 3_600_000;
      return responses.length === 0 && hourOld > 0;
    });
  }, [me.id]);

  // Inbound sub requests targeted to me
  const myTeams = getTeamsForParent(me.id);
  const inboundSubs = useMemo(() => {
    const all = [];
    for (const t of myTeams) {
      for (const s of getOpenSubRequestsForTeam(t.id)) {
        if (s.requested_by !== me.id) all.push(s);
      }
    }
    return all;
  }, [me.id, myTeams.length]);

  return (
    <>
      {/* ---------- Header ---------- */}
      <div style={{ padding: '14px 20px 10px' }}>
        <div className="row-between">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ fontSize: 26, fontWeight: 800, letterSpacing: '-0.3px' }}>
              {me.name.split(' ')[0]}
            </div>
            {lookups && <LiveDataPill />}
          </div>
          <Avatar name={me.name} color={me.avatar_color} photo={me.photo} size="lg" />
        </div>
      </div>

      {/* ---------- Inbound sub requests (urgent — keep loud) ---------- */}
      {inboundSubs.map((s) => {
        const requester = getParent(s.requested_by);
        return (
          <button
            key={s.id}
            type="button"
            className="alert-banner"
            style={{ background: '#dc2626', width: '100%', textAlign: 'left' }}
            onClick={() => ctx.navigate('sub_response', { subRequestId: s.id })}
          >
            <span style={{ fontSize: 18 }}>🆘</span>
            <span style={{ flex: 1 }}>
              {requester?.name?.split(' ')[0]} needs a sub — tap to respond
            </span>
            <span>›</span>
          </button>
        );
      })}

      <GameChangerHint me={me} ctx={ctx} />

      {/* ---------- Summary band: the whole screen in one row ---------- */}
      <SummaryBand today={today} tomorrow={tomorrow} driveCount={myUpcomingDriving.length} />

      {/* ---------- Hero: your next drive OR your kids' next trip ---------- */}
      {nextDrive ? (
        <NextDriveCard
          leg={nextDrive}
          ctx={ctx}
          meId={me.id}
          lookups={lookups}
          onSub={() => {
            setNeedSubLegId(nextDrive.id);
            setNeedSubReason('');
            setNeedSubOpen(true);
          }}
          onLate={() => {
            setLateLegId(nextDrive.id);
            setLateOpen(true);
          }}
        />
      ) : nextKidTrip ? (
        <KidsNextTripCard row={nextKidTrip} meId={me.id} ctx={ctx} />
      ) : (
        <NoNextDriveCard ctx={ctx} />
      )}

      {/* ---------- Today day section ---------- */}
      <DaySection
        title="Today"
        date={fmtDayDate(new Date())}
        status={today}
        events={today.events}
        meId={me.id}
        myKidIds={myKidIds}
        ctx={ctx}
        lookups={lookups}
        claimBackend={claimBackendCb}
      />

      {/* ---------- Create a carpool: permanent CTA under Today ---------- */}
      <CreateCarpoolCard ctx={ctx} />

      {/* ---------- Tomorrow day section ---------- */}
      <DaySection
        title="Tomorrow"
        date={fmtDayDate(addDays(new Date(), 1))}
        status={tomorrow}
        events={tomorrow.events}
        meId={me.id}
        myKidIds={myKidIds}
        ctx={ctx}
        lookups={lookups}
        claimBackend={claimBackendCb}
      />

      {/* ---------- Attention card (only when there is something) ---------- */}
      {myStalledSubs.map((sub) => (
        <AttentionCard key={sub.id} sub={sub} meId={me.id} ctx={ctx} />
      ))}

      {/* ---------- Footer with the rarely-needed actions ---------- */}
      <FooterActions
        onKidOut={() => {
          if (myUpcomingSeats.length === 0) {
            ctx.showToast('None of your kids are signed up for upcoming rides');
            return;
          }
          setKidOutOpen(true);
        }}
        onAddKid={() => {
          if (joinableLegs.length === 0) {
            ctx.showToast('No upcoming legs with open seats');
            return;
          }
          setAddKidOpen(true);
        }}
      />

      {/* ---------- Sheets (preserved behavior) ---------- */}
      <NeedSubSheet
        open={needSubOpen}
        onClose={() => setNeedSubOpen(false)}
        legs={myUpcomingDriving}
        selectedLegId={needSubLegId}
        onPickLeg={setNeedSubLegId}
        reason={needSubReason}
        onChangeReason={setNeedSubReason}
        onSubmit={() => {
          if (!needSubLegId) return;
          const r = releaseLeg(needSubLegId, me.id, { reason: needSubReason });
          setNeedSubOpen(false);
          if (r.ok && r.mode === 'released_with_sub_request') {
            ctx.showToast('Sub request sent to your team');
          } else if (r.reason === 'requires_emergency') {
            ctx.showToast('Within 30 min — open this leg to mark it an emergency');
            ctx.navigate('leg', { legId: needSubLegId });
          } else {
            ctx.showToast(`Could not release: ${r.reason}`);
          }
        }}
        onEmergency={() => {
          if (!needSubLegId) return;
          setNeedSubOpen(false);
          ctx.navigate('leg', { legId: needSubLegId });
        }}
      />

      <RunningLateSheet
        open={lateOpen}
        onClose={() => setLateOpen(false)}
        legs={myUpcomingDriving}
        selectedLegId={lateLegId}
        onPickLeg={setLateLegId}
        onSendDelay={(delay) => {
          if (!lateLegId) return;
          const r = postRideStatus(lateLegId, me.id, 'running_late', { delay_minutes: delay });
          setLateOpen(false);
          if (r.ok) {
            ctx.showToast(
              delay
                ? `Parents notified: running ~${delay} min late`
                : 'Parents notified: heads up — running late',
              {
                action: {
                  label: 'Undo',
                  onAction: () => {
                    r.undo();
                    ctx.showToast('Late notice retracted');
                  },
                },
              },
            );
          }
        }}
        onClearLate={() => {
          if (!lateLegId) return;
          postRideStatus(lateLegId, me.id, 'on_time');
          setLateOpen(false);
          ctx.showToast('Parents notified: back on time');
        }}
      />

      <KidOutSheet
        open={kidOutOpen}
        onClose={() => setKidOutOpen(false)}
        rows={myUpcomingSeats}
        meId={me.id}
        onRemove={(eventRows, reason) => {
          const undos = [];
          let blocked = false;
          for (const row of eventRows) {
            const r = unseatKid(row.leg.id, row.child.id, me.id, { reason });
            if (r.ok) undos.push(r.undo);
            else if (r.reason === 'within_cancel_window') blocked = true;
          }
          setKidOutOpen(false);
          if (blocked) {
            ctx.showToast('Within 30 min — call your driver directly');
          } else if (undos.length > 0) {
            const kid = eventRows[0].child.name;
            const evtName = eventRows[0].event.title;
            const reasonText = reason ? ` — ${reason.toLowerCase()}` : '';
            ctx.showToast(`${kid} pulled from ${evtName}${reasonText}`, {
              action: {
                label: 'Undo',
                onAction: () => {
                  for (const u of undos) u();
                  ctx.showToast(`${kid} added back to ${evtName}`);
                },
              },
            });
          }
        }}
      />

      <AddMyKidSheet
        open={addKidOpen}
        onClose={() => setAddKidOpen(false)}
        rows={joinableLegs}
        onAdd={(row) => {
          const r = seatKid(row.leg.id, row.kid.id, me.id);
          setAddKidOpen(false);
          if (r.ok) {
            ctx.showToast(`${row.kid.name} added to ${row.event.title}`, {
              action: {
                label: 'Undo',
                onAction: () => {
                  unseatKid(row.leg.id, row.kid.id, me.id);
                  ctx.showToast(`${row.kid.name} removed`);
                },
              },
            });
          } else if (r.reason === 'already_seated') {
            ctx.showToast(`${row.kid.name} is already in this carpool`);
          } else if (r.reason === 'no_seats') {
            ctx.showToast('No seats left in that car');
          } else {
            ctx.showToast(`Could not add: ${r.reason}`);
          }
        }}
      />
    </>
  );
}

function addDays(d, n) {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
}

/* ================================================================== */
/* Summary band                                                        */
/* ================================================================== */

function SummaryBand({ today, tomorrow, driveCount }) {
  return (
    <div
      style={{
        margin: '6px 16px 14px',
        background: 'white',
        border: '1px solid var(--gray-200)',
        borderRadius: 14,
        padding: '12px 14px',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
      }}
    >
      <SBCol label="Today" value={today.label} tone={today.tone} />
      <div style={{ width: 1, alignSelf: 'stretch', background: 'var(--gray-200)' }} />
      <SBCol label="Tomorrow" value={tomorrow.label} tone={tomorrow.tone} />
      <div style={{ width: 1, alignSelf: 'stretch', background: 'var(--gray-200)' }} />
      <SBCol
        label="You drive"
        value={`${driveCount} ${driveCount === 1 ? 'leg' : 'legs'}`}
        tone={driveCount > 0 ? 'info' : 'muted'}
      />
    </div>
  );
}

function SBCol({ label, value, tone }) {
  const dotColor =
    tone === 'ok' ? 'var(--green-500)'
    : tone === 'warn' ? 'var(--yellow-500)'
    : tone === 'info' ? 'var(--green-700)'
    : null;
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 3, minWidth: 0 }}>
      <div
        style={{
          fontSize: 10,
          fontWeight: 700,
          color: 'var(--gray-500)',
          textTransform: 'uppercase',
          letterSpacing: 0.5,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: 13,
          fontWeight: 700,
          color: 'var(--gray-900)',
          display: 'flex',
          alignItems: 'center',
          gap: 6,
        }}
      >
        {dotColor && (
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: 4,
              background: dotColor,
              flexShrink: 0,
            }}
          />
        )}
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {value}
        </span>
      </div>
    </div>
  );
}

/* ================================================================== */
/* Hero: "Your next drive"                                             */
/* ================================================================== */

function NextDriveCard({ leg, ctx, meId, onSub, onLate, lookups }) {
  const event = getEventBE(leg.event_id, lookups);
  const kids = getKidsInLegBE(leg.id, lookups);
  // buildStopChain reads parent_children + per-parent home_address out
  // of the local store, neither of which we load in backend mode this
  // slice — so the route mini-timeline is omitted in that case.
  const chain = useMemo(() => (lookups ? null : buildStopChain(leg)), [leg.id, lookups]);
  const inProgress = leg.status === 'in_progress';
  const isToEvent = leg.direction === 'to_event';

  return (
    <div style={{ margin: '0 16px 14px' }}>
      <div className="row-between" style={{ padding: '0 4px 8px' }}>
        <div className="caps" style={{ color: 'var(--gray-500)', letterSpacing: 0.8 }}>
          Your next drive
        </div>
        <button
          type="button"
          onClick={() => ctx.navigate('leg', { legId: leg.id })}
          style={{
            background: 'transparent',
            color: 'var(--green-700)',
            fontSize: 12,
            fontWeight: 700,
            padding: 0,
          }}
        >
          See details →
        </button>
      </div>

      <div
        style={{
          background: 'white',
          borderRadius: 18,
          border: '1.5px solid var(--green-700)',
          overflow: 'hidden',
          boxShadow: '0 6px 20px rgba(27,67,50,0.12)',
        }}
      >
        {/* Strip */}
        <div
          style={{
            background: 'var(--green-700)',
            color: 'white',
            padding: '10px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div
            style={{
              fontSize: 11,
              fontWeight: 800,
              letterSpacing: 0.8,
              textTransform: 'uppercase',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            🚗 {inProgress ? 'In progress' : `Leaves in ${leavesIn(chain ? new Date(chain.departMs).toISOString() : leg.departure_time)}`}
          </div>
          <div style={{ fontSize: 12, fontWeight: 700, opacity: 0.95 }}>
            {fmtTime(chain ? new Date(chain.departMs).toISOString() : leg.departure_time)}
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: '14px 16px 16px' }}>
          <div style={{ fontSize: 17, fontWeight: 800, color: 'var(--gray-900)' }}>
            {event?.title} — {isToEvent ? 'drop-off' : 'pick-up'}
          </div>
          <div style={{ fontSize: 13, color: 'var(--gray-500)', marginTop: 2, marginBottom: 12 }}>
            {event?.location?.split(',')[0] || 'TBD'} · {isToEvent ? `arrive ${fmtTime(event?.start_at)}` : `out ${fmtTime(event?.end_at)}`} · {kids.length} {kids.length === 1 ? 'kid' : 'kids'}
          </div>

          {chain ? <RouteMini chain={chain} /> : null}

          <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
            <button
              type="button"
              onClick={() => {
                const addr = encodeURIComponent(leg.departure_location || event?.location || '');
                window.open(`https://maps.apple.com/?daddr=${addr}`, '_blank');
                postRideStatus(leg.id, meId, 'en_route');
                ctx.showToast('Status sent: on your way');
              }}
              style={{
                flex: 1,
                background: 'var(--green-700)',
                color: 'white',
                border: 'none',
                borderRadius: 12,
                padding: 12,
                fontSize: 14,
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
              }}
            >
              🧭 Start route
            </button>
            {inProgress ? (
              <button
                type="button"
                onClick={onLate}
                style={{
                  background: 'white',
                  color: 'var(--gray-700)',
                  border: '1px solid var(--gray-300)',
                  borderRadius: 12,
                  padding: '12px 14px',
                  fontSize: 14,
                  fontWeight: 700,
                }}
              >
                ⏰ Late
              </button>
            ) : (
              <button
                type="button"
                onClick={onSub}
                style={{
                  background: 'white',
                  color: 'var(--gray-700)',
                  border: '1px solid var(--gray-300)',
                  borderRadius: 12,
                  padding: '12px 14px',
                  fontSize: 14,
                  fontWeight: 700,
                }}
              >
                Sub
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={() => ctx.navigate('active_ride', { legId: leg.id })}
            style={{
              marginTop: 8,
              width: '100%',
              background: '#fbbf24',
              color: 'var(--green-900)',
              border: 'none',
              borderRadius: 12,
              padding: '14px 8px',
              fontSize: 15,
              fontWeight: 800,
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              cursor: 'pointer',
            }}
          >
            🗺️ Open ride overview →
          </button>
        </div>
      </div>
    </div>
  );
}

function NoNextDriveCard({ ctx }) {
  return (
    <div style={{ margin: '0 16px 14px' }}>
      <div className="caps" style={{ color: 'var(--gray-500)', letterSpacing: 0.8, padding: '0 4px 8px' }}>
        Your next drive
      </div>
      <div
        style={{
          background: 'white',
          borderRadius: 16,
          border: '1px solid var(--gray-200)',
          padding: 18,
          display: 'flex',
          alignItems: 'center',
          gap: 12,
        }}
      >
        <span style={{ fontSize: 28 }}>🌿</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--gray-900)' }}>
            Nothing on the calendar for your kids in the next 36 hours
          </div>
          <div style={{ fontSize: 12, color: 'var(--gray-500)', marginTop: 2 }}>
            See the schedule below for what's coming up further out.
          </div>
        </div>
        <button
          type="button"
          onClick={() => ctx.navigate('open_shifts')}
          style={{
            background: 'var(--gray-100)',
            color: 'var(--gray-900)',
            border: 'none',
            borderRadius: 10,
            padding: '8px 12px',
            fontSize: 12,
            fontWeight: 700,
          }}
        >
          Open shifts
        </button>
      </div>
    </div>
  );
}

/* ================================================================== */
/* "Your kids' next trip" — when someone else is driving               */
/* ================================================================== */

function KidsNextTripCard({ row, meId, ctx }) {
  const { leg, event, child, driver } = row;
  const isToEvent = leg.direction === 'to_event';
  const chain = useMemo(() => buildStopChain(leg), [leg.id]);

  // Find the stop in the chain that matches MY kid (if any).
  // The chain labels stops as "Pick up [name]" / "Drop off [name]".
  const kidStop = chain
    ? chain.stops.find(
        (s) => s.label === `Pick up ${child.name}` || s.label === `Drop off ${child.name}`,
      )
    : null;

  // For to_event: when does the driver arrive at our house?
  // For from_event: when does the driver pick the kid up FROM the event?
  //   (= leg.departure_time — when they leave the field)
  const beReadyTime = isToEvent
    ? kidStop?.time || leg.departure_time
    : leg.departure_time;
  const beReadyLabel = isToEvent
    ? `Be ready by ${fmtTime(beReadyTime)}`
    : `${driver?.name?.split(' ')[0] || 'Driver'} picks them up from event at ${fmtTime(beReadyTime)}`;
  const beReadyWhere = isToEvent
    ? 'at home — driver swings by'
    : event?.location?.split(',')[0] || 'event location';

  // All kids of mine on this leg (rare, but possible — e.g., siblings)
  const allKidsOnLeg = getKidsInLeg(leg.id);

  return (
    <div style={{ margin: '0 16px 14px' }}>
      <div className="row-between" style={{ padding: '0 4px 8px' }}>
        <div className="caps" style={{ color: 'var(--gray-500)', letterSpacing: 0.8 }}>
          Your kid's next trip
        </div>
        <button
          type="button"
          onClick={() => ctx.navigate('leg', { legId: leg.id })}
          style={{
            background: 'transparent',
            color: 'var(--green-700)',
            fontSize: 12,
            fontWeight: 700,
            padding: 0,
          }}
        >
          See details →
        </button>
      </div>

      <div
        style={{
          background: 'white',
          borderRadius: 18,
          border: '1.5px solid var(--gray-300)',
          overflow: 'hidden',
          boxShadow: '0 6px 20px rgba(15,23,42,0.08)',
        }}
      >
        {/* Strip — gray (not green) since I'm not driving */}
        <div
          style={{
            background: 'var(--gray-700)',
            color: 'white',
            padding: '10px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div
            style={{
              fontSize: 11,
              fontWeight: 800,
              letterSpacing: 0.8,
              textTransform: 'uppercase',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            🚗 {isToEvent ? `Pickup in ${leavesIn(beReadyTime)}` : `Picks up in ${leavesIn(beReadyTime)}`}
          </div>
          <div style={{ fontSize: 12, fontWeight: 700, opacity: 0.95 }}>
            {fmtTime(beReadyTime)}
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: '14px 16px 16px' }}>
          <div style={{ fontSize: 17, fontWeight: 800, color: 'var(--gray-900)' }}>
            {child.name} → {event?.title}
          </div>
          <div style={{ fontSize: 13, color: 'var(--gray-500)', marginTop: 2, marginBottom: 12 }}>
            {event?.location?.split(',')[0] || 'TBD'} · {isToEvent ? `arrive ${fmtTime(event?.start_at)}` : `out ${fmtTime(event?.end_at)}`} · {allKidsOnLeg.length} {allKidsOnLeg.length === 1 ? 'kid' : 'kids'} in car
          </div>

          {/* Be-ready row — the most important info */}
          <div
            style={{
              background: 'var(--green-100)',
              border: '1px solid var(--green-500)',
              borderRadius: 12,
              padding: '12px 14px',
              marginBottom: 12,
            }}
          >
            <div
              style={{
                fontSize: 10,
                fontWeight: 800,
                letterSpacing: 0.5,
                textTransform: 'uppercase',
                color: 'var(--green-text)',
                marginBottom: 4,
              }}
            >
              {isToEvent ? `Be ready · ${child.name}` : `Coming home · ${child.name}`}
            </div>
            <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--green-text)' }}>
              {beReadyLabel}
            </div>
            <div style={{ fontSize: 12, color: 'var(--green-text)', marginTop: 2, opacity: 0.85 }}>
              {beReadyWhere}
            </div>
          </div>

          {/* Driver row */}
          {driver && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '10px 12px',
                background: 'var(--gray-50)',
                borderRadius: 12,
                marginBottom: 12,
              }}
            >
              <Avatar name={driver.name} color={driver.avatar_color} photo={driver.photo} size="sm" />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--gray-900)' }}>
                  {driver.name} is driving
                </div>
                <div style={{ fontSize: 11, color: 'var(--gray-500)', marginTop: 1 }}>
                  Leaves their house at {fmtTime(leg.departure_time)} · {allKidsOnLeg.length} {allKidsOnLeg.length === 1 ? 'kid' : 'kids'} on board
                </div>
              </div>
              {driver.phone && (
                <a
                  href={`tel:${driver.phone}`}
                  style={{
                    background: 'var(--gray-200)',
                    color: 'var(--gray-900)',
                    borderRadius: 8,
                    padding: '6px 10px',
                    fontSize: 11,
                    fontWeight: 800,
                    textDecoration: 'none',
                    flexShrink: 0,
                  }}
                >
                  Call
                </a>
              )}
            </div>
          )}

          {/* Optional: full stop chain so mom can see the ordering */}
          {chain ? <RouteMini chain={chain} /> : null}
        </div>
      </div>
    </div>
  );
}

/* ================================================================== */
/* Permanent "Create a carpool" rich card under Today's events         */
/* ================================================================== */

function CreateCarpoolCard({ ctx }) {
  return (
    <div style={{ margin: '0 16px 18px' }}>
      <button
        type="button"
        onClick={() => ctx.navigate('create_carpool')}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: '14px 16px',
          background: 'linear-gradient(135deg, var(--green-700) 0%, var(--green-900) 100%)',
          color: 'white',
          borderRadius: 16,
          boxShadow: '0 6px 20px rgba(27,67,50,0.25)',
          textAlign: 'left',
          border: 'none',
        }}
      >
        <span
          style={{
            width: 38,
            height: 38,
            borderRadius: 12,
            background: 'rgba(255,255,255,0.18)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 20,
            flexShrink: 0,
          }}
        >
          ➕
        </span>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 800, fontSize: 15 }}>Create a carpool</div>
          <div style={{ fontSize: 12, opacity: 0.9, marginTop: 2 }}>
            Birthday, away game, scout meeting — invite parents and drive
          </div>
        </div>
        <span style={{ fontSize: 22, opacity: 0.85 }}>›</span>
      </button>
    </div>
  );
}

/* ================================================================== */
/* Mini route timeline                                                 */
/* ================================================================== */

function RouteMini({ chain }) {
  return (
    <div
      style={{
        background: 'var(--gray-50)',
        borderRadius: 12,
        padding: '12px 14px',
        position: 'relative',
      }}
    >
      {chain.stops.map((s, i) => (
        <div
          key={i}
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: 10,
            position: 'relative',
            padding: '4px 0',
          }}
        >
          <div
            style={{
              fontSize: 12,
              fontWeight: 800,
              color: 'var(--gray-900)',
              width: 56,
              flexShrink: 0,
              paddingTop: 1,
              letterSpacing: '-0.2px',
            }}
          >
            {fmtTime(s.time)}
          </div>
          <div
            style={{
              width: 16,
              flexShrink: 0,
              position: 'relative',
              display: 'flex',
              justifyContent: 'center',
              paddingTop: 5,
            }}
          >
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: 5,
                background:
                  s.kind === 'home' ? 'var(--gray-500)' : 'var(--green-700)',
                border: '2px solid white',
                boxShadow: s.kind === 'end' ? '0 0 0 3px var(--green-700)' : undefined,
                zIndex: 2,
              }}
            />
            {i < chain.stops.length - 1 && (
              <div
                style={{
                  position: 'absolute',
                  left: 7,
                  top: 14,
                  bottom: -14,
                  width: 2,
                  background: 'var(--gray-300)',
                  zIndex: 1,
                }}
              />
            )}
          </div>
          <div style={{ flex: 1 }}>
            <div
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: 'var(--gray-900)',
                lineHeight: 1.3,
              }}
            >
              {s.label}
              {s.bufferMin ? (
                <span
                  style={{
                    display: 'inline-block',
                    fontSize: 10,
                    fontWeight: 800,
                    background: 'var(--green-100)',
                    color: 'var(--green-text)',
                    padding: '1px 6px',
                    borderRadius: 4,
                    marginLeft: 6,
                  }}
                >
                  {s.bufferMin}-min buffer
                </span>
              ) : null}
            </div>
            <div style={{ fontSize: 11, color: 'var(--gray-500)', marginTop: 1 }}>{s.sub}</div>
          </div>
        </div>
      ))}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: '8px 2px 0',
          fontSize: 11,
          color: 'var(--gray-500)',
          borderTop: '1px solid var(--gray-200)',
          marginTop: 6,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          🛣️ <strong style={{ color: 'var(--gray-900)' }}>{chain.totalMi} mi</strong>
        </div>
        <div style={{ width: 1, height: 10, background: 'var(--gray-200)' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          ⏱️ <strong style={{ color: 'var(--gray-900)' }}>{chain.totalMin} min</strong>
        </div>
        <div style={{ width: 1, height: 10, background: 'var(--gray-200)' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          🚦 +{chain.trafficMin} min traffic
        </div>
      </div>
    </div>
  );
}

/* ================================================================== */
/* Day section (Today / Tomorrow)                                      */
/* ================================================================== */

function DaySection({ title, date, status, events, meId, myKidIds, ctx, lookups, claimBackend }) {
  return (
    <div style={{ margin: '0 16px 18px' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'baseline',
          gap: 8,
          marginBottom: 8,
          padding: '0 2px',
          flexWrap: 'wrap',
        }}
      >
        <span
          style={{
            fontSize: 16,
            fontWeight: 800,
            color: 'var(--gray-900)',
            letterSpacing: '-0.2px',
          }}
        >
          {title}
        </span>
        <span style={{ fontSize: 12, color: 'var(--gray-500)', fontWeight: 500 }}>· {date}</span>
        {status.totalLegs > 0 && (
          <span
            style={{
              fontSize: 11,
              fontWeight: 800,
              padding: '2px 8px',
              borderRadius: 8,
              background:
                status.tone === 'ok' ? 'var(--green-100)' : 'var(--yellow-100)',
              color:
                status.tone === 'ok' ? 'var(--green-text)' : 'var(--yellow-text)',
            }}
          >
            {status.tone === 'ok' ? 'All covered' : 'Needs drivers'}
          </span>
        )}
      </div>

      {events.length === 0 ? (
        <div
          style={{
            background: 'white',
            borderRadius: 14,
            border: '1px dashed var(--gray-200)',
            padding: '14px 16px',
            color: 'var(--gray-500)',
            fontSize: 13,
            textAlign: 'center',
          }}
        >
          Nothing scheduled.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {events.map((e) => (
            <RideCard
              key={e.id}
              event={e}
              meId={meId}
              myKidIds={myKidIds}
              ctx={ctx}
              lookups={lookups}
              claimBackend={claimBackend}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function RideCard({ event, meId, myKidIds, ctx, lookups, claimBackend }) {
  const legs = getLegsForEventBE(event.id, lookups);
  const emoji =
    event.type === 'game' ? '⚾'
    : event.type === 'practice' ? '🏟️'
    : event.type === 'imported' ? '📅'
    : event.title?.toLowerCase().includes('piano') ? '🎹'
    : event.title?.toLowerCase().includes('art') ? '🎨'
    : '📍';

  return (
    <div
      style={{
        background: 'white',
        border: '1px solid var(--gray-200)',
        borderRadius: 14,
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          padding: '11px 14px 6px',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <div
          style={{
            width: 24,
            height: 24,
            borderRadius: 8,
            background: 'var(--gray-100)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 14,
            flexShrink: 0,
          }}
        >
          {emoji}
        </div>
        <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--gray-900)', flex: 1, minWidth: 0 }}>
          {event.title}
        </div>
        <div style={{ fontSize: 11, color: 'var(--gray-500)', fontWeight: 600 }}>
          {fmtTime(event.start_at)} – {fmtTime(event.end_at)}
        </div>
      </div>
      {legs.map((leg, idx) => (
        <LegRow
          key={leg.id}
          leg={leg}
          first={idx === 0}
          meId={meId}
          myKidIds={myKidIds}
          ctx={ctx}
          lookups={lookups}
          claimBackend={claimBackend}
        />
      ))}
    </div>
  );
}

function LegRow({ leg, first, meId, myKidIds, ctx, lookups, claimBackend }) {
  const driver = leg.driver_id ? getParentBE(leg.driver_id, lookups) : null;
  const kids = getKidsInLegBE(leg.id, lookups);
  const isMine = leg.driver_id === meId || (lookups && leg.driver_id === lookups.parent?.id);
  const isOpen = !leg.driver_id;
  const myKidsHere = kids.filter((k) => myKidIds.includes(k.id));

  const directionLabel = leg.direction === 'to_event' ? 'Drop-off' : 'Pick-up';
  const kidLabel =
    myKidsHere.length > 0
      ? myKidsHere.map((k) => k.name).join(', ')
      : kids.length > 0
      ? `${kids.length} ${kids.length === 1 ? 'kid' : 'kids'}`
      : 'No kids yet';

  return (
    <div
      style={{
        padding: '8px 14px 10px 46px',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        borderTop: first ? 'none' : '1px solid var(--gray-100)',
        cursor: 'pointer',
      }}
      onClick={() => ctx.navigate('leg', { legId: leg.id })}
      role="button"
      tabIndex={0}
    >
      <div
        style={{
          fontSize: 10,
          fontWeight: 800,
          color: 'var(--gray-500)',
          textTransform: 'uppercase',
          letterSpacing: 0.5,
          minWidth: 52,
        }}
      >
        {directionLabel}
      </div>
      <div
        style={{
          fontSize: 12,
          color: 'var(--gray-700)',
          fontWeight: 600,
          flex: 1,
          minWidth: 0,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        {kidLabel}
      </div>
      <DriverPill leg={leg} driver={driver} isMine={isMine} isOpen={isOpen} />
      {isOpen && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            if (lookups && claimBackend) {
              // Fire-and-forget — the callback handles its own toasts
              // and re-fetches backend state on success.
              claimBackend(leg);
              return;
            }
            const r = claimLeg(leg.id, meId);
            if (r.ok) ctx.showToast(`You're driving the ${directionLabel.toLowerCase()}`);
            else ctx.showToast(`Could not claim: ${r.reason}`);
          }}
          style={{
            marginLeft: 4,
            background: 'var(--green-700)',
            color: 'white',
            border: 'none',
            borderRadius: 6,
            padding: '4px 9px',
            fontSize: 10,
            fontWeight: 800,
            flexShrink: 0,
          }}
        >
          I'll drive
        </button>
      )}
    </div>
  );
}

function DriverPill({ leg, driver, isMine, isOpen }) {
  if (isMine) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 5,
          fontSize: 11,
          fontWeight: 800,
          padding: '3px 9px',
          borderRadius: 16,
          background: 'var(--green-700)',
          color: 'white',
          flexShrink: 0,
        }}
      >
        YOU · {fmtTime(leg.departure_time)}
      </div>
    );
  }
  if (isOpen) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 5,
          fontSize: 11,
          fontWeight: 800,
          padding: '3px 9px',
          borderRadius: 16,
          background: 'var(--yellow-100)',
          color: 'var(--yellow-text)',
          border: '1px dashed var(--yellow-500)',
          flexShrink: 0,
        }}
      >
        ? No driver
      </div>
    );
  }
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 5,
        fontSize: 11,
        fontWeight: 800,
        padding: '3px 9px',
        borderRadius: 16,
        background: 'var(--gray-100)',
        color: 'var(--gray-700)',
        flexShrink: 0,
      }}
    >
      <span
        style={{
          width: 14,
          height: 14,
          borderRadius: 7,
          background: 'var(--gray-300)',
          color: 'white',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 8,
          fontWeight: 800,
        }}
      >
        {(driver?.name || '?').slice(0, 1).toUpperCase()}
      </span>
      {driver?.name?.split(' ')[0] || 'TBD'} · {fmtTime(leg.departure_time)}
    </div>
  );
}

/* ================================================================== */
/* Attention card — only when there's something stalled                */
/* ================================================================== */

function AttentionCard({ sub, meId, ctx }) {
  const data = db();
  const leg = data.carpool_legs.find((l) => l.id === sub.leg_id);
  const event = leg ? data.events.find((e) => e.id === leg.event_id) : null;
  const hoursAgo = Math.round((Date.now() - new Date(sub.created_at).getTime()) / 3_600_000);

  return (
    <div
      style={{
        margin: '0 16px 16px',
        background: '#FFFBEB',
        border: '1px solid #FDE68A',
        borderRadius: 14,
        padding: '12px 14px',
        display: 'flex',
        alignItems: 'flex-start',
        gap: 10,
      }}
    >
      <div
        style={{
          width: 28,
          height: 28,
          borderRadius: 14,
          background: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 14,
          flexShrink: 0,
        }}
      >
        ⏳
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 800, color: '#78350F', lineHeight: 1.3 }}>
          No one has answered your sub request
        </div>
        <div style={{ fontSize: 11, color: 'var(--yellow-text)', marginTop: 2 }}>
          Sent {hoursAgo}h ago · {event?.title} · {leg ? fmtTime(leg.departure_time) : ''}
        </div>
        <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
          <button
            type="button"
            onClick={() => ctx.showToast('Nudge sent to your team')}
            style={{
              background: 'var(--yellow-text)',
              color: 'white',
              border: 'none',
              borderRadius: 6,
              padding: '5px 10px',
              fontSize: 11,
              fontWeight: 800,
            }}
          >
            Nudge group
          </button>
          <button
            type="button"
            onClick={() => ctx.navigate('leg', { legId: sub.leg_id })}
            style={{
              background: 'transparent',
              color: 'var(--yellow-text)',
              border: '1px solid #FCD34D',
              borderRadius: 6,
              padding: '5px 10px',
              fontSize: 11,
              fontWeight: 800,
            }}
          >
            View leg
          </button>
        </div>
      </div>
    </div>
  );
}

/* ================================================================== */
/* Footer actions — rare actions, out of the way                       */
/* ================================================================== */

function FooterActions({ onKidOut, onAddKid }) {
  return (
    <div
      style={{
        margin: '0 16px 18px',
        padding: '12px 4px',
        borderTop: '1px solid var(--gray-200)',
        display: 'flex',
        gap: 8,
        flexWrap: 'wrap',
        justifyContent: 'center',
      }}
    >
      <FooterBtn label="Kid out today" onClick={onKidOut} />
      <FooterBtn label="Add my kid to a ride" onClick={onAddKid} />
    </div>
  );
}

function FooterBtn({ label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        background: 'transparent',
        color: 'var(--gray-700)',
        border: '1px solid var(--gray-300)',
        borderRadius: 999,
        padding: '6px 12px',
        fontSize: 12,
        fontWeight: 700,
      }}
    >
      {label}
    </button>
  );
}

/* ================================================================== */
/* Backend-mode "live data" indicator                                  */
/* ================================================================== */

function LiveDataPill() {
  return (
    <span
      title="Today and Open Shifts are reading from the Kinpala backend"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        padding: '2px 8px',
        borderRadius: 999,
        background: 'var(--green-100)',
        color: 'var(--green-text)',
        fontSize: 10,
        fontWeight: 800,
        letterSpacing: 0.4,
        textTransform: 'uppercase',
        border: '1px solid var(--green-500)',
      }}
    >
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: 3,
          background: 'var(--green-700)',
        }}
      />
      Live data
    </span>
  );
}

/* ================================================================== */
/* GameChanger import nudge (preserved)                                */
/* ================================================================== */

function GameChangerHint({ me, ctx }) {
  if (!shouldShowGcHint(me.id)) return null;
  const team = getTeamsForParent(me.id)[0];
  if (!team) return null;

  const dismiss = () => dismissGcHint();
  const open = () => {
    dismissGcHint();
    ctx.navigate('add_schedule_source', { teamId: team.id });
  };

  return (
    <div
      className="card"
      style={{
        margin: '0 16px 14px',
        padding: 14,
        background: 'var(--blue-100)',
        borderRadius: 14,
      }}
    >
      <div className="row-between" style={{ marginBottom: 8 }}>
        <div className="row" style={{ gap: 8, alignItems: 'center' }}>
          <span style={{ fontSize: 20 }}>🟢</span>
          <div className="h3" style={{ color: 'var(--blue-text)' }}>
            Import your real schedule
          </div>
        </div>
        <button
          type="button"
          onClick={dismiss}
          aria-label="Dismiss"
          style={{ fontSize: 18, color: 'var(--blue-text)', padding: 4 }}
        >
          ×
        </button>
      </div>
      <div style={{ fontSize: 13, color: 'var(--blue-text)', marginBottom: 10 }}>
        Pull in every {team.sport?.toLowerCase() || 'practice and game'} for{' '}
        <strong>{team.name}</strong> from GameChanger, TeamSnap, Apple/Google Calendar, or any{' '}
        <code>.ics</code> link.
      </div>
      <div className="row" style={{ gap: 8 }}>
        <button type="button" className="btn btn-primary" style={{ flex: 1 }} onClick={open}>
          Import now
        </button>
        <button type="button" className="btn btn-secondary" onClick={dismiss}>
          Not now
        </button>
      </div>
    </div>
  );
}

/* ================================================================== */
/* Sheets (preserved logic from previous version)                      */
/* ================================================================== */

function NeedSubSheet({
  open,
  onClose,
  legs,
  selectedLegId,
  onPickLeg,
  reason,
  onChangeReason,
  onSubmit,
  onEmergency,
}) {
  const selected = legs.find((l) => l.id === selectedLegId);
  const minutesUntil = selected
    ? Math.round((new Date(selected.departure_time).getTime() - Date.now()) / 60000)
    : null;
  const within = minutesUntil !== null && minutesUntil <= 30;

  return (
    <Sheet open={open} onClose={onClose}>
      <div style={{ padding: '0 4px 8px' }}>
        <div className="h2" style={{ marginBottom: 4 }}>Need a sub?</div>
        <div className="muted" style={{ fontSize: 13, marginBottom: 14 }}>
          We'll release the leg and notify your team so someone else can claim it.
        </div>

        {!selected && legs.length > 1 && (
          <>
            <div className="caps muted" style={{ marginBottom: 8 }}>
              Which leg can't you drive?
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 14 }}>
              {legs.map((l) => (
                <LegPickerRow key={l.id} leg={l} onClick={() => onPickLeg(l.id)} />
              ))}
            </div>
          </>
        )}

        {selected && (
          <>
            {legs.length > 1 && (
              <button
                type="button"
                onClick={() => onPickLeg(null)}
                style={{
                  background: 'transparent',
                  color: 'var(--green-700)',
                  fontSize: 12,
                  fontWeight: 700,
                  marginBottom: 8,
                  padding: 0,
                }}
              >
                ‹ Pick a different leg
              </button>
            )}
            <LegPickerRow leg={selected} compact />

            <div className="caps muted" style={{ marginTop: 14, marginBottom: 6 }}>
              Why? (optional, sent with the request)
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 10 }}>
              {['Sick', 'Work conflict', 'Family emergency', 'Schedule changed'].map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => onChangeReason(r)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: 999,
                    background: reason === r ? 'var(--green-700)' : 'var(--gray-100)',
                    color: reason === r ? 'white' : 'var(--gray-900)',
                    fontSize: 12,
                    fontWeight: 600,
                  }}
                >
                  {r}
                </button>
              ))}
            </div>
            <input
              className="input"
              placeholder="Or type your own…"
              value={reason}
              onChange={(e) => onChangeReason(e.target.value)}
            />

            {within ? (
              <div
                style={{
                  marginTop: 14,
                  padding: 12,
                  background: 'var(--red-100)',
                  borderRadius: 12,
                  fontSize: 12,
                  color: '#7f1d1d',
                }}
              >
                <strong>Less than 30 min away.</strong> Releasing this close requires an emergency
                cancellation — we'll alert co-parents directly so a kid isn't left stranded.
              </div>
            ) : (
              minutesUntil !== null && (
                <div className="muted" style={{ fontSize: 11, marginTop: 10 }}>
                  Departure in {formatCountdown(minutesUntil)} — plenty of time for someone to pick
                  it up.
                </div>
              )
            )}

            <button
              type="button"
              className="btn btn-primary"
              style={{
                marginTop: 14,
                background: within
                  ? 'linear-gradient(135deg, #dc2626, #991b1b)'
                  : undefined,
              }}
              onClick={within ? onEmergency : onSubmit}
            >
              {within ? 'Open emergency cancel →' : 'Send sub request'}
            </button>
            <button
              type="button"
              className="btn btn-ghost"
              style={{ marginTop: 8 }}
              onClick={onClose}
            >
              Cancel
            </button>
          </>
        )}
      </div>
    </Sheet>
  );
}

function LegPickerRow({ leg, onClick, compact = false }) {
  const data = db();
  const event = data.events.find((e) => e.id === leg.event_id);
  const kids = getKidsInLeg(leg.id);
  const dt = new Date(leg.departure_time);
  const when = dt.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
  const time = dt.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  const directionLabel = leg.direction === 'to_event' ? 'Drop-off' : 'Pick-up';

  const inner = (
    <>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 700, fontSize: 14 }}>{event?.title || 'Leg'}</div>
        <div className="muted" style={{ fontSize: 12, marginTop: 2 }}>
          {directionLabel} · {when} · {time}
        </div>
        {kids.length > 0 && (
          <div className="muted" style={{ fontSize: 11, marginTop: 2 }}>
            {kids.length} kid{kids.length === 1 ? '' : 's'}: {kids.map((k) => k.name).join(', ')}
          </div>
        )}
      </div>
      {onClick && <span style={{ fontSize: 18, color: 'var(--gray-500)' }}>›</span>}
    </>
  );

  if (!onClick) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: 12,
          background: compact ? 'var(--gray-50)' : 'white',
          borderRadius: 12,
          border: '1px solid var(--gray-100)',
        }}
      >
        {inner}
      </div>
    );
  }
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: 12,
        background: 'white',
        borderRadius: 12,
        border: '1px solid var(--gray-200)',
        textAlign: 'left',
        width: '100%',
      }}
    >
      {inner}
    </button>
  );
}

function formatCountdown(min) {
  if (min < 60) return `${min} min`;
  const h = Math.floor(min / 60);
  const m = min % 60;
  if (h < 24) return m === 0 ? `${h}h` : `${h}h ${m}m`;
  const d = Math.floor(h / 24);
  return `${d}d ${h % 24}h`;
}

function RunningLateSheet({ open, onClose, legs, selectedLegId, onPickLeg, onSendDelay, onClearLate }) {
  const selected = legs.find((l) => l.id === selectedLegId);
  const isInProgress = selected?.status === 'in_progress';
  const minutesUntil = selected
    ? Math.round((new Date(selected.departure_time).getTime() - Date.now()) / 60000)
    : null;

  return (
    <Sheet open={open} onClose={onClose}>
      <div style={{ padding: '0 4px 8px' }}>
        <div className="h2" style={{ marginBottom: 4 }}>Running late?</div>
        <div className="muted" style={{ fontSize: 13, marginBottom: 14 }}>
          We'll let parents know with a new ETA so no one is left waiting.
        </div>

        {!selected && legs.length > 1 && (
          <>
            <div className="caps muted" style={{ marginBottom: 8 }}>
              Which leg?
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 14 }}>
              {legs.map((l) => (
                <LegPickerRow key={l.id} leg={l} onClick={() => onPickLeg(l.id)} />
              ))}
            </div>
          </>
        )}

        {selected && (
          <>
            {legs.length > 1 && (
              <button
                type="button"
                onClick={() => onPickLeg(null)}
                style={{
                  background: 'transparent',
                  color: 'var(--green-700)',
                  fontSize: 12,
                  fontWeight: 700,
                  marginBottom: 8,
                  padding: 0,
                }}
              >
                ‹ Pick a different leg
              </button>
            )}
            <LegPickerRow leg={selected} compact />

            {minutesUntil !== null && minutesUntil > 0 && (
              <div className="muted" style={{ fontSize: 11, marginTop: 10 }}>
                Departure in {formatCountdown(minutesUntil)}
              </div>
            )}

            <div className="caps muted" style={{ marginTop: 14, marginBottom: 8 }}>
              How late?
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6 }}>
              {[5, 10, 15, 30].map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => onSendDelay(d)}
                  style={{
                    padding: '12px 6px',
                    borderRadius: 12,
                    background: 'var(--yellow-100)',
                    color: '#92400e',
                    fontSize: 13,
                    fontWeight: 800,
                    lineHeight: 1.1,
                  }}
                >
                  +{d} min
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => onSendDelay(null)}
              style={{
                marginTop: 8,
                width: '100%',
                padding: 10,
                borderRadius: 12,
                background: 'var(--gray-100)',
                color: 'var(--gray-900)',
                fontSize: 12,
                fontWeight: 700,
              }}
            >
              Just a heads up — no specific time
            </button>

            {isInProgress && (
              <button
                type="button"
                onClick={onClearLate}
                style={{
                  marginTop: 14,
                  width: '100%',
                  padding: 10,
                  borderRadius: 12,
                  background: 'var(--green-100)',
                  color: 'var(--green-900)',
                  fontSize: 12,
                  fontWeight: 800,
                }}
              >
                ✓ Made it back on time
              </button>
            )}

            <button
              type="button"
              className="btn btn-ghost"
              style={{ marginTop: 8 }}
              onClick={onClose}
            >
              Cancel
            </button>
          </>
        )}
      </div>
    </Sheet>
  );
}

function KidOutSheet({ open, onClose, rows, meId: _meId, onRemove }) {
  const [step, setStep] = useState('pick');
  const [picked, setPicked] = useState(null);
  const [reason, setReason] = useState('');

  useEffect(() => {
    if (open) {
      setStep('pick');
      setPicked(null);
      setReason('');
    }
  }, [open]);

  const groups = useMemo(() => groupRowsByKidEvent(rows), [rows]);

  if (!open) return null;

  const pickedGroup = picked
    ? groups.find((g) => g.child.id === picked.childId && g.event.id === picked.eventId)
    : null;
  const within =
    pickedGroup &&
    pickedGroup.legs.some(
      (l) =>
        Math.round((new Date(l.departure_time).getTime() - Date.now()) / 60000) <= 30,
    );

  return (
    <Sheet open={open} onClose={onClose}>
      <div style={{ padding: '0 4px 8px' }}>
        <div className="h2" style={{ marginBottom: 4 }}>Mark a kid out</div>
        <div className="muted" style={{ fontSize: 13, marginBottom: 14 }}>
          Pulls your kid from the carpool seat(s) and notifies the driver.
        </div>

        {step === 'pick' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {groups.map((g) => {
              const leg = g.legs[0];
              const dt = new Date(leg.departure_time);
              const when = dt.toLocaleDateString([], {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
              });
              return (
                <button
                  key={`${g.child.id}-${g.event.id}`}
                  type="button"
                  onClick={() => {
                    setPicked({ childId: g.child.id, eventId: g.event.id });
                    setStep('confirm');
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: 12,
                    background: 'white',
                    borderRadius: 12,
                    border: '1px solid var(--gray-200)',
                    textAlign: 'left',
                    width: '100%',
                  }}
                >
                  <Avatar name={g.child.name} color={g.child.avatar_color} photo={g.child.photo} size="sm" />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>
                      {g.child.name} → {g.event.title}
                    </div>
                    <div className="muted" style={{ fontSize: 12, marginTop: 2 }}>
                      {when} ·{' '}
                      {g.legs
                        .map((l) => (l.direction === 'to_event' ? 'drop-off' : 'pick-up'))
                        .join(' + ')}
                    </div>
                  </div>
                  <span style={{ fontSize: 18, color: 'var(--gray-500)' }}>›</span>
                </button>
              );
            })}
          </div>
        )}

        {step === 'confirm' && pickedGroup && (
          <>
            <button
              type="button"
              onClick={() => setStep('pick')}
              style={{
                background: 'transparent',
                color: 'var(--green-700)',
                fontSize: 12,
                fontWeight: 700,
                marginBottom: 8,
                padding: 0,
              }}
            >
              ‹ Pick a different ride
            </button>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: 12,
                background: 'var(--gray-50)',
                borderRadius: 12,
                border: '1px solid var(--gray-100)',
              }}
            >
              <Avatar name={pickedGroup.child.name} color={pickedGroup.child.avatar_color} photo={pickedGroup.child.photo} size="sm" />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 14 }}>
                  Pull {pickedGroup.child.name} from {pickedGroup.event.title}
                </div>
                <div className="muted" style={{ fontSize: 12, marginTop: 2 }}>
                  Removes from{' '}
                  {pickedGroup.legs
                    .map((l) => (l.direction === 'to_event' ? 'drop-off' : 'pick-up'))
                    .join(' + ')}{' '}
                  ({pickedGroup.legs.length} seat{pickedGroup.legs.length === 1 ? '' : 's'})
                </div>
              </div>
            </div>

            <div className="caps muted" style={{ marginTop: 14, marginBottom: 6 }}>
              Why? (optional)
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {['Sick', 'Family conflict', 'School thing', 'Other plans'].map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setReason(r)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: 999,
                    background: reason === r ? 'var(--green-700)' : 'var(--gray-100)',
                    color: reason === r ? 'white' : 'var(--gray-900)',
                    fontSize: 12,
                    fontWeight: 600,
                  }}
                >
                  {r}
                </button>
              ))}
            </div>

            {within ? (
              <div
                style={{
                  marginTop: 14,
                  padding: 12,
                  background: 'var(--red-100)',
                  borderRadius: 12,
                  fontSize: 12,
                  color: '#7f1d1d',
                }}
              >
                <strong>Less than 30 min away.</strong> Too close to remove silently — please call
                your driver directly.
              </div>
            ) : (
              <button
                type="button"
                className="btn btn-primary"
                style={{ marginTop: 14 }}
                onClick={() => onRemove(pickedGroup.legs.map((l) => ({ ...pickedGroup, leg: l })), reason)}
              >
                Pull {pickedGroup.child.name} from {pickedGroup.legs.length} seat
                {pickedGroup.legs.length === 1 ? '' : 's'}
              </button>
            )}
            <button
              type="button"
              className="btn btn-ghost"
              style={{ marginTop: 8 }}
              onClick={onClose}
            >
              Cancel
            </button>
          </>
        )}
      </div>
    </Sheet>
  );
}

function groupRowsByKidEvent(rows) {
  const byKey = new Map();
  for (const r of rows) {
    const key = `${r.child.id}::${r.event.id}`;
    if (!byKey.has(key)) {
      byKey.set(key, { child: r.child, event: r.event, legs: [] });
    }
    byKey.get(key).legs.push(r.leg);
  }
  return [...byKey.values()].map((g) => ({
    ...g,
    legs: g.legs.sort((a, b) => a.departure_time.localeCompare(b.departure_time)),
  }));
}

function AddMyKidSheet({ open, onClose, rows, onAdd }) {
  if (!open) return null;
  return (
    <Sheet open={open} onClose={onClose}>
      <div style={{ padding: '0 4px 8px' }}>
        <div className="h2" style={{ marginBottom: 4 }}>Add my kid to a ride</div>
        <div className="muted" style={{ fontSize: 13, marginBottom: 14 }}>
          Upcoming legs with an open seat. Tap one to claim a spot.
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {rows.map((row, i) => {
            const dt = new Date(row.leg.departure_time);
            const when = dt.toLocaleDateString([], {
              weekday: 'short',
              month: 'short',
              day: 'numeric',
            });
            const time = dt.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
            const direction = row.leg.direction === 'to_event' ? 'Drop-off' : 'Pick-up';
            return (
              <button
                key={`${row.leg.id}-${row.kid.id}-${i}`}
                type="button"
                onClick={() => onAdd(row)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: 12,
                  background: 'white',
                  borderRadius: 12,
                  border: '1px solid var(--gray-200)',
                  textAlign: 'left',
                  width: '100%',
                }}
              >
                <Avatar name={row.kid.name} color={row.kid.avatar_color} photo={row.kid.photo} size="sm" />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>
                    {row.kid.name} → {row.event.title}
                  </div>
                  <div className="muted" style={{ fontSize: 12, marginTop: 2 }}>
                    {direction} · {when} · {time}
                  </div>
                  <div className="muted" style={{ fontSize: 11, marginTop: 2 }}>
                    {row.driver
                      ? `Driver: ${row.driver.name.split(' ')[0]}`
                      : 'No driver yet — pre-claim a seat'}
                    {' · '}
                    <span
                      style={{
                        color:
                          row.seatsLeft === 1
                            ? '#92400e'
                            : row.seatsLeft <= 0
                              ? '#7f1d1d'
                              : 'var(--gray-500)',
                        fontWeight: 700,
                      }}
                    >
                      {row.seatsLeft <= 0
                        ? 'no seats yet'
                        : `${row.seatsLeft} seat${row.seatsLeft === 1 ? '' : 's'} left`}
                    </span>
                  </div>
                </div>
                <span style={{ fontSize: 18, color: 'var(--gray-500)' }}>›</span>
              </button>
            );
          })}
        </div>

        <button
          type="button"
          className="btn btn-ghost"
          style={{ marginTop: 12 }}
          onClick={onClose}
        >
          Cancel
        </button>
      </div>
    </Sheet>
  );
}
