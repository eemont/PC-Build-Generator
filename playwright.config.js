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
