import { useMemo, useState } from 'react';
import { addScheduleSource, completeOnboarding, db, getSource, markOnboarded, _internals } from '../data/store.js';
import { syncSource, fetchIcs } from '../data/lifecycle.js';
import { parseIcs } from '../data/ics.js';
import { Avatar } from '../components/Avatar.jsx';
import { capture, identify } from '../data/analytics.js';
import {
  completeOnboardingInSupabase,
  sendMagicLink,
  verifyMagicLinkSession,
} from '../data/onboardingSupabase.js';
import {
  addBackendScheduleSource,
  importBackendEvents,
} from '../data/scheduleBackend.js';

const { newId } = _internals;

const COLORS = ['green', 'blue', 'purple', 'orange', 'pink', 'teal'];
const STEPS = ['welcome', 'phone', 'profile', 'kids', 'group', 'driver', 'calendar', 'done'];
const HINT_KEY = 'carpool.hint.gamechanger';

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

function daysInMonth(monthStr, yearStr) {
  const month = Number(monthStr);
  const year = Number(yearStr) || 2000; // 2000 is a leap year — safe default until year picked
  if (!month || month < 1 || month > 12) return Array.from({ length: 31 }, (_, i) => i + 1);
  const last = new Date(year, month, 0).getDate();
  return Array.from({ length: last }, (_, i) => i + 1);
}

function birthYearOptions() {
  const now = new Date().getFullYear();
  const years = [];
  for (let y = now; y >= now - 18; y--) years.push(y);
  return years;
}

