import './BattingLeaders.css'

function BattingLeaders({ leaders }) {
  return (
    <div className="batting-leaders">
      <h3 className="leaders-title">Stat Leaders</h3>
      <div className="leaders-grid">
        {leaders.map((leader, i) => (
          <div key={i} className="leader-card">
            <span className="leader-emoji">{leader.emoji}</span>
            <div className="leader-info">
              <span className="leader-name">{leader.name}</span>
              <span className="leader-stat-line">
                <span className="leader-value">{leader.value}</span>
                <span className="leader-stat-label">{leader.stat}</span>
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default BattingLeaders
