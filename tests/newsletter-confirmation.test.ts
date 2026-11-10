import { mkdtemp, rm } from "node:fs/promises"
import { tmpdir } from "node:os"
import path from "node:path"
import { afterEach, beforeEach, describe, expect, it } from "vitest"
import {
  consumeNewsletterConfirmation,
  createNewsletterConfirmation,
} from "@/lib/newsletter-confirmation"


let cwd: string
let previousCwd: string

beforeEach(async () => {
  previousCwd = process.cwd()
  cwd = await mkdtemp(path.join(tmpdir(), "studio-newsletter-"))
  process.chdir(cwd)
})

afterEach(async () => {
  process.chdir(previousCwd)
  await rm(cwd, { recursive: true, force: true })
})

describe("newsletter confirmation tokens", () => {
  it("confirms only the issued token once", async () => {
    const token = await createNewsletterConfirmation("reader@example.com")

    await expect(consumeNewsletterConfirmation("forged-token")).resolves.toBeNull()
    await expect(consumeNewsletterConfirmation(token)).resolves.toBe("reader@example.com")
    await expect(consumeNewsletterConfirmation(token)).resolves.toBeNull()
  })
})
