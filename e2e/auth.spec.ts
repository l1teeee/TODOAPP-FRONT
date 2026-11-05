import { test, expect } from "@playwright/test";

test("anonymous users are redirected and can sign in and out", async ({ page }) => {
  await page.goto("/today", { waitUntil: "networkidle" });
  await expect(page).toHaveURL(/\/login/);
  await page.getByLabel("Email").fill(process.env.E2E_USER_EMAIL || "e2e@example.com");
  await page.getByLabel("Password", { exact: true }).fill("Wrongpassword123");
  await page.getByRole("button", { name: "Log in" }).click();
  await expect(page.getByRole("alert")).toBeVisible();
  await page.getByLabel("Password", { exact: true }).fill(process.env.E2E_USER_PASSWORD || "");
  await page.getByRole("button", { name: "Log in" }).click();
  await expect(page).toHaveURL(/\/today/);
  await page.getByRole("button", { name: /account menu/i }).first().click();
  await page.getByRole("menuitem", { name: /sign out|log out/i }).click();
  await expect(page).toHaveURL(/\/login/);
});
