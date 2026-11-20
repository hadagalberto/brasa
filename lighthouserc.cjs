/**
 * Lighthouse CI configuration for the Brasa quality bar (SPEC.md).
 *
 * Run `npm run lhci` for both the mobile and desktop presets. The preset is
 * selected by scripts/lighthouse.mjs via BRASA_LH_PRESET; this file is CommonJS
 * because LHCI loads configs with require().
 */
const preset = process.env.BRASA_LH_PRESET === 'desktop' ? 'desktop' : 'mobile';

const urls = [
  'http://127.0.0.1:4321/',
  'http://127.0.0.1:4321/blog/deploy-previews-are-the-prs-missing-half',
  'http://127.0.0.1:4321/docs/installation',
  'http://127.0.0.1:4321/pricing',
];

/** Every category must clear 0.98 on every page type, on both presets. */
const minScore = Number(process.env.LHCI_MIN_SCORE ?? 0.98);

module.exports = {
  ci: {
    collect: {
      // LHCI's option is a flat command string (not a `startServer` object).
      // `astro preview` binds to ::1 by default; Chrome resolves to IPv4 and
      // would hit an interstitial, so pin the preview server to 127.0.0.1.
      startServerCommand: 'npm run preview -- --host 127.0.0.1',
      url: urls,
      numberOfRuns: 1,
      settings: {
        // "mobile" is Lighthouse's default preset; passing it explicitly is an
        // error, so only set `preset` for the desktop run.
        ...(preset === 'desktop' ? { preset: 'desktop' } : {}),
        // LHCI appends `--headless=new` to this string and expects a STRING, not
        // an array (an array gets comma-joined into unusable flags).
        // The CI host may have a system proxy; localhost must never go through it.
        chromeFlags: '--no-proxy-server --no-sandbox --disable-dev-shm-usage',
      },
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore }],
        'categories:accessibility': ['error', { minScore }],
        'categories:best-practices': ['error', { minScore }],
        'categories:seo': ['error', { minScore }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.02 }],
        'total-byte-weight': ['warn', { maxNumericValue: 1_500_000 }],
      },
    },
    upload: {
      target: 'filesystem',
      outputDir: '.lighthouseci',
      reportFilenamePattern: 'lighthouse-{{URL}}-{{TIMESTAMP}}.report.html',
    },
  },
};
