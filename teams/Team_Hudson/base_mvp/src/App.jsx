/**
 * Game state manager: start, playing, won, lost.
 * Renders the appropriate screen and passes callbacks.
 * Also lets the player pick a difficulty (Easy / Medium / Hard)
 * before starting the game.
 */
import { useState } from 'react';
import './App.css';
import StartScreen from './StartScreen';
import GameCanvas from './GameCanvas';
import GameOverScreen from './GameOverScreen';
import DifficultySettings, { DIFFICULTY_CONFIGS } from './DifficultySettings';

export default function App() {
  const [gameState, setGameState] = useState('start'); // 'start' | 'playing' | 'won' | 'lost'
  const [difficultyKey, setDifficultyKey] = useState('medium');

  const handleStart = () => setGameState('playing');
  const handleWin = () => setGameState('won');
  const handleLose = () => setGameState('lost');
  const handleRestart = () => setGameState('start');

  const difficultyConfig = DIFFICULTY_CONFIGS[difficultyKey];

  if (gameState === 'start') {
    return (
      <div className="app">
        <StartScreen onStart={handleStart} />
        <DifficultySettings selected={difficultyKey} onChange={setDifficultyKey} />
      </div>
    );
  }

  if (gameState === 'playing') {
    return (
      <div className="app">
        <GameCanvas
          onWin={handleWin}
          onLose={handleLose}
          difficultyConfig={difficultyConfig}
        />
      </div>
    );
  }

  return (
    <div className="app">
      <GameOverScreen won={gameState === 'won'} onRestart={handleRestart} />
    </div>
  );
}
