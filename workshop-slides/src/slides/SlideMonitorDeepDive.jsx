const kw = (text, color = 'var(--yellow)') => (
  <span style={{
    display: 'inline-block',
    padding: '0.05rem 0.35rem',
    borderRadius: '4px',
    background: color === 'var(--yellow)'
      ? 'rgba(181, 137, 0, 0.12)'
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
    background: 'var(--yellow)', color: 'white',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '0.6rem', fontWeight: 700, flexShrink: 0,
  }}>{n}</span>
)

const cardStyle = {
  borderLeft: '3px solid var(--yellow)',
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

const SlideMonitorDeepDive = () => (
  <>
    <div style={{
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
      marginBottom: '1rem',
      paddingBottom: '0.75rem',
      borderBottom: '2px solid rgba(181, 137, 0, 0.15)',
    }}>
      <div>
        <div className="phase-header" style={{ marginBottom: '0.2rem' }}>
          <div className="phase-number" style={{ background: 'var(--yellow)' }}>07</div>
          <h2 style={{ marginBottom: 0 }}>Monitor</h2>
        </div>
        <p className="small" style={{ marginBottom: 0 }}>
          Production is where the real bugs live — and where response time is everything
        </p>
      </div>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.4rem 0.75rem',
        background: 'linear-gradient(135deg, rgba(181, 137, 0, 0.1), rgba(181, 137, 0, 0.04))',
        border: '1px solid rgba(181, 137, 0, 0.2)',
        borderRadius: '100px',
        flexShrink: 0,
      }}>
        <span style={{ fontSize: '0.85rem' }}>🔔</span>
        <span style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--yellow)', letterSpacing: '0.5px' }}>
          Alert → Fix
        </span>
        <span style={{ fontSize: '0.85rem' }}>🛠️</span>
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
          <h3 style={{ color: 'var(--yellow)', marginBottom: 0, fontSize: '1rem' }}>Discovery Questions</h3>
          <span style={{
            fontSize: '0.55rem', fontWeight: 600,
            padding: '0.15rem 0.45rem', borderRadius: '100px',
            background: 'rgba(181, 137, 0, 0.1)', color: 'var(--yellow)',
            letterSpacing: '0.5px',
          }}>ASK THESE</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div className="discovery-card" style={cardStyle}>
            {numBadge(1)}
            <span className="dq-text" style={{ fontSize: '0.8rem' }}>
              "What {kw('observability tools')} do you use? How do you find out something is broken?"
            </span>
          </div>
          <div className="discovery-card" style={cardStyle}>
            {numBadge(2)}
            <span className="dq-text" style={{ fontSize: '0.8rem' }}>
              "What's your {kw('mean time to resolution')}? How long from alert to deployed fix?"
            </span>
          </div>
          <div className="discovery-card" style={cardStyle}>
            {numBadge(3)}
            <span className="dq-text" style={{ fontSize: '0.8rem' }}>
              "How do {kw('bug reports')} flow from users/Slack to an engineer actually fixing the code?"
            </span>
          </div>
          <div className="discovery-card" style={cardStyle}>
            {numBadge(4)}
            <span className="dq-text" style={{ fontSize: '0.8rem' }}>
              "How much {kw('context switching')} happens when an engineer gets paged? How long to understand the issue?"
            </span>
          </div>
          <div className="discovery-card" style={cardStyle}>
            {numBadge(5)}
            <span className="dq-text" style={{ fontSize: '0.8rem' }}>
              "Are your {kw('on-call engineers')} the same ones who wrote the code? What happens when they're not?"
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
            <span className="pain-icon" style={{ fontSize: '1.1rem' }}>🔥</span>
            <span className="pain-text" style={{ fontSize: '0.8rem' }}>
              {kw('Slow incident response', 'var(--red)')} — alert fires, engineer scrambles to understand the system, hours pass before a fix ships
            </span>
          </div>
          <div className="pain-item" style={painStyle}>
            <span className="pain-icon" style={{ fontSize: '1.1rem' }}>🔍</span>
            <span className="pain-text" style={{ fontSize: '0.8rem' }}>
              {kw('Tool-hopping', 'var(--red)')} — jump from Datadog to logs to code to Slack to Jira. Context is scattered across 5+ tools.
            </span>
          </div>
          <div className="pain-item" style={painStyle}>
            <span className="pain-icon" style={{ fontSize: '1.1rem' }}>🧠</span>
            <span className="pain-text" style={{ fontSize: '0.8rem' }}>
              {kw('Knowledge silos', 'var(--red)')} — only the original author knows the code well enough to debug it. Everyone else is guessing.
            </span>
          </div>
          <div className="pain-item" style={painStyle}>
            <span className="pain-icon" style={{ fontSize: '1.1rem' }}>📋</span>
            <span className="pain-text" style={{ fontSize: '0.8rem' }}>
              {kw('Bug report → fix gap', 'var(--red)')} — reports land in Slack, get triaged into tickets, wait in a queue, eventually get assigned days later.
            </span>
          </div>
          <div className="pain-item" style={painStyle}>
            <span className="pain-icon" style={{ fontSize: '1.1rem' }}>😴</span>
            <span className="pain-text" style={{ fontSize: '0.8rem' }}>
              {kw('On-call burnout', 'var(--red)')} — paging the same senior engineers at 2am because nobody else can debug the system.
            </span>
          </div>
        </div>
      </div>
    </div>

    <div style={{
      marginTop: '0.75rem',
      display: 'flex', alignItems: 'center', gap: '0.6rem',
      padding: '0.6rem 0.85rem',
      background: 'linear-gradient(135deg, rgba(181, 137, 0, 0.08), rgba(181, 137, 0, 0.03))',
      border: '1px solid rgba(181, 137, 0, 0.2)',
      borderRadius: '8px',
    }}>
      <span style={{ fontSize: '1.1rem' }}>💡</span>
      <span style={{ fontSize: '0.8rem', color: 'var(--text-primary)', lineHeight: 1.5 }}>
        <strong style={{ color: 'var(--yellow)' }}>Sound familiar?</strong> The gap between "something is broken" and "the fix is deployed" is where the real cost lives. The next slides show how we close it.
      </span>
    </div>
  </>
)

export default SlideMonitorDeepDive
