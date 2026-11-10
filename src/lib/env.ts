import { z } from "zod"

// ---------------------------------------------------------------------------
// Phase 1–2 public vars — safe to parse at build time and in client bundles.
// NEXT_PUBLIC_* vars + non-secret config.
// ---------------------------------------------------------------------------
const publicSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  NEXT_PUBLIC_SITE_URL: z.string().url().default("http://localhost:3000"),
  NEXT_PUBLIC_UMAMI_WEBSITE_ID: z.string().default(""),
  NEXT_PUBLIC_UMAMI_SRC: z.string().default(""),
  NEXT_PUBLIC_UNICORN_PROJECT_ID: z.string().default(""),
  NEWSLETTER_ENABLED: z.string().default("0"),
})

export const publicEnv = publicSchema.parse({
  NODE_ENV: process.env.NODE_ENV,
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  NEXT_PUBLIC_UMAMI_WEBSITE_ID: process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID,
  NEXT_PUBLIC_UMAMI_SRC: process.env.NEXT_PUBLIC_UMAMI_SRC,
  NEXT_PUBLIC_UNICORN_PROJECT_ID: process.env.NEXT_PUBLIC_UNICORN_PROJECT_ID,
  NEWSLETTER_ENABLED: process.env.NEWSLETTER_ENABLED,
})

export type PublicEnv = z.infer<typeof publicSchema>

// ---------------------------------------------------------------------------
// Phase 3 server-only vars — lazy getter; NOT parsed at module load time so
// a production build succeeds with only Phase 1–2 vars present.
// Import this inside route handlers / server actions only.
// ---------------------------------------------------------------------------
const serverSchema = z.object({
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  BETTER_AUTH_SECRET: z.string().min(32, "BETTER_AUTH_SECRET must be ≥ 32 chars"),
  BETTER_AUTH_URL: z.string().url("BETTER_AUTH_URL must be a valid URL"),
  OWNER_GITHUB_ID: z.string().min(1, "OWNER_GITHUB_ID is required"),
  GITHUB_CLIENT_ID: z.string().min(1, "GITHUB_CLIENT_ID is required"),
  GITHUB_CLIENT_SECRET: z.string().min(1, "GITHUB_CLIENT_SECRET is required"),
  UNICORN_PROJECT_ID: z.string().default(""),
  // Contact & mail
  CONTACT_EMAIL: z.string().email().default("contact@andypratama.studio"),
  LEAD_NOTIFY_TO: z.string().email().default("owner@localhost"),
  SMTP_HOST: z.string().default(""),
  SMTP_PORT: z.string().default("587"),
  SMTP_SECURE: z.string().default("false"),
  SMTP_USER: z.string().default(""),
  SMTP_PASS: z.string().default(""),
  SMTP_FROM: z.string().default("noreply@andypratama.studio"),
  MAIL_TRANSPORT: z.string().default("file"),
})

let _serverEnv: z.infer<typeof serverSchema> | null = null

export function getServerEnv(): z.infer<typeof serverSchema> {
  if (_serverEnv) return _serverEnv
  _serverEnv = serverSchema.parse({
    DATABASE_URL: process.env.DATABASE_URL ?? "",
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET ?? "",
    BETTER_AUTH_URL: process.env.BETTER_AUTH_URL ?? "http://localhost:3000",
    OWNER_GITHUB_ID: process.env.OWNER_GITHUB_ID ?? "",
    GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID ?? "",
    GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET ?? "",
    UNICORN_PROJECT_ID: process.env.UNICORN_PROJECT_ID,
    CONTACT_EMAIL: process.env.CONTACT_EMAIL,
    LEAD_NOTIFY_TO: process.env.LEAD_NOTIFY_TO,
    SMTP_HOST: process.env.SMTP_HOST,
    SMTP_PORT: process.env.SMTP_PORT,
    SMTP_SECURE: process.env.SMTP_SECURE,
    SMTP_USER: process.env.SMTP_USER,
    SMTP_PASS: process.env.SMTP_PASS,
    SMTP_FROM: process.env.SMTP_FROM,
    MAIL_TRANSPORT: process.env.MAIL_TRANSPORT,
  })
  return _serverEnv
}

export type ServerEnv = z.infer<typeof serverSchema>

// ---------------------------------------------------------------------------
// Legacy alias — env.test.ts and any other existing import can keep using
// `env` from this file. Exposes publicEnv + a safe subset of serverEnv keys.
// ---------------------------------------------------------------------------
export const env = publicEnv
