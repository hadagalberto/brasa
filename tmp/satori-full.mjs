import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import wawoff2 from 'wawoff2';

async function ttf(pkg, file) {
  const buf = await readFile(join(process.cwd(), 'node_modules', pkg, 'files', file));
  const decompressed = await wawoff2.decompress(buf);
  // wawoff2 returns a view into the emscripten heap; copy it out so the
  // ArrayBuffer starts exactly at the font (satori parses `.buffer`).
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
const { Resvg } = await import('@resvg/resvg-js');

const flame = Buffer.from(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><defs><linearGradient id="g" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="#c2570f"/><stop offset="1" stop-color="#f2b36b"/></linearGradient></defs><path d="M12.6 1.9c.6 2.9-.2 5.3-2 7.2-1.7 1.9-3.6 3.6-3.6 6.4 0 3.9 3 6.5 7 6.5s7-2.6 7-6.5c0-2.6-1.2-4.7-2.8-6.3-1.1-1.2-2.3-2.2-2.9-3.6-.9 1-1.3 2.3-1.1 3.7-1.4-1.6-2.4-3.1-2.8-5l-.8-2.4Z" fill="url(#g)"/></svg>`,
).toString('base64');

const styleErrors = [];
const svg = await satori(
  {
    type: 'div',
    props: {
      style: {
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: 76,
        backgroundImage:
          'radial-gradient(700px 500px at 12% 90%, rgba(198, 84, 26, 0.30), transparent 65%), linear-gradient(160deg, #171009 0%, #221710 60%)',
      },
      children: [
        {
          type: 'div',
          props: {
            style: { display: 'flex', alignItems: 'center', gap: 18 },
            children: [
              {
                type: 'img',
                props: {
                  src: `data:image/svg+xml;base64,${flame}`,
                  width: 40,
                  height: 40,
                  style: { width: 40, height: 40 },
                },
              },
              {
                type: 'div',
                props: {
                  style: {
                    fontFamily: 'Geist Mono',
                    fontSize: 22,
                    letterSpacing: 6,
                    color: '#f2b36b',
                  },
                  children: 'BRASA — NOTES FROM THE FORGE',
                },
              },
            ],
          },
        },
        {
          type: 'div',
          props: {
            style: {
              fontFamily: 'Fraunces',
              fontSize: 60,
              lineHeight: '1.12em',
              letterSpacing: -1.6,
              color: '#efece6',
              maxWidth: 1000,
              textWrap: 'balance',
            },
            children:
              'Previews are the pull request\u2019s missing ' +
              '\u201chalf\u201d, and it shows in every review cycle.',
          },
        },
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              fontFamily: 'Geist Mono',
              fontSize: 20,
              color: '#a09a92',
            },
            children: [
              { type: 'div', props: { children: 'Sofia Marques · March 4, 2026' } },
              {
                type: 'div',
                props: {
                  style: { color: '#c2570f', fontStyle: 'italic', fontFamily: 'Fraunces' },
                  children: 'brasa',
                },
              },
            ],
          },
        },
      ],
    },
  },
  {
    width: 1200,
    height: 630,
    fonts: [
      { name: 'Fraunces', data: fraunces, weight: 400, style: 'normal' },
      { name: 'Fraunces', data: frauncesItalic, weight: 400, style: 'italic' },
      { name: 'Geist', data: geist, weight: 400, style: 'normal' },
      { name: 'Geist Mono', data: mono, weight: 400, style: 'normal' },
    ],
    onStyleError: (error) => styleErrors.push(String(error)),
  },
);

console.log('style errors:', styleErrors.length ? styleErrors : 'none');

const resvg = new Resvg(svg, {
  fitTo: { mode: 'width', value: 1200 },
  font: { loadSystemFonts: false, defaultFontFamily: 'Geist Mono' },
});
const png = resvg.render().asPng();
await (await import('node:fs/promises')).writeFile('tmp/og-probe.png', png);
console.log('wrote tmp/og-probe.png', png.length, 'bytes');
