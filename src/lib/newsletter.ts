import "server-only"
import { createHash, randomBytes } from "node:crypto"
import { eq } from "drizzle-orm"

import { db } from "@/db"
import { subscribers } from "@/db/schema"

export type NewsletterLocale = "en" | "id"

export function hashNewsletterToken(token: string): string {
  return createHash("sha256").update(token).digest("hex")
}

function newToken(): string {
  return randomBytes(32).toString("base64url")
}

/**
 * Creates (or refreshes) a pending subscription and returns the raw tokens.
 * Only token hashes are stored.
 */
export async function createNewsletterSubscription(input: {
  email: string
  locale?: NewsletterLocale
  sourceUtm?: string | null
}): Promise<{ confirmToken: string; unsubscribeToken: string }> {
  const email = input.email.trim().toLowerCase()
  const confirmToken = newToken()
  const unsubscribeToken = newToken()

  await db
    .insert(subscribers)
    .values({
      email,
      locale: input.locale ?? "en",
      status: "pending",
      sourceUtm: input.sourceUtm ?? null,
      confirmTokenHash: hashNewsletterToken(confirmToken),
      unsubscribeTokenHash: hashNewsletterToken(unsubscribeToken),
      confirmedAt: null,
    })
    .onDuplicateKeyUpdate({
      set: {
        locale: input.locale ?? "en",
        status: "pending",
        sourceUtm: input.sourceUtm ?? null,
        confirmTokenHash: hashNewsletterToken(confirmToken),
        unsubscribeTokenHash: hashNewsletterToken(unsubscribeToken),
        confirmedAt: null,
      },
    })

  return { confirmToken, unsubscribeToken }
}

/** Confirms a pending subscription. Returns the email, or null when invalid. */
export async function confirmNewsletterSubscription(
  token: string
): Promise<string | null> {
  const hash = hashNewsletterToken(token)
  const rows = await db
    .select({ id: subscribers.id, email: subscribers.email })
    .from(subscribers)
    .where(eq(subscribers.confirmTokenHash, hash))
    .limit(1)

  const row = rows[0]
  if (!row) return null

  await db
    .update(subscribers)
    .set({
      status: "confirmed",
      confirmedAt: new Date(),
      confirmTokenHash: null,
    })
    .where(eq(subscribers.id, row.id))

  return row.email
}

/** Unsubscribes by token. Returns the email, or null when invalid. */
export async function unsubscribeNewsletter(
  token: string
): Promise<string | null> {
  const hash = hashNewsletterToken(token)
  const rows = await db
    .select({ id: subscribers.id, email: subscribers.email })
    .from(subscribers)
    .where(eq(subscribers.unsubscribeTokenHash, hash))
    .limit(1)

  const row = rows[0]
  if (!row) return null

  await db
    .update(subscribers)
    .set({ status: "unsubscribed", confirmTokenHash: null })
    .where(eq(subscribers.id, row.id))

  return row.email
}
