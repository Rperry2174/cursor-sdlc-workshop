import { useEffect, useMemo, useState } from 'react';
import {
  getCurrentParent,
  getEventsForParent,
  getLegsForEvent,
} from '../data/store.js';
import { loadBackendScheduleEvents } from '../data/scheduleBackend.js';
import { TopNav } from '../components/TopNav.jsx';
import { SourceBadge } from '../components/SourceBadge.jsx';
import { CalendarEmptyCTA } from '../components/CalendarEmptyCTA.jsx';

function fmtTime(iso) {
  return new Date(iso).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}

function LegStatusPill({ label, leg }) {
  const open = !leg.driver_id;
  const cls = open ? 'pill pill-yellow' : 'pill pill-green';
  const text = open ? 'OPEN' : 'COVERED';
  return (
    <span className={cls} style={{ fontSize: 11, letterSpacing: 0.3 }}>
      {label}: {text}
    </span>
  );
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
  const localEvents = getEventsForParent(me.id);

  const [backend, setBackend] = useState({
    status: 'loading',
    backendEvents: [],
    backendLegsByEvent: {},
    error: null,
  });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const result = await loadBackendScheduleEvents();
      if (cancelled) return;
      if (result.ok) {
        setBackend({
          status: 'ready',
          backendEvents: result.events || [],
          backendLegsByEvent: result.legsByEvent || {},
          error: null,
        });
      } else if (result.skipped) {
        setBackend({
          status: 'fallback',
          backendEvents: [],
          backendLegsByEvent: {},
          error: null,
        });
      } else {
        setBackend({
          status: 'error',
          backendEvents: [],
          backendLegsByEvent: {},
          error: result.reason || 'Unknown backend error',
        });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const useBackend = backend.status === 'ready';
  const events = useBackend ? backend.backendEvents : localEvents;
  const legsForEvent = (eventId) =>
    useBackend ? backend.backendLegsByEvent[eventId] || [] : getLegsForEvent(eventId);

  const grouped = useMemo(() => {
    const map = new Map();
    for (const e of events) {
      const k = (e.start_at || '').slice(0, 10);
      if (!map.has(k)) map.set(k, []);
      map.get(k).push(e);
    }
    return [...map.entries()];
  }, [events]);

  return (
    <>
      <TopNav title="Schedule" />
      <div className="section">
        {useBackend && (
          <div style={{ margin: '0 4px 8px' }}>
            <span className="pill pill-green" style={{ fontSize: 11, letterSpacing: 0.3 }}>
              Loaded from Kinpala backend
            </span>
          </div>
        )}
        {backend.status === 'error' && (
          <div
            className="card"
            style={{
              background: 'var(--red-50)',
              color: 'var(--red-text)',
              fontSize: 12,
            }}
          >
            ⚠️ Backend schedule load failed: {backend.error} · showing local data.
          </div>
        )}
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
              const legs = legsForEvent(e.id);
              const toLeg = legs.find((l) => l.direction === 'to_event');
              const fromLeg = legs.find((l) => l.direction === 'from_event');
              const firstLegId = legs[0]?.id;
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
                  onClick={() => firstLegId && ctx.navigate('leg', { legId: firstLegId })}
                  disabled={!firstLegId}
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
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'flex-end' }}>
                      {toLeg && <LegStatusPill label="To" leg={toLeg} />}
                      {fromLeg && <LegStatusPill label="From" leg={fromLeg} />}
                    </div>
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
