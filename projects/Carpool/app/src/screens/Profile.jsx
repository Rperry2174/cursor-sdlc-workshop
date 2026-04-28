import { useRef, useState } from 'react';
import {
  getCurrentParent,
  getKidsForParent,
  getTeamsForParent,
  getMembersForTeam,
  getCoParentsForChild,
  getSourcesForTeam,
  getAutoClaimRules,
  addAutoClaimRule,
  toggleAutoClaimRule,
  removeAutoClaimRule,
  setParentPhoto,
  setChildPhoto,
  getTeamsForChild,
  setChildTeams,
  updateChildProfile,
} from '../data/store.js';
import { applyAutoClaimRules } from '../data/lifecycle.js';
import { updateBackendChildTeams } from '../data/backendMutations.js';
import { Avatar } from '../components/Avatar.jsx';
import { TopNav } from '../components/TopNav.jsx';
import { compressImageToDataUrl } from '../lib/imageUtils.js';

export function Profile({ ctx, backendProfile }) {
  const me = getCurrentParent();
  const kids = getKidsForParent(me.id);
  const teams = getTeamsForParent(me.id);

  // Aggregate every connected calendar feed across every team the parent
  // belongs to, so the user has one obvious place to manage them.
  const allSources = teams.flatMap((t) =>
    getSourcesForTeam(t.id).map((s) => ({ ...s, _team: t })),
  );

  return (
    <>
      <TopNav title="Profile" />
      <div className="section">
        <BackendProfileCard backendProfile={backendProfile} ctx={ctx} />

        <div className="card">
          <div className="row" style={{ alignItems: 'center' }}>
            <PhotoEditableAvatar
              name={me.name}
              color={me.avatar_color}
              photo={me.photo}
              size="lg"
              onPick={(dataUrl) => {
                setParentPhoto(me.id, dataUrl);
                ctx.showToast(dataUrl ? 'Photo updated' : 'Photo removed');
              }}
            />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 17 }}>{me.name}</div>
              <div className="muted" style={{ fontSize: 13 }}>{me.phone}</div>
              <div className="muted" style={{ fontSize: 12, marginTop: 2 }}>
                Default seats: {me.default_seats}
              </div>
            </div>
          </div>
        </div>

        <CalendarFeedsSection teams={teams} sources={allSources} ctx={ctx} />

        <AutoClaimRulesSection me={me} teams={teams} ctx={ctx} />

        <div className="caps muted" style={{ margin: '16px 4px 8px' }}>My kids</div>
        {kids.map((k) => {
          const coParents = getCoParentsForChild(k.id).filter((p) => p.id !== me.id);
          return (
            <div key={k.id} className="card">
              <div className="row">
                <PhotoEditableAvatar
                  name={k.name}
                  color={k.avatar_color}
                  photo={k.photo}
                  size="lg"
                  onPick={(dataUrl) => {
                    setChildPhoto(k.id, dataUrl);
                    ctx.showToast(dataUrl ? `Photo updated for ${k.name}` : `Photo removed for ${k.name}`);
                  }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 16 }}>{k.name}</div>
                  <div className="muted" style={{ fontSize: 13 }}>
                    age {k.age} · {k.school}
                  </div>
                  {coParents.length > 0 && (
                    <div className="muted" style={{ fontSize: 12, marginTop: 4 }}>
                      Co-parent: {coParents.map((p) => p.name.split(' ')[0]).join(', ')}
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  className="btn btn-secondary"
                  style={{ width: 'auto', padding: '8px 12px', fontSize: 13 }}
                  onClick={() => ctx.navigate('kid_profile', { childId: k.id })}
                >
                  Edit
                </button>
              </div>
              <KidTeamsRow kid={k} teams={teams} ctx={ctx} />
            </div>
          );
        })}

        <div className="caps muted" style={{ margin: '16px 4px 8px' }}>My teams</div>
        {teams.map((t) => {
          const members = getMembersForTeam(t.id);
          return (
            <div key={t.id} className="card">
              <div className="row-between">
                <div>
                  <div style={{ fontWeight: 700, fontSize: 16 }}>
                    {t.sport === 'Baseball' ? '⚾ ' : '🏆 '}
                    {t.name}
                  </div>
                  <div className="muted" style={{ fontSize: 13, marginTop: 2 }}>
                    {t.age_group} · {t.season}
                  </div>
                </div>
                <span className="pill pill-gray">{members.length} families</span>
              </div>
              <div style={{ marginTop: 12 }}>
                <div className="caps muted" style={{ marginBottom: 6 }}>Invite code</div>
                <div className="row-between">
                  <code
                    style={{
                      background: 'var(--gray-100)',
                      padding: '8px 12px',
                      borderRadius: 8,
                      fontSize: 14,
                      fontWeight: 700,
                      letterSpacing: '0.04em',
                    }}
                  >
                    {t.invite_code}
                  </code>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    style={{ width: 'auto', padding: '8px 12px', fontSize: 13 }}
                    onClick={() => {
                      navigator.clipboard?.writeText(t.invite_code);
                      ctx.showToast('Invite code copied');
                    }}
                  >
                    Copy
                  </button>
                </div>
                <button
                  type="button"
                  className="btn btn-ghost"
                  style={{ marginTop: 8, fontSize: 13 }}
                  onClick={() => ctx.navigate('invite', { inviteCode: t.invite_code })}
                >
                  Preview the invite landing page →
                </button>
              </div>
              <div style={{ marginTop: 12, borderTop: '1px solid var(--gray-100)', paddingTop: 12 }}>
                <div className="caps muted" style={{ marginBottom: 8 }}>Team members</div>
                {members.map((p) => (
                  <div key={p.id} className="list-row">
                    <Avatar name={p.name} color={p.avatar_color} photo={p.photo} size="sm" />
                    <div style={{ flex: 1, fontWeight: 600, fontSize: 14 }}>
                      {p.name}
                      {p.id === me.id && <span className="muted" style={{ fontWeight: 400 }}> (you)</span>}
                    </div>
                    <a
                      href={`tel:${p.phone}`}
                      className="btn btn-ghost"
                      style={{ width: 'auto', padding: '4px 8px', fontSize: 12 }}
                    >
                      📞
                    </a>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 12, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  style={{ padding: '10px 12px', fontSize: 13 }}
                  onClick={() => ctx.navigate('chat', { teamId: t.id })}
                >
                  💬 Team chat
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  style={{ padding: '10px 12px', fontSize: 13 }}
                  onClick={() => ctx.navigate('balance', { teamId: t.id })}
                >
                  ⚖️ Balance
                </button>
              </div>
            </div>
          );
        })}

        <div className="caps muted" style={{ margin: '16px 4px 8px' }}>Settings</div>
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <SettingsRow label="🔁 My recurring driving" onClick={() => ctx.navigate('recurring')} />
          <SettingsRow label="🌴 Blackout dates" onClick={() => ctx.navigate('blackouts')} />
          <SettingsRow label="🔔 Notifications" onClick={() => ctx.navigate('notif_prefs')} />
          <SettingsRow label="📬 Today's digest preview" onClick={() => ctx.navigate('digest')} />
        </div>

        <button
          type="button"
          className="btn btn-secondary"
          style={{ marginTop: 12 }}
          onClick={() => ctx.navigate('create_group')}
        >
          + Create another group
        </button>
      </div>
    </>
  );
}

function BackendProfileCard({ backendProfile, ctx }) {
  if (!backendProfile || backendProfile.status === 'unconfigured') return null;

  if (backendProfile.status === 'loading') {
    return (
      <div className="card" style={{ background: 'var(--gray-50)' }}>
        <div className="caps muted" style={{ marginBottom: 6 }}>Kinpala backend</div>
        <div className="muted" style={{ fontSize: 13 }}>Checking Supabase session…</div>
      </div>
    );
  }

  if (backendProfile.status === 'signed_out' || backendProfile.status === 'no_parent') {
    return (
      <div className="card" style={{ background: 'var(--yellow-100)', color: 'var(--yellow-text)' }}>
        <div className="caps" style={{ marginBottom: 6, opacity: 0.8 }}>Kinpala backend</div>
        <div style={{ fontWeight: 800, fontSize: 15 }}>
          This browser is not connected to a real Kinpala profile yet.
        </div>
        <div style={{ fontSize: 13, marginTop: 4 }}>
          Run Start fresh onboarding to create a Supabase-backed parent/team.
        </div>
      </div>
    );
  }

  if (backendProfile.status === 'error') {
    return (
      <div className="card" style={{ background: 'var(--red-100)', color: 'var(--red-text)' }}>
        <div className="caps" style={{ marginBottom: 6, opacity: 0.8 }}>Kinpala backend</div>
        <div style={{ fontWeight: 800, fontSize: 15 }}>Could not load Supabase profile</div>
        <div style={{ fontSize: 12, marginTop: 4 }}>{backendProfile.error}</div>
      </div>
    );
  }

  const { parent, children, teams, childTeams, membersByTeamId } = backendProfile.data;

  return (
    <>
      <div className="caps muted" style={{ margin: '0 4px 8px' }}>
        Kinpala backend
      </div>
      <div className="card" style={{ border: '1.5px solid var(--green-700)' }}>
        <div className="row" style={{ alignItems: 'center' }}>
          <Avatar name={parent.name} color={parent.avatar_color} photo={parent.photo_url} size="lg" />
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 800, fontSize: 17 }}>{parent.name}</div>
            <div className="muted" style={{ fontSize: 13 }}>{parent.phone || 'No phone saved'}</div>
            <div style={{ marginTop: 6 }}>
              <span className="pill pill-green">Loaded from Supabase</span>
            </div>
          </div>
        </div>

        <div style={{ marginTop: 14, borderTop: '1px solid var(--gray-100)', paddingTop: 12 }}>
          <div className="caps muted" style={{ marginBottom: 8 }}>
            Kids in backend ({children.length})
          </div>
          {children.length === 0 ? (
            <div className="muted" style={{ fontSize: 13 }}>No kids saved yet.</div>
          ) : (
            children.map((kid) => {
              const kidTeamIds = childTeams
                .filter((row) => row.child_id === kid.id)
                .map((row) => row.team_id);
              const kidTeams = teams.filter((team) => kidTeamIds.includes(team.id));
              return (
                <div key={kid.id} className="list-row">
                  <Avatar name={kid.name} color={kid.avatar_color} photo={kid.photo_url} size="sm" />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>{kid.name}</div>
                    <div className="muted" style={{ fontSize: 12 }}>
                      {kidTeams.length
                        ? kidTeams.map((team) => team.name).join(', ')
                        : 'Not assigned to a team'}
                    </div>
                  </div>
                  <BackendKidTeamsRow
                    kid={kid}
                    teams={teams}
                    childTeams={childTeams}
                    ctx={ctx}
                  />
                </div>
              );
            })
          )}
        </div>

        <div style={{ marginTop: 14, borderTop: '1px solid var(--gray-100)', paddingTop: 12 }}>
          <div className="caps muted" style={{ marginBottom: 8 }}>
            Teams in backend ({teams.length})
          </div>
          {teams.length === 0 ? (
            <div className="muted" style={{ fontSize: 13 }}>No teams saved yet.</div>
          ) : (
            teams.map((team) => {
              const members = membersByTeamId[team.id] || [];
              return (
                <div key={team.id} style={{ marginBottom: 14 }}>
                  <div className="row-between" style={{ alignItems: 'flex-start', gap: 10 }}>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: 15 }}>{team.name}</div>
                      <div className="muted" style={{ fontSize: 12, marginTop: 2 }}>
                        {team.sport || 'Activity'} · {team.season || 'Season TBD'}
                      </div>
                    </div>
                    <span className="pill pill-gray">
                      {members.length} {members.length === 1 ? 'family' : 'families'}
                    </span>
                  </div>

                  <div style={{ marginTop: 10 }}>
                    <div className="caps muted" style={{ marginBottom: 6 }}>Invite code</div>
                    <div className="row-between">
                      <code
                        style={{
                          background: 'var(--gray-100)',
                          padding: '8px 12px',
                          borderRadius: 8,
                          fontSize: 14,
                          fontWeight: 800,
                          letterSpacing: '0.04em',
                        }}
                      >
                        {team.invite_code}
                      </code>
                      <button
                        type="button"
                        className="btn btn-secondary"
                        style={{ width: 'auto', padding: '8px 12px', fontSize: 13 }}
                        onClick={() => {
                          navigator.clipboard?.writeText(team.invite_code);
                          ctx.showToast('Backend invite code copied');
                        }}
                      >
                        Copy
                      </button>
                    </div>
                  </div>

                  {members.length > 0 && (
                    <div style={{ marginTop: 10 }}>
                      <div className="caps muted" style={{ marginBottom: 6 }}>Members</div>
                      {members.map((member) => (
                        <div key={`${team.id}-${member.parent_id}`} className="list-row">
                          <Avatar
                            name={member.parent?.name || 'Parent'}
                            color={member.parent?.avatar_color}
                            photo={member.parent?.photo_url}
                            size="sm"
                          />
                          <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: 700, fontSize: 13 }}>
                              {member.parent?.name || 'Parent'}
                              {member.parent_id === parent.id && (
                                <span className="muted" style={{ fontWeight: 400 }}> (you)</span>
                              )}
                            </div>
                            <div className="muted" style={{ fontSize: 11 }}>
                              {member.role} · {member.driver_approved ? 'approved driver' : 'coordinator only'}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </>
  );
}

function BackendKidTeamsRow({ kid, teams, childTeams, ctx }) {
  const [busyTeamId, setBusyTeamId] = useState(null);
  const assignedIds = childTeams
    .filter((row) => row.child_id === kid.id)
    .map((row) => row.team_id);
  const allowedIds = teams.map((team) => team.id);

  if (teams.length === 0) return null;

  const toggle = async (teamId) => {
    const isOn = assignedIds.includes(teamId);
    const next = isOn
      ? assignedIds.filter((id) => id !== teamId)
      : [...assignedIds, teamId];
    setBusyTeamId(teamId);
    const result = await updateBackendChildTeams(kid.id, next, { allowedTeamIds: allowedIds });
    setBusyTeamId(null);
    if (result.ok) {
      const team = teams.find((t) => t.id === teamId);
      ctx.showToast(
        isOn
          ? `Removed ${kid.name.split(' ')[0]} from ${team?.name || 'team'}`
          : `Added ${kid.name.split(' ')[0]} to ${team?.name || 'team'}`,
      );
      ctx.refreshBackendProfile?.();
    } else {
      ctx.showToast(`Could not update teams: ${result.reason}`);
    }
  };

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
      {teams.map((team) => {
        const on = assignedIds.includes(team.id);
        return (
          <button
            key={team.id}
            type="button"
            disabled={busyTeamId === team.id}
            onClick={() => toggle(team.id)}
            style={{
              padding: '5px 9px',
              borderRadius: 999,
              border: on ? '1px solid var(--green-700)' : '1px solid var(--gray-300)',
              background: on ? 'var(--green-100)' : 'white',
              color: on ? 'var(--green-text)' : 'var(--gray-700)',
              fontSize: 11,
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            {on ? '✓ ' : ''}
            {team.name}
          </button>
        );
      })}
    </div>
  );
}

export function KidProfile({ childId, ctx }) {
  const me = getCurrentParent();
  const kids = getKidsForParent(me.id);
  const kid = kids.find((k) => k.id === childId);
  const teams = getTeamsForParent(me.id);
  const [draft, setDraft] = useState(() => ({
    name: kid?.name || '',
    school: kid?.school || '',
    position: kid?.position || '',
    age: kid?.age || '',
  }));

  if (!kid) {
    return (
      <>
        <TopNav title="Kid profile" onBack={() => ctx.navigate('profile')} />
        <div className="section">
          <div className="card">Kid not found.</div>
        </div>
      </>
    );
  }

  const save = () => {
    updateChildProfile(kid.id, {
      name: draft.name.trim() || kid.name,
      school: draft.school.trim(),
      position: draft.position.trim(),
      age: Number(draft.age) || null,
    });
    ctx.showToast(`${draft.name.trim() || kid.name} updated`);
    ctx.navigate('profile');
  };

  return (
    <>
      <TopNav title={kid.name} onBack={() => ctx.navigate('profile')} />
      <div className="section">
        <div className="card">
          <div className="row" style={{ alignItems: 'center', marginBottom: 16 }}>
            <PhotoEditableAvatar
              name={kid.name}
              color={kid.avatar_color}
              photo={kid.photo}
              size="lg"
              onPick={(dataUrl) => {
                setChildPhoto(kid.id, dataUrl);
                ctx.showToast(dataUrl ? `Photo updated for ${kid.name}` : `Photo removed for ${kid.name}`);
              }}
            />
            <div>
              <div style={{ fontWeight: 800, fontSize: 18 }}>Edit kid profile</div>
              <div className="muted" style={{ fontSize: 13 }}>
                Manage basics and team memberships.
              </div>
            </div>
          </div>

          <label className="field">Name</label>
          <input
            className="input"
            value={draft.name}
            onChange={(e) => setDraft({ ...draft, name: e.target.value })}
            style={{ marginBottom: 12 }}
          />

          <label className="field">Age</label>
          <input
            className="input"
            type="number"
            inputMode="numeric"
            value={draft.age ?? ''}
            onChange={(e) => setDraft({ ...draft, age: e.target.value })}
            style={{ marginBottom: 12 }}
          />

          <label className="field">School</label>
          <input
            className="input"
            value={draft.school}
            onChange={(e) => setDraft({ ...draft, school: e.target.value })}
            placeholder="e.g. Lincoln Elementary"
            style={{ marginBottom: 12 }}
          />

          <label className="field">Notes / position</label>
          <input
            className="input"
            value={draft.position}
            onChange={(e) => setDraft({ ...draft, position: e.target.value })}
            placeholder="e.g. Pitcher, piano, pickup notes"
          />
        </div>

        <div className="card">
          <div className="caps muted" style={{ marginBottom: 8 }}>Teams</div>
          <div style={{ fontSize: 13, color: 'var(--gray-700)', marginBottom: 10 }}>
            Pick which teams this kid belongs to. Calendar events and open rides are filtered by
            these assignments.
          </div>
          <KidTeamsRow kid={kid} teams={teams} ctx={ctx} />
        </div>

        <button type="button" className="btn btn-primary" onClick={save}>
          Save kid profile
        </button>
      </div>
    </>
  );
}

function CalendarFeedsSection({ teams, sources, ctx }) {
  // Always-visible affordance for connecting and managing calendar feeds.
  // Lives at the top of Profile so it isn't buried inside a team card.
  const hasTeam = teams.length > 0;

  return (
    <>
      <div className="caps muted" style={{ margin: '16px 4px 8px' }}>
        Calendar feeds
      </div>

      {!hasTeam && (
        <div
          className="card"
          style={{
            background: 'var(--blue-100)',
            color: 'var(--blue-text)',
          }}
        >
          <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
            <span style={{ fontSize: 22 }}>📅</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 15 }}>
                Sync GameChanger or any .ics feed
              </div>
              <div style={{ fontSize: 13, marginTop: 4, opacity: 0.9 }}>
                Schedules attach to a group. Create or join a group first, then come back here to
                paste your calendar link.
              </div>
            </div>
          </div>
          <button
            type="button"
            className="btn btn-primary"
            style={{ marginTop: 12 }}
            onClick={() => ctx.navigate('create_group')}
          >
            + Create or join a group
          </button>
        </div>
      )}

      {hasTeam && sources.length === 0 && (
        <div className="card" style={{ background: 'var(--blue-100)', color: 'var(--blue-text)' }}>
          <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
            <span style={{ fontSize: 22 }}>🟢</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 15 }}>
                Connect a calendar to {teams[0].name}
              </div>
              <div style={{ fontSize: 13, marginTop: 4, opacity: 0.9 }}>
                Auto-import every game, practice, and cancellation from GameChanger, TeamSnap,
                Apple Calendar, Google Calendar, or any <code>.ics</code> link.
              </div>
            </div>
          </div>
          <button
            type="button"
            className="btn btn-primary"
            style={{ marginTop: 12 }}
            onClick={() => ctx.navigate('add_schedule_source', { teamId: teams[0].id })}
          >
            + Add a calendar feed
          </button>
          {teams.length > 1 && (
            <button
              type="button"
              className="btn btn-ghost"
              style={{ marginTop: 6, fontSize: 13 }}
              onClick={() => ctx.navigate('schedule_sources', { teamId: teams[0].id })}
            >
              Manage feeds for other teams →
            </button>
          )}
        </div>
      )}

      {hasTeam && sources.length > 0 && (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          {sources.map((s, i) => (
            <button
              key={s.id}
              type="button"
              onClick={() => ctx.navigate('schedule_sources', { teamId: s._team.id })}
              style={{
                display: 'flex',
                width: '100%',
                gap: 12,
                alignItems: 'flex-start',
                padding: '12px 14px',
                borderTop: i === 0 ? 'none' : '1px solid var(--gray-100)',
                textAlign: 'left',
                background: 'transparent',
              }}
            >
              <span style={{ fontSize: 22 }}>{feedIcon(s)}</span>
              <span style={{ flex: 1, minWidth: 0 }}>
                <span style={{ fontWeight: 700, fontSize: 14, display: 'block' }}>
                  {s.name}
                </span>
                <span
                  className="muted"
                  style={{ fontSize: 12, display: 'block', marginTop: 2 }}
                >
                  {s._team.name}
                  {' · '}
                  {s.last_event_count
                    ? `${s.last_event_count} events`
                    : 'never synced'}
                  {s.last_status === 'error' ? ' · ⚠️ last sync failed' : ''}
                </span>
              </span>
              <span className="muted" style={{ alignSelf: 'center' }}>›</span>
            </button>
          ))}
          <button
            type="button"
            onClick={() => ctx.navigate('add_schedule_source', { teamId: teams[0].id })}
            style={{
              display: 'flex',
              width: '100%',
              padding: '12px 14px',
              borderTop: '1px solid var(--gray-100)',
              fontWeight: 700,
              fontSize: 14,
              color: 'var(--green-text)',
              textAlign: 'left',
              background: 'transparent',
            }}
          >
            + Add a calendar feed
          </button>
        </div>
      )}
    </>
  );
}

function feedIcon(src) {
  if (src.kind === 'sample') return '🧪';
  const u = (src.url || '').toLowerCase();
  if (u.includes('gc.com') || u.includes('gamechanger')) return '🟢';
  if (u.includes('teamsnap')) return '🟦';
  if (u.includes('sportsengine')) return '🟧';
  if (u.includes('icloud')) return '🍎';
  if (u.includes('google.com')) return '📆';
  return '📅';
}

function SettingsRow({ label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        display: 'flex',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '14px 16px',
        borderTop: '1px solid var(--gray-100)',
        fontSize: 15,
        fontWeight: 600,
        color: 'var(--gray-900)',
        textAlign: 'left',
      }}
    >
      <span>{label}</span>
      <span className="muted">›</span>
    </button>
  );
}

const WEEKDAYS = [
  { id: 0, short: 'Sun', long: 'Sundays' },
  { id: 1, short: 'Mon', long: 'Mondays' },
  { id: 2, short: 'Tue', long: 'Tuesdays' },
  { id: 3, short: 'Wed', long: 'Wednesdays' },
  { id: 4, short: 'Thu', long: 'Thursdays' },
  { id: 5, short: 'Fri', long: 'Fridays' },
  { id: 6, short: 'Sat', long: 'Saturdays' },
];

const DIRECTIONS = [
  { id: 'any', label: 'Drop-offs & pick-ups' },
  { id: 'to_event', label: 'Drop-offs only' },
  { id: 'from_event', label: 'Pick-ups only' },
];

function AutoClaimRulesSection({ me, teams, ctx }) {
  const rules = getAutoClaimRules(me.id);
  const [showEditor, setShowEditor] = useState(false);

  return (
    <>
      <div className="caps muted" style={{ margin: '16px 4px 8px' }}>
        Auto-claim rules
      </div>

      {rules.length === 0 && !showEditor && (
        <div className="card" style={{ background: 'var(--green-100)', color: 'var(--green-text)' }}>
          <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
            <span style={{ fontSize: 22 }}>⚡</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 15 }}>
                Always take certain legs automatically
              </div>
              <div style={{ fontSize: 13, marginTop: 4, opacity: 0.9 }}>
                e.g. <em>"I drive every Tuesday drop-off for the Wildcats."</em> Matching legs claim
                themselves the next time you open Open Shifts.
              </div>
            </div>
          </div>
          <button
            type="button"
            className="btn btn-primary"
            style={{ marginTop: 12 }}
            onClick={() => setShowEditor(true)}
          >
            + Add a rule
          </button>
        </div>
      )}

      {rules.length > 0 && (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          {rules.map((r, i) => (
            <RuleRow
              key={r.id}
              rule={r}
              teams={teams}
              isFirst={i === 0}
              onToggle={() => {
                toggleAutoClaimRule(r.id);
              }}
              onRemove={() => {
                if (confirm('Delete this auto-claim rule?')) removeAutoClaimRule(r.id);
              }}
            />
          ))}
          <div style={{ padding: 12, borderTop: '1px solid var(--gray-100)' }}>
            <button
              type="button"
              className="btn btn-secondary"
              style={{ width: '100%' }}
              onClick={() => setShowEditor(true)}
            >
              + Add another rule
            </button>
          </div>
        </div>
      )}

      {showEditor && (
        <RuleEditor
          teams={teams}
          onCancel={() => setShowEditor(false)}
          onSave={(draft) => {
            addAutoClaimRule(me.id, draft);
            setShowEditor(false);
            const { claimed } = applyAutoClaimRules(me.id);
            ctx.showToast(
              claimed.length > 0
                ? `Rule saved · auto-claimed ${claimed.length} matching leg${claimed.length === 1 ? '' : 's'} ⚡`
                : 'Rule saved — matching legs will auto-claim from now on',
            );
          }}
        />
      )}
    </>
  );
}

