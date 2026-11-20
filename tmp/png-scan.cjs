/** Scans tmp/og-probe.png for red/green marker pixels (footer visibility probe). */
const fs = require('fs');
const zlib = require('zlib');
const png = fs.readFileSync(process.argv[2] ?? 'tmp/og-probe.png');
let pos = 8;
const chunks = [];
while (pos < png.length) {
  const len = png.readUInt32BE(pos);
  const type = png.toString('ascii', pos + 4, pos + 8);
  if (type === 'IDAT') chunks.push(png.subarray(pos + 8, pos + 8 + len));
  pos += 12 + len;
}
const raw = zlib.inflateSync(Buffer.concat(chunks));
const width = png.readUInt32BE(16);
const height = png.readUInt32BE(20);
const bpp = 4;
const stride = width * bpp;
const out = Buffer.alloc(height * stride);
let off = 0;
const line = Buffer.alloc(stride);
for (let y = 0; y < height; y++) {
  const filter = raw[off];
  line.set(raw.subarray(off + 1, off + 1 + stride));
  off += 1 + stride;
  for (let x = 0; x < stride; x++) {
    const left = x >= bpp ? line[x - bpp] : 0;
    const up = y > 0 ? out[(y - 1) * stride + x] : 0;
    const upLeft = y > 0 && x >= bpp ? out[(y - 1) * stride + x - bpp] : 0;
    let v = line[x];
    if (filter === 1) v = (v + left) & 255;
    else if (filter === 2) v = (v + up) & 255;
    else if (filter === 3) v = (v + ((left + up) >> 1)) & 255;
    else if (filter === 4) {
      const p = left + up - upLeft;
      const pa = Math.abs(p - left);
      const pb = Math.abs(p - up);
      const pc = Math.abs(p - upLeft);
      const pr = pa <= pb && pa <= pc ? left : pb <= pc ? up : upLeft;
      v = (v + pr) & 255;
    }
    out[y * stride + x] = v;
    line[x] = v;
  }
}
const red = [];
const green = [];
for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    const i = y * stride + x * bpp;
    const r = out[i];
    const g = out[i + 1];
    const b = out[i + 2];
    if (r > 150 && g < 90 && b < 90 && red.length < 4) red.push([x, y]);
    if (g > 150 && r < 90 && b < 90 && green.length < 4) green.push([x, y]);
  }
}
console.log('size:', width, 'x', height);
console.log('red (footer left):', JSON.stringify(red));
console.log('green (footer right):', JSON.stringify(green));
