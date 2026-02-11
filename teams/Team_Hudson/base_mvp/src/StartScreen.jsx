/**
 * Title screen. Press Space to start the game.
 * Shows personal best from localStorage if available.
 */
import { useEffect, useState } from 'react';
import { getBestScores } from './Scoreboard';

function formatTime(ms) {
  if (!ms || ms <= 0) return null;
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const tenths = Math.floor((ms % 1000) / 100);
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${tenths}`;
}

export default function StartScreen({ onStart }) {
  const [best, setBest] = useState(getBestScores);

  useEffect(() => {
    setBest(getBestScores());
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (e.code === 'Space') {
        e.preventDefault();
        onStart();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onStart]);

  const hasBest = best.bestDistance > 0;

  return (
    <div className="start-screen">
      {/* Decorative snowflakes */}
      <div className="snowflakes" aria-hidden="true">
        <span className="flake">&#10052;</span>
        <span className="flake">&#10053;</span>
        <span className="flake">&#10052;</span>
      </div>

      <div className="start-hero">
        <span className="hero-icon">&#9973;</span>
        <h1>Hudson River Runner</h1>
        <p className="tagline">Navigate the frozen Hudson. Dodge the ice. Reach the Atlantic.</p>
      </div>

      <div className="start-card">
        <p className="controls">
          <kbd>&larr;</kbd> <kbd>&rarr;</kbd> or <kbd>A</kbd> <kbd>D</kbd> to steer
        </p>

        <div className="start-divider" />

        {hasBest ? (
          <div className="best-card">
            <div className="best-label">Personal Best</div>
            <div className="best-row">
              <span className="best-distance">{best.bestDistance.toFixed(1)} mi</span>
              {best.bestTime > 0 && (
                <span className="best-time">{formatTime(best.bestTime)}</span>
              )}
            </div>
          </div>
        ) : (
          <p className="no-best">No records yet &mdash; chart your first course!</p>
        )}

        <div className="start-divider" />

        <button type="button" onClick={onStart} className="start-button">
          Set Sail
          <span className="btn-hint">or press Space</span>
        </button>
      </div>
    </div>
  );
}
