import { useState, useMemo, useEffect } from 'react';
import {
  getCurrentParent,
  getEventsForParent,
  getEventsByDate,
  getLegsForEvent,
  getKidsInLeg,
  getParent,
  getOpenLegsForParent,
  getKidsForParent,
  getOpenSubRequestsForTeam,
  getTeamsForParent,
  getUpcomingSeatsForMyKids,
  getJoinableLegsForMyKids,
  getSourcesForTeam,
  shouldShowGcHint,
  dismissGcHint,
  db,
} from '../data/store.js';
import { postRideStatus, releaseLeg, unseatKid, seatKid } from '../data/lifecycle.js';
import { Avatar } from '../components/Avatar.jsx';
import { Sheet } from '../components/Sheet.jsx';
import { SourceBadge } from '../components/SourceBadge.jsx';
import { CalendarEmptyCTA } from '../components/CalendarEmptyCTA.jsx';

function dateKey(d) {
  return d.toISOString().slice(0, 10);
}

function formatTime(iso) {
  return new Date(iso).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}

function fmtDOW(d) {
  return d.toLocaleDateString([], { weekday: 'short' }).toUpperCase();
}

export function Today({ ctx }) {
  const me = getCurrentParent();
  const myKidIds = useMemo(() => getKidsForParent(me.id).map((k) => k.id), [me.id]);

  const days = useMemo(() => {
    const out = [];
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    for (let i = 0; i < 14; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      out.push(d);
    }
    return out;
  }, []);

  const [selected, setSelected] = useState(dateKey(days[0]));
  const events = getEventsByDate(me.id, selected);
  const openLegs = getOpenLegsForParent(me.id, 14);

  const [needSubOpen, setNeedSubOpen] = useState(false);
  const [needSubLegId, setNeedSubLegId] = useState(null);
  const [needSubReason, setNeedSubReason] = useState('');

  const [lateOpen, setLateOpen] = useState(false);
  const [lateLegId, setLateLegId] = useState(null);

  const [kidOutOpen, setKidOutOpen] = useState(false);

  const [addKidOpen, setAddKidOpen] = useState(false);

  const myUpcomingDriving = useMemo(() => {
    return db()
      .carpool_legs.filter(
        (l) =>
          l.driver_id === me.id &&
          new Date(l.departure_time).getTime() > Date.now() - 15 * 60 * 1000 &&
          new Date(l.departure_time).getTime() < Date.now() + 36 * 60 * 60 * 1000 &&
          (l.status === 'filled' || l.status === 'in_progress'),
      )
      .sort((a, b) => a.departure_time.localeCompare(b.departure_time));
  }, [me.id, selected]);

  const myUpcomingSeats = useMemo(
    () => getUpcomingSeatsForMyKids(me.id, 36),
    [me.id, selected],
  );

  const joinableLegs = useMemo(
    () => getJoinableLegsForMyKids(me.id, 14 * 24),
    [me.id, selected],
  );

  // Find the imminent leg I'm driving (within next 90 min) for the day-of card.
  const imminentLeg = useMemo(() => {
    const data = db();
    const horizon = Date.now() + 90 * 60 * 1000;
    return data.carpool_legs
      .filter(
        (l) =>
          l.driver_id === me.id &&
          (l.status === 'filled' || l.status === 'in_progress') &&
          new Date(l.departure_time).getTime() > Date.now() - 30 * 60 * 1000 &&
          new Date(l.departure_time).getTime() < horizon,
      )
      .sort((a, b) => a.departure_time.localeCompare(b.departure_time))[0];
  }, [me.id]);

  const myTeams = getTeamsForParent(me.id);
  const openSubsForMe = useMemo(() => {
    const all = [];
    for (const t of myTeams) {
      for (const s of getOpenSubRequestsForTeam(t.id)) {
        if (s.requested_by !== me.id) all.push(s);
      }
    }
    return all;
  }, [me.id, myTeams.length]);

  const [, force] = useState(0);
  useEffect(() => {
    const i = setInterval(() => force((x) => x + 1), 30_000);
    return () => clearInterval(i);
  }, []);

  // Per-day "has events that need a driver" flag
  const needsDriverByDay = useMemo(() => {
    const m = {};
    for (const d of days) {
      const evts = getEventsByDate(me.id, dateKey(d));
      for (const e of evts) {
        const legs = getLegsForEvent(e.id);
        if (legs.some((l) => !l.driver_id)) {
          m[dateKey(d)] = true;
          break;
        }
      }
    }
    return m;
  }, [days, me.id]);

  return (
    <>
      <div className="app-header">
        <div className="row-between">
          <div>
            <div className="greeting" style={{ fontSize: 13, opacity: 0.85 }}>
              Good {greeting()},
            </div>
            <div style={{ fontSize: 22, fontWeight: 800, marginTop: 2 }}>
              {me.name.split(' ')[0]}
            </div>
          </div>
          <Avatar name={me.name} color={me.avatar_color} size="lg" />
        </div>
      </div>

      <GameChangerHint me={me} ctx={ctx} />

      {openSubsForMe.map((s) => {
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

      {openLegs.length > 0 && (
        <button
          type="button"
          onClick={() => ctx.navigate('open_shifts')}
          className="alert-banner"
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            textAlign: 'left',
            cursor: 'pointer',
          }}
        >
          <span style={{ fontSize: 18 }}>⚠️</span>
          <span style={{ flex: 1 }}>
            {openLegs.length} upcoming {openLegs.length === 1 ? 'leg' : 'legs'} still{' '}
            {openLegs.length === 1 ? 'needs' : 'need'} a driver
          </span>
          <span style={{ fontWeight: 700 }}>View →</span>
        </button>
      )}

      {imminentLeg && (
        <DayOfCard leg={imminentLeg} ctx={ctx} meId={me.id} />
      )}

      <div style={{ padding: '14px 16px 0' }}>
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

      <div style={{ padding: '12px 16px 0' }}>
        <div className="caps muted" style={{ marginBottom: 8 }}>Quick actions</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
          <QuickAction
            icon="🔄"
            iconBg="var(--red-100)"
            label="Need a sub"
            onClick={() => {
              if (myUpcomingDriving.length === 0) {
                ctx.showToast("You're not scheduled to drive anything coming up");
                return;
              }
              setNeedSubLegId(
                myUpcomingDriving.length === 1 ? myUpcomingDriving[0].id : null,
              );
              setNeedSubReason('');
              setNeedSubOpen(true);
            }}
          />
          <QuickAction
            icon="⏰"
            iconBg="var(--yellow-100)"
            label="Running late"
            onClick={() => {
              if (myUpcomingDriving.length === 0) {
                ctx.showToast("You're not scheduled to drive anything coming up");
                return;
              }
              setLateLegId(
                myUpcomingDriving.length === 1 ? myUpcomingDriving[0].id : null,
              );
              setLateOpen(true);
            }}
          />
          <QuickAction
            icon="🚫"
            iconBg="var(--blue-100)"
            label="Kid out today"
            onClick={() => {
              if (myUpcomingSeats.length === 0) {
                ctx.showToast('None of your kids are signed up for upcoming rides');
                return;
              }
              setKidOutOpen(true);
            }}
          />
          <QuickAction
            icon="➕"
            iconBg="var(--green-100)"
            label="Add my kid"
            onClick={() => {
              if (joinableLegs.length === 0) {
                ctx.showToast('No upcoming legs with open seats');
                return;
              }
              setAddKidOpen(true);
            }}
          />
        </div>
      </div>

      <div className="date-scrubber">
        {days.map((d) => {
          const k = dateKey(d);
          const isSel = k === selected;
          return (
            <button
              key={k}
              type="button"
              className={`date-chip ${isSel ? 'active' : ''}`}
              onClick={() => setSelected(k)}
            >
              <div className="dow">{fmtDOW(d)}</div>
              <div className="dom">{d.getDate()}</div>
              {needsDriverByDay[k] && <div className="dot" />}
            </button>
          );
        })}
      </div>

      <div className="section">
        {events.length === 0 && (
          <>
            <div className="empty">
              <div className="icon">🗓️</div>
              <div className="h3" style={{ marginBottom: 4 }}>No events</div>
              <div>Nothing scheduled for this day.</div>
            </div>
            <CalendarEmptyCTA ctx={ctx} variant="today" />
          </>
        )}
        {events.map((e) => (
          <EventCard key={e.id} event={e} myKidIds={myKidIds} ctx={ctx} meId={me.id} />
        ))}
      </div>

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

/* ---------- one-time GameChanger import nudge (post-onboarding) ---------- */

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
        margin: '12px 16px 0',
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
      <div style={{ fontSize: 12, color: 'var(--blue-text)', marginBottom: 10, opacity: 0.85 }}>
        📍 You'll find this any time at <strong>👤 Profile → 📅 Schedule sources</strong>.
      </div>
      <div className="row" style={{ gap: 8 }}>
        <button
          type="button"
          className="btn btn-primary"
          style={{ flex: 1 }}
          onClick={open}
        >
          Import now
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={dismiss}
        >
          Not now
        </button>
      </div>
    </div>
  );
}

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
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
          <div style={{ fontWeight: 700, fontSize: 14 }}>{event?.title || 'Leg'}</div>
          <SourceBadge event={event} />
        </div>
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

function KidOutSheet({ open, onClose, rows, meId, onRemove }) {
  const [step, setStep] = useState('pick'); // 'pick' | 'confirm'
  const [picked, setPicked] = useState(null); // { childId, eventId }
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
                  <Avatar name={g.child.name} color={g.child.avatar_color} size="sm" />
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
                    <div className="muted" style={{ fontSize: 11, marginTop: 2 }}>
                      Driver:{' '}
                      {g.legs[0].driver_id
                        ? rows.find((r) => r.leg.id === g.legs[0].id)?.driver?.name?.split(' ')[0] ||
                          'TBD'
                        : 'open'}
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
              <Avatar name={pickedGroup.child.name} color={pickedGroup.child.avatar_color} size="sm" />
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
                your driver
                {pickedGroup.legs[0].driver_id ? (
                  <>
                    {' '}
                    (
                    <strong>
                      {rows.find((r) => r.leg.id === pickedGroup.legs[0].id)?.driver?.phone}
                    </strong>
                    )
                  </>
                ) : null}
                directly.
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
                <Avatar name={row.kid.name} color={row.kid.avatar_color} size="sm" />
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

function QuickAction({ icon, iconBg, label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        background: 'white',
        borderRadius: 16,
        padding: '14px 8px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 8,
        boxShadow: 'var(--shadow-sm)',
      }}
    >
      <span
        style={{
          width: 42,
          height: 42,
          borderRadius: 12,
          background: iconBg,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 20,
        }}
      >
        {icon}
      </span>
      <span
        style={{
          fontSize: 11,
          fontWeight: 700,
          color: 'var(--gray-700)',
          textAlign: 'center',
          lineHeight: 1.2,
        }}
      >
        {label}
      </span>
    </button>
  );
}

