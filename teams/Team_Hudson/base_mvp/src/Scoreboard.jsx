/**
 * Scoreboard HUD overlay.
 * Shows live stats during play, final stats on game over,
 * and persists best scores to localStorage.
 */
import { useState, useEffect, useRef } from 'react';
import './Scoreboard.css';

const LS_BEST_DISTANCE = 'hudsonRunner_bestDistance';
const LS_BEST_TIME = 'hudsonRunner_bestTime';

/**
 * Read best scores from localStorage. Exported so StartScreen can use it too.
 */
export function getBestScores() {
  const bestDistance = Number(localStorage.getItem(LS_BEST_DISTANCE)) || 0;
  const bestTime = Number(localStorage.getItem(LS_BEST_TIME)) || 0;
  return { bestDistance, bestTime };
}

/**
 * Format milliseconds as mm:ss.t (tenths of a second).
 */
function formatTime(ms) {
  if (!ms || ms < 0) return '00:00.0';
  const totalSeconds = Math.floor(ms / 1000);
  const tenths = Math.floor((ms % 1000) / 100);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${tenths}`;
}

export default function Scoreboard({ gameState, distance, elapsedMs, milesToWin }) {
  const [milePop, setMilePop] = useState(false);
  const [isNewBest, setIsNewBest] = useState(false);
  const [bestScores, setBestScores] = useState(getBestScores);
  const lastMileRef = useRef(0);
  const savedRef = useRef(false);

  const miles = distance || 0;
  const milesStr = miles.toFixed(1);
  const progress = Math.min(miles / (milesToWin || 12), 1);
  const currentMile = Math.floor(miles);

  // Mile milestone pop
  useEffect(() => {
    if (gameState !== 'playing') return;
    if (currentMile > 0 && currentMile > lastMileRef.current) {
      lastMileRef.current = currentMile;
      setMilePop(true);
      const t = setTimeout(() => setMilePop(false), 500);
      return () => clearTimeout(t);
    }
  }, [currentMile, gameState]);

  // Reset on new game
  useEffect(() => {
    if (gameState === 'playing') {
      lastMileRef.current = 0;
      setMilePop(false);
      setIsNewBest(false);
      savedRef.current = false;
      setBestScores(getBestScores());
    }
  }, [gameState]);

  // Save best scores on game end
  useEffect(() => {
    if ((gameState === 'won' || gameState === 'lost') && !savedRef.current) {
      savedRef.current = true;
      const prev = getBestScores();
      let newBest = false;

      if (miles > prev.bestDistance) {
        localStorage.setItem(LS_BEST_DISTANCE, String(miles));
        newBest = true;
      }
      if (gameState === 'won' && elapsedMs > 0) {
        if (prev.bestTime === 0 || elapsedMs < prev.bestTime) {
          localStorage.setItem(LS_BEST_TIME, String(elapsedMs));
          newBest = true;
        }
      }
      setIsNewBest(newBest);
      setBestScores(getBestScores());
    }
  }, [gameState, miles, elapsedMs]);

  // ─── Playing HUD ─────────────────────────────────────────
  if (gameState === 'playing') {
    const glowIntensity = Math.floor(progress * 12);
    return (
      <div className="scoreboard scoreboard-playing fadeIn">
        <div className="sb-row">
          <span className="sb-label">TIME</span>
          <span className="sb-val">{formatTime(elapsedMs)}</span>
        </div>

        <div className={`sb-row${milePop ? ' mile-pop' : ''}`}>
          <span className="sb-label">DIST</span>
          <span className="sb-val">
            {milesStr}
            <span className="sb-unit">/{milesToWin} mi</span>
          </span>
        </div>

        <div className="sb-bar-track">
          <div
            className="sb-bar-fill"
            style={{
              width: `${progress * 100}%`,
              boxShadow: `0 0 ${4 + glowIntensity}px rgba(0, 212, 170, ${0.3 + progress * 0.5})`,
            }}
          />
        </div>

        {bestScores.bestDistance > 0 && (
          <div className="sb-best">
            BEST {bestScores.bestDistance.toFixed(1)} mi
          </div>
        )}
      </div>
    );
  }

  // ─── Game Over (won or lost) ─────────────────────────────
  if (gameState === 'won' || gameState === 'lost') {
    return (
      <div className={`scoreboard scoreboard-gameover slideIn ${gameState === 'lost' ? 'sb-lost' : 'sb-won'}`}>
        {isNewBest && (
          <div className="sb-new-record">
            <span className="sb-record-text">NEW RECORD</span>
          </div>
        )}

        <div className="sb-final-stats">
          <div className="sb-stat">
            <span className="sb-stat-label">Distance</span>
            <span className={`sb-stat-value${isNewBest ? ' gold' : ''}`}>
              {milesStr} mi
            </span>
          </div>
          <div className="sb-stat">
            <span className="sb-stat-label">Time</span>
            <span className={`sb-stat-value${isNewBest ? ' gold' : ''}`}>
              {formatTime(elapsedMs)}
            </span>
          </div>
        </div>

        {!isNewBest && bestScores.bestDistance > 0 && (
          <div className="sb-prev-best">
            Your best: {bestScores.bestDistance.toFixed(1)} mi
            {bestScores.bestTime > 0 && ` in ${formatTime(bestScores.bestTime)}`}
          </div>
        )}
      </div>
    );
  }

  return null;
}
