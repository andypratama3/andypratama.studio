import { describe, expect, it } from "vitest"

import { buildLeadNotes, contactTopicToSegment } from "@/lib/contact-lead"
import { TOPICS } from "@/lib/schemas/contact"

describe("contact topic mapping", () => {
  it("maps every topic to a known lead segment", () => {
    expect(TOPICS.map(contactTopicToSegment)).toEqual([
      "multi_brand",
      "perekrut",
      "sekolah",
      "lainnya",
    ])
  })

  it("prefixes notes with the topic", () => {
    expect(buildLeadNotes("hiring", "Butuh kontrak 6 bulan")).toBe(
      "[hiring] Butuh kontrak 6 bulan"
    )
  })
})
