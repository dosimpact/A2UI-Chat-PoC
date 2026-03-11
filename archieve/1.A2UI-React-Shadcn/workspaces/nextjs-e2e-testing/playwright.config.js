const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  retries: process.env.CI ? 1 : 0,
  use: {
    baseURL: 'http://127.0.0.1:4300',
    trace: 'on-first-retry'
  },
  webServer: {
    command: 'npm run dev -- --hostname 127.0.0.1 --port 4300',
    url: 'http://127.0.0.1:4300',
    reuseExistingServer: !process.env.CI
  }
});
