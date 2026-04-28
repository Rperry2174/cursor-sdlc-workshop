import './PitcherSide.css'

function PitcherSide({ side, align, isAngels }) {
  return (
    <div className={`pitcher-side pitcher-side--${align}`}>
      <div className="pitcher-team-row">
        <span className={`pitcher-abbr ${isAngels ? 'pitcher-abbr--angels' : ''}`}>
          {side.abbr}
        </span>
        {side.hand && <span className="pitcher-hand">{side.hand}</span>}
      </div>
      <div className="pitcher-name">{side.pitcher}</div>
      {side.record && (
        <div className="pitcher-record">
          {side.record} &middot; {side.era !== null ? `${side.era.toFixed(2)} ERA` : ''}
        </div>
      )}
    </div>
  )
}

export default PitcherSide
