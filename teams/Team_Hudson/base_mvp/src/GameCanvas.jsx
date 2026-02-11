/**
 * Game canvas: runs the game loop, handles keyboard input,
 * and delegates to gameLogic and renderer.
 */
import { useRef, useEffect, useCallback } from 'react';
import {
  createInitialState,
  maybeSpawnIceberg,
  updateBoat,
  updateIcebergsAndDistance,
  detectCollision,
  hasWon,
} from './gameLogic';
import { drawFrame } from './renderer';

const CANVAS_WIDTH = 900;
const CANVAS_HEIGHT = 560;

export default function GameCanvas({ onWin, onLose }) {
  const canvasRef = useRef(null);
  const stateRef = useRef(null);
  const loopRef = useRef(null);
  const lastTimeRef = useRef(0);
  const keysRef = useRef({ left: false, right: false });

  const initState = useCallback(() => {
    if (!stateRef.current) {
      stateRef.current = createInitialState(CANVAS_WIDTH, CANVAS_HEIGHT);
    } else {
      const fresh = createInitialState(CANVAS_WIDTH, CANVAS_HEIGHT);
      stateRef.current = fresh;
    }
  }, []);

  useEffect(() => {
    initState();
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;

    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') keysRef.current.left = true;
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') keysRef.current.right = true;
      e.preventDefault();
    };
    const handleKeyUp = (e) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') keysRef.current.left = false;
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') keysRef.current.right = false;
      e.preventDefault();
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    const loop = (timestamp) => {
      const state = stateRef.current;
      if (!state) {
        loopRef.current = requestAnimationFrame(loop);
        return;
      }

      const deltaMs = lastTimeRef.current ? timestamp - lastTimeRef.current : 16;
      lastTimeRef.current = timestamp;

      // Boat velocity from keys
      const BOAT_SPEED = 6;
      state.boat.vx = 0;
      if (keysRef.current.left) state.boat.vx = -BOAT_SPEED;
      if (keysRef.current.right) state.boat.vx = BOAT_SPEED;

      maybeSpawnIceberg(state, timestamp);
      updateBoat(state);
      updateIcebergsAndDistance(state, deltaMs);

      if (detectCollision(state)) {
        onLose();
        return;
      }
      if (hasWon(state)) {
        onWin();
        return;
      }

      drawFrame(ctx, state);
      loopRef.current = requestAnimationFrame(loop);
    };

    loopRef.current = requestAnimationFrame(loop);

    return () => {
      if (loopRef.current) cancelAnimationFrame(loopRef.current);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [onWin, onLose, initState]);

  return (
    <canvas
      ref={canvasRef}
      width={CANVAS_WIDTH}
      height={CANVAS_HEIGHT}
      style={{ display: 'block', background: '#1a2a3a' }}
      tabIndex={0}
      aria-label="Hudson River Runner game"
    />
  );
}
