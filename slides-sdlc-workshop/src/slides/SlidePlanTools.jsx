const cycleStepStyle = (color) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '0.6rem',
  padding: '0.55rem 0.85rem',
  background: 'var(--card-bg)',
  border: '1px solid var(--border-subtle)',
  borderLeft: `3px solid ${color}`,
  borderRadius: '8px',
  fontSize: '0.82rem',
  lineHeight: 1.4,
  color: 'var(--text-primary)',
})

const arrowStyle = {
  textAlign: 'center',
  fontSize: '1.1rem',
  color: 'var(--text-secondary)',
  opacity: 0.5,
  padding: '0.1rem 0',
}

const SlidePlanTools = () => (
  <>
    <div className="phase-header">
      <div className="phase-number plan">01</div>
      <h2>Real World: A PM Built This Entire App</h2>
    </div>

    <div className="deepdive-cols">
      <div className="deepdive-col">
        <h3 style={{ color: 'var(--cyan)', fontSize: '1rem', marginBottom: '0.35rem' }}>The Planning Cycle</h3>
        <p className="small" style={{ marginBottom: '0.5rem' }}>
          Multiple stakeholders, multiple tools, multiple handoffs
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
          <div style={cycleStepStyle('var(--cyan)')}>
            <span style={{ fontSize: '1rem' }}>💼</span>
            <div>
              <strong style={{ color: 'var(--cyan)' }}>PM / Stakeholder</strong> describes the feature
              <div className="tool-pills" style={{ marginTop: '0.2rem', justifyContent: 'flex-start' }}>
                <span className="tool-pill cyan">Notion</span>
                <span className="tool-pill cyan">Confluence</span>
                <span className="tool-pill cyan">Google Docs</span>
              </div>
            </div>
          </div>
          <div style={arrowStyle}>↓</div>

          <div style={cycleStepStyle('var(--cursor-blue)')}>
            <span style={{ fontSize: '1rem' }}>📝</span>
            <div>
              <strong style={{ color: 'var(--cursor-blue)' }}>Spec / PRD</strong> gets written and reviewed
              <div className="tool-pills" style={{ marginTop: '0.2rem', justifyContent: 'flex-start' }}>
                <span className="tool-pill blue">Jira</span>
                <span className="tool-pill blue">Linear</span>
                <span className="tool-pill blue">GitHub Issues</span>
              </div>
            </div>
          </div>
          <div style={arrowStyle}>↓</div>

          <div style={cycleStepStyle('var(--orange)')}>
            <span style={{ fontSize: '1rem' }}>👩‍💻</span>
            <div>
              <strong style={{ color: 'var(--orange)' }}>Engineer</strong> reads spec and asks clarifying questions
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.15rem' }}>
                "What does this mean?" "What about edge case X?" "Is this in scope?"
              </div>
            </div>
          </div>
          <div style={arrowStyle}>↓</div>

          <div style={cycleStepStyle('var(--purple)')}>
            <span style={{ fontSize: '1rem' }}>🔍</span>
            <div>
              <strong style={{ color: 'var(--purple)' }}>Clarification</strong> goes back to PM
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.15rem' }}>
                Spec updated, new questions arise, more meetings scheduled
              </div>
            </div>
          </div>

          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: '0.5rem', padding: '0.4rem 0.75rem', marginTop: '0.35rem',
            background: 'linear-gradient(135deg, rgba(220, 50, 47, 0.08), rgba(220, 50, 47, 0.03))',
            border: '1px dashed rgba(220, 50, 47, 0.3)', borderRadius: '8px',
          }}>
            <span style={{ fontSize: '1.1rem' }}>🔄</span>
            <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--red)' }}>
              Repeat for days or weeks before code starts
            </span>
            <span style={{ fontSize: '1.1rem' }}>↩️</span>
          </div>
        </div>
      </div>

      <div className="deepdive-col">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
          <h3 style={{ color: 'var(--cyan)', fontSize: '1rem', marginBottom: 0 }}>PM Builds the Prototype</h3>
          <a
            href="https://baby-glass.anyweb.dev/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontSize: '0.65rem', fontWeight: 600, color: 'var(--cyan)',
              textDecoration: 'none', padding: '0.2rem 0.5rem',
              background: 'rgba(42, 161, 152, 0.1)', borderRadius: '100px',
              border: '1px solid rgba(42, 161, 152, 0.2)',
            }}
          >
            baby-glass.anyweb.dev ↗
          </a>
        </div>

        <div style={{
          borderRadius: '10px',
          overflow: 'hidden',
          border: '1px solid var(--border-subtle)',
          boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
          background: '#000',
        }}>
          <video
            src="/videos/baby-glass-demo.mov"
            controls
            style={{ width: '100%', display: 'block' }}
            onLoadedMetadata={(e) => { e.target.playbackRate = 1.25 }}
          />
        </div>
        <p className="small" style={{ marginTop: '0.4rem', textAlign: 'center', fontStyle: 'italic' }}>
          A PM built this entire app - no engineer needed. Just Cursor + an idea.
        </p>
      </div>
    </div>
  </>
)

export default SlidePlanTools
