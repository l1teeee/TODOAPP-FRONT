import { expect, type Page } from "@playwright/test";

export async function ensureSampleData(page: Page) {
  await page.goto("/today");
  const welcome = page.getByRole("heading", { name: /Welcome/ });
  const board = page.getByRole("region", { name: "To Do List" });
  await expect(board).toHaveAttribute("aria-busy", "false");
  if (await welcome.isVisible()) {
    await page.getByRole("button", { name: "Load sample data" }).click();
    await expect(welcome).toBeHidden();
  }
  await expect(page.getByText("Gym Session Week 3").first()).toBeVisible();
}
