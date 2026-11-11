import { readFileSync } from "node:fs"
import { describe, expect, it } from "vitest"

import { motionCss } from "@/lib/motion"

describe("motion tokens", () => {
  it("matches the CSS custom properties in :root", () => {
    const css = readFileSync("src/app/globals.css", "utf8")
    const root = css.match(/:root\s*\{([\s\S]*?)\n\}/)
    expect(root).not.toBeNull()
    const block = root?.[1] ?? ""
    for (const [name, value] of Object.entries(motionCss)) {
      expect(block).toContain(`${name}: ${value};`)
    }
  })
})
