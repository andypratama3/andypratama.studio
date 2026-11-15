import { describe, expect, it } from "vitest"

const env = process.env as Record<string, string | undefined>
const previousUrl = env.DATABASE_URL
const previousNodeEnv = env.NODE_ENV
delete env.DATABASE_URL
env.NODE_ENV = "production"

const dbModule = await import("@/db")

if (previousUrl === undefined) delete env.DATABASE_URL
else env.DATABASE_URL = previousUrl
if (previousNodeEnv === undefined) delete env.NODE_ENV
else env.NODE_ENV = previousNodeEnv

/**
 * `next build` imports route modules to collect page data. The database client
 * must therefore not throw on import when DATABASE_URL is missing; the failure
 * has to surface only on the code path that actually queries MySQL.
 */
describe("database client", () => {
  it("imports without DATABASE_URL and only fails when used", () => {
    expect(dbModule.db).toBeDefined()
    expect(() => dbModule.db.select).toThrow(/DATABASE_URL/)
  })
})
