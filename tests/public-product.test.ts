import { describe, expect, it } from "vitest"
import { presentDualBrand } from "@/lib/public-product"

const row = {
  status: "live" as const,
  priceUsd: "49.00",
  gumroadUrl: "https://gumroad.com/l/dualbrand",
  demoUrl: "https://dualbrand.example",
}

describe("presentDualBrand", () => {
  it("hides the database price and unverified checkout links", () => {
    const view = presentDualBrand({
      contentPriceUsd: null,
      buyVerified: false,
      demoVerified: false,
      row,
    })

    expect(view.priceUsd).toBeNull()
    expect(view.showBuy).toBe(false)
    expect(view.showDemo).toBe(false)
    expect(JSON.stringify(view)).not.toContain("49")
    expect(JSON.stringify(view)).not.toContain("gumroad")
  })

  it("shows a verified buy link only while the catalog row is live", () => {
    expect(
      presentDualBrand({
        contentPriceUsd: 12,
        buyVerified: true,
        demoVerified: true,
        row,
      })
    ).toMatchObject({ priceUsd: "12.00", showBuy: true, showDemo: true })

    expect(
      presentDualBrand({
        contentPriceUsd: 49,
        buyVerified: true,
        demoVerified: true,
        row: { ...row, status: "draft" },
      }).showBuy
    ).toBe(false)
  })

  it("hides verified links when the database is down (fail closed)", () => {
    const view = presentDualBrand({
      contentPriceUsd: null,
      buyVerified: true,
      demoVerified: true,
      row: null,
    })

    expect(view.showBuy).toBe(false)
    expect(view.showDemo).toBe(false)
    expect(view.priceUsd).toBeNull()
  })
})
