import { test } from "@playwright/test"
import { mkdirSync, writeFileSync } from "node:fs"

type Metrics = {
  cls: number
  lcp: number
  longTasks: number
  observerErrors: string[]
}

const outDir = process.env.BASELINE_DIR ?? "test-results/baseline"

for (const path of ["/", "/start", "/products/dualbrand"]) {
  test(`metrik ${path}`, async ({ page }) => {
    test.setTimeout(60_000)
    await page.addInitScript(() => {
      const w = window as unknown as { __m: Metrics }
      w.__m = { cls: 0, lcp: 0, longTasks: 0, observerErrors: [] }
      const watch = (type: string, onEntry: (entry: PerformanceEntry) => void) => {
        try {
          new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) onEntry(entry)
          }).observe({ type, buffered: true })
        } catch (error) {
          w.__m.observerErrors.push(`${type}: ${error instanceof Error ? error.message : String(error)}`)
        }
      }
      watch("layout-shift", (entry) => {
        const shift = entry as unknown as { value: number; hadRecentInput: boolean }
        if (!shift.hadRecentInput) w.__m.cls += shift.value
      })
      watch("largest-contentful-paint", (entry) => {
        w.__m.lcp = entry.startTime
      })
      watch("longtask", () => {
        w.__m.longTasks += 1
      })
    })
    await page.goto(path, { waitUntil: "load" })
    const animationsAtLoad = await page.evaluate(() => document.getAnimations().length)
    for (let i = 0; i < 12; i++) {
      await page.mouse.wheel(0, 700)
      await page.waitForTimeout(250)
    }
    const animationsAfterScroll = await page.evaluate(() => document.getAnimations().length)
    const metrics = await page.evaluate(() => {
      const live = (window as unknown as { __m: Metrics }).__m
      const lcpEntries = performance.getEntriesByType("largest-contentful-paint")
      const lastLcp = lcpEntries.at(-1)
      const shifts = performance.getEntriesByType("layout-shift")
      let clsFromBuffer = 0
      for (const entry of shifts) {
        const shift = entry as unknown as { value: number; hadRecentInput: boolean }
        if (!shift.hadRecentInput) clsFromBuffer += shift.value
      }
      return {
        ...live,
        lcpFromBuffer: lastLcp ? lastLcp.startTime : 0,
        clsFromBuffer,
        longTaskEntries: performance.getEntriesByType("longtask").length,
      }
    })
    mkdirSync(outDir, { recursive: true })
    const slug = path === "/" ? "home" : path.replace(/\W+/g, "_").replace(/^_+/, "")
    writeFileSync(
      `${outDir}/metrics-${slug}.json`,
      JSON.stringify(
        {
          path,
          ...metrics,
          animationsAtLoad,
          animationsAfterScroll,
          cpuThrottle: 1,
          note: "No DevTools CPU throttle. Compare later runs with the same spec and machine.",
        },
        null,
        2
      )
    )
  })
}
