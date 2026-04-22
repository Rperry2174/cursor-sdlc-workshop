import { useState, useMemo } from 'react';
import {
  getCurrentParent,
  getKidsForParent,
  getInvitablePeopleForParent,
  getTeamsForParent,
  createOneOffCarpool,
} from '../data/store.js';
import { Avatar } from '../components/Avatar.jsx';
import { Toggle } from '../components/Toggle.jsx';
import { Stepper } from '../components/Stepper.jsx';
import { TopNav } from '../components/TopNav.jsx';

const ROLES = [
  { id: 'driver', label: 'Driver', help: 'Can sign up to drive a leg, update ride status' },
  { id: 'rider', label: 'Rider', help: 'Can add their kid as a passenger' },
  { id: 'admin', label: 'Co-admin', help: 'Same powers as you — edit, invite, cancel' },
];

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

export function CreateCarpool({ ctx }) {
  const me = getCurrentParent();
  const myKids = getKidsForParent(me.id);
  const teams = getTeamsForParent(me.id);
  const invitable = getInvitablePeopleForParent(me.id);

  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [pickupFrom, setPickupFrom] = useState(me.home_address || '');
  const [date, setDate] = useState(todayKey());
  const [dropOff, setDropOff] = useState('15:30');
  const [pickUp, setPickUp] = useState('17:30');
  const [seats, setSeats] = useState(me.default_seats ?? 4);
  const [kidIds, setKidIds] = useState(() => myKids.map((k) => k.id));
  const [drivingDropOff, setDrivingDropOff] = useState(true);
  const [drivingPickUp, setDrivingPickUp] = useState(false);
  const [teamId, setTeamId] = useState(teams[0]?.id || '');
  const [tieToTeam, setTieToTeam] = useState(false);
  const [invitees, setInvitees] = useState({});
  const [notes, setNotes] = useState('');
  const [showPermissions, setShowPermissions] = useState(false);

  const inviteeList = useMemo(
    () =>
      Object.entries(invitees)
        .filter(([, role]) => role)
        .map(([parent_id, role]) => ({ parent_id, role })),
    [invitees],
  );

  const toggleInvitee = (parentId) => {
    setInvitees((prev) => {
      const next = { ...prev };
      if (next[parentId]) delete next[parentId];
      else next[parentId] = 'rider';
      return next;
    });
  };

  const setRole = (parentId, role) => {
    setInvitees((prev) => ({ ...prev, [parentId]: role }));
  };

  const toggleKid = (kidId) => {
    setKidIds((prev) =>
      prev.includes(kidId) ? prev.filter((k) => k !== kidId) : [...prev, kidId],
    );
  };

  const canSubmit = name.trim() && location.trim() && date && dropOff && pickUp;

  const submit = () => {
    const result = createOneOffCarpool({
      creator_id: me.id,
      team_id: tieToTeam ? teamId || null : null,
      name: name.trim(),
      location: location.trim(),
      date,
      drop_off_time: dropOff,
      pick_up_time: pickUp,
      pickup_from: pickupFrom.trim(),
      seat_capacity: seats,
      kid_ids: kidIds,
      invitees: inviteeList,
      driving_drop_off: drivingDropOff,
      driving_pick_up: drivingPickUp,
      notes: notes.trim(),
    });
    ctx.showToast(`"${name.trim()}" created${inviteeList.length ? ` · ${inviteeList.length} invited` : ''}`);
    ctx.navigate('leg', { legId: result.to_leg_id });
  };

  return (
    <>
      <TopNav title="New carpool" onBack={() => ctx.navigate('today')} />
      <div className="section">
        <div
          className="card"
          style={{
            background: 'linear-gradient(135deg, var(--green-700) 0%, var(--green-900) 100%)',
            color: 'white',
          }}
        >
          <div className="caps" style={{ opacity: 0.85 }}>🆕 You're the admin</div>
          <div style={{ fontSize: 18, fontWeight: 800, marginTop: 6 }}>
            Set up a one-off carpool
          </div>
          <div style={{ opacity: 0.9, fontSize: 13, marginTop: 6 }}>
            Birthday party, away game, scout meeting — anything that isn't on your team's regular
            schedule. You decide who's invited and what they can do.
          </div>
        </div>

        <div className="card">
          <label className="field">What is this carpool for?</label>
          <input
            className="input"
            placeholder="e.g. Sally's 7th birthday"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
          />

          <label className="field" style={{ marginTop: 14 }}>Where are you going?</label>
          <input
            className="input"
            placeholder="e.g. Jump Zone, 245 Main St"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />

          <label className="field" style={{ marginTop: 14 }}>Pick up / drop off from</label>
          <input
            className="input"
            placeholder="e.g. 124 Maple St (your house)"
            value={pickupFrom}
            onChange={(e) => setPickupFrom(e.target.value)}
          />

          <label className="field" style={{ marginTop: 14 }}>When?</label>
          <input
            type="date"
            className="input"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />

          <div className="row" style={{ gap: 10, marginTop: 12 }}>
            <label className="field" style={{ flex: 1 }}>
              Drop-off time
              <input
                type="time"
                className="input"
                value={dropOff}
                onChange={(e) => setDropOff(e.target.value)}
                style={{ marginTop: 4 }}
              />
            </label>
            <label className="field" style={{ flex: 1 }}>
              Pick-up time
              <input
                type="time"
                className="input"
                value={pickUp}
                onChange={(e) => setPickUp(e.target.value)}
                style={{ marginTop: 4 }}
              />
            </label>
          </div>
        </div>

        <div className="card">
          <div className="caps muted">Which of your kids?</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 10 }}>
            {myKids.map((k) => {
              const on = kidIds.includes(k.id);
              return (
                <button
                  key={k.id}
                  type="button"
                  onClick={() => toggleKid(k.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '8px 12px 8px 8px',
                    borderRadius: 999,
                    background: on ? 'var(--green-700)' : 'var(--gray-100)',
                    color: on ? 'white' : 'var(--gray-900)',
                    fontSize: 13,
                    fontWeight: 600,
                  }}
                >
                  <Avatar name={k.name} color={k.avatar_color} size="sm" />
                  {k.name}
                  {on && <span style={{ marginLeft: 4 }}>✓</span>}
                </button>
              );
            })}
          </div>
        </div>

        <div className="card">
          <div className="caps muted">Are you driving?</div>
          <div className="row-between" style={{ marginTop: 10, padding: '6px 0' }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: 14 }}>Drop-off</div>
              <div className="muted" style={{ fontSize: 12 }}>
                {pickupFrom || 'Pick-up location'} → {location || 'Destination'}
              </div>
            </div>
            <Toggle on={drivingDropOff} onChange={setDrivingDropOff} />
          </div>
          <div style={{ borderTop: '1px solid var(--gray-100)' }} />
          <div className="row-between" style={{ padding: '12px 0 6px' }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: 14 }}>Pick-up</div>
              <div className="muted" style={{ fontSize: 12 }}>
                {location || 'Destination'} → {pickupFrom || 'home'}
              </div>
            </div>
            <Toggle on={drivingPickUp} onChange={setDrivingPickUp} />
          </div>
          {(drivingDropOff || drivingPickUp) && (
            <>
              <div style={{ borderTop: '1px solid var(--gray-100)', marginTop: 8 }} />
              <div className="row-between" style={{ marginTop: 12 }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>Seats in your car</div>
                  <div className="muted" style={{ fontSize: 12 }}>Including driver's row</div>
                </div>
                <Stepper value={seats} onChange={setSeats} min={1} max={8} />
              </div>
            </>
          )}
          {!drivingDropOff && !drivingPickUp && (
            <div className="muted" style={{ fontSize: 12, marginTop: 10 }}>
              💡 Both legs will go out as “needs a driver” — invitees can claim them.
            </div>
          )}
        </div>

        <div className="card">
          <div className="row-between">
            <div className="caps muted">Invite parents ({inviteeList.length})</div>
            {inviteeList.length > 0 && (
              <button
                type="button"
                className="btn btn-ghost"
                style={{ width: 'auto', padding: '4px 8px', fontSize: 12 }}
                onClick={() => setShowPermissions((s) => !s)}
              >
                {showPermissions ? 'Hide roles' : 'Set roles'}
              </button>
            )}
          </div>
          {invitable.length === 0 ? (
            <div className="muted" style={{ fontSize: 13, marginTop: 10 }}>
              You don't have anyone in your contacts yet. Add a team in Profile to start inviting
              people.
            </div>
          ) : (
            <div style={{ marginTop: 10 }}>
              {invitable.map((p) => {
                const role = invitees[p.id];
                const on = !!role;
                return (
                  <div
                    key={p.id}
                    style={{
                      padding: '10px 0',
                      borderBottom: '1px solid var(--gray-100)',
                    }}
                  >
                    <div
                      className="list-row"
                      style={{ alignItems: 'center', padding: 0 }}
                    >
                      <button
                        type="button"
                        onClick={() => toggleInvitee(p.id)}
                        style={{
                          width: 24,
                          height: 24,
                          borderRadius: 6,
                          background: on ? 'var(--green-700)' : 'var(--gray-100)',
                          color: 'white',
                          fontWeight: 800,
                          fontSize: 14,
                          flexShrink: 0,
                        }}
                      >
                        {on ? '✓' : ''}
                      </button>
                      <Avatar name={p.name} color={p.avatar_color} size="sm" />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 600, fontSize: 14 }}>{p.name}</div>
                        <div className="muted" style={{ fontSize: 11 }}>{p.phone}</div>
                      </div>
                      {on && !showPermissions && (
                        <span
                          style={{
                            fontSize: 11,
                            fontWeight: 700,
                            color: 'var(--green-900)',
                            background: 'var(--green-100)',
                            padding: '4px 10px',
                            borderRadius: 999,
                            textTransform: 'uppercase',
                            letterSpacing: 0.4,
                          }}
                        >
                          {ROLES.find((r) => r.id === role)?.label}
                        </span>
                      )}
                    </div>
                    {on && showPermissions && (
                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns: '1fr 1fr 1fr',
                          gap: 6,
                          marginTop: 10,
                          marginLeft: 36,
                        }}
                      >
                        {ROLES.map((r) => {
                          const active = role === r.id;
                          return (
                            <button
                              key={r.id}
                              type="button"
                              onClick={() => setRole(p.id, r.id)}
                              style={{
                                padding: '8px 6px',
                                borderRadius: 10,
                                background: active ? 'var(--green-700)' : 'var(--gray-100)',
                                color: active ? 'white' : 'var(--gray-900)',
                                fontSize: 12,
                                fontWeight: 700,
                                lineHeight: 1.1,
                                border: active ? '1px solid var(--green-900)' : '1px solid transparent',
                              }}
                            >
                              {r.label}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
          {showPermissions && inviteeList.length > 0 && (
            <div
              style={{
                marginTop: 10,
                padding: 10,
                background: 'var(--gray-50)',
                borderRadius: 10,
                fontSize: 11,
              }}
            >
              {ROLES.map((r) => (
                <div key={r.id} style={{ marginBottom: 4 }}>
                  <strong>{r.label}:</strong> <span className="muted">{r.help}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {teams.length > 0 && (
          <div className="card">
            <div className="row-between">
              <div>
                <div style={{ fontWeight: 700, fontSize: 14 }}>Tie this to a team?</div>
                <div className="muted" style={{ fontSize: 12, marginTop: 2 }}>
                  Optional. If set, all team members can see this carpool.
                </div>
              </div>
              <Toggle on={tieToTeam} onChange={setTieToTeam} />
            </div>
            {tieToTeam && (
              <select
                className="input"
                style={{ marginTop: 10 }}
                value={teamId}
                onChange={(e) => setTeamId(e.target.value)}
              >
                {teams.map((t) => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            )}
          </div>
        )}

        <div className="card">
          <label className="field">Notes (optional)</label>
          <textarea
            className="input"
            placeholder="Bring water bottles, no nut snacks please, etc."
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        <button
          type="button"
          className="btn btn-primary"
          disabled={!canSubmit}
          style={{ marginTop: 8, opacity: canSubmit ? 1 : 0.5 }}
          onClick={submit}
        >
          Create carpool {inviteeList.length > 0 && `· invite ${inviteeList.length}`}
        </button>
        <button
          type="button"
          className="btn btn-ghost"
          style={{ marginTop: 8 }}
          onClick={() => ctx.navigate('today')}
        >
          Cancel
        </button>
      </div>
    </>
  );
}
