import { defineConfig } from '@playwright/test';

/**
 * Pure Node.js test run — no browsers are launched or installed.
 * Playwright Test is used here as the test runner for a unit-level suite.
 */
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0,
  reporter: process.env.CI
    ? [['list'], ['html', { open: 'never' }]]
    : [['list']],
});
