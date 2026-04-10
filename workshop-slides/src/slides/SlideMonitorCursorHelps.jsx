const SlideMonitorCursorHelps = () => (
  <>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
      <div className="phase-header" style={{ marginBottom: 0 }}>
        <div className="phase-number" style={{ background: 'var(--yellow)' }}>07</div>
        <h2 style={{ marginBottom: 0 }}>Solution: Cursor Closes the SDLC Loop</h2>
      </div>
    </div>

    <div className="deepdive-cols">
      <div className="deepdive-col">
        <div className="solution-card" style={{
          borderColor: 'rgba(181, 137, 0, 0.2)',
          background: 'linear-gradient(135deg, rgba(181, 137, 0, 0.08), rgba(181, 137, 0, 0.02))',
        }}>
          <div className="solution-header">
            <span className="solution-icon">🔔</span>
            <span className="solution-title" style={{ color: 'var(--yellow)' }}>Observe → Understand → Fix via MCPs</span>
          </div>
          <div className="solution-steps">
            <div className="solution-step">
              <span className="step-num" style={{ background: 'var(--yellow)' }}>1</span>
              <span>Datadog, Sentry, or PagerDuty MCP surfaces the alert directly in Cursor - logs, traces, and metrics in context</span>
            </div>
            <div className="solution-step">
              <span className="step-num" style={{ background: 'var(--yellow)' }}>2</span>
              <span>Cursor correlates the production data with the codebase - pinpoints the root cause, not just the symptom</span>
            </div>
            <div className="solution-step">
              <span className="step-num" style={{ background: 'var(--yellow)' }}>3</span>
              <span>Cloud Agents can pick up bug reports from Slack or Linear and autonomously investigate, write, and push a fix</span>
            </div>
            <div className="solution-step">
              <span className="step-num" style={{ background: 'var(--yellow)' }}>4</span>
              <span>BugBot reviews the fix, CI runs, and the PR is ready for a human to approve - the whole loop closes automatically</span>
            </div>
          </div>
        </div>

        <div className="competitor-row" style={{ marginTop: '0.75rem' }}>
          <span className="competitor-label">MCPs</span>
          <div className="tool-pills" style={{ marginTop: 0 }}>
            <span className="tool-pill" style={{ background: 'rgba(181, 137, 0, 0.12)', color: 'var(--yellow)', borderColor: 'rgba(181, 137, 0, 0.25)' }}>Datadog MCP</span>
            <span className="tool-pill" style={{ background: 'rgba(181, 137, 0, 0.12)', color: 'var(--yellow)', borderColor: 'rgba(181, 137, 0, 0.25)' }}>Sentry MCP</span>
            <span className="tool-pill" style={{ background: 'rgba(181, 137, 0, 0.12)', color: 'var(--yellow)', borderColor: 'rgba(181, 137, 0, 0.25)' }}>PagerDuty MCP</span>
            <span className="tool-pill" style={{ background: 'rgba(181, 137, 0, 0.12)', color: 'var(--yellow)', borderColor: 'rgba(181, 137, 0, 0.25)' }}>Slack MCP</span>
          </div>
        </div>

        <div className="emphasis-box" style={{
          marginTop: '0.75rem',
          background: 'linear-gradient(135deg, rgba(181, 137, 0, 0.12), rgba(181, 137, 0, 0.04))',
          borderColor: 'rgba(181, 137, 0, 0.25)',
        }}>
          <strong style={{ color: 'var(--yellow)' }}>Key shift:</strong> The SDLC becomes a <em>closed loop</em>. Production issues don't just get logged - they get fixed, automatically.
        </div>
      </div>

      <div className="deepdive-col">
        <h3 style={{ color: 'var(--yellow)', fontSize: '1rem' }}>Business Impact</h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{
            background: 'var(--card-bg)',
            border: '1px solid var(--border-subtle)',
            borderLeft: '4px solid var(--yellow)',
            borderRadius: '10px',
            padding: '1rem 1.25rem',
          }}>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--yellow)', lineHeight: 1 }}>MTTR → minutes</div>
            <div style={{ fontSize: '0.85rem', fontWeight: 600, marginTop: '0.35rem', color: 'var(--text-primary)' }}>Mean time to resolution collapses</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.25rem', lineHeight: 1.4 }}>
              From hours of manual investigation across 5 tools to an agent that reads the alert, finds the root cause, and pushes a fix
            </div>
          </div>

          <div style={{
            background: 'var(--card-bg)',
            border: '1px solid var(--border-subtle)',
            borderLeft: '4px solid var(--yellow)',
            borderRadius: '10px',
            padding: '1rem 1.25rem',
          }}>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--yellow)', lineHeight: 1 }}>On-call unblocked</div>
            <div style={{ fontSize: '0.85rem', fontWeight: 600, marginTop: '0.35rem', color: 'var(--text-primary)' }}>Any engineer can debug any system</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.25rem', lineHeight: 1.4 }}>
              Cursor understands the full codebase. You don't need the original author to fix the bug - anyone (or an agent) can.
            </div>
          </div>

          <div style={{
            background: 'var(--card-bg)',
            border: '1px solid var(--border-subtle)',
            borderLeft: '4px solid var(--yellow)',
            borderRadius: '10px',
            padding: '1rem 1.25rem',
          }}>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--yellow)', lineHeight: 1 }}>Closed loop</div>
            <div style={{ fontSize: '0.85rem', fontWeight: 600, marginTop: '0.35rem', color: 'var(--text-primary)' }}>Alert → Fix → Deploy, automatically</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.25rem', lineHeight: 1.4 }}>
              Bug reports in Slack become PRs. Production alerts become code fixes. The cycle completes without human bottlenecks.
            </div>
          </div>
        </div>

        <div className="outcome-callout" style={{
          marginTop: '0.75rem',
          background: 'linear-gradient(135deg, rgba(181, 137, 0, 0.1), rgba(181, 137, 0, 0.03))',
          borderColor: 'rgba(181, 137, 0, 0.25)',
        }}>
          <div className="outcome-label" style={{ color: 'var(--yellow)' }}>Bottom Line</div>
          <div className="outcome-text">
            Cursor closes the SDLC loop. Production issues don't just get triaged - they get fixed.
            The gap between "something is broken" and "it's deployed" shrinks to minutes.
          </div>
        </div>
      </div>
    </div>
  </>
)

export default SlideMonitorCursorHelps
