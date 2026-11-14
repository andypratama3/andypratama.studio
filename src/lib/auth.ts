import { betterAuth } from "better-auth"
import { drizzleAdapter } from "@better-auth/drizzle-adapter"
import { db } from "@/db"
import * as schema from "@/db/schema"
import { headers } from "next/headers"

const ownerEmail = (process.env.OWNER_EMAIL ?? "").trim().toLowerCase()
const authSecret = process.env.BETTER_AUTH_SECRET

/**
 * Production credentials are validated when auth is actually used, not on
 * import: `next build` imports route modules to collect page data and must
 * not fail on an environment without secrets.
 */
export function isAuthConfigured() {
  if (process.env.NODE_ENV !== "production") return true
  return Boolean(ownerEmail && authSecret)
}

function assertAuthConfigured() {
  if (!isAuthConfigured()) {
    throw new Error(
      "BETTER_AUTH_SECRET and OWNER_EMAIL must be set in production."
    )
  }
}

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "mysql",
    schema: {
      user: schema.user,
      session: schema.session,
      account: schema.account,
      verification: schema.verification,
    },
  }),
  secret: authSecret,
  baseURL: process.env.BETTER_AUTH_URL ?? "http://localhost:3000",
  trustedOrigins: [
    process.env.BETTER_AUTH_URL ?? "http://localhost:3000",
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
    ...(process.env.NODE_ENV !== "production"
      ? ["http://localhost:3000", "http://127.0.0.1:3000"]
      : []),
  ].filter((value, index, all) => all.indexOf(value) === index),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
  socialProviders: {
    ...(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET
      ? {
          github: {
            clientId: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
          },
        }
      : {}),
  },
  databaseHooks: {
    user: {
      create: {
        before: async (userData) => {
          const email = userData.email?.toLowerCase()
          if (!ownerEmail || email !== ownerEmail) {
            throw new Error(
              "Akses ditolak: Pendaftaran publik dinonaktifkan. Hanya pemilik yang diizinkan."
            )
          }
          return {
            data: {
              ...userData,
              role: "owner",
            },
          }
        },
      },
    },
  },
})

export type Session = typeof auth.$Infer.Session

/**
 * Server-side session verification helper for Server Components & Actions.
 * Returns null if not authenticated or not the owner.
 */
export async function getOwnerSession() {
  // Fail closed: without production credentials there is no owner session.
  if (!isAuthConfigured()) return null
  const reqHeaders = await headers()
  const session = await auth.api.getSession({
    headers: reqHeaders,
  })

  if (!session || !session.user) {
    return null
  }

  const userEmail = session.user.email?.toLowerCase()
  if (userEmail !== ownerEmail) {
    return null
  }

  return session
}

/**
 * Server-side guard for Server Actions.
 * Throws error if caller is not authenticated owner.
 */
export async function requireOwner() {
  assertAuthConfigured()
  const session = await getOwnerSession()
  if (!session) {
    throw new Error("Tidak diizinkan: Hanya pemilik yang dapat melakukan tindakan ini.")
  }
  return session
}
