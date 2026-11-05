import { test, expect } from "@playwright/test";

test.use({ storageState: "e2e/.auth/user.json" });
test("loads a sample workspace", async ({ page }) => {
  await page.goto("/today");
  await expect(page.getByRole("heading", { name: "Welcome, E2E!" })).toBeVisible();
  await page.getByRole("button", { name: "Load sample data" }).click();
  await expect(page.getByText("Observing").first()).toBeVisible();
  await expect(page.getByText("Gym Session Week 3").first()).toBeVisible();
  await expect(page.getByRole("region", { name: "To Do List" })).toContainText("UX Researching - Phase 2");
  await expect(page.getByRole("heading", { name: "Hi, E2E" })).toBeVisible();
  await expect(page.getByRole("region", { name: "Assistant" })).toContainText(/Your next task|all caught up/);
});