function toBirthdayIso(k) {
  const m = Number(k.birthMonth);
  const d = Number(k.birthDay);
  const y = Number(k.birthYear);
  if (!m || !d || !y) return null;
  return `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
}

/**
 * Wraps store.markOnboarded() with the analytics emit so we capture exactly
 * one onboarding_completed event regardless of which exit path the user
 * takes (Done step, Take-me-to-import, Schedule sources detour). Includes
 * the exit_path so we can chart funnel completion modes in PostHog.
 */
function finishOnboarding(exitPath) {
  capture('onboarding_completed', { exit_path: exitPath });
  markOnboarded();
}

export function Onboarding({ ctx }) {
  const [step, setStep] = useState('welcome');

  const [email, setEmail] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const [authBusy, setAuthBusy] = useState(false);
  const [authError, setAuthError] = useState('');
  const [phone, setPhone] = useState('');

  const [name, setName] = useState('');
  const [avatarColor, setAvatarColor] = useState('green');

  const [kids, setKids] = useState([
    { id: newId('tmp'), name: '', birthMonth: '', birthDay: '', birthYear: '', color: 'blue' },
  ]);

  const [groupMode, setGroupMode] = useState(null); // 'join' | 'create' | 'skip'
  const [inviteCode, setInviteCode] = useState('');
  const [teamName, setTeamName] = useState('');
  const [teamSport, setTeamSport] = useState('Baseball');
  const [teamSeason, setTeamSeason] = useState('Spring 2026');

  // Driver attestation: null until the user makes a choice on the driver step.
  // 'coordinator' = explicitly opted out of driving (no attestation needed).
  // Object = attested to license / insurance / clean record / agreed terms.
  const [driverChoice, setDriverChoice] = useState(null); // 'coordinator' | 'driver'
  const [driverChecks, setDriverChecks] = useState({
    has_valid_license: false,
    has_current_insurance: false,
    clean_record_5y: false,
    agreed_terms: false,
  });

  const [createdParent, setCreatedParent] = useState(null);
  const [createdTeam, setCreatedTeam] = useState(null);
  const [calendarBusy, setCalendarBusy] = useState(false);

  const stepIndex = STEPS.indexOf(step);
  const total = STEPS.length - 1;

  const goNext = () => {
    const i = STEPS.indexOf(step);
    if (i < STEPS.length - 1) setStep(STEPS[i + 1]);
  };
  const goBack = () => {
    const i = STEPS.indexOf(step);
    if (i > 0) setStep(STEPS[i - 1]);
  };

  const finishCore = () => {
    // Build driver_attestation only if the user explicitly chose 'driver' AND
    // checked all four boxes. Otherwise null = "coordinator only, won't drive."
    // The shape here is what gets persisted to parents.driver_attestation
    // (jsonb column in Supabase) — keep in sync with migrations/001_initial_schema.sql.
    const allChecked = Object.values(driverChecks).every(Boolean);
    const driverAttestation =
      driverChoice === 'driver' && allChecked
        ? { ...driverChecks, attested_at: new Date().toISOString(), version: 1 }
        : null;

    const onboardingPayload = {
      phone,
      name,
      avatarColor,
      kids: kids
        .filter((k) => k.name.trim())
        .map((k) => ({ ...k, birthday: toBirthdayIso(k) })),
      team:
        groupMode === 'join'
          ? { mode: 'join', inviteCode }
          : groupMode === 'create'
            ? { mode: 'create', name: teamName, sport: teamSport, season: teamSeason }
            : null,
      driverAttestation,
    };

    const result = completeOnboarding(onboardingPayload);
    setCreatedParent(result.parent);
    setCreatedTeam(result.team);

    completeOnboardingInSupabase(onboardingPayload).then((syncResult) => {
      if (syncResult.ok) {
        capture('supabase_onboarding_synced', {
          team_mode: groupMode || 'skipped',
          driver_attested: !!driverAttestation,
        });
        ctx.showToast('Saved to Kinpala backend');
      } else if (!syncResult.skipped) {
        capture('supabase_onboarding_sync_failed', { reason: syncResult.reason });
        ctx.showToast(`Local signup worked, but Supabase sync failed: ${syncResult.reason}`, {
          duration: 7000,
        });
      }
    });

    // Tie subsequent events to this parent (no PII — id only).
    identify(result.parent.id, {
      role: driverChoice || 'driver',
      driver_attested: !!driverAttestation,
      team_mode: groupMode,
    });
    capture('signup_completed', {
      kid_count: kids.filter((k) => k.name.trim()).length,
      team_mode: groupMode || 'skipped',
      driver_attested: !!driverAttestation,
    });
    return result;
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--bg)',
      }}
    >
      <ProgressBar index={stepIndex} total={total} />

      {step !== 'welcome' && step !== 'done' && (
        <button
          type="button"
          onClick={goBack}
          style={{
            alignSelf: 'flex-start',
            padding: '8px 12px',
            margin: '4px 8px 0',
            fontSize: 14,
            color: 'var(--gray-500)',
            fontWeight: 600,
          }}
        >
          ← Back
        </button>
      )}

      <div style={{ flex: 1, padding: '8px 20px 24px' }}>
        {step === 'welcome' && <WelcomeStep onNext={goNext} />}
        {step === 'phone' && (
          <EmailAuthStep
            email={email}
            setEmail={setEmail}
            emailSent={emailSent}
            setEmailSent={setEmailSent}
            busy={authBusy}
            setBusy={setAuthBusy}
            error={authError}
            setError={setAuthError}
            onNext={goNext}
          />
        )}
        {step === 'profile' && (
          <ProfileStep
            name={name}
            setName={setName}
            phone={phone}
            setPhone={setPhone}
            avatarColor={avatarColor}
            setAvatarColor={setAvatarColor}
            onNext={goNext}
          />
        )}
        {step === 'kids' && (
          <KidsStep
            kids={kids}
            setKids={setKids}
            avatarColor={avatarColor}
            onNext={goNext}
          />
        )}
        {step === 'group' && (
          <GroupStep
            mode={groupMode}
            setMode={setGroupMode}
            inviteCode={inviteCode}
            setInviteCode={setInviteCode}
            teamName={teamName}
            setTeamName={setTeamName}
            teamSport={teamSport}
            setTeamSport={setTeamSport}
            teamSeason={teamSeason}
            setTeamSeason={setTeamSeason}
            kids={kids}
            setKids={setKids}
            onNext={goNext}
          />
        )}
        {step === 'driver' && (
          <DriverStep
            choice={driverChoice}
            setChoice={setDriverChoice}
            checks={driverChecks}
            setChecks={setDriverChecks}
            onNext={goNext}
          />
        )}
        {step === 'calendar' && (
          <CalendarStep
            createdTeam={createdTeam}
            createdParent={createdParent}
            finishCore={finishCore}
            busy={calendarBusy}
            setBusy={setCalendarBusy}
            ctx={ctx}
            goDone={() => setStep('done')}
            goBackToGroup={() => setStep('group')}
          />
        )}
        {step === 'done' && (
          <DoneStep
            parent={createdParent}
            team={createdTeam}
            ctx={ctx}
          />
        )}
      </div>
    </div>
  );
}

/* ---------- progress bar ---------- */

function ProgressBar({ index, total }) {
  return (
    <div style={{ display: 'flex', gap: 4, padding: '12px 20px 0' }}>
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          style={{
            flex: 1,
            height: 4,
            borderRadius: 999,
            background: i <= index ? 'var(--green-700)' : 'var(--gray-100)',
            transition: 'background 0.2s',
          }}
        />
      ))}
    </div>
  );
}

/* ---------- step 1: welcome ---------- */

function WelcomeStep({ onNext }) {
  return (
    <div style={{ paddingTop: 24, textAlign: 'center' }}>
      <div style={{ fontSize: 64, marginBottom: 12 }}>🚗</div>
      <div className="h1" style={{ marginBottom: 8 }}>Welcome to Carpool</div>
      <div className="muted" style={{ fontSize: 15, marginBottom: 28 }}>
        The simplest way to share rides for kids' activities.
      </div>

      <div style={{ display: 'grid', gap: 10, marginBottom: 28, textAlign: 'left' }}>
        <Highlight icon="📅" title="Auto-imports your team's schedule" body="GameChanger, TeamSnap, Apple/Google Calendar — all in one feed." />
        <Highlight icon="👋" title="One tap to claim or pass" body="Open legs show up on your home screen — no group-text chaos." />
        <Highlight icon="🗺️" title="Live updates while you drive" body="Pickup queue, ETAs, and 'on my way' status — built in." />
      </div>

      <button type="button" className="btn btn-primary" style={{ width: '100%' }} onClick={onNext}>
        Get started →
      </button>
      <div className="muted" style={{ fontSize: 12, marginTop: 16 }}>
        Takes about a minute.
      </div>
    </div>
  );
}

function Highlight({ icon, title, body }) {
  return (
    <div className="card" style={{ padding: 14 }}>
      <div className="row" style={{ gap: 12, alignItems: 'flex-start' }}>
        <span style={{ fontSize: 22, lineHeight: 1 }}>{icon}</span>
        <div style={{ flex: 1 }}>
          <div className="h3" style={{ marginBottom: 2 }}>{title}</div>
          <div className="muted" style={{ fontSize: 13 }}>{body}</div>
        </div>
      </div>
    </div>
  );
}

/* ---------- step 2: email magic-link auth ---------- */

function EmailAuthStep({
  email,
  setEmail,
  emailSent,
  setEmailSent,
  busy,
  setBusy,
  error,
  setError,
  onNext,
}) {
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  const sendLink = async () => {
    setError('');
    setBusy(true);
    try {
      const result = await sendMagicLink(email);
      if (!result.ok) {
        setError(result.reason || 'Could not send sign-in link.');
        return;
      }
      setEmailSent(true);
    } finally {
      setBusy(false);
    }
  };

  const checkSession = async () => {
    setError('');
    setBusy(true);
    try {
      const result = await verifyMagicLinkSession(email);
      if (!result.ok) {
        if (result.reason === 'not_signed_in') {
          setError(
            'Still not signed in. Make sure the email link opened in this same browser tab/window, not Safari vs Chrome or your phone.',
          );
        } else if (result.reason === 'email_mismatch') {
          setError('That browser is signed in with a different email. Use the magic link for this email address.');
        } else {
          setError(result.reason || 'Could not restore your sign-in session.');
        }
        return;
      }
      onNext();
    } finally {
      setBusy(false);
    }
  };

  return (
    <div style={{ paddingTop: 16 }}>
      <div className="h2" style={{ marginBottom: 6 }}>Sign in with email</div>
      <div className="muted" style={{ fontSize: 14, marginBottom: 20 }}>
        We'll send a secure magic link. This lets you reopen Kinpala on another
        phone or browser and load the same team profile.
      </div>

      <label className="field">Email address</label>
      <input
        className="input"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
        disabled={emailSent || busy}
        style={{ marginBottom: 14 }}
      />

      {error && (
        <div style={{ color: 'var(--red-text)', fontSize: 13, marginBottom: 10 }}>
          ⚠️ {error}
        </div>
      )}

      {!emailSent ? (
        <button
          type="button"
          className="btn btn-primary"
          style={{ width: '100%' }}
          disabled={!emailOk || busy}
          onClick={sendLink}
        >
          {busy ? 'Sending…' : 'Send magic link'}
        </button>
      ) : (
        <>
          <div
            style={{
              padding: 12,
              background: 'var(--green-100)',
              color: 'var(--green-text)',
              borderRadius: 10,
              fontSize: 13,
              marginBottom: 14,
            }}
          >
            ✓ Magic link sent to <strong>{email.trim()}</strong>. Open that email on this device,
            then come back here.
          </div>
          <button
            type="button"
            className="btn btn-primary"
            style={{ width: '100%' }}
            disabled={busy}
            onClick={checkSession}
          >
            {busy ? 'Checking…' : "I've clicked the link — continue"}
          </button>
          <button
            type="button"
            onClick={() => {
              setEmailSent(false);
              setError('');
            }}
            style={{ display: 'block', margin: '12px auto 0', fontSize: 13, color: 'var(--gray-500)' }}
          >
            Use a different email
          </button>
        </>
      )}
    </div>
  );
}

/* ---------- step 3: profile ---------- */

function ProfileStep({ name, setName, phone, setPhone, avatarColor, setAvatarColor, onNext }) {
  const phoneOk = phone.replace(/\D/g, '').length >= 10;
  const ok = name.trim().length >= 2 && phoneOk;
  return (
    <div style={{ paddingTop: 16 }}>
      <div className="h2" style={{ marginBottom: 6 }}>What should we call you?</div>
      <div className="muted" style={{ fontSize: 14, marginBottom: 20 }}>
        Other parents will see this name. Your mobile number is used for ride
        coordination and tap-to-call from active rides.
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 18 }}>
        <Avatar name={name || '?'} color={avatarColor} size="lg" />
      </div>

      <label className="field">Your name</label>
      <input
        className="input"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="e.g. Sarah Chen"
        style={{ marginBottom: 14 }}
      />

      <label className="field">Mobile number</label>
      <input
        className="input"
        type="tel"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder="(555) 123-4567"
        style={{ marginBottom: 18 }}
      />

      <label className="field">Pick a color</label>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(6, 1fr)',
          gap: 8,
          marginBottom: 22,
        }}
      >
        {COLORS.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setAvatarColor(c)}
            style={{
              padding: 4,
              borderRadius: 999,
              border: c === avatarColor ? '2px solid var(--green-700)' : '2px solid transparent',
              background: 'transparent',
            }}
          >
            <span className={`avatar avatar-${c}`} style={{ width: 36, height: 36 }} />
          </button>
        ))}
      </div>

      <button
        type="button"
        className="btn btn-primary"
        style={{ width: '100%' }}
        disabled={!ok}
        onClick={onNext}
      >
        Continue
      </button>
    </div>
  );
}

/* ---------- step 4: kids ---------- */

function KidsStep({ kids, setKids, avatarColor, onNext }) {
  const ok = kids.some((k) => k.name.trim().length >= 1);

  const updateKid = (id, patch) => {
    setKids((prev) => prev.map((k) => (k.id === id ? { ...k, ...patch } : k)));
  };
  const addKid = () => {
    const next = COLORS.filter((c) => c !== avatarColor)[kids.length % 5] || 'pink';
    setKids((prev) => [...prev, { id: newId('tmp'), name: '', birthMonth: '', birthDay: '', birthYear: '', color: next }]);
  };
  const removeKid = (id) => setKids((prev) => prev.filter((k) => k.id !== id));

  return (
    <div style={{ paddingTop: 16 }}>
      <div className="h2" style={{ marginBottom: 6 }}>Add your kids</div>
      <div className="muted" style={{ fontSize: 14, marginBottom: 18 }}>
        You'll be able to put them in carpools and other parents can offer rides for them.
      </div>

      <div style={{ display: 'grid', gap: 12, marginBottom: 14 }}>
        {kids.map((k, idx) => (
          <div key={k.id} className="card" style={{ padding: 12 }}>
            <div className="row" style={{ gap: 10, alignItems: 'center', marginBottom: 8 }}>
              <Avatar name={k.name || '?'} color={k.color} size="md" />
              <div style={{ fontWeight: 700, flex: 1 }}>Kid {idx + 1}</div>
              {kids.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeKid(k.id)}
                  style={{ fontSize: 12, color: 'var(--red-text)', fontWeight: 600 }}
                >
                  Remove
                </button>
              )}
            </div>
            <input
              className="input"
              placeholder="First name"
              value={k.name}
              onChange={(e) => updateKid(k.id, { name: e.target.value })}
              style={{ marginBottom: 8 }}
            />
            <div className="muted" style={{ fontSize: 12, marginBottom: 6 }}>Birthday</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 1.1fr', gap: 8, marginBottom: 8 }}>
              <select
                className="input"
                value={k.birthMonth}
                onChange={(e) => updateKid(k.id, { birthMonth: e.target.value })}
              >
                <option value="">Month</option>
                {MONTHS.map((m, i) => (
                  <option key={m} value={String(i + 1)}>{m}</option>
                ))}
              </select>
              <select
                className="input"
                value={k.birthDay}
                onChange={(e) => updateKid(k.id, { birthDay: e.target.value })}
              >
                <option value="">Day</option>
                {daysInMonth(k.birthMonth, k.birthYear).map((d) => (
                  <option key={d} value={String(d)}>{d}</option>
                ))}
              </select>
              <select
                className="input"
                value={k.birthYear}
                onChange={(e) => updateKid(k.id, { birthYear: e.target.value })}
              >
                <option value="">Year</option>
                {birthYearOptions().map((y) => (
                  <option key={y} value={String(y)}>{y}</option>
                ))}
              </select>
            </div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => updateKid(k.id, { color: c })}
                  style={{
                    padding: 2,
                    borderRadius: 999,
                    border: c === k.color ? '2px solid var(--green-700)' : '2px solid transparent',
                  }}
                >
                  <span className={`avatar avatar-${c} sm`} />
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={addKid}
        style={{
          display: 'block',
          width: '100%',
          padding: 12,
          borderRadius: 12,
          border: '1px dashed var(--gray-300, #d1d5db)',
          color: 'var(--gray-700)',
          fontWeight: 600,
          fontSize: 14,
          marginBottom: 18,
        }}
      >
        + Add another kid
      </button>

      <button
        type="button"
        className="btn btn-primary"
        style={{ width: '100%' }}
        disabled={!ok}
        onClick={onNext}
      >
        Continue
      </button>
    </div>
  );
}

/* ---------- step 5: group ---------- */

function GroupStep(props) {
  const {
    mode, setMode,
    inviteCode, setInviteCode,
    teamName, setTeamName,
    teamSport, setTeamSport,
    teamSeason, setTeamSeason,
    kids, setKids,
    onNext,
  } = props;

  const namedKids = (kids || []).filter((k) => k.name.trim());
  const showAssign = namedKids.length >= 2;
  const toggleKid = (id) => {
    setKids((prev) =>
      prev.map((k) =>
        k.id === id ? { ...k, include_in_team: k.include_in_team === false } : k,
      ),
    );
  };

  const matchedTeam = useMemo(() => {
    if (mode !== 'join') return null;
    const code = inviteCode.trim().toUpperCase();
    if (code.length < 3) return null;
    return db().teams.find((t) => (t.invite_code || '').toUpperCase() === code) || null;
  }, [mode, inviteCode]);

  // Render the chooser whenever mode isn't explicitly 'join' or 'create'.
  // This prevents a stale 'skip' (or any other value) from falling through to
  // the create form, which previously dropped the user into a form whose
  // submit button left groupMode unchanged — so the calendar step would
  // later see groupMode='skip' and refuse to import.
  if (mode !== 'join' && mode !== 'create') {
    return (
      <div style={{ paddingTop: 16 }}>
        <div className="h2" style={{ marginBottom: 6 }}>Join or create a group</div>
        <div className="muted" style={{ fontSize: 14, marginBottom: 20 }}>
          A group is where you coordinate carpools — usually a sports team, scout troop, or class.
        </div>

        <ChoiceCard
          icon="🔑"
          title="I have an invite code"
          body="Paste it here and we'll add you to the group."
          onClick={() => setMode('join')}
        />
        <ChoiceCard
          icon="🧰"
          title="Create a new group"
          body="You'll be the admin — invite others after."
          onClick={() => setMode('create')}
        />
        <ChoiceCard
          icon="⏭️"
          title="Skip — I'll just do one-off carpools"
          body="No calendar sync. You can join or create a group later from Profile."
          onClick={() => { setMode('skip'); onNext(); }}
        />
      </div>
    );
  }

  if (mode === 'join') {
    return (
      <div style={{ paddingTop: 16 }}>
        <div className="h2" style={{ marginBottom: 6 }}>Got an invite code?</div>
        <div className="muted" style={{ fontSize: 14, marginBottom: 18 }}>
          Ask your team admin or check the share link they sent you.
        </div>

        <label className="field">Invite code</label>
        <input
          className="input"
          value={inviteCode}
          onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
          placeholder="TIGERS-9421"
          autoCapitalize="characters"
          style={{ marginBottom: 14, letterSpacing: 1.5, fontWeight: 600 }}
        />

        {matchedTeam && (
          <div
            style={{
              padding: 12,
              background: 'var(--green-100)',
              color: 'var(--green-text)',
              borderRadius: 10,
              fontSize: 13,
              marginBottom: 14,
            }}
          >
            ✓ Found <strong>{matchedTeam.name}</strong> · {matchedTeam.sport} · {matchedTeam.season}
          </div>
        )}
        {!matchedTeam && inviteCode.trim().length >= 3 && (
          <div className="muted" style={{ fontSize: 13, marginBottom: 14 }}>
            No group yet — double-check the code with your admin.
          </div>
        )}

        {showAssign && matchedTeam && (
          <KidTeamPicker
            kids={namedKids}
            teamLabel={matchedTeam.name}
            toggleKid={toggleKid}
          />
        )}

        <button
          type="button"
          className="btn btn-primary"
          style={{ width: '100%', marginBottom: 8 }}
          disabled={!matchedTeam}
          onClick={() => { setMode('join'); onNext(); }}
        >
          Join {matchedTeam ? matchedTeam.name : 'group'}
        </button>
        <button
          type="button"
          onClick={() => setMode(null)}
          style={{ display: 'block', margin: '0 auto', fontSize: 13, color: 'var(--gray-500)' }}
        >
          ← Use a different option
        </button>
      </div>
    );
  }

  // create
  const ok = teamName.trim().length >= 2;
  return (
    <div style={{ paddingTop: 16 }}>
      <div className="h2" style={{ marginBottom: 6 }}>Create your group</div>
      <div className="muted" style={{ fontSize: 14, marginBottom: 18 }}>
        We'll generate a shareable invite code so others can join.
      </div>

      <label className="field">Group name</label>
      <input
        className="input"
        value={teamName}
        onChange={(e) => setTeamName(e.target.value)}
        placeholder="Tigers Baseball"
        style={{ marginBottom: 14 }}
      />

      <label className="field">Activity</label>
      <input
        className="input"
        value={teamSport}
        onChange={(e) => setTeamSport(e.target.value)}
        placeholder="Baseball, Soccer, Piano…"
        style={{ marginBottom: 14 }}
      />

      <label className="field">Season</label>
      <input
        className="input"
        value={teamSeason}
        onChange={(e) => setTeamSeason(e.target.value)}
        placeholder="Spring 2026"
        style={{ marginBottom: 18 }}
      />

      {showAssign && ok && (
        <KidTeamPicker
          kids={namedKids}
          teamLabel={teamName.trim()}
          toggleKid={toggleKid}
        />
      )}

      <button
        type="button"
        className="btn btn-primary"
        style={{ width: '100%', marginBottom: 8 }}
        disabled={!ok}
        onClick={() => { setMode('create'); onNext(); }}
      >
        Create group
      </button>
      <button
        type="button"
        onClick={() => setMode(null)}
        style={{ display: 'block', margin: '0 auto', fontSize: 13, color: 'var(--gray-500)' }}
      >
        ← Use a different option
      </button>
    </div>
  );
}

function KidTeamPicker({ kids, teamLabel, toggleKid }) {
  return (
    <div
      style={{
        marginBottom: 14,
        padding: 12,
        borderRadius: 10,
        background: 'var(--gray-100)',
      }}
    >
      <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 4 }}>
        Which kids are on {teamLabel || 'this team'}?
      </div>
      <div className="muted" style={{ fontSize: 12, marginBottom: 8 }}>
        Tap a kid to opt them out — only included kids will show up on this team's events.
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {kids.map((k) => {
          const on = k.include_in_team !== false;
          return (
            <button
              key={k.id}
              type="button"
              onClick={() => toggleKid(k.id)}
              style={{
                padding: '6px 10px',
                borderRadius: 999,
                border: on
                  ? '1px solid var(--green-700)'
                  : '1px solid var(--gray-300, #d1d5db)',
                background: on ? 'var(--green-100)' : 'white',
                color: on ? 'var(--green-text)' : 'var(--gray-500)',
                fontSize: 12,
                fontWeight: 600,
              }}
            >
              {on ? '✓ ' : ''}
              {k.name.split(' ')[0]}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ChoiceCard({ icon, title, body, onClick, recommended }) {
  return (
    <button
      type="button"
      className="card"
      onClick={onClick}
      style={{
        display: 'block',
        width: '100%',
        textAlign: 'left',
        padding: 16,
        marginBottom: 10,
        border: recommended ? '2px solid var(--green-700)' : undefined,
      }}
    >
      <div className="row" style={{ gap: 12, alignItems: 'flex-start' }}>
        <span style={{ fontSize: 26, lineHeight: 1 }}>{icon}</span>
        <div style={{ flex: 1 }}>
          <div className="row-between" style={{ marginBottom: 2 }}>
            <div className="h3">{title}</div>
            {recommended && <span className="pill pill-green">Recommended</span>}
          </div>
          <div className="muted" style={{ fontSize: 13 }}>{body}</div>
        </div>
        <span className="muted" style={{ fontSize: 18 }}>→</span>
      </div>
    </button>
  );
}

/* ---------- step 6: driver attestation ---------- */

function DriverStep({ choice, setChoice, checks, setChecks, onNext }) {
  const allChecked = Object.values(checks).every(Boolean);
  const canContinue = choice === 'coordinator' || (choice === 'driver' && allChecked);

  const toggle = (key) => setChecks({ ...checks, [key]: !checks[key] });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '70vh' }}>
      <div className="h1" style={{ marginBottom: 6 }}>
        Will you drive carpools?
      </div>
      <div className="muted" style={{ fontSize: 14, marginBottom: 20 }}>
        Some parents prefer to coordinate without driving. Either way is welcome — pick the
        role that fits how you'll use Carpool.
      </div>

      <RoleCard
        active={choice === 'driver'}
        onClick={() => setChoice('driver')}
        emoji="🚗"
        title="I'll drive"
        body="I'll claim drop-offs and pick-ups for my group."
      />
      <RoleCard
        active={choice === 'coordinator'}
        onClick={() => setChoice('coordinator')}
        emoji="📋"
        title="Coordinator only"
        body="I'll help organize but won't be a driver."
      />

      {choice === 'driver' && (
        <div
          style={{
            marginTop: 18,
            padding: 16,
            background: 'white',
            borderRadius: 14,
            border: '1px solid var(--gray-200)',
          }}
        >
          <div className="caps muted" style={{ marginBottom: 10 }}>
            Driver attestation
          </div>
          <div style={{ fontSize: 13, color: 'var(--gray-700)', marginBottom: 14 }}>
            Confirm the basics so other parents know it's safe for their kids to ride with you.
            We don't share these answers — they're stored on your profile only.
          </div>

          <AttestRow
            checked={checks.has_valid_license}
            onToggle={() => toggle('has_valid_license')}
            label="I have a valid driver's license"
          />
          <AttestRow
            checked={checks.has_current_insurance}
            onToggle={() => toggle('has_current_insurance')}
            label="I carry current auto insurance that covers passengers"
          />
          <AttestRow
            checked={checks.clean_record_5y}
            onToggle={() => toggle('clean_record_5y')}
            label="No DUI, reckless driving, or license suspension in the past 5 years"
          />
          <AttestRow
            checked={checks.agreed_terms}
            onToggle={() => toggle('agreed_terms')}
            label={
              <>
                I agree to the{' '}
                <span style={{ color: 'var(--green-700)', fontWeight: 700 }}>driver terms</span>{' '}
                and accept that I'm responsible for safe operation while my kids and others ride
                with me.
              </>
            }
          />

          {!allChecked && (
            <div
              style={{
                marginTop: 12,
                padding: 10,
                background: 'var(--yellow-100)',
                borderRadius: 10,
                fontSize: 12,
                color: 'var(--yellow-text)',
              }}
            >
              Check all four to continue as a driver, or pick "Coordinator only" above.
            </div>
          )}
        </div>
      )}

      <div style={{ flex: 1 }} />

      <button
        type="button"
        className="btn btn-primary"
        disabled={!canContinue}
        onClick={onNext}
        style={{ marginTop: 24, opacity: canContinue ? 1 : 0.5 }}
      >
        Continue
      </button>
    </div>
  );
}

function RoleCard({ active, onClick, emoji, title, body }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="card"
      style={{
        background: 'white',
        textAlign: 'left',
        padding: 16,
        marginBottom: 10,
        border: active ? '2px solid var(--green-700)' : '1px solid var(--gray-200)',
        cursor: 'pointer',
      }}
    >
      <div className="row" style={{ gap: 12, alignItems: 'flex-start' }}>
        <span style={{ fontSize: 26, lineHeight: 1 }}>{emoji}</span>
        <div style={{ flex: 1 }}>
          <div className="h3" style={{ marginBottom: 2 }}>{title}</div>
          <div className="muted" style={{ fontSize: 13 }}>{body}</div>
        </div>
        <span
          style={{
            width: 22,
            height: 22,
            borderRadius: 11,
            border: active ? 'none' : '2px solid var(--gray-300)',
            background: active ? 'var(--green-700)' : 'transparent',
            color: 'white',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 14,
            fontWeight: 800,
            flexShrink: 0,
          }}
        >
          {active ? '✓' : ''}
        </span>
      </div>
    </button>
  );
}

function AttestRow({ checked, onToggle, label }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      style={{
        width: '100%',
        display: 'flex',
        alignItems: 'flex-start',
        gap: 10,
        padding: '10px 0',
        background: 'transparent',
        textAlign: 'left',
        cursor: 'pointer',
        border: 'none',
      }}
    >
      <span
        style={{
          width: 22,
          height: 22,
          minWidth: 22,
          borderRadius: 6,
          border: checked ? 'none' : '2px solid var(--gray-300)',
          background: checked ? 'var(--green-700)' : 'transparent',
          color: 'white',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 13,
          fontWeight: 800,
          marginTop: 1,
        }}
      >
        {checked ? '✓' : ''}
      </span>
      <span style={{ fontSize: 13, color: 'var(--gray-900)', lineHeight: 1.4 }}>{label}</span>
    </button>
  );
}

/* ---------- step 7: calendar ---------- */

function CalendarStep({ createdParent, createdTeam, finishCore, busy, setBusy, ctx, goDone, goBackToGroup }) {
  const [picked, setPicked] = useState(null); // null | 'gc' | 'other' | 'sample' | 'skip'
  const [gcUrl, setGcUrl] = useState('');
  const [gcErr, setGcErr] = useState('');
  // After a real import attempt, surface the result inline instead of jumping
  // straight to Done. Otherwise a "0 events" outcome looks indistinguishable
  // from a successful one and the user lands on an empty home screen.
  const [importResult, setImportResult] = useState(null); // { sourceId, added, updated, skipped }

  // Realize parent + team on demand. We commit in this step so any "Take me there" path
  // lands the user on a screen with a real session and a real team to attach things to.
  const ensureCore = () => (
    createdParent
      ? { parent: createdParent, team: createdTeam }
      : finishCore()
  );

  if (!picked) {
    const noTeam = !createdTeam && !db().teams.length;
    return (
      <div style={{ paddingTop: 16 }}>
        <div className="h2" style={{ marginBottom: 6 }}>Connect a schedule</div>
        <div className="muted" style={{ fontSize: 14, marginBottom: 18 }}>
          Auto-import games and practices so you never have to add them manually.
        </div>

        <ChoiceCard
          icon="🟢"
          title="Import from GameChanger"
          body="Pull every game, practice, and cancellation straight from your team's GameChanger calendar."
          onClick={() => setPicked('gc')}
          recommended
        />
        <ChoiceCard
          icon="🧪"
          title="Try the bundled sample"
          body="14 days of practices and games — perfect for kicking the tires."
          onClick={async () => {
            setPicked('sample');
            setBusy(true);
            const { team } = ensureCore();
            if (!team) { setBusy(false); goDone(); return; }
            const sourceName = `${team.name} (sample season)`;
            const sampleUrl = '/sample/sample-baseball.ics';
            const defaultLegs = {
              drop_off_minutes_before: 15,
              pick_up_minutes_after: 0,
            };
            try {
              const source = addScheduleSource({
                team_id: team.id,
                name: sourceName,
                kind: 'sample',
                url: sampleUrl,
                default_legs: defaultLegs,
              });
              await syncSource(source);

              // Mirror the sample import to Supabase too. Without this the
              // wizard would create a real backend team but no events, which
              // makes Today / Schedule / Open look empty in backend mode even
              // though the local prototype shows the sample.
              let backendNote = '';
              try {
                const sampleRes = await fetch(sampleUrl);
                const sampleText = sampleRes.ok ? await sampleRes.text() : '';
                const parsed = sampleText
                  ? parseIcs(sampleText, { horizonDays: 120 })
                  : null;
                const eligible = parsed
                  ? parsed.events.filter((ev) => !ev.cancelled)
                  : [];

                const backendSourceResult = await addBackendScheduleSource({
                  teamId: team.id,
                  name: sourceName,
                  kind: 'sample',
                  url: sampleUrl,
                  defaultLegs,
                });
                if (backendSourceResult.ok && backendSourceResult.source?.id) {
                  const backendImport = await importBackendEvents(
                    backendSourceResult.source.id,
                    eligible,
                  );
                  if (backendImport.ok) {
                    const c = backendImport.counts || {};
                    backendNote = ` · ${(c.added || 0) + (c.updated || 0)} on Kinpala backend`;
                  }
                }
              } catch (mirrorErr) {
                console.warn('Backend sample mirror failed:', mirrorErr);
              }

              ctx.showToast(`Sample season imported${backendNote}`);
            } catch (e) {
              console.error(e);
              ctx.showToast('Could not import sample — you can try again later');
            } finally {
              setBusy(false);
              goDone();
            }
          }}
        />
        <ChoiceCard
          icon="🔗"
          title="Other (TeamSnap, Apple, Google, .ics URL)"
          body="We'll take you straight to the import screen so you can paste a link."
          onClick={() => setPicked('other')}
        />
        <ChoiceCard
          icon="⏭️"
          title="Skip — set it up later"
          body="You can still create one-off carpools from the home screen."
          onClick={() => {
            ensureCore();
            localStorage.setItem(HINT_KEY, 'show');
            goDone();
          }}
        />

        {busy && (
          <div className="muted" style={{ textAlign: 'center', marginTop: 16, fontSize: 13 }}>
            Importing schedule…
          </div>
        )}

        {noTeam && (
          <div className="muted" style={{ fontSize: 12, marginTop: 12, textAlign: 'center' }}>
            Heads up: schedules attach to a group. Go back to add one if you want to import a feed.
          </div>
        )}
      </div>
    );
  }

  if (picked === 'gc') {
    const needsGroup = gcErr === 'NEEDS_GROUP';
    const importNow = async () => {
      setGcErr('');
      setImportResult(null);
      const url = gcUrl.trim();
      if (url.length < 10) { setGcErr('Paste your full GameChanger calendar URL.'); return; }
      const { team } = ensureCore();
      if (!team) {
        setGcErr('NEEDS_GROUP');
        return;
      }
      setBusy(true);
      try {
        const source = addScheduleSource({
          team_id: team.id,
          name: `${team.name} schedule`,
          kind: 'webcal',
          url,
        });
        const result = await syncSource(getSource(source.id));
        const count = (result?.added || 0) + (result?.updated || 0);
        if (count > 0) {
          ctx.showToast(`Imported ${count} event${count === 1 ? '' : 's'} from GameChanger 🟢`);
          goDone();
        } else {
          // Connected but feed yielded nothing in our 4-month window. Stay on
          // this step so the user can debug instead of landing on an empty
          // home screen wondering what happened.
          setImportResult({
            sourceId: source.id,
            teamId: team.id,
            added: 0,
            updated: 0,
            skipped: result?.skipped || [],
          });
        }
      } catch (e) {
        setGcErr(e.message || 'Could not fetch that link. Double-check the URL.');
      } finally {
        setBusy(false);
      }
    };

    const takeMeThere = () => {
      const { team } = ensureCore();
      finishOnboarding('calendar_take_me_there');
      if (team) {
        ctx.navigate('add_schedule_source', { teamId: team.id, prefillUrl: gcUrl.trim() || undefined });
      }
    };

    return (
      <div style={{ paddingTop: 8 }}>
        <button
          type="button"
          onClick={() => { setPicked(null); setGcErr(''); }}
          style={{ fontSize: 13, color: 'var(--gray-500)', fontWeight: 600, marginBottom: 8 }}
        >
          ← Other options
        </button>

        <div className="h2" style={{ marginBottom: 6 }}>Import from GameChanger</div>
        <div className="muted" style={{ fontSize: 14, marginBottom: 16 }}>
          Two minutes — grab the link in GameChanger, paste it here.
        </div>

        <GcSteps />
        <UrlInput
          label="Paste your GameChanger calendar URL"
          value={gcUrl}
          onChange={setGcUrl}
          placeholder="https://team-manager.gc.com/.../export.ics"
        />
        {needsGroup && (
          <div
            style={{
              padding: 12,
              background: 'var(--yellow-100)',
              color: 'var(--yellow-text)',
              borderRadius: 10,
              fontSize: 13,
              marginBottom: 10,
            }}
          >
            <div style={{ fontWeight: 700, marginBottom: 6 }}>
              ⚠️ A schedule needs to be attached to a group.
            </div>
            <div style={{ marginBottom: 10 }}>
              You picked "Skip" earlier — let's create or join a group first. Your URL will stay
              pasted here.
            </div>
            <button
              type="button"
              className="btn btn-primary"
              style={{ width: '100%' }}
              onClick={() => { setGcErr(''); goBackToGroup(); }}
            >
              ← Back to choose a group
            </button>
          </div>
        )}
        {gcErr && !needsGroup && (
          <div style={{ color: 'var(--red-text)', fontSize: 13, marginBottom: 10 }}>
            ⚠️ {gcErr}
          </div>
        )}

        {importResult && importResult.added + importResult.updated === 0 && (
          <div
            style={{
              padding: 14,
              background: 'var(--yellow-100)',
              color: 'var(--yellow-text)',
              borderRadius: 12,
              fontSize: 13,
              marginBottom: 12,
            }}
          >
            <div style={{ fontWeight: 700, marginBottom: 6, fontSize: 14 }}>
              📭 Connected — but we found 0 upcoming events
            </div>
            <div style={{ marginBottom: 8 }}>
              The link worked, but no games or practices came back in the next 4 months. A few
              common reasons:
            </div>
            <ul style={{ paddingLeft: 18, margin: '0 0 10px', lineHeight: 1.5 }}>
              <li>The URL is to a <em>web page</em>, not the <code>.ics</code> export. Look for
                "Subscribe to calendar" or "Copy link" inside GameChanger.</li>
              <li>The team's season hasn't started — check back once games are scheduled.</li>
              <li>You copied the wrong team's link.</li>
            </ul>
            <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
              <button
                type="button"
                className="btn btn-primary"
                style={{ flex: 1 }}
                onClick={() => { setImportResult(null); }}
              >
                Try a different URL
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  finishOnboarding('calendar_manage_feed');
                  ctx.navigate('schedule_sources', { teamId: importResult.teamId });
                }}
              >
                Manage feed →
              </button>
            </div>
          </div>
        )}

        <button
          type="button"
          className="btn btn-primary"
          style={{ width: '100%', marginBottom: 10 }}
          disabled={busy || gcUrl.trim().length < 10}
          onClick={importNow}
        >
          {busy ? 'Importing…' : 'Import now'}
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          style={{ width: '100%', marginBottom: 14 }}
          onClick={takeMeThere}
        >
          Take me to the full import screen →
        </button>

        <PathBreadcrumb />

        <button
          type="button"
          onClick={() => {
            ensureCore();
            localStorage.setItem(HINT_KEY, 'show');
            goDone();
          }}
          style={{
            display: 'block',
            margin: '12px auto 0',
            fontSize: 13,
            color: 'var(--gray-500)',
            fontWeight: 600,
          }}
        >
          I'll do this later
        </button>
      </div>
    );
  }

  // 'other' — short panel that explains and routes
  return (
    <div style={{ paddingTop: 8 }}>
      <button
        type="button"
        onClick={() => setPicked(null)}
        style={{ fontSize: 13, color: 'var(--gray-500)', fontWeight: 600, marginBottom: 8 }}
      >
        ← Other options
      </button>

      <div className="h2" style={{ marginBottom: 6 }}>Other calendar feed</div>
      <div className="muted" style={{ fontSize: 14, marginBottom: 16 }}>
        TeamSnap, SportsEngine, Apple Calendar, Google Calendar, or any <code>.ics</code> URL — same idea, we'll fetch + sync.
      </div>

      <PathBreadcrumb />

      <button
        type="button"
        className="btn btn-primary"
        style={{ width: '100%', marginTop: 12, marginBottom: 8 }}
        onClick={() => {
          const { team } = ensureCore();
          finishOnboarding('calendar_add_source');
          if (team) ctx.navigate('add_schedule_source', { teamId: team.id });
        }}
      >
        Take me to the import screen →
      </button>
      <button
        type="button"
        onClick={() => {
          ensureCore();
          localStorage.setItem(HINT_KEY, 'show');
          goDone();
        }}
        style={{
          display: 'block',
          margin: '12px auto 0',
          fontSize: 13,
          color: 'var(--gray-500)',
          fontWeight: 600,
        }}
      >
        I'll do this later
      </button>
    </div>
  );
}

/* ---------- helpers for the calendar step ---------- */

function GcSteps() {
  const [showVisual, setShowVisual] = useState(false);
  const items = [
    { n: 1, body: <>Open the <strong>GameChanger</strong> app and tap your team.</> },
    { n: 2, body: <>Tap <strong>Schedule</strong>, then the <strong>⋯</strong> menu (top right).</> },
    { n: 3, body: <>Choose <strong>Subscribe to calendar</strong> → <strong>Copy link</strong>.</> },
    { n: 4, body: <>Come back here and paste it below 👇</> },
  ];
  return (
    <div className="card" style={{ padding: 14, marginBottom: 14 }}>
      <div className="caps muted" style={{ marginBottom: 10 }}>📲 In GameChanger</div>
      <ol style={{ paddingLeft: 0, margin: 0, listStyle: 'none', display: 'grid', gap: 8 }}>
        {items.map((s) => (
          <li key={s.n} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
            <span
              style={{
                flex: '0 0 22px',
                height: 22,
                borderRadius: 999,
                background: 'var(--green-700)',
                color: 'white',
                fontSize: 12,
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {s.n}
            </span>
            <span style={{ fontSize: 14, color: 'var(--gray-700)', lineHeight: 1.4 }}>{s.body}</span>
          </li>
        ))}
      </ol>

      <button
        type="button"
        onClick={() => setShowVisual((v) => !v)}
        style={{
          marginTop: 12,
          fontSize: 13,
          fontWeight: 700,
          color: 'var(--green-text)',
          display: 'inline-flex',
          alignItems: 'center',
          gap: 4,
        }}
      >
        {showVisual ? '▾ Hide screenshots' : '▸ Show me with screenshots'}
      </button>
      {showVisual && <GcVisualGuide />}
    </div>
  );
}

/* ---------- visual GameChanger walkthrough (mock screenshots) ---------- */

function GcVisualGuide() {
  return (
    <div
      style={{
        marginTop: 12,
        display: 'flex',
        gap: 10,
        overflowX: 'auto',
        paddingBottom: 6,
        WebkitOverflowScrolling: 'touch',
      }}
    >
      <PhoneFrame caption="1. Tap your team">
        <PhoneHeader title="Teams" />
        <TeamRow color="#fee" emoji="⚾" name="Tigers Baseball" highlight />
        <TeamRow color="#eef" emoji="⚽" name="Hawks Soccer" />
      </PhoneFrame>
      <PhoneFrame caption="2. Open Schedule, tap ⋯">
        <PhoneHeader title="Tigers Baseball" right="⋯" highlightRight />
        <PhoneTabs active="Schedule" tabs={['Roster', 'Schedule', 'Stats']} />
        <ScheduleRow label="Wed · Practice" time="5:30 PM" />
        <ScheduleRow label="Sat · vs Wildcats" time="10:00 AM" />
      </PhoneFrame>
      <PhoneFrame caption="3. Subscribe to calendar">
        <PhoneHeader title="Schedule" right="✕" />
        <MenuRow icon="🔔" label="Notifications" />
        <MenuRow icon="📅" label="Subscribe to calendar" highlight />
        <MenuRow icon="📤" label="Share schedule" />
      </PhoneFrame>
      <PhoneFrame caption="4. Copy link">
        <PhoneHeader title="Calendar feed" right="✕" />
        <UrlBox url="webcal://team-manager.gc.com/teams/.../calendar.ics" />
        <FauxButton>📋 Copy link</FauxButton>
        <div style={{ fontSize: 10, color: '#6b7280', marginTop: 6, textAlign: 'center' }}>
          Then paste it back in Carpool ↩︎
        </div>
      </PhoneFrame>
    </div>
  );
}

/* ---------- mock phone-frame primitives ---------- */

function PhoneFrame({ children, caption }) {
  return (
    <div style={{ flex: '0 0 auto', width: 180 }}>
      <div
        style={{
          background: '#0f172a',
          borderRadius: 22,
          padding: 6,
          boxShadow: '0 4px 12px rgba(15,23,42,0.18)',
        }}
      >
        <div
          style={{
            background: 'white',
            borderRadius: 16,
            overflow: 'hidden',
            minHeight: 220,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {children}
        </div>
      </div>
      <div
        style={{
          fontSize: 11,
          fontWeight: 700,
          color: 'var(--gray-700)',
          textAlign: 'center',
          marginTop: 6,
        }}
      >
        {caption}
      </div>
    </div>
  );
}

function PhoneHeader({ title, right, highlightRight }) {
  return (
    <div
      style={{
        background: 'linear-gradient(135deg, #0a4d3a, #2d6a4f)',
        color: 'white',
        fontSize: 12,
        fontWeight: 700,
        padding: '10px 12px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <span>{title}</span>
      {right && (
        <span
          style={{
            fontSize: 14,
            background: highlightRight ? '#fde047' : 'transparent',
            color: highlightRight ? '#0f172a' : 'white',
            padding: highlightRight ? '0 6px' : 0,
            borderRadius: 6,
            outline: highlightRight ? '2px solid #fde047' : 'none',
          }}
        >
          {right}
        </span>
      )}
    </div>
  );
}

function PhoneTabs({ tabs, active }) {
  return (
    <div style={{ display: 'flex', borderBottom: '1px solid #e5e7eb' }}>
      {tabs.map((t) => (
        <div
          key={t}
          style={{
            flex: 1,
            textAlign: 'center',
            fontSize: 10,
            fontWeight: 700,
            padding: '8px 0',
            color: t === active ? '#0a4d3a' : '#6b7280',
            borderBottom: t === active ? '2px solid #0a4d3a' : '2px solid transparent',
          }}
        >
          {t}
        </div>
      ))}
    </div>
  );
}

function TeamRow({ color, emoji, name, highlight }) {
  return (
    <div
      style={{
        display: 'flex',
        gap: 8,
        alignItems: 'center',
        padding: '10px 12px',
        background: highlight ? 'rgba(45,106,79,0.10)' : 'white',
        outline: highlight ? '2px solid var(--green-700)' : 'none',
        outlineOffset: -2,
        borderRadius: highlight ? 8 : 0,
        margin: highlight ? '4px' : 0,
      }}
    >
      <span
        style={{
          width: 28,
          height: 28,
          borderRadius: 8,
          background: color,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 16,
        }}
      >
        {emoji}
      </span>
      <span style={{ fontSize: 11, fontWeight: 600 }}>{name}</span>
    </div>
  );
}

function ScheduleRow({ label, time }) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        padding: '8px 12px',
        borderBottom: '1px solid #f3f4f6',
        fontSize: 11,
      }}
    >
      <span style={{ color: '#374151', fontWeight: 600 }}>{label}</span>
      <span style={{ color: '#6b7280' }}>{time}</span>
    </div>
  );
}

function MenuRow({ icon, label, highlight }) {
  return (
    <div
      style={{
        display: 'flex',
        gap: 8,
        alignItems: 'center',
        padding: '10px 12px',
        fontSize: 11,
        background: highlight ? 'rgba(45,106,79,0.10)' : 'white',
        outline: highlight ? '2px solid var(--green-700)' : 'none',
        outlineOffset: -2,
        borderRadius: highlight ? 8 : 0,
        margin: highlight ? '4px' : 0,
        fontWeight: highlight ? 700 : 500,
        color: highlight ? 'var(--green-text)' : '#374151',
      }}
    >
      <span>{icon}</span>
      <span>{label}</span>
    </div>
  );
}

function UrlBox({ url }) {
  return (
    <div
      style={{
        margin: '12px 12px 6px',
        padding: '8px 10px',
        background: '#f9fafb',
        border: '1px solid #e5e7eb',
        borderRadius: 8,
        fontSize: 9,
        color: '#374151',
        wordBreak: 'break-all',
        fontFamily: 'ui-monospace, SFMono-Regular, monospace',
      }}
    >
      {url}
    </div>
  );
}

function FauxButton({ children }) {
  return (
    <div
      style={{
        margin: '0 12px 12px',
        padding: '8px 0',
        background: 'var(--green-700)',
        color: 'white',
        textAlign: 'center',
        borderRadius: 8,
        fontSize: 11,
        fontWeight: 700,
      }}
    >
      {children}
    </div>
  );
}

function PathBreadcrumb() {
  const Crumb = ({ icon, label }) => (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '6px 10px',
        background: 'white',
        border: '1px solid var(--gray-200)',
        borderRadius: 8,
        fontSize: 12,
        fontWeight: 700,
        color: 'var(--gray-700)',
        whiteSpace: 'nowrap',
      }}
    >
      <span>{icon}</span>
      <span>{label}</span>
    </span>
  );
  return (
    <div
      style={{
        background: 'var(--blue-100)',
        color: 'var(--blue-text)',
        borderRadius: 12,
        padding: 12,
      }}
    >
      <div className="caps" style={{ marginBottom: 8 }}>📍 Find this later in Carpool</div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          flexWrap: 'wrap',
          fontSize: 14,
          fontWeight: 700,
        }}
      >
        <Crumb icon="👤" label="Profile" />
        <span>›</span>
        <Crumb icon="📅" label="Schedule sources" />
        <span>›</span>
        <Crumb icon="➕" label="Add a feed" />
      </div>
    </div>
  );
}

function UrlInput({ label, value, onChange, placeholder }) {
  return (
    <>
      <label className="field">{label}</label>
      <input
        className="input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoCapitalize="off"
        autoCorrect="off"
        spellCheck={false}
        style={{ marginBottom: 12, fontSize: 13 }}
      />
    </>
  );
}

/* ---------- step 7: done ---------- */

function DoneStep({ parent, team, ctx }) {
  return (
    <div style={{ paddingTop: 32, textAlign: 'center' }}>
      <div style={{ fontSize: 64, marginBottom: 12 }}>🎉</div>
      <div className="h1" style={{ marginBottom: 8 }}>
        You're all set{parent?.name ? `, ${parent.name.split(' ')[0]}` : ''}!
      </div>
      <div className="muted" style={{ fontSize: 15, marginBottom: 24 }}>
        {team
          ? <>You're an admin of <strong>{team.name}</strong>. Share your invite code <strong>{team.invite_code}</strong> with other parents to get them in.</>
          : <>You're ready to create your first carpool from the home screen.</>}
      </div>

      <div className="card" style={{ padding: 16, textAlign: 'left', marginBottom: 20 }}>
        <div className="h3" style={{ marginBottom: 8 }}>Your home screen will show</div>
        <ul style={{ paddingLeft: 18, color: 'var(--gray-700)', fontSize: 14, lineHeight: 1.7 }}>
          <li>Today's rides and what's next up</li>
          <li>Open legs you can claim with one tap</li>
          <li>Quick actions: create a carpool, need a sub, kid out today</li>
        </ul>
      </div>

      <button
        type="button"
        className="btn btn-primary"
        style={{ width: '100%' }}
        onClick={() => {
          finishOnboarding('done_step');
          ctx.navigate('today');
        }}
      >
        Open my home screen →
      </button>
    </div>
  );
}
