/**
 * Generates the default Open Graph image (public/og.png, 1200×630) with the
 * real Brasa fonts (Fontsource woff2 → TTF via wawoff2) and token colors.
 *
 * Run: npm run og
 */

import { readFile, writeFile } from 'node:fs/promises';
import { writeFileSync } from 'node:fs';
import { unlink } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Resvg } from '@resvg/resvg-js';
import wawoff2 from 'wawoff2';
import { ember, hex, palette } from '../src/lib/color.ts';

const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
const HUE = 35;

/** Decompress a Fontsource woff2 into a TTF buffer that resvg can load. */
async function loadFont(packageName, file) {
  const woff2Path = join(root, 'node_modules', packageName, 'files', file);
  const woff2Buffer = await readFile(woff2Path);
  return wawoff2.decompress(woff2Buffer);
}

const emberSteps = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];
const swatches = emberSteps
  .map(
    (step, index) =>
      `<rect x="${96 + index * 92}" y="506" width="72" height="10" rx="5" fill="${ember(HUE, step)}"/>`,
  )
  .join('');

const svg = `
<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="ember" x1="0" y1="1" x2="1" y2="0">
      <stop offset="0" stop-color="${ember(HUE, 600)}"/>
      <stop offset="1" stop-color="${ember(HUE, 300)}"/>
    </linearGradient>
    <radialGradient id="glowA" cx="0.18" cy="0.85" r="0.75">
      <stop offset="0" stop-color="${ember(HUE, 500)}" stop-opacity="0.34"/>
      <stop offset="1" stop-color="${ember(HUE, 500)}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="glowB" cx="0.86" cy="0.08" r="0.6">
      <stop offset="0" stop-color="${ember(HUE, 200)}" stop-opacity="0.22"/>
      <stop offset="1" stop-color="${ember(HUE, 200)}" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <rect width="1200" height="630" fill="${hex(palette.dark.canvas)}"/>
  <rect width="1200" height="630" fill="url(#glowA)"/>
  <rect width="1200" height="630" fill="url(#glowB)"/>
  <rect x="24" y="24" width="1152" height="582" rx="24" fill="none" stroke="rgba(238, 235, 229, 0.13)" stroke-width="2"/>

  <g transform="translate(96 62) scale(3.1)">
    <path d="M12.6 1.9c.6 2.9-.2 5.3-2 7.2-1.7 1.9-3.6 3.6-3.6 6.4 0 3.9 3 6.5 7 6.5s7-2.6 7-6.5c0-2.6-1.2-4.7-2.8-6.3-1.1-1.2-2.3-2.2-2.9-3.6-.9 1-1.3 2.3-1.1 3.7-1.4-1.6-2.4-3.1-2.8-5l-.8-2.4Z" fill="url(#ember)"/>
    <circle cx="14.1" cy="14.6" r="2" fill="${hex(palette.dark.canvas)}"/>
    <circle cx="14.1" cy="14.6" r="1" fill="${ember(HUE, 500)}"/>
  </g>

  <text x="96" y="238" font-family="Geist Mono" font-size="26" letter-spacing="6" font-weight="500" fill="${ember(HUE, 300)}">OPEN-SOURCE ASTRO THEME — MIT</text>

  <text x="88" y="392" font-family="Fraunces" font-size="176" font-style="italic" font-weight="600" fill="url(#ember)">brasa.</text>

  <text x="96" y="452" font-family="Geist" font-size="40" font-weight="500" fill="${hex(palette.dark.ink)}">A premium, dark-first theme for Astro.</text>

  ${swatches}

  <text x="96" y="552" font-family="Geist Mono" font-size="20" letter-spacing="3" fill="${hex(palette.dark.ink3)}">OKLCH DESIGN TOKENS — HUE 35 — FRAUNCES · GEIST</text>
</svg>
`;

const [fraunces, frauncesItalic, geist, geistMono] = await Promise.all([
  loadFont('@fontsource-variable/fraunces', 'fraunces-latin-opsz-normal.woff2'),
  loadFont('@fontsource-variable/fraunces', 'fraunces-latin-opsz-italic.woff2'),
  loadFont('@fontsource-variable/geist', 'geist-latin-wght-normal.woff2'),
  loadFont('@fontsource-variable/geist-mono', 'geist-mono-latin-wght-normal.woff2'),
]);

// resvg loads fonts by file path: stage the TTF buffers in the temp dir.
const staged = [];
const stageFont = async (buffer, name) => {
  const path = join(tmpdir(), `brasa-og-${name}`);
  writeFileSync(path, buffer);
  staged.push(path);
  return path;
};

const fontFiles = [
  await stageFont(fraunces, 'fraunces.ttf'),
  await stageFont(frauncesItalic, 'fraunces-italic.ttf'),
  await stageFont(geist, 'geist.ttf'),
  await stageFont(geistMono, 'geist-mono.ttf'),
];

const resvg = new Resvg(svg, {
  fitTo: { mode: 'width', value: 1200 },
  font: {
    fontFiles,
    loadSystemFonts: false,
    defaultFontFamily: 'Geist',
  },
});

const png = resvg.render().asPng();
await writeFile(join(root, 'public', 'og.png'), png);
await Promise.allSettled(staged.map((path) => unlink(path)));
console.log('Wrote public/og.png (1200x630)');
