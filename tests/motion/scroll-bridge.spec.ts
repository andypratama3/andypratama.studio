import { expect, test, type Page } from "@playwright/test"

type WordSnapshot = {
  word: string
  x: number
  width: number
  color: string
  opacity: number
  textShadow: string
}

async function readWords(page: Page) {
  return page.locator("p.text-wordmark > span").evaluateAll((elements) =>
    elements.map((element) => {
      const box = element.getBoundingClientRect()
      const style = getComputedStyle(element)
      return {
        word: element.textContent ?? "",
        x: box.x,
        width: box.width,
        color: style.color,
        opacity: Number(style.opacity),
        textShadow: style.textShadow,
      }
    }),
  )
}

async function nextFrame(page: Page) {
  await page.evaluate(
    () =>
      new Promise<void>((resolve) => {
        requestAnimationFrame(() => requestAnimationFrame(() => resolve()))
      }),
  )
}

test("ScrollBridge memiliki gap konsisten dan neon berpindah kata demi kata", async ({ page }) => {
  test.setTimeout(60_000)
  await page.goto("/", { waitUntil: "networkidle" })

  const bridge = page.locator("p.text-wordmark")
  await expect(bridge).toHaveCount(1)
  await expect(bridge.locator(":scope > span")).toHaveCount(6)

  const positionedWords = await readWords(page)
  const gaps = positionedWords.slice(1).map((word, index) => word.x - (positionedWords[index].x + positionedWords[index].width))
  const gapSpread = Math.max(...gaps) - Math.min(...gaps)

  console.log(
    `[scroll-bridge] positions=${positionedWords.map((word) => `${word.word}@${word.x.toFixed(2)}`).join(", ")}`,
  )
  console.log(`[scroll-bridge] gaps=${gaps.map((gap) => gap.toFixed(3)).join(", ")}; spread=${gapSpread.toFixed(3)}px`)
  expect(gapSpread).toBeLessThan(2)
  expect(gaps.every((gap) => gap >= 0)).toBe(true)

  await page.evaluate(() => {
    document.documentElement.style.scrollBehavior = "auto"
  })
  const range = await bridge.evaluate((element) => {
    const target = element.parentElement
    if (!target) throw new Error("ScrollBridge target is missing")
    const targetBox = target.getBoundingClientRect()
    return {
      start: targetBox.top + window.scrollY - window.innerHeight,
      end: targetBox.top + window.scrollY + targetBox.height,
    }
  })

  const sampleCount = 121
  const samples: WordSnapshot[][] = []
  for (let index = 0; index <= sampleCount; index += 1) {
    const progress = index / sampleCount
    const scrollY = range.start + (range.end - range.start) * progress
    await page.evaluate((y) => window.scrollTo(0, y), scrollY)
    await nextFrame(page)
    samples.push(await readWords(page))
  }

  const isNeon = (word: WordSnapshot) => word.color === "rgb(62, 197, 255)" && word.textShadow.includes("22px")
  const neonPeaks = positionedWords.map((word, wordIndex) => {
    const candidates = samples.map((sample) => sample[wordIndex]).filter(isNeon)
    return candidates.reduce<WordSnapshot | null>((best, candidate) => {
      if (!best || candidate.opacity > best.opacity) return candidate
      return best
    }, null)
  })

  const activeOrder: number[] = []
  for (const sample of samples) {
    const activeIndex = sample.findIndex(isNeon)
    if (activeIndex >= 0 && activeOrder.at(-1) !== activeIndex) activeOrder.push(activeIndex)
  }

  const maximumConcurrentNeons = Math.max(...samples.map((sample) => sample.filter(isNeon).length))

  console.log(
    `[scroll-bridge] activeOrder=${activeOrder.join(" -> ")}; maxConcurrentNeons=${maximumConcurrentNeons}; range=${range.start.toFixed(1)}..${range.end.toFixed(1)}`,
  )
  console.log(
    `[scroll-bridge] neonPeaks=${neonPeaks
      .map((peak) => peak ? `${peak.word}: opacity=${peak.opacity.toFixed(3)}, color=${peak.color}, shadow=${peak.textShadow}` : "missing")
      .join(" | ")}`,
  )

  expect(activeOrder).toEqual([0, 1, 2, 3, 4, 5])
  expect(maximumConcurrentNeons).toBe(1)
  for (const peak of neonPeaks) {
    expect(peak).not.toBeNull()
    expect(peak?.opacity).toBeGreaterThanOrEqual(0.8)
    expect(peak?.color).toBe("rgb(62, 197, 255)")
    expect(peak?.textShadow).toContain("22px")
  }
})
