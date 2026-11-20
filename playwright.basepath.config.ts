/**
 * Runs the FULL e2e suite (and the link/meta crawler) against a build made
 * with a deploy subpath. The default config serves `/`; this one serves
 * `/brasa`, the real GitHub Pages project-page path. Sharing the testDir is
 * intentional: a test can only be considered green if it is green in both
 * places. `tests/e2e/base.ts` rewrites every navigation to include the path.
 */
import { defineConfig, devices } from '@playwright/test';

const PORT = 4321;
const HOST = '127.0.0.1';
const BASE_PATH = '/brasa';

// sitePath() in the harness reads this at module load, before tests run.
process.env.PAGES_BASE_PATH ??= BASE_PATH;

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: [['list'], ['html', { open: 'never', outputFolder: 'playwright-report-basepath' }]],
  use: {
    baseURL: `http://${HOST}:${PORT}`,
    colorScheme: 'dark',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'basepath',
      use: { ...devices['Desktop Chrome'] },
      metadata: { basePath: BASE_PATH },
    },
  ],
  webServer: {
    command: 'npm run preview -- --host 127.0.0.1',
    url: `http://${HOST}:${PORT}${BASE_PATH}`,
    env: { PAGES_BASE_PATH: BASE_PATH, BASE_PATH },
    reuseExistingServer: false,
    timeout: 60_000,
  },
});
