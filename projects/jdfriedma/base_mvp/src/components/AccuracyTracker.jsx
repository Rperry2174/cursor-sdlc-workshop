function roundOne(n) {
  return Math.round(n * 10) / 10
}

/**
 * Accuracy = (correct forward keystrokes / total forward keystrokes) × 100.
 * Backspaces do not add to the denominator; only characters that extend typed length count.
 *
 * @param {{ correct: number, total: number, phase: 'idle' | 'typing' | 'done' }} props
 */
export default function AccuracyTracker({ correct, total, phase }) {
  const hasAttempts = total > 0
  const pct =
    hasAttempts ? (correct / total) * 100 : null

  const value =
    phase === 'idle' || !hasAttempts
      ? '—'
      : `${roundOne(pct)}%`

  return (
    <div className="stat-card" aria-live="polite">
      <div className="stat-label">Accuracy</div>
      <div className="stat-value">{value}</div>
      {phase !== 'idle' && (
        <div className="stat-hint">
          Forward keystrokes: {correct} correct / {total} total
        </div>
      )}
    </div>
  )
}
