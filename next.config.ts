import type { NextConfig } from "next"
import createNextIntlPlugin from "next-intl/plugin"

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts")

/** O-09 / B-26: case-study pages that do not exist yet go to /work. */
const LEGACY_TO_WORK = [
  "bappedakaltim",
  "blk-management-system",
  "database-ansor-kaltim",
  "ismi",
  "kartaspa",
  "koetai-mahkota",
  "kuepandanasli",
  "sdmuhammadiyah3",
] as const

const LEGACY_TO_SAKOLENTRA = ["productschool", "sdmuhammadiyah3new"] as const

function legacyRedirects(): { source: string; destination: string; statusCode: 301 }[] {
  const rules: { source: string; destination: string; statusCode: 301 }[] = []
  for (const slug of LEGACY_TO_WORK) {
    rules.push({ source: `/work/${slug}`, destination: "/work", statusCode: 301 })
    rules.push({
      source: `/id/work/${slug}`,
      destination: "/id/work",
      statusCode: 301,
    })
  }
  for (const slug of LEGACY_TO_SAKOLENTRA) {
    rules.push({
      source: `/work/${slug}`,
      destination: "/work/sakolentra",
      statusCode: 301,
    })
    rules.push({
      source: `/id/work/${slug}`,
      destination: "/id/work/sakolentra",
      statusCode: 301,
    })
  }
  return rules
}

/**
 * Baseline CSP. `unsafe-inline` / `unsafe-eval` stay until a nonce pipeline
 * exists (Next hydration + next-themes). Unicorn and analytics hosts are not
 * listed until those integrations ship (G-12 / D-02).
 */
const contentSecurityPolicy = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  "connect-src 'self'",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
].join("; ")

const nextConfig: NextConfig = {
  output: "standalone",
  async redirects() {
    return legacyRedirects()
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "DENY" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          { key: "Content-Security-Policy", value: contentSecurityPolicy },
        ],
      },
      {
        source: "/dashboard/:path*",
        headers: [
          { key: "Cache-Control", value: "no-store" },
          { key: "X-Robots-Tag", value: "noindex" },
        ],
      },
      {
        source: "/:locale(en|id)/dashboard/:path*",
        headers: [
          { key: "Cache-Control", value: "no-store" },
          { key: "X-Robots-Tag", value: "noindex" },
        ],
      },
      {
        source: "/sign-in",
        headers: [
          { key: "Cache-Control", value: "no-store" },
          { key: "X-Robots-Tag", value: "noindex" },
        ],
      },
      {
        source: "/:locale(en|id)/sign-in",
        headers: [
          { key: "Cache-Control", value: "no-store" },
          { key: "X-Robots-Tag", value: "noindex" },
        ],
      },
      {
        source: "/auth/:path*",
        headers: [
          { key: "Cache-Control", value: "no-store" },
          { key: "X-Robots-Tag", value: "noindex" },
        ],
      },
    ]
  },
}

export default withNextIntl(nextConfig)
