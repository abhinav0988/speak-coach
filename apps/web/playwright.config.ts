import { defineConfig, devices } from "@playwright/test";

const BASE_URL = process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:4321";
const useLiveDeploy = Boolean(process.env.PLAYWRIGHT_BASE_URL);

/**
 * Prefer system Google Chrome when available so tests run even if
 * `npx playwright install` cannot download browser binaries.
 */
const chromeChannel = process.env.PLAYWRIGHT_CHANNEL ?? "chrome";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  workers: 2,
  timeout: 60_000,
  expect: { timeout: 15_000 },
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL: BASE_URL,
    headless: process.env.PLAYWRIGHT_HEADED === "1" ? false : true,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    // Video needs Playwright's ffmpeg binary; keep off unless `npx playwright install ffmpeg` succeeds.
    video: process.env.PLAYWRIGHT_VIDEO === "on" ? "retain-on-failure" : "off",
    channel: chromeChannel,
  },
  projects: [
    {
      name: "desktop-chrome",
      use: {
        ...devices["Desktop Chrome"],
        channel: chromeChannel,
        viewport: { width: 1440, height: 900 },
      },
    },
    {
      name: "mobile-iphone",
      use: {
        browserName: "chromium",
        channel: chromeChannel,
        viewport: { width: 390, height: 844 },
        isMobile: true,
        hasTouch: true,
        deviceScaleFactor: 3,
      },
    },
    {
      name: "tablet-ipad",
      use: {
        browserName: "chromium",
        channel: chromeChannel,
        viewport: { width: 834, height: 1194 },
        hasTouch: true,
        deviceScaleFactor: 2,
      },
    },
  ],
  webServer: useLiveDeploy
    ? undefined
    : {
        command: "node scripts/serve-out.mjs",
        port: 4321,
        reuseExistingServer: !process.env.CI,
        timeout: 30_000,
      },
});
