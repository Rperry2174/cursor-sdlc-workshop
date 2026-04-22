import { useMemo } from 'react';
import {
  getCurrentParent,
  getEventsForParent,
  getLegsForEvent,
} from '../data/store.js';
import { TopNav } from '../components/TopNav.jsx';
import { SourceBadge } from '../components/SourceBadge.jsx';
import { CalendarEmptyCTA } from '../components/CalendarEmptyCTA.jsx';

function fmtTime(iso) {
  return new Date(iso).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}

function dateLabel(iso) {
  const d = new Date(iso);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dDay = new Date(d);
  dDay.setHours(0, 0, 0, 0);
  const diff = Math.round((dDay - today) / 86400000);
  if (diff === 0) return 'Today';
  if (diff === 1) return 'Tomorrow';
  return d.toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' });
}

export function Schedule({ ctx }) {
  const me = getCurrentParent();
  const events = getEventsForParent(me.id);

  const grouped = useMemo(() => {
    const map = new Map();
    for (const e of events) {
      const k = e.start_at.slice(0, 10);
      if (!map.has(k)) map.set(k, []);
      map.get(k).push(e);
    }
    return [...map.entries()];
  }, [events]);

  return (
    <>
      <TopNav title="Schedule" />
      <div className="section">
        {grouped.length === 0 && (
          <>
            <div className="empty">
              <div className="icon">📅</div>
              <div className="h3">Nothing on the calendar</div>
            </div>
            <CalendarEmptyCTA ctx={ctx} variant="schedule" />
          </>
        )}
        {grouped.map(([dayKey, dayEvents]) => (
          <div key={dayKey} style={{ marginBottom: 16 }}>
            <div className="caps muted" style={{ marginBottom: 8 }}>
              {dateLabel(dayEvents[0].start_at)}
            </div>
            {dayEvents.map((e) => {
              const legs = getLegsForEvent(e.id);
              const openCount = legs.filter((l) => !l.driver_id).length;
              return (
                <button
                  key={e.id}
                  type="button"
                  className="card"
                  style={{
                    display: 'block',
                    width: '100%',
                    textAlign: 'left',
                    padding: 14,
                  }}
                  onClick={() => ctx.navigate('leg', { legId: legs[0].id })}
                >
                  <div className="row-between">
                    <div>
                      <div style={{ fontWeight: 700 }}>
                        {e.type === 'game' ? '⚾ ' : e.type === 'imported' ? '📅 ' : '🏟️ '}
                        {e.title}
                      </div>
                      <div className="muted" style={{ fontSize: 13, marginTop: 2 }}>
                        {fmtTime(e.start_at)} · {e.location}
                      </div>
                      <div style={{ marginTop: 6 }}>
                        <SourceBadge event={e} />
                      </div>
                    </div>
                    {openCount > 0 ? (
                      <span className="pill pill-yellow">
                        ● {openCount} open
                      </span>
                    ) : (
                      <span className="pill pill-green">✓ Covered</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </>
  );
}
