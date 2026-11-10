import { describe, expect, it } from "vitest"
import { publicEnv } from "@/lib/env"

describe("env configuration", () => {
  it("resolves publicEnv alias and exports required fields", () => {
    expect(publicEnv).toBeDefined()
    expect(publicEnv.NEXT_PUBLIC_SITE_URL).toBeDefined()
    expect(publicEnv.NODE_ENV).toBeDefined()
  })

  it("newsletter disabled by default", () => {
    expect(publicEnv.NEWSLETTER_ENABLED).toBe("0")
  })
})
