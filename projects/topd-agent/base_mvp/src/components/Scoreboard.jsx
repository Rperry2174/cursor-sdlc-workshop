import { useState } from 'react';
import './Scoreboard.css';

const STORAGE_KEY = 'ccsweeper_highscores';
const MAX_ENTRIES = 3;
const MAX_NAME_LENGTH = 5;

export function loadScores() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

export function saveScore(name, time) {
  const scores = loadScores();
  scores.push({ name: name.toUpperCase(), time });
  scores.sort((a, b) => a.time - b.time);
  const trimmed = scores.slice(0, MAX_ENTRIES);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
  return trimmed;
}

export function qualifiesForBoard(time) {
  const scores = loadScores();
  if (scores.length < MAX_ENTRIES) return true;
  return time < scores[scores.length - 1].time;
}

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return mins > 0 ? `${mins}:${String(secs).padStart(2, '0')}` : `${secs}s`;
}

export default function Scoreboard({ pendingTime, onScoreSubmitted }) {
  const [scores, setScores] = useState(loadScores);
  const [name, setName] = useState('');
  const showInput = pendingTime !== null;

  function handleSubmit(e) {
    e.preventDefault();
    if (name.trim().length === 0) return;
    const updated = saveScore(name.trim(), pendingTime);
    setScores(updated);
    setName('');
    onScoreSubmitted();
  }

  return (
    <div className="scoreboard">
      <h2 className="scoreboard-title">Leaderboard</h2>

      {scores.length === 0 && !showInput && (
        <p className="scoreboard-empty">No scores yet. Win a game!</p>
      )}

      <ol className="scoreboard-list">
        {scores.map((entry, i) => (
          <li key={i} className="scoreboard-entry">
            <span className="entry-rank">#{i + 1}</span>
            <span className="entry-name">{entry.name}</span>
            <span className="entry-time">{formatTime(entry.time)}</span>
          </li>
        ))}
      </ol>

      {showInput && (
        <form className="name-entry" onSubmit={handleSubmit}>
          <p className="name-prompt">New high score! Enter your name:</p>
          <div className="name-input-row">
            <input
              className="name-input"
              type="text"
              maxLength={MAX_NAME_LENGTH}
              value={name}
              onChange={e => setName(e.target.value.slice(0, MAX_NAME_LENGTH))}
              placeholder="NAME"
              autoFocus
            />
            <button className="name-submit" type="submit" disabled={name.trim().length === 0}>
              Save
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
