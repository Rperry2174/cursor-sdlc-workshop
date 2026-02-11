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
import { updateNowPassingLandmark, preloadLandmarkImages } from './Landmarks';
import { drawFrame } from './renderer';
import { soundManager } from './soundManager';

const CANVAS_WIDTH = 900;
const CANVAS_HEIGHT = 560;

export default function GameCanvas({ onWin, onLose }) {
  const canvasRef = useRef(null);
  const stateRef = useRef(null);
  const loopRef = useRef(null);
  const lastTimeRef = useRef(0);
  const keysRef = useRef({ left: false, right: false });
  const soundStartedRef = useRef(false);

  const initState = useCallback(() => {
    if (!stateRef.current) {
      stateRef.current = createInitialState(CANVAS_WIDTH, CANVAS_HEIGHT);
    } else {
      const fresh = createInitialState(CANVAS_WIDTH, CANVAS_HEIGHT);
      stateRef.current = fresh;
    }
  }, []);

  // Initialize sound manager (sound will start on first user interaction)
  useEffect(() => {
    soundManager.init();

    return () => {
      soundManager.stopWaterSound();
    };
  }, []);

  useEffect(() => {
    preloadLandmarkImages();
  }, []);

  useEffect(() => {
    initState();
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;

    const handleKeyDown = (e) => {
      // Start sound on first user interaction if not already started
      if (!soundStartedRef.current) {
        soundStartedRef.current = true;
        soundManager.init();
        soundManager.resumeIfNeeded().then(() => {
          soundManager.startWaterSound();
        });
      }
      
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
      updateNowPassingLandmark(state, timestamp);

      if (detectCollision(state)) {
        soundManager.stopWaterSound();
        soundManager.playMyHeartWillGoOn();
        onLose();
        return;
      }
      if (hasWon(state)) {
        soundManager.stopWaterSound();
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
