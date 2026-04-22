import { useEffect } from 'react';
import {
  getCurrentParent,
  getNotificationsForParent,
  markNotificationsRead,
  getOpenSubRequestForLeg,
} from '../data/store.js';
import { TopNav } from '../components/TopNav.jsx';

const KIND_ICON = {
  driver_claimed: '✅',
  driver_swapped: '🔄',
  driver_released: '🪂',
  driver_cancelled_emergency: '🚨',
  kid_added: '🧒',
  kid_removed: '↩️',
  kid_seated: '🧒',
  sub_request_open: '🆘',
  leg_assigned: '🚗',
  leg_swapped: '↔️',
  en_route: '🚗',
  kid_picked_up: '👋',
  arrived: '🏁',
  kid_dropped_off: '✅',
  running_late: '⏰',
};

function relTime(iso) {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export function NotificationsInbox({ ctx }) {
  const me = getCurrentParent();
  const items = getNotificationsForParent(me.id);

  useEffect(() => {
    const t = setTimeout(() => markNotificationsRead(me.id), 1000);
    return () => clearTimeout(t);
  }, [me.id]);

  return (
    <>
      <TopNav title="Inbox" />
      <div className="section">
        {items.length === 0 && (
          <div className="empty">
            <div className="icon">🔕</div>
            <div className="h3">All quiet</div>
            <div>Nothing new for you yet.</div>
          </div>
        )}
        {items.map((n) => (
          <button
            key={n.id}
            type="button"
            className="card"
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 12,
              width: '100%',
              textAlign: 'left',
              padding: 14,
              background: n.read_at ? 'white' : 'var(--blue-100)',
            }}
            onClick={() => {
              if (n.kind === 'sub_request_open' && n.leg_id) {
                const sub = getOpenSubRequestForLeg(n.leg_id);
                if (sub) {
                  ctx.navigate('sub_response', { subRequestId: sub.id });
                  return;
                }
              }
              if (n.leg_id) ctx.navigate('leg', { legId: n.leg_id });
            }}
          >
            <span style={{ fontSize: 22 }}>{KIND_ICON[n.kind] || '🔔'}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: 14 }}>{n.body}</div>
              <div className="muted" style={{ fontSize: 12, marginTop: 4 }}>
                {relTime(n.created_at)}
              </div>
            </div>
            {!n.read_at && (
              <span
                style={{
                  width: 8,
                  height: 8,
                  background: 'var(--blue-500)',
                  borderRadius: 999,
                  marginTop: 8,
                }}
              />
            )}
          </button>
        ))}
      </div>
    </>
  );
}
