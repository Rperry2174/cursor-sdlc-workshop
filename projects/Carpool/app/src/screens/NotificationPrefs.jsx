import { useMemo, useEffect, useState } from 'react';
import {
  getCurrentParent,
  getNotificationPrefs,
  updateNotificationPrefs,
  getTeamsForParent,
} from '../data/store.js';
import { loadBackendNotificationPrefs, saveBackendNotificationPrefs } from '../data/notificationPrefsBackend.js';
import { isSupabaseConfigured } from '../data/supabase.js';
import { Toggle } from '../components/Toggle.jsx';
import { TopNav } from '../components/TopNav.jsx';

function snoozeEndIsoFromHours(hours) {
  return new Date(Date.now() + hours * 3600_000).toISOString();
}

function minutesUntilFromNow(iso) {
  return Math.max(0, Math.round((new Date(iso).getTime() - Date.now()) / 60000));
}

const TYPE_GROUPS = [
  {
    title: '🚨 Emergencies (always loud)',
    description: 'Sub requests, emergency cancels — these always alert.',
    types: ['driver_cancelled_emergency', 'sub_request_open'],
    locked: true,
  },
  {
    title: '🔄 Plan changes',
    description: 'Driver claims, swaps, releases, kid added/removed.',
    types: ['driver_swapped', 'driver_released', 'kid_added', 'kid_removed'],
  },
  {
    title: '🚗 Ride status',
    description: 'On the way, kids in car, arrived, late.',
    types: ['en_route', 'kid_picked_up', 'arrived', 'kid_dropped_off', 'running_late'],
  },
  {
    title: '✅ Confirmations',
    description: 'A driver claimed an open leg.',
    types: ['driver_claimed'],
  },
  {
    title: '💬 Chat',
    description: 'Messages and @mentions in the team chat.',
    types: ['chat_mention', 'chat_message'],
  },
  {
    title: '📬 Digest',
    description: 'Once-a-day 7pm recap.',
    types: ['digest_daily'],
  },
];

const STYLE_PRESETS = {
  quiet: {
    label: 'Quiet',
    description: '~3 alerts/week. Only emergencies and your-turn-tomorrow digest.',
    suggestedTypes: {
      driver_claimed: 'silent',
      driver_swapped: 'silent',
      driver_released: 'silent',
      kid_added: 'silent',
      kid_removed: 'silent',
      en_route: 'silent',
      kid_picked_up: 'silent',
      arrived: 'silent',
      kid_dropped_off: 'silent',
      running_late: 'push',
      sub_request_open: 'push',
      driver_cancelled_emergency: 'push',
      digest_daily: 'push',
      chat_mention: 'push',
      chat_message: 'silent',
    },
  },
  balanced: {
    label: 'Balanced',
    description: '~10 alerts/week. Sensible defaults for most parents.',
    suggestedTypes: {
      driver_claimed: 'silent',
      driver_swapped: 'push',
      driver_released: 'push',
      kid_added: 'push',
      kid_removed: 'push',
      en_route: 'push',
      kid_picked_up: 'push',
      arrived: 'push',
      kid_dropped_off: 'push',
      running_late: 'push',
      sub_request_open: 'push',
      driver_cancelled_emergency: 'push',
      digest_daily: 'push',
      chat_mention: 'push',
      chat_message: 'silent',
    },
  },
  detailed: {
    label: 'Detailed',
    description: '~25 alerts/week. Every status update and chat message.',
    suggestedTypes: {
      driver_claimed: 'push',
      driver_swapped: 'push',
      driver_released: 'push',
      kid_added: 'push',
      kid_removed: 'push',
      en_route: 'push',
      kid_picked_up: 'push',
      arrived: 'push',
      kid_dropped_off: 'push',
      running_late: 'push',
      sub_request_open: 'push',
      driver_cancelled_emergency: 'push',
      digest_daily: 'push',
      chat_mention: 'push',
      chat_message: 'push',
    },
  },
};

