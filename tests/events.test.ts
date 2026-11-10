import { describe, expect, it, vi } from "vitest"
import { track, EVENT_NAMES } from "@/lib/events"

describe("track()", () => {
  it("exposes a fixed allow-list", () => {
    expect(EVENT_NAMES).toContain("video_play")
    expect(EVENT_NAMES).toContain("faq_open")
  })

  it("rejects unknown names without throwing", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {})
    expect(() => track("not_a_real_event")).not.toThrow()
    expect(warn).toHaveBeenCalled()
    warn.mockRestore()
  })

  it("accepts known names without throwing when no analytics bridge", () => {
    expect(() => track("final_cta_click", { source: "test" })).not.toThrow()
  })
})
