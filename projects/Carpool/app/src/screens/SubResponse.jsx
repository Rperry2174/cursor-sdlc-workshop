import { useState } from 'react';
import {
  getCurrentParent,
  getSubRequest,
  getLeg,
  getEvent,
  getParent,
  getKidsInLeg,
} from '../data/store.js';
import { acceptSubRequest } from '../data/lifecycle.js';
import { Avatar } from '../components/Avatar.jsx';
import { TopNav } from '../components/TopNav.jsx';

function fmt(iso) {
  const d = new Date(iso);
  return `${d.toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' })} · ${d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}`;
}

export function SubResponse({ subRequestId, ctx }) {
  const me = getCurrentParent();
  const sub = getSubRequest(subRequestId);
  const [declineReason, setDeclineReason] = useState('');
  const [showDecline, setShowDecline] = useState(false);

  if (!sub) {
    return (
      <>
        <TopNav title="Sub request" onBack={() => ctx.navigate('today')} />
        <div className="empty">
          <div className="icon">✅</div>
          <div className="h3">All set</div>
          <div>This sub request was already handled.</div>
        </div>
      </>
    );
  }

  const leg = getLeg(sub.leg_id);
  const event = leg ? getEvent(leg.event_id) : null;
  const requester = getParent(sub.requested_by);
  const kids = leg ? getKidsInLeg(leg.id) : [];

  if (!leg || !event) {
    return (
      <>
        <TopNav title="Sub request" onBack={() => ctx.navigate('today')} />
        <div className="empty">This request no longer applies.</div>
      </>
    );
  }

  const closed = sub.status !== 'open';

  return (
    <>
      <TopNav title="Sub request" onBack={() => ctx.navigate('today')} />
      <div className="section">
        <div
          className="card"
          style={{
            background: 'linear-gradient(135deg, var(--yellow-500) 0%, #d97706 100%)',
            color: 'white',
          }}
        >
          <div className="row" style={{ gap: 14, alignItems: 'flex-start' }}>
            <span style={{ fontSize: 32 }}>🆘</span>
            <div>
              <div style={{ fontWeight: 800, fontSize: 18 }}>
                {requester?.name?.split(' ')[0]} needs a sub
              </div>
              <div style={{ opacity: 0.9, fontSize: 13, marginTop: 4 }}>
                {leg.direction === 'to_event' ? 'Drop-off' : 'Pick-up'} for {event.title}
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="caps muted">When</div>
          <div style={{ fontWeight: 700, marginTop: 4, fontSize: 16 }}>{fmt(leg.departure_time)}</div>
          <div style={{ marginTop: 12, display: 'grid', gap: 6 }}>
            <Row icon="📍" label="From" value={leg.departure_location} />
            <Row icon="🏁" label="To" value={leg.arrival_location} />
            <Row icon="🪑" label="Seats" value={`${leg.seat_capacity} (${kids.length} already booked)`} />
          </div>
        </div>

        {sub.reason && (
          <div className="card">
            <div className="caps muted">Why</div>
            <div style={{ marginTop: 6, fontStyle: 'italic', color: 'var(--gray-700)' }}>
              "{sub.reason}"
            </div>
            <div className="row" style={{ marginTop: 10, alignItems: 'center' }}>
              <Avatar name={requester.name} color={requester.avatar_color} photo={requester.photo} size="sm" />
              <span style={{ fontSize: 13 }} className="muted">— {requester.name}</span>
            </div>
          </div>
        )}

        {kids.length > 0 && (
          <div className="card">
            <div className="caps muted">Kids in this carpool</div>
            <div style={{ marginTop: 10 }}>
              {kids.map((k) => (
                <div key={k.id} className="list-row">
                  <Avatar name={k.name} color={k.avatar_color} photo={k.photo} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>{k.name}</div>
                    <div className="muted" style={{ fontSize: 12 }}>age {k.age}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {closed ? (
          <div className="card" style={{ background: 'var(--gray-100)', textAlign: 'center', padding: 18 }}>
            <div style={{ fontWeight: 700 }}>Already filled by someone else</div>
            <div className="muted" style={{ fontSize: 13, marginTop: 4 }}>
              First-accept-wins. Thanks for considering it!
            </div>
          </div>
        ) : showDecline ? (
          <div className="card">
            <div className="h3">Quick reason (optional)</div>
            <div style={{ display: 'grid', gap: 8, marginTop: 12 }}>
              {['Out of town', 'Already busy that day', 'No room in car', 'Other'].map((r) => (
                <button
                  key={r}
                  type="button"
                  className="btn btn-secondary"
                  style={{ background: declineReason === r ? 'var(--gray-200)' : 'var(--gray-100)' }}
                  onClick={() => setDeclineReason(r)}
                >
                  {r}
                </button>
              ))}
            </div>
            <button
              type="button"
              className="btn btn-primary"
              style={{ marginTop: 12 }}
              onClick={() => {
                ctx.showToast(`${requester.name.split(' ')[0]} notified`);
                ctx.navigate('inbox');
              }}
            >
              Send "I can't this time"
            </button>
            <button type="button" className="btn btn-ghost" style={{ marginTop: 4 }} onClick={() => setShowDecline(false)}>
              Back
            </button>
          </div>
        ) : (
          <>
            <button
              type="button"
              className="btn btn-primary"
              style={{ marginTop: 8 }}
              onClick={() => {
                const r = acceptSubRequest(sub.id, me.id);
                if (r.ok) {
                  ctx.showToast(`You're now driving — ${requester.name.split(' ')[0]} notified`);
                  ctx.navigate('leg', { legId: leg.id });
                } else if (r.reason === 'closed') {
                  ctx.showToast('Already filled — sorry!');
                  ctx.navigate('today');
                } else {
                  ctx.showToast(`Could not accept: ${r.reason}`);
                }
              }}
            >
              Yes, I'll cover it
            </button>
            <button type="button" className="btn btn-ghost" style={{ marginTop: 8 }} onClick={() => setShowDecline(true)}>
              I can't this time
            </button>
          </>
        )}
      </div>
    </>
  );
}

function Row({ icon, label, value }) {
  return (
    <div className="row" style={{ alignItems: 'baseline', gap: 8 }}>
      <span style={{ fontSize: 14 }}>{icon}</span>
      <span className="muted" style={{ fontSize: 13, minWidth: 64 }}>{label}</span>
      <span style={{ fontWeight: 600, fontSize: 14 }}>{value}</span>
    </div>
  );
}
