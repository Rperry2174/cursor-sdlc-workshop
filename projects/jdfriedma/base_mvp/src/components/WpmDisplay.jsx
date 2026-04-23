import { CHARS_PER_WORD } from '../data/passages.js'

function roundOne(n) {
  return Math.round(n * 10) / 10
}

/**
 * Gross WPM: (character count / CHARS_PER_WORD) / minutes elapsed.
 * @param {{ phase: 'idle' | 'typing' | 'done', liveWpm: number | null, finalWpm: number | null, charCountForWords: number }} props
 */
export default function WpmDisplay({
  phase,
  liveWpm,
  finalWpm,
  charCountForWords,
}) {
  const label =
    phase === 'done' && finalWpm != null
      ? 'WPM'
      : phase === 'typing'
        ? 'WPM (live)'
        : 'WPM'

  const value =
    phase === 'done' && finalWpm != null
      ? roundOne(finalWpm)
      : phase === 'typing' && liveWpm != null
        ? roundOne(liveWpm)
        : '—'

  return (
    <div className="stat-card" aria-live="polite">
      <div className="stat-label">{label}</div>
      <div className="stat-value">{value}</div>
      {(phase === 'typing' || phase === 'done') && (
        <div className="stat-hint">
          Gross WPM: {CHARS_PER_WORD} characters = 1 word
        </div>
      )}
      {phase === 'done' && charCountForWords != null && (
        <div className="stat-hint">
          Final uses passage length ({charCountForWords} characters)
        </div>
      )}
    </div>
  )
}
