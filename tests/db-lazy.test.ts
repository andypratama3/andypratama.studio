import { describe, expect, it } from "vitest"

/**
 * `next build` imports route modules to collect page data. The database client
 * must therefore not throw on import when DATABASE_URL is missing; the failure
 * has to surface only on the code path that actually queries MySQL.
 */
describe("database client", () => {
  it("imports without DATABASE_URL and only fails when used", async () => {
    const env = process.env as Record<string, string | undefined>
    const previousUrl = env.DATABASE_URL
    const previousNodeEnv = env.NODE_ENV
    delete env.DATABASE_URL
    env.NODE_ENV = "production"

    try {
      const dbModule = await import("@/db")
      expect(dbModule.db).toBeDefined()
      expect(() => dbModule.db.select).toThrow(/DATABASE_URL/)
    } finally {
      if (previousUrl === undefined) delete env.DATABASE_URL
      else env.DATABASE_URL = previousUrl
      if (previousNodeEnv === undefined) delete env.NODE_ENV
      else env.NODE_ENV = previousNodeEnv
    }
  })
})
