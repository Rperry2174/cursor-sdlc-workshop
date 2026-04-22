import { useEffect, useState, useCallback } from 'react';
import { subscribe, getCurrentParent, listParents, setCurrentParentId, unreadCount, resetDb, isOnboarded, startFreshOnboarding, shouldShowGcHint, getOpenLegsForParent } from './data/store.js';
import { Onboarding } from './screens/Onboarding.jsx';
import { Today } from './screens/Today.jsx';
import { Schedule } from './screens/Schedule.jsx';
import { Profile } from './screens/Profile.jsx';
import { LegDetail } from './screens/LegDetail.jsx';
import { NotificationsInbox } from './screens/NotificationsInbox.jsx';
import { CreateGroup } from './screens/CreateGroup.jsx';
import { InviteLanding } from './screens/InviteLanding.jsx';
import { SubResponse } from './screens/SubResponse.jsx';
import { Recurring } from './screens/Recurring.jsx';
import { Chat } from './screens/Chat.jsx';
import { Blackouts } from './screens/Blackouts.jsx';
import { Digest } from './screens/Digest.jsx';
import { NotificationPrefs } from './screens/NotificationPrefs.jsx';
import { NotifWizard } from './screens/NotifWizard.jsx';
import { Balance } from './screens/Balance.jsx';
import { CreateCarpool } from './screens/CreateCarpool.jsx';
import { ScheduleSources, AddScheduleSource } from './screens/ScheduleSources.jsx';
import { ActiveRide } from './screens/ActiveRide.jsx';
import { OpenShifts } from './screens/OpenShifts.jsx';
import { Avatar } from './components/Avatar.jsx';
import { Toast } from './components/Toast.jsx';

