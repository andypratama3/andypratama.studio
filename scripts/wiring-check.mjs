#!/usr/bin/env node
import { createRequire } from "node:module"
import { readFileSync } from "node:fs"
import { fileURLToPath } from "node:url"
import { dirname, join } from "node:path"

const require = createRequire(import.meta.url)
const root = join(dirname(fileURLToPath(import.meta.url)), "..")
const wiringSrc = readFileSync(join(root, "src/lib/wiring.ts"), "utf8")

const statusHits = {
  ok: (wiringSrc.match(/status: "ok"/g) || []).length,
  missing: (wiringSrc.match(/status: "missing"/g) || []).length,
  partial: (wiringSrc.match(/status: "partial"/g) || []).length,
  skipped: (wiringSrc.match(/status: "skipped"/g) || []).length,
}

let playwrightOk = false
try {
  require.resolve("@playwright/test")
  playwrightOk = true
} catch {
  playwrightOk = false
}

console.log("\n=== wiring:check ===\n")
console.log(
  `ok=${statusHits.ok} partial=${statusHits.partial} missing=${statusHits.missing} skipped=${statusHits.skipped}`
)
console.log(`playwright installed: ${playwrightOk}`)

const hardMissing = statusHits.missing
// Public-first budget: drizzle + better-auth may remain missing (Owner gate)
if (!playwrightOk || hardMissing > 2) {
  console.error("\nwiring:check FAIL — too many missing plugins or no Playwright.")
  process.exit(1)
}

console.log("\nStatic inventory within public-first budget. Run: pnpm test:e2e")
process.exit(0)
