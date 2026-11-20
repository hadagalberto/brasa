/**
 * OKLCH → sRGB math and shared palette constants.
 *
 * The canonical token definitions live in `src/styles/global.css` as OKLCH
 * values. This module mirrors the handful of tokens that JS consumers need as
 * hex strings (Expressive Code themes, the OG image generator) so they are
 * derived from the exact same numbers instead of drifting hand-picked hexes.
 *
 * Keep values in sync with `src/styles/global.css`.
 */

export interface Oklch {
  l: number;
  c: number;
  h: number;
}

const OKLAB_TO_LMS_COEFFICIENTS = {
  l: [0.3963377774, 0.2158037573],
  m: [-0.1055613458, -0.0638541728],
  s: [-0.0894841775, -1.291485548],
} as const;

const LMS_TO_LINEAR_SRGB = {
  r: [4.0767416621, -3.3077115913, 0.2309699292],
  g: [-1.2684380046, 2.6097574011, -0.3413193965],
  b: [-0.0041960863, -0.7034186147, 1.707614701],
} as const;

/** Convert an OKLCH color to gamma-encoded sRGB components in [0, 255]. */
export function oklchToRgb255({ l, c, h }: Oklch): [number, number, number] {
  const rad = (h * Math.PI) / 180;
  const a = c * Math.cos(rad);
  const b = c * Math.sin(rad);

  const l_ = l + OKLAB_TO_LMS_COEFFICIENTS.l[0] * a + OKLAB_TO_LMS_COEFFICIENTS.l[1] * b;
  const m_ = l + OKLAB_TO_LMS_COEFFICIENTS.m[0] * a + OKLAB_TO_LMS_COEFFICIENTS.m[1] * b;
  const s_ = l + OKLAB_TO_LMS_COEFFICIENTS.s[0] * a + OKLAB_TO_LMS_COEFFICIENTS.s[1] * b;

  const L = l_ ** 3;
  const M = m_ ** 3;
  const S = s_ ** 3;

  const linear = {
    r: LMS_TO_LINEAR_SRGB.r[0] * L + LMS_TO_LINEAR_SRGB.r[1] * M + LMS_TO_LINEAR_SRGB.r[2] * S,
    g: LMS_TO_LINEAR_SRGB.g[0] * L + LMS_TO_LINEAR_SRGB.g[1] * M + LMS_TO_LINEAR_SRGB.g[2] * S,
    b: LMS_TO_LINEAR_SRGB.b[0] * L + LMS_TO_LINEAR_SRGB.b[1] * M + LMS_TO_LINEAR_SRGB.b[2] * S,
  };

  const encode = (x: number): number => {
    const v = Math.min(1, Math.max(0, x));
    return v <= 0.0031308 ? 12.92 * v : 1.055 * v ** (1 / 2.4) - 0.055;
  };

  return [
    Math.round(encode(linear.r) * 255),
    Math.round(encode(linear.g) * 255),
    Math.round(encode(linear.b) * 255),
  ];
}

/** Convert an OKLCH color to a `#rrggbb` hex string. */
export function oklchToHex({ l, c, h }: Oklch): string {
  const [r, g, b] = oklchToRgb255({ l, c, h });
  const hex = (n: number): string => n.toString(16).padStart(2, '0');
  return `#${hex(r)}${hex(g)}${hex(b)}`;
}

/** Convert an OKLCH color to an `rgba(...)` string with the given alpha. */
export function oklchToRgba({ l, c, h }: Oklch, alpha: number): string {
  const [r, g, b] = oklchToRgb255({ l, c, h });
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/**
 * The ember scale, expressed as a function of the accent hue so JS consumers
 * can re-derive it exactly like the CSS tokens do.
 * Mirrors `--color-ember-*` in `src/styles/global.css`.
 */
export function ember(
  hue: number,
  step: 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950,
): string {
  const scale: Record<string, [number, number, number]> = {
    50: [0.965, 0.028, 28],
    100: [0.93, 0.055, 24],
    200: [0.88, 0.085, 18],
    300: [0.82, 0.125, 12],
    400: [0.755, 0.155, 6],
    500: [0.685, 0.19, 0],
    600: [0.615, 0.2, -6],
    700: [0.54, 0.19, -12],
    800: [0.46, 0.165, -14],
    900: [0.38, 0.135, -14],
    950: [0.29, 0.095, -12],
  };
  const [l, c, dh] = scale[String(step)];
  return oklchToHex({ l, c, h: hue + dh });
}

/** Surface and ink tokens, mirrored from `src/styles/global.css`. */
export const palette = {
  dark: {
    canvas: { l: 0.16, c: 0.012, h: 40 },
    canvasDeep: { l: 0.13, c: 0.012, h: 40 },
    surface: { l: 0.19, c: 0.014, h: 42 },
    surface2: { l: 0.225, c: 0.016, h: 44 },
    surface3: { l: 0.26, c: 0.018, h: 46 },
    ink: { l: 0.94, c: 0.008, h: 85 },
    ink2: { l: 0.76, c: 0.014, h: 78 },
    ink3: { l: 0.63, c: 0.016, h: 72 },
  },
  light: {
    canvas: { l: 0.98, c: 0.01, h: 80 },
    canvasDeep: { l: 0.945, c: 0.014, h: 76 },
    surface: { l: 0.992, c: 0.006, h: 82 },
    surface2: { l: 0.965, c: 0.01, h: 80 },
    surface3: { l: 0.935, c: 0.014, h: 78 },
    ink: { l: 0.23, c: 0.022, h: 50 },
    ink2: { l: 0.42, c: 0.024, h: 55 },
    ink3: { l: 0.52, c: 0.024, h: 60 },
  },
} as const;

/** Shorthand: palette entry → hex. */
export function hex(color: Oklch): string {
  return oklchToHex(color);
}
