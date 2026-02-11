/**
 * Game canvas: runs the game loop, handles keyboard input,
 * and delegates to gameLogic, powerUpLogic, and renderer.
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
import {
  maybeSpawnPowerUp,
  updatePowerUps,
  checkPowerUpCollision,
  isInvincible,
  getEffectiveScrollSpeed,
  getDistanceMultiplier,
  applyMagnetEffect,
  getBoatScale,
} from './powerUpLogic';
import { drawFrame } from './renderer';

const CANVAS_WIDTH = 900;
const CANVAS_HEIGHT = 560;

export default function GameCanvas({ onWin, onLose, onTick }) {
  const canvasRef = useRef(null);
  const stateRef = useRef(null);
  const loopRef = useRef(null);
  const lastTimeRef = useRef(0);
  const startTimeRef = useRef(null);
  const keysRef = useRef({ left: false, right: false });

  const initState = useCallback(() => {
    stateRef.current = createInitialState(CANVAS_WIDTH, CANVAS_HEIGHT);
  }, []);

  useEffect(() => {
    initState();
    startTimeRef.current = null;
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

      // Track elapsed time from first frame
      if (startTimeRef.current === null) startTimeRef.current = timestamp;
      const elapsedMs = timestamp - startTimeRef.current;

      const deltaMs = lastTimeRef.current ? timestamp - lastTimeRef.current : 16;
      lastTimeRef.current = timestamp;

      // ── Shrink effect: temporarily adjust boat width ──
      const boatScale = getBoatScale(state, timestamp);
      const originalWidth = state._originalBoatWidth || state.boat.width;
      if (!state._originalBoatWidth) state._originalBoatWidth = state.boat.width;
      const scaledWidth = originalWidth * boatScale;
      // Keep boat centered when shrinking
      if (state.boat.width !== scaledWidth) {
        const cx = state.boat.x + state.boat.width / 2;
        state.boat.width = scaledWidth;
        state.boat.x = cx - scaledWidth / 2;
      }

      // Boat velocity from keys
      const BOAT_SPEED = 6;
      state.boat.vx = 0;
      if (keysRef.current.left) state.boat.vx = -BOAT_SPEED;
      if (keysRef.current.right) state.boat.vx = BOAT_SPEED;

      maybeSpawnIceberg(state, timestamp);
      updateBoat(state);

      // Use effective scroll speed (halved during slow-mo) + distance multiplier (boost)
      const savedSpeed = state.scrollSpeed;
      state.scrollSpeed = getEffectiveScrollSpeed(state, timestamp);
      const savedMPP = state.milesPerPixel;
      state.milesPerPixel = savedMPP * getDistanceMultiplier(state, timestamp);
      updateIcebergsAndDistance(state, deltaMs);
      state.scrollSpeed = savedSpeed;
      state.milesPerPixel = savedMPP;

      // Power-up lifecycle
      maybeSpawnPowerUp(state, timestamp);
      updatePowerUps(state, deltaMs, timestamp);
      checkPowerUpCollision(state, timestamp);

      // Magnet repulsion
      applyMagnetEffect(state, timestamp);

      // Report current stats + power-up state to parent
      if (onTick) {
        onTick({
          distance: state.distance,
          elapsedMs,
          activePowerUp: state.activePowerUp,
          powerUpEndTime: state.powerUpEndTime,
          now: timestamp,
        });
      }

      // Collision — skip if shield active
      if (detectCollision(state)) {
        if (isInvincible(state, timestamp)) {
          // Destroy colliding icebergs instead of dying
          state.icebergs = state.icebergs.filter(
            (ice) =>
              !(
                state.boat.x < ice.x + ice.width &&
                state.boat.x + state.boat.width > ice.x &&
                state.boat.y < ice.y + ice.height &&
                state.boat.y + state.boat.height > ice.y
              ),
          );
        } else {
          onLose();
          return;
        }
      }
      if (hasWon(state)) {
        onWin();
        return;
      }

      drawFrame(ctx, state, timestamp);
      loopRef.current = requestAnimationFrame(loop);
    };

    loopRef.current = requestAnimationFrame(loop);

    return () => {
      if (loopRef.current) cancelAnimationFrame(loopRef.current);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [onWin, onLose, onTick, initState]);

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
