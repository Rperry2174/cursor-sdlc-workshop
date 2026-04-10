const SlideReviewCursorHelps = () => (
  <>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
      <div className="phase-header" style={{ marginBottom: 0 }}>
        <div className="phase-number review">05</div>
        <h2 style={{ marginBottom: 0 }}>Review — BugBot + Cursor Review</h2>
      </div>
    </div>

    <div className="deepdive-cols">
      <div className="deepdive-col">
        <div className="solution-card" style={{
          borderColor: 'rgba(133, 153, 0, 0.2)',
          background: 'linear-gradient(135deg, rgba(133, 153, 0, 0.08), rgba(133, 153, 0, 0.02))',
        }}>
          <div className="solution-header">
            <span className="solution-icon">🤖</span>
            <span className="solution-title" style={{ color: 'var(--green)' }}>BugBot + AI-Assisted Review</span>
          </div>
          <div className="solution-steps">
            <div className="solution-step">
              <span className="step-num" style={{ background: 'var(--green)' }}>1</span>
              <span>BugBot automatically reviews every PR — catches bugs, security issues, and logic errors that humans miss during quick scans</span>
            </div>
            <div className="solution-step">
              <span className="step-num" style={{ background: 'var(--green)' }}>2</span>
              <span>Code tours walk reviewers through changes so they can review quickly and with confidence — no more deciphering raw diffs</span>
            </div>
            <div className="solution-step">
              <span className="step-num" style={{ background: 'var(--green)' }}>3</span>
              <span>Cloud Agents self-heal CI failures and iterate on reviewer feedback autonomously — reducing the manual back-and-forth loop</span>
            </div>
            <div className="solution-step">
              <span className="step-num" style={{ background: 'var(--green)' }}>4</span>
              <span>Stacked diffs break large changes into small, focused PRs — each reviewable in minutes, not hours</span>
            </div>
          </div>
        </div>

        <div className="competitor-row" style={{ marginTop: '0.75rem' }}>
          <span className="competitor-label">Surfaces</span>
          <div className="tool-pills" style={{ marginTop: 0 }}>
            <span className="tool-pill" style={{ background: 'rgba(133, 153, 0, 0.12)', color: 'var(--green)', borderColor: 'rgba(133, 153, 0, 0.25)' }}>Stacking CLI</span>
            <span className="tool-pill" style={{ background: 'rgba(133, 153, 0, 0.12)', color: 'var(--green)', borderColor: 'rgba(133, 153, 0, 0.25)' }}>BugBot</span>
            <span className="tool-pill" style={{ background: 'rgba(133, 153, 0, 0.12)', color: 'var(--green)', borderColor: 'rgba(133, 153, 0, 0.25)' }}>Code Tours</span>
            <span className="tool-pill" style={{ background: 'rgba(133, 153, 0, 0.12)', color: 'var(--green)', borderColor: 'rgba(133, 153, 0, 0.25)' }}>Merge Queue</span>
            <span className="tool-pill" style={{ background: 'rgba(133, 153, 0, 0.12)', color: 'var(--green)', borderColor: 'rgba(133, 153, 0, 0.25)' }}>PR Inbox</span>
          </div>
        </div>

        <div className="emphasis-box" style={{
          marginTop: '0.75rem',
          background: 'linear-gradient(135deg, rgba(133, 153, 0, 0.12), rgba(133, 153, 0, 0.04))',
          borderColor: 'rgba(133, 153, 0, 0.25)',
        }}>
          <strong style={{ color: 'var(--green)' }}>Key shift:</strong> Humans go from being the <em>bottleneck</em> in review to being the <em>final approver</em>. AI handles the grunt work.
        </div>
      </div>

      <div className="deepdive-col">
        <h3 style={{ color: 'var(--green)', fontSize: '1rem' }}>Business Impact</h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{
            background: 'var(--card-bg)',
            border: '1px solid var(--border-subtle)',
            borderLeft: '4px solid var(--green)',
            borderRadius: '10px',
            padding: '1rem 1.25rem',
          }}>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--green)', lineHeight: 1 }}>41h → hours</div>
            <div style={{ fontSize: '0.85rem', fontWeight: 600, marginTop: '0.35rem', color: 'var(--text-primary)' }}>Time-to-merge collapses</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.25rem', lineHeight: 1.4 }}>
              Industry avg is 41 hours to merge. Stacked diffs + AI review + merge queue shrink this dramatically.
            </div>
          </div>

          <div style={{
            background: 'var(--card-bg)',
            border: '1px solid var(--border-subtle)',
            borderLeft: '4px solid var(--green)',
            borderRadius: '10px',
            padding: '1rem 1.25rem',
          }}>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--green)', lineHeight: 1 }}>Seniors unblocked</div>
            <div style={{ fontSize: '0.85rem', fontWeight: 600, marginTop: '0.35rem', color: 'var(--text-primary)' }}>From review bottleneck to final approver</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.25rem', lineHeight: 1.4 }}>
              BugBot catches the mechanical issues. Senior engineers focus on architecture and logic — the things only humans can judge.
            </div>
          </div>

          <div style={{
            background: 'var(--card-bg)',
            border: '1px solid var(--border-subtle)',
            borderLeft: '4px solid var(--green)',
            borderRadius: '10px',
            padding: '1rem 1.25rem',
          }}>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--green)', lineHeight: 1 }}>Scale with AI</div>
            <div style={{ fontSize: '0.85rem', fontWeight: 600, marginTop: '0.35rem', color: 'var(--text-primary)' }}>Review keeps pace with agent-generated code</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.25rem', lineHeight: 1.4 }}>
              As Cloud Agents generate more PRs, the review process scales with them — not against them.
            </div>
          </div>
        </div>

        <div className="outcome-callout" style={{
          marginTop: '0.75rem',
          background: 'linear-gradient(135deg, rgba(133, 153, 0, 0.1), rgba(133, 153, 0, 0.03))',
          borderColor: 'rgba(133, 153, 0, 0.25)',
        }}>
          <div className="outcome-label" style={{ color: 'var(--green)' }}>Bottom Line</div>
          <div className="outcome-text">
            Cursor Review turns the review phase from the slowest queue in the pipeline into a fast, agent-powered quality gate.
            Humans approve, agents iterate.
          </div>
        </div>
      </div>
    </div>
  </>
)

export default SlideReviewCursorHelps
