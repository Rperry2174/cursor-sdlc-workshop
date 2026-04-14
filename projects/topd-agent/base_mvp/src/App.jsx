import { useState, useCallback, useEffect, useRef } from 'react';
import Board from './components/Board.jsx';
import AnthropicLogo from './components/AnthropicLogo.jsx';
import Scoreboard, { qualifiesForBoard } from './components/Scoreboard.jsx';
import {
  createBoard,
  placeMines,
  revealCell,
  revealAllMines,
  checkWin,
  cloneBoard,
  MINE_COUNT,
} from './gameLogic.js';
import './App.css';

export default function App() {
  const [board, setBoard] = useState(() => createBoard());
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [minesPlaced, setMinesPlaced] = useState(false);
  const [statusMessage, setStatusMessage] = useState('Click any cell to start');
  const [elapsed, setElapsed] = useState(0);
  const [pendingTime, setPendingTime] = useState(null);
  const timerRef = useRef(null);

  function startTimer() {
    setElapsed(0);
    timerRef.current = setInterval(() => setElapsed(t => t + 1), 1000);
  }

  function stopTimer() {
    clearInterval(timerRef.current);
    timerRef.current = null;
  }

  useEffect(() => {
    return () => clearInterval(timerRef.current);
  }, []);

  const handleNewGame = useCallback(() => {
    stopTimer();
    setBoard(createBoard());
    setGameOver(false);
    setWon(false);
    setMinesPlaced(false);
    setStatusMessage('Click any cell to start');
    setElapsed(0);
    setPendingTime(null);
  }, []);

  const handleCellClick = useCallback((row, col) => {
    if (gameOver || won) return;

    setBoard(prev => {
      const next = cloneBoard(prev);

      if (!minesPlaced) {
        placeMines(next, row, col);
        setMinesPlaced(true);
        setStatusMessage('Good luck!');
        startTimer();
      }

      const cell = next[row][col];
      if (cell.isRevealed) return prev;

      if (cell.isMine) {
        revealAllMines(next);
        setGameOver(true);
        stopTimer();
        setStatusMessage('Boom! Game over.');
        return next;
      }

      revealCell(next, row, col);

      if (checkWin(next)) {
        revealAllMines(next);
        setWon(true);
        stopTimer();
        setStatusMessage('You won!');
        setElapsed(current => {
          if (qualifiesForBoard(current)) {
            setPendingTime(current);
          }
          return current;
        });
      }

      return next;
    });
  }, [gameOver, won, minesPlaced]);

  function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins > 0 ? `${mins}:${String(secs).padStart(2, '0')}` : `${secs}s`;
  }

  return (
    <div className="app">
      <header className="header">
        <h1 className="title">
          <AnthropicLogo size={28} />
          <span>Claude Code Sweeper</span>
        </h1>
        <p className="subtitle">{statusMessage}</p>
      </header>

      <div className="info-bar">
        <span className="mine-count">
          <AnthropicLogo size={16} /> {MINE_COUNT}
        </span>
        <span className="timer">{formatTime(elapsed)}</span>
        <button className="new-game-btn" onClick={handleNewGame}>
          New Game
        </button>
      </div>

      <Board board={board} onCellClick={handleCellClick} gameOver={gameOver || won} />

      <Scoreboard
        pendingTime={pendingTime}
        onScoreSubmitted={() => setPendingTime(null)}
      />
    </div>
  );
}
