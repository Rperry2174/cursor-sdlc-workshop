/**
 * Canvas drawing for Hudson River Runner.
 * Draws river, banks, boat, icebergs, and HUD (distance meter).
 */

export function drawFrame(ctx, state) {
  const { width, height, riverLeft, riverRight, boat, icebergs, distance, milesToWin } = state;

  // Sky / background
  ctx.fillStyle = '#1a2a3a';
  ctx.fillRect(0, 0, width, height);

  // Left bank (green-gray)
  ctx.fillStyle = '#3d5a4a';
  ctx.fillRect(0, 0, riverLeft, height);

  // River (blue)
  ctx.fillStyle = '#2a4a6a';
  ctx.fillRect(riverLeft, 0, riverRight - riverLeft, height);

  // Right bank
  ctx.fillStyle = '#4a5a5a';
  ctx.fillRect(riverRight, 0, width - riverRight, height);

  // River highlight (lighter strip)
  ctx.fillStyle = 'rgba(100, 180, 220, 0.2)';
  ctx.fillRect(riverLeft, 0, riverRight - riverLeft, height);

  // Icebergs (white/gray with shadow)
  icebergs.forEach((ice) => {
    ctx.fillStyle = '#a0b0c0';
    ctx.fillRect(ice.x, ice.y, ice.width, ice.height);
    ctx.strokeStyle = '#e8f0f8';
    ctx.lineWidth = 2;
    ctx.strokeRect(ice.x, ice.y, ice.width, ice.height);
  });

  // Boat (simple rectangle, brown/white)
  ctx.fillStyle = '#8b6914';
  ctx.fillRect(boat.x, boat.y, boat.width, boat.height);
  ctx.fillStyle = '#fff8dc';
  ctx.fillRect(boat.x + 4, boat.y + 2, boat.width - 8, boat.height / 2);
  ctx.strokeStyle = '#5a4a10';
  ctx.lineWidth = 2;
  ctx.strokeRect(boat.x, boat.y, boat.width, boat.height);

  // HUD: distance meter
  const miles = (distance).toFixed(1);
  ctx.fillStyle = 'rgba(0,0,0,0.5)';
  ctx.fillRect(width / 2 - 100, 12, 200, 32);
  ctx.strokeStyle = '#fff';
  ctx.lineWidth = 1;
  ctx.strokeRect(width / 2 - 100, 12, 200, 32);
  ctx.fillStyle = '#fff';
  ctx.font = '16px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(`${miles} mi / ${milesToWin} mi to the ocean`, width / 2, 32);
}
