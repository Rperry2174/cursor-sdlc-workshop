export default function ScoreDisplay({ score, letterGrade }) {
  if (score === null) return null

  return (
    <section className="score-display" aria-live="polite">
      <div className="score-number" aria-label={`Score: ${score} out of 100`}>
        {score}
      </div>
      <div className="score-letter" aria-label={`Letter grade: ${letterGrade}`}>
        {letterGrade}
      </div>
    </section>
  )
}
