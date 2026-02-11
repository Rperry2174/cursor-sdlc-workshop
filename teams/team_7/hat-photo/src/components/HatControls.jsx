function HatControls({ hatPosition, onPositionChange, hatSize, onSizeChange }) {
  return (
    <div className="hat-controls">
      <h3>Position the hat</h3>
      <p>Use the sliders to move the hat so it fits on your head.</p>

      <div className="slider-group">
        <label>
          <span>Top (vertical)</span>
          <input
            type="range"
            min="0"
            max="40"
            value={hatPosition.top}
            onChange={(e) =>
              onPositionChange((prev) => ({ ...prev, top: Number(e.target.value) }))
            }
          />
          <span className="value">{hatPosition.top}%</span>
        </label>
      </div>

      <div className="slider-group">
        <label>
          <span>Side (horizontal)</span>
          <input
            type="range"
            min="20"
            max="80"
            value={hatPosition.left}
            onChange={(e) =>
              onPositionChange((prev) => ({ ...prev, left: Number(e.target.value) }))
            }
          />
          <span className="value">{hatPosition.left}%</span>
        </label>
      </div>

      <div className="slider-group">
        <label>
          <span>Size</span>
          <input
            type="range"
            min="80"
            max="300"
            value={hatSize}
            onChange={(e) => onSizeChange(Number(e.target.value))}
          />
          <span className="value">{hatSize}px</span>
        </label>
      </div>
    </div>
  )
}

export default HatControls
