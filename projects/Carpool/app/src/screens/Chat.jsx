import { useState, useRef, useEffect } from 'react';
import {
  getCurrentParent,
  getChatMessages,
  postChatMessage,
  getParent,
  db,
  getOpenLegsForParent,
} from '../data/store.js';
import { Avatar } from '../components/Avatar.jsx';
import { TopNav } from '../components/TopNav.jsx';

const QUICK_CHIPS = [
  { label: '🚗 On my way', body: 'On my way!' },
  { label: '⏰ Running late', body: 'Running ~5 min late, sorry!' },
  { label: '🆘 Need a sub', body: 'Anyone able to cover for me today?' },
  { label: '🙏 Thanks!', body: 'Thanks so much for driving today 🙏' },
];

function fmt(iso) {
  const d = new Date(iso);
  const now = new Date();
  const sameDay = d.toDateString() === now.toDateString();
  return sameDay
    ? d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
    : d.toLocaleDateString([], { weekday: 'short' }) +
        ' ' +
        d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}

export function Chat({ teamId, ctx }) {
  const me = getCurrentParent();
  const team = db().teams.find((t) => t.id === teamId);
  const messages = getChatMessages(teamId);
  const [draft, setDraft] = useState('');
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages.length]);

  const nextOpenLeg = getOpenLegsForParent(me.id, 14)[0];
  const pinnedEvent = nextOpenLeg
    ? db().events.find((e) => e.id === nextOpenLeg.event_id)
    : null;

  const send = (body) => {
    const text = body.trim();
    if (!text) return;
    postChatMessage({ team_id: teamId, author_id: me.id, body: text });
    setDraft('');
  };

  if (!team) {
    return (
      <>
        <TopNav title="Chat" onBack={() => ctx.navigate('profile')} />
        <div className="empty">Team not found.</div>
      </>
    );
  }

  return (
    <>
      <TopNav title={team.name} onBack={() => ctx.navigate('profile')} />

      {pinnedEvent && (
        <button
          type="button"
          onClick={() => ctx.navigate('leg', { legId: nextOpenLeg.id })}
          style={{
            display: 'block',
            width: '100%',
            textAlign: 'left',
            background: 'var(--yellow-100)',
            borderBottom: '1px solid var(--yellow-500)',
            padding: '12px 16px',
          }}
        >
          <div className="caps" style={{ color: 'var(--yellow-text)' }}>📌 Pinned</div>
          <div style={{ fontWeight: 700, fontSize: 14, marginTop: 2 }}>
            {pinnedEvent.title} — {nextOpenLeg.direction === 'to_event' ? 'drop-off' : 'pick-up'} needs a driver
          </div>
          <div className="muted" style={{ fontSize: 12, marginTop: 2 }}>
            Tap to open →
          </div>
        </button>
      )}

      <div ref={scrollRef} className="section" style={{ paddingBottom: 8 }}>
        {messages.length === 0 && (
          <div className="empty">
            <div className="icon">💬</div>
            <div className="h3">Say hi to your team</div>
            <div>Quick coordination beats endless texts.</div>
          </div>
        )}
        {messages.map((m) => {
          if (m.kind === 'system_event') {
            return (
              <div
                key={m.id}
                style={{
                  textAlign: 'center',
                  padding: '8px 16px',
                  fontSize: 12,
                  color: 'var(--gray-500)',
                  fontStyle: 'italic',
                }}
              >
                {m.body}
              </div>
            );
          }
          const author = getParent(m.author_id);
          const mine = m.author_id === me.id;
          return (
            <div
              key={m.id}
              style={{
                display: 'flex',
                gap: 8,
                margin: '10px 0',
                flexDirection: mine ? 'row-reverse' : 'row',
              }}
            >
              {!mine && <Avatar name={author?.name || '?'} color={author?.avatar_color} size="sm" />}
              <div style={{ maxWidth: '75%' }}>
                {!mine && (
                  <div className="muted" style={{ fontSize: 11, marginLeft: 4, marginBottom: 2 }}>
                    {author?.name?.split(' ')[0]} · {fmt(m.created_at)}
                  </div>
                )}
                <div
                  style={{
                    background: mine ? 'var(--green-700)' : 'white',
                    color: mine ? 'white' : 'var(--gray-900)',
                    padding: '10px 14px',
                    borderRadius: mine ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                    fontSize: 14,
                    boxShadow: 'var(--shadow-sm)',
                    wordBreak: 'break-word',
                  }}
                >
                  {m.body}
                </div>
                {mine && (
                  <div className="muted" style={{ fontSize: 11, marginRight: 4, marginTop: 2, textAlign: 'right' }}>
                    {fmt(m.created_at)}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div
        style={{
          position: 'sticky',
          bottom: 0,
          background: 'white',
          borderTop: '1px solid var(--gray-200)',
          padding: '8px 12px 12px',
        }}
      >
        <div
          style={{
            display: 'flex',
            gap: 6,
            overflowX: 'auto',
            paddingBottom: 8,
            scrollbarWidth: 'none',
          }}
        >
          {QUICK_CHIPS.map((c) => (
            <button
              key={c.label}
              type="button"
              onClick={() => send(c.body)}
              style={{
                flexShrink: 0,
                background: 'var(--gray-100)',
                color: 'var(--gray-900)',
                padding: '8px 12px',
                borderRadius: 999,
                fontSize: 12,
                fontWeight: 600,
              }}
            >
              {c.label}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <input
            className="input"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder={`Message ${team.name}…`}
            onKeyDown={(e) => {
              if (e.key === 'Enter') send(draft);
            }}
            style={{ flex: 1, padding: '12px 14px' }}
          />
          <button
            type="button"
            className="btn btn-primary"
            disabled={!draft.trim()}
            onClick={() => send(draft)}
            style={{ width: 'auto', padding: '12px 16px', fontSize: 14, opacity: draft.trim() ? 1 : 0.5 }}
          >
            Send
          </button>
        </div>
      </div>
    </>
  );
}
