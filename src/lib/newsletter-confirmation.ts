import { createHash, randomBytes } from "node:crypto"
import { appendFile, mkdir, readFile, writeFile } from "node:fs/promises"
import path from "node:path"

const TOKEN_TTL_MS = 24 * 60 * 60 * 1000

type PendingConfirmation = {
  email: string
  tokenHash: string
  expiresAt: number
  usedAt?: string
}

function filePath() {
  return path.join(process.cwd(), "tmp", "newsletter-confirmations.jsonl")
}

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex")
}

export async function createNewsletterConfirmation(email: string) {
  const token = randomBytes(32).toString("base64url")
  const record: PendingConfirmation = {
    email,
    tokenHash: hashToken(token),
    expiresAt: Date.now() + TOKEN_TTL_MS,
  }
  const file = filePath()
  await mkdir(path.dirname(file), { recursive: true })
  await appendFile(file, `${JSON.stringify(record)}\n`, "utf8")
  return token
}

export async function consumeNewsletterConfirmation(token: string) {
  const file = filePath()
  let lines: string[]
  try {
    lines = (await readFile(file, "utf8")).trim().split("\n").filter(Boolean)
  } catch {
    return null
  }

  const targetHash = hashToken(token)
  let matchedEmail: string | null = null
  const updated = lines.map((line) => {
    const record = JSON.parse(line) as PendingConfirmation
    if (
      matchedEmail === null &&
      record.tokenHash === targetHash &&
      !record.usedAt &&
      record.expiresAt > Date.now()
    ) {
      matchedEmail = record.email
      return JSON.stringify({ ...record, usedAt: new Date().toISOString() })
    }
    return line
  })

  if (matchedEmail === null) return null
  await writeFile(file, `${updated.join("\n")}\n`, "utf8")
  return matchedEmail
}
