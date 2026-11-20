/**
 * Build-time Open Graph image renderer — satori (HTML-like tree → SVG) plus
 * resvg (SVG → PNG), using the theme's own fonts and ember palette so every
 * card is unmistakably Brasa.
 *
 * Server-only: imported by prerendered endpoints under src/pages/og/.
 */

import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

import { Resvg } from '@resvg/resvg-js';
import satori from 'satori';
import wawoff2 from 'wawoff2';

import { brasa } from '../brasa.config';
import { ember, hex, palette } from './color';

/* --------------------------------- Fonts ---------------------------------- */

/**
 * Decompress one Fontsource woff2 into a standalone ArrayBuffer.
 *
 * Two non-negotiables learned the hard way:
 * - wawoff2 returns views into its single emscripten heap; callers must copy
 *   the bytes out (and never run decompressions concurrently).
 * - satori parses `buffer`, not the view, so a heap offset would read garbage.
 */
async function fontBuffer(packageName: string, file: string): Promise<ArrayBuffer> {
  const woff2 = await readFile(join(process.cwd(), 'node_modules', packageName, 'files', file));
  const decompressed = await wawoff2.decompress(woff2);
  const copy = new Uint8Array(decompressed.byteLength);
  copy.set(decompressed);
  return copy.buffer;
}

type LoadedFont = { name: string; data: ArrayBuffer; weight: 400; style: 'normal' | 'italic' };

let fontCache: LoadedFont[] | null = null;

/** Loaded once per build; sequential for the emscripten reason above. */
async function fonts(): Promise<NonNullable<typeof fontCache>> {
  if (fontCache) return fontCache;
  const loads: Array<[string, string, string, 'normal' | 'italic']> = [
    // Fraunces: the `wght`-axis subset (the `opsz` file's cmap chokes satori's
    // font parser; the wght file carries the same glyphs and weight axis).
    ['Fraunces', '@fontsource-variable/fraunces', 'fraunces-latin-wght-normal.woff2', 'normal'],
    ['Fraunces', '@fontsource-variable/fraunces', 'fraunces-latin-wght-italic.woff2', 'italic'],
    ['Geist', '@fontsource-variable/geist', 'geist-latin-wght-normal.woff2', 'normal'],
    ['Geist Mono', '@fontsource-variable/geist-mono', 'geist-mono-latin-wght-normal.woff2', 'normal'],
  ];
  const out: LoadedFont[] = [];
  for (const [name, packageName, file, style] of loads) {
    out.push({ name, data: await fontBuffer(packageName, file), weight: 400, style });
  }
  fontCache = out;
  return out;
}

/* --------------------------------- Colors --------------------------------- */

const HUE = brasa.colors.accentHue;
const dark = palette.dark;
const ink = hex(dark.ink);
const ink2 = hex(dark.ink2);
const ink3 = hex(dark.ink3);
const canvasDeep = hex(dark.canvasDeep);
const canvas = hex(dark.canvas);
const ember600 = ember(HUE, 600);
const ember300 = ember(HUE, 300);

/* -------------------------------- The flame -------------------------------- */

