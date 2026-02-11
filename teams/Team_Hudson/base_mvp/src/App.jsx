import { useState, useCallback, useEffect } from 'react'
import GameCanvas from './GameCanvas'
import GameOverScreen from './GameOverScreen'
import DifficultySettings, { DIFFICULTY_CONFIGS } from './DifficultySettings'
import { defaultDifficulty } from './gameLogic'
import './App.css'

export default function App() {
  const [gameState, setGameState] = useState('start') // 'start' | 'playing' | 'won' | 'lost'
  const [difficultyKey, setDifficultyKey] = useState('medium')
  const difficultyConfig = DIFFICULTY_CONFIGS[difficultyKey] ?? defaultDifficulty

  const handleStart = useCallback(() => setGameState('playing'), [])
  const handleWin = useCallback(() => setGameState('won'), [])
  const handleLose = useCallback(() => setGameState('lost'), [])
  const handleRestart = useCallback(() => setGameState('start'), [])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === ' ' && gameState === 'start') {
        e.preventDefault()
        handleStart()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [gameState, handleStart])

  return (
    <div className="app">
      {gameState === 'start' && (
        <div className="start-screen">
          <h1>Hudson River Runner</h1>
          <p>Dodge icebergs. Reach the Atlantic.</p>
          <p className="controls">← → or A / D to steer</p>
          <DifficultySettings selected={difficultyKey} onChange={setDifficultyKey} />
          <button type="button" onClick={handleStart}>
            Press Space or Click to Start
          </button>
        </div>
      )}

      {gameState === 'playing' && (
        <div className="canvas-wrap">
          <GameCanvas
            isPlaying
            onWin={handleWin}
            onLose={handleLose}
            difficultyConfig={difficultyConfig}
          />
        </div>
      )}

      {(gameState === 'won' || gameState === 'lost') && (
        <GameOverScreen won={gameState === 'won'} onRestart={handleRestart} />
      )}
    </div>
  )
}
