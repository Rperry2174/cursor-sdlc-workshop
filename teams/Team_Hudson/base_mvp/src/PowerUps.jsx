/**
 * Power-up HUD overlay.
 * Shows the active power-up with an icon, label, animated timer bar, and countdown.
 */
import { POWERUP_DURATIONS } from './powerUpLogic';

const META = {
  shield: { label: 'SHIELD',  icon: '\u{1F6E1}', color: '#3a7bd5', bg: 'rgba(58,123,213,0.18)' },
  slowmo: { label: 'SLOW-MO', icon: '\u{23F1}\uFE0F',  color: '#e6a800', bg: 'rgba(230,168,0,0.18)' },
  magnet: { label: 'MAGNET',  icon: '\u{1F9F2}', color: '#9b59b6', bg: 'rgba(155,89,182,0.18)' },
  boost:  { label: 'BOOST',   icon: '\u{26A1}',  color: '#e74c3c', bg: 'rgba(231,76,60,0.18)' },
  shrink: { label: 'SHRINK',  icon: '\u{1F53D}', color: '#1abc9c', bg: 'rgba(26,188,156,0.18)' },
};

export default function PowerUps({ activePowerUp, powerUpEndTime, now }) {
  if (!activePowerUp || !powerUpEndTime) return null;

  const remaining = Math.max(0, powerUpEndTime - now);
  if (remaining <= 0) return null;

  const total = POWERUP_DURATIONS[activePowerUp] || 4000;
  const progress = remaining / total;
  const secs = (remaining / 1000).toFixed(1);
  const m = META[activePowerUp] || META.shield;

  return (
    <div style={{ ...styles.container, borderColor: `${m.color}55` }}>
      {/* Colored icon badge */}
      <div style={{ ...styles.badge, background: m.bg, boxShadow: `0 0 12px ${m.color}66` }}>
        <span style={styles.icon}>{m.icon}</span>
      </div>

      {/* Info column */}
      <div style={styles.info}>
        <span style={{ ...styles.label, color: m.color }}>{m.label}</span>

        {/* Timer bar */}
        <div style={styles.barTrack}>
          <div
            style={{
              ...styles.barFill,
              width: `${progress * 100}%`,
              background: `linear-gradient(90deg, ${m.color}, ${m.color}99)`,
              boxShadow: `0 0 6px ${m.color}88`,
            }}
          />
        </div>

        <span style={styles.time}>{secs}s</span>
      </div>
    </div>
  );
}

const styles = {
  container: {
    position: 'absolute',
    bottom: 14,
    left: 14,
    zIndex: 10,
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '10px 14px',
    background: 'rgba(8, 16, 28, 0.82)',
    backdropFilter: 'blur(14px)',
    WebkitBackdropFilter: 'blur(14px)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 14,
    color: '#e0e8f0',
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    fontSize: 13,
    pointerEvents: 'none',
    userSelect: 'none',
    transition: 'border-color 0.3s',
  },
  badge: {
    width: 36,
    height: 36,
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    transition: 'box-shadow 0.3s',
  },
  icon: {
    fontSize: 20,
    lineHeight: 1,
  },
  info: {
    display: 'flex',
    flexDirection: 'column',
    gap: 3,
    minWidth: 90,
  },
  label: {
    fontSize: 11,
    fontWeight: 800,
    letterSpacing: 1.8,
    textTransform: 'uppercase',
  },
  barTrack: {
    height: 5,
    background: 'rgba(255,255,255,0.06)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 3,
    transition: 'width 0.1s linear',
  },
  time: {
    fontSize: 11,
    fontFamily: "'SF Mono', 'Courier New', Consolas, monospace",
    color: 'rgba(200,220,240,0.5)',
    fontVariantNumeric: 'tabular-nums',
  },
};
