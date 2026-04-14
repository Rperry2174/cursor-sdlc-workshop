import { useState, useRef, useEffect } from 'react'
import { PASSAGE } from './data/passage.js'
import './App.css'

export default function App() {
  const [typed, setTyped] = useState('')
  const inputRef = useRef(null)
  const finished = typed === PASSAGE

  useEffect(() => {
    if (!finished) {
      inputRef.current?.focus()
    }
  }, [finished])

  function handleChange(e) {
    const next = e.target.value
    if (next.length <= PASSAGE.length) {
      setTyped(next)
    }
  }

  function handleReset() {
    setTyped('')
    queueMicrotask(() => inputRef.current?.focus())
  }

  const chars = Array.from(PASSAGE)

  return (
    <div className="app">
      <header className="header">
        <h1 className="title">Marvis Bacon Judges Typing</h1>
        <p className="tagline">Retype the passage. Marvis is watching.</p>
      </header>

      <main className="main">
        <section className="board" aria-label="Typing feedback">
          <div className="passage" role="presentation">
            {chars.map((targetCh, i) => {
              const isTyped = i < typed.length
              const isCursor = i === typed.length && !finished
              let statusClass = 'upcoming'
              if (isTyped) {
                statusClass = typed[i] === targetCh ? 'correct' : 'wrong'
              } else if (isCursor) {
                statusClass = 'cursor-cell'
              }
              const display =
                targetCh === ' ' ? '\u00a0' : targetCh
              return (
                <span key={i} className={`glyph ${statusClass}`}>
                  {display}
                </span>
              )
            })}
          </div>

          {finished && (
            <p className="finished-banner" role="status">
              Finished!
            </p>
          )}

          <label className="sr-only" htmlFor="typing-input">
            Type the passage
          </label>
          <textarea
            id="typing-input"
            ref={inputRef}
            className="typing-input"
            value={typed}
            onChange={handleChange}
            onPaste={(e) => e.preventDefault()}
            spellCheck={false}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            rows={3}
            readOnly={finished}
            aria-label="Type the passage"
          />

          <div className="actions">
            <button type="button" className="btn-reset" onClick={handleReset}>
              Start over
            </button>
          </div>
        </section>
      </main>
    </div>
  )
}
