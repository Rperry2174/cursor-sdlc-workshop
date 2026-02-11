const MILES_TO_WIN = 12
const BOAT_WIDTH = 40
const BOAT_HEIGHT = 24
const ICEBERG_RADIUS = 28

export const defaultDifficulty = {
  spawnIntervalMs: 1200,
  scrollSpeed: 3.5,
  maxIcebergs: 5,
}

export function createIceberg(canvasWidth) {
  return {
    x: ICEBERG_RADIUS + Math.random() * (canvasWidth - ICEBERG_RADIUS * 2),
    y: -ICEBERG_RADIUS * 2,
    r: ICEBERG_RADIUS,
  }
}

export function moveIcebergs(icebergs, scrollSpeed) {
  return icebergs.map((b) => ({ ...b, y: b.y + scrollSpeed })).filter((b) => b.y < 1e4)
}

export function moveBoat(boatX, dx, canvasWidth) {
  const half = BOAT_WIDTH / 2
  return Math.max(half, Math.min(canvasWidth - half, boatX + dx))
}

export function checkCollision(boatX, boatY, icebergs) {
  const bx = boatX
  const by = boatY
  const hw = BOAT_WIDTH / 2
  const hh = BOAT_HEIGHT / 2
  for (const b of icebergs) {
    const dx = Math.abs(bx - b.x)
    const dy = Math.abs(by - b.y)
    const closestX = Math.max(b.x - hw, Math.min(b.x + hw, bx))
    const closestY = Math.max(b.y - hh, Math.min(b.y + hh, by))
    const dist = Math.hypot(b.x - closestX, b.y - closestY)
    if (dist <= b.r) return true
  }
  return false
}

export function distanceToMiles(pixels, pixelsPerMile) {
  return Math.min(MILES_TO_WIN, pixels / pixelsPerMile)
}

export { MILES_TO_WIN, BOAT_WIDTH, BOAT_HEIGHT }
