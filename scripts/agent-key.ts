import { randomBytes } from "node:crypto"
import { eq } from "drizzle-orm"

import { db } from "../src/db"
import { agents } from "../src/db/schema"
import { hashAgentKey } from "../src/lib/agent-key"

function usage(): never {
  console.error("Usage: pnpm agent:key <agent-slug> [--revoke]")
  process.exit(1)
}

const [slug, flag] = process.argv.slice(2)
if (!slug) usage()

const rows = await db
  .select({ id: agents.id, slug: agents.slug, active: agents.active })
  .from(agents)
  .where(eq(agents.slug, slug))
  .limit(1)

const agent = rows[0]
if (!agent) {
  console.error(`Agent '${slug}' not found.`)
  process.exit(1)
}

if (flag === "--revoke") {
  await db.update(agents).set({ apiKeyHash: null }).where(eq(agents.id, agent.id))
  console.log(`Revoked API key for ${agent.slug}.`)
  process.exit(0)
}

if (!agent.active) {
  console.error(`Agent '${slug}' is inactive; activate it before issuing a key.`)
  process.exit(1)
}

const token = `ap_${randomBytes(32).toString("base64url")}`
await db
  .update(agents)
  .set({ apiKeyHash: hashAgentKey(token) })
  .where(eq(agents.id, agent.id))

console.log(`Agent: ${agent.slug}`)
console.log("API key (shown once, store in the agent's secret store):")
console.log(token)
process.exit(0)
