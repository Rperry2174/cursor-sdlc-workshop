import { useEffect, useState } from 'react';
import {
  getCurrentParent,
  getLeg,
  getEvent,
  getParent,
  getKidsInLeg,
  getKidsForParent,
  getCoParentsForChild,
  getSeatsForLeg,
  getLegsForEvent,
  getOpenSubRequestForLeg,
} from '../data/store.js';
import {
  claimLeg,
  seatKid,
  unseatKid,
  releaseLeg,
  postRideStatus,
  createRecurringCommitmentAndMaterialize,
  postSystemChat,
} from '../data/lifecycle.js';
import {
  claimLegBackend,
  loadBackendLegDetail,
  notifyTeamLegChange,
  openSubRequestForLegBackend,
  releaseLegBackend,
  seatKidBackend,
  subscribeToCarpoolLegs,
  unseatKidBackend,
} from '../data/operationalBackend.js';
import { Avatar } from '../components/Avatar.jsx';
import { Sheet } from '../components/Sheet.jsx';
import { Toggle } from '../components/Toggle.jsx';
import { Stepper } from '../components/Stepper.jsx';
import { TopNav } from '../components/TopNav.jsx';
import { SourceBadge } from '../components/SourceBadge.jsx';

function fmtTime(iso) {
  return new Date(iso).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}

function fmtFullDate(iso) {
  return new Date(iso).toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' });
}

function dayOfWeek(iso) {
  return new Date(iso).toLocaleDateString([], { weekday: 'long' });
}

export function LegDetail({ legId, ctx }) {
  const me = getCurrentParent();
  const localLeg = getLeg(legId);
  const localEvent = localLeg ? getEvent(localLeg.event_id) : null;

  // If the leg is in the local prototype store, render the rich legacy UI
  // unchanged. Otherwise this is a backend-mode click (real Supabase UUID),
  // so we delegate to the backend-aware view below.
  if (!localLeg || !localEvent) {
    return <BackendLegDetail legId={legId} ctx={ctx} />;
  }

  return <LocalLegDetail leg={localLeg} event={localEvent} me={me} ctx={ctx} />;
}

