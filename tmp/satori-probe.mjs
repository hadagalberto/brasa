/**
 * Scratch probe (build-time, not shipped): verifies satori renders
 * Fraunces/Geist from Fontsource woff2 (wawoff2 → TTF) and that font-weight
 * actually shifts glyphs (variable axis support).
 */
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import wawoff2 from 'wawoff2';

const root = process.cwd();

async function ttf(pkg, file) {
  const buf = await readFile(join(root, 'node_modules', pkg, 'files', file));
  return wawoff2.decompress(buf);
}

const [fraunces, geist, mono] = await Promise.all([
  ttf('@fontsource-variable/fraunces', 'fraunces-latin-opsz-normal.woff2'),
  ttf('@fontsource-variable/geist', 'geist-latin-wght-normal.woff2'),
  ttf('@fontsource-variable/geist-mono', 'geist-mono-latin-wght-normal.woff2'),
]);

const { default: satori } = await import('satori');

for (const weight of [400, 700]) {
  const svg = await satori(
    {
      type: 'div',
      props: {
        style: {
          width: 600,
          height: 200,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#1a1512',
          color: '#eeeae5',
          fontSize: 64,
          fontFamily: 'Fraunces',
          fontWeight: weight,
        },
        children: `Brasa ${weight}`,
      },
    },
    {
      width: 600,
      height: 200,
      fonts: [
        { name: 'Fraunces', data: fraunces, weight: 400, style: 'normal' },
        { name: 'Fraunces', data: fraunces, weight: 700, style: 'normal' },
        { name: 'Geist', data: geist, weight: 400, style: 'normal' },
        { name: 'Geist Mono', data: mono, weight: 400, style: 'normal' },
      ],
    },
  );
  const count = (svg.match(/<path/g) ?? []).length;
  const widths = [...svg.matchAll(/d="([^"]+)"/g)].map((m) => m[1].length);
  console.log(
    `weight ${weight}: ${count} paths, longest path ${Math.max(...widths)} chars, svg ${svg.length} bytes`,
  );
}
