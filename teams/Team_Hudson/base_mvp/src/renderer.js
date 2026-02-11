const RIVER_BLUE = '#1e5f8a'
const BANK_LEFT = '#2d4a3e'
const BANK_RIGHT = '#3d5a4e'
const BOAT_COLOR = '#c4a35a'
const ICEBERG_COLOR = '#e8f4fc'

export function drawRiver(ctx, width, height, scrollOffset) {
  const riverW = width * 0.6
  const left = (width - riverW) / 2
  ctx.fillStyle = BANK_LEFT
  ctx.fillRect(0, 0, left, height)
  ctx.fillStyle = BANK_RIGHT
  ctx.fillRect(width - left, 0, left, height)
  ctx.fillStyle = RIVER_BLUE
  ctx.fillRect(left, 0, riverW, height)
}

export function drawBoat(ctx, boatX, boatY, width) {
  const w = 40
  const h = 24
  const x = boatX - w / 2
  const y = boatY - h / 2
  ctx.fillStyle = BOAT_COLOR
  ctx.beginPath()
  ctx.moveTo(x + w / 2, y)
  ctx.lineTo(x + w, y + h)
  ctx.lineTo(x, y + h)
  ctx.closePath()
  ctx.fill()
  ctx.strokeStyle = '#8b7355'
  ctx.lineWidth = 2
  ctx.stroke()
}

export function drawIceberg(ctx, iceberg) {
  ctx.fillStyle = ICEBERG_COLOR
  ctx.beginPath()
  ctx.arc(iceberg.x, iceberg.y, iceberg.r, 0, Math.PI * 2)
  ctx.fill()
  ctx.strokeStyle = '#b0d0e8'
  ctx.lineWidth = 2
  ctx.stroke()
}

export function drawHUD(ctx, distance, width) {
  const text = `${distance.toFixed(1)} mi / 12 mi to the ocean`
  ctx.fillStyle = '#fff'
  ctx.font = '18px system-ui, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText(text, width / 2, 32)
}
