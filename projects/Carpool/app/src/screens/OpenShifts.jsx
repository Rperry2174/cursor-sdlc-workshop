import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  getCurrentParent,
  getOpenLegsForParent,
  getEvent,
  getKidsInLeg,
  getTeam,
  getTeamsForParent,
  getOpenSeatsForMyKids,
  getOpenSubRequestForLeg,
  getParent,
} from '../data/store.js';
import { claimLeg, seatKid, applyAutoClaimRules } from '../data/lifecycle.js';
import {
  loadBackendOperationalState,
  claimLegBackend,
} from '../data/operationalBackend.js';
import { TopNav } from '../components/TopNav.jsx';
import { Avatar } from '../components/Avatar.jsx';
import { CalendarEmptyCTA } from '../components/CalendarEmptyCTA.jsx';

const HORIZON_DAYS = 21;

const RANGE_OPTIONS = [
  { id: 'all', label: 'Next 3 weeks', days: HORIZON_DAYS },
  { id: 'week', label: 'This week', days: 7 },
  { id: 'today', label: 'Today only', days: 1 },
];

const DIR_OPTIONS = [
  { id: 'all', label: 'All' },
  { id: 'to_event', label: 'Drop-offs' },
  { id: 'from_event', label: 'Pick-ups' },
];

export function OpenShifts({ ctx }) {
  const me = getCurrentParent();
  const [tab, setTab] = useState('drivers'); // 'drivers' | 'seats'
  const [rangeId, setRangeId] = useState('all');
  const [dirId, setDirId] = useState('all');
  const [teamId, setTeamId] = useState('all');

  const teams = getTeamsForParent(me.id);

  // ---------- Backend read-mode state (Agent C slice) ----------
  // Same envelope-driven loader Today.jsx uses. We default to the
  // local prototype while loading so the screen is never blank, and
  // never blow away local fallback if Supabase is unconfigured.
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

  // Recomputed every render — App.jsx subscribes to the store and re-renders
  // on every mutation, so this stays in sync after a claim/undo.
  const allOpenLegsLocal = getOpenLegsForParent(me.id, HORIZON_DAYS);
  const allOpenSeats = getOpenSeatsForMyKids(me.id, HORIZON_DAYS);

  const allOpenLegsBackend = useMemo(() => {
    if (!lookups) return [];
    const now = Date.now();
    const horizon = now + HORIZON_DAYS * 86400000;
    const eventIdsInWindow = new Set(
      lookups.events
        .filter((e) => {
          const t = new Date(e.start_at).getTime();
          return t >= now && t <= horizon;
        })
        .map((e) => e.id),
    );
    return lookups.legs.filter(
      (l) => eventIdsInWindow.has(l.event_id) && !l.driver_id && l.status === 'open',
    );
  }, [lookups]);

  const allOpenLegs = lookups ? allOpenLegsBackend : allOpenLegsLocal;

  // Backend-mode claim handler — falls back to local if the backend
  // call reports `skipped: true` (e.g. signed out mid-session).
  const claimViaBackend = useCallback(
    async (legId) => {
      const r = await claimLegBackend(legId);
      if (r.skipped) {
        const localR = claimLeg(legId, me.id);
        if (!localR.ok) {
          if (localR.reason === 'taken' && localR.currentDriver) {
            ctx.showToast(
              `Just claimed by ${localR.currentDriver.name.split(' ')[0]} — refresh to see the latest`,
            );
          } else {
            ctx.showToast('Could not claim — try again');
          }
          return;
        }
        ctx.showToast("Claimed — you're on the schedule");
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

  // Run auto-claim once per visit (per render isn't safe — claimLeg would
  // be called every state tick). Ref-gate it. Auto-claim is local-only
  // because the rules live in the local store; we leave it on so the
  // local-only flow is unchanged.
  const autoRanRef = useRef(false);
  useEffect(() => {
    if (autoRanRef.current) return;
    autoRanRef.current = true;
    const { claimed } = applyAutoClaimRules(me.id);
    if (claimed.length > 0) {
      ctx.showToast(
        `Auto-claimed ${claimed.length} leg${claimed.length === 1 ? '' : 's'} from your rules ⚡`,
      );
    }
  }, [me.id, ctx]);

  return (
    <>
      <TopNav title="Open shifts" />

      <div className="section" style={{ paddingTop: 8 }}>
        {lookups && (
          <div style={{ marginBottom: 10 }}>
            <LiveDataPill />
          </div>
        )}

        <SegmentedTabs
          tab={tab}
          onChange={setTab}
          driversCount={allOpenLegs.length}
          seatsCount={allOpenSeats.length}
        />

        <div style={{ height: 12 }} />

        {tab === 'drivers' ? (
          <DriversTab
            ctx={ctx}
            me={me}
            teams={teams}
            allOpen={allOpenLegs}
            rangeId={rangeId}
            setRangeId={setRangeId}
            dirId={dirId}
            setDirId={setDirId}
            teamId={teamId}
            setTeamId={setTeamId}
            lookups={lookups}
            claimBackend={lookups ? claimViaBackend : null}
          />
        ) : (
          <SeatsTab
            ctx={ctx}
            me={me}
            teams={teams}
            allOpen={allOpenSeats}
            rangeId={rangeId}
            setRangeId={setRangeId}
            teamId={teamId}
            setTeamId={setTeamId}
          />
        )}
      </div>
    </>
  );
}

function SegmentedTabs({ tab, onChange, driversCount, seatsCount }) {
  return (
    <div
      style={{
        display: 'flex',
        background: 'var(--gray-100)',
        borderRadius: 12,
        padding: 4,
        gap: 4,
      }}
    >
      <SegBtn
        active={tab === 'drivers'}
        onClick={() => onChange('drivers')}
        label="🚗 Need driver"
        count={driversCount}
      />
      <SegBtn
        active={tab === 'seats'}
        onClick={() => onChange('seats')}
        label="🧒 Open seats"
        count={seatsCount}
      />
    </div>
  );
}

function SegBtn({ active, onClick, label, count }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        flex: 1,
        padding: '10px 8px',
        borderRadius: 9,
        background: active ? 'white' : 'transparent',
        boxShadow: active ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
        fontSize: 13,
        fontWeight: 700,
        color: active ? 'var(--gray-700)' : 'var(--gray-500)',
      }}
    >
      {label}
      {count > 0 && (
        <span
          style={{
            marginLeft: 6,
            background: active ? 'var(--green-700)' : 'var(--gray-200, var(--gray-100))',
            color: active ? 'white' : 'var(--gray-700)',
            borderRadius: 999,
            padding: '1px 7px',
            fontSize: 11,
          }}
        >
          {count}
        </span>
      )}
    </button>
  );
}

