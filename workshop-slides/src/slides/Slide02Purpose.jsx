const Slide02Purpose = () => (
  <>
    <h2>What You'll Experience</h2>
    <div className="hero-callout">
      <div className="hero-text">
        By the end, you'll be able to{' '}
        <span className="hero-highlight">speak more authentically</span> about
        developer pain points because you felt them yourself.
      </div>
    </div>
    <div className="tiles">
      <div className="tile">
        <div className="takeaway-label" style={{ color: 'var(--cursor-blue)' }}>Model Neutrality</div>
        <div className="tile-title">
          <span className="highlight">Switch models freely</span>
        </div>
        <div className="tile-desc">
          Experience why customers should never be locked into a single vendor
        </div>
      </div>
      <div className="tile">
        <div className="takeaway-label" style={{ color: 'var(--cursor-blue)' }}>Best Time to Value</div>
        <div className="tile-title">
          <span className="highlight">Be productive immediately</span>
        </div>
        <div className="tile-desc">
          No setup sprawl  - just open Cursor and start building
        </div>
      </div>
      <div className="tile">
        <div className="takeaway-label" style={{ color: 'var(--cursor-blue)' }}>Platform, Not Just a Tool</div>
        <div className="tile-title">
          <span className="highlight">Plan, Build, Test, Review</span>
        </div>
        <div className="tile-desc">
          See how Cursor touches every part of the software development lifecycle
        </div>
      </div>
    </div>
    <div className="emphasis-box" style={{ marginTop: '1rem' }}>
      <strong>Note for ADMs & FEs:</strong> AEs are less technical than most
      customers -that's the point. Watch for friction that developers take for
      granted.
    </div>
  </>
)

export default Slide02Purpose
