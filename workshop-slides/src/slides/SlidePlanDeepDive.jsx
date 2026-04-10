const kw = (text, color = 'var(--cyan)') => (
  <span style={{
    display: 'inline-block',
    padding: '0.05rem 0.35rem',
    borderRadius: '4px',
    background: color === 'var(--cyan)'
      ? 'rgba(42, 161, 152, 0.12)'
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
    background: 'var(--cyan)', color: 'white',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '0.6rem', fontWeight: 700, flexShrink: 0,
  }}>{n}</span>
)

const cardStyle = {
  borderLeft: '3px solid var(--cyan)',
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

const SlidePlanDeepDive = () => (
  <>
    <div style={{
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
      marginBottom: '1rem',
      paddingBottom: '0.75rem',
      borderBottom: '2px solid rgba(42, 161, 152, 0.15)',
    }}>
      <div>
        <div className="phase-header" style={{ marginBottom: '0.2rem' }}>
          <div className="phase-number plan">01</div>
          <h2 style={{ marginBottom: 0 }}>Plan</h2>
        </div>
        <p className="small" style={{ marginBottom: 0 }}>
          How teams go from idea to actionable work — and where it breaks down
        </p>
      </div>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.4rem 0.75rem',
        background: 'linear-gradient(135deg, rgba(42, 161, 152, 0.1), rgba(42, 161, 152, 0.04))',
        border: '1px solid rgba(42, 161, 152, 0.2)',
        borderRadius: '100px',
        flexShrink: 0,
      }}>
        <span style={{ fontSize: '0.85rem' }}>💡</span>
        <span style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--cyan)', letterSpacing: '0.5px' }}>
          Idea → Spec
        </span>
        <span style={{ fontSize: '0.85rem' }}>📋</span>
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
          <h3 style={{ color: 'var(--cyan)', marginBottom: 0, fontSize: '1rem' }}>Discovery Questions</h3>
          <span style={{
            fontSize: '0.55rem', fontWeight: 600,
            padding: '0.15rem 0.45rem', borderRadius: '100px',
            background: 'rgba(42, 161, 152, 0.1)', color: 'var(--cyan)',
            letterSpacing: '0.5px',
          }}>ASK THESE</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div className="discovery-card" style={cardStyle}>
            {numBadge(1)}
            <span className="dq-text" style={{ fontSize: '0.8rem' }}>
              "How do you turn a {kw('business request')} into a {kw('ticket or spec')} an engineer can act on?"
            </span>
          </div>
          <div className="discovery-card" style={cardStyle}>
            {numBadge(2)}
            <span className="dq-text" style={{ fontSize: '0.8rem' }}>
              "How long from {kw('"we want X"')} to {kw('an engineer writing code')} for X?"
            </span>
          </div>
          <div className="discovery-card" style={cardStyle}>
            {numBadge(3)}
            <span className="dq-text" style={{ fontSize: '0.8rem' }}>
              "Who writes {kw('specs / PRDs')}? How much {kw('back-and-forth')} before engineering starts?"
            </span>
          </div>
          <div className="discovery-card" style={cardStyle}>
            {numBadge(4)}
            <span className="dq-text" style={{ fontSize: '0.8rem' }}>
              "How often does an engineer start building and realize the {kw('spec was unclear')} or {kw('incomplete')}?"
            </span>
          </div>
          <div className="discovery-card" style={cardStyle}>
            {numBadge(5)}
            <span className="dq-text" style={{ fontSize: '0.8rem' }}>
              "What {kw('planning tools')} does your team use? Where do {kw('requirements')} live?"
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
            <span className="pain-icon" style={{ fontSize: '1.1rem' }}>🐢</span>
            <span className="pain-text" style={{ fontSize: '0.8rem' }}>
              {kw('Slow spec handoff', 'var(--red)')} — weeks of meetings, docs, and Slack threads before a single line of code
            </span>
          </div>
          <div className="pain-item" style={painStyle}>
            <span className="pain-icon" style={{ fontSize: '1.1rem' }}>🔄</span>
            <span className="pain-text" style={{ fontSize: '0.8rem' }}>
              {kw('Ambiguous requirements', 'var(--red)')} — PMs describe intent; engineers need precision. Context is lost in translation.
            </span>
          </div>
          <div className="pain-item" style={painStyle}>
            <span className="pain-icon" style={{ fontSize: '1.1rem' }}>📋</span>
            <span className="pain-text" style={{ fontSize: '0.8rem' }}>
              {kw('Ticket sprawl', 'var(--red)')} — stories and subtasks multiply, dependencies tangle, nobody has the full picture
            </span>
          </div>
          <div className="pain-item" style={painStyle}>
            <span className="pain-icon" style={{ fontSize: '1.1rem' }}>🔁</span>
            <span className="pain-text" style={{ fontSize: '0.8rem' }}>
              {kw('Stale docs', 'var(--red)')} — specs written in Confluence or Notion drift from reality within days of engineering starting
            </span>
          </div>
          <div className="pain-item" style={painStyle}>
            <span className="pain-icon" style={{ fontSize: '1.1rem' }}>⏳</span>
            <span className="pain-text" style={{ fontSize: '0.8rem' }}>
              {kw('Blocked engineers', 'var(--red)')} — waiting for PM clarification before they can write code
            </span>
          </div>
        </div>
      </div>
    </div>

    <div style={{
      marginTop: '0.75rem',
      display: 'flex', alignItems: 'center', gap: '0.6rem',
      padding: '0.6rem 0.85rem',
      background: 'linear-gradient(135deg, rgba(42, 161, 152, 0.08), rgba(42, 161, 152, 0.03))',
      border: '1px solid rgba(42, 161, 152, 0.2)',
      borderRadius: '8px',
    }}>
      <span style={{ fontSize: '1.1rem' }}>💡</span>
      <span style={{ fontSize: '0.8rem', color: 'var(--text-primary)', lineHeight: 1.5 }}>
        <strong style={{ color: 'var(--cyan)' }}>Sound familiar?</strong> Every org hits these walls. The next slides show what's possible.
      </span>
    </div>
  </>
)

export default SlidePlanDeepDive
