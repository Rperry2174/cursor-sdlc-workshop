const ToolPill = ({ children }) => (
  <span className="tool-pill">{children}</span>
)

const Slide04SdlcOverview = () => (
  <>
    <h2>The Software Development Lifecycle</h2>
    <div className="sdlc-flow">
      <div className="sdlc-item">
        <div className="sdlc-icon">01</div>
        <div className="sdlc-name">Plan</div>
        <div className="tool-pills">
          <ToolPill>Jira</ToolPill>
          <ToolPill>Linear</ToolPill>
          <ToolPill>GitHub Issues</ToolPill>
          <ToolPill>Notion</ToolPill>
          <ToolPill>Confluence</ToolPill>
        </div>
      </div>
      <div className="sdlc-arrow">→</div>
      <div className="sdlc-item">
        <div className="sdlc-icon">02</div>
        <div className="sdlc-name">Design</div>
        <div className="tool-pills">
          <ToolPill>Figma</ToolPill>
          <ToolPill>Adobe XD</ToolPill>
          <ToolPill>Sketch</ToolPill>
          <ToolPill>Storybook</ToolPill>
        </div>
      </div>
      <div className="sdlc-arrow">→</div>
      <div className="sdlc-item">
        <div className="sdlc-icon">03</div>
        <div className="sdlc-name">Develop</div>
        <div className="tool-subcategory">Source Code</div>
        <div className="tool-pills">
          <ToolPill>GitHub</ToolPill>
          <ToolPill>GitLab</ToolPill>
        </div>
        <div className="tool-subcategory">IDE</div>
        <div className="tool-pills">
          <ToolPill>Cursor</ToolPill>
          <ToolPill>VS Code</ToolPill>
          <ToolPill>Windsurf</ToolPill>
        </div>
        <div className="tool-subcategory">Terminal</div>
        <div className="tool-pills">
          <ToolPill>Claude Code</ToolPill>
          <ToolPill>Cursor CLI</ToolPill>
          <ToolPill>Vim</ToolPill>
        </div>
      </div>
      <div className="sdlc-arrow">→</div>
      <div className="sdlc-item">
        <div className="sdlc-icon">04</div>
        <div className="sdlc-name">Test</div>
        <div className="tool-pills">
          <ToolPill>GitHub Actions</ToolPill>
          <ToolPill>Jenkins</ToolPill>
          <ToolPill>CircleCI</ToolPill>
          <ToolPill>Selenium</ToolPill>
        </div>
      </div>
      <div className="sdlc-arrow">→</div>
      <div className="sdlc-item">
        <div className="sdlc-icon">05</div>
        <div className="sdlc-name">Review</div>
        <div className="tool-pills">
          <ToolPill>GitHub PRs</ToolPill>
          <ToolPill>CodeRabbit</ToolPill>
          <ToolPill>Bugbot</ToolPill>
        </div>
      </div>
      <div className="sdlc-arrow">→</div>
      <div className="sdlc-item">
        <div className="sdlc-icon">06</div>
        <div className="sdlc-name">Deploy</div>
        <div className="tool-pills">
          <ToolPill>AWS</ToolPill>
          <ToolPill>Docker</ToolPill>
          <ToolPill>Kubernetes</ToolPill>
          <ToolPill>Terraform</ToolPill>
          <ToolPill>Vercel</ToolPill>
        </div>
      </div>
    </div>
    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem', paddingRight: '1rem' }}>
      <div className="sdlc-item" style={{ opacity: 0.7, borderStyle: 'dashed' }}>
        <div className="sdlc-icon">07</div>
        <div className="sdlc-name">Monitor</div>
        <div className="tool-pills">
          <ToolPill>Datadog</ToolPill>
          <ToolPill>New Relic</ToolPill>
          <ToolPill>Dynatrace</ToolPill>
          <ToolPill>Grafana</ToolPill>
        </div>
      </div>
    </div>
    <p
      style={{
        textAlign: 'center',
        color: 'var(--text-secondary)',
        marginTop: '0.75rem',
        fontSize: '1.1rem',
      }}
    >
      <strong style={{ color: 'var(--cursor-blue)' }}>Ask in discovery:</strong>{' '}
      what tools does your team use at each stage?
    </p>
  </>
)

export default Slide04SdlcOverview
