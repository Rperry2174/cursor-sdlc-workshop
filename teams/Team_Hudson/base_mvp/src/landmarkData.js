/**
 * NYC/Hudson River landmark definitions for Hudson River Runner.
 * Each landmark: { name, milesAt, side, imageFile?, drawFn(ctx, x, y, w, h) }
 * imageFile: filename in public/landmarks/ (from Nano Banana generation). Falls back to drawFn if not loaded.
 */

export const LANDMARK_PIXELS_PER_MILE = 1200;

export const LANDMARKS = [
  {
    name: 'Midtown Skyline',
    milesAt: 1,
    side: 'right',
    imageFile: 'midtown.png',
    drawFn(ctx, x, y, w, h) {
      ctx.fillStyle = '#1e2a35';
      const buildingHeights = [0.9, 0.5, 0.7, 0.4, 0.85, 0.55, 0.65];
      const bw = w / (buildingHeights.length + 1);
      buildingHeights.forEach((frac, i) => {
        const bx = x + (i + 0.5) * bw;
        ctx.fillRect(bx, y + h * (1 - frac), bw * 0.9, h * frac);
      });
    },
  },
  {
    name: 'George Washington Bridge',
    milesAt: 3,
    side: 'both',
    imageFile: 'gw-bridge.png',
    drawFn(ctx, x, y, w, h) {
      ctx.strokeStyle = '#2d3a45';
      ctx.lineWidth = 8;
      ctx.beginPath();
      ctx.moveTo(0, y + h * 0.4);
      ctx.lineTo(w, y + h * 0.4);
      ctx.stroke();
      ctx.fillStyle = '#2d3a45';
      ctx.fillRect(0, y + h * 0.35, w * 0.15, h * 0.15);
      ctx.fillRect(w * 0.85, y + h * 0.35, w * 0.15, h * 0.15);
    },
  },
  {
    name: 'Palisades Cliffs',
    milesAt: 6,
    side: 'left',
    imageFile: 'palisades.png',
    drawFn(ctx, x, y, w, h) {
      ctx.fillStyle = '#354035';
      ctx.beginPath();
      ctx.moveTo(x + w, y + h);
      ctx.lineTo(x + w, y + h * 0.3);
      ctx.lineTo(x + w * 0.6, y + h * 0.5);
      ctx.lineTo(x + w * 0.3, y + h * 0.2);
      ctx.lineTo(x, y + h * 0.4);
      ctx.lineTo(x, y + h);
      ctx.closePath();
      ctx.fill();
    },
  },
  {
    name: 'Bayonne Bridge',
    milesAt: 9,
    side: 'both',
    imageFile: 'bayonne-bridge.png',
    drawFn(ctx, x, y, w, h) {
      ctx.strokeStyle = '#2a3540';
      ctx.lineWidth = 6;
      const archY = y + h * 0.5;
      ctx.beginPath();
      ctx.moveTo(0, archY + h * 0.2);
      ctx.quadraticCurveTo(w / 2, archY - h * 0.3, w, archY + h * 0.2);
      ctx.stroke();
      ctx.fillStyle = '#2a3540';
      ctx.fillRect(0, archY, w * 0.08, h * 0.25);
      ctx.fillRect(w * 0.92, archY, w * 0.08, h * 0.25);
    },
  },
  {
    name: 'Statue of Liberty',
    milesAt: 11.5,
    side: 'right',
    imageFile: 'statue-of-liberty.png',
    drawFn(ctx, x, y, w, h) {
      ctx.fillStyle = '#2d3a35';
      const baseW = w * 0.5;
      const baseX = x + (w - baseW) / 2;
      ctx.fillRect(baseX, y + h * 0.6, baseW, h * 0.4);
      ctx.beginPath();
      ctx.moveTo(baseX + baseW / 2, y + h * 0.6);
      ctx.lineTo(baseX + baseW / 2 - 15, y + h * 0.2);
      ctx.lineTo(baseX + baseW / 2, y);
      ctx.lineTo(baseX + baseW / 2 + 15, y + h * 0.2);
      ctx.closePath();
      ctx.fill();
      ctx.beginPath();
      ctx.arc(baseX + baseW / 2, y + h * 0.15, 8, 0, Math.PI * 2);
      ctx.fill();
    },
  },
];
