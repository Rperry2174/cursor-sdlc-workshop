/**
 * Resize a user-picked image to a small square JPEG data URL.
 *
 * Why: avatars get stored in localStorage. A raw 4MB iPhone photo
 * would blow past the ~5MB origin quota after only one upload. We
 * downscale + crop to a 256px square and re-encode as JPEG so each
 * avatar takes ~20-50KB.
 */
export async function compressImageToDataUrl(file, { maxSize = 256, quality = 0.82 } = {}) {
  if (!file) throw new Error('No file provided');
  if (!file.type.startsWith('image/')) throw new Error('That file is not an image');

  const bitmap = await loadBitmap(file);
  const { width: srcW, height: srcH } = bitmap;

  // Center-crop to a square so portrait phone photos still look right.
  const side = Math.min(srcW, srcH);
  const sx = Math.floor((srcW - side) / 2);
  const sy = Math.floor((srcH - side) / 2);

  const target = Math.min(maxSize, side);
  const canvas = document.createElement('canvas');
  canvas.width = target;
  canvas.height = target;
  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(bitmap, sx, sy, side, side, 0, 0, target, target);

  if (typeof bitmap.close === 'function') bitmap.close();

  return canvas.toDataURL('image/jpeg', quality);
}

async function loadBitmap(file) {
  if (typeof createImageBitmap === 'function') {
    try {
      return await createImageBitmap(file);
    } catch {
      // Some Safari versions choke on HEIC/some PNGs; fall through to the
      // <img> path which is slower but more permissive.
    }
  }
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Could not read that image'));
    };
    img.src = url;
  });
}
