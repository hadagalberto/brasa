import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import wawoff2 from 'wawoff2';

/** Decompress one woff2 to a standalone ArrayBuffer copy (run sequentially —
 *  wawoff2 is a single emscripten heap, not safe for concurrent calls). */
async function ttf(pkg, file) {
  const buf = await readFile(join(process.cwd(), 'node_modules', pkg, 'files', file));
  const decompressed = await wawoff2.decompress(buf);
  const clean = new Uint8Array(decompressed.byteLength);
  clean.set(decompressed);
  return clean.buffer;
}

const [fraunces, frauncesItalic, geist, mono] = await (async () => {
  const out = [];
  out.push(await ttf('@fontsource-variable/fraunces', 'fraunces-latin-wght-normal.woff2'));
  out.push(await ttf('@fontsource-variable/fraunces', 'fraunces-latin-wght-italic.woff2'));
  out.push(await ttf('@fontsource-variable/geist', 'geist-latin-wght-normal.woff2'));
  out.push(await ttf('@fontsource-variable/geist-mono', 'geist-mono-latin-wght-normal.woff2'));
  return out;
})();

const { default: satori } = await import('satori');

async function attempt(label, fonts, family) {
  try {
    const svg = await satori(
      {
        type: 'div',
        props: { style: { width: 300, height: 60, display: 'flex', fontSize: 30, fontFamily: family }, children: 'probe' },
      },
      { width: 300, height: 60, fonts },
    );
    console.log(label, 'OK', svg.length);
  } catch (err) {
    console.log(label, 'FAILED:', String(err).split('\n')[0]);
  }
}

await attempt('fraun normal', [{ name: 'Fraunces', data: fraunces, weight: 400 }], 'Fraunces');
await attempt('fraun normal+italic', [
  { name: 'Fraunces', data: fraunces, weight: 400, style: 'normal' },
  { name: 'Fraunces', data: frauncesItalic, weight: 400, style: 'italic' },
], 'Fraunces');
await attempt('fraun+geist+mono', [
  { name: 'Fraunces', data: fraunces, weight: 400 },
  { name: 'Fraunces', data: frauncesItalic, weight: 400, style: 'italic' },
  { name: 'Geist', data: geist, weight: 400 },
  { name: 'Geist Mono', data: mono, weight: 400 },
], 'Fraunces');
