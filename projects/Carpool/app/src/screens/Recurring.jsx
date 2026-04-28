import { useMemo } from 'react';
import {
  getCurrentParent,
  getRecurringCommitmentsForParent,
  setRecurringPaused,
  deleteRecurringCommitment,
  getTeamsForParent,
  db,
} from '../data/store.js';
import { TopNav } from '../components/TopNav.jsx';

const DOW = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export function Recurring({ ctx }) {
  const me = getCurrentParent();
  const items = getRecurringCommitmentsForParent(me.id);
  const teams = getTeamsForParent(me.id);
  const teamById = useMemo(() => Object.fromEntries(teams.map((t) => [t.id, t])), [teams]);
  const data = db();

  function statsFor(rc) {
    const team = teamById[rc.team_id];
    if (!team) return { upcoming: 0, claimed: 0 };
    const upcoming = data.events.filter((e) => {
      if (e.team_id !== rc.team_id) return false;
      const dt = new Date(e.start_at);
      return dt.getDay() === rc.day_of_week && dt.getTime() > Date.now();
    });
    const upcomingLegs = upcoming
      .map((e) => data.carpool_legs.find((l) => l.event_id === e.id && l.direction === rc.direction))
      .filter(Boolean);
    const claimed = upcomingLegs.filter((l) => l.driver_id === rc.parent_id).length;
    return { upcoming: upcomingLegs.length, claimed };
  }

  return (
    <>
      <TopNav title="My recurring driving" onBack={() => ctx.navigate('profile')} />
      <div className="section">
        {items.length === 0 && (
          <div className="empty">
            <div className="icon">🔁</div>
            <div className="h3">No recurring slots yet</div>
            <div>
              Sign up for a leg with “Repeat every Wednesday” turned on to commit to that slot
              for the season.
            </div>
          </div>
        )}
        {items.map((rc) => {
          const team = teamById[rc.team_id];
          const stats = statsFor(rc);
          return (
            <div key={rc.id} className="card">
              <div className="row-between">
                <div>
                  <div className="caps muted">
                    {team?.sport === 'Baseball' ? '⚾ ' : '🏆 '}
                    {team?.name}
                  </div>
                  <div style={{ fontWeight: 700, fontSize: 16, marginTop: 4 }}>
                    Every {DOW[rc.day_of_week]} ·{' '}
                    {rc.direction === 'to_event' ? 'Drop-off' : 'Pick-up'}
                  </div>
                  <div className="muted" style={{ fontSize: 13, marginTop: 2 }}>
                    {rc.seat_capacity} seats · since {new Date(rc.created_at).toLocaleDateString()}
                  </div>
                </div>
                <span className={`pill ${rc.paused ? 'pill-yellow' : 'pill-green'}`}>
                  {rc.paused ? 'Paused' : 'Active'}
                </span>
              </div>

              <div style={{ marginTop: 14 }}>
                <div className="row-between" style={{ fontSize: 12 }}>
                  <span className="muted">Coverage this season</span>
                  <span style={{ fontWeight: 700 }}>
                    {stats.claimed} / {stats.upcoming} upcoming
                  </span>
                </div>
                <div
                  style={{
                    height: 8,
                    background: 'var(--gray-100)',
                    borderRadius: 999,
                    marginTop: 6,
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      width: `${stats.upcoming === 0 ? 0 : (stats.claimed / stats.upcoming) * 100}%`,
                      background: 'var(--green-500)',
                      height: '100%',
                    }}
                  />
                </div>
              </div>

              <div className="row" style={{ marginTop: 14, gap: 8 }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  style={{ width: 'auto', padding: '10px 14px', fontSize: 13 }}
                  onClick={() => {
                    setRecurringPaused(rc.id, !rc.paused);
                    ctx.showToast(rc.paused ? 'Resumed' : 'Paused — future weeks will be open');
                  }}
                >
                  {rc.paused ? 'Resume' : 'Pause'}
                </button>
                <button
                  type="button"
                  className="btn btn-ghost"
                  style={{ width: 'auto', padding: '10px 14px', fontSize: 13, color: 'var(--red-text)' }}
                  onClick={() => {
                    if (
                      confirm(
                        'Cancel this recurring commitment? Future weeks will be opened back up for the team.',
                      )
                    ) {
                      deleteRecurringCommitment(rc.id);
                      ctx.showToast('Recurring commitment removed');
                    }
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          );
        })}

        <button
          type="button"
          className="btn btn-secondary"
          style={{ marginTop: 12 }}
          onClick={() => ctx.navigate('blackouts')}
        >
          Manage blackout dates →
        </button>
      </div>
    </>
  );
}
