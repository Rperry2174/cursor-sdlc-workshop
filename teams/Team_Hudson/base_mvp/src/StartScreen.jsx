/**
 * Title screen. Press Space to start the game.
 */
import { useEffect } from 'react';

export default function StartScreen({ onStart }) {
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

  return (
    <div className="start-screen">
      <h1>Hudson River Runner</h1>
      <p>Dodge the icebergs. Reach the ocean.</p>
      <p className="controls">← → or A D to steer</p>
      <button type="button" onClick={onStart} className="start-button">
        Press Space to Start
      </button>
    </div>
  );
}
