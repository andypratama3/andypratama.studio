import { test, expect } from "@playwright/test"
import AxeBuilder from "@axe-core/playwright"

const routes = [
  "/en",
  "/en/services",
  "/en/products",
  "/en/products/dualbrand",
  "/en/contact",
  "/en/faq",
  "/en/work",
  "/en/work/sakolentra",
  "/en/about",
  "/en/journal",
  "/en/start",
  "/en/links",
  "/en/cv",
  "/en/privacy",
  "/en/terms",
  "/en/license",
]

test.describe("Public routes axe (serious+)", () => {
  for (const route of routes) {
    test(`${route} has no serious/critical axe violations`, async ({ page }) => {
      const res = await page.goto(route)
      expect(res?.ok() ?? false).toBeTruthy()
      await expect(page.locator("h1").first()).toBeVisible()
      const results = await new AxeBuilder({ page })
        .disableRules(["color-contrast"])
        .analyze()
      const serious = results.violations.filter(
        (v) => v.impact === "serious" || v.impact === "critical"
      )
      expect(serious, JSON.stringify(serious.map((v) => v.id))).toEqual([])
    })
  }
})
