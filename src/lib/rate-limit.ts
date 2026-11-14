/**
 * In-process rate limiter (single VPS). IP held only in memory — not persisted.
 */

type Bucket = { count: number; resetAt: number }

const buckets = new Map<string, Bucket>()

/** Keeps memory bounded on a long-running single VPS. */
const MAX_BUCKETS = 10_000

function makeRoom(now: number) {
  if (buckets.size < MAX_BUCKETS) return
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key)
  }
  while (buckets.size >= MAX_BUCKETS) {
    const oldest = buckets.keys().next()
    if (oldest.done) break
    buckets.delete(oldest.value)
  }
}

export type RateLimitResult = {
  ok: boolean
  remaining: number
  retryAfterSec: number
}

export function rateLimit(
  key: string,
  limit = 8,
  windowMs = 60_000
): RateLimitResult {
  const now = Date.now()
  const current = buckets.get(key)

  if (!current || current.resetAt <= now) {
    makeRoom(now)
    buckets.set(key, { count: 1, resetAt: now + windowMs })
    return { ok: true, remaining: limit - 1, retryAfterSec: 0 }
  }

  if (current.count >= limit) {
    return {
      ok: false,
      remaining: 0,
      retryAfterSec: Math.max(1, Math.ceil((current.resetAt - now) / 1000)),
    }
  }

  current.count += 1
  buckets.set(key, current)
  return {
    ok: true,
    remaining: Math.max(0, limit - current.count),
    retryAfterSec: 0,
  }
}

/** Test helper — clears memory buckets. */
export function __resetRateLimitForTests() {
  buckets.clear()
}
