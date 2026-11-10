import { describe, it, expect } from "vitest"
import { faq } from "@/content/faq"
import { facts } from "@/content/facts"
import { getResolvedFaqItems, resolveFaqTokens } from "@/lib/resolve-faq-tokens"

const FORBIDDEN_EN = [
  "seamless",
  "elevate",
  "unlock",
  "leverage",
  "cutting-edge",
  "revolutionize",
  "next-level",
  "game-changer",
  "supercharge",
  "empower",
  "robust",
  "delve",
  "in today's fast-paced world",
]

const FORBIDDEN_ID = [
  "revolusioner",
  "solusi terdepan",
  "transformasi digital",
  "sinergi",
  "era digital ini",
  "kami berkomitmen",
]

describe("faq array shape", () => {
  it("contains exactly 19 items", () => {
    expect(faq).toHaveLength(19)
  })

  it("has exactly 6 home:true items", () => {
    const homeItems = faq.filter((item) => item.home === true)
    expect(homeItems).toHaveLength(6)
  })

  it("has unique ids", () => {
    const ids = faq.map((item) => item.id)
    const unique = new Set(ids)
    expect(unique.size).toBe(ids.length)
  })

  it("answers are at most 60 words", () => {
    for (const item of faq) {
      const enWords = item.a.en.replace(/\{[^}]+\}/g, "PLACEHOLDER").trim().split(/\s+/).length
      const idWords = item.a.id.replace(/\{[^}]+\}/g, "PLACEHOLDER").trim().split(/\s+/).length
      expect(enWords, `${item.id} EN answer exceeds 60 words`).toBeLessThanOrEqual(60)
      expect(idWords, `${item.id} ID answer exceeds 60 words`).toBeLessThanOrEqual(60)
    }
  })

  it("all {fact:id} tokens reference existing facts", () => {
    const tokenRegex = /\{fact:(\w+)\}/g
    for (const item of faq) {
      for (const text of [item.a.en, item.a.id]) {
        let match
        tokenRegex.lastIndex = 0
        while ((match = tokenRegex.exec(text)) !== null) {
          const id = match[1]
          expect(
            Object.prototype.hasOwnProperty.call(facts, id),
            `Token {fact:${id}} in item "${item.id}" not found in facts`
          ).toBe(true)
        }
      }
    }
  })

  it("answers contain no forbidden EN buzzwords", () => {
    for (const item of faq) {
      for (const word of FORBIDDEN_EN) {
        const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
        const regex = new RegExp(`\\b${escaped}\\b`, "i")
        expect(
          regex.test(item.a.en),
          `Item "${item.id}" EN answer contains forbidden word: "${word}"`
        ).toBe(false)
      }
    }
  })

  it("answers contain no forbidden ID buzzwords", () => {
    for (const item of faq) {
      for (const word of FORBIDDEN_ID) {
        const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
        const regex = new RegExp(`\\b${escaped}\\b`, "i")
        expect(
          regex.test(item.a.id),
          `Item "${item.id}" ID answer contains forbidden word: "${word}"`
        ).toBe(false)
      }
    }
  })

  it("pendingOwner is set on 'ai' and 'start'", () => {
    const ai = faq.find((item) => item.id === "ai")
    const start = faq.find((item) => item.id === "start")
    expect(ai?.pendingOwner).toBe(true)
    expect(start?.pendingOwner).toBe(true)
  })
})

describe("getResolvedFaqItems", () => {
  it("excludes pendingOwner items", () => {
    const items = getResolvedFaqItems("en")
    const ids = items.map((item) => item.id)
    expect(ids).not.toContain("ai")
    expect(ids).not.toContain("start")
  })

  it("excludes requiresSetting items when settings absent", () => {
    const items = getResolvedFaqItems("en")
    const reply = items.find((item) => item.id === "reply")
    expect(reply).toBeUndefined()
  })

  it("includes requiresSetting items when setting provided", () => {
    const items = getResolvedFaqItems("en", { reply_time: "Within 24 hours." })
    const reply = items.find((item) => item.id === "reply")
    expect(reply).toBeDefined()
    expect(reply?.resolvedAnswer).toBe("Within 24 hours.")
  })

  it("sakolentra-what resolves {fact:students}", () => {
    const items = getResolvedFaqItems("en")
    const item = items.find((i) => i.id === "sakolentra-what")
    expect(item).toBeDefined()
    expect(item?.resolvedAnswer).toContain(facts.students.value)
    expect(item?.resolvedAnswer).not.toContain("{fact:students}")
  })

  it("sakolentra-what resolves {fact:students} in ID locale", () => {
    const items = getResolvedFaqItems("id")
    const item = items.find((i) => i.id === "sakolentra-what")
    expect(item).toBeDefined()
    expect(item?.resolvedAnswer).toContain(facts.students.value)
  })
})

describe("resolveFaqTokens negative test", () => {
  it("returns null when fact is unverified", () => {
    const result = resolveFaqTokens("Value is {fact:endpoints}", { factsMap: facts })
    expect(result).toBeNull()
  })

  it("returns null when setting is missing", () => {
    const result = resolveFaqTokens("{setting:missing_key}", { factsMap: facts, settings: {} })
    expect(result).toBeNull()
  })

  it("a forbidden buzzword in a test string is detected by the regex", () => {
    const testText = "This system is seamless and robust"
    const detected = FORBIDDEN_EN.filter((word) => {
      const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
      return new RegExp(`\\b${escaped}\\b`, "i").test(testText)
    })
    expect(detected.length).toBeGreaterThan(0)
    expect(detected).toContain("seamless")
  })
})