function LocalLegDetail({ leg, event, me, ctx }) {
  const [signUpOpen, setSignUpOpen] = useState(false);
  const [assignOpen, setAssignOpen] = useState(false);
  const [emergencyOpen, setEmergencyOpen] = useState(false);

  const driver = leg.driver_id ? getParent(leg.driver_id) : null;
  const kids = getKidsInLeg(leg.id);
  const seats = getSeatsForLeg(leg.id);
  const seatsLeft = leg.seat_capacity - seats.length;
  const myKids = getKidsForParent(me.id);
  const myKidsInLeg = kids.filter((k) =>
    getCoParentsForChild(k.id).some((p) => p.id === me.id),
  );
  const isDriver = leg.driver_id === me.id;
  const isCancelled = leg.status === 'cancelled';
  const openSub = getOpenSubRequestForLeg(leg.id);

  return (
    <>
      <TopNav
        title={leg.direction === 'to_event' ? 'Drop-off' : 'Pick-up'}
        onBack={() => ctx.navigate('today')}
      />

      <div className="section">
        {/* Event header */}
        <div className="card">
          <div className="caps muted">{fmtFullDate(event.start_at)}</div>
          <div className="h2" style={{ marginTop: 4 }}>
            {event.type === 'game' ? '⚾ ' : event.type === 'imported' ? '📅 ' : '🏟️ '}
            {event.title}
          </div>
          <div style={{ marginTop: 8 }}>
            <SourceBadge event={event} />
          </div>
          <div style={{ marginTop: 12, display: 'grid', gap: 6 }}>
            <Row icon="🕒" label="Departure" value={fmtTime(leg.departure_time)} />
            <Row icon="📍" label="From" value={leg.departure_location} />
            <Row icon="🏁" label="To" value={leg.arrival_location} />
          </div>
        </div>

        {openSub && !isCancelled && (
          <button
            type="button"
            className="card"
            style={{
              width: '100%',
              textAlign: 'left',
              background: 'linear-gradient(135deg, var(--yellow-500), #d97706)',
              color: 'white',
              cursor: 'pointer',
            }}
            onClick={() => ctx.navigate('sub_response', { subRequestId: openSub.id })}
          >
            <div className="caps" style={{ opacity: 0.9 }}>🆘 Open sub request</div>
            <div style={{ fontWeight: 700, fontSize: 16, marginTop: 4 }}>
              {getParent(openSub.requested_by)?.name?.split(' ')[0]} needs a sub for this leg
            </div>
            <div style={{ fontSize: 13, marginTop: 4, opacity: 0.95 }}>Tap to respond →</div>
          </button>
        )}

        {isCancelled && (
          <div className="card" style={{ background: 'var(--red-100)', border: '1.5px solid var(--red-500)' }}>
            <div className="h3" style={{ color: 'var(--red-text)' }}>This leg was cancelled</div>
            <div className="muted" style={{ fontSize: 13, marginTop: 4 }}>
              The driver had to cancel due to an emergency. Coordinate directly if needed.
            </div>
          </div>
        )}

        {/* Driver */}
        <div className="card">
          <div className="caps muted">Driver</div>
          {driver ? (
            <div className="row" style={{ marginTop: 8 }}>
              <Avatar name={driver.name} color={driver.avatar_color} photo={driver.photo} size="lg" />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 17 }}>{driver.name}</div>
                <div className="muted" style={{ fontSize: 13 }}>
                  {leg.seat_capacity} seats · {seatsLeft} open
                </div>
              </div>
              <a
                href={`tel:${driver.phone}`}
                className="btn btn-secondary"
                style={{ width: 'auto', padding: '10px 14px', fontSize: 13 }}
              >
                📞 Call
              </a>
            </div>
          ) : (
            <div style={{ marginTop: 8 }}>
              <div className="muted" style={{ fontSize: 14, marginBottom: 12 }}>
                No one has signed up yet.
              </div>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => setSignUpOpen(true)}
                disabled={isCancelled}
              >
                I'll drive this leg
              </button>
            </div>
          )}
          {isDriver && !isCancelled && (
            <div style={{ marginTop: 12 }}>
              <button
                type="button"
                onClick={() => ctx.navigate('active_ride', { legId: leg.id })}
                style={{
                  width: '100%',
                  padding: '14px',
                  borderRadius: 12,
                  fontWeight: 800,
                  fontSize: 15,
                  color: 'white',
                  background: 'linear-gradient(135deg, var(--green-700), var(--green-900))',
                  marginBottom: 10,
                  boxShadow: '0 4px 12px rgba(27,67,50,0.25)',
                }}
              >
                🗺️ Open ride mode
              </button>
              <ActiveRideControls leg={leg} ctx={ctx} />
              <button
                type="button"
                className="btn btn-ghost"
                style={{ marginTop: 8, color: 'var(--red-text)' }}
                onClick={() => {
                  const result = releaseLeg(leg.id, me.id);
                  if (result.ok) {
                    ctx.showToast('Sub request opened to the team');
                  } else if (result.reason === 'requires_emergency') {
                    setEmergencyOpen(true);
                  } else {
                    ctx.showToast(`Could not release: ${result.reason}`);
                  }
                }}
              >
                Release this leg
              </button>
            </div>
          )}
        </div>

        {/* Passengers */}
        <div className="card">
          <div className="row-between">
            <div className="caps muted">Passengers</div>
            <div className="muted" style={{ fontSize: 12 }}>
              {seats.length} / {leg.seat_capacity}
            </div>
          </div>
          {kids.length === 0 ? (
            <div className="muted" style={{ marginTop: 8, fontSize: 14 }}>
              No kids assigned yet.
            </div>
          ) : (
            <div style={{ marginTop: 8 }}>
              {kids.map((k) => (
                <PassengerRow
                  key={k.id}
                  child={k}
                  meId={me.id}
                  legId={leg.id}
                  onUnseat={(reason) => {
                    if (reason === 'within_cancel_window') {
                      ctx.showToast('Pickup is within 30 min — call the driver directly');
                    }
                  }}
                />
              ))}
            </div>
          )}
          {myKids.length > 0 && !isCancelled && seatsLeft > 0 && (
            <button
              type="button"
              className="btn btn-secondary"
              style={{ marginTop: 12 }}
              onClick={() => setAssignOpen(true)}
              disabled={!leg.driver_id}
            >
              {leg.driver_id ? `Add my kid (${seatsLeft} seats open)` : 'Add my kid (need a driver first)'}
            </button>
          )}
          {myKidsInLeg.length > 0 && (
            <div className="pill pill-blue" style={{ marginTop: 12 }}>
              ★ Your {myKidsInLeg.length === 1 ? 'kid is' : 'kids are'} in this car
            </div>
          )}
        </div>

        {leg.notes && (
          <div className="card">
            <div className="caps muted">Driver note</div>
            <div style={{ marginTop: 6, fontSize: 14 }}>{leg.notes}</div>
          </div>
        )}
      </div>

      <SignUpSheet
        open={signUpOpen}
        onClose={() => setSignUpOpen(false)}
        leg={leg}
        event={event}
        meId={me.id}
        ctx={ctx}
      />

      <AssignKidSheet
        open={assignOpen}
        onClose={() => setAssignOpen(false)}
        legId={leg.id}
        meId={me.id}
        myKids={myKids}
        ctx={ctx}
      />

      <EmergencySheet
        open={emergencyOpen}
        onClose={() => setEmergencyOpen(false)}
        legId={leg.id}
        meId={me.id}
        ctx={ctx}
      />
    </>
  );
}

