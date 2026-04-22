import {
  getCurrentParent,
  getTeamsForParent,
  getSourcesForTeam,
} from '../data/store.js';

/**
 * Empty-state nudge for the Today/Schedule screens. Adapts the copy + CTA
 * to where the user actually is in setup so the path to a connected
 * GameChanger feed is always one tap away — even when there's no data.
 *
 * variant:
 *   'today'    – shows under "No events for this day". Only nudges if there
 *                are zero connected sources across all of the user's teams,
 *                so a parent with a normal off-day doesn't get spammed.
 *   'schedule' – shows when the schedule is completely empty. Always nudges.
 */
export function CalendarEmptyCTA({ ctx, variant = 'schedule' }) {
  const me = getCurrentParent();
  if (!me) return null;
  const teams = getTeamsForParent(me.id);
  const sources = teams.flatMap((t) => getSourcesForTeam(t.id));

  if (variant === 'today' && sources.length > 0) return null;

  if (teams.length === 0) {
    return (
      <Card icon="📅" title="Sync GameChanger or any .ics feed">
        <p>
          Schedules attach to a group. Create or join one, then pull in every game and practice
          automatically.
        </p>
        <button
          type="button"
          className="btn btn-primary"
          style={{ marginTop: 12 }}
          onClick={() => ctx.navigate('create_group')}
        >
          + Create or join a group
        </button>
      </Card>
    );
  }

  if (sources.length === 0) {
    const team = teams[0];
    return (
      <Card icon="🟢" title={`Connect a calendar to ${team.name}`}>
        <p>
          Auto-import every game, practice, and cancellation from GameChanger, TeamSnap, Apple
          Calendar, Google Calendar, or any <code>.ics</code> link.
        </p>
        <button
          type="button"
          className="btn btn-primary"
          style={{ marginTop: 12 }}
          onClick={() => ctx.navigate('add_schedule_source', { teamId: team.id })}
        >
          + Add a calendar feed
        </button>
      </Card>
    );
  }

  // Has a feed but the schedule still came back empty (e.g. season's over,
  // or the last sync returned 0 events). Point the user at the feeds list
  // so they can resync or fix the URL.
  const team = teams[0];
  return (
    <Card icon="🔄" title="No upcoming events from your calendar">
      <p>
        Your feed is connected but didn't return any upcoming games or practices. Try syncing
        again — or check the URL if it still looks empty.
      </p>
      <button
        type="button"
        className="btn btn-primary"
        style={{ marginTop: 12 }}
        onClick={() => ctx.navigate('schedule_sources', { teamId: team.id })}
      >
        Manage calendar feeds →
      </button>
    </Card>
  );
}

function Card({ icon, title, children }) {
  return (
    <div
      className="card"
      style={{
        background: 'var(--blue-100)',
        color: 'var(--blue-text)',
      }}
    >
      <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
        <span style={{ fontSize: 22 }}>{icon}</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>{title}</div>
          <div style={{ fontSize: 13, opacity: 0.9, lineHeight: 1.45 }}>{children}</div>
        </div>
      </div>
    </div>
  );
}
