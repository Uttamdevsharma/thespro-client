/**
 * remove-bg.mjs
 * Removes solid/checkerboard background from hero-right.png using sharp.
 * Samples corner colors and flood-fills matching pixels to alpha=0.
 */

import sharp from 'sharp';
import { readFileSync, writeFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const INPUT  = path.join(__dirname, '../public/hero-right-source.png');
const OUTPUT = path.join(__dirname, '../public/hero-right.png');

const TOLERANCE = 30; // colour distance tolerance for edge matching

// Euclidean distance in RGB space
function colorDist(r1, g1, b1, r2, g2, b2) {
  return Math.sqrt((r1-r2)**2 + (g1-g2)**2 + (b1-b2)**2);
}

async function processImage() {
  console.log('📂 Loading image:', INPUT);

  const image = sharp(INPUT);
  const { width, height, channels } = await image.metadata();
  console.log(`📐 Dimensions: ${width}x${height}, channels: ${channels}`);

  // Ensure RGBA (4 channels)
  const { data, info } = await image
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const w = info.width;
  const h = info.height;
  const buf = new Uint8ClampedArray(data);

  // Sample corners to determine background colors
  function getPixel(x, y) {
    const idx = (y * w + x) * 4;
    return [buf[idx], buf[idx+1], buf[idx+2], buf[idx+3]];
  }

  const corners = [
    getPixel(0, 0),
    getPixel(w - 1, 0),
    getPixel(0, h - 1),
    getPixel(w - 1, h - 1),
    getPixel(Math.floor(w/2), 0),       // top-center
    getPixel(0, Math.floor(h/2)),        // mid-left
    getPixel(w - 1, Math.floor(h/2)),   // mid-right
    getPixel(Math.floor(w/2), h - 1),   // bottom-center
  ];

  console.log('🎨 Sampled border pixels:', corners.map(c => `rgba(${c.join(',')})`));

  // Flood-fill BFS from all border pixels
  function setPixel(x, y) {
    const idx = (y * w + x) * 4;
    buf[idx+3] = 0; // make transparent
  }

  function isBackground(x, y) {
    const [r, g, b, a] = getPixel(x, y);
    if (a === 0) return false; // already transparent
    
    // Check if this pixel matches ANY of the corner/border colors
    for (const [cr, cg, cb] of corners) {
      if (colorDist(r, g, b, cr, cg, cb) <= TOLERANCE) return true;
    }
    return false;
  }

  console.log('🔄 Running flood-fill from all edges...');
  const visited = new Uint8Array(w * h);
  const queue = [];

  // Seed from all 4 edges
  for (let x = 0; x < w; x++) {
    if (isBackground(x, 0))     { queue.push(x, 0); }
    if (isBackground(x, h-1))   { queue.push(x, h-1); }
  }
  for (let y = 0; y < h; y++) {
    if (isBackground(0, y))     { queue.push(0, y); }
    if (isBackground(w-1, y))   { queue.push(w-1, y); }
  }

  // BFS flood fill
  let qi = 0;
  while (qi < queue.length) {
    const x = queue[qi++];
    const y = queue[qi++];
    const idx = y * w + x;
    if (visited[idx]) continue;
    visited[idx] = 1;
    if (!isBackground(x, y)) continue;
    setPixel(x, y);

    if (x > 0)   queue.push(x-1, y);
    if (x < w-1) queue.push(x+1, y);
    if (y > 0)   queue.push(x, y-1);
    if (y < h-1) queue.push(x, y+1);
  }

  console.log('✅ Flood-fill complete. Saving transparent PNG...');

  await sharp(Buffer.from(buf), {
    raw: { width: w, height: h, channels: 4 }
  })
    .png({ compressionLevel: 9, quality: 100 })
    .toFile(OUTPUT);

  console.log(`💾 Saved: ${OUTPUT}`);
}

processImage().catch(err => {
  console.error('❌ Error:', err);
  process.exit(1);
});
