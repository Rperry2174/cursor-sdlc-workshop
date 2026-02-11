import { useState, useCallback } from 'react'
import './App.css'

const SYMBOLS = ['🎵', '🎸', '🎹', '🎺', '🥁', '🎻', '🎤', '🎧']

function shuffle(array) {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

function createCards() {
  const pairs = SYMBOLS.flatMap((symbol, i) => [
    { id: `${symbol}-A-${i}`, symbol, isFlipped: false, isMatched: false },
    { id: `${symbol}-B-${i}`, symbol, isFlipped: false, isMatched: false },
  ])
  return shuffle(pairs)
}

function App() {
  const [cards, setCards] = useState(createCards)
  const [flippedIds, setFlippedIds] = useState([])
  const [isLocked, setIsLocked] = useState(false)

  const allMatched = cards.every((card) => card.isMatched)

  const handleCardClick = useCallback(
    (card) => {
      if (card.isFlipped || card.isMatched || isLocked) return
      if (flippedIds.length >= 2) return

      const newFlippedIds = [...flippedIds, card.id]
      setFlippedIds(newFlippedIds)

      setCards((prev) =>
        prev.map((c) =>
          c.id === card.id ? { ...c, isFlipped: true } : c
        )
      )

      if (newFlippedIds.length === 2) {
        const [firstId, secondId] = newFlippedIds
        const firstCard = cards.find((c) => c.id === firstId)
        const secondCard = cards.find((c) => c.id === secondId)

        if (firstCard?.symbol === secondCard?.symbol) {
          setCards((prev) =>
            prev.map((c) =>
              c.id === firstId || c.id === secondId
                ? { ...c, isMatched: true }
                : c
            )
          )
          setFlippedIds([])
        } else {
          setIsLocked(true)
          setTimeout(() => {
            setCards((prev) =>
              prev.map((c) =>
                c.id === firstId || c.id === secondId
                  ? { ...c, isFlipped: false }
                  : c
              )
            )
            setFlippedIds([])
            setIsLocked(false)
          }, 800)
        }
      }
    },
    [cards, flippedIds.length, isLocked]
  )

  return (
    <div className="app">
      <h1>Memory Card Match</h1>
      <p className="subtitle">Find matching pairs by flipping cards</p>

      {allMatched ? (
        <div className="win-message">You win!</div>
      ) : (
        <div className="card-grid">
          {cards.map((card) => (
            <button
              key={card.id}
              type="button"
              className={`card ${card.isFlipped || card.isMatched ? 'flipped' : ''}`}
              onClick={() => handleCardClick(card)}
              disabled={card.isMatched}
            >
              <span className="card-back">?</span>
              <span className="card-front">{card.symbol}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default App
