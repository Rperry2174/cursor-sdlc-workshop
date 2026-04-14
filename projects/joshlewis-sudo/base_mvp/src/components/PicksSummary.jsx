import './PicksSummary.css'

function PicksSummary({ picks, matchups }) {
  const entries = matchups
    .filter(g => picks[g.id])
    .map(g => ({
      date: g.date,
      pick: picks[g.id],
      isAngels: picks[g.id] === 'Angels',
    }))

  if (entries.length === 0) return null

  return (
    <div className="picks-summary">
      <h3 className="picks-title">Your Picks</h3>
      <div className="picks-list">
        {entries.map((e, i) => (
          <div key={i} className="picks-item">
            <span className="picks-date">{e.date}</span>
            <span className={`picks-team ${e.isAngels ? 'picks-team--angels' : ''}`}>
              {e.pick}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default PicksSummary
