const SlideDevelopVideo = () => (
  <>
    <div className="phase-header">
      <div className="phase-number develop">03</div>
      <h2>Real World: Development With Cursor</h2>
    </div>

    <div className="video-placeholder">
      <span className="vp-icon">🎬</span>
      <span className="vp-title">Customer / SE Video: Development Workflow</span>
      <span className="vp-desc">
        Short clip showing a developer using Cursor's Agent mode to implement a feature
        end-to-end - from understanding the codebase to shipping working code
      </span>
    </div>

    <div className="outcome-callout" style={{ marginTop: '1rem' }}>
      <div className="outcome-label">Key message</div>
      <div className="outcome-text">
        The biggest cost isn't writing code - it's <strong style={{ color: 'var(--cursor-blue)' }}>understanding the codebase well enough to change it safely</strong>.
        Cursor gives every engineer the context of a senior dev who's been on the team for years.
      </div>
    </div>
  </>
)

export default SlideDevelopVideo
