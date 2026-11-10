import { describe, expect, it, beforeEach } from "vitest"
import { __resetRateLimitForTests, rateLimit } from "@/lib/rate-limit"

describe("rateLimit", () => {
  beforeEach(() => {
    __resetRateLimitForTests()
  })

  it("allows under the limit then blocks", () => {
    expect(rateLimit("t", 2, 60_000).ok).toBe(true)
    expect(rateLimit("t", 2, 60_000).ok).toBe(true)
    expect(rateLimit("t", 2, 60_000).ok).toBe(false)
  })
})
