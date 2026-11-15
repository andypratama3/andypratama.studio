import { describe, expect, it } from "vitest"

import { isAllowedBrowserOrigin } from "@/lib/request-security"

function request(origin: string | null, url: string) {
  return new Request(url, {
    method: "POST",
    headers: origin ? { origin } : {},
  })
}

describe("isAllowedBrowserOrigin", () => {
  it("allows requests without an origin header (server-to-server)", () => {
    expect(isAllowedBrowserOrigin(request(null, "http://localhost:3000/api/contact"))).toBe(true)
  })

  it("allows the configured site origin", () => {
    const previous = process.env.NEXT_PUBLIC_SITE_URL
    process.env.NEXT_PUBLIC_SITE_URL = "https://andypratama.studio"
    try {
      expect(
        isAllowedBrowserOrigin(
          request("https://andypratama.studio", "https://andypratama.studio/api/contact")
        )
      ).toBe(true)
    } finally {
      if (previous === undefined) delete process.env.NEXT_PUBLIC_SITE_URL
      else process.env.NEXT_PUBLIC_SITE_URL = previous
    }
  })

  it("allows same-origin posts on preview hosts", () => {
    expect(
      isAllowedBrowserOrigin(
        request("http://127.0.0.1:3103", "http://127.0.0.1:3103/api/contact")
      )
    ).toBe(true)
  })

  it("rejects an origin spoofed with forwarded host headers", () => {
    const req = new Request("http://internal-host:3000/api/contact", {
      method: "POST",
      headers: {
        origin: "https://attacker.example",
        "x-forwarded-host": "attacker.example",
      },
    })
    expect(isAllowedBrowserOrigin(req)).toBe(false)
  })

  it("rejects cross-site origins", () => {
    expect(
      isAllowedBrowserOrigin(
        request("https://evil.example", "http://127.0.0.1:3103/api/contact")
      )
    ).toBe(false)
  })
})
