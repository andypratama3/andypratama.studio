import { drizzle, type MySql2Database } from "drizzle-orm/mysql2"
import mysql from "mysql2/promise"
import * as schema from "./schema"

const connectionString =
  process.env.DATABASE_URL ??
  (process.env.NODE_ENV === "production"
    ? null
    : "mysql://root@127.0.0.1:3306/andypratama_studio")

// Global pool cache for serverless / Next.js hot reload
declare global {
  var _mysqlPool: mysql.Pool | undefined
}

function createPool(): mysql.Pool {
  if (!connectionString) {
    throw new Error(
      "DATABASE_URL is not set. Copy .env.example to .env and point it at your MySQL instance."
    )
  }
  return mysql.createPool({
    uri: connectionString,
    waitForConnections: true,
    connectionLimit: 10,
    maxIdle: 10,
    idleTimeout: 60000,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
  })
}

/**
 * Pool is created on first use, not on import. `next build` imports route
 * modules to collect page data; failing there would block builds that do not
 * need a database (CI, preview, static export).
 */
function getPool(): mysql.Pool {
  if (!global._mysqlPool) {
    global._mysqlPool = createPool()
  }
  return global._mysqlPool
}

let instance: MySql2Database<typeof schema> | null = null

function getDb(): MySql2Database<typeof schema> {
  if (!instance) {
    instance = drizzle(getPool(), { schema, mode: "default" })
  }
  return instance
}

/**
 * Lazy proxy: every property access resolves the real drizzle instance on
 * first use, so a missing DATABASE_URL only fails the code path that actually
 * talks to MySQL.
 */
export const db = new Proxy({} as MySql2Database<typeof schema>, {
  get(_target, property) {
    const value = Reflect.get(getDb(), property)
    return typeof value === "function" ? value.bind(getDb()) : value
  },
})

export const pool = new Proxy({} as mysql.Pool, {
  get(_target, property) {
    const value = Reflect.get(getPool(), property)
    return typeof value === "function" ? value.bind(getPool()) : value
  },
})

export type Database = MySql2Database<typeof schema>
export { schema }