function Row({ icon, label, value }) {
  return (
    <div className="row" style={{ alignItems: 'baseline', gap: 8 }}>
      <span style={{ fontSize: 14 }}>{icon}</span>
      <span className="muted" style={{ fontSize: 13, minWidth: 64 }}>
        {label}
      </span>
      <span style={{ fontWeight: 600, fontSize: 14 }}>{value}</span>
    </div>
  );
}

function PassengerRow({ child, meId, legId, onUnseat }) {
  const coParents = getCoParentsForChild(child.id);
  const canUnseat = coParents.some((p) => p.id === meId);
  const primary = coParents[0];
  return (
    <div className="list-row">
      <Avatar name={child.name} color={child.avatar_color} photo={child.photo} />
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 700, fontSize: 15 }}>{child.name}</div>
        <div className="muted" style={{ fontSize: 12 }}>
          age {child.age} · parent: {primary?.name?.split(' ')[0]}
        </div>
      </div>
      {primary && (
        <a
          href={`tel:${primary.phone}`}
          className="btn btn-ghost"
          style={{ width: 'auto', padding: '6px 10px', fontSize: 12 }}
        >
          📞
        </a>
      )}
      {canUnseat && (
        <button
          type="button"
          className="btn btn-ghost"
          style={{ width: 'auto', padding: '6px 10px', fontSize: 12, color: 'var(--red-text)' }}
          onClick={() => {
            const r = unseatKid(legId, child.id, meId);
            if (!r.ok && onUnseat) onUnseat(r.reason);
          }}
        >
          Remove
        </button>
      )}
    </div>
  );
}

