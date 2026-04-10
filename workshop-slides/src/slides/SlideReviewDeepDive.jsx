const kw = (text, color = 'var(--green)') => (
  <span style={{
    display: 'inline-block',
    padding: '0.05rem 0.35rem',
    borderRadius: '4px',
    background: color === 'var(--green)'
      ? 'rgba(133, 153, 0, 0.12)'
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
    background: 'var(--green)', color: 'white',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '0.6rem', fontWeight: 700, flexShrink: 0,
  }}>{n}</span>
)

const cardStyle = {
  borderLeft: '3px solid var(--green)',
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

const SlideReviewDeepDive = () => (
  <>
    <div style={{
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
      marginBottom: '1rem',
      paddingBottom: '0.75rem',
      borderBottom: '2px solid rgba(133, 153, 0, 0.15)',
    }}>
      <div>
        <div className="phase-header" style={{ marginBottom: '0.2rem' }}>
          <div className="phase-number review">05</div>
          <h2 style={{ marginBottom: 0 }}>Problem: Code Review is the Biggest Queue</h2>
        </div>
        <p className="small" style={{ marginBottom: 0 }}>
          Code review is the quality gate - but it's also the biggest queue in the pipeline
        </p>
      </div>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.4rem 0.75rem',
        background: 'linear-gradient(135deg, rgba(133, 153, 0, 0.1), rgba(133, 153, 0, 0.04))',
        border: '1px solid rgba(133, 153, 0, 0.2)',
        borderRadius: '100px',
        flexShrink: 0,
      }}>
        <span style={{ fontSize: '0.85rem' }}>🔍</span>
        <span style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--green)', letterSpacing: '0.5px' }}>
          PR → Ship
        </span>
        <span style={{ fontSize: '0.85rem' }}>🚀</span>
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
          <h3 style={{ color: 'var(--green)', marginBottom: 0, fontSize: '1rem' }}>Discovery Questions</h3>
          <span style={{
            fontSize: '0.55rem', fontWeight: 600,
            padding: '0.15rem 0.45rem', borderRadius: '100px',
            background: 'rgba(133, 153, 0, 0.1)', color: 'var(--green)',
            letterSpacing: '0.5px',
          }}>ASK THESE</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div className="discovery-card" style={cardStyle}>
            {numBadge(1)}
            <span className="dq-text" style={{ fontSize: '0.8rem' }}>
              "Walk me through how engineers go from {kw('writing code')} to {kw('merging a PR')} today."
            </span>
          </div>
          <div className="discovery-card" style={cardStyle}>
            {numBadge(2)}
            <span className="dq-text" style={{ fontSize: '0.8rem' }}>
              "How long do PRs sit before getting reviewed? What's your {kw('time-to-merge')}?"
            </span>
          </div>
          <div className="discovery-card" style={cardStyle}>
            {numBadge(3)}
            <span className="dq-text" style={{ fontSize: '0.8rem' }}>
              "Are your engineers using {kw('AI to write code')}? How are you keeping up with {kw('reviewing that output')}?"
            </span>
          </div>
          <div className="discovery-card" style={cardStyle}>
            {numBadge(4)}
            <span className="dq-text" style={{ fontSize: '0.8rem' }}>
              "Do you have a {kw('monorepo')}? Is there a {kw('platform team')} managing the developer workflow?"
            </span>
          </div>
          <div className="discovery-card" style={cardStyle}>
            {numBadge(5)}
            <span className="dq-text" style={{ fontSize: '0.8rem' }}>
              "What's your biggest {kw('pain point')} in {kw('code review')} right now?"
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
            <span className="pain-icon" style={{ fontSize: '1.1rem' }}>⏳</span>
            <span className="pain-text" style={{ fontSize: '0.8rem' }}>
              {kw('Review bottleneck', 'var(--red)')} - avg time-to-merge is 41 hours. PRs sit for days waiting for overloaded senior engineers.
            </span>
          </div>
          <div className="pain-item" style={painStyle}>
            <span className="pain-icon" style={{ fontSize: '1.1rem' }}>🔍</span>
            <span className="pain-text" style={{ fontSize: '0.8rem' }}>
              {kw('Shallow reviews', 'var(--red)')} - reviewers skim 500+ line diffs and rubber-stamp. Real bugs slip through.
            </span>
          </div>
          <div className="pain-item" style={painStyle}>
            <span className="pain-icon" style={{ fontSize: '1.1rem' }}>🤖</span>
            <span className="pain-text" style={{ fontSize: '0.8rem' }}>
              {kw('AI outpaces review', 'var(--red)')} - AI-generated PRs are growing faster than teams can review them. The bottleneck shifts downstream.
            </span>
          </div>
          <div className="pain-item" style={painStyle}>
            <span className="pain-icon" style={{ fontSize: '1.1rem' }}>🔗</span>
            <span className="pain-text" style={{ fontSize: '0.8rem' }}>
              {kw('Serial workflow', 'var(--red)')} - one PR at a time, manual iteration on feedback, engineers blocked waiting in queue.
            </span>
          </div>
          <div className="pain-item" style={painStyle}>
            <span className="pain-icon" style={{ fontSize: '1.1rem' }}>💥</span>
            <span className="pain-text" style={{ fontSize: '0.8rem' }}>
              {kw('Broken main', 'var(--red)')} - semantic merge conflicts break the trunk. Existing merge queues can't handle monorepo scale.
            </span>
          </div>
        </div>
      </div>
    </div>

    <div style={{
      marginTop: '0.75rem',
      display: 'flex', alignItems: 'center', gap: '0.6rem',
      padding: '0.6rem 0.85rem',
      background: 'linear-gradient(135deg, rgba(133, 153, 0, 0.08), rgba(133, 153, 0, 0.03))',
      border: '1px solid rgba(133, 153, 0, 0.2)',
      borderRadius: '8px',
    }}>
      <span style={{ fontSize: '1.1rem' }}>💡</span>
      <span style={{ fontSize: '0.8rem', color: 'var(--text-primary)', lineHeight: 1.5 }}>
        <strong style={{ color: 'var(--green)' }}>Sound familiar?</strong> AI is creating more code than ever - but review hasn't scaled to match. The next slides show what's changing.
      </span>
    </div>
  </>
)

export default SlideReviewDeepDive