/* ---------- Need-driver tab ---------- */

function DriversTab({
  ctx,
  me,
  teams,
  allOpen,
  rangeId,
  setRangeId,
  dirId,
  setDirId,
  teamId,
  setTeamId,
  lookups,
  claimBackend,
}) {
  const range = RANGE_OPTIONS.find((r) => r.id === rangeId) || RANGE_OPTIONS[0];
  const cutoff = Date.now() + range.days * 86400000;

  // Backend events don't ride through getEvent(), so when filtering by
  // team in backend mode we look the event up via the lookups index.
  const eventForFilter = (legEventId) => {
    if (lookups) return lookups.eventsById.get(legEventId) || null;
    return getEvent(legEventId);
  };

  const filtered = allOpen
    .filter((l) => new Date(l.departure_time).getTime() <= cutoff)
    .filter((l) => dirId === 'all' || l.direction === dirId)
    .filter((l) => {
      if (teamId === 'all') return true;
      const evt = eventForFilter(l.event_id);
      return evt?.team_id === teamId;
    })
    .sort((a, b) => new Date(a.departure_time) - new Date(b.departure_time));

  const grouped = groupByDay(filtered);

  const claim = (legId) => {
    if (claimBackend) {
      // Fire-and-forget — toasts + refresh are handled by the parent.
      claimBackend(legId);
      return;
    }
    const r = claimLeg(legId, me.id);
    if (!r.ok) {
      if (r.reason === 'taken' && r.currentDriver) {
        ctx.showToast(`Just claimed by ${r.currentDriver.name.split(' ')[0]} — refresh to see the latest`);
      } else {
        ctx.showToast('Could not claim — try again');
      }
      return;
    }
    const undo = r.undo;
    ctx.showToast('Claimed — you’re on the schedule', {
      action: undo
        ? {
            label: 'Undo',
            onClick: () => {
              if (undo()) ctx.showToast('Undone');
            },
          }
        : null,
    });
  };

  return (
    <>
      <div className="muted" style={{ fontSize: 13, marginBottom: 10 }}>
        Every leg in the next 3 weeks that still needs a driver. Tap{' '}
        <strong>Claim</strong> to take one.
      </div>

      <FilterRow
        options={RANGE_OPTIONS.map((o) => ({ id: o.id, label: o.label }))}
        value={rangeId}
        onChange={setRangeId}
      />
      <div style={{ height: 8 }} />
      <FilterRow options={DIR_OPTIONS} value={dirId} onChange={setDirId} />
      {teams.length > 1 && (
        <>
          <div style={{ height: 8 }} />
          <FilterRow
            options={[
              { id: 'all', label: 'All teams' },
              ...teams.map((t) => ({ id: t.id, label: t.name })),
            ]}
            value={teamId}
            onChange={setTeamId}
          />
        </>
      )}

      {filtered.length === 0 && allOpen.length > 0 && (
        <div className="empty" style={{ marginTop: 16 }}>
          <div className="icon">🎯</div>
          <div className="h3" style={{ marginBottom: 4 }}>No open shifts match your filters</div>
          <div>Loosen a filter or check the next time window.</div>
        </div>
      )}

      {allOpen.length === 0 && (
        <div style={{ marginTop: 16 }}>
          <div className="empty">
            <div className="icon">🎉</div>
            <div className="h3" style={{ marginBottom: 4 }}>You’re all covered</div>
            <div>Every upcoming carpool already has a driver. Nice.</div>
          </div>
          <CalendarEmptyCTA ctx={ctx} variant="schedule" />
        </div>
      )}

      {grouped.map(([dayKey, dayLegs]) => (
        <div key={dayKey} style={{ marginTop: 14 }}>
          <div className="caps muted" style={{ marginBottom: 8 }}>
            {dayLabel(dayKey)}
          </div>
          {dayLegs.map((l) => (
            <ShiftCard
              key={l.id}
              leg={l}
              ctx={ctx}
              onClaim={() => claim(l.id)}
              lookups={lookups}
            />
          ))}
        </div>
      ))}
    </>
  );
}

