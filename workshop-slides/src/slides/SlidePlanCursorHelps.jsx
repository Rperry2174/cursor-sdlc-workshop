const SlidePlanCursorHelps = () => (
  <>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
      <div className="phase-header" style={{ marginBottom: 0 }}>
        <div className="phase-number plan">01</div>
        <h2 style={{ marginBottom: 0 }}>Solution: Cursor Turns PMs into Builders</h2>
      </div>
    </div>

    <div className="deepdive-cols">
      <div className="deepdive-col">
        <div className="solution-card" style={{
          borderColor: 'rgba(42, 161, 152, 0.2)',
          background: 'linear-gradient(135deg, rgba(42, 161, 152, 0.08), rgba(42, 161, 152, 0.02))',
        }}>
          <div className="solution-header">
            <span className="solution-icon">⚡</span>
            <span className="solution-title" style={{ color: 'var(--cyan)' }}>Planning via MCPs</span>
          </div>
          <div className="solution-steps">
            <div className="solution-step">
              <span className="step-num" style={{ background: 'var(--cyan)' }}>1</span>
              <span>PM writes requirements in Notion, Linear, or Jira - the tools they already use every day</span>
            </div>
            <div className="solution-step">
              <span className="step-num" style={{ background: 'var(--cyan)' }}>2</span>
              <span>Cursor reads the spec via MCP and understands the intent - no copy-pasting, no stale docs</span>
            </div>
            <div className="solution-step">
              <span className="step-num" style={{ background: 'var(--cyan)' }}>3</span>
              <span>The PM can prototype the feature themselves - building a working version of what they're imagining, not just describing it in words</span>
            </div>
            <div className="solution-step">
              <span className="step-num" style={{ background: 'var(--cyan)' }}>4</span>
              <span>Engineer receives a working prototype + spec instead of an ambiguous doc. Review and refine, not decode and build from scratch.</span>
            </div>
          </div>
        </div>

        <div className="emphasis-box" style={{
          marginTop: '0.75rem',
          background: 'linear-gradient(135deg, rgba(42, 161, 152, 0.12), rgba(42, 161, 152, 0.04))',
          borderColor: 'rgba(42, 161, 152, 0.25)',
        }}>
          <strong style={{ color: 'var(--cyan)' }}>Key shift:</strong> PMs go from <em>describing</em> what they want to <em>showing</em> what they want. The handoff becomes a prototype, not a prayer.
        </div>

        <div className="competitor-row" style={{ marginTop: '0.75rem' }}>
          <span className="competitor-label">MCPs</span>
          <div className="tool-pills" style={{ marginTop: 0 }}>
            <span className="tool-pill cyan">Notion MCP</span>
            <span className="tool-pill cyan">Linear MCP</span>
            <span className="tool-pill cyan">Jira MCP</span>
            <span className="tool-pill cyan">GitHub MCP</span>
          </div>
        </div>
      </div>

      <div className="deepdive-col">
        <h3 style={{ color: 'var(--cyan)', fontSize: '1rem' }}>Business Impact</h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{
            background: 'var(--card-bg)',
            border: '1px solid var(--border-subtle)',
            borderLeft: '4px solid var(--cyan)',
            borderRadius: '10px',
            padding: '1rem 1.25rem',
          }}>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--cyan)', lineHeight: 1 }}>Minutes</div>
            <div style={{ fontSize: '0.85rem', fontWeight: 600, marginTop: '0.35rem', color: 'var(--text-primary)' }}>Not weeks to a working prototype</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.25rem', lineHeight: 1.4 }}>
              PMs can prototype the feature themselves - what used to require an engineer sprint now takes an afternoon
            </div>
          </div>

          <div style={{
            background: 'var(--card-bg)',
            border: '1px solid var(--border-subtle)',
            borderLeft: '4px solid var(--cyan)',
            borderRadius: '10px',
            padding: '1rem 1.25rem',
          }}>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--cyan)', lineHeight: 1 }}>PMs unblocked</div>
            <div style={{ fontSize: '0.85rem', fontWeight: 600, marginTop: '0.35rem', color: 'var(--text-primary)' }}>From spec writers to prototype builders</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.25rem', lineHeight: 1.4 }}>
              No longer waiting for engineering capacity to validate an idea. PMs show, not tell.
            </div>
          </div>

          <div style={{
            background: 'var(--card-bg)',
            border: '1px solid var(--border-subtle)',
            borderLeft: '4px solid var(--cyan)',
            borderRadius: '10px',
            padding: '1rem 1.25rem',
          }}>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--cyan)', lineHeight: 1 }}>Engineers freed</div>
            <div style={{ fontSize: '0.85rem', fontWeight: 600, marginTop: '0.35rem', color: 'var(--text-primary)' }}>From deciphering vague specs to refining prototypes</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.25rem', lineHeight: 1.4 }}>
              Engineers receive a working prototype instead of an ambiguous document. Refine and ship, don't decode and guess.
            </div>
          </div>
        </div>

        <div className="outcome-callout" style={{
          marginTop: '0.75rem',
          background: 'linear-gradient(135deg, rgba(42, 161, 152, 0.1), rgba(42, 161, 152, 0.03))',
          borderColor: 'rgba(42, 161, 152, 0.25)',
        }}>
          <div className="outcome-label" style={{ color: 'var(--cyan)' }}>Bottom Line</div>
          <div className="outcome-text">
            Cursor + MCPs collapse the planning phase by turning PMs into builders.
            The handoff becomes a prototype, not a telephone game.
          </div>
        </div>
      </div>
    </div>
  </>
)

export default SlidePlanCursorHelps
