import "server-only"
import { sql } from "drizzle-orm"

import { db } from "@/db"

/**
 * Cheap connectivity probe for the dashboard. Never throws and never exposes
 * driver details; the UI only needs "ok" or "down".
 */
export async function isDatabaseUp(timeoutMs = 800): Promise<boolean> {
  try {
    await Promise.race([
      db.execute(sql`select 1`),
      new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error("db probe timeout")), timeoutMs)
      }),
    ])
    return true
  } catch {
    return false
  }
}
