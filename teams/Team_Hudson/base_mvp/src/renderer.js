/**
 * Canvas drawing for Hudson River Runner.
 * Draws river, banks, boat, icebergs, landmarks, power-up pickups, and active-effect overlays.
 */
import { MAGNET_PUSH_RADIUS_RATIO } from './powerUpLogic';
import { drawLandmarks } from './Landmarks';

// ─── Color palette per power-up ──────────────────────────────
const PU_COLORS = {
  shield: { fill: '#3a7bd5', glow: '#7ab8ff', accent: '#b8dcff' },
  slowmo: { fill: '#e6a800', glow: '#fff7a0', accent: '#ffe066' },
  magnet: { fill: '#9b59b6', glow: '#d2a8ea', accent: '#e8ccf5' },
  boost:  { fill: '#e74c3c', glow: '#ff9a8b', accent: '#ffd6d0' },
  shrink: { fill: '#1abc9c', glow: '#76fce1', accent: '#b8fff0' },
};

// ─── Icon drawing helpers (canvas-only, no emoji) ────────────
function drawShieldIcon(ctx, cx, cy, r) {
  // Shield shape (pentagon-ish)
  ctx.beginPath();
  ctx.moveTo(cx, cy - r * 0.7);
  ctx.lineTo(cx + r * 0.6, cy - r * 0.35);
  ctx.lineTo(cx + r * 0.5, cy + r * 0.5);
  ctx.lineTo(cx, cy + r * 0.7);
  ctx.lineTo(cx - r * 0.5, cy + r * 0.5);
  ctx.lineTo(cx - r * 0.6, cy - r * 0.35);
  ctx.closePath();
  ctx.fillStyle = '#fff';
  ctx.globalAlpha = 0.9;
  ctx.fill();
  ctx.globalAlpha = 1;
}

