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

const [fraunces, frauncesItalic, geist, mono] = await Promise.all([
  ttf('@fontsource-variable/fraunces', 'fraunces-latin-wght-normal.woff2'),
  ttf('@fontsource-variable/fraunces', 'fraunces-latin-wght-italic.woff2'),
  ttf('@fontsource-variable/geist', 'geist-latin-wght-normal.woff2'),
  ttf('@fontsource-variable/geist-mono', 'geist-mono-latin-wght-normal.woff2'),
]);

const { default: satori } = await import('satori');

async function attempt(label, fonts, family) {
  try {
    await satori(
      {
        type: 'div',
        props: { style: { width: 300, height: 60, display: 'flex', fontSize: 30, fontFamily: family }, children: 'probe' },
      },
      { width: 300, height: 60, fonts },
    );
    console.log(label, 'OK');
  } catch (err) {
    console.log(label, 'FAILED:', String(err).split('\n')[0]);
  }
}

await attempt('fraun normal', [{ name: 'Fraunces', data: fraunces, weight: 400 }], 'Fraunces');
await attempt('fraun normal+italic', [
  { name: 'Fraunces', data: fraunces, weight: 400, style: 'normal' },
  { name: 'Fraunces', data: frauncesItalic, weight: 400, style: 'italic' },
], 'Fraunces');
await attempt('fraun+geist', [
  { name: 'Fraunces', data: fraunces, weight: 400 },
  { name: 'Geist', data: geist, weight: 400 },
], 'Fraunces');
await attempt('geist+mono', [
  { name: 'Geist', data: geist, weight: 400 },
  { name: 'Geist Mono', data: mono, weight: 400 },
], 'Geist');
await attempt('fraun+geist+mono', [
  { name: 'Fraunces', data: fraunces, weight: 400 },
  { name: 'Geist', data: geist, weight: 400 },
  { name: 'Geist Mono', data: mono, weight: 400 },
], 'Fraunces');
