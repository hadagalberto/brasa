/**
 * Runs Lighthouse CI against the built site for one preset.
 *
 * Prefer a locally installed Chrome: it is the browser Lighthouse is tuned for
 * and gives stable performance scores. Only fall back to Playwright's bundled
 * Chromium when no system Chrome exists (e.g. a fresh CI runner).
 */
import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import path from 'node:path';

import { chromium } from 'playwright';

const preset = process.argv.includes('--desktop') ? 'desktop' : 'mobile';

const candidates = [
  process.env.CHROME_PATH,
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  path.join(process.env.LOCALAPPDATA ?? '', 'Google\\Chrome\\Application\\chrome.exe'),
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
].filter((value) => typeof value === 'string' && value.length > 0);

const chromePath = candidates.find((value) => existsSync(value)) ?? chromium.executablePath();

const env = {
  ...process.env,
  BRASA_LH_PRESET: preset,
  CHROME_PATH: chromePath,
};

const result = spawnSync('npx', ['lhci', 'autorun', '--config=lighthouserc.cjs'], {
  stdio: 'inherit',
  shell: true,
  env,
});

process.exit(result.status ?? 1);
