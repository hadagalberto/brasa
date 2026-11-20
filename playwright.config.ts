import { defineConfig, devices } from '@playwright/test';

const PORT = 4321;
const BASE_PATH = process.env.PAGES_BASE_PATH ?? '/';
// Pin IPv4: on Node >= 20 macOS/Windows may resolve `localhost` to ::1 while
// Astro preview binds IPv4, making the webServer readiness check flaky.
const HOST = '127.0.0.1';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: [['list'], ['html', { open: 'never', outputFolder: 'playwright-report' }]],
  use: {
    baseURL: `http://${HOST}:${PORT}${BASE_PATH === '/' ? '' : BASE_PATH}`,
    colorScheme: 'dark',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'npm run preview -- --host 127.0.0.1',
    url: `http://${HOST}:${PORT}${BASE_PATH === '/' ? '/' : BASE_PATH}`,
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
});
