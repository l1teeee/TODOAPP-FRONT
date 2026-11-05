import { test, expect } from "@playwright/test";

test("registration validates fields and displays verification", async ({ page }) => {
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
