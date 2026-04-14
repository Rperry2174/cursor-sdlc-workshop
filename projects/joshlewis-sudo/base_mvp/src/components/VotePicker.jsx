import './VotePicker.css'

function VotePicker({ gameId, awayTeam, homeTeam, pick, onPick }) {
  return (
    <div className="vote-picker">
      <span className="vote-label">Who wins?</span>
      <div className="vote-buttons">
        <button
          className={`vote-btn vote-btn--away ${pick === awayTeam ? 'vote-btn--selected vote-btn--angels' : ''}`}
          onClick={() => onPick(gameId, awayTeam)}
        >
          {awayTeam}
        </button>
        <button
          className={`vote-btn vote-btn--home ${pick === homeTeam ? 'vote-btn--selected' : ''}`}
          onClick={() => onPick(gameId, homeTeam)}
        >
          {homeTeam}
        </button>
      </div>
    </div>
  )
}

export default VotePicker