function DayOfCard({ leg, ctx, meId }) {
  const event = db().events.find((e) => e.id === leg.event_id);
  const kids = getKidsInLeg(leg.id);
  const minutes = Math.max(0, Math.round((new Date(leg.departure_time).getTime() - Date.now()) / 60000));
  const inProgress = leg.status === 'in_progress';

  return (
    <div
      style={{
        background: 'linear-gradient(135deg, #1b4332 0%, #2d6a4f 100%)',
        color: 'white',
        padding: 20,
        margin: '12px 16px',
        borderRadius: 20,
        boxShadow: '0 12px 32px rgba(27,67,50,0.35)',
      }}
    >
      <div className="caps" style={{ opacity: 0.85 }}>
        {inProgress ? '🚗 Ride in progress' : '⏰ Coming up'}
      </div>
      <div style={{ fontSize: 26, fontWeight: 800, marginTop: 6, letterSpacing: '-0.02em' }}>
        {inProgress ? 'You\'re driving now' : `Leaves in ${minutes} min`}
      </div>
      <div style={{ fontSize: 14, opacity: 0.9, marginTop: 4 }}>
        {leg.direction === 'to_event' ? 'Drop-off' : 'Pick-up'} · {event?.title}
      </div>
      <div style={{ fontSize: 13, opacity: 0.85, marginTop: 8 }}>
        📍 {leg.departure_location} → {leg.arrival_location}
      </div>

      <div style={{ marginTop: 14, display: 'flex', gap: -8 }}>
        {kids.map((k, i) => (
          <div key={k.id} style={{ marginLeft: i === 0 ? 0 : -10 }}>
            <Avatar name={k.name} color={k.avatar_color} size="sm" />
          </div>
        ))}
        <div style={{ marginLeft: 8, fontSize: 13, alignSelf: 'center', opacity: 0.95 }}>
          {kids.length} {kids.length === 1 ? 'passenger' : 'passengers'}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 14 }}>
        <button
          type="button"
          style={{
            background: 'white',
            color: 'var(--green-900)',
            padding: '12px 8px',
            borderRadius: 12,
            fontWeight: 700,
            fontSize: 14,
          }}
          onClick={() => {
            const addr = encodeURIComponent(leg.departure_location);
            window.open(`https://maps.apple.com/?daddr=${addr}`, '_blank');
            postRideStatus(leg.id, meId, 'en_route');
            ctx.showToast('Status sent: on your way');
          }}
        >
          🗺️ Start route
        </button>
        <button
          type="button"
          style={{
            background: 'rgba(255,255,255,0.18)',
            color: 'white',
            padding: '12px 8px',
            borderRadius: 12,
            fontWeight: 700,
            fontSize: 14,
            border: '1px solid rgba(255,255,255,0.3)',
          }}
          onClick={() => {
            postRideStatus(leg.id, meId, 'running_late');
            ctx.showToast('Parents notified: running late');
          }}
        >
          ⏰ I'm late
        </button>
        <button
          type="button"
          style={{
            background: '#fbbf24',
            color: '#1b4332',
            padding: '14px 8px',
            borderRadius: 12,
            fontWeight: 800,
            fontSize: 15,
            gridColumn: '1 / -1',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
          }}
          onClick={() => ctx.navigate('active_ride', { legId: leg.id })}
        >
          🗺️ Open ride mode →
        </button>
        <button
          type="button"
          style={{
            background: 'rgba(255,255,255,0.18)',
            color: 'white',
            padding: '10px 8px',
            borderRadius: 12,
            fontWeight: 600,
            fontSize: 13,
            gridColumn: '1 / -1',
            border: '1px solid rgba(255,255,255,0.3)',
          }}
          onClick={() => ctx.navigate('leg', { legId: leg.id })}
        >
          Edit leg details
        </button>
      </div>
    </div>
  );
}

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return 'morning';
  if (h < 18) return 'afternoon';
  return 'evening';
}