function ActiveRideControls({ leg, ctx }) {
  const me = getCurrentParent();
  const steps = [
    { kind: 'en_route', label: '🚗 On my way', toast: 'Notified passenger parents' },
    { kind: 'kid_picked_up', label: '🧒 Kids in car', toast: 'Notified passenger parents' },
    { kind: 'arrived', label: '🏁 Arrived', toast: 'Notified passenger parents' },
    { kind: 'kid_dropped_off', label: '✅ Dropped off', toast: 'All set — leg complete' },
    { kind: 'running_late', label: '⏰ Running late', toast: 'Notified passenger parents' },
  ];
  return (
    <div>
      <div className="caps muted" style={{ marginBottom: 8 }}>Status updates</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        {steps.map((s) => (
          <button
            key={s.kind}
            type="button"
            className={s.kind === 'running_late' ? 'btn btn-warn' : 'btn btn-secondary'}
            style={{ padding: '10px 8px', fontSize: 13 }}
            onClick={() => {
              const r = postRideStatus(leg.id, me.id, s.kind);
              if (r.ok) ctx.showToast(s.toast);
            }}
          >
            {s.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function SignUpSheet({ open, onClose, leg, event, meId, ctx }) {
  const me = getCurrentParent();
  const [seats, setSeats] = useState(me?.default_seats ?? 4);
  const [alsoOther, setAlsoOther] = useState(false);
  const [recurring, setRecurring] = useState(false);

  // For "also drive other leg", we don't actually have the sibling leg here.
  // In production we'd join. Demo: no-op toggle that's part of the design pattern.
  const recurringCount = recurring
    ? estimateRecurringCount(event.start_at)
    : 1;
  const totalCount = recurringCount + (alsoOther ? recurringCount : 0);

  const submit = () => {
    let totalClaimed = 0;
    if (recurring) {
      const result = createRecurringCommitmentAndMaterialize({
        parent_id: meId,
        team_id: event.team_id,
        day_of_week: new Date(event.start_at).getDay(),
        direction: leg.direction,
        seat_capacity: seats,
      });
      totalClaimed += result.claimed;
      postSystemChat(
        event.team_id,
        `${me.name.split(' ')[0]} claimed every ${dayOfWeek(event.start_at)} ${leg.direction === 'to_event' ? 'drop-off' : 'pick-up'} (recurring).`,
      );
      if (alsoOther) {
        const oppDir = leg.direction === 'to_event' ? 'from_event' : 'to_event';
        const r2 = createRecurringCommitmentAndMaterialize({
          parent_id: meId,
          team_id: event.team_id,
          day_of_week: new Date(event.start_at).getDay(),
          direction: oppDir,
          seat_capacity: seats,
        });
        totalClaimed += r2.claimed;
      }
      ctx.showToast(`Recurring slot saved — ${totalClaimed} legs booked`);
      onClose();
      return;
    }
    const r = claimLeg(leg.id, meId, seats);
    if (r.ok) {
      ctx.showToast("You're driving this leg");
      postSystemChat(
        event.team_id,
        `${me.name.split(' ')[0]} claimed the ${leg.direction === 'to_event' ? 'drop-off' : 'pick-up'} for ${event.title}.`,
        event.id,
      );
      if (alsoOther) {
        const sibling = getLegsForEvent(leg.event_id).find((l) => l.id !== leg.id);
        if (sibling && !sibling.driver_id) claimLeg(sibling.id, meId, seats);
      }
      onClose();
    } else if (r.reason === 'taken') {
      ctx.showToast(`${r.currentDriver?.name?.split(' ')[0]} just claimed this`);
      onClose();
    } else {
      ctx.showToast(`Could not claim: ${r.reason}`);
    }
  };

  if (!open) return null;
  return (
    <Sheet open={open} onClose={onClose}>
      <div className="caps muted" style={{ marginBottom: 4 }}>You're signing up to drive</div>
      <div className="h2">{leg.direction === 'to_event' ? 'Drop-off' : 'Pick-up'} for {event.title}</div>
      <div className="muted" style={{ fontSize: 14, marginTop: 4 }}>
        {fmtTime(leg.departure_time)} · {leg.departure_location} → {leg.arrival_location}
      </div>

      <div
        className="card"
        style={{
          marginTop: 16,
          background: 'linear-gradient(135deg, var(--green-700), var(--green-900))',
          color: 'white',
        }}
      >
        <div className="caps" style={{ opacity: 0.7 }}>The trip</div>
        <div style={{ fontSize: 18, fontWeight: 700, marginTop: 4 }}>
          {leg.direction === 'to_event' ? 'Drive kids from school to' : 'Pick kids up from'}{' '}
          {leg.direction === 'to_event' ? leg.arrival_location : leg.departure_location}
        </div>
        <div style={{ opacity: 0.85, fontSize: 13, marginTop: 6 }}>
          Departs {fmtTime(leg.departure_time)}
        </div>
      </div>

      <div className="card">
        <label className="field">How many seats are in your car?</label>
        <div className="row-between" style={{ marginTop: 4 }}>
          <span className="muted" style={{ fontSize: 13 }}>Including the driver's row</span>
          <Stepper value={seats} onChange={setSeats} min={1} max={8} />
        </div>
      </div>

      <div className="card" style={{ padding: 12 }}>
        <div className="row-between" style={{ padding: '6px 4px' }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: 14 }}>Also drive the other leg</div>
            <div className="muted" style={{ fontSize: 12 }}>
              {leg.direction === 'to_event' ? 'Pick them up after too' : 'Drop them off earlier too'}
            </div>
          </div>
          <Toggle on={alsoOther} onChange={setAlsoOther} />
        </div>
        <div style={{ borderTop: '1px solid var(--gray-100)' }} />
        <div className="row-between" style={{ padding: '12px 4px 6px' }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: 14 }}>
              Repeat every {dayOfWeek(event.start_at)}
            </div>
            <div className="muted" style={{ fontSize: 12 }}>
              Commit to this slot for the rest of the season. You can change anytime.
            </div>
          </div>
          <Toggle on={recurring} onChange={setRecurring} />
        </div>
      </div>

      <button type="button" className="btn btn-primary" style={{ marginTop: 16 }} onClick={submit}>
        Yes, I'll drive {totalCount > 1 ? `(${totalCount} slots)` : ''}
      </button>
      <button type="button" className="btn btn-ghost" style={{ marginTop: 8 }} onClick={onClose}>
        Maybe later
      </button>
    </Sheet>
  );
}

function AssignKidSheet({ open, onClose, legId, meId, myKids, ctx }) {
  const seats = open ? getSeatsForLeg(legId) : [];
  const seatedIds = new Set(seats.map((s) => s.child_id));
  return (
    <Sheet open={open} onClose={onClose}>
      <div className="h2">Add a kid to this carpool</div>
      <div className="muted" style={{ fontSize: 14, marginTop: 4 }}>
        Tap a kid to add them. They'll ride with the driver.
      </div>
      <div style={{ marginTop: 16 }}>
        {myKids.map((k) => {
          const seated = seatedIds.has(k.id);
          return (
            <button
              key={k.id}
              type="button"
              disabled={seated}
              className="card"
              style={{
                display: 'flex',
                width: '100%',
                gap: 12,
                alignItems: 'center',
                padding: 14,
                opacity: seated ? 0.5 : 1,
              }}
              onClick={() => {
                const r = seatKid(legId, k.id, meId);
                if (r.ok) {
                  ctx.showToast(`${k.name} added`);
                  onClose();
                } else {
                  ctx.showToast(`Could not add: ${r.reason}`);
                }
              }}
            >
              <Avatar name={k.name} color={k.avatar_color} photo={k.photo} />
              <div style={{ flex: 1, textAlign: 'left' }}>
                <div style={{ fontWeight: 700 }}>{k.name}</div>
                <div className="muted" style={{ fontSize: 12 }}>
                  age {k.age} · {k.position || k.school}
                </div>
              </div>
              {seated && <span className="pill pill-green">Already in</span>}
            </button>
          );
        })}
      </div>
      <button type="button" className="btn btn-ghost" style={{ marginTop: 8 }} onClick={onClose}>
        Cancel
      </button>
    </Sheet>
  );
}

function EmergencySheet({ open, onClose, legId, meId, ctx }) {
  const [reason, setReason] = useState('');
  return (
    <Sheet open={open} onClose={onClose}>
      <div className="h2" style={{ color: 'var(--red-text)' }}>Emergency cancellation</div>
      <div className="muted" style={{ fontSize: 14, marginTop: 4 }}>
        It's within 30 minutes of pickup. Cancelling now will alert all parents whose kids are in
        your car and ask them to sub in.
      </div>
      <label className="field" style={{ marginTop: 16 }}>What happened? (required)</label>
      <textarea
        className="input"
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        rows={3}
        placeholder="e.g. car trouble, sick kid, work emergency"
      />
      <button
        type="button"
        className="btn btn-danger"
        style={{ marginTop: 16 }}
        disabled={reason.trim().length < 3}
        onClick={() => {
          const r = releaseLeg(legId, meId, { emergency: true, reason: reason.trim() });
          if (r.ok) {
            ctx.showToast('Parents notified — they can sub in');
            onClose();
            ctx.navigate('today');
          }
        }}
      >
        Cancel and notify parents
      </button>
      <button type="button" className="btn btn-ghost" style={{ marginTop: 8 }} onClick={onClose}>
        Never mind
      </button>
    </Sheet>
  );
}

function estimateRecurringCount() {
  // Count how many same-DOW occurrences we'd cover until end of season (~12 weeks).
  return 12;
}

/* ==========================================================================
 * Backend mode: leg detail rendered from Supabase rather than the local
 * prototype store. Triggered when the legId on the URL is a real Supabase
 * UUID that the local store doesn't know about. Intentionally simpler than
 * the legacy LocalLegDetail above — covers the operational essentials
 * (event + driver + seated kids + claim/release/seat/unseat) without
 * porting every legacy flow (sub requests, recurring commitments, etc.)
 * which can come in a follow-up slice.
 * ========================================================================== */

function BackendLegDetail({ legId, ctx }) {
  const [state, setState] = useState({ status: 'loading', data: null, reason: null });
  const [busy, setBusy] = useState(false);
  const [subSheetOpen, setSubSheetOpen] = useState(false);
  const [subReason, setSubReason] = useState('');

  const refresh = async () => {
    const result = await loadBackendLegDetail(legId);
    if (result.ok) {
      setState({ status: 'ready', data: result, reason: null });
    } else if (result.skipped) {
      setState({ status: 'unavailable', data: null, reason: 'not_signed_in' });
    } else {
      setState({ status: 'error', data: null, reason: result.reason });
    }
  };

  useEffect(() => {
    let cancelled = false;
    loadBackendLegDetail(legId).then((result) => {
      if (cancelled) return;
      if (result.ok) {
        setState({ status: 'ready', data: result, reason: null });
      } else if (result.skipped) {
        setState({ status: 'unavailable', data: null, reason: 'not_signed_in' });
      } else {
        setState({ status: 'error', data: null, reason: result.reason });
      }
    });
    return () => {
      cancelled = true;
    };
  }, [legId]);

  // Realtime: any teammate editing this leg refetches.
  useEffect(() => {
    if (state.status !== 'ready') return undefined;
    const unsubscribe = subscribeToCarpoolLegs(() => refresh());
    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.status, legId]);

  if (state.status === 'loading') {
    return (
      <>
        <TopNav title="Leg" onBack={() => ctx.navigate('today')} />
        <div className="muted" style={{ padding: 24, textAlign: 'center', fontSize: 13 }}>
          Loading from Kinpala backend…
        </div>
      </>
    );
  }
  if (state.status !== 'ready') {
    return (
      <>
        <TopNav title="Leg" onBack={() => ctx.navigate('today')} />
        <div className="empty">
          {state.reason === 'leg_not_found'
            ? 'This leg no longer exists.'
            : `Could not load this leg: ${state.reason || 'unknown error'}`}
        </div>
      </>
    );
  }

  const { parent, leg, event, driver, seatedKids, myKids } = state.data;
  const seatsLeft = (leg.seat_capacity || 0) - (state.data.seats?.length || 0);
  const isDriver = leg.driver_id === parent.id;
  const isCancelled = leg.status === 'cancelled';
  const myKidsInLeg = seatedKids.filter((k) => myKids.some((mk) => mk.id === k.id));
  const seatableMyKids = myKids.filter((mk) => !seatedKids.some((sk) => sk.id === mk.id));

  const claimHere = async () => {
    setBusy(true);
    const result = await claimLegBackend(leg.id);
    setBusy(false);
    if (result.ok) {
      ctx.showToast(`You're driving the ${leg.direction === 'to_event' ? 'drop-off' : 'pick-up'}`);
      notifyTeamLegChange(leg.id, 'claimed').catch((err) =>
        console.warn('notifyTeamLegChange failed:', err),
      );
      refresh();
    } else if (result.reason === 'taken') {
      ctx.showToast('Already claimed by someone else');
      refresh();
    } else {
      ctx.showToast(`Could not claim: ${result.reason || 'unknown error'}`);
    }
  };

  const releaseHere = async () => {
    setBusy(true);
    const result = await releaseLegBackend(leg.id);
    setBusy(false);
    if (result.ok) {
      ctx.showToast('Leg released — anyone can claim it now');
      refresh();
    } else {
      ctx.showToast(`Could not release: ${result.reason || 'unknown error'}`);
    }
  };

  const addKidHere = async (kid) => {
    setBusy(true);
    const result = await seatKidBackend({ legId: leg.id, childId: kid.id });
    setBusy(false);
    if (result.ok) {
      ctx.showToast(`${kid.name} added to this ride`);
      refresh();
    } else if (result.reason === 'full') {
      ctx.showToast('This car is full — no seats left');
    } else {
      ctx.showToast(`Could not add ${kid.name}: ${result.reason || 'unknown error'}`);
    }
  };

  const removeKidHere = async (kid) => {
    setBusy(true);
    const result = await unseatKidBackend({ legId: leg.id, childId: kid.id });
    setBusy(false);
    if (result.ok) {
      ctx.showToast(`${kid.name} removed from this ride`);
      refresh();
    } else {
      ctx.showToast(`Could not remove ${kid.name}: ${result.reason || 'unknown error'}`);
    }
  };

  const requestSubHere = async () => {
    setBusy(true);
    const result = await openSubRequestForLegBackend({
      legId: leg.id,
      reason: subReason,
      emergency: false,
    });
    setBusy(false);
    if (result.ok) {
      setSubSheetOpen(false);
      setSubReason('');
      ctx.showToast('Sub request sent — your team was notified');
      notifyTeamLegChange(leg.id, 'released').catch((err) =>
        console.warn('notifyTeamLegChange failed:', err),
      );
      refresh();
    } else if (result.reason === 'requires_emergency') {
      ctx.showToast('Too close to departure — contact your team or use emergency options.');
    } else {
      ctx.showToast(`Could not open sub request: ${result.reason || 'unknown error'}`);
    }
  };

  return (
    <>
      <TopNav
        title={leg.direction === 'to_event' ? 'Drop-off' : 'Pick-up'}
        onBack={() => ctx.navigate('today')}
      />

      <div className="section">
        <div style={{ margin: '0 4px 8px' }}>
          <span className="pill pill-green" style={{ fontSize: 11, letterSpacing: 0.3 }}>
            Loaded from Kinpala backend
          </span>
        </div>

        {/* Event header */}
        <div className="card">
          <div className="caps muted">{fmtFullDate(event.start_at)}</div>
          <div className="h2" style={{ marginTop: 4 }}>
            {event.type === 'game' ? '⚾ ' : event.type === 'imported' ? '📅 ' : '🏟️ '}
            {event.title}
          </div>
          <div style={{ marginTop: 12, display: 'grid', gap: 6 }}>
            <Row icon="🕒" label="Departure" value={fmtTime(leg.departure_time)} />
            <Row icon="📍" label="From" value={leg.departure_location} />
            <Row icon="🏁" label="To" value={leg.arrival_location} />
          </div>
        </div>

        {/* Driver */}
        <div className="card">
          <div className="caps muted">Driver</div>
          {driver ? (
            <div className="row" style={{ marginTop: 8 }}>
              <Avatar name={driver.name} color={driver.avatar_color} photo={driver.photo_url} size="lg" />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 17 }}>{driver.name}</div>
                <div className="muted" style={{ fontSize: 13 }}>
                  {leg.seat_capacity} seats · {Math.max(0, seatsLeft)} open
                </div>
              </div>
              {driver.phone && (
                <a
                  href={`tel:${driver.phone}`}
                  className="btn btn-secondary"
                  style={{ width: 'auto', padding: '10px 14px', fontSize: 13 }}
                >
                  📞 Call
                </a>
              )}
            </div>
          ) : (
            <div style={{ marginTop: 8 }}>
              <div className="muted" style={{ fontSize: 14, marginBottom: 12 }}>
                No one has signed up yet.
              </div>
              <button
                type="button"
                className="btn btn-primary"
                onClick={claimHere}
                disabled={busy || isCancelled}
              >
                {busy ? 'Working…' : "I'll drive this leg"}
              </button>
            </div>
          )}
          {isDriver && !isCancelled && (
            <div style={{ marginTop: 12, display: 'grid', gap: 8 }}>
              <button
                type="button"
                className="btn btn-secondary"
                style={{ width: '100%' }}
                onClick={() => setSubSheetOpen(true)}
                disabled={busy}
              >
                Need a sub — notify team
              </button>
              <button
                type="button"
                className="btn btn-ghost"
                style={{ color: 'var(--red-text)' }}
                onClick={releaseHere}
                disabled={busy}
              >
                Release this leg (no sub request)
              </button>
            </div>
          )}
        </div>

        {/* Passengers */}
        <div className="card">
          <div className="row-between">
            <div className="caps muted">Passengers</div>
            <div className="muted" style={{ fontSize: 12 }}>
              {seatedKids.length} / {leg.seat_capacity}
            </div>
          </div>
          {seatedKids.length === 0 ? (
            <div className="muted" style={{ marginTop: 8, fontSize: 14 }}>
              No kids assigned yet.
            </div>
          ) : (
            <div style={{ marginTop: 8 }}>
              {seatedKids.map((k) => {
                const isMine = myKids.some((mk) => mk.id === k.id);
                return (
                  <div key={k.id} className="list-row">
                    <Avatar name={k.name} color={k.avatar_color} photo={k.photo_url} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: 15 }}>{k.name}</div>
                      <div className="muted" style={{ fontSize: 12 }}>
                        {k.age ? `age ${k.age}` : ''}
                        {isMine ? ' · your kid' : ''}
                      </div>
                    </div>
                    {isMine && (
                      <button
                        type="button"
                        className="btn btn-ghost"
                        style={{ width: 'auto', padding: '6px 10px', fontSize: 12, color: 'var(--red-text)' }}
                        onClick={() => removeKidHere(k)}
                        disabled={busy}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
          {seatableMyKids.length > 0 && !isCancelled && seatsLeft > 0 && (
            <div style={{ marginTop: 12, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {seatableMyKids.map((kid) => (
                <button
                  key={kid.id}
                  type="button"
                  className="btn btn-secondary"
                  style={{ width: 'auto', padding: '8px 12px', fontSize: 13 }}
                  onClick={() => addKidHere(kid)}
                  disabled={busy || !leg.driver_id}
                >
                  + Add {kid.name}
                </button>
              ))}
              {!leg.driver_id && (
                <div className="muted" style={{ fontSize: 11, marginTop: 6, width: '100%' }}>
                  A driver needs to claim the leg first.
                </div>
              )}
            </div>
          )}
          {myKidsInLeg.length > 0 && (
            <div className="pill pill-blue" style={{ marginTop: 12 }}>
              ★ Your {myKidsInLeg.length === 1 ? 'kid is' : 'kids are'} in this car
            </div>
          )}
        </div>

        {leg.notes && (
          <div className="card">
            <div className="caps muted">Driver note</div>
            <div style={{ marginTop: 6, fontSize: 14 }}>{leg.notes}</div>
          </div>
        )}
      </div>

      <Sheet open={subSheetOpen} onClose={() => setSubSheetOpen(false)}>
        <div style={{ padding: '4px 4px 12px' }}>
          <div className="h2" style={{ marginBottom: 6 }}>
            Ask for a sub
          </div>
          <div className="muted" style={{ fontSize: 13, marginBottom: 12 }}>
            You will be removed as driver and teammates get a notification so someone else can claim this leg.
          </div>
          <label className="field">
            Reason (optional)
            <textarea
              className="input"
              rows={3}
              value={subReason}
              onChange={(e) => setSubReason(e.target.value)}
              style={{ marginTop: 6, resize: 'vertical' }}
            />
          </label>
          <button
            type="button"
            className="btn btn-primary"
            style={{ marginTop: 14, width: '100%' }}
            onClick={requestSubHere}
            disabled={busy}
          >
            {busy ? 'Sending…' : 'Send sub request'}
          </button>
          <button type="button" className="btn btn-ghost" style={{ marginTop: 8 }} onClick={() => setSubSheetOpen(false)}>
            Cancel
          </button>
        </div>
      </Sheet>
    </>
  );
}
