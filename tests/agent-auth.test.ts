import { describe, expect, it, vi } from "vitest"

vi.mock("server-only", () => ({}))

const state: { rows: unknown[] } = { rows: [] }

vi.mock("@/db", () => ({
  db: {
    select: () => ({
      from: () => ({
        where: () => ({
          limit: async () => state.rows,
        }),
      }),
    }),
  },
}))

import {
  hashAgentKey,
  isAgentKeyFormat,
  readBearerToken,
} from "@/lib/agent-key"

function request(authorization?: string): Request {
  return new Request("http://localhost/api/agent/tasks", {
    headers: authorization ? { authorization } : undefined,
  })
}

const token = `ap_${"a".repeat(43)}`

describe("agent key helpers", () => {
  it("hashes deterministically to 64 hex chars", () => {
    expect(hashAgentKey(token)).toBe(hashAgentKey(token))
    expect(hashAgentKey(token)).toMatch(/^[a-f0-9]{64}$/)
    expect(hashAgentKey(token)).not.toBe(hashAgentKey(`${token}b`))
  })

  it("accepts only ap_ keys with 43 url-safe chars", () => {
    expect(isAgentKeyFormat(token)).toBe(true)
    expect(isAgentKeyFormat("ap_short")).toBe(false)
    expect(isAgentKeyFormat(`ap_${"a".repeat(44)}`)).toBe(false)
    expect(isAgentKeyFormat(`xx_${"a".repeat(43)}`)).toBe(false)
  })

  it("parses bearer headers case-insensitively", () => {
    expect(readBearerToken(`Bearer ${token}`)).toBe(token)
    expect(readBearerToken(`bearer ${token}`)).toBe(token)
    expect(readBearerToken("Basic abc")).toBeNull()
    expect(readBearerToken(null)).toBeNull()
  })
})

describe("authenticateAgent", () => {
  it("rejects missing and malformed keys", async () => {
    const { authenticateAgent } = await import("@/lib/agent-auth")
    expect(await authenticateAgent(request())).toBeNull()
    expect(
      await authenticateAgent(request("Bearer not-an-agent-key"))
    ).toBeNull()
  })

  it("rejects unknown keys", async () => {
    state.rows = []
    const { authenticateAgent } = await import("@/lib/agent-auth")
    expect(await authenticateAgent(request(`Bearer ${token}`))).toBeNull()
  })

  it("returns the matching active agent and its write scopes", async () => {
    state.rows = [
      {
        id: "agent-1",
        slug: "engineering-lead",
        displayName: "Engineering Lead",
        canWrite: ["tasks", "projects"],
        apiKeyHash: hashAgentKey(token),
      },
    ]
    const { agentCanWrite, authenticateAgent } = await import(
      "@/lib/agent-auth"
    )
    const agent = await authenticateAgent(request(`Bearer ${token}`))
    expect(agent).toMatchObject({ id: "agent-1", slug: "engineering-lead" })
    expect(agentCanWrite(agent!, "tasks")).toBe(true)
    expect(agentCanWrite(agent!, "sales")).toBe(false)
  })
})