function EventCard({ event, myKidIds, ctx, meId }) {
  const legs = getLegsForEvent(event.id);
  return (
    <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
      <div style={{ padding: '14px 16px 10px' }}>
        <div className="row-between">
          <div>
            <div style={{ fontWeight: 700, fontSize: 16 }}>
              {event.type === 'game' ? '⚾ ' : event.type === 'imported' ? '📅 ' : '🏟️ '}
              {event.title}
            </div>
            <div className="muted" style={{ fontSize: 13, marginTop: 2 }}>
              {formatTime(event.start_at)} · {event.location}
            </div>
            <div style={{ marginTop: 6 }}>
              <SourceBadge event={event} />
            </div>
          </div>
          <span className={`pill ${event.type === 'game' ? 'pill-yellow' : 'pill-gray'}`}>
            {event.type}
          </span>
        </div>
      </div>
      <div style={{ borderTop: '1px solid var(--gray-100)' }}>
        {legs.map((leg) => (
          <LegRow key={leg.id} leg={leg} myKidIds={myKidIds} ctx={ctx} meId={meId} />
        ))}
      </div>
    </div>
  );
}

function LegRow({ leg, myKidIds, ctx, meId }) {
  const kids = getKidsInLeg(leg.id);
  const driver = leg.driver_id ? getParent(leg.driver_id) : null;
  const isMine = leg.driver_id === meId;
  const isOpen = !leg.driver_id;
  const hasMyKid = kids.some((k) => myKidIds.includes(k.id));

  let stateClass = '';
  let badge = null;
  if (isMine) {
    stateClass = 'your-turn';
    badge = <span className="pill pill-green">YOUR TURN</span>;
  } else if (isOpen) {
    stateClass = 'needs-driver';
    badge = <span className="pill pill-yellow">NEEDS DRIVER</span>;
  } else {
    badge = <span className="pill pill-gray">✓ {driver?.name?.split(' ')[0]}</span>;
  }

  return (
    <button
      type="button"
      onClick={() => ctx.navigate('leg', { legId: leg.id })}
      style={{
        display: 'block',
        width: '100%',
        textAlign: 'left',
        padding: '14px 16px',
        background:
          stateClass === 'your-turn'
            ? 'linear-gradient(180deg, #f0fdf4 0%, #ffffff 100%)'
            : stateClass === 'needs-driver'
            ? '#fffbeb'
            : 'transparent',
        borderTop: '1px solid var(--gray-100)',
        position: 'relative',
      }}
    >
      <div className="row-between">
        <div style={{ flex: 1 }}>
          <div className="caps muted" style={{ marginBottom: 4 }}>
            {leg.direction === 'to_event' ? 'Drop-off' : 'Pick-up'} · {formatTime(leg.departure_time)}
          </div>
          <div className="row" style={{ gap: 8 }}>
            {isOpen ? (
              <>
                <span
                  className="avatar avatar-gray"
                  style={{ background: 'var(--yellow-100)', color: 'var(--yellow-text)', fontSize: 18 }}
                >
                  ?
                </span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15 }}>No driver yet</div>
                  <div className="muted" style={{ fontSize: 12 }}>Tap to sign up</div>
                </div>
              </>
            ) : (
              <>
                <Avatar name={driver.name} color={driver.avatar_color} />
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15 }}>{driver.name}</div>
                  <div className="muted" style={{ fontSize: 12 }}>
                    {kids.length}/{leg.seat_capacity} seats ·{' '}
                    {kids.map((k) => k.name).join(', ') || 'no kids yet'}
                  </div>
                </div>
              </>
            )}
          </div>
          {hasMyKid && !isMine && (
            <div className="pill pill-blue" style={{ marginTop: 8 }}>
              ★ Your kid is in this car
            </div>
          )}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
          {badge}
          <span className="muted" style={{ fontSize: 18 }}>›</span>
        </div>
      </div>
    </button>
  );
}
