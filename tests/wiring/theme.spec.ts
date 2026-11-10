import { test, expect } from "@playwright/test"

test.describe("next-themes wiring", () => {
  test("theme toggle changes html class without crash", async ({ page }) => {
    await page.goto("/dev/wiring")
    await expect(page.getByRole("heading", { name: "Plugin wiring" })).toBeVisible()

    await expect
      .poll(async () => page.locator("html").getAttribute("class") ?? "")
      .toMatch(/(?:^|\s)(light|dark)(?:\s|$)/)

    await page.getByRole("button", { name: "Theme dark" }).click()
    await expect
      .poll(async () => page.locator("html").getAttribute("class") ?? "")
      .toMatch(/(?:^|\s)dark(?:\s|$)/)

    await page.getByRole("button", { name: "Theme light" }).click()
    await expect
      .poll(async () => page.locator("html").getAttribute("class") ?? "")
      .toMatch(/(?:^|\s)light(?:\s|$)/)
  })
})
