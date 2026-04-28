export function TopNav({ title, onBack, right }) {
  return (
    <div className="nav-top">
      {onBack && (
        <button type="button" className="back-btn" onClick={onBack} aria-label="Back">
          ‹
        </button>
      )}
      <div className="title">{title}</div>
      {right}
    </div>
  );
}
