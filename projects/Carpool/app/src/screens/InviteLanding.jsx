import { db, getMembersForTeam, getKidsOnTeam } from '../data/store.js';
import { Avatar } from '../components/Avatar.jsx';
import { TopNav } from '../components/TopNav.jsx';

export function InviteLanding({ inviteCode, ctx }) {
  const data = db();
  const team = data.teams.find((t) => t.invite_code === inviteCode);
  if (!team) {
    return (
      <>
        <TopNav title="Invite" onBack={() => ctx.navigate('profile')} />
        <div className="empty">
          <div className="icon">🔗</div>
          <div className="h3">Invite not found</div>
          <div>This invite code isn't valid.</div>
        </div>
      </>
    );
  }

  const members = getMembersForTeam(team.id);
  const kids = getKidsOnTeam(team.id);
  const admin = members.find(
    (m) => data.team_members.find((tm) => tm.parent_id === m.id && tm.team_id === team.id)?.role === 'admin',
  );
  const openLegs = data.carpool_legs.filter((l) => {
    const e = data.events.find((ev) => ev.id === l.event_id);
    return e && e.team_id === team.id && !l.driver_id;
  }).length;
  const events = data.events.filter((e) => e.team_id === team.id).length;

  return (
    <>
      <TopNav title="You're invited" onBack={() => ctx.navigate('profile')} />
      <div
        className="app-header"
        style={{ background: 'linear-gradient(135deg, var(--green-700), var(--green-900))' }}
      >
        <div style={{ textAlign: 'center', padding: '12px 0' }}>
          <div style={{ fontSize: 40 }}>{team.sport === 'Baseball' ? '⚾' : '🏆'}</div>
          <div style={{ fontSize: 22, fontWeight: 800, marginTop: 8 }}>{team.name}</div>
          <div style={{ opacity: 0.85, fontSize: 14 }}>
            {team.age_group ? `${team.age_group} · ` : ''}
            {team.season}
          </div>
        </div>
      </div>

      <div className="section">
        {admin && (
          <div className="card">
            <div className="row">
              <Avatar name={admin.name} color={admin.avatar_color} photo={admin.photo} size="lg" />
              <div style={{ flex: 1 }}>
                <div className="muted" style={{ fontSize: 12 }}>Invited by</div>
                <div style={{ fontWeight: 700, fontSize: 16 }}>{admin.name}</div>
                <div className="muted" style={{ fontSize: 12 }}>{admin.phone}</div>
              </div>
              <span className="pill pill-green">Organizer</span>
            </div>
            <div
              style={{
                marginTop: 12,
                padding: 12,
                background: 'var(--gray-50)',
                borderLeft: '3px solid var(--green-500)',
                fontStyle: 'italic',
                fontSize: 14,
                color: 'var(--gray-700)',
              }}
            >
              "Hey! Wanted to invite you to our carpool group for the season. Should make
              everyone's lives easier."
            </div>
          </div>
        )}

        <div className="row" style={{ gap: 8 }}>
          <Stat label="Events" value={events} />
          <Stat label="Families" value={members.length} />
          <Stat label="Open slots" value={openLegs} />
        </div>

        <div className="card">
          <div className="caps muted">Who's already in</div>
          <div style={{ marginTop: 8 }}>
            {members.map((m) => (
              <div key={m.id} className="list-row">
                <Avatar name={m.name} color={m.avatar_color} photo={m.photo} size="sm" />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{m.name}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card" style={{ background: 'var(--green-100)' }}>
          <div className="caps" style={{ color: 'var(--green-text)' }}>What you get</div>
          <div className="stack" style={{ marginTop: 8, gap: 6 }}>
            {[
              'See every game and practice in one calendar',
              'Drop your kid into another parent\'s car',
              'Get pinged when your kid is picked up and dropped off',
            ].map((p) => (
              <div key={p} className="row" style={{ fontSize: 14, color: 'var(--green-text)' }}>
                <span>✓</span>
                <span>{p}</span>
              </div>
            ))}
          </div>
        </div>

        <div
          className="muted"
          style={{ fontSize: 11, textAlign: 'center', marginBottom: 12 }}
        >
          🔒 Your kid's name and photo aren't visible until you join.
        </div>

        <button
          type="button"
          className="btn btn-primary"
          onClick={() => ctx.showToast('Demo: would join the team here')}
        >
          Join {team.name}
        </button>
        <button
          type="button"
          className="btn btn-ghost"
          style={{ marginTop: 8 }}
          onClick={() => ctx.navigate('profile')}
        >
          Decline
        </button>
      </div>
    </>
  );
}

function Stat({ label, value }) {
  return (
    <div
      className="card"
      style={{ flex: 1, textAlign: 'center', padding: '14px 8px', marginBottom: 12 }}
    >
      <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--green-700)' }}>{value}</div>
      <div className="muted" style={{ fontSize: 11, fontWeight: 600 }}>{label}</div>
    </div>
  );
}
