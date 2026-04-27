<<<<<<< HEAD
// playwright.config.js
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: 'html',
  
  use: {
    baseURL: 'http://127.0.0.1:5173', 
    trace: 'on-first-retry',
  },
  
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
  ],
  
  webServer: {
    command: 'npm run dev -- --host 127.0.0.1', 
    url: 'http://127.0.0.1:5173', 
    reuseExistingServer: !process.env.CI,
  },
});
=======
import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./src/tests/e2e",
  use: {
    baseURL: "http://localhost:5173",
    headless: true,
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,
    storageState: "playwright/.auth/session.json"
  },

  webServer: {
    command: "npm run dev",
    port: 5173,
    reuseExistingServer: true,
  },
});
>>>>>>> 1f5bfadc14198b97fff8b900421aefbcf56e5250
