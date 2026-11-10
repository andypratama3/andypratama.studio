import { drizzle } from "drizzle-orm/mysql2"
import mysql from "mysql2/promise"
import * as schema from "./schema"

const connectionString =
  process.env.DATABASE_URL ??
  "mysql://andy:studio_secret@127.0.0.1:3306/andypratama_studio"

// Global pool cache for serverless / Next.js hot reload
declare global {
  var _mysqlPool: mysql.Pool | undefined
}

export const pool =
  global._mysqlPool ??
  mysql.createPool({
    uri: connectionString,
    waitForConnections: true,
    connectionLimit: 10,
    maxIdle: 10,
    idleTimeout: 60000,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
  })

if (process.env.NODE_ENV !== "production") {
  global._mysqlPool = pool
}

export const db = drizzle(pool, { schema, mode: "default" })

export type Database = typeof db
export { schema }
