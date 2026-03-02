import { useState, useEffect, useCallback } from 'react';
import Grid from './components/Grid';
import Keyboard from './components/Keyboard';
import { getLetterColors } from './components/Grid';
import { getRandomWord } from './data/words';
import WORDS from './data/words';
import './App.css';

const MAX_GUESSES = 6;
const WORD_LENGTH = 5;

export default function App() {
  const [targetWord, setTargetWord] = useState(getRandomWord);
  const [guesses, setGuesses] = useState([]);
  const [currentGuess, setCurrentGuess] = useState('');
  const [gameOver, setGameOver] = useState(false);
  const [message, setMessage] = useState('');

  const letterStates = buildLetterStates(guesses, targetWord);

  const handleKey = useCallback((key) => {
    if (gameOver) return;

    if (key === 'BACKSPACE') {
      setCurrentGuess(prev => prev.slice(0, -1));
      setMessage('');
      return;
    }

    if (key === 'ENTER') {
      if (currentGuess.length !== WORD_LENGTH) {
        setMessage('Not enough letters!');
        return;
      }

      if (!WORDS.includes(currentGuess)) {
        setMessage('Not in word list!');
        return;
      }

      const newGuesses = [...guesses, currentGuess];
      setGuesses(newGuesses);
      setCurrentGuess('');
      setMessage('');

      if (currentGuess === targetWord) {
        setGameOver(true);
        setMessage('YOU WIN!');
      } else if (newGuesses.length >= MAX_GUESSES) {
        setGameOver(true);
        setMessage(`GAME OVER — the word was ${targetWord}`);
      }
      return;
    }

    if (/^[A-Z]$/.test(key) && currentGuess.length < WORD_LENGTH) {
      setCurrentGuess(prev => prev + key);
      setMessage('');
    }
  }, [currentGuess, guesses, gameOver, targetWord]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;

      if (e.key === 'Enter') {
        handleKey('ENTER');
      } else if (e.key === 'Backspace') {
        handleKey('BACKSPACE');
      } else if (/^[a-zA-Z]$/.test(e.key)) {
        handleKey(e.key.toUpperCase());
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKey]);

  const handleNewGame = () => {
    setTargetWord(getRandomWord());
    setGuesses([]);
    setCurrentGuess('');
    setGameOver(false);
    setMessage('');
  };

  return (
    <div className="app">
      <header className="header">
        <h1 className="title">
          <span className="title-accent">WORDLE</span> ARCADE
        </h1>
      </header>

      <div className="message-bar">
        {message && (
          <div className={`message ${gameOver ? 'game-over' : 'warning'}`}>
            {message}
          </div>
        )}
      </div>

      <Grid
        guesses={guesses}
        currentGuess={currentGuess}
        targetWord={targetWord}
        maxGuesses={MAX_GUESSES}
      />

      <Keyboard onKey={handleKey} letterStates={letterStates} />

      {gameOver && (
        <button className="new-game-btn" onClick={handleNewGame}>
          PLAY AGAIN
        </button>
      )}
    </div>
  );
}

function buildLetterStates(guesses, target) {
  const states = {};
  const priority = { correct: 3, present: 2, absent: 1 };

  for (const guess of guesses) {
    const colors = getLetterColors(guess, target);
    guess.split('').forEach((letter, i) => {
      const current = states[letter];
      const next = colors[i];
      if (!current || priority[next] > priority[current]) {
        states[letter] = next;
      }
    });
  }

  return states;
}
