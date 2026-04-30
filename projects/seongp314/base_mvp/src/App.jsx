import { useState, useMemo, useCallback } from 'react'
import { questions } from './data/questions'

const total = questions.length

function encouragement(score, max) {
  if (score === max) return 'Perfect — you’ve got the SDLC map down.'
  if (score >= max - 1) return 'Strong work. You’re ready to explain this to customers.'
  if (score >= max / 2) return 'Good foundation — skim the workshop slides once more on weak spots.'
  return 'No worries — walk through Plan → Deploy once more and try again.'
}

export default function App() {
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState(null)
  const [checked, setChecked] = useState(false)
  const [score, setScore] = useState(0)
  const [finished, setFinished] = useState(false)

  const q = questions[index]

  const progressPct = useMemo(
    () => (finished ? 100 : ((index + 1) / total) * 100),
    [index, finished],
  )

  const onCheck = useCallback(() => {
    if (selected === null || checked) return
    setChecked(true)
    if (selected === q.correctIndex) {
      setScore(s => s + 1)
    }
  }, [selected, checked, q.correctIndex])

  const onNext = useCallback(() => {
    if (index + 1 >= total) {
      setFinished(true)
      return
    }
    setIndex(i => i + 1)
    setSelected(null)
    setChecked(false)
  }, [index])

  const restart = useCallback(() => {
    setIndex(0)
    setSelected(null)
    setChecked(false)
    setScore(0)
    setFinished(false)
  }, [])

  if (finished) {
    return (
      <div>
        <header className="app-header">
          <h1>SDLC Workshop Quiz</h1>
        </header>
        <div className="card results">
          <h2>Your score</h2>
          <p className="score">
            {score} / {total}
          </p>
          <p className="encouragement">{encouragement(score, total)}</p>
          <button type="button" className="btn-primary" onClick={restart}>
            Start over
          </button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <header className="app-header">
        <h1>SDLC Workshop Quiz</h1>
        <p>Multiple choice — workshop topics only.</p>
      </header>

      <div className="progress">
        Question {index + 1} of {total}
        <div className="progress-bar" aria-hidden>
          <div className="progress-bar-fill" style={{ width: `${progressPct}%` }} />
        </div>
      </div>

      <div className="card">
        <p className="question-text">{q.prompt}</p>
        <div className="options" role="group" aria-label="Answer choices">
          {q.choices.map((label, i) => {
            const isSelected = selected === i
            let className = 'option-btn'
            if (isSelected) className += ' selected'
            if (checked) {
              if (i === q.correctIndex) className += ' correct'
              else if (isSelected && i !== q.correctIndex) className += ' incorrect'
            }
            return (
              <button
                key={i}
                type="button"
                className={className}
                disabled={checked}
                onClick={() => !checked && setSelected(i)}
              >
                {label}
              </button>
            )
          })}
        </div>

        {checked && (
          <div
            className={`feedback ${selected === q.correctIndex ? 'ok' : 'bad'}`}
            role="status"
          >
            {selected === q.correctIndex ? 'Correct!' : 'Not quite — see the green answer above.'}
          </div>
        )}

        <div className="actions">
          {!checked ? (
            <button
              type="button"
              className="btn-primary"
              onClick={onCheck}
              disabled={selected === null}
            >
              Check answer
            </button>
          ) : (
            <button type="button" className="btn-primary" onClick={onNext}>
              {index + 1 >= total ? 'See results' : 'Next question'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
