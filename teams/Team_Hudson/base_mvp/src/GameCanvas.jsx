import { useRef, useEffect, useState, useCallback } from 'react'
import {
  createIceberg,
  moveIcebergs,
  moveBoat,
  checkCollision,
  distanceToMiles,
  MILES_TO_WIN,
  BOAT_WIDTH,
  BOAT_HEIGHT,
  defaultDifficulty,
} from './gameLogic'
import { drawRiver, drawBoat, drawIceberg, drawHUD } from './renderer'

const PIXELS_PER_MILE = 400
const BOAT_Y_OFFSET = 0.82

export default function GameCanvas({
  isPlaying,
  onWin,
  onLose,
  difficultyConfig = defaultDifficulty,
}) {
  const canvasRef = useRef(null)
  const [dimensions, setDimensions] = useState({ width: 800, height: 500 })
  const stateRef = useRef({
    boatX: 0,
    scrollOffset: 0,
    icebergs: [],
    lastSpawn: 0,
    distance: 0,
  })
  const keysRef = useRef({ left: false, right: false })

  const { spawnIntervalMs, scrollSpeed, maxIcebergs } = difficultyConfig

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const resize = () => {
      const w = Math.min(800, window.innerWidth - 32)
      const h = Math.min(500, window.innerHeight - 120)
      canvas.width = w
      canvas.height = h
      setDimensions({ width: w, height: h })
    }
    resize()
    window.addEventListener('resize', resize)
    return () => window.removeEventListener('resize', resize)
  }, [])

  useEffect(() => {
    if (!isPlaying || !canvasRef.current) return
    const canvas = canvasRef.current
    const w = canvas.width
    const h = canvas.height
    stateRef.current = {
      boatX: w / 2,
      scrollOffset: 0,
      icebergs: [],
      lastSpawn: 0,
      distance: 0,
    }
  }, [isPlaying])

  useEffect(() => {
    const onKey = (e) => {
      const down = e.type === 'keydown'
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        keysRef.current.left = down
        e.preventDefault()
      }
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        keysRef.current.right = down
        e.preventDefault()
      }
      if (e.key === ' ' && down) e.preventDefault()
    }
    window.addEventListener('keydown', onKey)
    window.addEventListener('keyup', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('keyup', onKey)
    }
  }, [])

  const gameLoop = useCallback(() => {
    const canvas = canvasRef.current
    if (!isPlaying || !canvas || !onWin || !onLose) return
    const ctx = canvas.getContext('2d')
    const w = canvas.width
    const h = canvas.height
    const boatY = h * BOAT_Y_OFFSET
    const state = stateRef.current

    const dt = 1000 / 60
    const movePerFrame = (scrollSpeed * 60) / 60
    state.scrollOffset += movePerFrame
    state.distance = distanceToMiles(state.scrollOffset, PIXELS_PER_MILE)

    if (state.distance >= MILES_TO_WIN) {
      onWin()
      return
    }

    const now = Date.now()
    if (state.icebergs.length < maxIcebergs && now - state.lastSpawn >= spawnIntervalMs) {
      state.icebergs.push(createIceberg(w))
      state.lastSpawn = now
    }
    state.icebergs = moveIcebergs(state.icebergs, scrollSpeed * 2)

    let dx = 0
    if (keysRef.current.left) dx -= 6
    if (keysRef.current.right) dx += 6
    state.boatX = moveBoat(state.boatX, dx, w)

    if (checkCollision(state.boatX, boatY, state.icebergs)) {
      onLose()
      return
    }

    drawRiver(ctx, w, h, state.scrollOffset)
    state.icebergs.forEach((b) => drawIceberg(ctx, b))
    drawBoat(ctx, state.boatX, boatY, w)
    drawHUD(ctx, state.distance, w)

    requestAnimationFrame(gameLoop)
  }, [isPlaying, onWin, onLose, scrollSpeed, spawnIntervalMs, maxIcebergs])

  useEffect(() => {
    if (!isPlaying) return
    const id = requestAnimationFrame(gameLoop)
    return () => cancelAnimationFrame(id)
  }, [isPlaying, gameLoop])

  if (!isPlaying) return null
  return (
    <canvas
      ref={canvasRef}
      width={dimensions.width}
      height={dimensions.height}
      style={{ display: 'block', background: '#0d2d44' }}
      tabIndex={0}
    />
  )
}
