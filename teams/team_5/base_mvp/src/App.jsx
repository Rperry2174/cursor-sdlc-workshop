import { useState, useRef, useEffect } from 'react'
import './App.css'

// Fixed passage for the base MVP — teammates can add difficulty levels later
const PASSAGE = 'The quick brown fox jumps over the lazy dog.'
const CHARS_PER_WORD = 5

function App() {
  const [typed, setTyped] = useState('')
  const [isComplete, setIsComplete] = useState(false)
  const [wpm, setWpm] = useState(0)
  const startTimeRef = useRef(null)
  const inputRef = useRef(null)

  // Compare typed vs passage and detect completion
  useEffect(() => {
    if (typed === PASSAGE) {
      setIsComplete(true)
    }
  }, [typed])

  // WPM: words per minute (standard = 5 chars per word)
  useEffect(() => {
    if (typed.length === 0) return
    if (!startTimeRef.current) {
      startTimeRef.current = Date.now()
    }
    const elapsedMs = Date.now() - startTimeRef.current
    const elapsedMinutes = elapsedMs / (1000 * 60)
    const words = typed.length / CHARS_PER_WORD
    const currentWpm = elapsedMinutes > 0 ? Math.round(words / elapsedMinutes) : 0
    setWpm(currentWpm)
  }, [typed])

  const handleChange = (e) => {
    setTyped(e.target.value)
  }

  return (
    <div className="app">
      <h1>Speed Typing Game</h1>
      <p className="subtitle">Type the passage below as fast as you can.</p>

      {/* WPM Display — updates in real time as user types */}
      <div className="stats-bar">
        <span className="wpm-display">WPM: {wpm}</span>
      </div>

      {/* Passage with character-by-character feedback */}
      <div className="passage" aria-label="Text to type">
        {PASSAGE.split('').map((char, i) => {
          const userChar = typed[i]
          let state = 'pending'
          if (userChar !== undefined) {
            state = userChar === char ? 'correct' : 'incorrect'
          }
          return (
            <span key={i} className={`char char-${state}`}>
              {char}
            </span>
          )
        })}
      </div>

      {/* Input area — hidden visually but captures focus; we show passage feedback above */}
      <textarea
        ref={inputRef}
        className="input"
        value={typed}
        onChange={handleChange}
        onKeyDown={(e) => {
          // Prevent Enter from adding newlines
          if (e.key === 'Enter') e.preventDefault()
        }}
        placeholder="Start typing..."
        disabled={isComplete}
        autoFocus
        spellCheck={false}
        aria-label="Type the passage"
      />

      {isComplete && (
        <p className="complete-message" role="status">
          Complete! Teammates will add WPM, accuracy, and results screen.
        </p>
      )}
    </div>
  )
}

export default App
