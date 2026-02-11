/**
 * Power-up logic for Hudson River Runner.
 * Pure functions: spawn, update, collision detection, effect timing.
 *
 * Power-up types:
 *   shield   – invincible for 4 s, smash through icebergs
 *   slowmo   – halves scroll speed for 4 s
 *   magnet   – pushes nearby icebergs aside for 5 s
 *   boost    – 2× distance gain for 5 s
 *   shrink   – shrinks boat to 60 % width for 5 s
 */
import { checkCollision } from './gameLogic';

// --- Duration / effect constants ---
export const SHIELD_DURATION_MS = 4000;
export const SLOWMO_DURATION_MS = 4000;
export const MAGNET_DURATION_MS = 5000;
export const BOOST_DURATION_MS = 5000;
export const SHRINK_DURATION_MS = 5000;

export const SLOWMO_MULTIPLIER = 0.5;
export const BOOST_MULTIPLIER = 2.0;
export const SHRINK_SCALE = 0.6;
export const MAGNET_PUSH_RADIUS_RATIO = 0.22; // fraction of canvas width
export const MAGNET_PUSH_STRENGTH = 4;

// --- Spawn tuning ---
const POWERUP_SPAWN_INTERVAL_MIN = 6000;
const POWERUP_SPAWN_INTERVAL_MAX = 10000;
const POWERUP_SIZE_RATIO = 0.045;

export const POWERUP_TYPES = ['shield', 'slowmo', 'magnet', 'boost', 'shrink'];

export const POWERUP_DURATIONS = {
  shield: SHIELD_DURATION_MS,
  slowmo: SLOWMO_DURATION_MS,
  magnet: MAGNET_DURATION_MS,
  boost: BOOST_DURATION_MS,
  shrink: SHRINK_DURATION_MS,
};

/**
 * Spawn a power-up at random intervals (6–10 s). Mutates state.powerUps.
 */
export function maybeSpawnPowerUp(state, now) {
  if (!state._nextPowerUpTime) {
    state._nextPowerUpTime = now + randomInterval();
  }
  if (now < state._nextPowerUpTime) return;

  state._nextPowerUpTime = now + randomInterval();

  const size = state.width * POWERUP_SIZE_RATIO;
  const minX = state.riverLeft;
  const maxX = state.riverRight - size;
  const x = minX + Math.random() * (maxX - minX);
  const type = POWERUP_TYPES[Math.floor(Math.random() * POWERUP_TYPES.length)];

  state.powerUps.push({
    id: now,
    type,
    x,
    y: -size,
    width: size,
    height: size,
    spawnTime: now,
  });
}

/**
 * Move power-ups downward, remove off-screen ones, and expire active effects.
 */
export function updatePowerUps(state, deltaMs, now) {
  const speed = getEffectiveScrollSpeed(state, now);
  const dy = speed * (deltaMs / 16);

  state.powerUps.forEach((pu) => {
    pu.y += dy;
  });
  state.powerUps = state.powerUps.filter((pu) => pu.y < state.height + pu.height);

  // Expire active power-up
  if (state.activePowerUp && now >= state.powerUpEndTime) {
    state.activePowerUp = null;
    state.powerUpEndTime = 0;
  }
}

/**
 * Check if the boat collects any power-up. On collect, activate effect.
 */
export function checkPowerUpCollision(state, now) {
  const collected = state.powerUps.findIndex((pu) => checkCollision(state.boat, pu));
  if (collected === -1) return;

  const pu = state.powerUps[collected];
  state.powerUps.splice(collected, 1);

  state.activePowerUp = pu.type;
  state.powerUpEndTime = now + (POWERUP_DURATIONS[pu.type] || 4000);
}

/**
 * Returns true when the shield is currently active.
 */
export function isInvincible(state, now) {
  return state.activePowerUp === 'shield' && now < state.powerUpEndTime;
}

/**
 * Returns the effective scroll speed (halved during slow-mo).
 */
export function getEffectiveScrollSpeed(state, now) {
  if (state.activePowerUp === 'slowmo' && now < state.powerUpEndTime) {
    return state.scrollSpeed * SLOWMO_MULTIPLIER;
  }
  return state.scrollSpeed;
}

/**
 * Returns the distance multiplier (2× during boost).
 */
export function getDistanceMultiplier(state, now) {
  if (state.activePowerUp === 'boost' && now < state.powerUpEndTime) {
    return BOOST_MULTIPLIER;
  }
  return 1;
}

/**
 * Apply magnet repulsion – push icebergs away from the boat.
 */
export function applyMagnetEffect(state, now) {
  if (state.activePowerUp !== 'magnet' || now >= state.powerUpEndTime) return;

  const bCx = state.boat.x + state.boat.width / 2;
  const bCy = state.boat.y + state.boat.height / 2;
  const radius = state.width * MAGNET_PUSH_RADIUS_RATIO;

  state.icebergs.forEach((ice) => {
    const iCx = ice.x + ice.width / 2;
    const iCy = ice.y + ice.height / 2;
    const dx = iCx - bCx;
    const dy = iCy - bCy;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < radius && dist > 0) {
      const force = MAGNET_PUSH_STRENGTH * (1 - dist / radius);
      ice.x += (dx / dist) * force;
      ice.y += (dy / dist) * force;
    }
  });
}

/**
 * Returns the boat width scale factor (shrunk when shrink active).
 */
export function getBoatScale(state, now) {
  if (state.activePowerUp === 'shrink' && now < state.powerUpEndTime) {
    return SHRINK_SCALE;
  }
  return 1;
}

// --- Helpers ---
function randomInterval() {
  return (
    POWERUP_SPAWN_INTERVAL_MIN +
    Math.random() * (POWERUP_SPAWN_INTERVAL_MAX - POWERUP_SPAWN_INTERVAL_MIN)
  );
}
