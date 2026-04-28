import PitcherSide from './PitcherSide'
import StatBar from './StatBar'
import Countdown from './Countdown'
import VotePicker from './VotePicker'
import './MatchupCard.css'

function MatchupCard({ game, pick, onPick }) {
  const hasStats =
    game.away.era !== null && game.home.era !== null

  return (
    <div className="matchup-card">
      <div className="card-header">
        <span className="card-date">{game.date}</span>
        <Countdown targetTime={game.time} />
      </div>

      {game.subtitle && (
        <div className="card-subtitle">{game.subtitle}</div>
      )}

      <div className="card-venue">{game.venue}</div>

      <div className="pitchers-row">
        <PitcherSide side={game.away} align="left" isAngels />
        <div className="vs-badge">VS</div>
        <PitcherSide side={game.home} align="right" />
      </div>

      {hasStats && (
        <div className="stat-bars-section">
          <StatBar
            label="ERA"
            leftVal={game.away.era}
            rightVal={game.home.era}
            lowerIsBetter
          />
          <StatBar
            label="WHIP"
            leftVal={game.away.whip}
            rightVal={game.home.whip}
            lowerIsBetter
          />
          <StatBar
            label="K"
            leftVal={game.away.strikeouts}
            rightVal={game.home.strikeouts}
          />
        </div>
      )}

      <VotePicker
        gameId={game.id}
        awayTeam={game.away.team}
        homeTeam={game.home.team}
        pick={pick}
        onPick={onPick}
      />
    </div>
  )
}

export default MatchupCard
