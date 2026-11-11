export type WiringStatus = "ok" | "missing" | "partial" | "skipped"

export type WiringRow = {
  id: string
  label: string
  status: WiringStatus
  detail: string
}

/**
 * Server-safe inventory of plugin wiring (Lampiran D.5).
 */
export function getWiringInventory(): WiringRow[] {
  return [
    {
      id: "next-themes",
      label: "next-themes",
      status: "ok",
      detail: "ThemeProvider in locale layout (class on html)",
    },
    {
      id: "next-intl",
      label: "next-intl",
      status: "ok",
      detail: "EN default + /id; NextIntlClientProvider",
    },
    {
      id: "motion",
      label: "motion (LazyMotion)",
      status: "ok",
      detail: "LazyMotion domMax; hero CSS choreography; Motion reveal, scroll bridge, nav progress. Marquee stays CSS",
    },
    {
      id: "sonner",
      label: "sonner",
      status: "ok",
      detail: "AppToaster mounted in locale layout",
    },
    {
      id: "forms",
      label: "react-hook-form ready / fetch forms",
      status: "partial",
      detail: "Newsletter + contact use fetch + zod server; RHF available",
    },
    {
      id: "mail",
      label: "nodemailer / file transport",
      status: "ok",
      detail: "src/lib/mail.ts → tmp/outbox.json by default",
    },
    {
      id: "ratelimit",
      label: "rate-limit",
      status: "ok",
      detail: "In-memory limiter on /api/contact and newsletter",
    },
    {
      id: "lenis",
      label: "lenis",
      status: "skipped",
      detail: "Deferred (Owner A.7) after motion budget check",
    },
    {
      id: "gsap",
      label: "gsap + SplitText",
      status: "skipped",
      detail: "Rejected for size — CSS marquee + Reveal",
    },
    {
      id: "unicorn",
      label: "unicornstudio-react",
      status: "partial",
      detail: "HeroScene slot + static fallback; SDK not loaded",
    },
    {
      id: "view-transition",
      label: "ViewTransition",
      status: "ok",
      detail: "PageTransition on Home + PublicPageShell; reduced-motion off",
    },
    {
      id: "events",
      label: "events.track()",
      status: "ok",
      detail: "Allow-list + no-op without analytics bridge",
    },
    {
      id: "playwright",
      label: "@playwright/test",
      status: "ok",
      detail: "tests/wiring + axe; pnpm test:e2e",
    },
    {
      id: "drizzle",
      label: "drizzle-orm",
      status: "partial",
      detail: "Schema + migration + dashboard queries wired; needs DATABASE_URL/MySQL at runtime",
    },
    {
      id: "better-auth",
      label: "better-auth",
      status: "partial",
      detail: "Owner-only auth wired in dashboard layout/actions; needs BETTER_AUTH_SECRET + OWNER_EMAIL",
    },
  ]
}

declare global {
  interface Window {
    __wiring?: Record<string, string | boolean | null>
  }
}
