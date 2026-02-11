/**
 * Pure game logic for Hudson River Runner.
 * Spawns icebergs, moves objects, detects collisions, tracks distance.
 */

const MILES_TO_WIN = 12;
const RIVER_LEFT = 0.2;   // fraction of canvas width
const RIVER_RIGHT = 0.8;
const BOAT_WIDTH_RATIO = 0.08;
const BOAT_HEIGHT_RATIO = 0.06;
const ICEBERG_SIZE_RATIO = 0.06;
const SCROLL_SPEED = 3;
const SPAWN_INTERVAL_MS = 1500;
const MILES_PER_PIXEL = 0.00015;

/**
 * Create initial game state for given canvas dimensions.
 */
export function createInitialState(width, height) {
  const riverLeft = width * RIVER_LEFT;
  const riverRight = width * RIVER_RIGHT;
  const riverWidth = riverRight - riverLeft;
  const boatWidth = width * BOAT_WIDTH_RATIO;
  const boatHeight = height * BOAT_HEIGHT_RATIO;
  const boatY = height - boatHeight - 40;
  const boatX = (width - boatWidth) / 2;

  return {
    boat: { x: boatX, y: boatY, width: boatWidth, height: boatHeight, vx: 0 },
    icebergs: [],
    distance: 0,
    lastSpawnTime: 0,
    width,
    height,
    riverLeft,
    riverRight,
    riverWidth,
    scrollSpeed: SCROLL_SPEED,
    spawnIntervalMs: SPAWN_INTERVAL_MS,
    milesPerPixel: MILES_PER_PIXEL,
    milesToWin: MILES_TO_WIN,
  };
}

/**
 * Spawn a new iceberg if enough time has passed. Mutates state.icebergs.
 */
export function maybeSpawnIceberg(state, now) {
  if (now - state.lastSpawnTime < state.spawnIntervalMs) return;
  state.lastSpawnTime = now;

  const size = state.width * ICEBERG_SIZE_RATIO;
  const minX = state.riverLeft;
  const maxX = state.riverRight - size;
  const x = minX + Math.random() * (maxX - minX);
  state.icebergs.push({
    id: now,
    x,
    y: -size,
    width: size,
    height: size * 1.2,
  });
}

/**
 * Update boat position from velocity. Clamp to river bounds.
 */
export function updateBoat(state) {
  const b = state.boat;
  b.x += b.vx;
  b.x = Math.max(state.riverLeft, Math.min(state.riverRight - b.width, b.x));
}

/**
 * Move icebergs down and remove those off-screen. Add distance.
 */
export function updateIcebergsAndDistance(state, deltaMs) {
  const dy = state.scrollSpeed * (deltaMs / 16);
  state.distance += state.milesPerPixel * dy;

  state.icebergs.forEach((ice) => {
    ice.y += dy;
  });
  state.icebergs = state.icebergs.filter((ice) => ice.y < state.height + ice.height);
}

/**
 * Bounding-box collision between boat and an iceberg.
 */
export function checkCollision(boat, iceberg) {
  return (
    boat.x < iceberg.x + iceberg.width &&
    boat.x + boat.width > iceberg.x &&
    boat.y < iceberg.y + iceberg.height &&
    boat.y + boat.height > iceberg.y
  );
}

/**
 * Returns true if any iceberg collides with the boat.
 */
export function detectCollision(state) {
  return state.icebergs.some((ice) => checkCollision(state.boat, ice));
}

/**
 * Check if player has reached the ocean (won).
 */
export function hasWon(state) {
  return state.distance >= state.milesToWin;
}
