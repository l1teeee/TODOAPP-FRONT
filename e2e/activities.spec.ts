import { test, expect } from "@playwright/test";
import { ensureSampleData } from "./fixtures";

test.use({ storageState: "e2e/.auth/user.json" });
test("creates and completes a task and restores a reminder", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop", "Desktop only");
  const suffix = `${testInfo.project.name}-${Date.now().toString(36)}`;
  const taskName = `E2E task ${suffix}`;
  const subtaskName = `E2E subtask ${suffix}`;
  await ensureSampleData(page);
  await page.getByRole("button", { name: "New Activity" }).click();
  const dialog = page.getByRole("dialog", { name: "New activity" });
  await dialog.getByLabel("Title").fill(taskName);
  await dialog.getByRole("button", { name: "Create activity" }).click();
  const task = page.getByRole("button", { name: taskName });
  await expect(task).toBeVisible();
  await task.click();
  await page.getByRole("button", { name: "Add subtask" }).click();
  await page.getByLabel("New subtask title").fill(subtaskName);
  await page.getByLabel("New subtask title").press("Enter");
  await page.getByRole("checkbox", { name: subtaskName }).click();
  await expect(page.getByRole("checkbox", { name: subtaskName })).toBeChecked();
  await page.getByRole("button", { name: "Mark as Done" }).click();
  await expect(page.getByRole("button", { name: "Mark as not done" })).toBeVisible();
  const reminder = page.getByRole("button", { name: /Gym Session Week 3/ });
  await reminder.getByRole("button", { name: "More actions" }).click();
  const trashed = page.waitForResponse(
    (response) => response.request().method() === "POST" && /\/v1\/activities\/[^/]+\/trash$/.test(new URL(response.url()).pathname) && response.ok(),
  );
  await page.getByRole("menuitem", { name: "Move to trash" }).click();
  await trashed;
  await page.goto("/trash");
  await expect(page.getByText("Gym Session Week 3")).toBeVisible();
  await page.getByRole("button", { name: "Restore" }).click();
  await expect(page.getByText("Gym Session Week 3")).toHaveCount(0);
});
