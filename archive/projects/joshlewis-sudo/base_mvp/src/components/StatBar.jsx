import './StatBar.css'

function StatBar({ label, leftVal, rightVal, lowerIsBetter = false }) {
  if (leftVal === null || rightVal === null) return null

  const max = Math.max(leftVal, rightVal) || 1
  const leftPct = (leftVal / max) * 100
  const rightPct = (rightVal / max) * 100

  const leftWins = lowerIsBetter ? leftVal <= rightVal : leftVal >= rightVal
  const rightWins = !leftWins

  return (
    <div className="stat-bar-row">
      <span className={`stat-val stat-val--left ${leftWins ? 'stat-val--winner' : ''}`}>
        {typeof leftVal === 'number' ? (Number.isInteger(leftVal) ? leftVal : leftVal.toFixed(2)) : leftVal}
      </span>

      <div className="stat-bar-track">
        <div className="stat-bar-label">{label}</div>
        <div className="stat-bar-halves">
          <div className="stat-bar-half stat-bar-half--left">
            <div
              className={`stat-bar-fill stat-bar-fill--left ${leftWins ? 'stat-bar-fill--winner' : ''}`}
              style={{ width: `${leftPct}%` }}
            />
          </div>
          <div className="stat-bar-half stat-bar-half--right">
            <div
              className={`stat-bar-fill stat-bar-fill--right ${rightWins ? 'stat-bar-fill--winner' : ''}`}
              style={{ width: `${rightPct}%` }}
            />
          </div>
        </div>
      </div>

      <span className={`stat-val stat-val--right ${rightWins ? 'stat-val--winner' : ''}`}>
        {typeof rightVal === 'number' ? (Number.isInteger(rightVal) ? rightVal : rightVal.toFixed(2)) : rightVal}
      </span>
    </div>
  )
}

export default StatBar
