const kw = (text, color = 'var(--orange)') => (
  <span style={{
    display: 'inline-block',
    padding: '0.05rem 0.35rem',
    borderRadius: '4px',
    background: color === 'var(--orange)'
      ? 'rgba(203, 75, 22, 0.12)'
      : 'rgba(220, 50, 47, 0.1)',
    color,
    fontWeight: 700,
    fontStyle: 'normal',
    fontSize: '0.78rem',
  }}>{text}</span>
)

const numBadge = (n) => (
  <span style={{
    width: '22px', height: '22px', borderRadius: '50%',
    background: 'var(--orange)', color: 'white',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '0.6rem', fontWeight: 700, flexShrink: 0,
  }}>{n}</span>
)

const cardStyle = {
  borderLeft: '3px solid var(--orange)',
  padding: '0.55rem 0.75rem',
  minHeight: '58px',
  display: 'flex',
  alignItems: 'center',
}

const painStyle = {
  padding: '0.55rem 0.75rem',
  minHeight: '58px',
  display: 'flex',
  alignItems: 'center',
}

const SlideTestDeepDive = () => (
  <>
    <div style={{
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
      marginBottom: '1rem',
      paddingBottom: '0.75rem',
      borderBottom: '2px solid rgba(203, 75, 22, 0.15)',
    }}>
      <div>
        <div className="phase-header" style={{ marginBottom: '0.2rem' }}>
          <div className="phase-number test">04</div>
          <h2 style={{ marginBottom: 0 }}>Test</h2>
        </div>
        <p className="small" style={{ marginBottom: 0 }}>
          Catching bugs before they ship — and why test coverage stays low despite good intentions
        </p>
      </div>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.4rem 0.75rem',
        background: 'linear-gradient(135deg, rgba(203, 75, 22, 0.1), rgba(203, 75, 22, 0.04))',
        border: '1px solid rgba(203, 75, 22, 0.2)',
        borderRadius: '100px',
        flexShrink: 0,
      }}>
        <span style={{ fontSize: '0.85rem' }}>🧪</span>
        <span style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--orange)', letterSpacing: '0.5px' }}>
          Code → Confidence
        </span>
        <span style={{ fontSize: '0.85rem' }}>✅</span>
      </div>
    </div>

    <div style={{
      display: 'grid',
      gridTemplateColumns: '1fr 60px 1fr',
      gap: '0',
      alignItems: 'stretch',
    }}>
      {/* Left: Discovery Questions */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.6rem' }}>
          <h3 style={{ color: 'var(--orange)', marginBottom: 0, fontSize: '1rem' }}>Discovery Questions</h3>
          <span style={{
            fontSize: '0.55rem', fontWeight: 600,
            padding: '0.15rem 0.45rem', borderRadius: '100px',
            background: 'rgba(203, 75, 22, 0.1)', color: 'var(--orange)',
            letterSpacing: '0.5px',
          }}>ASK THESE</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div className="discovery-card" style={cardStyle}>
            {numBadge(1)}
            <span className="dq-text" style={{ fontSize: '0.8rem' }}>
              "What's your current {kw('test coverage')}? Are you happy with it?"
            </span>
          </div>
          <div className="discovery-card" style={cardStyle}>
            {numBadge(2)}
            <span className="dq-text" style={{ fontSize: '0.8rem' }}>
              "Who writes tests — the same {kw('engineer')} who wrote the feature, or a {kw('QA team')}?"
            </span>
          </div>
          <div className="discovery-card" style={cardStyle}>
            {numBadge(3)}
            <span className="dq-text" style={{ fontSize: '0.8rem' }}>
              "How often do {kw('bugs make it to production')} that tests should have caught?"
            </span>
          </div>
          <div className="discovery-card" style={cardStyle}>
            {numBadge(4)}
            <span className="dq-text" style={{ fontSize: '0.8rem' }}>
              "How long does your {kw('CI pipeline')} take? Does it {kw('slow down shipping')}?"
            </span>
          </div>
          <div className="discovery-card" style={cardStyle}>
            {numBadge(5)}
            <span className="dq-text" style={{ fontSize: '0.8rem' }}>
              "When it's {kw('tests vs. deadline')}, which wins? How do you feel about that?"
            </span>
          </div>
        </div>
      </div>

      {/* Center: Arrow connector */}
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', gap: '0.25rem', paddingTop: '2rem',
      }}>
        <div style={{
          width: '2px', flex: '1',
          background: 'linear-gradient(to bottom, transparent, rgba(220, 50, 47, 0.3), rgba(220, 50, 47, 0.3), transparent)',
        }} />
        <div style={{
          width: '44px', height: '44px', borderRadius: '50%',
          background: 'linear-gradient(135deg, rgba(220, 50, 47, 0.12), rgba(220, 50, 47, 0.06))',
          border: '2px solid rgba(220, 50, 47, 0.25)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '1.2rem', flexShrink: 0,
        }}>→</div>
        <div style={{
          fontSize: '0.55rem', fontWeight: 700, textTransform: 'uppercase',
          letterSpacing: '0.5px', color: 'var(--red)', textAlign: 'center',
          lineHeight: 1.3, maxWidth: '55px',
        }}>surfaces these</div>
        <div style={{
          width: '2px', flex: '1',
          background: 'linear-gradient(to bottom, transparent, rgba(220, 50, 47, 0.3), rgba(220, 50, 47, 0.3), transparent)',
        }} />
      </div>

      {/* Right: Pain Points */}
      <div>
        <h3 style={{ color: 'var(--red)', marginBottom: '0.6rem', fontSize: '1rem' }}>Common Pain Points</h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div className="pain-item" style={painStyle}>
            <span className="pain-icon" style={{ fontSize: '1.1rem' }}>📉</span>
            <span className="pain-text" style={{ fontSize: '0.8rem' }}>
              {kw('Low test coverage', 'var(--red)')} — writing tests is tedious, so it gets skipped under deadline pressure. Coverage stays at 20–40%.
            </span>
          </div>
          <div className="pain-item" style={painStyle}>
            <span className="pain-icon" style={{ fontSize: '1.1rem' }}>🧪</span>
            <span className="pain-text" style={{ fontSize: '0.8rem' }}>
              {kw('Brittle tests', 'var(--red)')} — break on refactors but miss real bugs. High maintenance, low value.
            </span>
          </div>
          <div className="pain-item" style={painStyle}>
            <span className="pain-icon" style={{ fontSize: '1.1rem' }}>⏱️</span>
            <span className="pain-text" style={{ fontSize: '0.8rem' }}>
              {kw('Slow CI feedback', 'var(--red)')} — 30–60 min pipelines mean devs context-switch away and come back to failures they've forgotten.
            </span>
          </div>
          <div className="pain-item" style={painStyle}>
            <span className="pain-icon" style={{ fontSize: '1.1rem' }}>🚀</span>
            <span className="pain-text" style={{ fontSize: '0.8rem' }}>
              {kw('Ship-it culture wins', 'var(--red)')} — when the choice is tests or deadline, tests lose every time. The debt compounds silently.
            </span>
          </div>
          <div className="pain-item" style={painStyle}>
            <span className="pain-icon" style={{ fontSize: '1.1rem' }}>🔄</span>
            <span className="pain-text" style={{ fontSize: '0.8rem' }}>
              {kw('Manual QA bottleneck', 'var(--red)')} — QA team can't keep up with engineering velocity. Releases wait in a queue.
            </span>
          </div>
        </div>
      </div>
    </div>

    <div style={{
      marginTop: '0.75rem',
      display: 'flex', alignItems: 'center', gap: '0.6rem',
      padding: '0.6rem 0.85rem',
      background: 'linear-gradient(135deg, rgba(203, 75, 22, 0.08), rgba(203, 75, 22, 0.03))',
      border: '1px solid rgba(203, 75, 22, 0.2)',
      borderRadius: '8px',
    }}>
      <span style={{ fontSize: '1.1rem' }}>💡</span>
      <span style={{ fontSize: '0.8rem', color: 'var(--text-primary)', lineHeight: 1.5 }}>
        <strong style={{ color: 'var(--orange)' }}>Sound familiar?</strong> Testing is the phase everyone agrees is important but nobody has time for. The next slides show what's possible.
      </span>
    </div>
  </>
)

export default SlideTestDeepDive
