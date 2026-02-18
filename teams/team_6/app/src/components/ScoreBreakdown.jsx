export default function ScoreBreakdown({ breakdown }) {
  if (!breakdown) return null

  return (
    <section className="score-breakdown" aria-label="Score explanation">
      <p>{breakdown}</p>
    </section>
  )
}
