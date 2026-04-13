const phases = [
  { num: '01', name: 'Plan', tools: ['Jira', 'Linear', 'GitHub Issues', 'Notion', 'Confluence'] },
  { num: '02', name: 'Design', tools: ['Figma', 'Adobe XD', 'Sketch', 'Storybook'] },
  {
    num: '03', name: 'Develop',
    subcategories: [
      { label: 'Source Code', tools: ['GitHub', 'GitLab'] },
      { label: 'IDE', tools: ['Cursor', 'VS Code', 'Windsurf'] },
      { label: 'Terminal', tools: ['Claude Code', 'Cursor CLI', 'Vim'] },
    ],
  },
  { num: '04', name: 'Test', tools: ['GitHub Actions', 'Jenkins', 'CircleCI', 'Selenium'] },
  { num: '05', name: 'Review', tools: ['GitHub PRs', 'CodeRabbit', 'Bugbot'] },
  { num: '06', name: 'Deploy', tools: ['AWS', 'Docker', 'Kubernetes', 'Terraform', 'Vercel'] },
]

const monitor = { num: '07', name: 'Monitor', tools: ['Datadog', 'New Relic', 'Dynatrace', 'Grafana'] }

const highlightColors = {
  Plan:    'var(--cyan)',
  Design:  'var(--purple)',
  Develop: 'var(--cursor-blue)',
  Test:    'var(--orange)',
  Review:  'var(--green)',
  Deploy:  'var(--red)',
  Monitor: 'var(--yellow)',
}

const SdlcHighlight = ({ highlight }) => {
  const color = highlightColors[highlight] || 'var(--cursor-blue)'
  const isMonitor = highlight === 'Monitor'

  return (
    <>
      <h2>The Software Development Lifecycle</h2>
      <div className="sdlc-flow">
        {phases.map((phase, i) => {
          const isActive = phase.name === highlight
          const dimmed = !isActive && !isMonitor

          return (
            <span key={phase.num} style={{ display: 'contents' }}>
              <div
                className="sdlc-item"
                style={{
                  opacity: dimmed ? 0.35 : isMonitor ? 0.35 : 1,
                  border: isActive ? `2px solid ${color}` : undefined,
                  boxShadow: isActive ? `0 4px 20px ${color}22` : undefined,
                  transform: isActive ? 'scale(1.04)' : undefined,
                  transition: 'all 0.3s',
                }}
              >
                <div className="sdlc-icon" style={isActive ? { color, opacity: 1 } : undefined}>
                  {phase.num}
                </div>
                <div className="sdlc-name" style={isActive ? { color } : undefined}>
                  {phase.name}
                </div>
                {phase.subcategories ? (
                  phase.subcategories.map((sub) => (
                    <span key={sub.label}>
                      <div className="tool-subcategory">{sub.label}</div>
                      <div className="tool-pills">
                        {sub.tools.map((t) => (
                          <span key={t} className="tool-pill">{t}</span>
                        ))}
                      </div>
                    </span>
                  ))
                ) : (
                  <div className="tool-pills">
                    {phase.tools.map((t) => (
                      <span key={t} className="tool-pill">{t}</span>
                    ))}
                  </div>
                )}
              </div>
              {i < phases.length - 1 && (
                <div className="sdlc-arrow" style={{ opacity: dimmed ? 0.25 : isMonitor ? 0.25 : 0.6 }}>→</div>
              )}
            </span>
          )
        })}
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem', paddingRight: '1rem' }}>
        <div
          className="sdlc-item"
          style={isMonitor ? {
            opacity: 1,
            border: `2px solid ${color}`,
            boxShadow: `0 4px 20px ${color}22`,
            transform: 'scale(1.04)',
            borderStyle: 'solid',
          } : {
            opacity: 0.25,
            borderStyle: 'dashed',
          }}
        >
          <div className="sdlc-icon" style={isMonitor ? { color, opacity: 1 } : undefined}>{monitor.num}</div>
          <div className="sdlc-name" style={isMonitor ? { color } : undefined}>{monitor.name}</div>
          <div className="tool-pills">
            {monitor.tools.map((t) => (
              <span key={t} className="tool-pill">{t}</span>
            ))}
          </div>
        </div>
      </div>

      <p style={{
        textAlign: 'center',
        color: 'var(--text-secondary)',
        marginTop: '0.75rem',
        fontSize: '1.1rem',
      }}>
        Up next: <strong style={{ color }}>{highlight}</strong>
      </p>
    </>
  )
}

export const SdlcHighlightPlan    = () => <SdlcHighlight highlight="Plan" />
export const SdlcHighlightDesign  = () => <SdlcHighlight highlight="Design" />
export const SdlcHighlightDevelop = () => <SdlcHighlight highlight="Develop" />
export const SdlcHighlightTest    = () => <SdlcHighlight highlight="Test" />
export const SdlcHighlightReview  = () => <SdlcHighlight highlight="Review" />
export const SdlcHighlightDeploy  = () => <SdlcHighlight highlight="Deploy" />
export const SdlcHighlightMonitor = () => <SdlcHighlight highlight="Monitor" />
