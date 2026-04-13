const SlideSection3Takeaway = () => (
  <>
    <div className="section-header">
      <span className="section-badge section3">Section 3</span>
      <span className="phase-badge">Takeaway</span>
    </div>
    <h2>This Is Why Process Matters</h2>
    <div className="hero-callout">
      <div className="hero-text">
        You just felt what happens when{' '}
        <span className="hero-highlight">
          20+ people hit the same codebase at once
        </span>. Some teams thrived. Some didn't.
      </div>
    </div>
    <div className="tiles">
      <div className="tile purple">
        <div className="takeaway-label" style={{ color: 'var(--purple)' }}>
          Chaos or Coordination
        </div>
        <div className="tile-title">
          <span className="highlight-purple">
            The teams with process shipped more  - and faster
          </span>
        </div>
        <ul className="tile-bullets">
          <li>Same codebase, same tools  - coordination made the difference</li>
          <li>Clear branches, small PRs, rules. That's how teams move fast</li>
        </ul>
      </div>
      <div className="tile purple">
        <div className="takeaway-label" style={{ color: 'var(--purple)' }}>
          A Platform, Not Just a Tool
        </div>
        <div className="tile-title">
          <span className="highlight-purple">
            The customization you built? That's the enterprise story.
          </span>
        </div>
        <ul className="tile-bullets">
          <li>Rules, Skills, Hooks, Bugbot  - real problems at scale</li>
          <li>Model agnostic = best model per task, no vendor lock-in</li>
        </ul>
      </div>
      <div className="tile purple">
        <div className="takeaway-label" style={{ color: 'var(--purple)' }}>
          You Lived the Whole Platform
        </div>
        <div className="tile-title">
          <span className="highlight-purple">
            Every feature you used today has a customer story
          </span>
        </div>
        <ul className="tile-bullets">
          <li>Plan, Ask, Agent, Rules, Skills, Hooks, Bugbot, GitHub</li>
          <li>Used them under pressure  - that changes how you talk to customers</li>
        </ul>
      </div>
    </div>
    <div className="discovery-callout purple">
      <div className="discovery-label">
        Ask in discovery: what does your team use for design and deployment?
      </div>
      <div className="tool-buckets">
        <div className="tool-bucket">
          <div className="tool-bucket-label">Design</div>
          <div className="tool-pills">
            <span className="tool-pill purple">Figma</span>
            <span className="tool-pill purple">Adobe XD</span>
            <span className="tool-pill purple">Sketch</span>
            <span className="tool-pill purple">Storybook</span>
          </div>
        </div>
        <div className="tool-bucket">
          <div className="tool-bucket-label">Deploy</div>
          <div className="tool-pills">
            <span className="tool-pill purple">AWS</span>
            <span className="tool-pill purple">Docker</span>
            <span className="tool-pill purple">Kubernetes</span>
            <span className="tool-pill purple">Terraform</span>
            <span className="tool-pill purple">Vercel</span>
          </div>
        </div>
      </div>
    </div>
    <div className="emphasis-box purple">
      <strong>The takeaway:</strong> The struggles you felt today = the most
      authentic customer conversations you'll ever have.
    </div>
  </>
)

export default SlideSection3Takeaway