function ShiftCard({ leg, ctx, onClaim, lookups }) {
  // Backend mode does not load teams, sub_requests, or children — for
  // those views we resolve via lookups where we can and fall through
  // to nullish so the card hides those sub-sections gracefully.
  const evt = lookups
    ? lookups.eventsById.get(leg.event_id) || null
    : getEvent(leg.event_id);
  const team = !lookups && evt?.team_id ? getTeam(evt.team_id) : null;
  const kids = lookups
    ? (lookups.seatsByLegId.get(leg.id) || []).map((s) => ({ id: s.child_id, name: '' }))
    : getKidsInLeg(leg.id);
  const dir = leg.direction === 'to_event' ? 'Drop-off' : 'Pick-up';
  const dirIcon = leg.direction === 'to_event' ? '➡️' : '⬅️';
  const sub = lookups ? null : getOpenSubRequestForLeg(leg.id);
  const releaser = sub ? getParent(sub.requested_by) : null;

  return (
    <div
      className="card"
      style={{
        marginBottom: 10,
        borderLeft: sub ? '3px solid var(--yellow-500)' : undefined,
      }}
    >
      {sub && (
        <div
          style={{
            background: 'var(--yellow-100)',
            color: 'var(--yellow-text)',
            borderRadius: 8,
            padding: '6px 10px',
            fontSize: 12,
            fontWeight: 600,
            marginBottom: 10,
            display: 'flex',
            gap: 6,
            alignItems: 'center',
          }}
        >
          <span>🔁</span>
          <span style={{ flex: 1 }}>
            Sub needed{releaser ? ` — ${releaser.name.split(' ')[0]} can’t drive` : ''}
            {sub.reason ? ` · "${sub.reason}"` : ''}
          </span>
        </div>
      )}

      <div className="row-between" style={{ alignItems: 'flex-start', gap: 12 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="row" style={{ gap: 8, alignItems: 'center', marginBottom: 4 }}>
            <span style={{ fontSize: 18 }}>{dirIcon}</span>
            <div style={{ fontWeight: 700, fontSize: 15 }}>
              {dir} · {fmtTime(leg.departure_time)}
            </div>
            <CountdownPill iso={leg.departure_time} />
          </div>
          <div style={{ fontSize: 14, color: 'var(--gray-700)', marginBottom: 4 }}>
            {evt?.title || 'Carpool leg'}
          </div>
          <div className="muted" style={{ fontSize: 12, marginBottom: 8 }}>
            {leg.departure_location} → {leg.arrival_location}
            {team && (
              <>
                {' · '}
                <span style={{ fontWeight: 600 }}>{team.name}</span>
              </>
            )}
          </div>
          <KidStrip kids={kids} capacity={leg.seat_capacity} />
        </div>
      </div>
      <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
        <button
          type="button"
          className="btn btn-primary"
          style={{ flex: 1 }}
          onClick={onClaim}
        >
          {sub ? '🤝 Sub in' : '✅ Claim'}
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          style={{ width: 'auto', padding: '0 14px' }}
          onClick={() => ctx.navigate('leg', { legId: leg.id })}
        >
          Details
        </button>
      </div>
    </div>
  );
}

/* ---------- Open-seats tab ---------- */

function SeatsTab({ ctx, me, teams, allOpen, rangeId, setRangeId, teamId, setTeamId }) {
  const range = RANGE_OPTIONS.find((r) => r.id === rangeId) || RANGE_OPTIONS[0];
  const cutoff = Date.now() + range.days * 86400000;

  const filtered = allOpen
    .filter((row) => new Date(row.leg.departure_time).getTime() <= cutoff)
    .filter((row) => teamId === 'all' || row.event.team_id === teamId);

  const addKid = (legId, kidId, kidName) => {
    const r = seatKid(legId, kidId, me.id);
    if (!r.ok) {
      ctx.showToast(
        r.reason === 'no_seats'
          ? 'Sorry — that car is now full'
          : r.reason === 'already_seated'
          ? `${kidName} is already on this leg`
          : 'Could not add — try again',
      );
      return;
    }
    ctx.showToast(`${kidName} added — driver was notified`);
  };

  const grouped = groupByDay(filtered.map((r) => r.leg));
  const rowsByLeg = new Map();
  for (const r of filtered) {
    if (!rowsByLeg.has(r.leg.id)) rowsByLeg.set(r.leg.id, []);
    rowsByLeg.get(r.leg.id).push(r);
  }

  return (
    <>
      <div className="muted" style={{ fontSize: 13, marginBottom: 10 }}>
        Cars with open seats heading where your kids need to be. Tap{' '}
        <strong>Add</strong> to put your kid on board.
      </div>

      <FilterRow
        options={RANGE_OPTIONS.map((o) => ({ id: o.id, label: o.label }))}
        value={rangeId}
        onChange={setRangeId}
      />
      {teams.length > 1 && (
        <>
          <div style={{ height: 8 }} />
          <FilterRow
            options={[
              { id: 'all', label: 'All teams' },
              ...teams.map((t) => ({ id: t.id, label: t.name })),
            ]}
            value={teamId}
            onChange={setTeamId}
          />
        </>
      )}

      {filtered.length === 0 && (
        <div className="empty" style={{ marginTop: 16 }}>
          <div className="icon">🎒</div>
          <div className="h3" style={{ marginBottom: 4 }}>No open seats right now</div>
          <div>Either every car is full or every kid is already booked. Check back after the next sync.</div>
        </div>
      )}

      {grouped.map(([dayKey, dayLegs]) => {
        const seenLegs = new Set();
        const dedupedLegs = dayLegs.filter((l) => {
          if (seenLegs.has(l.id)) return false;
          seenLegs.add(l.id);
          return true;
        });
        return (
          <div key={dayKey} style={{ marginTop: 14 }}>
            <div className="caps muted" style={{ marginBottom: 8 }}>
              {dayLabel(dayKey)}
            </div>
            {dedupedLegs.map((l) => (
              <SeatCard
                key={l.id}
                leg={l}
                ctx={ctx}
                rows={rowsByLeg.get(l.id) || []}
                onAdd={addKid}
              />
            ))}
          </div>
        );
      })}
    </>
  );
}

function SeatCard({ leg, ctx, rows, onAdd }) {
  const evt = getEvent(leg.event_id);
  const team = evt?.team_id ? getTeam(evt.team_id) : null;
  const dir = leg.direction === 'to_event' ? 'Drop-off' : 'Pick-up';
  const dirIcon = leg.direction === 'to_event' ? '➡️' : '⬅️';
  const driver = rows[0]?.driver;
  const seatsLeft = rows[0]?.seatsLeft ?? 0;

  return (
    <div className="card" style={{ marginBottom: 10 }}>
      <div className="row" style={{ gap: 8, alignItems: 'center', marginBottom: 4 }}>
        <span style={{ fontSize: 18 }}>{dirIcon}</span>
        <div style={{ fontWeight: 700, fontSize: 15 }}>
          {dir} · {fmtTime(leg.departure_time)}
        </div>
        <CountdownPill iso={leg.departure_time} />
      </div>
      <div style={{ fontSize: 14, color: 'var(--gray-700)', marginBottom: 4 }}>
        {evt?.title || 'Carpool leg'}
      </div>
      <div className="muted" style={{ fontSize: 12, marginBottom: 10 }}>
        {leg.departure_location} → {leg.arrival_location}
        {team && (
          <>
            {' · '}
            <span style={{ fontWeight: 600 }}>{team.name}</span>
          </>
        )}
      </div>
      {driver && (
        <div className="row" style={{ gap: 8, alignItems: 'center', marginBottom: 12 }}>
          <Avatar name={driver.name} color={driver.avatar_color} photo={driver.photo} size="sm" />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 700 }}>{driver.name} is driving</div>
            <div className="muted" style={{ fontSize: 12 }}>
              {seatsLeft} seat{seatsLeft === 1 ? '' : 's'} left
            </div>
          </div>
        </div>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {rows.map((r) => (
          <div
            key={r.kid.id}
            className="row-between"
            style={{
              padding: '8px 10px',
              background: 'var(--gray-100)',
              borderRadius: 10,
            }}
          >
            <div className="row" style={{ gap: 8, alignItems: 'center' }}>
              <Avatar name={r.kid.name} color={r.kid.avatar_color} photo={r.kid.photo} size="sm" />
              <span style={{ fontWeight: 700, fontSize: 14 }}>{r.kid.name}</span>
            </div>
            <button
              type="button"
              className="btn btn-primary"
              style={{ width: 'auto', padding: '0 14px', height: 34 }}
              onClick={() => onAdd(leg.id, r.kid.id, r.kid.name.split(' ')[0])}
            >
              + Add
            </button>
          </div>
        ))}
        <button
          type="button"
          className="btn btn-secondary"
          style={{ width: '100%' }}
          onClick={() => ctx.navigate('leg', { legId: leg.id })}
        >
          See full leg
        </button>
      </div>
    </div>
  );
}

/* ---------- shared bits ---------- */

function FilterRow({ options, value, onChange }) {
  return (
    <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 4 }}>
      {options.map((o) => {
        const active = o.id === value;
        return (
          <button
            key={o.id}
            type="button"
            onClick={() => onChange(o.id)}
            style={{
              flex: '0 0 auto',
              padding: '6px 12px',
              borderRadius: 999,
              fontSize: 13,
              fontWeight: 700,
              background: active ? 'var(--green-700)' : 'var(--gray-100)',
              color: active ? 'white' : 'var(--gray-700)',
              border: 'none',
              whiteSpace: 'nowrap',
            }}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

function KidStrip({ kids, capacity }) {
  const seats = capacity || 4;
  if (!kids.length) {
    return (
      <div className="muted" style={{ fontSize: 12 }}>
        No kids seated yet · {seats} seat{seats === 1 ? '' : 's'} available
      </div>
    );
  }
  return (
    <div className="row" style={{ gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
      {kids.slice(0, 4).map((k) => (
        <div key={k.id} className="row" style={{ gap: 4, alignItems: 'center' }}>
          <Avatar name={k.name} color={k.avatar_color} photo={k.photo} size="sm" />
          <span style={{ fontSize: 12, fontWeight: 600 }}>
            {k.name.split(' ')[0]}
          </span>
        </div>
      ))}
      {kids.length > 4 && (
        <span className="muted" style={{ fontSize: 12 }}>
          +{kids.length - 4} more
        </span>
      )}
      <span className="muted" style={{ fontSize: 12 }}>
        · {Math.max(seats - kids.length, 0)} seat
        {seats - kids.length === 1 ? '' : 's'} left
      </span>
    </div>
  );
}

function CountdownPill({ iso }) {
  const minutesAway = (new Date(iso).getTime() - Date.now()) / 60000;
  let label;
  let bg = 'var(--gray-100)';
  let color = 'var(--gray-700)';
  if (minutesAway < 60) {
    label = `in ${Math.max(Math.round(minutesAway), 0)} min`;
    bg = 'var(--red-100)';
    color = 'var(--red-text)';
  } else if (minutesAway < 24 * 60) {
    label = `in ${Math.round(minutesAway / 60)} hr`;
    bg = 'var(--yellow-100)';
    color = 'var(--yellow-text)';
  } else {
    const days = Math.round(minutesAway / 60 / 24);
    label = `${days}d away`;
  }
  return (
    <span
      style={{
        background: bg,
        color,
        fontSize: 11,
        fontWeight: 700,
        padding: '2px 8px',
        borderRadius: 999,
      }}
    >
      {label}
    </span>
  );
}

function fmtTime(iso) {
  return new Date(iso).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}

function dayLabel(yyyymmdd) {
  const d = new Date(yyyymmdd + 'T00:00:00');
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diff = Math.round((d.getTime() - today.getTime()) / 86400000);
  const datePart = d.toLocaleDateString([], { month: 'long', day: 'numeric' });
  if (diff === 0) return `Today, ${datePart}`;
  if (diff === 1) return `Tomorrow, ${datePart}`;
  if (diff < 7) {
    const weekday = d.toLocaleDateString([], { weekday: 'long' });
    return `${weekday}, ${datePart}`;
  }
  return d.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' });
}

function groupByDay(legs) {
  const map = new Map();
  for (const l of legs) {
    const k = l.departure_time.slice(0, 10);
    if (!map.has(k)) map.set(k, []);
    map.get(k).push(l);
  }
  return [...map.entries()];
}

/* ---------- backend-mode helpers ---------- */

/**
 * Index the flat arrays returned by loadBackendOperationalState() into
 * Maps so the existing card components can resolve event/legs/seats
 * by id without round-tripping. This mirrors the same shape Today.jsx
 * builds — duplicated here intentionally to keep the file self-
 * contained per the agent's hard-scope rules (no shared selector
 * module beyond the backend client itself).
 */
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

  const seatsByLegId = new Map();
  for (const s of backend.seats || []) {
    if (!seatsByLegId.has(s.leg_id)) seatsByLegId.set(s.leg_id, []);
    seatsByLegId.get(s.leg_id).push(s);
  }

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

function LiveDataPill() {
  return (
    <span
      title="Open Shifts is reading from the Kinpala backend"
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
