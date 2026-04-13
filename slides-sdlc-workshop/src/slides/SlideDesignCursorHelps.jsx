const SlideDesignCursorHelps = () => (
  <>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
      <div className="phase-header" style={{ marginBottom: 0 }}>
        <div className="phase-number design">02</div>
        <h2 style={{ marginBottom: 0 }}>Solution: Cursor Turns Designers into Builders</h2>
      </div>
      <img
        src="/images/figma-design-system.png"
        alt="Figma design system"
        style={{
          width: '140px',
          borderRadius: '8px',
          border: '1px solid var(--border-subtle)',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          flexShrink: 0,
        }}
      />
    </div>

    <div className="deepdive-cols">
      <div className="deepdive-col">
        <div className="solution-card" style={{
          borderColor: 'rgba(108, 113, 196, 0.2)',
          background: 'linear-gradient(135deg, rgba(108, 113, 196, 0.08), rgba(108, 113, 196, 0.02))',
        }}>
          <div className="solution-header">
            <span className="solution-icon">🖼️</span>
            <span className="solution-title" style={{ color: 'var(--purple)' }}>Design-to-Code via MCPs</span>
          </div>
          <div className="solution-steps">
            <div className="solution-step">
              <span className="step-num" style={{ background: 'var(--purple)' }}>1</span>
              <span>Designer finalises the mockup in Figma - pixel-perfect, exactly as they envision it</span>
            </div>
            <div className="solution-step">
              <span className="step-num" style={{ background: 'var(--purple)' }}>2</span>
              <span>Cursor uses Figma MCP to read the design and translate it into code that matches the actual codebase's components, tokens, and patterns</span>
            </div>
            <div className="solution-step">
              <span className="step-num" style={{ background: 'var(--purple)' }}>3</span>
              <span>The result is a working implementation - not a throwaway prototype - using real components from the design system</span>
            </div>
            <div className="solution-step">
              <span className="step-num" style={{ background: 'var(--purple)' }}>4</span>
              <span>Engineer reviews and accepts instead of building from scratch. Designer's intent is preserved end-to-end.</span>
            </div>
          </div>
        </div>

        <div className="emphasis-box purple" style={{ marginTop: '0.75rem' }}>
          <strong style={{ color: 'var(--purple)' }}>Key shift:</strong> The designer's Figma file <em>becomes</em> the spec the AI reads - no handoff document, no miscommunication.
        </div>
      </div>

      <div className="deepdive-col">
        <h3 style={{ color: 'var(--purple)', fontSize: '1rem' }}>Business Impact</h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{
            background: 'var(--card-bg)',
            border: '1px solid var(--border-subtle)',
            borderLeft: '4px solid var(--purple)',
            borderRadius: '10px',
            padding: '1rem 1.25rem',
          }}>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--purple)', lineHeight: 1 }}>5 -10x</div>
            <div style={{ fontSize: '0.85rem', fontWeight: 600, marginTop: '0.35rem', color: 'var(--text-primary)' }}>Fewer revision cycles</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.25rem', lineHeight: 1.4 }}>
              From 5 -10 rounds of "that's not right" down to review-and-accept
            </div>
          </div>

          <div style={{
            background: 'var(--card-bg)',
            border: '1px solid var(--border-subtle)',
            borderLeft: '4px solid var(--purple)',
            borderRadius: '10px',
            padding: '1rem 1.25rem',
          }}>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--purple)', lineHeight: 1 }}>Designers unblocked</div>
            <div style={{ fontSize: '0.85rem', fontWeight: 600, marginTop: '0.35rem', color: 'var(--text-primary)' }}>No longer dependent on engineering</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.25rem', lineHeight: 1.4 }}>
              Designers go from waiting weeks for an engineer to implement their vision to shipping it themselves with Cursor. The bottleneck disappears.
            </div>
          </div>

          <div style={{
            background: 'var(--card-bg)',
            border: '1px solid var(--border-subtle)',
            borderLeft: '4px solid var(--purple)',
            borderRadius: '10px',
            padding: '1rem 1.25rem',
          }}>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--purple)', lineHeight: 1 }}>Engineers freed</div>
            <div style={{ fontSize: '0.85rem', fontWeight: 600, marginTop: '0.35rem', color: 'var(--text-primary)' }}>From months of implementation to approving a PR</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.25rem', lineHeight: 1.4 }}>
              What used to take an engineer months of pixel-pushing becomes a quick code review. They stay focused on architecture and logic instead.
            </div>
          </div>
        </div>

        <div className="outcome-callout" style={{
          marginTop: '0.75rem',
          background: 'linear-gradient(135deg, rgba(108, 113, 196, 0.1), rgba(108, 113, 196, 0.03))',
          borderColor: 'rgba(108, 113, 196, 0.25)',
        }}>
          <div className="outcome-label" style={{ color: 'var(--purple)' }}>Bottom Line</div>
          <div className="outcome-text">
            Cursor turns designers into builders and engineers into reviewers.
            The slow human telephone game is replaced by a tight AI feedback loop - both teams ship faster.
          </div>
        </div>
      </div>
    </div>
  </>
)

export default SlideDesignCursorHelps
