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

const SlideDesignVideo = () => (
  <>
    <div className="phase-header">
      <div className="phase-number design">02</div>
      <h2>Real World: The Design-to-Code Cycle</h2>
    </div>

    <div className="deepdive-cols">
      <div className="deepdive-col">
        <h3 style={{ color: 'var(--purple)', fontSize: '1rem', marginBottom: '0.35rem' }}>The Design-to-Code Cycle</h3>
        <p className="small" style={{ marginBottom: '0.5rem' }}>
          Multiple people, multiple tools, multiple handoffs - round and round
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
          {/* Step 1: Designer */}
          <div style={cycleStepStyle('var(--purple)')}>
            <span style={{ fontSize: '1rem' }}>🎨</span>
            <div>
              <strong style={{ color: 'var(--purple)' }}>Designer</strong> creates mockups
              <div className="tool-pills" style={{ marginTop: '0.2rem', justifyContent: 'flex-start' }}>
                <span className="tool-pill purple">Figma</span>
                <span className="tool-pill purple">Sketch</span>
                <span className="tool-pill purple">Adobe XD</span>
              </div>
            </div>
          </div>
          <div style={arrowStyle}>↓</div>

          {/* Step 2: Engineer handoff */}
          <div style={cycleStepStyle('var(--cursor-blue)')}>
            <span style={{ fontSize: '1rem' }}>👩‍💻</span>
            <div>
              <strong style={{ color: 'var(--cursor-blue)' }}>Engineer</strong> picks up handoff &amp; implements
              <div className="tool-pills" style={{ marginTop: '0.2rem', justifyContent: 'flex-start' }}>
                <span className="tool-pill blue">GitHub</span>
                <span className="tool-pill blue">GitLab</span>
              </div>
            </div>
          </div>
          <div style={arrowStyle}>↓</div>

          {/* Step 3: Component docs */}
          <div style={cycleStepStyle('var(--cyan)')}>
            <span style={{ fontSize: '1rem' }}>📖</span>
            <div>
              <strong style={{ color: 'var(--cyan)' }}>Component docs</strong> reviewed &amp; updated
              <div className="tool-pills" style={{ marginTop: '0.2rem', justifyContent: 'flex-start' }}>
                <span className="tool-pill cyan">Storybook</span>
                <span className="tool-pill">Confluence</span>
                <span className="tool-pill">Notion</span>
              </div>
            </div>
          </div>
          <div style={arrowStyle}>↓</div>

          {/* Step 4: Feedback back to designer */}
          <div style={cycleStepStyle('var(--orange)')}>
            <span style={{ fontSize: '1rem' }}>🔍</span>
            <div>
              <strong style={{ color: 'var(--orange)' }}>Feedback</strong> goes back to the designer
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.15rem' }}>
                "The spacing is off." "Wrong border radius." "That's not the right hover state."
              </div>
            </div>
          </div>

          {/* Cycle arrow */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            padding: '0.4rem 0.75rem',
            marginTop: '0.35rem',
            background: 'linear-gradient(135deg, rgba(220, 50, 47, 0.08), rgba(220, 50, 47, 0.03))',
            border: '1px dashed rgba(220, 50, 47, 0.3)',
            borderRadius: '8px',
          }}>
            <span style={{ fontSize: '1.1rem' }}>🔄</span>
            <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--red)' }}>
              Repeat 5 -10 times - weeks or months per feature
            </span>
            <span style={{ fontSize: '1.1rem' }}>↩️</span>
          </div>
        </div>
      </div>

      <div className="deepdive-col">
        <h3 style={{ color: 'var(--purple)', fontSize: '1rem' }}>Customer Story</h3>

        <div style={{
          borderRadius: '10px',
          overflow: 'hidden',
          border: '1px solid var(--border-subtle)',
          boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
          background: '#000',
        }}>
          <video
            src="/videos/design-customer-story.mp4"
            controls
            style={{
              width: '100%',
              display: 'block',
            }}
            onLoadedMetadata={(e) => { e.target.playbackRate = 1.25 }}
          />
        </div>
        <p className="small" style={{ marginTop: '0.4rem', textAlign: 'center', fontStyle: 'italic' }}>
          Malt - Design-to-code with Cursor + Figma MCP
        </p>
      </div>
    </div>
  </>
)

export default SlideDesignVideo
