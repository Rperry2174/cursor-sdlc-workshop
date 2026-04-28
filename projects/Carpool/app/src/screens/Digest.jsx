import { useMemo } from 'react';
import {
  getCurrentParent,
  getEvent,
  getParent,
  getKidsInLeg,
} from '../data/store.js';
import { buildDigest } from '../data/lifecycle.js';
import { Avatar } from '../components/Avatar.jsx';
import { TopNav } from '../components/TopNav.jsx';

function fmt(iso) {
  const d = new Date(iso);
  return `${d.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })} · ${d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}`;
}

export function Digest({ ctx }) {
  const me = getCurrentParent();
  const data = useMemo(() => buildDigest(me.id), [me.id]);
  const today = new Date().toLocaleDateString([], {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  return (
    <>
      <TopNav title="Today's recap" onBack={() => ctx.navigate('today')} />
      <div className="section">
        <div
          className="card"
          style={{
            background: 'linear-gradient(135deg, var(--green-700) 0%, var(--green-900) 100%)',
            color: 'white',
          }}
        >
          <div className="caps" style={{ opacity: 0.85 }}>📬 7pm digest</div>
          <div style={{ fontSize: 22, fontWeight: 800, marginTop: 6 }}>Your evening recap</div>
          <div style={{ opacity: 0.9, fontSize: 13, marginTop: 6 }}>{today}</div>
        </div>

        <Section title="🚗 Your turn tomorrow" empty="No driving on the calendar for tomorrow.">
          {data.yourTurnTomorrow.map((leg) => {
            const e = getEvent(leg.event_id);
            return (
              <DigestRow
                key={leg.id}
                title={`${leg.direction === 'to_event' ? 'Drop-off' : 'Pick-up'} for ${e?.title}`}
                subtitle={fmt(leg.departure_time)}
                badge="YOUR TURN"
                badgeColor="green"
                onClick={() => ctx.navigate('leg', { legId: leg.id })}
              />
            );
          })}
        </Section>

        <Section
          title="⚠️ Your kid still needs a ride"
          empty="Your kids are covered for the next 5 days."
        >
          {data.yourKidNeedsRide.map((leg) => {
            const e = getEvent(leg.event_id);
            return (
              <DigestRow
                key={leg.id}
                title={`${e?.title} — ${leg.direction === 'to_event' ? 'drop-off' : 'pick-up'}`}
                subtitle={fmt(leg.departure_time)}
                badge="NO DRIVER"
                badgeColor="red"
                onClick={() => ctx.navigate('leg', { legId: leg.id })}
              />
            );
          })}
        </Section>

        <Section
          title="🆘 Team still needs drivers"
          empty="Every team event in the next 5 days has a driver."
        >
          {data.stillNeedsDriver.slice(0, 5).map((leg) => {
            const e = getEvent(leg.event_id);
            return (
              <DigestRow
                key={leg.id}
                title={`${e?.title} — ${leg.direction === 'to_event' ? 'drop-off' : 'pick-up'}`}
                subtitle={fmt(leg.departure_time)}
                badge="OPEN"
                badgeColor="yellow"
                onClick={() => ctx.navigate('leg', { legId: leg.id })}
              />
            );
          })}
        </Section>

        <Section title="📰 Recent activity" empty="Quiet day.">
          {data.recentActivity.map((rse) => {
            const actor = getParent(rse.actor_id);
            return (
              <div key={rse.id} className="list-row" style={{ alignItems: 'flex-start' }}>
                {actor && <Avatar name={actor.name} color={actor.avatar_color} photo={actor.photo} size="sm" />}
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14 }}>
                    <strong>{actor?.name?.split(' ')[0] || 'Someone'}</strong> {summarize(rse.kind)}
                  </div>
                  <div className="muted" style={{ fontSize: 11 }}>
                    {fmt(rse.created_at)}
                  </div>
                </div>
              </div>
            );
          })}
        </Section>

        <button
          type="button"
          className="btn btn-secondary"
          style={{ marginTop: 12 }}
          onClick={() => ctx.navigate('notif_prefs')}
        >
          Adjust digest preferences →
        </button>
      </div>
    </>
  );
}

function Section({ title, empty, children }) {
  const arr = Array.isArray(children) ? children.filter(Boolean) : children ? [children] : [];
  return (
    <div className="card">
      <div className="caps muted">{title}</div>
      <div style={{ marginTop: 10 }}>
        {arr.length === 0 ? (
          <div className="muted" style={{ fontSize: 13, padding: '8px 0' }}>{empty}</div>
        ) : (
          arr
        )}
      </div>
    </div>
  );
}

function DigestRow({ title, subtitle, badge, badgeColor, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="list-row"
      style={{ width: '100%', textAlign: 'left', padding: '10px 0' }}
    >
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 700, fontSize: 14 }}>{title}</div>
        <div className="muted" style={{ fontSize: 12, marginTop: 2 }}>{subtitle}</div>
      </div>
      <span className={`pill pill-${badgeColor}`}>{badge}</span>
    </button>
  );
}

function summarize(kind) {
  return {
    driver_claimed: 'claimed a leg',
    driver_swapped: 'was swapped onto a leg',
    driver_released: 'released a leg',
    driver_cancelled: 'had to cancel',
    kid_seated: 'added a kid',
    kid_unseated: 'removed a kid',
    en_route: 'is on the way',
    kid_picked_up: 'picked up the kids',
    arrived: 'arrived',
    kid_dropped_off: 'completed a drop-off',
    running_late: 'is running late',
  }[kind] || `did "${kind}"`;
}