export default function App() {
  const [, setTick] = useState(0);
  const [route, setRoute] = useState({ name: 'today' });
  const [toast, setToast] = useState({ message: '', action: null, duration: 2200 });
  const [showSwitcher, setShowSwitcher] = useState(false);

  useEffect(() => subscribe(() => setTick((t) => t + 1)), []);

  const onboarded = isOnboarded();
  const currentParent = onboarded ? getCurrentParent() : null;
  const unread = currentParent ? unreadCount(currentParent.id) : 0;
  const openCount = currentParent ? getOpenLegsForParent(currentParent.id, 21).length : 0;

  const navigate = useCallback((name, params = {}) => {
    setRoute({ name, ...params });
    window.scrollTo(0, 0);
  }, []);

  const showToast = useCallback((message, opts = {}) => {
    setToast({
      message,
      action: opts.action || null,
      duration: opts.duration ?? (opts.action ? 5000 : 2200),
    });
  }, []);

  const ctx = { navigate, showToast };

  if (!onboarded) {
    return (
      <div className="app-frame">
        <div className="scroll-area" style={{ paddingBottom: 0 }}>
          <Onboarding ctx={ctx} />
        </div>
        <Toast
          message={toast.message}
          action={toast.action}
          duration={toast.duration}
          onDone={() => setToast({ message: '', action: null, duration: 2200 })}
        />
      </div>
    );
  }

  let screen;
  switch (route.name) {
    case 'leg':
      screen = <LegDetail legId={route.legId} ctx={ctx} />;
      break;
    case 'schedule':
      screen = <Schedule ctx={ctx} />;
      break;
    case 'profile':
      screen = <Profile ctx={ctx} />;
      break;
    case 'inbox':
      screen = <NotificationsInbox ctx={ctx} />;
      break;
    case 'create_group':
      screen = <CreateGroup ctx={ctx} />;
      break;
    case 'invite':
      screen = <InviteLanding inviteCode={route.inviteCode} ctx={ctx} />;
      break;
    case 'sub_response':
      screen = <SubResponse subRequestId={route.subRequestId} ctx={ctx} />;
      break;
    case 'recurring':
      screen = <Recurring ctx={ctx} />;
      break;
    case 'chat':
      screen = <Chat teamId={route.teamId} ctx={ctx} />;
      break;
    case 'blackouts':
      screen = <Blackouts ctx={ctx} />;
      break;
    case 'digest':
      screen = <Digest ctx={ctx} />;
      break;
    case 'notif_prefs':
      screen = <NotificationPrefs ctx={ctx} />;
      break;
    case 'notif_wizard':
      screen = <NotifWizard ctx={ctx} />;
      break;
    case 'balance':
      screen = <Balance teamId={route.teamId} ctx={ctx} />;
      break;
    case 'create_carpool':
      screen = <CreateCarpool ctx={ctx} />;
      break;
    case 'schedule_sources':
      screen = <ScheduleSources teamId={route.teamId} ctx={ctx} />;
      break;
    case 'add_schedule_source':
      screen = <AddScheduleSource teamId={route.teamId} prefillUrl={route.prefillUrl} ctx={ctx} />;
      break;
    case 'active_ride':
      screen = <ActiveRide legId={route.legId} ctx={ctx} />;
      break;
    case 'open_shifts':
      screen = <OpenShifts ctx={ctx} />;
      break;
    case 'today':
    default:
      screen = <Today ctx={ctx} />;
  }

  return (
    <div className="app-frame">
      {/* Demo profile switcher */}
      <button
        type="button"
        onClick={() => setShowSwitcher(!showSwitcher)}
        style={{
          position: 'fixed',
          top: 8,
          right: 'max(8px, calc(50vw - 215px + 8px))',
          zIndex: 60,
          background: 'rgba(0,0,0,0.7)',
          color: 'white',
          padding: '4px 10px',
          borderRadius: 999,
          fontSize: 11,
          fontWeight: 700,
        }}
      >
        Demo: {currentParent?.name?.split(' ')[0] || '—'} ▾
      </button>
      {showSwitcher && (
        <div
          style={{
            position: 'fixed',
            top: 36,
            right: 'max(8px, calc(50vw - 215px + 8px))',
            zIndex: 60,
            background: 'white',
            borderRadius: 12,
            padding: 8,
            boxShadow: 'var(--shadow-lg)',
            minWidth: 180,
          }}
        >
          {listParents().map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => {
                setCurrentParentId(p.id);
                setShowSwitcher(false);
              }}
              style={{
                display: 'flex',
                width: '100%',
                gap: 8,
                padding: 8,
                borderRadius: 8,
                alignItems: 'center',
                fontSize: 13,
                fontWeight: 600,
                background: p.id === currentParent?.id ? 'var(--green-100)' : 'transparent',
              }}
            >
              <Avatar name={p.name} color={p.avatar_color} size="sm" />
              <span>{p.name}</span>
            </button>
          ))}
          <button
            type="button"
            onClick={() => {
              if (confirm('Wipe everything and run the onboarding wizard from scratch?')) {
                startFreshOnboarding();
                setShowSwitcher(false);
                navigate('today');
              }
            }}
            style={{
              display: 'block',
              width: '100%',
              padding: 8,
              borderRadius: 8,
              fontSize: 12,
              color: 'var(--blue-text)',
              fontWeight: 600,
              borderTop: '1px solid var(--gray-100)',
              marginTop: 4,
            }}
          >
            ✨ Start fresh & onboard
          </button>
          <button
            type="button"
            onClick={() => {
              if (confirm('Reset all demo data?')) {
                resetDb();
                setShowSwitcher(false);
                showToast('Demo data reset');
                navigate('today');
              }
            }}
            style={{
              display: 'block',
              width: '100%',
              padding: 8,
              borderRadius: 8,
              fontSize: 12,
              color: 'var(--red-text)',
              fontWeight: 600,
            }}
          >
            Reset demo data
          </button>
        </div>
      )}

      <div className="scroll-area">{screen}</div>

      <nav className="tabbar">
        <button
          type="button"
          className={`tab ${route.name === 'today' ? 'active' : ''}`}
          onClick={() => navigate('today')}
        >
          <span className="icon">🚗</span>
          <span>Today</span>
        </button>
        <button
          type="button"
          className={`tab ${route.name === 'schedule' ? 'active' : ''}`}
          onClick={() => navigate('schedule')}
        >
          <span className="icon">📅</span>
          <span>Schedule</span>
        </button>
        <button
          type="button"
          className={`tab ${route.name === 'open_shifts' ? 'active' : ''}`}
          onClick={() => navigate('open_shifts')}
          style={{ position: 'relative' }}
        >
          <span className="icon">🆓</span>
          <span>Open</span>
          {openCount > 0 && (
            <span
              style={{
                position: 'absolute',
                top: 6,
                right: '24%',
                background: 'var(--yellow-500)',
                color: 'white',
                borderRadius: 999,
                fontSize: 10,
                fontWeight: 800,
                minWidth: 18,
                height: 18,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0 5px',
              }}
            >
              {openCount}
            </span>
          )}
        </button>
        <button
          type="button"
          className={`tab ${route.name === 'inbox' ? 'active' : ''}`}
          onClick={() => navigate('inbox')}
          style={{ position: 'relative' }}
        >
          <span className="icon">🔔</span>
          <span>Inbox</span>
          {unread > 0 && (
            <span
              style={{
                position: 'absolute',
                top: 6,
                right: '28%',
                background: 'var(--red-500)',
                color: 'white',
                borderRadius: 999,
                fontSize: 10,
                fontWeight: 800,
                minWidth: 18,
                height: 18,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0 5px',
              }}
            >
              {unread}
            </span>
          )}
        </button>
        <button
          type="button"
          className={`tab ${route.name === 'profile' ? 'active' : ''} ${
            currentParent && shouldShowGcHint(currentParent.id) && route.name !== 'profile'
              ? 'pulse'
              : ''
          }`}
          onClick={() => navigate('profile')}
        >
          <span className="icon">👤</span>
          <span>Profile</span>
        </button>
      </nav>

      <Toast
        message={toast.message}
        action={toast.action}
        duration={toast.duration}
        onDone={() => setToast({ message: '', action: null, duration: 2200 })}
      />
    </div>
  );
}
