import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import wawoff2 from 'wawoff2';

async function ttf(pkg, file) {
  const buf = await readFile(join(process.cwd(), 'node_modules', pkg, 'files', file));
  return wawoff2.decompress(buf);
}

const { default: satori } = await import('satori');

for (const file of [
  'fraunces-latin-wght-normal.woff2',
  'fraunces-latin-standard-normal.woff2',
  'fraunces-latin-full-normal.woff2',
]) {
  try {
    const data = await ttf('@fontsource-variable/fraunces', file);
    const svg = await satori(
      {
        type: 'div',
        props: {
          style: { width: 500, height: 120, display: 'flex', fontSize: 48, fontFamily: 'Fraunces' },
          children: 'Fraunces probe 0123',
        },
      },
      { width: 500, height: 120, fonts: [{ name: 'Fraunces', data, weight: 400 }] },
    );
    console.log(file, 'OK', svg.length, 'bytes');
  } catch (err) {
    console.log(file, 'FAILED:', String(err).split('\n')[0]);
  }
}
