import { test, expect } from "@playwright/test"
import AxeBuilder from "@axe-core/playwright"

test.describe("Home public surface", () => {
  test("renders hero and skip link", async ({ page }) => {
    await page.goto("/en")
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible()
    await page.keyboard.press("Tab")
    const skip = page.getByRole("link", { name: /skip to content/i })
    await expect(skip).toBeFocused()
  })

  test("no serious axe violations on Home", async ({ page }) => {
    await page.goto("/en")
    const results = await new AxeBuilder({ page })
      .disableRules(["color-contrast"]) // design tokens audited separately
      .analyze()
    const serious = results.violations.filter(
      (v) => v.impact === "serious" || v.impact === "critical"
    )
    expect(serious).toEqual([])
  })
})
