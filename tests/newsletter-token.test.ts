import { describe, expect, it, vi } from "vitest"

vi.mock("server-only", () => ({}))
vi.mock("@/db", () => ({ db: {} }))

import { hashNewsletterToken } from "@/lib/newsletter"

describe("newsletter token hashing", () => {
  it("is deterministic, hex, and token-specific", () => {
    const a = hashNewsletterToken("token-a")
    expect(a).toBe(hashNewsletterToken("token-a"))
    expect(a).toMatch(/^[a-f0-9]{64}$/)
    expect(a).not.toBe(hashNewsletterToken("token-b"))
  })
})
