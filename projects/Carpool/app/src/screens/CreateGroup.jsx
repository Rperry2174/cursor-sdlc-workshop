import { useState } from 'react';
import { db, getCurrentParent, _internals } from '../data/store.js';
import { TopNav } from '../components/TopNav.jsx';

const { persist, newId, nowIso } = _internals;

export function CreateGroup({ ctx }) {
  const me = getCurrentParent();
  const [step, setStep] = useState('choose'); // choose | manual | sync
  const [name, setName] = useState('');
  const [sport, setSport] = useState('Baseball');
  const [season, setSeason] = useState('Spring 2026');

  if (step === 'choose') {
    return (
      <>
        <TopNav title="Create a group" onBack={() => ctx.navigate('profile')} />
        <div className="section">
          <div className="muted" style={{ fontSize: 14, marginBottom: 16 }}>
            How do you want to set this up?
          </div>
          <button
            type="button"
            className="card"
            style={{ display: 'block', width: '100%', textAlign: 'left', padding: 18 }}
            onClick={() => setStep('sync')}
          >
            <div className="row" style={{ alignItems: 'flex-start' }}>
              <span style={{ fontSize: 28 }}>🔄</span>
              <div style={{ flex: 1 }}>
                <div className="row-between">
                  <div className="h3">Sync a team schedule</div>
                  <span className="pill pill-green">Recommended</span>
                </div>
                <div className="muted" style={{ fontSize: 13, marginTop: 4 }}>
                  Pulls in every practice and game from GameChanger, TeamSnap, SportsEngine,
                  Apple Calendar, Google Calendar, or any .ics URL. Auto-updates if the coach
                  changes the schedule.
                </div>
              </div>
            </div>
          </button>
          <button
            type="button"
            className="card"
            style={{ display: 'block', width: '100%', textAlign: 'left', padding: 18 }}
            onClick={() => setStep('manual')}
          >
            <div className="row" style={{ alignItems: 'flex-start' }}>
              <span style={{ fontSize: 28 }}>✏️</span>
              <div style={{ flex: 1 }}>
                <div className="h3">Create manually</div>
                <div className="muted" style={{ fontSize: 13, marginTop: 4 }}>
                  For activities that aren't on a roster system — piano, scouts, tutoring,
                  casual playdates.
                </div>
              </div>
            </div>
          </button>

          <div
            style={{
              marginTop: 16,
              padding: 12,
              background: 'var(--blue-100)',
              borderRadius: 12,
              fontSize: 12,
              color: 'var(--blue-text)',
            }}
          >
            ℹ️ Your invite code and shareable link are generated after the group is created.
          </div>
        </div>
      </>
    );
  }

  if (step === 'sync') {
    return (
      <>
        <TopNav title="Sync a schedule" onBack={() => setStep('choose')} />
        <div className="section">
          <div className="muted" style={{ fontSize: 14, marginBottom: 16 }}>
            (Demo only — sync providers come online in Phase 2.)
          </div>
          {['GameChanger', 'TeamSnap', 'SportsEngine', 'Apple Calendar', 'Google Calendar', 'Paste an .ics URL'].map(
            (p) => (
              <button
                key={p}
                type="button"
                className="card"
                style={{ display: 'block', width: '100%', textAlign: 'left', padding: 14 }}
                onClick={() => ctx.showToast(`${p} sync coming in Phase 2`)}
              >
                <div className="row-between">
                  <div style={{ fontWeight: 700 }}>{p}</div>
                  <span className="muted">→</span>
                </div>
              </button>
            ),
          )}
        </div>
      </>
    );
  }

  // manual step
  return (
    <>
      <TopNav title="Create manually" onBack={() => setStep('choose')} />
      <div className="section">
        <label className="field">Group name</label>
        <input
          className="input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Lucas's piano lessons"
          style={{ marginBottom: 14 }}
        />

        <label className="field">Activity</label>
        <input
          className="input"
          value={sport}
          onChange={(e) => setSport(e.target.value)}
          placeholder="Baseball, Soccer, Piano…"
          style={{ marginBottom: 14 }}
        />

        <label className="field">Season</label>
        <input
          className="input"
          value={season}
          onChange={(e) => setSeason(e.target.value)}
          placeholder="Spring 2026"
        />

        <button
          type="button"
          className="btn btn-primary"
          style={{ marginTop: 18 }}
          disabled={name.trim().length < 2}
          onClick={() => {
            const data = db();
            const teamId = newId('t');
            const code = generateInviteCode(name);
            data.teams.push({
              id: teamId,
              name: name.trim(),
              sport: sport.trim() || 'Activity',
              age_group: '',
              season: season.trim(),
              invite_code: code,
              plan: 'free',
              stripe_customer_id: null,
              created_at: nowIso(),
            });
            data.team_members.push({
              team_id: teamId,
              parent_id: me.id,
              role: 'admin',
              driver_approved: true,
            });
            persist();
            ctx.showToast(`${name} created — invite code ${code}`);
            ctx.navigate('profile');
          }}
        >
          Create group
        </button>
      </div>
    </>
  );
}

function generateInviteCode(name) {
  const slug = name
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '')
    .slice(0, 6) || 'GROUP';
  const num = Math.floor(1000 + Math.random() * 9000);
  return `${slug}-${num}`;
}
