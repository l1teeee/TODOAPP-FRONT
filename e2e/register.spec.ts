import { test, expect } from "@playwright/test";

const baseUrl = process.env.E2E_BASE_URL ?? "http://localhost:3000";
// Cloudflare test keys pass automated browsers; real keys challenge them.
const usesTestTurnstileKeys = /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(baseUrl);

test("registration validates fields and displays verification", async ({ page }) => {
  test.skip(!usesTestTurnstileKeys, "Real Turnstile keys challenge automated browsers.");
  await page.goto("/register");
  await expect(page.locator('input[name="cf-turnstile-response"]')).not.toHaveValue("", { timeout: 15_000 });
  const submit = page.getByRole("button", { name: "Create account" });
  await expect(submit).toBeEnabled();
  await submit.click();
  await expect(page.getByText("Email is required.")).toBeVisible();
  await expect(page.getByText("Full name must be between 1 and 80 characters.")).toBeVisible();
  await page.getByLabel("Full name").fill("Test User");
  await page.getByLabel("Email").fill("test@example.com");
  await page.getByLabel("Password", { exact: true }).fill("password1");
  await page.getByLabel("Confirm password").fill("different1");
  await submit.click();
  await expect(page.getByText("Passwords do not match.")).toBeVisible();
});

test("registration loads the Turnstile widget", async ({ page }) => {
  await page.goto("/register");
  await expect(page.locator('input[name="cf-turnstile-response"]')).toBeAttached({ timeout: 15_000 });
});
