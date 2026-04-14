import './TeamHero.css'

function TeamHero({ team }) {
  const { wins, losses } = team.record
  const pct = (wins / (wins + losses)).toFixed(3).replace(/^0/, '')

  return (
    <div className="team-hero">
      <div className="hero-diamond" />
      <div className="hero-content">
        <div className="hero-top-row">
          <div className="hero-logo">LAA</div>
          <div className="hero-info">
            <h1 className="hero-name">Los Angeles Angels</h1>
            <div className="hero-meta">
              <span className="hero-record">{wins}-{losses}</span>
              <span className="hero-pct">({pct})</span>
              <span className="hero-divider">|</span>
              <span className="hero-standing">{team.standing}</span>
              <span className="hero-divider">|</span>
              <span className={`hero-streak ${team.streak.startsWith('W') ? 'hero-streak--w' : 'hero-streak--l'}`}>
                {team.streak}
              </span>
            </div>
          </div>
        </div>

        <div className="hero-last10">
          <span className="last10-label">Last 7</span>
          <div className="last10-bubbles">
            {team.last10.map((g, i) => (
              <div key={i} className={`last10-bubble ${g.result === 'W' ? 'last10-bubble--w' : 'last10-bubble--l'}`}>
                <span className="last10-result">{g.result}</span>
                <span className="last10-opp">{g.opp}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="hero-batting">
          <div className="batting-chip">
            <span className="batting-label">AVG</span>
            <span className="batting-value">{team.teamBatting.avg}</span>
          </div>
          <div className="batting-chip">
            <span className="batting-label">HR</span>
            <span className="batting-value">{team.teamBatting.hr}</span>
          </div>
          <div className="batting-chip">
            <span className="batting-label">OBP</span>
            <span className="batting-value">{team.teamBatting.obp}</span>
          </div>
          <div className="batting-chip">
            <span className="batting-label">SLG</span>
            <span className="batting-value">{team.teamBatting.slg}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TeamHero
