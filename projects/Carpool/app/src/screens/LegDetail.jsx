import { useState } from 'react';
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
  const leg = getLeg(legId);
  const event = leg ? getEvent(leg.event_id) : null;
  const [signUpOpen, setSignUpOpen] = useState(false);
  const [assignOpen, setAssignOpen] = useState(false);
  const [emergencyOpen, setEmergencyOpen] = useState(false);

  if (!leg || !event) {
    return (
      <>
        <TopNav title="Leg" onBack={() => ctx.navigate('today')} />
        <div className="empty">This leg no longer exists.</div>
      </>
    );
  }

  const driver = leg.driver_id ? getParent(leg.driver_id) : null;
  const kids = getKidsInLeg(leg.id);
  const seats = getSeatsForLeg(leg.id);
  const seatsLeft = leg.seat_capacity - seats.length;
  const myKids = getKidsForParent(me.id);
  const myKidsInLeg = kids.filter((k) =>
    getCoParentsForChild(k.id).some((p) => p.id === me.id),
  );
  const isDriver = leg.driver_id === me.id;
  const isOpen = !leg.driver_id;
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
              <Avatar name={driver.name} color={driver.avatar_color} size="lg" />
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
      <Avatar name={child.name} color={child.avatar_color} />
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
              <Avatar name={k.name} color={k.avatar_color} />
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

function estimateRecurringCount(eventIso) {
  // Count how many same-DOW occurrences we'd cover until end of season (~12 weeks).
  return 12;
}
