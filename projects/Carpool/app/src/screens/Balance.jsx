import { useMemo } from 'react';
import {
  getCurrentParent,
  getMembersForTeam,
  getSeasonBalance,
  db,
} from '../data/store.js';
import { Avatar } from '../components/Avatar.jsx';
import { TopNav } from '../components/TopNav.jsx';

export function Balance({ teamId, ctx }) {
  const me = getCurrentParent();
  const team = db().teams.find((t) => t.id === teamId);
  const members = team ? getMembersForTeam(team.id) : [];
  const counts = team ? getSeasonBalance(team.id) : {};

  const totalDriven = useMemo(
    () => Object.values(counts).reduce((a, b) => a + (b.driven || 0) + (b.scheduled || 0), 0),
    [counts],
  );
  const fairShare = members.length > 0 ? totalDriven / members.length : 0;

  if (!team) {
    return (
      <>
        <TopNav title="Season balance" onBack={() => ctx.navigate('profile')} />
        <div className="empty">Team not found.</div>
      </>
    );
  }

  return (
    <>
      <TopNav title="Season balance" onBack={() => ctx.navigate('profile')} />
      <div className="section">
        <div className="card">
          <div className="caps muted">{team.name}</div>
          <div style={{ fontSize: 22, fontWeight: 800, marginTop: 4 }}>Driving fairness</div>
          <div className="muted" style={{ fontSize: 13, marginTop: 4 }}>
            {totalDriven} legs scheduled or driven · fair share is {fairShare.toFixed(1)} per family
          </div>
        </div>

        {members
          .map((m) => ({ ...m, ...(counts[m.id] || { driven: 0, scheduled: 0, requested: 0 }) }))
          .sort((a, b) => b.driven + b.scheduled - (a.driven + a.scheduled))
          .map((m) => {
            const total = m.driven + m.scheduled;
            const delta = total - fairShare;
            const status =
              Math.abs(delta) < 0.5
                ? { label: 'On track', color: 'green' }
                : delta > 0
                  ? { label: `+${delta.toFixed(1)} above`, color: 'blue' }
                  : { label: `${delta.toFixed(1)} below`, color: 'yellow' };
            const pct = totalDriven === 0 ? 0 : (total / totalDriven) * 100;
            return (
              <div key={m.id} className="card">
                <div className="row" style={{ alignItems: 'center' }}>
                  <Avatar name={m.name} color={m.avatar_color} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 15 }}>
                      {m.name}
                      {m.id === me.id && <span className="muted" style={{ fontWeight: 400 }}> (you)</span>}
                    </div>
                    <div className="muted" style={{ fontSize: 12, marginTop: 2 }}>
                      {m.driven} driven · {m.scheduled} upcoming · {m.requested} sub requests
                    </div>
                  </div>
                  <span className={`pill pill-${status.color}`}>{status.label}</span>
                </div>
                <div
                  style={{
                    marginTop: 10,
                    height: 8,
                    background: 'var(--gray-100)',
                    borderRadius: 999,
                    overflow: 'hidden',
                    position: 'relative',
                  }}
                >
                  <div
                    style={{
                      width: `${pct}%`,
                      background: status.color === 'green' ? 'var(--green-500)' : status.color === 'blue' ? 'var(--blue-500)' : 'var(--yellow-500)',
                      height: '100%',
                    }}
                  />
                  {totalDriven > 0 && (
                    <div
                      style={{
                        position: 'absolute',
                        top: -4,
                        bottom: -4,
                        left: `${(fairShare / totalDriven) * 100}%`,
                        width: 2,
                        background: 'var(--gray-700)',
                      }}
                      title="Fair share"
                    />
                  )}
                </div>
                {delta < -1 && m.id !== me.id && (
                  <button
                    type="button"
                    className="btn btn-ghost"
                    style={{ marginTop: 10, fontSize: 13, justifyContent: 'flex-start', padding: '6px 0' }}
                    onClick={() => {
                      ctx.showToast(`Nudged ${m.name.split(' ')[0]} to take an open leg`);
                    }}
                  >
                    💌 Nudge {m.name.split(' ')[0]} to take an open leg
                  </button>
                )}
              </div>
            );
          })}

        <div className="muted" style={{ fontSize: 12, padding: '8px 4px' }}>
          The vertical line marks the fair share. Bars below the line drive less than average.
        </div>
      </div>
    </>
  );
}
