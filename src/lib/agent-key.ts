import { createHash, timingSafeEqual } from "node:crypto"

export function hashAgentKey(token: string): string {
  return createHash("sha256").update(token).digest("hex")
}

export function sameHash(a: string, b: string): boolean {
  const left = Buffer.from(a)
  const right = Buffer.from(b)
  if (left.length !== right.length) return false
  return timingSafeEqual(left, right)
}

/** Returns the bearer token from an Authorization header, or null. */
export function readBearerToken(header: string | null): string | null {
  if (!header) return null
  const match = /^Bearer\s+(\S+)$/i.exec(header.trim())
  return match ? match[1] : null
}

/** Agent keys are `ap_` + 43 base64url characters. */
export function isAgentKeyFormat(token: string): boolean {
  return /^ap_[A-Za-z0-9_-]{43}$/.test(token)
}
