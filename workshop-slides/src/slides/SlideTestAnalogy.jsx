const timelineStep = (emoji, label, opts = {}) => {
  const { danger, investment, glow } = opts
  let bg = 'var(--card-bg)'
  let border = '1px solid var(--border-subtle)'
  let color = 'var(--text-primary)'
  let fontWeight = 500
  let extra = {}

  if (danger) {
    bg = 'linear-gradient(135deg, rgba(220, 50, 47, 0.15), rgba(220, 50, 47, 0.06))'
    border = '2px solid var(--red)'
    color = 'var(--red)'
    fontWeight = 700
    extra = { boxShadow: '0 0 12px rgba(220, 50, 47, 0.2)' }
  }
  if (investment) {
    bg = 'linear-gradient(135deg, rgba(133, 153, 0, 0.15), rgba(133, 153, 0, 0.06))'
    border = '2px solid var(--green)'
    color = 'var(--green)'
    fontWeight = 700
  }
  if (glow) {
    bg = 'linear-gradient(135deg, rgba(203, 75, 22, 0.12), rgba(203, 75, 22, 0.04))'
    border = '2px solid var(--orange)'
    color = 'var(--orange)'
    fontWeight = 700
    extra = { boxShadow: '0 0 12px rgba(203, 75, 22, 0.15)' }
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '0.3rem',
      padding: '0.5rem 0.6rem',
      background: bg,
      border,
      borderRadius: '10px',
      minWidth: '80px',
      maxWidth: '110px',
      flex: 1,
      textAlign: 'center',
      ...extra,
    }}>
      <span style={{ fontSize: '1.3rem' }}>{emoji}</span>
      <span style={{ fontSize: '0.65rem', fontWeight, color, lineHeight: 1.3 }}>{label}</span>
    </div>
  )
}

const arrow = (style = {}) => (
  <span style={{ fontSize: '1rem', color: 'var(--text-secondary)', opacity: 0.5, flexShrink: 0, ...style }}>→</span>
)

const investArrow = () => (
  <div style={{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 0,
    flexShrink: 0,
  }}>
    <span style={{ fontSize: '0.55rem', fontWeight: 700, color: 'var(--green)', letterSpacing: '0.5px' }}>$$$</span>
    <span style={{ fontSize: '1.1rem', color: 'var(--green)' }}>⟶</span>
  </div>
)

const SlideTestAnalogy = () => (
  <>
    <div className="phase-header">
      <div className="phase-number test">04</div>
      <h2>Context: Why Testing Gets Skipped</h2>
    </div>
    <p className="small" style={{ marginBottom: '0.5rem' }}>
      Two industries, same lesson: skip quality control, pay billions
    </p>

    {/* ── Food Manufacturing Timeline ── */}
    <div style={{
      background: 'linear-gradient(135deg, rgba(101, 123, 131, 0.04), rgba(101, 123, 131, 0.01))',
      border: '1px solid var(--border-subtle)',
      borderRadius: '12px',
      padding: '1rem 1.25rem',
      marginBottom: '0.6rem',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
        <span style={{
          fontSize: '0.6rem',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '1.5px',
          color: 'var(--text-secondary)',
        }}>Food Manufacturing</span>
        <span style={{
          fontSize: '0.55rem',
          padding: '0.1rem 0.4rem',
          borderRadius: '100px',
          background: 'rgba(101, 123, 131, 0.1)',
          color: 'var(--text-secondary)',
        }}>2010 - Wright County Egg Co.</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'nowrap' }}>
        {timelineStep('🌾', 'Source')}
        {arrow()}
        {timelineStep('🏭', 'Process')}
        {arrow()}
        {timelineStep('📦', 'Package')}
        {arrow()}
        {timelineStep('🚛', 'Ship')}
        {arrow()}
        {timelineStep('🦠', '550M eggs recalled - salmonella', { danger: true })}
        {investArrow()}
        {timelineStep('💰', '$100M+ losses, criminal charges', { investment: true })}
        {arrow()}
        {timelineStep('✅', 'Mandatory QC on every batch', { glow: true })}
      </div>
    </div>

    {/* ── Software SDLC Timeline ── */}
    <div style={{
      background: 'linear-gradient(135deg, rgba(203, 75, 22, 0.04), rgba(203, 75, 22, 0.01))',
      border: '1px solid rgba(203, 75, 22, 0.2)',
      borderRadius: '12px',
      padding: '1rem 1.25rem',
      marginBottom: '0.6rem',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
        <span style={{
          fontSize: '0.6rem',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '1.5px',
          color: 'var(--orange)',
        }}>Software (SDLC)</span>
        <span style={{
          fontSize: '0.55rem',
          padding: '0.1rem 0.4rem',
          borderRadius: '100px',
          background: 'rgba(203, 75, 22, 0.1)',
          color: 'var(--orange)',
        }}>2024 - CrowdStrike</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'nowrap' }}>
        {timelineStep('📋', 'Plan')}
        {arrow()}
        {timelineStep('🎨', 'Design')}
        {arrow()}
        {timelineStep('💻', 'Develop')}
        {arrow()}
        {timelineStep('🚀', 'Deploy')}
        {arrow()}
        {timelineStep('💥', '8.5M machines crashed worldwide', { danger: true })}
        {investArrow()}
        {timelineStep('💰', '$5.4B in damages', { investment: true })}
        {arrow()}
        {timelineStep('🧪', 'Massive investment in testing', { glow: true })}
      </div>
    </div>

    {/* ── Connecting insight ── */}
    <div style={{
      display: 'flex',
      gap: '1.25rem',
      alignItems: 'stretch',
    }}>
      <div style={{
        flex: 1,
        background: 'linear-gradient(135deg, rgba(203, 75, 22, 0.08), rgba(203, 75, 22, 0.02))',
        border: '1px solid rgba(203, 75, 22, 0.2)',
        borderRadius: '10px',
        padding: '0.75rem 1rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
      }}>
        <span style={{ fontSize: '1.5rem', flexShrink: 0 }}>🏭</span>
        <div>
          <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--orange)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.2rem' }}>
            The Pattern
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-primary)', lineHeight: 1.5 }}>
            Both industries learned the same lesson the hard way: <strong>the cost of testing is a rounding error compared to the cost of not testing.</strong>
          </div>
        </div>
      </div>

      <div style={{
        flex: 1,
        background: 'linear-gradient(135deg, rgba(203, 75, 22, 0.08), rgba(203, 75, 22, 0.02))',
        border: '1px solid rgba(203, 75, 22, 0.2)',
        borderRadius: '10px',
        padding: '0.75rem 1rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
      }}>
        <span style={{ fontSize: '1.5rem', flexShrink: 0 }}>❓</span>
        <div>
          <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--orange)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.2rem' }}>
            The Real Question
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-primary)', lineHeight: 1.5 }}>
            Food factories don't ask <em>"should we do QC?"</em> anymore. The question is: <strong>how do we check every batch without slowing down the line?</strong>
          </div>
        </div>
      </div>
    </div>
  </>
)

export default SlideTestAnalogy
