import { test, expect } from "@playwright/test"
import AxeBuilder from "@axe-core/playwright"

test.describe("Home public surface", () => {
  test("renders hero and skip link", async ({ page }) => {
    // The intro overlay is modal while it runs, so seed it as seen to test
    // the page beneath it. The overlay itself is covered below.
    await page.addInitScript(() => {
      try {
        sessionStorage.setItem("studio-intro-seen", "1")
      } catch {
        /* storage unavailable */
      }
    })
    await page.goto("/en")
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible()
    await page.keyboard.press("Tab")
    const skip = page.getByRole("link", { name: /skip to content/i })
    await expect(skip).toBeFocused()
  })

  test("intro overlay keeps the page behind it out of reach", async ({ page }) => {
    await page.goto("/en")
    const overlay = page.locator(".studio-intro")
    await expect(overlay).toBeVisible()
    // aria-modal="true" is only honest when nothing behind can be focused.
    await expect(page.locator('a[href="#main"]')).toHaveAttribute("inert", "")
    await expect(page.locator("header")).toHaveAttribute("inert", "")
    // The first Tab inside the overlay reaches its only control.
    await page.keyboard.press("Tab")
    await expect(page.getByRole("button", { name: /skip intro/i })).toBeFocused()

    await page.keyboard.press("Escape")
    await expect(overlay).toBeHidden()
    await expect(page.locator('a[href="#main"]')).not.toHaveAttribute("inert", "")
    // Focus returns to the page top, so the skip link is still the first stop.
    await expect(page.getByRole("link", { name: /skip to content/i })).toBeFocused()
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