function RuleRow({ rule, teams, isFirst, onToggle, onRemove }) {
  const day = WEEKDAYS.find((d) => d.id === rule.weekday)?.long || 'Unknown';
  const dir = DIRECTIONS.find((d) => d.id === rule.direction)?.label || rule.direction;
  const team = rule.team_id ? teams.find((t) => t.id === rule.team_id) : null;

  return (
    <div
      style={{
        padding: 14,
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        borderTop: isFirst ? 'none' : '1px solid var(--gray-100)',
        opacity: rule.enabled ? 1 : 0.55,
      }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 700, fontSize: 14 }}>
          ⚡ {day} · {dir}
        </div>
        <div className="muted" style={{ fontSize: 12, marginTop: 2 }}>
          {team ? team.name : 'Any team'}
          {!rule.enabled && ' · paused'}
        </div>
      </div>
      <button
        type="button"
        onClick={onToggle}
        style={{
          padding: '6px 10px',
          background: rule.enabled ? 'var(--green-100)' : 'var(--gray-100)',
          color: rule.enabled ? 'var(--green-text)' : 'var(--gray-700)',
          borderRadius: 999,
          fontSize: 11,
          fontWeight: 700,
        }}
      >
        {rule.enabled ? 'On' : 'Off'}
      </button>
      <button
        type="button"
        onClick={onRemove}
        aria-label="Remove rule"
        style={{
          fontSize: 18,
          color: 'var(--gray-500)',
          padding: 4,
        }}
      >
        ×
      </button>
    </div>
  );
}

