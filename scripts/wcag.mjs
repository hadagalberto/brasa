// WCAG contrast checks for the token pairs used in the UI. Run: node scripts/wcag.mjs
import { oklchToRgb255, ember, palette, hex } from '../src/lib/color.ts';
const lum = ([r, g, b]) => {
  const f = (v) => {
    const c = v / 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
};

const ratio = (a, b) => {
  const la = lum(a);
  const lb = lum(b);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
};

const HUE = 35;

const pairs = [
  ['ink / canvas (dark)', palette.dark.ink, palette.dark.canvas],
  ['ink-2 / canvas (dark)', palette.dark.ink2, palette.dark.canvas],
  ['ink-3 / canvas (dark)', palette.dark.ink3, palette.dark.canvas],
  ['ink-3 / surface (dark)', palette.dark.ink3, palette.dark.surface],
  ['accent dark / canvas', { l: 0.845, c: 0.135, h: HUE + 6 }, palette.dark.canvas],
  ['on-accent actual / ember-500', { l: 0.2, c: 0.045, h: HUE - 5 }, { l: 0.685, c: 0.19, h: HUE }],
  [
    'on-accent actual / ember-600',
    { l: 0.2, c: 0.045, h: HUE - 5 },
    { l: 0.615, c: 0.2, h: HUE - 6 },
  ],
  ['ink / canvas (light)', palette.light.ink, palette.light.canvas],
  ['ink-2 / canvas (light)', palette.light.ink2, palette.light.canvas],
  ['ink-3 / canvas (light)', palette.light.ink3, palette.light.canvas],
  ['accent light 0.52 / canvas (light)', { l: 0.52, c: 0.18, h: HUE - 4 }, palette.light.canvas],
  [
    'ember-300 dark / surface (code heading)',
    { l: 0.82, c: 0.125, h: HUE + 12 },
    palette.dark.surface,
  ],
];

for (const [name, fg, bg] of pairs) {
  const r = ratio(oklchToRgb255(fg), oklchToRgb255(bg));
  console.log(
    `${r >= 7 ? 'AAA ' : r >= 4.5 ? 'AA  ' : r >= 3 ? 'LARGE-ONLY' : 'FAIL'}  ${r.toFixed(2)}:1  ${name}`,
  );
}

console.log('\nember-500 hex:', ember(HUE, 500));
console.log('accent dark hex:', hex({ l: 0.845, c: 0.135, h: HUE + 6 }));
console.log('accent light 0.52 hex:', hex({ l: 0.52, c: 0.18, h: HUE - 4 }));
