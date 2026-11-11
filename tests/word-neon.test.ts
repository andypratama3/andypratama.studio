import { describe, expect, it } from "vitest"
import { wordNeonWindow } from "@/lib/word-neon"

describe("wordNeonWindow", () => {
  it("peaks each word later than the one before it", () => {
    const windows = [0, 1, 2, 3, 4, 5].map((index) => wordNeonWindow(index, 6))
    for (let i = 0; i < windows.length - 1; i += 1) {
      expect(windows[i].mid).toBeLessThan(windows[i + 1].mid)
      expect(windows[i].end).toBeLessThan(windows[i + 1].mid)
    }
    for (const window of windows) {
      expect(window.start).toBeLessThan(window.mid)
      expect(window.mid).toBeLessThan(window.end)
    }
  })
})
