const stepStyle = (color) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  padding: '0.5rem 0.75rem',
  background: 'var(--card-bg)',
  border: '1px solid var(--border-subtle)',
  borderLeft: `3px solid ${color}`,
  borderRadius: '6px',
  fontSize: '0.78rem',
  lineHeight: 1.4,
  color: 'var(--text-primary)',
})

const highlightStepStyle = (color) => ({
  ...stepStyle(color),
  border: '2px solid var(--red)',
  boxShadow: '0 0 0 3px rgba(220, 50, 47, 0.1)',
  borderLeft: `4px solid var(--red)`,
  fontWeight: 600,
})

const arrowDown = { textAlign: 'center', fontSize: '1rem', color: 'var(--text-secondary)', opacity: 0.4, padding: '0.1rem 0' }

const colHeader = (icon, title, color, subtitle) => (
  <div style={{ marginBottom: '0.5rem' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
      <span style={{ fontSize: '1.1rem' }}>{icon}</span>
      <h3 style={{ color, fontSize: '1rem', marginBottom: 0 }}>{title}</h3>
    </div>
    <p className="small" style={{ fontSize: '0.7rem', marginTop: '0.15rem', marginBottom: 0 }}>{subtitle}</p>
  </div>
)

const SlideReviewWorkflow = () => (
  <>
    <div className="phase-header">
      <div className="phase-number review">05</div>
      <h2>Evolution: GitHub to Graphite to Cursor Review</h2>
    </div>
    <p className="small" style={{ marginBottom: '0.75rem' }}>
      How the review workflow evolves from serial and manual to parallel and agent-driven
    </p>

    <div style={{
      display: 'grid',
      gridTemplateColumns: '1fr 1fr 1fr',
      gap: '1.25rem',
      alignItems: 'start',
    }}>
      {/* Column 1: GitHub Today */}
      <div>
        {colHeader('🐙', 'GitHub Today', 'var(--text-secondary)', 'Serial - one PR at a time')}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          <div style={stepStyle('var(--text-secondary)')}>Engineer writes code &amp; opens PR</div>
          <div style={arrowDown}>↓</div>
          <div style={highlightStepStyle('var(--red)')}>⏳ Waits for reviewer (hours/days)</div>
          <div style={arrowDown}>↓</div>
          <div style={stepStyle('var(--text-secondary)')}>Manual back-and-forth on feedback</div>
          <div style={arrowDown}>↓</div>
          <div style={stepStyle('var(--text-secondary)')}>Approve → merge → hope main is green</div>
        </div>
        <div style={{
          marginTop: '0.5rem', padding: '0.4rem 0.65rem',
          background: 'rgba(220, 50, 47, 0.06)', border: '1px dashed rgba(220, 50, 47, 0.2)',
          borderRadius: '6px', fontSize: '0.7rem', color: 'var(--red)', fontWeight: 600, textAlign: 'center',
        }}>Avg 41 hours to merge</div>
      </div>

      {/* Column 2: Graphite */}
      <div>
        {colHeader('💎', 'Graphite', 'var(--cyan)', 'Parallel - stacked PRs + AI review')}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          <div style={stepStyle('var(--cyan)')}>Stacked diffs → small, focused PRs</div>
          <div style={arrowDown}>↓</div>
          <div style={highlightStepStyle('var(--green)')}>🤖 AI takes first review pass</div>
          <div style={arrowDown}>↓</div>
          <div style={stepStyle('var(--cyan)')}>Reviewer reviews smaller diffs faster</div>
          <div style={arrowDown}>↓</div>
          <div style={stepStyle('var(--cyan)')}>Merge queue keeps main green</div>
        </div>
        <div style={{
          marginTop: '0.5rem', padding: '0.4rem 0.65rem',
          background: 'rgba(42, 161, 152, 0.08)', border: '1px solid rgba(42, 161, 152, 0.2)',
          borderRadius: '6px', fontSize: '0.7rem', color: 'var(--cyan)', fontWeight: 600, textAlign: 'center',
        }}>Smaller PRs → faster, deeper reviews</div>
      </div>

      {/* Column 3: Cursor Review */}
      <div>
        {colHeader('⚡', 'Cursor Review', 'var(--green)', 'Massively parallel - agents create & iterate')}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          <div style={stepStyle('var(--green)')}>Agent creates PR from ticket or Slack</div>
          <div style={arrowDown}>↓</div>
          <div style={highlightStepStyle('var(--green)')}>🤖 BugBot reviews + agent self-heals CI</div>
          <div style={arrowDown}>↓</div>
          <div style={stepStyle('var(--green)')}>Human reviews with code tours</div>
          <div style={arrowDown}>↓</div>
          <div style={stepStyle('var(--green)')}>Merge queue → ship</div>
        </div>
        <div style={{
          marginTop: '0.5rem', padding: '0.4rem 0.65rem',
          background: 'rgba(133, 153, 0, 0.08)', border: '1px solid rgba(133, 153, 0, 0.2)',
          borderRadius: '6px', fontSize: '0.7rem', color: 'var(--green)', fontWeight: 600, textAlign: 'center',
        }}>Humans review, agents do everything else</div>
      </div>
    </div>

    {/* Main takeaway */}
    <div style={{
      marginTop: '1rem',
      padding: '0.85rem 1.25rem',
      background: 'linear-gradient(135deg, rgba(133, 153, 0, 0.1), rgba(133, 153, 0, 0.03))',
      border: '2px solid rgba(133, 153, 0, 0.25)',
      borderRadius: '10px',
      textAlign: 'center',
    }}>
      <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--green)', marginBottom: '0.25rem' }}>
        Humans approve. Agents do everything else.
      </div>
      <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
        PRs get created, reviewed, tested, and iterated on by agents. Engineers become the final quality gate, not the bottleneck.
      </div>
    </div>
  </>
)

export default SlideReviewWorkflow
