export default function ScoreGauge({ score }) {
  if (score === null) return null

  const pct = Math.min(100, Math.max(0, score))
  const level = score >= 70 ? 'high' : score >= 40 ? 'mid' : 'low'

  return (
    <section className="score-gauge" aria-label="Score gauge">
      <div className={`gauge-bar gauge-${level}`} role="progressbar" aria-valuenow={score} aria-valuemin={0} aria-valuemax={100}>
        <div className="gauge-fill" style={{ width: `${pct}%` }} />
      </div>
      <span className="gauge-labels">
        <span>0</span>
        <span>100</span>
      </span>
    </section>
  )
}
