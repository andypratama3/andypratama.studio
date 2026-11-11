import { describe, expect, it } from "vitest"
import { wordNeonWindow } from "@/lib/word-neon"

describe("wordNeonWindow", () => {
  it("peaks each word later than the one before it", () => {
    const windows = [0, 1, 2, 3].map((index) => wordNeonWindow(index, 4))
    const mids = windows.map((window) => window.mid)
    expect(mids[0]).toBeLessThan(mids[1])
    expect(mids[1]).toBeLessThan(mids[2])
    expect(mids[2]).toBeLessThan(mids[3])
    expect(windows[0].end).toBeLessThan(windows[1].mid)
    expect(windows[1].end).toBeLessThan(windows[2].mid)
    expect(windows[2].end).toBeLessThan(windows[3].mid)
    for (const window of windows) {
      expect(window.start).toBeLessThan(window.mid)
      expect(window.mid).toBeLessThan(window.end)
    }
  })
})
