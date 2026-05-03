import { useState } from 'react';
import {
  getCurrentParent,
  updateNotificationPrefs,
} from '../data/store.js';
import { Toggle } from '../components/Toggle.jsx';
import { TopNav } from '../components/TopNav.jsx';

const PRESETS = {
  quiet: {
    label: 'Quiet',
    emoji: '🌙',
    description: 'Just emergencies and your evening recap.',
    weekly: 3,
  },
  balanced: {
    label: 'Balanced',
    emoji: '⚖️',
    description: 'Your kid\'s rides, plan changes, and ride status.',
    weekly: 10,
    recommended: true,
  },
  detailed: {
    label: 'Detailed',
    emoji: '📡',
    description: 'Every status update, every chat message.',
    weekly: 25,
  },
};

export function NotifWizard({ ctx }) {
  const me = getCurrentParent();
  const [step, setStep] = useState(0);
  const [picked, setPicked] = useState('balanced');
  const [alertMyKid, setAlertMyKid] = useState(true);
  const [quietHours, setQuietHours] = useState(true);

  const finish = () => {
    updateNotificationPrefs(me.id, {
      style: picked,
      always_alert_my_kid: alertMyKid,
      quiet_hours: { enabled: quietHours, start: '21:00', end: '07:00' },
      wizard_completed: true,
    });
    ctx.showToast('Notifications dialed in');
    ctx.navigate('notif_prefs');
  };

  return (
    <>
      <TopNav title={`Step ${step + 1} of 3`} onBack={() => (step === 0 ? ctx.navigate('notif_prefs') : setStep(step - 1))} />
      <div className="section">
        <div style={{ display: 'flex', gap: 4, marginBottom: 18 }}>
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              style={{
                flex: 1,
                height: 4,
                borderRadius: 4,
                background: i <= step ? 'var(--green-700)' : 'var(--gray-200)',
              }}
            />
          ))}
        </div>

        {step === 0 && (
          <>
            <div className="h2">How loud should we be?</div>
            <div className="muted" style={{ fontSize: 14, marginTop: 6 }}>
              We'll suggest defaults you can fine-tune later.
            </div>
            <div style={{ display: 'grid', gap: 10, marginTop: 16 }}>
              {Object.entries(PRESETS).map(([id, p]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setPicked(id)}
                  style={{
                    textAlign: 'left',
                    padding: 16,
                    borderRadius: 14,
                    border: picked === id ? '2px solid var(--green-700)' : '1px solid var(--gray-200)',
                    background: picked === id ? 'var(--green-100)' : 'white',
                    position: 'relative',
                  }}
                >
                  {p.recommended && (
                    <span
                      className="pill pill-yellow"
                      style={{ position: 'absolute', top: 12, right: 12 }}
                    >
                      Recommended
                    </span>
                  )}
                  <div className="row" style={{ alignItems: 'center', gap: 12 }}>
                    <span style={{ fontSize: 28 }}>{p.emoji}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: 16 }}>{p.label}</div>
                      <div className="muted" style={{ fontSize: 13, marginTop: 2 }}>{p.description}</div>
                    </div>
                  </div>
                  <div style={{ marginTop: 12 }}>
                    <div className="row-between" style={{ fontSize: 11, color: 'var(--gray-500)' }}>
                      <span>Predicted volume</span>
                      <span style={{ fontWeight: 700 }}>~{p.weekly}/week</span>
                    </div>
                    <div
                      style={{
                        marginTop: 4,
                        height: 6,
                        background: 'var(--gray-100)',
                        borderRadius: 999,
                        overflow: 'hidden',
                      }}
                    >
                      <div
                        style={{
                          width: `${(p.weekly / 30) * 100}%`,
                          background:
                            p.weekly < 8
                              ? 'var(--green-500)'
                              : p.weekly < 18
                                ? 'var(--yellow-500)'
                                : 'var(--red-500)',
                          height: '100%',
                        }}
                      />
                    </div>
                  </div>
                </button>
              ))}
            </div>
            <button type="button" className="btn btn-primary" style={{ marginTop: 20 }} onClick={() => setStep(1)}>
              Continue →
            </button>
          </>
        )}

        {step === 1 && (
          <>
            <div className="h2">Always alert when YOUR kid is involved?</div>
            <div className="muted" style={{ fontSize: 14, marginTop: 6 }}>
              We'll override quiet hours and your preset whenever one of your kids is in the car.
            </div>
            <div className="card" style={{ marginTop: 16 }}>
              <div className="row-between">
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700 }}>Always alert me about my kids</div>
                  <div className="muted" style={{ fontSize: 12, marginTop: 2 }}>
                    Driver picked them up, late, dropped off, etc.
                  </div>
                </div>
                <Toggle on={alertMyKid} onChange={setAlertMyKid} />
              </div>
            </div>
            <div className="muted" style={{ fontSize: 13, marginTop: 12 }}>
              💡 Most parents leave this on. Emergencies always alert regardless.
            </div>
            <button type="button" className="btn btn-primary" style={{ marginTop: 20 }} onClick={() => setStep(2)}>
              Continue →
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <div className="h2">Quiet hours?</div>
            <div className="muted" style={{ fontSize: 14, marginTop: 6 }}>
              Mute non-urgent notifications overnight. Emergencies still come through.
            </div>
            <div className="card" style={{ marginTop: 16 }}>
              <div className="row-between">
                <div>
                  <div style={{ fontWeight: 700 }}>Quiet hours 9pm – 7am</div>
                  <div className="muted" style={{ fontSize: 12, marginTop: 2 }}>
                    You can fine-tune the times anytime.
                  </div>
                </div>
                <Toggle on={quietHours} onChange={setQuietHours} />
              </div>
            </div>
            <button type="button" className="btn btn-primary" style={{ marginTop: 20 }} onClick={finish}>
              Save and finish
            </button>
          </>
        )}
      </div>
    </>
  );
}
