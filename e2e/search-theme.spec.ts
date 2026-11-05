import { test, expect } from "@playwright/test";
import { ensureSampleData } from "./fixtures";

test.use({ storageState: "e2e/.auth/user.json" });
test("search filters activities and dark theme persists", async ({ page }, testInfo) => {
  await ensureSampleData(page);
  await page.getByRole("searchbox", { name: "Search activities" }).fill("Gym Session Week 3");
  await expect(page.getByText("Gym Session Week 3").first()).toBeVisible();
  await expect(page.getByText("Advanced Piano Class")).toHaveCount(0);
  if (testInfo.project.name === "mobile") {
    const topBar = page.getByRole("button", { name: "Open navigation menu" }).locator("../..");
    await topBar.getByRole("button", { name: /dark/i }).click();
  } else {
    await page.getByRole("button", { name: "Dark theme" }).first().click();
  }
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
});