// Explicit width/height matching the display box: without them resvg honors
// the inner SVG's intrinsic size instead of the <img> box.
const FLAME_PX = 38;
const FLAME_SVG = Buffer.from(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="${FLAME_PX}" height="${FLAME_PX}">` +
    `<defs><linearGradient id="g" x1="0" y1="1" x2="1" y2="0">` +
    `<stop offset="0" stop-color="${ember600}"/>` +
    `<stop offset="1" stop-color="${ember300}"/>` +
    `</linearGradient></defs>` +
    `<path d="M12.6 1.9c.6 2.9-.2 5.3-2 7.2-1.7 1.9-3.6 3.6-3.6 6.4 0 3.9 3 6.5 7 6.5s7-2.6 7-6.5c0-2.6-1.2-4.7-2.8-6.3-1.1-1.2-2.3-2.2-2.9-3.6-.9 1-1.3 2.3-1.1 3.7-1.4-1.6-2.4-3.1-2.8-5l-.8-2.4Z" fill="url(#g)"/></svg>`,
).toString('base64');

/* -------------------------------- Satori tree ------------------------------ */

type Node = {
  type: string;
  props: {
    style?: Record<string, string | number>;
    children?: string | Node[];
    src?: string;
    width?: number;
    height?: number;
  };
};

const div = (style: Node['props']['style'], children: Node['props']['children']): Node => ({
  type: 'div',
  props: { style, children },
});

// Canvas geometry — absolute zones keep the layout deterministic (satori's
// vertical space-between is not, with mixed-height children).
const PAD = 76;
const HEADER_Y = PAD;
const BODY_TOP = 190;
const FOOTER_Y = 630 - PAD - 18; // footer text height ~26px, pinned above the padding edge

/** Keeps titles to 2–3 balanced lines whatever the editor writes. */
function titleSize(title: string): number {
  if (title.length <= 44) return 64;
  if (title.length <= 68) return 57;
  if (title.length <= 96) return 51;
  return 46;
}

function clamp(text: string, max: number): string {
  return text.length > max ? `${text.slice(0, max - 1).trimEnd()}…` : text;
}

export interface BlogOgInput {
  title: string;
  description: string;
  /** Uppercased mono tag, shown as the right-hand footer label. */
  tagLabel: string;
  authorName: string;
  dateLabel: string;
}

/** Renders a 1200×630 PNG card for one blog post. */
export async function renderBlogOg(input: BlogOgInput): Promise<Buffer> {
  const styleErrors: string[] = [];

  const header: Node = div(
    { position: 'absolute', top: HEADER_Y, left: PAD, display: 'flex', alignItems: 'center', gap: 18 },
    [
      {
        type: 'img',
        props: {
          src: `data:image/svg+xml;base64,${FLAME_SVG}`,
          width: FLAME_PX,
          height: FLAME_PX,
          style: { width: FLAME_PX, height: FLAME_PX },
        },
      },
      div(
        {
          fontFamily: 'Geist Mono',
          fontSize: 21,
          letterSpacing: 6,
          color: ember300,
        },
        'BRASA — NOTES FROM THE FORGE',
      ),
    ],
  );

  const body: Node = div(
    {
      position: 'absolute',
      top: BODY_TOP,
      left: PAD,
      width: 1200 - PAD * 2,
      display: 'flex',
      flexDirection: 'column',
      gap: 26,
    },
    [
      div(
        {
          fontFamily: 'Fraunces',
          fontSize: titleSize(input.title),
          lineHeight: '1.22em',
          letterSpacing: -1.6,
          color: ink,
          textWrap: 'balance',
        },
        input.title,
      ),
      div(
        {
          width: 132,
          height: 5,
          borderRadius: 999,
          backgroundImage: `linear-gradient(90deg, ${ember600}, ${ember300})`,
        },
        undefined,
      ),
      div(
        {
          fontFamily: 'Fraunces',
          fontStyle: 'italic',
          fontSize: 27,
          lineHeight: '1.4em',
          letterSpacing: 0.3,
          color: ink2,
          maxWidth: 960,
        },
        // Two lines max: a third would collide with the byline footer.
        clamp(input.description, 112),
      ),
    ],
  );

  const footer: Node = div(
    {
      position: 'absolute',
      top: FOOTER_Y,
      left: PAD,
      width: 1200 - PAD * 2,
      display: 'flex',
      justifyContent: 'space-between',
      fontFamily: 'Geist Mono',
      fontSize: 20,
      color: ink3,
    },
    [
      div({}, `${input.authorName} · ${input.dateLabel}`),
      div({ color: ember600 }, input.tagLabel.toUpperCase()),
    ],
  );

  const tree: Node = div(
    {
      width: '100%',
      height: '100%',
      backgroundImage: `radial-gradient(760px 520px at 12% 92%, ${ember600}48, transparent 65%), linear-gradient(160deg, ${canvasDeep} 0%, ${canvas} 62%)`,
    },
    [header, body, footer],
  );

  const svg = await satori(tree as Parameters<typeof satori>[0], {
    width: 1200,
    height: 630,
    fonts: await fonts(),
    onStyleError: (error) => styleErrors.push(String(error)),
  });

  if (styleErrors.length > 0) {
    throw new Error(`OG style errors for "${input.title}": ${styleErrors.join(' | ')}`);
  }

  const resvg = new Resvg(svg, {
    fitTo: { mode: 'width', value: 1200 },
    font: { loadSystemFonts: false, defaultFontFamily: 'Geist Mono' },
  });
  return resvg.render().asPng();
}
