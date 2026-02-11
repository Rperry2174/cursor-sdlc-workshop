#!/usr/bin/env node
/**
 * Generate landmark images using fal.ai Nano Banana (Google Gemini image gen).
 * Requires FAL_KEY in env. Saves images to public/landmarks/.
 *
 * Usage: FAL_KEY=your_key node scripts/generate-landmarks.mjs
 *    or: npm run generate-landmarks  (with FAL_KEY in .env or shell)
 */
import { fal } from '@fal-ai/client';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(__dirname, '..', 'public', 'landmarks');

const NANO_BANANA_PROMPTS = [
  {
    file: 'midtown.png',
    prompt:
      'Simple dark silhouette of Manhattan midtown skyline with tall skyscrapers, viewed from the river, flat single color on transparent or dark background, minimal game art style, side view',
  },
  {
    file: 'gw-bridge.png',
    prompt:
      'Simple dark silhouette of George Washington Bridge spanning horizontally across the frame, suspension bridge, flat single color, minimal game art style',
  },
  {
    file: 'palisades.png',
    prompt:
      'Simple dark silhouette of Palisades cliffs on the left, jagged rock face along the Hudson, flat single color, minimal game art style',
  },
  {
    file: 'bayonne-bridge.png',
    prompt:
      'Simple dark silhouette of Bayonne Bridge arch spanning horizontally, steel arch bridge, flat single color, minimal game art style',
  },
  {
    file: 'statue-of-liberty.png',
    prompt:
      'Simple dark silhouette of Statue of Liberty with torch and crown, viewed from the river, flat single color, minimal game art style',
  },
];

async function downloadImage(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`);
  return Buffer.from(await res.arrayBuffer());
}

async function main() {
  if (!process.env.FAL_KEY) {
    console.error('Set FAL_KEY (e.g. from https://fal.ai/dashboard/keys) and run again.');
    process.exit(1);
  }
  fal.config({ credentials: process.env.FAL_KEY });

  if (!fs.existsSync(OUT_DIR)) {
    fs.mkdirSync(OUT_DIR, { recursive: true });
  }

  for (const { file, prompt } of NANO_BANANA_PROMPTS) {
    console.log(`Generating ${file}...`);
    const result = await fal.subscribe('fal-ai/nano-banana', {
      input: {
        prompt,
        num_images: 1,
        aspect_ratio: '16:9',
        output_format: 'png',
      },
    });
    const imageUrl = result.data?.images?.[0]?.url;
    if (!imageUrl) {
      console.error('No image URL in result:', result.data);
      continue;
    }
    const buf = await downloadImage(imageUrl);
    const outPath = path.join(OUT_DIR, file);
    fs.writeFileSync(outPath, buf);
    console.log(`  Saved ${outPath}`);
  }
  console.log('Done. Landmark images are in public/landmarks/');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
