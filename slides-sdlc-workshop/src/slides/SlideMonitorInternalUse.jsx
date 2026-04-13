const SlideMonitorInternalUse = () => (
  <>
    <div className="phase-header">
      <div className="phase-number" style={{ background: 'var(--yellow)' }}>07</div>
      <h2>Real World: How We Use This at Cursor</h2>
    </div>
    <p className="small" style={{ marginBottom: '0.75rem' }}>
      Two real workflows from the Cursor team - from alert to fix without leaving the flow
    </p>

    <div className="deepdive-cols" style={{ gap: '1.5rem' }}>
      {/* Left: Datadog MCP */}
      <div className="deepdive-col">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <h3 style={{ color: 'var(--yellow)', fontSize: '1rem', marginBottom: 0 }}>Datadog MCP → Investigate → Fix</h3>
        </div>

        <div style={{
          borderRadius: '10px',
          overflow: 'hidden',
          border: '1px solid var(--border-subtle)',
          boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
        }}>
          <img
            src="/images/monitor-datadog-mcp.png"
            alt="Using Datadog MCP in Cursor to investigate auth issues"
            style={{ width: '100%', display: 'block' }}
          />
        </div>

        <div style={{
          marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.35rem',
        }}>
          <div style={{
            display: 'flex', alignItems: 'flex-start', gap: '0.5rem',
            fontSize: '0.8rem', color: 'var(--text-primary)', lineHeight: 1.4,
          }}>
            <span style={{
              width: '20px', height: '20px', borderRadius: '50%',
              background: 'var(--yellow)', color: 'white',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.6rem', fontWeight: 700, flexShrink: 0, marginTop: '0.1rem',
            }}>1</span>
            <span>Ask Cursor to query Datadog via MCP - investigate logs, metrics, traces without leaving the IDE</span>
          </div>
          <div style={{
            display: 'flex', alignItems: 'flex-start', gap: '0.5rem',
            fontSize: '0.8rem', color: 'var(--text-primary)', lineHeight: 1.4,
          }}>
            <span style={{
              width: '20px', height: '20px', borderRadius: '50%',
              background: 'var(--yellow)', color: 'white',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.6rem', fontWeight: 700, flexShrink: 0, marginTop: '0.1rem',
            }}>2</span>
            <span>Cursor correlates the observability data with the codebase and generates the fix</span>
          </div>
        </div>
      </div>

      {/* Right: Slack Cloud Agents */}
      <div className="deepdive-col">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <h3 style={{ color: 'var(--yellow)', fontSize: '1rem', marginBottom: 0 }}>Slack Bug Report → Auto-Fix PR</h3>
        </div>

        <div style={{
          borderRadius: '10px',
          overflow: 'hidden',
          border: '1px solid var(--border-subtle)',
          boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
        }}>
          <img
            src="/images/monitor-slack-bugfix.png"
            alt="Slack bug report automatically fixed by Cursor Cloud Agent"
            style={{ width: '100%', display: 'block' }}
          />
        </div>

        <div style={{
          marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.35rem',
        }}>
          <div style={{
            display: 'flex', alignItems: 'flex-start', gap: '0.5rem',
            fontSize: '0.8rem', color: 'var(--text-primary)', lineHeight: 1.4,
          }}>
            <span style={{
              width: '20px', height: '20px', borderRadius: '50%',
              background: 'var(--yellow)', color: 'white',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.6rem', fontWeight: 700, flexShrink: 0, marginTop: '0.1rem',
            }}>1</span>
            <span>Bug reported in Slack → Linear auto-creates a triage ticket</span>
          </div>
          <div style={{
            display: 'flex', alignItems: 'flex-start', gap: '0.5rem',
            fontSize: '0.8rem', color: 'var(--text-primary)', lineHeight: 1.4,
          }}>
            <span style={{
              width: '20px', height: '20px', borderRadius: '50%',
              background: 'var(--yellow)', color: 'white',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.6rem', fontWeight: 700, flexShrink: 0, marginTop: '0.1rem',
            }}>2</span>
            <span>Cloud Agent picks it up, identifies the bug, and pushes a fix - all within minutes</span>
          </div>
        </div>
      </div>
    </div>

    <div style={{
      marginTop: '0.75rem',
      padding: '0.6rem 1rem',
      background: 'linear-gradient(135deg, rgba(181, 137, 0, 0.1), rgba(181, 137, 0, 0.03))',
      border: '2px solid rgba(181, 137, 0, 0.25)',
      borderRadius: '10px',
      textAlign: 'center',
    }}>
      <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--yellow)' }}>
        From "something is broken" to "fix is pushed" - without an engineer manually investigating
      </div>
    </div>
  </>
)

export default SlideMonitorInternalUse
