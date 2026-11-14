import { describe, expect, it } from "vitest"

import {
  createLinkSchema,
  isSafeDestination,
  linkSlugSchema,
} from "@/lib/link-validation"

describe("link validation", () => {
  it("accepts lowercase slugs with dashes and numbers", () => {
    expect(linkSlugSchema.safeParse("promo-dualbrand-2").success).toBe(true)
  })

  it("rejects uppercase, spaces, and unsafe characters", () => {
    expect(linkSlugSchema.safeParse("Promo").success).toBe(false)
    expect(linkSlugSchema.safeParse("promo dualbrand").success).toBe(false)
    expect(linkSlugSchema.safeParse("../etc/passwd").success).toBe(false)
    expect(linkSlugSchema.safeParse("a").success).toBe(false)
  })

  it("only allows https destinations outside development", () => {
    expect(isSafeDestination("https://example.com/start")).toBe(true)
    expect(isSafeDestination("http://example.com/start")).toBe(false)
    expect(isSafeDestination("javascript:alert(1)")).toBe(false)
    expect(isSafeDestination("data:text/html,hi")).toBe(false)
    expect(isSafeDestination("http://localhost:3000/start")).toBe(true)
  })

  it("rejects a full payload with a javascript URL", () => {
    const parsed = createLinkSchema.safeParse({
      slug: "promo",
      destination: "javascript:alert(1)",
    })
    expect(parsed.success).toBe(false)
  })
})
