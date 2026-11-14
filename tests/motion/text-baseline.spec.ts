import { test } from "@playwright/test"
import { mkdirSync, writeFileSync } from "node:fs"

const routes = [
  "/",
  "/id",
  "/start",
  "/services",
  "/products",
  "/products/dualbrand",
  "/work",
  "/work/sakolentra",
  "/journal",
  "/about",
  "/contact",
  "/faq",
  "/cv",
  "/links",
  "/privacy",
  "/terms",
  "/license",
]
const outDir = process.env.BASELINE_DIR ?? "test-results/baseline"

for (const route of routes) {
  test(`teks ${route}`, async ({ page }) => {
    test.setTimeout(60_000)
    await page.emulateMedia({ reducedMotion: "reduce" })
    await page.goto(route, { waitUntil: "networkidle" })
    const dump = await page.evaluate(() => ({
      url: location.pathname,
      text: document.body.innerText,
      alts: Array.from(document.images, (img) => img.alt),
      labels: Array.from(document.querySelectorAll("[aria-label]"), (el) =>
        el.getAttribute("aria-label")
      ),
    }))
    mkdirSync(outDir, { recursive: true })
    const name = route === "/" ? "home" : route.replace(/\W+/g, "_")
    writeFileSync(`${outDir}/${name}.json`, JSON.stringify(dump, null, 2))
  })
}
