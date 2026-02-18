import { useState, useRef, useEffect } from 'react'

const PASSAGE = 'The quick brown fox jumps over the lazy dog. Type this sentence to practice your speed.'

function countWords(text) {
  return text.trim().split(/\s+/).filter(Boolean).length
}

export default function App() {
  const [typed, setTyped] = useState('')
  const [startTime, setStartTime] = useState(null)
  const [wpm, setWpm] = useState(0)
  const intervalRef = useRef(null)

  // Start timer on first keystroke
  useEffect(() => {
    if (typed.length > 0 && startTime === null) {
      setStartTime(Date.now())
    }
  }, [typed.length, startTime])

  // Update WPM every 200ms while typing
  useEffect(() => {
    if (startTime === null) return
    intervalRef.current = setInterval(() => {
      const elapsedMin = (Date.now() - startTime) / 60000
      const words = countWords(typed)
      setWpm(elapsedMin > 0 ? Math.round(words / elapsedMin) : 0)
    }, 200)
    return () => clearInterval(intervalRef.current)
  }, [startTime, typed])

  const chars = PASSAGE.split('')
  const typedChars = typed.split('')

  return (
    <div className="app">
      <h1>Cursor Type Rush</h1>
      <p className="hint">Type the passage below. Green = correct, red = wrong.</p>
      {startTime !== null && (
        <p className="wpm-display" aria-live="polite">
          WPM: <strong>{wpm}</strong>
        </p>
      )}
      <div className="passage" aria-hidden="true">
        {chars.map((char, i) => {
          const isCorrect = typedChars[i] !== undefined ? typedChars[i] === char : null
          const isCurrent = i === typed.length
          let className = 'char'
          if (isCurrent) className += ' current'
          else if (isCorrect === true) className += ' correct'
          else if (isCorrect === false) className += ' wrong'
          return (
            <span key={i} className={className}>
              {char === ' ' ? '\u00A0' : char}
            </span>
          )
        })}
      </div>
      <textarea
        className="input"
        value={typed}
        onChange={(e) => setTyped(e.target.value)}
        placeholder="Start typing..."
        spellCheck={false}
        rows={3}
      />
    </div>
  )
}
