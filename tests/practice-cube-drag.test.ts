import { describe, expect, it } from "vitest"
import { yawAdjustToFace } from "@/lib/cube-yaw"

describe("yawAdjustToFace", () => {
  it("settles a swipe onto the nearest side", () => {
    expect(yawAdjustToFace(10)).toBe(-10)
    expect(yawAdjustToFace(80)).toBe(10)
    expect(yawAdjustToFace(0)).toBe(0)
    expect(yawAdjustToFace(350)).toBe(10)
  })
})
