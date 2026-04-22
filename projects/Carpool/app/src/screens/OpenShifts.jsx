import { useEffect, useRef, useState } from 'react';
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

  // Recomputed every render — App.jsx subscribes to the store and re-renders
  // on every mutation, so this stays in sync after a claim/undo.
  const allOpenLegs = getOpenLegsForParent(me.id, HORIZON_DAYS);
  const allOpenSeats = getOpenSeatsForMyKids(me.id, HORIZON_DAYS);

  // Run auto-claim once per visit (per render isn't safe — claimLeg would
  // be called every state tick). Ref-gate it.
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

function DriversTab({ ctx, me, teams, allOpen, rangeId, setRangeId, dirId, setDirId, teamId, setTeamId }) {
  const range = RANGE_OPTIONS.find((r) => r.id === rangeId) || RANGE_OPTIONS[0];
  const cutoff = Date.now() + range.days * 86400000;

  const filtered = allOpen
    .filter((l) => new Date(l.departure_time).getTime() <= cutoff)
    .filter((l) => dirId === 'all' || l.direction === dirId)
    .filter((l) => {
      if (teamId === 'all') return true;
      const evt = getEvent(l.event_id);
      return evt?.team_id === teamId;
    })
    .sort((a, b) => new Date(a.departure_time) - new Date(b.departure_time));

  const grouped = groupByDay(filtered);

  const claim = (legId) => {
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
            <ShiftCard key={l.id} leg={l} ctx={ctx} onClaim={() => claim(l.id)} />
          ))}
        </div>
      ))}
    </>
  );
}

function ShiftCard({ leg, ctx, onClaim }) {
  const evt = getEvent(leg.event_id);
  const team = evt?.team_id ? getTeam(evt.team_id) : null;
  const kids = getKidsInLeg(leg.id);
  const dir = leg.direction === 'to_event' ? 'Drop-off' : 'Pick-up';
  const dirIcon = leg.direction === 'to_event' ? '➡️' : '⬅️';
  const sub = getOpenSubRequestForLeg(leg.id);
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
          <Avatar name={driver.name} color={driver.avatar_color} size="sm" />
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
              <Avatar name={r.kid.name} color={r.kid.avatar_color} size="sm" />
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
          <Avatar name={k.name} color={k.avatar_color} size="sm" />
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
