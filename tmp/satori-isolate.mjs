import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import wawoff2 from 'wawoff2';

async function ttf(pkg, file) {
  const buf = await readFile(join(process.cwd(), 'node_modules', pkg, 'files', file));
  const decompressed = await wawoff2.decompress(buf);
  const clean = new Uint8Array(decompressed.byteLength);
  clean.set(decompressed);
  return clean.buffer;
}

const { default: satori } = await import('satori');

const fonts = [
  ['fraunces-normal', '@fontsource-variable/fraunces', 'fraunces-latin-wght-normal.woff2', 'Fraunces'],
  ['fraunces-italic', '@fontsource-variable/fraunces', 'fraunces-latin-wght-italic.woff2', 'Fraunces'],
  ['geist', '@fontsource-variable/geist', 'geist-latin-wght-normal.woff2', 'Geist'],
  ['geist-mono', '@fontsource-variable/geist-mono', 'geist-mono-latin-wght-normal.woff2', 'Geist Mono'],
];

for (const [label, pkg, file, family] of fonts) {
  try {
    const data = await ttf(pkg, file);
    const svg = await satori(
      {
        type: 'div',
        props: {
          style: { width: 300, height: 60, display: 'flex', fontSize: 30, fontFamily: family },
          children: 'probe',
        },
      },
      { width: 300, height: 60, fonts: [{ name: family, data, weight: 400 }] },
    );
    console.log(label, 'OK');
  } catch (err) {
    console.log(label, 'FAILED:', String(err).split('\n')[0]);
  }
}
