import { test, expect } from "@playwright/test"

test.describe("/go outbound", () => {
  test("seeded slug returns 302 with its UTM source", async ({ request }) => {
    const res = await request.get("/go/threads-start", { maxRedirects: 0 })
    expect(res.status()).toBe(302)
    const location = res.headers().location ?? ""
    expect(location).toMatch(/^https:\/\//)
    expect(location).toContain("utm_source=threads")
  })

  test("unknown slug returns 404", async ({ request }) => {
    const res = await request.get("/go/not-a-real-profile", { maxRedirects: 0 })
    expect(res.status()).toBe(404)
  })

  test("unverified static destination stays unreachable", async ({ request }) => {
    const res = await request.get("/go/dualbrand", { maxRedirects: 0 })
    expect(res.status()).toBe(404)
  })
})
