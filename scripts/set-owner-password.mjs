#!/usr/bin/env node
/**
 * Resets the owner password without touching any other account data.
 *
 * Usage:
 *   OWNER_NEW_PASSWORD='...' node --env-file-if-exists=.env.local scripts/set-owner-password.mjs
 *
 * The password is never printed. It must be at least 12 characters.
 */
import mysql from "mysql2/promise"
import { hashPassword } from "better-auth/crypto"

const password = process.env.OWNER_NEW_PASSWORD ?? ""
if (password.length < 12) {
  console.error("OWNER_NEW_PASSWORD must be at least 12 characters.")
  process.exit(1)
}

const ownerEmail = (process.env.OWNER_EMAIL ?? "").trim().toLowerCase()
if (!ownerEmail) {
  console.error("OWNER_EMAIL is required.")
  process.exit(1)
}

const url =
  process.env.DATABASE_URL ??
  "mysql://andy:studio_secret@127.0.0.1:3306/andypratama_studio"

const connection = await mysql.createConnection(url)
try {
  const [users] = await connection.query(
    "select id from user where lower(email) = ? limit 1",
    [ownerEmail]
  )
  if (users.length === 0) {
    console.error("Owner account not found. Run the bootstrap route first.")
    process.exit(1)
  }

  const hash = await hashPassword(password)
  const [result] = await connection.query(
    "update account set password = ?, updated_at = now() where user_id = ? and provider_id = 'credential'",
    [hash, users[0].id]
  )

  if (result.affectedRows === 0) {
    console.error("Credential account not found for the owner.")
    process.exit(1)
  }

  console.log("owner password updated")
} finally {
  await connection.end()
}
