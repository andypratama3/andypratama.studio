import { test, expect } from "@playwright/test"

test.describe("/go outbound", () => {
  test("dualbrand returns 302 to Gumroad", async ({ request }) => {
    const res = await request.get("/go/dualbrand", { maxRedirects: 0 })
    expect(res.status()).toBe(302)
    const location = res.headers().location ?? ""
    expect(location).toMatch(/gumroad\.com\/l\/dualbrand/)
  })

  test("unknown slug redirects home", async ({ request }) => {
    const res = await request.get("/go/not-a-real-profile", { maxRedirects: 0 })
    expect(res.status()).toBe(302)
    const location = res.headers().location ?? ""
    expect(location).toMatch(/\/$|\/en\/?$/)
  })
})
