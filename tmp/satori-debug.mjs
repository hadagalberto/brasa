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

const fonts = [];
fonts.push({ name: 'Geist', data: await ttf('@fontsource-variable/geist', 'geist-latin-wght-normal.woff2'), weight: 400, style: 'normal' });
fonts.push({ name: 'Fraunces', data: await ttf('@fontsource-variable/fraunces', 'fraunces-latin-wght-normal.woff2'), weight: 400, style: 'normal' });

const { default: satori } = await import('satori');
const { Resvg } = await import('@resvg/resvg-js');

const text = (t) => ({ type: 'div', props: { style: { fontFamily: 'Geist', fontSize: 28, color: '#eee' }, children: t } });

// Case A: three string children, space-between.
let svg = await satori(
  { type: 'div', props: { style: { width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: 76, background: '#111' }, children: [text('TOP'), text('MIDDLE'), text('BOTTOM')] } },
  { width: 1200, height: 630, fonts },
);
console.log('A: texts found:', (svg.match(/<text|fill="#eee"/g) ?? []).length);

// Case B: children array with a nested array element (like my probe).
svg = await satori(
  { type: 'div', props: { style: { width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: 76, background: '#111' }, children: [text('TOP'), text('MIDDLE'), [text('LEFT'), text('RIGHT')]] } },
  { width: 1200, height: 630, fonts },
);
console.log('B: texts found:', (svg.match(/<text|fill="#eee"/g) ?? []).length);

// Case C: root children exactly like og.ts (arrays of nodes everywhere).
svg = await satori(
  {
    type: 'div',
    props: {
      style: { width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: 76, background: '#111' },
      children: [
        { type: 'div', props: { style: { display: 'flex' }, children: [text('HEAD')] } },
        { type: 'div', props: { style: { display: 'flex', flexDirection: 'column', gap: 30 }, children: [text('TITLE'), text('LEDE')] } },
        { type: 'div', props: { style: { display: 'flex', justifyContent: 'space-between' }, children: [text('BYLINE'), text('TAG')] } },
      ],
    },
  },
  { width: 1200, height: 630, fonts },
);
console.log('C: texts found:', (svg.match(/<text|fill="#eee"/g) ?? []).length);

// Case D: same as C but height without padding trick: use explicit width/height numbers.
svg = await satori(
  {
    type: 'div',
    props: {
      style: { width: 1200, height: 630, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: 76, background: '#111' },
      children: [
        { type: 'div', props: { style: { display: 'flex' }, children: [text('HEAD')] } },
        { type: 'div', props: { style: { display: 'flex', flexDirection: 'column', gap: 30 }, children: [text('TITLE'), text('LEDE')] } },
        { type: 'div', props: { style: { display: 'flex', justifyContent: 'space-between' }, children: [text('BYLINE'), text('TAG')] } },
      ],
    },
  },
  { width: 1200, height: 630, fonts },
);
console.log('D: texts found:', (svg.match(/<text|fill="#eee"/g) ?? []).length);
