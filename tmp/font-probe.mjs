import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import wawoff2 from 'wawoff2';

const buf = await readFile(
  join(process.cwd(), 'node_modules', '@fontsource-variable', 'fraunces', 'files', 'fraunces-latin-opsz-normal.woff2'),
);
const ttf = await wawoff2.decompress(buf);
console.log('ttf bytes:', ttf.length, 'sfnt magic:', Buffer.from(ttf.slice(0, 4)).toString('hex'));

const { default: opentype } = await import('@shuding/opentype.js');
try {
  const font = opentype.parse(ttf.buffer.slice(ttf.byteOffset, ttf.byteOffset + ttf.byteLength));
  console.log('opentype parsed OK:', font.names.fullName.en, 'unitsPerEm', font.unitsPerEm);
} catch (err) {
  console.log('opentype failed:', String(err));
}
