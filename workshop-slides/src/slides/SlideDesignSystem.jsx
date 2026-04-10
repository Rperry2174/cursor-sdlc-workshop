const SlideDesignSystem = () => (
  <>
    <div className="phase-header">
      <div className="phase-number design">02</div>
      <h2>Context: A Designer's Typical Day</h2>
    </div>
    <p className="small" style={{ marginBottom: '0.75rem' }}>
      A day in the life of a designer building and maintaining a design system
    </p>

    <div className="deepdive-cols">
      <div className="deepdive-col">
        <div style={{
          borderRadius: '12px',
          overflow: 'hidden',
          border: '1px solid var(--border-subtle)',
          boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
        }}>
          <img
            src="/images/figma-design-system.png"
            alt="Figma design system with components, pages, and prototype connections"
            style={{
              width: '100%',
              display: 'block',
            }}
          />
        </div>
      </div>

      <div className="deepdive-col">
        <h3 style={{ color: 'var(--purple)', fontSize: '1rem' }}>A Designer's Typical Day</h3>
        <div className="pain-list">
          <div className="discovery-card">
            <span className="dq-icon" style={{ fontSize: '1.2rem' }}>☀️</span>
            <span className="dq-text" style={{ fontStyle: 'normal' }}>
              <strong>Morning:</strong> Review new feature requests against existing component library. Audit which components can be reused vs. need new designs.
            </span>
          </div>
          <div className="discovery-card">
            <span className="dq-icon" style={{ fontSize: '1.2rem' }}>🎨</span>
            <span className="dq-text" style={{ fontStyle: 'normal' }}>
              <strong>Midday:</strong> Design new components in Figma using established tokens - colors, spacing, typography. Ensure consistency with the system.
            </span>
          </div>
          <div className="discovery-card">
            <span className="dq-icon" style={{ fontSize: '1.2rem' }}>🔍</span>
            <span className="dq-text" style={{ fontStyle: 'normal' }}>
              <strong>Afternoon:</strong> Review engineer's implementation against the mockup. Flag pixel differences, wrong spacing values, missing hover states.
            </span>
          </div>
          <div className="discovery-card">
            <span className="dq-icon" style={{ fontSize: '1.2rem' }}>🔄</span>
            <span className="dq-text" style={{ fontStyle: 'normal' }}>
              <strong>Repeat:</strong> Back-and-forth continues over days. Screenshots exchanged. "Can you move this 4px left?" "The border radius is wrong." The cycle grinds on.
            </span>
          </div>
        </div>

        <div className="emphasis-box purple" style={{ marginTop: '0.75rem' }}>
          <strong style={{ color: 'var(--purple)' }}>The gap:</strong> Designers maintain a pixel-perfect source of truth, but the handoff to code is where fidelity breaks down.
        </div>
      </div>
    </div>
  </>
)

export default SlideDesignSystem
