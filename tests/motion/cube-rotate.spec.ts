import { expect, test, type Page } from "@playwright/test"

const YAW_TOLERANCE_DEGREES = 2
const DRAG_DEGREES_PER_PIXEL = 0.55

function angularDistance(first: number, second: number) {
  const difference = Math.abs(first - second) % 360
  return Math.min(difference, 360 - difference)
}

function nearestQuarterTurn(yaw: number) {
  const normalized = ((yaw % 360) + 360) % 360
  return Math.round(normalized / 90) * 90
}

async function readYaw(page: Page) {
  const transform = await page.locator(".practice-cube").getAttribute("style")
  const match = transform?.match(/rotateY\((-?[\d.]+)deg\)/)
  if (!match?.[1]) throw new Error(`practice-cube has no rotateY transform: ${transform ?? "missing style"}`)
  return Number(match[1])
}

/** Waits until the rendered yaw stops moving so assertions read the settled state. */
async function readStableYaw(page: Page) {
  let previous = await readYaw(page)
  for (let attempt = 0; attempt < 20; attempt += 1) {
    await page.waitForTimeout(100)
    const current = await readYaw(page)
    if (Math.abs(current - previous) <= 0.5) return current
    previous = current
  }
  return previous
}

async function dragCube(page: Page, deltaX: number) {
  const cube = page.locator(".practice-cube")
  const box = await cube.boundingBox()
  if (!box) throw new Error("practice-cube has no bounding box")

  const startX = box.x + box.width / 2
  const startY = box.y + box.height / 2
  await page.mouse.move(startX, startY)
  await page.mouse.down()
  for (const step of [0.25, 0.5, 0.75, 1]) {
    await page.mouse.move(startX + deltaX * step, startY, { steps: 3 })
    await page.waitForTimeout(50)
  }
  await page.mouse.up()
  return readStableYaw(page)
}

async function scrollToExact(page: Page, targetY: number) {
  await page.evaluate((y) => {
    document.documentElement.style.scrollBehavior = "auto"
    window.scrollTo(0, y)
  }, targetY)
  await page.waitForFunction((y) => Math.abs(window.scrollY - y) <= 1, targetY)
  await page.waitForTimeout(400)
}

async function expectFrontFace(page: Page, yaw: number) {
  const normalized = ((yaw % 360) + 360) % 360
  const expectedFront = normalized < 45 || normalized >= 315 ? 0 : normalized < 135 ? 3 : normalized < 225 ? 2 : 1
  const inert = await page.locator(".practice-face").evaluateAll((faces) => faces.map((face) => face.hasAttribute("inert")))

  expect(inert).toHaveLength(6)
  expect(inert[expectedFront]).toBe(false)
  expect(inert.filter((value, index) => index < 4 && !value)).toHaveLength(1)
  expect(inert.slice(4).every(Boolean)).toBe(true)
}

test.describe("cube rotation", () => {
  test.describe.configure({ mode: "serial" })

  const scenarios = [
    { name: "drag kanan +90 derajat", deltaX: 164 },
    { name: "drag kiri -90 derajat", deltaX: -164 },
    { name: "drag kanan +180 derajat", deltaX: 328 },
  ]

  for (const scenario of scenarios) {
    test(`cube snap ${scenario.name} tetap terkunci saat halaman di-scroll`, async ({ page }) => {
      test.setTimeout(60_000)
      await page.goto("/", { waitUntil: "networkidle" })

      const cube = page.locator(".practice-cube")
      await cube.evaluate((element) => element.scrollIntoView({ block: "center" }))
      await page.waitForTimeout(1_000)

      const beforeDrag = await readStableYaw(page)
      const originalScrollY = await page.evaluate(() => window.scrollY)
      const afterDrag = await dragCube(page, scenario.deltaX)
      const expectedYaw = nearestQuarterTurn(beforeDrag + scenario.deltaX * DRAG_DEGREES_PER_PIXEL)
      const quarterTurnError = angularDistance(afterDrag, expectedYaw)

      console.log(
        `[cube-rotate] ${scenario.name}: before=${beforeDrag.toFixed(3)}deg, after=${afterDrag.toFixed(3)}deg, expected=${expectedYaw}deg, error=${quarterTurnError.toFixed(3)}deg`,
      )
      expect(quarterTurnError).toBeLessThanOrEqual(YAW_TOLERANCE_DEGREES)
      expect(angularDistance(afterDrag, Math.round(afterDrag / 90) * 90)).toBeLessThanOrEqual(YAW_TOLERANCE_DEGREES)
      await expectFrontFace(page, afterDrag)

      await scrollToExact(page, originalScrollY + 600)
      const afterScrollDown = await readYaw(page)
      await scrollToExact(page, originalScrollY - 600)
      const afterScrollUp = await readYaw(page)

      console.log(
        `[cube-rotate] ${scenario.name}: scrollY=${originalScrollY}, +600=${afterScrollDown.toFixed(3)}deg, -600=${afterScrollUp.toFixed(3)}deg`,
      )
      expect(angularDistance(afterScrollDown, afterDrag)).toBeLessThanOrEqual(YAW_TOLERANCE_DEGREES)
      expect(angularDistance(afterScrollUp, afterDrag)).toBeLessThanOrEqual(YAW_TOLERANCE_DEGREES)
    })
  }
})
