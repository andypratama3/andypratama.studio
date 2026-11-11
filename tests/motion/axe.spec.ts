import { test, expect } from "@playwright/test"
import AxeBuilder from "@axe-core/playwright"

const routes = ["/", "/id", "/start", "/services", "/products", "/products/dualbrand", "/work", "/work/sakolentra", "/journal", "/about", "/faq", "/cv", "/links", "/privacy", "/terms", "/license"]

test.describe("motion routes axe", () => {
  test.use({ reducedMotion: "reduce" })

  for (const route of routes) {
    test(`${route} has no serious or critical violations`, async ({ page }) => {
      const response = await page.goto(route, { waitUntil: "networkidle" })
      expect(response?.ok() ?? false).toBeTruthy()
      const results = await new AxeBuilder({ page }).disableRules(["color-contrast"]).analyze()
      const serious = results.violations.filter((v) => v.impact === "serious" || v.impact === "critical")
      expect(serious.map((v) => v.id)).toEqual([])
    })
  }
})
