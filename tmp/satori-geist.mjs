import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import wawoff2 from 'wawoff2';

async function ttf(pkg, file) {
  const buf = await readFile(join(process.cwd(), 'node_modules', pkg, 'files', file));
  return wawoff2.decompress(buf);
}

const geist = await ttf('@fontsource-variable/geist', 'geist-latin-wght-normal.woff2');
const { default: satori } = await import('satori');

for (const [label, data] of [
  ['geist variable', geist],
]) {
  try {
    const svg = await satori(
      {
        type: 'div',
        props: {
          style: { width: 400, height: 100, display: 'flex', fontSize: 40, fontFamily: 'Geist' },
          children: 'Geist probe',
        },
      },
      { width: 400, height: 100, fonts: [{ name: 'Geist', data, weight: 400 }] },
    );
    console.log(label, 'OK', svg.length, 'bytes');
  } catch (err) {
    console.log(label, 'FAILED:', String(err).split('\n')[0]);
  }
}