function drawSlowmoIcon(ctx, cx, cy, r) {
  // Clock circle + hands
  ctx.beginPath();
  ctx.arc(cx, cy, r * 0.55, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(255,255,255,0.15)';
  ctx.fill();
  ctx.strokeStyle = '#fff';
  ctx.lineWidth = 1.5;
  ctx.stroke();
  // Hour hand
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.lineTo(cx, cy - r * 0.4);
  ctx.strokeStyle = '#fff';
  ctx.lineWidth = 2;
  ctx.stroke();
  // Minute hand
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.lineTo(cx + r * 0.28, cy + r * 0.1);
  ctx.stroke();
}

function drawMagnetIcon(ctx, cx, cy, r) {
  // U-shaped magnet
  const w = r * 0.35;
  ctx.beginPath();
  ctx.arc(cx, cy + r * 0.05, r * 0.45, Math.PI, 0, false);
  ctx.lineWidth = w;
  ctx.strokeStyle = '#fff';
  ctx.stroke();
  // Red/blue tips
  ctx.fillStyle = '#e74c3c';
  ctx.fillRect(cx - r * 0.45 - w / 2, cy + r * 0.05, w, r * 0.35);
  ctx.fillStyle = '#3498db';
  ctx.fillRect(cx + r * 0.45 - w / 2, cy + r * 0.05, w, r * 0.35);
}

function drawBoostIcon(ctx, cx, cy, r) {
  // Lightning bolt
  ctx.beginPath();
  ctx.moveTo(cx + r * 0.1, cy - r * 0.65);
  ctx.lineTo(cx - r * 0.25, cy + r * 0.05);
  ctx.lineTo(cx + r * 0.05, cy + r * 0.05);
  ctx.lineTo(cx - r * 0.1, cy + r * 0.65);
  ctx.lineTo(cx + r * 0.35, cy - r * 0.1);
  ctx.lineTo(cx + r * 0.05, cy - r * 0.1);
  ctx.closePath();
  ctx.fillStyle = '#fff';
  ctx.fill();
}

function drawShrinkIcon(ctx, cx, cy, r) {
  // Inward arrows
  const a = r * 0.55;
  ctx.strokeStyle = '#fff';
  ctx.lineWidth = 2;
  // top-left arrow
  ctx.beginPath();
  ctx.moveTo(cx - a, cy - a);
  ctx.lineTo(cx - a * 0.25, cy - a * 0.25);
  ctx.stroke();
  // top-right
  ctx.beginPath();
  ctx.moveTo(cx + a, cy - a);
  ctx.lineTo(cx + a * 0.25, cy - a * 0.25);
  ctx.stroke();
  // bottom-left
  ctx.beginPath();
  ctx.moveTo(cx - a, cy + a);
  ctx.lineTo(cx - a * 0.25, cy + a * 0.25);
  ctx.stroke();
  // bottom-right
  ctx.beginPath();
  ctx.moveTo(cx + a, cy + a);
  ctx.lineTo(cx + a * 0.25, cy + a * 0.25);
  ctx.stroke();
  // Small center square
  const s = r * 0.18;
  ctx.strokeRect(cx - s, cy - s, s * 2, s * 2);
}

const ICON_FNS = {
  shield: drawShieldIcon,
  slowmo: drawSlowmoIcon,
  magnet: drawMagnetIcon,
  boost:  drawBoostIcon,
  shrink: drawShrinkIcon,
};

// ─────────────────────────────────────────────────────────────
export function drawFrame(ctx, state, timestamp) {
  const { width, height, riverLeft, riverRight, boat, icebergs, activePowerUp, powerUpEndTime } = state;
  const now = timestamp || Date.now();
  const t = now / 1000; // seconds for animations

  // Sky / background
  ctx.fillStyle = '#1a2a3a';
  ctx.fillRect(0, 0, width, height);

  // Left bank
  ctx.fillStyle = '#3d5a4a';
  ctx.fillRect(0, 0, riverLeft, height);

  // River
  ctx.fillStyle = '#2a4a6a';
  ctx.fillRect(riverLeft, 0, riverRight - riverLeft, height);

  // Right bank
  ctx.fillStyle = '#4a5a5a';
  ctx.fillRect(riverRight, 0, width - riverRight, height);

  // River highlight
  ctx.fillStyle = 'rgba(100, 180, 220, 0.2)';
  ctx.fillRect(riverLeft, 0, riverRight - riverLeft, height);

  // ─── Magnet field aura ───────────────────────────────────
  if (activePowerUp === 'magnet' && now < powerUpEndTime) {
    const bCx = boat.x + boat.width / 2;
    const bCy = boat.y + boat.height / 2;
    const radius = width * MAGNET_PUSH_RADIUS_RATIO;
    const pulse = 0.85 + 0.15 * Math.sin(t * 4);
    const grad = ctx.createRadialGradient(bCx, bCy, 0, bCx, bCy, radius * pulse);
    grad.addColorStop(0, 'rgba(155, 89, 182, 0.25)');
    grad.addColorStop(0.6, 'rgba(155, 89, 182, 0.08)');
    grad.addColorStop(1, 'rgba(155, 89, 182, 0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(bCx, bCy, radius * pulse, 0, Math.PI * 2);
    ctx.fill();
  }

  // ─── Power-up pickups ──────────────────────────────────
  if (state.powerUps) {
    state.powerUps.forEach((pu) => {
      const cx = pu.x + pu.width / 2;
      const cy = pu.y + pu.height / 2;
      const r = pu.width / 2;
      const col = PU_COLORS[pu.type] || PU_COLORS.shield;

      // Bobbing animation
      const bob = Math.sin((now - pu.spawnTime) / 300) * 2;

      ctx.save();
      ctx.translate(0, bob);

      // Outer glow
      ctx.shadowColor = col.glow;
      ctx.shadowBlur = 14 + 4 * Math.sin(t * 3);

      // Background circle
      const bg = ctx.createRadialGradient(cx, cy, r * 0.15, cx, cy, r);
      bg.addColorStop(0, col.accent);
      bg.addColorStop(1, col.fill);
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fillStyle = bg;
      ctx.fill();

      // Bright ring
      ctx.strokeStyle = col.glow;
      ctx.lineWidth = 2;
      ctx.stroke();

      // Inner icon
      ctx.shadowBlur = 0;
      const drawIcon = ICON_FNS[pu.type];
      if (drawIcon) drawIcon(ctx, cx, cy, r);

      ctx.restore();
    });
  }

  // Landmarks (Task 7: NYC landmarks on banks + "Now passing" text)
  drawLandmarks(ctx, state);

  // ─── Icebergs ────────────────────────────────────────────
  icebergs.forEach((ice) => {
    ctx.fillStyle = '#a0b0c0';
    ctx.fillRect(ice.x, ice.y, ice.width, ice.height);
    ctx.strokeStyle = '#e8f0f8';
    ctx.lineWidth = 2;
    ctx.strokeRect(ice.x, ice.y, ice.width, ice.height);
  });

  // ─── Boat ────────────────────────────────────────────────
  const shieldActive = activePowerUp === 'shield' && now < powerUpEndTime;
  const boostActive = activePowerUp === 'boost' && now < powerUpEndTime;

  ctx.save();

  if (shieldActive) {
    // Pulsing blue shield aura
    const pulse = 0.8 + 0.2 * Math.sin(t * 5);
    ctx.shadowColor = '#3a7bd5';
    ctx.shadowBlur = 22 * pulse;
  }
  if (boostActive) {
    ctx.shadowColor = '#e74c3c';
    ctx.shadowBlur = 16;
  }

  ctx.fillStyle = '#8b6914';
  ctx.fillRect(boat.x, boat.y, boat.width, boat.height);
  ctx.fillStyle = '#fff8dc';
  ctx.fillRect(boat.x + 4, boat.y + 2, boat.width - 8, boat.height / 2);

  if (shieldActive) {
    ctx.strokeStyle = '#7ab8ff';
    ctx.lineWidth = 3;
  } else if (boostActive) {
    ctx.strokeStyle = '#ff9a8b';
    ctx.lineWidth = 2;
  } else {
    ctx.strokeStyle = '#5a4a10';
    ctx.lineWidth = 2;
  }
  ctx.strokeRect(boat.x, boat.y, boat.width, boat.height);

  // Shield bubble
  if (shieldActive) {
    const bCx = boat.x + boat.width / 2;
    const bCy = boat.y + boat.height / 2;
    const bR = Math.max(boat.width, boat.height) * 0.75;
    ctx.beginPath();
    ctx.arc(bCx, bCy, bR, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(122, 184, 255, ${0.4 + 0.2 * Math.sin(t * 6)})`;
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  // Boost exhaust particles
  if (boostActive) {
    for (let i = 0; i < 3; i++) {
      const px = boat.x + boat.width * 0.2 + Math.random() * boat.width * 0.6;
      const py = boat.y + boat.height + Math.random() * 8;
      const pr = 1.5 + Math.random() * 2.5;
      ctx.beginPath();
      ctx.arc(px, py, pr, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(231,76,60,${0.3 + Math.random() * 0.4})`;
      ctx.fill();
    }
  }

  ctx.restore();
}
