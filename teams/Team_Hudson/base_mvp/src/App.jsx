/**
 * Game state manager: start, playing, won, lost.
 * Renders the appropriate screen and passes callbacks.
 */
import { useState } from 'react';
import './App.css';
import StartScreen from './StartScreen';
import GameCanvas from './GameCanvas';
import GameOverScreen from './GameOverScreen';

export default function App() {
  const [gameState, setGameState] = useState('start'); // 'start' | 'playing' | 'won' | 'lost'

  const handleStart = () => setGameState('playing');
  const handleWin = () => setGameState('won');
  const handleLose = () => setGameState('lost');
  const handleRestart = () => setGameState('start');

  if (gameState === 'start') {
    return (
      <div className="app">
        <StartScreen onStart={handleStart} />
      </div>
    );
  }

  if (gameState === 'playing') {
    return (
      <div className="app">
        <GameCanvas onWin={handleWin} onLose={handleLose} />
      </div>
    );
  }

  return (
    <div className="app">
      <GameOverScreen won={gameState === 'won'} onRestart={handleRestart} />
    </div>
  );
}
