import { describe, expect, it } from "vitest"

import { csvCell } from "@/lib/csv"

describe("csvCell", () => {
  it("neutralises spreadsheet formulas", () => {
    expect(csvCell("=cmd|' /C calc'!A0")).toBe("'=cmd|' /C calc'!A0")
    expect(csvCell("+49")).toBe("'+49")
    expect(csvCell("-49")).toBe("'-49")
    expect(csvCell("@SUM(A1)")).toBe("'@SUM(A1)")
  })

  it("quotes separators and newlines", () => {
    expect(csvCell('a,b')).toBe('"a,b"')
    expect(csvCell('a"b')).toBe('"a""b"')
    expect(csvCell("a\nb")).toBe('"a\nb"')
  })

  it("keeps normal text intact", () => {
    expect(csvCell("andy@example.com")).toBe("andy@example.com")
    expect(csvCell(null)).toBe("")
  })
})
