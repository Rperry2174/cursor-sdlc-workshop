function StartScreen({ onStart }) {
  return (
    <div className="start-screen">
      <h1>Hudson River Runner</h1>
      <p>Dodge icebergs. Reach the Atlantic.</p>
      <p className="controls">← → or A / D to steer</p>
      <button type="button" onClick={onStart}>
        Press Space or Click to Start
      </button>
    </div>
  )
}

export default StartScreen
