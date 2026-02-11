/**
 * NYC Landmarks for Hudson River Runner.
 * Uses Nano Banana–generated images from public/landmarks/ when available;
 * falls back to canvas silhouette drawFn otherwise.
 */
import { LANDMARKS, LANDMARK_PIXELS_PER_MILE } from './landmarkData';

const NOW_PASSING_RANGE = 0.2;
const NOW_PASSING_DURATION_MS = 2500;

/** Cache of loaded landmark images (keyed by imageFile). Populated by preloadLandmarkImages(). */
const landmarkImageCache = {};

/**
 * Preload landmark images from public/landmarks/ (Nano Banana–generated).
 * Call once from GameCanvas mount. Images draw when loaded; until then we use drawFn.
 */
export function preloadLandmarkImages() {
  const base = import.meta.env.BASE_URL || '/';
  for (const lm of LANDMARKS) {
    if (!lm.imageFile || landmarkImageCache[lm.imageFile]) continue;
    const img = new Image();
    img.src = `${base}landmarks/${lm.imageFile}`;
    landmarkImageCache[lm.imageFile] = img;
  }
}

/**
 * Update state.nowPassingLandmark based on distance and time.
 * Call from game loop each frame. Mutates state.
 */
export function updateNowPassingLandmark(state, now) {
  if (state.nowPassingLandmark && now > state.nowPassingLandmark.showUntil) {
    state.nowPassingLandmark = null;
  }
  for (const lm of LANDMARKS) {
    const dist = Math.abs(state.distance - lm.milesAt);
    if (dist <= NOW_PASSING_RANGE) {
      if (!state.nowPassingLandmark || state.nowPassingLandmark.name !== lm.name) {
        state.nowPassingLandmark = { name: lm.name, showUntil: now + NOW_PASSING_DURATION_MS };
      }
      return;
    }
  }
}

function drawOneLandmark(ctx, lm, state, screenY, landmarkHeight) {
  const { width, height, riverLeft, riverRight } = state;
  const useImage = lm.imageFile && landmarkImageCache[lm.imageFile]?.complete;

  if (useImage) {
    const img = landmarkImageCache[lm.imageFile];
    if (lm.side === 'both') {
      ctx.drawImage(img, 0, screenY, width, landmarkHeight);
    } else if (lm.side === 'left') {
      ctx.drawImage(img, 0, screenY, riverLeft, landmarkHeight);
    } else {
      ctx.drawImage(img, riverRight, screenY, width - riverRight, landmarkHeight);
    }
    return;
  }

  if (lm.side === 'both') {
    lm.drawFn(ctx, 0, screenY, width, landmarkHeight);
  } else if (lm.side === 'left') {
    lm.drawFn(ctx, 0, screenY, riverLeft, landmarkHeight);
  } else {
    lm.drawFn(ctx, riverRight, screenY, width - riverRight, landmarkHeight);
  }
}

/**
 * Draw all visible landmarks on the canvas and "Now passing" text if set.
 * Uses Nano Banana images from preload when loaded; otherwise canvas silhouettes.
 */
export function drawLandmarks(ctx, state) {
  const { width, height, riverLeft, riverRight, distance } = state;
  const landmarkHeight = 180;

  for (const lm of LANDMARKS) {
    const screenY = (lm.milesAt - distance) * LANDMARK_PIXELS_PER_MILE;
    if (screenY > height + landmarkHeight || screenY < -landmarkHeight) continue;

    ctx.save();

    if (lm.side === 'left') {
      ctx.beginPath();
      ctx.rect(0, 0, riverLeft, height);
      ctx.clip();
    } else if (lm.side === 'right') {
      ctx.beginPath();
      ctx.rect(riverRight, 0, width - riverRight, height);
      ctx.clip();
    }

    drawOneLandmark(ctx, lm, state, screenY, landmarkHeight);
    ctx.restore();
  }

  if (state.nowPassingLandmark) {
    ctx.fillStyle = 'rgba(0,0,0,0.6)';
    ctx.fillRect(width / 2 - 140, height - 48, 280, 36);
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 1;
    ctx.strokeRect(width / 2 - 140, height - 48, 280, 36);
    ctx.fillStyle = '#fff';
    ctx.font = '18px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`Now passing: ${state.nowPassingLandmark.name}`, width / 2, height - 24);
  }
}
