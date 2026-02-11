/**
 * Compare View: side-by-side "without hat" vs "with hat" so users can compare.
 */
function CompareView({ photoUrl, hats, hatTypes }) {
  return (
    <div className="compare-view" aria-label="Compare without hat and with hat">
      <div className="compare-panel">
        <h3>Without hat</h3>
        <div className="photo-container">
          <img src={photoUrl} alt="Photo without hat" className="photo" />
        </div>
      </div>
      <div className="compare-panel">
        <h3>With hat</h3>
        <div className="photo-container">
          <img src={photoUrl} alt="Photo with hat" className="photo" />
          <div className="hat-overlay">
            {hats.map((hat) => (
              <img
                key={hat.id}
                src={hatTypes[hat.type]}
                alt="Hat"
                className="hat"
                style={{
                  left: `calc(50% + ${hat.offsetX}px)`,
                  top: `calc(28% + ${hat.offsetY}px)`,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CompareView
