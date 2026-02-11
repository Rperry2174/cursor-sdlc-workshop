/**
 * Game state manager: start, playing, won, lost.
 * Renders the appropriate screen and passes callbacks.
 */
import { useState, useCallback, useRef } from 'react';
import './App.css';
import StartScreen from './StartScreen';
import GameCanvas from './GameCanvas';
import GameOverScreen from './GameOverScreen';
import Scoreboard from './Scoreboard';
import PowerUps from './PowerUps';

export default function App() {
  const [gameState, setGameState] = useState('start'); // 'start' | 'playing' | 'won' | 'lost'
  const [distance, setDistance] = useState(0);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [activePowerUp, setActivePowerUp] = useState(null);
  const [powerUpEndTime, setPowerUpEndTime] = useState(0);
  const [now, setNow] = useState(0);

  // Use a ref to avoid re-creating callback every render (which would reset GameCanvas effect)
  const tickRef = useRef({ distance: 0, elapsedMs: 0 });

  const handleTick = useCallback(({ distance: d, elapsedMs: t, activePowerUp: apu, powerUpEndTime: puEnd, now: n }) => {
    tickRef.current = { distance: d, elapsedMs: t };
    setDistance(d);
    setElapsedMs(t);
    if (apu !== undefined) setActivePowerUp(apu);
    if (puEnd !== undefined) setPowerUpEndTime(puEnd);
    if (n !== undefined) setNow(n);
  }, []);

  const handleStart = () => {
    setDistance(0);
    setElapsedMs(0);
    setActivePowerUp(null);
    setPowerUpEndTime(0);
    setGameState('playing');
  };
  const handleWin = useCallback(() => setGameState('won'), []);
  const handleLose = useCallback(() => setGameState('lost'), []);
  const handleRestart = () => {
    setDistance(0);
    setElapsedMs(0);
    setActivePowerUp(null);
    setPowerUpEndTime(0);
    setGameState('start');
  };

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
        <div className="game-wrapper">
          <GameCanvas onWin={handleWin} onLose={handleLose} onTick={handleTick} />
          <Scoreboard gameState={gameState} distance={distance} elapsedMs={elapsedMs} milesToWin={12} />
          <PowerUps activePowerUp={activePowerUp} powerUpEndTime={powerUpEndTime} now={now} />
        </div>
      </div>
    );
  }

  // won or lost
  return (
    <div className="app">
      <GameOverScreen won={gameState === 'won'} onRestart={handleRestart}>
        <Scoreboard gameState={gameState} distance={distance} elapsedMs={elapsedMs} milesToWin={12} />
      </GameOverScreen>
    </div>
  );
}
