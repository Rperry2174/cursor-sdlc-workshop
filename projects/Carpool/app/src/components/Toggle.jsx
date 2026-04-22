export function Toggle({ on, onChange, label }) {
  return (
    <button
      type="button"
      className={`toggle ${on ? 'on' : ''}`}
      onClick={() => onChange(!on)}
      aria-pressed={on}
      style={{ background: 'none', padding: 0 }}
    >
      <span className="toggle-track">
        <span className="toggle-thumb" />
      </span>
      {label && <span style={{ fontWeight: 600, fontSize: 14 }}>{label}</span>}
    </button>
  );
}