function RuleEditor({ teams, onSave, onCancel }) {
  const [weekday, setWeekday] = useState(2);
  const [direction, setDirection] = useState('any');
  const [teamId, setTeamId] = useState('all');

  return (
    <div className="card" style={{ marginTop: 8, border: '2px solid var(--green-700)' }}>
      <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 10 }}>New rule</div>

      <div className="caps muted" style={{ marginBottom: 6 }}>Day of week</div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: 4,
          marginBottom: 12,
        }}
      >
        {WEEKDAYS.map((d) => {
          const active = d.id === weekday;
          return (
            <button
              key={d.id}
              type="button"
              onClick={() => setWeekday(d.id)}
              style={{
                padding: '8px 0',
                borderRadius: 8,
                background: active ? 'var(--green-700)' : 'var(--gray-100)',
                color: active ? 'white' : 'var(--gray-700)',
                fontSize: 12,
                fontWeight: 700,
              }}
            >
              {d.short}
            </button>
          );
        })}
      </div>

      <div className="caps muted" style={{ marginBottom: 6 }}>Direction</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 12 }}>
        {DIRECTIONS.map((d) => {
          const active = d.id === direction;
          return (
            <button
              key={d.id}
              type="button"
              onClick={() => setDirection(d.id)}
              style={{
                padding: '10px 12px',
                borderRadius: 10,
                background: active ? 'var(--green-100)' : 'var(--gray-100)',
                color: active ? 'var(--green-text)' : 'var(--gray-700)',
                fontSize: 13,
                fontWeight: 700,
                border: active ? '2px solid var(--green-700)' : '2px solid transparent',
                textAlign: 'left',
              }}
            >
              {d.label}
            </button>
          );
        })}
      </div>

      {teams.length > 0 && (
        <>
          <div className="caps muted" style={{ marginBottom: 6 }}>Team</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
            <ChipBtn label="Any team" active={teamId === 'all'} onClick={() => setTeamId('all')} />
            {teams.map((t) => (
              <ChipBtn
                key={t.id}
                label={t.name}
                active={teamId === t.id}
                onClick={() => setTeamId(t.id)}
              />
            ))}
          </div>
        </>
      )}

      <div style={{ display: 'flex', gap: 8 }}>
        <button
          type="button"
          className="btn btn-secondary"
          style={{ flex: 1 }}
          onClick={onCancel}
        >
          Cancel
        </button>
        <button
          type="button"
          className="btn btn-primary"
          style={{ flex: 2 }}
          onClick={() =>
            onSave({
              weekday,
              direction,
              team_id: teamId === 'all' ? null : teamId,
            })
          }
        >
          Save rule
        </button>
      </div>
    </div>
  );
}

