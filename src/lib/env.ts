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

// Legacy alias — `env` exposes the public vars for existing imports.
export const env = publicEnv
