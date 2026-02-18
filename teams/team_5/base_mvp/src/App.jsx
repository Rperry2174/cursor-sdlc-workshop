import { useState } from 'react'

const PASSAGE = 'The quick brown fox jumps over the lazy dog. Type this sentence to practice your speed.'

export default function App() {
  const [typed, setTyped] = useState('')

  const chars = PASSAGE.split('')
  const typedChars = typed.split('')

  return (
    <div className="app">
      <h1>Cursor Type Rush</h1>
      <p className="hint">Type the passage below. Green = correct, red = wrong.</p>
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
