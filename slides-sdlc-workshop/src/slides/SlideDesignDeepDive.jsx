const kw = (text, color = 'var(--purple)') => (
  <span style={{
    display: 'inline-block',
    padding: '0.05rem 0.35rem',
    borderRadius: '4px',
    background: color === 'var(--purple)'
      ? 'rgba(108, 113, 196, 0.12)'
      : 'rgba(220, 50, 47, 0.1)',
    color,
    fontWeight: 700,
    fontStyle: 'normal',
    fontSize: '0.78rem',
  }}>{text}</span>
)

const SlideDesignDeepDive = () => (
  <>
    <div style={{
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
      marginBottom: '1rem',
      paddingBottom: '0.75rem',
      borderBottom: '2px solid rgba(108, 113, 196, 0.15)',
    }}>
      <div>
        <div className="phase-header" style={{ marginBottom: '0.2rem' }}>
          <div className="phase-number design">02</div>
          <h2 style={{ marginBottom: 0 }}>Problem: Design Handoffs Lose Fidelity</h2>
        </div>
        <p className="small" style={{ marginBottom: 0 }}>
          How visual design becomes working code - and why the handoff is so painful
        </p>
      </div>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.4rem 0.75rem',
        background: 'linear-gradient(135deg, rgba(108, 113, 196, 0.1), rgba(108, 113, 196, 0.04))',
        border: '1px solid rgba(108, 113, 196, 0.2)',
        borderRadius: '100px',
        flexShrink: 0,
      }}>
        <span style={{ fontSize: '0.85rem' }}>🎨</span>
        <span style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--purple)', letterSpacing: '0.5px' }}>
          Figma → Code
        </span>
        <span style={{ fontSize: '0.85rem' }}>💻</span>
      </div>
    </div>

    {/* 3-column layout: Questions → Arrow → Pain Points */}
    <div style={{
      display: 'grid',
      gridTemplateColumns: '1fr 60px 1fr',
      gap: '0',
      alignItems: 'stretch',
    }}>
      {/* Left: Discovery Questions */}
      <div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          marginBottom: '0.6rem',
        }}>
          <h3 style={{ color: 'var(--purple)', marginBottom: 0, fontSize: '1rem' }}>Discovery Questions</h3>
          <span style={{
            fontSize: '0.55rem',
            fontWeight: 600,
            padding: '0.15rem 0.45rem',
            borderRadius: '100px',
            background: 'rgba(108, 113, 196, 0.1)',
            color: 'var(--purple)',
            letterSpacing: '0.5px',
          }}>ASK THESE</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div className="discovery-card" style={{ borderLeft: '3px solid var(--purple)', padding: '0.55rem 0.75rem', minHeight: '58px', display: 'flex', alignItems: 'center' }}>
            <span style={{ width: '22px', height: '22px', borderRadius: '50%', background: 'var(--purple)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6rem', fontWeight: 700, flexShrink: 0 }}>1</span>
            <span className="dq-text" style={{ fontSize: '0.8rem' }}>
              "How do you turn designs into {kw('production code')} today?"
            </span>
          </div>

          <div className="discovery-card" style={{ borderLeft: '3px solid var(--purple)', padding: '0.55rem 0.75rem', minHeight: '58px', display: 'flex', alignItems: 'center' }}>
            <span style={{ width: '22px', height: '22px', borderRadius: '50%', background: 'var(--purple)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6rem', fontWeight: 700, flexShrink: 0 }}>2</span>
            <span className="dq-text" style={{ fontSize: '0.8rem' }}>
              "How many rounds of {kw('back-and-forth')} happen between designer and engineer?"
            </span>
          </div>

          <div className="discovery-card" style={{ borderLeft: '3px solid var(--purple)', padding: '0.55rem 0.75rem', minHeight: '58px', display: 'flex', alignItems: 'center' }}>
            <span style={{ width: '22px', height: '22px', borderRadius: '50%', background: 'var(--purple)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6rem', fontWeight: 700, flexShrink: 0 }}>3</span>
            <span className="dq-text" style={{ fontSize: '0.8rem' }}>
              "Do you have a {kw('design system')} or {kw('component library')}? How well does the code match it?"
            </span>
          </div>

          <div className="discovery-card" style={{ borderLeft: '3px solid var(--purple)', padding: '0.55rem 0.75rem', minHeight: '58px', display: 'flex', alignItems: 'center' }}>
            <span style={{ width: '22px', height: '22px', borderRadius: '50%', background: 'var(--purple)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6rem', fontWeight: 700, flexShrink: 0 }}>4</span>
            <span className="dq-text" style={{ fontSize: '0.8rem' }}>
              "What {kw('design tools')} does your team use? What {kw('frontend framework')} are you on?"
            </span>
          </div>

          <div className="discovery-card" style={{ borderLeft: '3px solid var(--purple)', padding: '0.55rem 0.75rem', minHeight: '58px', display: 'flex', alignItems: 'center' }}>
            <span style={{ width: '22px', height: '22px', borderRadius: '50%', background: 'var(--purple)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6rem', fontWeight: 700, flexShrink: 0 }}>5</span>
            <span className="dq-text" style={{ fontSize: '0.8rem' }}>
              "Do your designers {kw('push PRs')} today? Have they tried using AI to {kw('generate code')}?"
            </span>
          </div>
        </div>
      </div>

      {/* Center: Arrow connector */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.25rem',
        paddingTop: '2rem',
      }}>
        <div style={{
          width: '2px',
          flex: '1',
          background: 'linear-gradient(to bottom, transparent, rgba(220, 50, 47, 0.3), rgba(220, 50, 47, 0.3), transparent)',
        }} />
        <div style={{
          width: '44px',
          height: '44px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, rgba(220, 50, 47, 0.12), rgba(220, 50, 47, 0.06))',
          border: '2px solid rgba(220, 50, 47, 0.25)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.2rem',
          flexShrink: 0,
        }}>→</div>
        <div style={{
          fontSize: '0.55rem',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
          color: 'var(--red)',
          textAlign: 'center',
          lineHeight: 1.3,
          maxWidth: '55px',
        }}>surfaces these</div>
        <div style={{
          width: '2px',
          flex: '1',
          background: 'linear-gradient(to bottom, transparent, rgba(220, 50, 47, 0.3), rgba(220, 50, 47, 0.3), transparent)',
        }} />
      </div>

      {/* Right: Pain Points */}
      <div>
        <h3 style={{ color: 'var(--red)', marginBottom: '0.6rem', fontSize: '1rem' }}>Common Pain Points</h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div className="pain-item" style={{ padding: '0.55rem 0.75rem', minHeight: '58px', display: 'flex', alignItems: 'center' }}>
            <span className="pain-icon" style={{ fontSize: '1.1rem' }}>🔄</span>
            <span className="pain-text" style={{ fontSize: '0.8rem' }}>
              How does the {kw('design-to-code handoff', 'var(--red)')} work today?
            </span>
          </div>

          <div className="pain-item" style={{ padding: '0.55rem 0.75rem', minHeight: '58px', display: 'flex', alignItems: 'center' }}>
            <span className="pain-icon" style={{ fontSize: '1.1rem' }}>🎨</span>
            <span className="pain-text" style={{ fontSize: '0.8rem' }}>
              How much {kw('rework', 'var(--red)')} happens after handoff?
            </span>
          </div>

          <div className="pain-item" style={{ padding: '0.55rem 0.75rem', minHeight: '58px', display: 'flex', alignItems: 'center' }}>
            <span className="pain-icon" style={{ fontSize: '1.1rem' }}>⏳</span>
            <span className="pain-text" style={{ fontSize: '0.8rem' }}>
              Was the output {kw('design system compliant', 'var(--red)')}?
            </span>
          </div>

          <div className="pain-item" style={{ padding: '0.55rem 0.75rem', minHeight: '58px', display: 'flex', alignItems: 'center' }}>
            <span className="pain-icon" style={{ fontSize: '1.1rem' }}>📐</span>
            <span className="pain-text" style={{ fontSize: '0.8rem' }}>
              How many rounds of {kw('back-and-forth', 'var(--red)')} before a feature ships?
            </span>
          </div>

          <div className="pain-item" style={{ padding: '0.55rem 0.75rem', minHeight: '58px', display: 'flex', alignItems: 'center' }}>
            <span className="pain-icon" style={{ fontSize: '1.1rem' }}>🚀</span>
            <span className="pain-text" style={{ fontSize: '0.8rem' }}>
              Do your designers {kw('push PRs', 'var(--red)')} today?
            </span>
          </div>
        </div>
      </div>
    </div>

    {/* Bottom callout */}
    <div style={{
      marginTop: '0.75rem',
      display: 'flex',
      alignItems: 'center',
      gap: '0.6rem',
      padding: '0.6rem 0.85rem',
      background: 'linear-gradient(135deg, rgba(108, 113, 196, 0.08), rgba(108, 113, 196, 0.03))',
      border: '1px solid rgba(108, 113, 196, 0.2)',
      borderRadius: '8px',
    }}>
      <span style={{ fontSize: '1.1rem' }}>💡</span>
      <span style={{ fontSize: '0.8rem', color: 'var(--text-primary)', lineHeight: 1.5 }}>
        <strong style={{ color: 'var(--purple)' }}>Sound familiar?</strong> Every company with a design team hits these walls. The next slides show what's possible.
      </span>
    </div>
  </>
)

export default SlideDesignDeepDive