function ChipBtn({ label, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        padding: '6px 12px',
        borderRadius: 999,
        background: active ? 'var(--green-700)' : 'var(--gray-100)',
        color: active ? 'white' : 'var(--gray-700)',
        fontSize: 12,
        fontWeight: 700,
      }}
    >
      {label}
    </button>
  );
}

function KidTeamsRow({ kid, teams, ctx }) {
  const assignedIds = getTeamsForChild(kid.id).map((t) => t.id);
  const allowedIds = teams.map((t) => t.id);

  if (teams.length === 0) {
    return (
      <div
        className="muted"
        style={{
          marginTop: 10,
          paddingTop: 10,
          borderTop: '1px solid var(--gray-100)',
          fontSize: 12,
        }}
      >
        Join or create a team first to assign {kid.name.split(' ')[0]} to one.
      </div>
    );
  }

  const toggle = (teamId) => {
    const isOn = assignedIds.includes(teamId);
    const next = isOn
      ? assignedIds.filter((id) => id !== teamId)
      : [...assignedIds, teamId];
    setChildTeams(kid.id, next, { allowedTeamIds: allowedIds });
    const team = teams.find((t) => t.id === teamId);
    ctx.showToast(
      isOn
        ? `Removed ${kid.name.split(' ')[0]} from ${team?.name || 'team'}`
        : `Added ${kid.name.split(' ')[0]} to ${team?.name || 'team'}`,
    );
  };

  return (
    <div
      style={{
        marginTop: 10,
        paddingTop: 10,
        borderTop: '1px solid var(--gray-100)',
      }}
    >
      <div className="caps muted" style={{ marginBottom: 6, fontSize: 11 }}>
        Teams
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {teams.map((t) => {
          const on = assignedIds.includes(t.id);
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => toggle(t.id)}
              style={{
                padding: '6px 10px',
                borderRadius: 999,
                border: on
                  ? '1px solid var(--green-700)'
                  : '1px solid var(--gray-300, #d1d5db)',
                background: on ? 'var(--green-100)' : 'white',
                color: on ? 'var(--green-text)' : 'var(--gray-700)',
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              {on ? '✓ ' : ''}
              {t.sport === 'Baseball' ? '⚾ ' : '🏆 '}
              {t.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function PhotoEditableAvatar({ name, color, photo, size = 'lg', onPick }) {
  const fileRef = useRef(null);
  const [busy, setBusy] = useState(false);

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = ''; // allow picking the same file again later
    if (!file) return;
    setBusy(true);
    try {
      const dataUrl = await compressImageToDataUrl(file, { maxSize: 256 });
      onPick(dataUrl);
    } catch (err) {
      console.error(err);
      alert(err.message || 'Could not process that image');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div style={{ position: 'relative', flexShrink: 0 }}>
      <button
        type="button"
        onClick={() => fileRef.current?.click()}
        title={photo ? 'Change photo' : 'Add a photo'}
        style={{
          padding: 0,
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          display: 'block',
          opacity: busy ? 0.5 : 1,
        }}
      >
        <Avatar name={name} color={color} photo={photo} size={size} />
        <span
          aria-hidden="true"
          style={{
            position: 'absolute',
            right: -2,
            bottom: -2,
            width: 22,
            height: 22,
            borderRadius: '50%',
            background: 'var(--green-700)',
            color: 'white',
            fontSize: 12,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '2px solid white',
            boxShadow: '0 1px 2px rgba(0,0,0,0.2)',
          }}
        >
          {photo ? '✎' : '+'}
        </span>
      </button>
      {photo && (
        <button
          type="button"
          onClick={() => onPick(null)}
          style={{
            display: 'block',
            marginTop: 4,
            fontSize: 11,
            color: 'var(--red-text)',
            fontWeight: 600,
            background: 'none',
            border: 'none',
            padding: 0,
            cursor: 'pointer',
          }}
        >
          Remove
        </button>
      )}
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        capture="user"
        style={{ display: 'none' }}
        onChange={handleFile}
      />
    </div>
  );
}
