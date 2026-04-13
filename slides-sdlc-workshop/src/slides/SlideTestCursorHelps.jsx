const SlideTestCursorHelps = () => (
  <>
    <div className="phase-header">
      <div className="phase-number test">04</div>
      <h2>Solution: Cursor Writes Tests Alongside Code</h2>
    </div>

    <div className="deepdive-cols">
      <div className="deepdive-col">
        <div className="solution-card" style={{
          borderColor: 'rgba(203, 75, 22, 0.2)',
          background: 'linear-gradient(135deg, rgba(203, 75, 22, 0.08), rgba(203, 75, 22, 0.02))',
        }}>
          <div className="solution-header">
            <span className="solution-icon">🧪</span>
            <span className="solution-title" style={{ color: 'var(--orange)' }}>AI-Generated Tests + Inline Fixing</span>
          </div>
          <div className="solution-steps">
            <div className="solution-step">
              <span className="step-num" style={{ background: 'var(--orange)' }}>1</span>
              <span>Cursor generates meaningful tests alongside feature code - unit, integration, and edge-case tests based on actual implementation</span>
            </div>
            <div className="solution-step">
              <span className="step-num" style={{ background: 'var(--orange)' }}>2</span>
              <span>When tests fail, Cursor reads the failure output and fixes the code or the test - right in the IDE, no context-switching</span>
            </div>
            <div className="solution-step">
              <span className="step-num" style={{ background: 'var(--orange)' }}>3</span>
              <span>Background Agents can be tasked with improving test coverage across an entire module while you work on other things</span>
            </div>
            <div className="solution-step">
              <span className="step-num" style={{ background: 'var(--orange)' }}>4</span>
              <span>Tests run automatically in the loop - Cursor writes, runs, reads failures, and fixes until the suite passes</span>
            </div>
          </div>
        </div>

        <div className="emphasis-box" style={{
          marginTop: '0.75rem',
          background: 'linear-gradient(135deg, rgba(203, 75, 22, 0.1), rgba(203, 75, 22, 0.03))',
          borderColor: 'rgba(203, 75, 22, 0.25)',
        }}>
          <strong style={{ color: 'var(--orange)' }}>Key shift:</strong> Testing stops being a chore engineers skip under pressure - it becomes an automatic part of building every feature.
        </div>
      </div>

      <div className="deepdive-col">
        <h3 style={{ color: 'var(--orange)', fontSize: '1rem' }}>Business Impact</h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{
            background: 'var(--card-bg)',
            border: '1px solid var(--border-subtle)',
            borderLeft: '4px solid var(--orange)',
            borderRadius: '10px',
            padding: '1rem 1.25rem',
          }}>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--orange)', lineHeight: 1 }}>2 -3x</div>
            <div style={{ fontSize: '0.85rem', fontWeight: 600, marginTop: '0.35rem', color: 'var(--text-primary)' }}>Higher test coverage</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.25rem', lineHeight: 1.4 }}>
              From 20 -40% to 70 -90% - without adding headcount or slowing velocity
            </div>
          </div>

          <div style={{
            background: 'var(--card-bg)',
            border: '1px solid var(--border-subtle)',
            borderLeft: '4px solid var(--orange)',
            borderRadius: '10px',
            padding: '1rem 1.25rem',
          }}>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--orange)', lineHeight: 1 }}>Zero</div>
            <div style={{ fontSize: '0.85rem', fontWeight: 600, marginTop: '0.35rem', color: 'var(--text-primary)' }}>Excuses to skip tests</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.25rem', lineHeight: 1.4 }}>
              When AI writes the tests, "we didn't have time" stops being a valid excuse
            </div>
          </div>

          <div style={{
            background: 'var(--card-bg)',
            border: '1px solid var(--border-subtle)',
            borderLeft: '4px solid var(--orange)',
            borderRadius: '10px',
            padding: '1rem 1.25rem',
          }}>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--orange)', lineHeight: 1 }}>Fewer</div>
            <div style={{ fontSize: '0.85rem', fontWeight: 600, marginTop: '0.35rem', color: 'var(--text-primary)' }}>Production incidents</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.25rem', lineHeight: 1.4 }}>
              Bugs caught before they ship - not after they page your on-call at 2 AM
            </div>
          </div>
        </div>

        <div className="outcome-callout" style={{
          marginTop: '0.75rem',
          background: 'linear-gradient(135deg, rgba(203, 75, 22, 0.1), rgba(203, 75, 22, 0.03))',
          borderColor: 'rgba(203, 75, 22, 0.25)',
        }}>
          <div className="outcome-label" style={{ color: 'var(--orange)' }}>Bottom Line</div>
          <div className="outcome-text">
            Back to the factory: Cursor is like upgrading from manual spot-checks to <strong style={{ color: 'var(--orange)' }}>automated quality-control scanners on every inch of the line</strong> - faster, more thorough, and every batch gets inspected.
          </div>
        </div>
      </div>
    </div>
  </>
)

export default SlideTestCursorHelps
