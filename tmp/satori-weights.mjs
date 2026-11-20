import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import wawoff2 from 'wawoff2';

async function ttf(pkg, file) {
  const buf = await readFile(join(process.cwd(), 'node_modules', pkg, 'files', file));
  return wawoff2.decompress(buf);
}

const fraunces = await ttf('@fontsource-variable/fraunces', 'fraunces-latin-wght-normal.woff2');
const { default: satori } = await import('satori');

const results = {};
for (const weight of [400, 700]) {
  const svg = await satori(
    {
      type: 'div',
      props: {
        style: {
          width: 600,
          height: 120,
          display: 'flex',
          fontSize: 64,
          fontFamily: 'Fraunces',
          fontWeight: weight,
          color: '#eee',
        },
        children: 'Brasa forge',
      },
    },
    {
      width: 600,
      height: 120,
      fonts: [
        { name: 'Fraunces', data: fraunces, weight: 400 },
        { name: 'Fraunces', data: fraunces, weight: 700 },
      ],
    },
  );
  const ink = svg.match(/fill="#eee"/g)?.length ?? 0;
  const chars = svg.match(/<text|<path/g)?.length ?? 0;
  results[weight] = { ink, chars, len: svg.length };
  console.log(`weight ${weight}: fill ops=${ink}, total elements=${chars}, svg len=${svg.length}`);
}
console.log('differs by weight:', results[400].len !== results[700].len);