export function NotificationPrefs({ ctx }) {
  const me = getCurrentParent();
  const [backendPrefs, setBackendPrefs] = useState(null);
  const [backendFetchDone, setBackendFetchDone] = useState(false);

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      queueMicrotask(() => setBackendFetchDone(true));
      return;
    }
    let cancelled = false;
    loadBackendNotificationPrefs().then((r) => {
      if (cancelled) return;
      if (r.ok && !r.skipped) setBackendPrefs(r.prefs);
      setBackendFetchDone(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const prefs = backendPrefs ?? getNotificationPrefs(me.id);

  const update = (patch) => {
    if (isSupabaseConfigured()) {
      void saveBackendNotificationPrefs(patch).then((r) => {
        if (r.ok) setBackendPrefs(r.prefs);
        else ctx.showToast?.(`Could not save: ${r.reason}`);
      });
    } else {
      updateNotificationPrefs(me.id, patch);
    }
  };
  const teams = getTeamsForParent(me.id);

  const prefsSnapshot = JSON.stringify(prefs);
  // Estimated weekly volume = number of "push" types, roughly.
  const noiseScore = useMemo(() => {
    const p = JSON.parse(prefsSnapshot);
    const enabled = Object.values(p.by_type || {}).filter((v) => v === 'push').length;
    return Math.min(30, Math.round(enabled * 1.3));
  }, [prefsSnapshot]);

  const setType = (type, value) => {
    update({ by_type: { ...prefs.by_type, [type]: value } });
  };

  const applyPreset = (id) => {
    const preset = STYLE_PRESETS[id];
    update({
      style: id,
      by_type: { ...prefs.by_type, ...preset.suggestedTypes },
    });
    ctx.showToast(`Switched to ${preset.label}`);
  };

  const snoozeFor = (hours) => {
    const until = snoozeEndIsoFromHours(hours);
    update({ snoozed_until: until });
    ctx.showToast(`Snoozed for ${hours}h`);
  };

  const snoozedRemaining = prefs.snoozed_until ? minutesUntilFromNow(prefs.snoozed_until) : 0;

  return (
    <>
      <TopNav title="Notifications" onBack={() => ctx.navigate('profile')} />
      <div className="section">
        {backendFetchDone && isSupabaseConfigured() && (
          <div className="card" style={{ marginBottom: 10, padding: '10px 12px' }}>
            <span className="pill pill-green" style={{ fontSize: 11 }}>
              Synced to Kinpala account
            </span>
            <div className="muted" style={{ fontSize: 12, marginTop: 6 }}>
              Preferences are stored on the server for email and future push routing.
            </div>
          </div>
        )}

        <NoiseMeter score={noiseScore} />

        {snoozedRemaining > 0 && (
          <div className="card" style={{ background: 'var(--blue-100)' }}>
            <div className="row-between">
              <div>
                <div style={{ fontWeight: 700, color: 'var(--blue-text)' }}>
                  💤 Snoozed for {Math.floor(snoozedRemaining / 60)}h {snoozedRemaining % 60}m
                </div>
                <div className="muted" style={{ fontSize: 12, marginTop: 2 }}>
                  Emergencies still come through.
                </div>
              </div>
              <button
                type="button"
                className="btn btn-ghost"
                style={{ width: 'auto', padding: '6px 10px', fontSize: 12 }}
                onClick={() => update({ snoozed_until: null })}
              >
                End snooze
              </button>
            </div>
          </div>
        )}

        <div className="card">
          <div className="caps muted">Style preset</div>
          <div style={{ display: 'grid', gap: 8, marginTop: 10 }}>
            {Object.entries(STYLE_PRESETS).map(([id, preset]) => (
              <button
                key={id}
                type="button"
                onClick={() => applyPreset(id)}
                style={{
                  textAlign: 'left',
                  padding: 12,
                  borderRadius: 12,
                  border: prefs.style === id ? '2px solid var(--green-700)' : '1px solid var(--gray-200)',
                  background: prefs.style === id ? 'var(--green-100)' : 'white',
                }}
              >
                <div style={{ fontWeight: 700, fontSize: 14 }}>{preset.label}</div>
                <div className="muted" style={{ fontSize: 12, marginTop: 2 }}>{preset.description}</div>
              </button>
            ))}
          </div>
          <button
            type="button"
            className="btn btn-ghost"
            style={{ marginTop: 8, fontSize: 13 }}
            onClick={() => ctx.navigate('notif_wizard')}
          >
            Re-run notification wizard →
          </button>
        </div>

        <div className="card">
          <div className="caps muted">Always alert me when MY kid is involved</div>
          <div className="row-between" style={{ marginTop: 10 }}>
            <div className="muted" style={{ fontSize: 13 }}>
              Overrides quiet hours and presets when one of your kids is in the car.
            </div>
            <Toggle
              on={prefs.always_alert_my_kid}
              onChange={(v) => update({ always_alert_my_kid: v })}
            />
          </div>
        </div>

        <div className="card">
          <div className="row-between">
            <div>
              <div className="caps muted">Quiet hours</div>
              <div style={{ marginTop: 4, fontWeight: 600 }}>
                {prefs.quiet_hours.start} – {prefs.quiet_hours.end}
              </div>
            </div>
            <Toggle
              on={prefs.quiet_hours.enabled}
              onChange={(v) => update({ quiet_hours: { ...prefs.quiet_hours, enabled: v } })}
            />
          </div>
          {prefs.quiet_hours.enabled && (
            <div className="row" style={{ gap: 12, marginTop: 12 }}>
              <label className="field" style={{ flex: 1 }}>
                Start
                <input
                  type="time"
                  className="input"
                  value={prefs.quiet_hours.start}
                  onChange={(e) =>
                    update({ quiet_hours: { ...prefs.quiet_hours, start: e.target.value } })
                  }
                  style={{ marginTop: 4 }}
                />
              </label>
              <label className="field" style={{ flex: 1 }}>
                End
                <input
                  type="time"
                  className="input"
                  value={prefs.quiet_hours.end}
                  onChange={(e) =>
                    update({ quiet_hours: { ...prefs.quiet_hours, end: e.target.value } })
                  }
                  style={{ marginTop: 4 }}
                />
              </label>
            </div>
          )}
        </div>

        <div className="card">
          <div className="caps muted">Snooze everything</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginTop: 10 }}>
            {[1, 4, 24].map((h) => (
              <button
                key={h}
                type="button"
                className="btn btn-secondary"
                style={{ padding: '10px 8px', fontSize: 13 }}
                onClick={() => snoozeFor(h)}
              >
                {h === 24 ? '1 day' : `${h}h`}
              </button>
            ))}
          </div>
        </div>

        {TYPE_GROUPS.map((group) => (
          <div key={group.title} className="card">
            <div className="row-between">
              <div>
                <div style={{ fontWeight: 700, fontSize: 14 }}>{group.title}</div>
                <div className="muted" style={{ fontSize: 12, marginTop: 2 }}>{group.description}</div>
              </div>
              {group.locked && <span className="pill pill-red">Always on</span>}
            </div>
            {!group.locked && (
              <div style={{ marginTop: 10, display: 'grid', gap: 6 }}>
                {group.types.map((type) => (
                  <div key={type} className="row-between" style={{ padding: '4px 0' }}>
                    <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--gray-700)' }}>
                      {prettyType(type)}
                    </span>
                    <Toggle
                      on={(prefs.by_type?.[type] ?? 'push') === 'push'}
                      onChange={(v) => setType(type, v ? 'push' : 'silent')}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}

        {teams.length > 1 && (
          <div className="card">
            <div className="caps muted">Per-team overrides</div>
            <div style={{ marginTop: 10 }}>
              {teams.map((t) => (
                <div key={t.id} className="row-between" style={{ padding: '8px 0', borderTop: '1px solid var(--gray-100)' }}>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{t.name}</div>
                  <select
                    className="input"
                    value={prefs.by_team?.[t.id] || 'inherit'}
                    style={{ width: 'auto', padding: '8px 10px', fontSize: 13 }}
                    onChange={(e) =>
                      update({ by_team: { ...prefs.by_team, [t.id]: e.target.value } })
                    }
                  >
                    <option value="inherit">Use defaults</option>
                    <option value="quiet">Quieter than default</option>
                    <option value="loud">Louder than default</option>
                    <option value="muted">Muted</option>
                  </select>
                </div>
              ))}
            </div>
          </div>
        )}

        <button
          type="button"
          className="btn btn-secondary"
          style={{ marginTop: 12 }}
          onClick={() => ctx.navigate('digest')}
        >
          See today's digest preview →
        </button>
      </div>
    </>
  );
}

function prettyType(type) {
  return {
    driver_claimed: 'A driver claims an open leg',
    driver_swapped: 'Driver gets swapped',
    driver_released: 'A driver releases their leg',
    kid_added: 'Someone adds a kid to my car',
    kid_removed: 'Someone removes a kid from my car',
    sub_request_open: 'Someone requests a sub',
    driver_cancelled_emergency: 'Emergency driver cancellation',
    en_route: 'Driver is on the way',
    kid_picked_up: 'Kids are in the car',
    arrived: 'Driver arrived',
    kid_dropped_off: 'Drop-off complete',
    running_late: 'Driver is running late',
    digest_daily: '7pm daily recap',
    chat_mention: '@mentions in chat',
    chat_message: 'Every chat message',
  }[type] || type;
}

function NoiseMeter({ score }) {
  const tier = score < 8 ? 'Quiet' : score < 18 ? 'Balanced' : 'Loud';
  const color = score < 8 ? 'var(--green-500)' : score < 18 ? 'var(--yellow-500)' : 'var(--red-500)';
  return (
    <div className="card">
      <div className="row-between">
        <div>
          <div className="caps muted">Estimated weekly notifications</div>
          <div style={{ fontSize: 28, fontWeight: 800, marginTop: 4 }}>~{score} <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--gray-500)' }}>per week</span></div>
        </div>
        <span className="pill" style={{ background: color, color: 'white' }}>{tier}</span>
      </div>
      <div
        style={{
          marginTop: 10,
          height: 10,
          background: 'var(--gray-100)',
          borderRadius: 999,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${Math.min(100, (score / 30) * 100)}%`,
            background: color,
            height: '100%',
            transition: 'width 0.2s',
          }}
        />
      </div>
      {score > 22 && (
        <div className="muted" style={{ fontSize: 12, marginTop: 8 }}>
          💡 Tip: switch to “Balanced” preset to cut this in half without missing what matters.
        </div>
      )}
    </div>
  );
}
