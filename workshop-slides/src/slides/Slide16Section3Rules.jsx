const Slide16Section3Rules = () => (
  <>
    <div className="section-header">
      <span className="section-badge section3">Section 3</span>
      <span className="phase-badge">The Rules</span>
    </div>
    <h2>The Challenge</h2>
    <div className="intro-callout purple">
      <p>
        <strong>In this section</strong>, you'll experience what happens when{' '}
        <strong>multiple engineers work on the same codebase</strong> at once.
        Merge conflicts, coordination, and communication become critical.
      </p>
      <p>
        This is where process either <strong>saves you</strong> or you learn why
        it matters the hard way.
      </p>
    </div>
    <div className="tiles" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
      <div className="tile purple">
        <div className="tile-number">01</div>
        <div className="tile-title">
          <span className="highlight-purple">Get as many people contributing as possible</span>
        </div>
        <div className="tile-desc">
          Just like at a real company  - most team members should try to ship something
        </div>
      </div>
      <div className="tile purple">
        <div className="tile-number">02</div>
        <div className="tile-title">
          <span className="highlight-purple">Live deploy to big screen</span>
        </div>
        <div className="tile-desc">
          Watch your changes appear in real-time as PRs get merged
        </div>
      </div>
    </div>
    <div className="emphasis-box purple">
      <strong>The Question:</strong> Will your team follow the process... or
      descend into chaos?
    </div>
  </>
)

export default Slide16Section3Rules
