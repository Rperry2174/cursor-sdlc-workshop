const SlidePlanVideo = () => (
  <>
    <div className="phase-header">
      <div className="phase-number plan">01</div>
      <h2>Plan - In Practice</h2>
    </div>

    <div className="video-placeholder">
      <span className="vp-icon">🎬</span>
      <span className="vp-title">Customer / SE Video: Planning Pain</span>
      <span className="vp-desc">
        Short clip of someone describing the frustration of translating business intent
        into engineering specs - and how AI-assisted planning changed their workflow
      </span>
    </div>

    <div className="outcome-callout" style={{ marginTop: '1rem' }}>
      <div className="outcome-label">Key message</div>
      <div className="outcome-text">
        The bottleneck isn't writing code - it's <strong style={{ color: 'var(--cyan)' }}>figuring out what to build</strong>.
        Cursor collapses the planning phase by turning intent into structured, code-ready specs.
      </div>
    </div>
  </>
)

export default SlidePlanVideo
