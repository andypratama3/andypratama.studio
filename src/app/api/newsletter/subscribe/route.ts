import { NextResponse } from "next/server"
import { z } from "zod"
import { confirmationEmail, hasMailTransport, sendMail } from "@/lib/mail"
import { createNewsletterConfirmation } from "@/lib/newsletter-confirmation"
import { isAllowedBrowserOrigin } from "@/lib/request-security"
import { rateLimit } from "@/lib/rate-limit"
const bodySchema = z.object({
  email: z.string().email().max(254),
  website: z.string().max(0).optional(), // honeypot — must be empty
  startedAt: z.coerce.number().optional(),
})

const newsletterEnabled = process.env.NEWSLETTER_ENABLED === "1"

export async function POST(request: Request) {
  if (!isAllowedBrowserOrigin(request)) {
    return NextResponse.json({ error: "Invalid origin" }, { status: 403 })
  }
  if (!newsletterEnabled) {
    return NextResponse.json(
      { error: "Newsletter is not available." },
      { status: 503 }
    )
  }
  if (process.env.NODE_ENV === "production" && !hasMailTransport()) {
    return NextResponse.json(
      { error: "Newsletter is temporarily unavailable." },
      { status: 503 }
    )
  }

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown"

  const limited = rateLimit(`newsletter:${ip}`, 5, 60_000)
  if (!limited.ok) {
    return NextResponse.json(
      { error: "Too many requests" },
      {
        status: 429,
        headers: { "Retry-After": String(limited.retryAfterSec) },
      }
    )
  }

  const contentType = request.headers.get("content-type") ?? ""
  let raw: Record<string, unknown> = {}

  try {
    if (contentType.includes("application/json")) {
      raw = (await request.json()) as Record<string, unknown>
    } else {
      const form = await request.formData()
      raw = {
        email: form.get("email"),
        website: form.get("website") ?? "",
        startedAt: form.get("startedAt"),
      }
    }
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
  }

  // Honeypot filled → pretend success
  if (typeof raw.website === "string" && raw.website.length > 0) {
    return NextResponse.json({ ok: true })
  }

  // Minimum fill time 1.2s
  if (typeof raw.startedAt === "number" || typeof raw.startedAt === "string") {
    const started = Number(raw.startedAt)
    if (Number.isFinite(started) && Date.now() - started < 1200) {
      return NextResponse.json({ ok: true })
    }
  }

  const parsed = bodySchema.safeParse({
    ...raw,
    website: "",
  })
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 })
  }

  const token = await createNewsletterConfirmation(parsed.data.email)
  const confirmUrl = `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/api/newsletter/confirm?token=${encodeURIComponent(token)}`

  await sendMail(confirmationEmail(parsed.data.email, confirmUrl))

  return NextResponse.json({ ok: true, pending: true })
}
