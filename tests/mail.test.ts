import { mkdtemp, readFile, rm } from "node:fs/promises"
import { tmpdir } from "node:os"
import path from "node:path"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

vi.mock("server-only", () => ({}))

describe("sendMail file transport", () => {
  let cwd: string
  let prevCwd: string

  beforeEach(async () => {
    prevCwd = process.cwd()
    cwd = await mkdtemp(path.join(tmpdir(), "studio-mail-"))
    process.chdir(cwd)
    vi.resetModules()
    delete process.env.SMTP_HOST
    process.env.MAIL_TRANSPORT = "file"
  })

  afterEach(async () => {
    process.chdir(prevCwd)
    await rm(cwd, { recursive: true, force: true })
  })

  it("writes outbox.json and outbox.jsonl", async () => {
    const { sendMail } = await import("@/lib/mail")
    const result = await sendMail({
      to: "test@example.com",
      subject: "Hello",
      text: "Body",
    })
    expect(result.id).toMatch(/^mail_/)
    const json = await readFile(path.join(cwd, "tmp", "outbox.json"), "utf8")
    expect(json).toContain("test@example.com")
    const lines = await readFile(path.join(cwd, "tmp", "outbox.jsonl"), "utf8")
    expect(lines.trim().split("\n")).toHaveLength(1)
  })
})
