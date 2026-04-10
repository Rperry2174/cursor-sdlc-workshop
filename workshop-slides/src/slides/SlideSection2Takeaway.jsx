const SlideSection2Takeaway = () => (
  <>
    <div className="section-header">
      <span className="section-badge section2">Section 2</span>
      <span className="phase-badge">Takeaway</span>
    </div>
    <h2>It Was Working For You the Whole Time</h2>
    <div className="hero-callout">
      <div className="hero-text">
        The best engineers don't just <em>use</em> Cursor  - they{' '}
        <span className="hero-highlight">
          teach it how they work
        </span>.
      </div>
    </div>
    <div className="tiles">
      <div className="tile orange">
        <div className="takeaway-label" style={{ color: 'var(--orange)' }}>
          Remember Being Lost?
        </div>
        <div className="tile-title">
          <span className="highlight-orange">
            You understood a stranger's code in minutes
          </span>
        </div>
        <ul className="tile-bullets">
          <li>Opened someone else's project with zero context</li>
          <li>Ask Mode got you oriented in minutes</li>
          <li>This is what faster onboarding actually looks like</li>
        </ul>
      </div>
      <div className="tile orange">
        <div className="takeaway-label" style={{ color: 'var(--orange)' }}>
          The Invisible Helpers
        </div>
        <div className="tile-title">
          <span className="highlight-orange">
            Skills, Hooks, and Agents automate the boring, repeated tasks
          </span>
        </div>
        <ul className="tile-bullets">
          <li>Otherwise we'd do these complicated tasks over and over by hand</li>
          <li>This is where we enter a more AI-native world</li>
          <li>This is where we have the ability to wow customers</li>
        </ul>
      </div>
      <div className="tile orange">
        <div className="takeaway-label" style={{ color: 'var(--orange)' }}>
          You Leveled Up
        </div>
        <div className="tile-title">
          <span className="highlight-orange">
            In Section 1 you used AI. In Section 2 you taught it.
          </span>
        </div>
        <ul className="tile-bullets">
          <li>Created a Rule, a Skill, and a Hook  - your own guardrails</li>
          <li>Senior engineers' knowledge stays even when they leave</li>
          <li>The AI carries the standards forward automatically</li>
        </ul>
      </div>
    </div>
    <div className="discovery-callout orange">
      <div className="discovery-label">
        Ask in discovery: what do you use for code review and testing?
      </div>
      <div className="tool-buckets">
        <div className="tool-bucket">
          <div className="tool-bucket-label">Review</div>
          <div className="tool-pills">
            <span className="tool-pill orange">GitHub PRs</span>
            <span className="tool-pill orange">CodeRabbit</span>
            <span className="tool-pill orange">Bugbot</span>
          </div>
        </div>
        <div className="tool-bucket">
          <div className="tool-bucket-label">Test</div>
          <div className="tool-pills">
            <span className="tool-pill orange">GitHub Actions</span>
            <span className="tool-pill orange">Jenkins</span>
            <span className="tool-pill orange">CircleCI</span>
            <span className="tool-pill orange">Selenium</span>
          </div>
        </div>
      </div>
    </div>
    <div className="emphasis-box orange">
      <strong>The takeaway:</strong> Any AI can generate code. Cursor lets you
      teach it your way  - same quality bar, automatically.
    </div>
  </>
)

export default SlideSection2Takeaway
