const SlideSection1Takeaway = () => (
  <>
    <div className="section-header">
      <span className="section-badge section1">Section 1</span>
      <span className="phase-badge">Takeaway</span>
    </div>
    <h2>What Just Happened</h2>
    <div className="hero-callout">
      <div className="hero-text">
        You just went from{' '}
        <span className="hero-highlight">zero to working software</span> in
        25 minutes — and you're not developers.
      </div>
    </div>
    <div className="tiles">
      <div className="tile cyan">
        <div className="takeaway-label" style={{ color: 'var(--cyan)' }}>
          It's Not Just About Code
        </div>
        <div className="tile-title">
          <span className="highlight-green">
            Cursor helped you think, not just type
          </span>
        </div>
        <ul className="tile-bullets">
          <li>PRD, tasks, GitHub issues — all before writing code</li>
          <li>Most AI tools start when you code. Cursor starts when you think</li>
        </ul>
      </div>
      <div className="tile cyan">
        <div className="takeaway-label" style={{ color: 'var(--cyan)' }}>
          The Speed Is Real
        </div>
        <div className="tile-title">
          <span className="highlight-green">
            You built the foundation and shipped features
          </span>
        </div>
        <ul className="tile-bullets">
          <li>"I have an idea" → "I have something to show" in minutes</li>
          <li>You can experiment and iterate way faster</li>
        </ul>
      </div>
      <div className="tile cyan">
        <div className="takeaway-label" style={{ color: 'var(--cyan)' }}>
          The Boring Stuff Disappeared
        </div>
        <div className="tile-title">
          <span className="highlight-green">
            You did real git workflow without learning git
          </span>
        </div>
        <ul className="tile-bullets">
          <li>Fork, branch, commit, push, PR — through conversation</li>
          <li>Nobody memorized a command. Hours of overhead gone</li>
        </ul>
      </div>
    </div>
    <div className="discovery-callout cyan">
      <div className="discovery-label">
        Ask in discovery: what do you use for planning and development?
      </div>
      <div className="tool-buckets">
        <div className="tool-bucket">
          <div className="tool-bucket-label">Plan</div>
          <div className="tool-pills">
            <span className="tool-pill cyan">Jira</span>
            <span className="tool-pill cyan">Linear</span>
            <span className="tool-pill cyan">GitHub Issues</span>
            <span className="tool-pill cyan">Notion</span>
          </div>
        </div>
        <div className="tool-bucket">
          <div className="tool-bucket-label">Source Code</div>
          <div className="tool-pills">
            <span className="tool-pill cyan">GitHub</span>
            <span className="tool-pill cyan">GitLab</span>
          </div>
        </div>
        <div className="tool-bucket">
          <div className="tool-bucket-label">IDE</div>
          <div className="tool-pills">
            <span className="tool-pill cyan">Cursor</span>
            <span className="tool-pill cyan">VS Code</span>
            <span className="tool-pill cyan">Windsurf</span>
          </div>
        </div>
      </div>
    </div>
    <div className="emphasis-box green">
      <strong>The takeaway:</strong> Copilot = type faster. Cursor = plan,
      build, test, ship — the whole SDLC.
    </div>
  </>
)

export default SlideSection1Takeaway
