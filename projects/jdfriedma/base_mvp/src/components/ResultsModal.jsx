import { useEffect, useId, useRef } from 'react'
import DifficultyPicker from './DifficultyPicker.jsx'
import {
  MIN_ACCURACY_PCT,
  MIN_WPM,
} from '../constants/results.js'

/**
 * @param {{
 *   open: boolean,
 *   passed: boolean,
 *   finalWpm: number | null,
 *   accuracyPct: number | null,
 *   successCount: number,
 *   failureCount: number,
 *   difficulty: string,
 *   onDifficultyChange: (id: string) => void,
 *   onStartOver: () => void,
 * }} props
 */
export default function ResultsModal({
  open,
  passed,
  finalWpm,
  accuracyPct,
  successCount,
  failureCount,
  difficulty,
  onDifficultyChange,
  onStartOver,
}) {
  const titleId = useId()
  const startBtnRef = useRef(null)

  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    queueMicrotask(() => startBtnRef.current?.focus())
  }, [open])

  if (!open) return null

  const stampSrc = passed ? '/stamps/success.png' : '/stamps/failure.png'
  const stampAlt = passed ? 'Success' : 'Failure'
  const headline = passed ? 'Success' : 'Failure'

  const wpmDisplay =
    finalWpm != null && !Number.isNaN(finalWpm)
      ? Math.round(finalWpm * 10) / 10
      : '—'
  const accDisplay =
    accuracyPct != null && !Number.isNaN(accuracyPct) ? `${accuracyPct}%` : '—'

  return (
    <div className="results-modal__backdrop" aria-hidden="false">
      <div
        className="results-modal__panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <h2 id={titleId} className="results-modal__title">
          {headline}
        </h2>

        <div className="results-modal__stamp-wrap">
          <img
            className="results-modal__stamp"
            src={stampSrc}
            alt={stampAlt}
            decoding="async"
          />
        </div>

        <dl className="results-modal__stats">
          <div className="results-modal__stat-row">
            <dt className="results-modal__stat-dt">Final WPM</dt>
            <dd className="results-modal__stat-dd">{wpmDisplay}</dd>
          </div>
          <div className="results-modal__stat-row">
            <dt className="results-modal__stat-dt">Accuracy</dt>
            <dd className="results-modal__stat-dd">{accDisplay}</dd>
          </div>
          <div className="results-modal__stat-row results-modal__stat-row--hint">
            <dt className="results-modal__stat-dt">Required</dt>
            <dd className="results-modal__stat-dd">
              {MIN_WPM} WPM, {MIN_ACCURACY_PCT}% accuracy
            </dd>
          </div>
          <div className="results-modal__stat-row">
            <dt className="results-modal__stat-dt">Session record</dt>
            <dd className="results-modal__stat-dd">
              {successCount} successes / {failureCount} failures
            </dd>
          </div>
        </dl>

        <div className="results-modal__controls">
          <DifficultyPicker
            value={difficulty}
            onChange={onDifficultyChange}
          />
          <div className="results-modal__actions">
            <button
              type="button"
              className="btn-reset"
              ref={startBtnRef}
              onClick={onStartOver}
            >
              Start over
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
