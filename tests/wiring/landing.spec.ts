import { test, expect } from "@playwright/test"

test.describe("Landing surface regressions", () => {
  test("service rows do not double their hairline borders", async ({ page }) => {
    await page.goto("/en")
    const rows = page.locator("a.reveal-line")
    await expect(rows.first()).toBeVisible()
    const topWidths = await rows.evaluateAll((nodes) =>
      nodes.map((node) => getComputedStyle(node).borderTopWidth)
    )
    expect(topWidths).toEqual(topWidths.map(() => "0px"))
  })

  test("brand link has a 44px tap target", async ({ page }) => {
    await page.goto("/en")
    const brand = page.locator("header a[href='/']").first()
    await expect(brand).toBeVisible()
    await expect
      .poll(async () => (await brand.boundingBox())?.height ?? 0, {
        timeout: 5000,
      })
      .toBeGreaterThanOrEqual(44)
  })

  test("links page prefetches no /go route and logs no CSP errors", async ({
    page,
  }) => {
    const errors: string[] = []
    const goPrefetches: string[] = []
    page.on("console", (message) => {
      if (message.type() === "error") errors.push(message.text())
    })
    page.on("request", (request) => {
      if (request.url().includes("/go/") && request.url().includes("_rsc")) {
        goPrefetches.push(request.url())
      }
    })

    await page.goto("/en/links")
    await page.waitForTimeout(1500)

    expect(goPrefetches).toEqual([])
    expect(errors.filter((text) => text.includes("Content Security Policy"))).toEqual([])
  })

  test("dashboard sends unauthenticated users to the real sign-in route", async ({
    request,
  }) => {
    const response = await request.get("/dashboard", { maxRedirects: 0 })
    expect(response.status()).toBe(307)
    const location = response.headers().location ?? ""
    expect(location).toMatch(/\/sign-in$/)
    expect(location).not.toContain("/auth/")
  })
})
