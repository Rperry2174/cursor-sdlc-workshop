import { useEffect } from 'react';

export function Toast({ message, action, onDone, duration = 2200 }) {
  useEffect(() => {
    if (!message) return;
    const t = setTimeout(onDone, duration);
    return () => clearTimeout(t);
  }, [message, duration, onDone]);

  if (!message) return null;
  return (
    <div className="toast" style={action ? { display: 'flex', alignItems: 'center', gap: 12 } : undefined}>
      <span style={{ flex: 1 }}>{message}</span>
      {action && (
        <button
          type="button"
          onClick={() => {
            action.onAction();
            onDone();
          }}
          style={{
            background: 'transparent',
            color: '#86efac',
            fontWeight: 800,
            fontSize: 13,
            padding: '4px 8px',
            borderRadius: 8,
            border: '1px solid rgba(134,239,172,0.5)',
            textTransform: 'uppercase',
            letterSpacing: 0.5,
          }}
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
