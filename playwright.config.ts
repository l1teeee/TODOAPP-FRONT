import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  globalSetup: "./e2e/global-setup.ts",
  workers: 1,
  retries: 0,
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL: process.env.E2E_BASE_URL ?? "http://localhost:3000",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  projects: [
    { name: "onboarding", testMatch: "onboarding.spec.ts", use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 }, storageState: "e2e/.auth/user.json" } },
    { name: "desktop", dependencies: ["onboarding"], testIgnore: "onboarding.spec.ts", use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } } },
    { name: "mobile", dependencies: ["onboarding"], testIgnore: "onboarding.spec.ts", use: { ...devices["iPhone 14"], defaultBrowserType: "chromium" } },
  ],
});
