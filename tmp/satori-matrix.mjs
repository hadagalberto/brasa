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

const fontConfig = [
  { name: 'Fraunces', data: fraunces, weight: 400, style: 'normal' },
  { name: 'Fraunces', data: frauncesItalic, weight: 400, style: 'italic' },
  { name: 'Geist', data: geist, weight: 400, style: 'normal' },
  { name: 'Geist Mono', data: mono, weight: 400, style: 'normal' },
];

async function attempt(label, element, extra = {}) {
  try {
    const svg = await satori(element, {
      width: 1200,
      height: 630,
      fonts: fontConfig,
      onStyleError: (error) => console.log(`  [${label}] style error:`, String(error).split('\n')[0]),
      ...extra,
    });
    console.log(label, 'OK', svg.length, 'bytes');
    return svg;
  } catch (err) {
    console.log(label, 'FAILED:', String(err).split('\n')[0]);
    return null;
  }
}

// 1. Full font config, simple content.
await attempt('config-4', {
  type: 'div',
  props: {
    style: { width: '100%', height: '100%', display: 'flex', fontFamily: 'Fraunces' },
    children: 'simple probe',
  },
});

// 2. + radial gradient background.
await attempt('radial', {
  type: 'div',
  props: {
    style: {
      width: '100%',
      height: '100%',
      display: 'flex',
      fontFamily: 'Fraunces',
      backgroundImage:
        'radial-gradient(700px 500px at 12% 90%, rgba(198, 84, 26, 0.3), transparent 65%), linear-gradient(160deg, #171009 0%, #221710 60%)',
    },
    children: 'radial probe',
  },
});

// 3. + italic child.
await attempt('italic', {
  type: 'div',
  props: {
    style: { width: '100%', height: '100%', display: 'flex', flexDirection: 'column', fontFamily: 'Fraunces' },
    children: [
      { type: 'div', props: { children: 'normal text' } },
      { type: 'div', props: { style: { fontStyle: 'italic' }, children: 'italic text' } },
    ],
  },
});

// 4. + svg img child.
const flame = Buffer.from(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path d="M12.6 1.9c.6 2.9-.2 5.3-2 7.2-1.7 1.9-3.6 3.6-3.6 6.4 0 3.9 3 6.5 7 6.5s7-2.6 7-6.5c0-2.6-1.2-4.7-2.8-6.3-1.1-1.2-2.3-2.2-2.9-3.6-.9 1-1.3 2.3-1.1 3.7-1.4-1.6-2.4-3.1-2.8-5l-.8-2.4Z" fill="#f2b36b"/></svg>`,
).toString('base64');

await attempt('img-svg', {
  type: 'div',
  props: {
    style: { width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' },
    children: { type: 'img', props: { src: `data:image/svg+xml;base64,${flame}`, width: 48, height: 48 } },
  },
});

// 5. textWrap balance.
await attempt('balance', {
  type: 'div',
  props: {
    style: { width: 600, height: 200, display: 'flex', fontFamily: 'Fraunces', fontSize: 48, textWrap: 'balance' },
    children: 'A rather long headline that should balance across two or three nice lines',
  },
});
