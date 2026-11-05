import { test, expect } from "@playwright/test";
import { ensureSampleData } from "./fixtures";

test.use({ storageState: "e2e/.auth/user.json" });
test("navigation and details work without horizontal overflow", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile", "Mobile only");
  await ensureSampleData(page);
  await page.getByRole("button", { name: "Open navigation menu" }).click();
  await expect(page.getByRole("dialog", { name: "Navigation" })).toBeVisible();
  await page.getByRole("dialog", { name: "Navigation" }).getByRole("button", { name: "Close" }).click();
  await expect(page.getByRole("dialog", { name: "Navigation" })).toBeHidden();
  await page.getByRole("button", { name: /Gym Session Week 3/ }).first().dblclick();
  await expect(page.getByRole("dialog", { name: "Details" })).toHaveCount(1);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
});
