import "server-only"
import { and, eq } from "drizzle-orm"

import { db } from "@/db"
import { agents } from "@/db/schema"
import { hashAgentKey, isAgentKeyFormat, sameHash } from "@/lib/agent-key"

export type AgentIdentity = {
  id: string
  slug: string
  displayName: string
  canWrite: string[]
}

/**
 * Resolves an active agent from a bearer token.
 * Keys are stored as SHA-256 hashes; raw keys never touch the database.
 * Fails closed when no agent has a key configured.
 */
export async function authenticateAgent(
  request: Request
): Promise<AgentIdentity | null> {
  const header = request.headers.get("authorization")
  const match = header ? /^Bearer\s+(\S+)$/i.exec(header.trim()) : null
  const token = match ? match[1] : null
  if (!token || !isAgentKeyFormat(token)) return null

  const hash = hashAgentKey(token)
  const rows = await db
    .select({
      id: agents.id,
      slug: agents.slug,
      displayName: agents.displayName,
      canWrite: agents.canWrite,
      apiKeyHash: agents.apiKeyHash,
    })
    .from(agents)
    .where(and(eq(agents.apiKeyHash, hash), eq(agents.active, true)))
    .limit(1)

  const row = rows[0]
  if (!row?.apiKeyHash) return null
  if (!sameHash(row.apiKeyHash, hash)) return null

  return {
    id: row.id,
    slug: row.slug,
    displayName: row.displayName,
    canWrite: Array.isArray(row.canWrite) ? row.canWrite : [],
  }
}

export function agentCanWrite(agent: AgentIdentity, scope: string): boolean {
  return agent.canWrite.includes(scope)
}
