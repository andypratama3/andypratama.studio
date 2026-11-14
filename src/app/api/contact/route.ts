import { NextResponse } from "next/server"
import { db } from "@/db"
import { leads } from "@/db/schema"
import { sendMail, hasMailTransport } from "@/lib/mail"
import { isAllowedBrowserOrigin } from "@/lib/request-security"
import { rateLimit } from "@/lib/rate-limit"
import { buildLeadNotes, contactTopicToSegment } from "@/lib/contact-lead"
import { contactServerSchema } from "@/lib/schemas/contact"

export async function POST(request: Request) {
  if (!isAllowedBrowserOrigin(request)) {
    return NextResponse.json({ error: "Invalid origin" }, { status: 403 })
  }
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown"

  const limited = rateLimit(`contact:${ip}`, 5, 60_000)
  if (!limited.ok) {
    return NextResponse.json(
      { error: "Too many requests" },
      {
        status: 429,
        headers: { "Retry-After": String(limited.retryAfterSec) },
      }
    )
  }

  // In production, require a real mail transport so notifications aren't silently lost.
  if (process.env.NODE_ENV === "production" && !hasMailTransport()) {
    return NextResponse.json(
      {
        error:
          "Contact form is temporarily unavailable. Please email contact@andypratama.studio directly.",
      },
      { status: 503 }
    )
  }

  let raw: Record<string, unknown>
  try {
    const form = await request.formData()
    raw = {
      name: form.get("name"),
      email: form.get("email"),
      topic: form.get("topic"),
      message: form.get("message"),
      website: form.get("website") ?? "",
      startedAt: form.get("startedAt"),
    }
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
  }

  if (typeof raw.website === "string" && raw.website.length > 0) {
    return NextResponse.json({ ok: true })
  }

  if (raw.startedAt != null) {
    const started = Number(raw.startedAt)
    if (Number.isFinite(started) && Date.now() - started < 1200) {
      return NextResponse.json({ ok: true })
    }
  }

  const parsed = contactServerSchema.safeParse({ ...raw, website: "" })
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid" }, { status: 400 })
  }

  let stored = true
  try {
    await db.insert(leads).values({
      name: parsed.data.name,
      email: parsed.data.email,
      platform: "email",
      segment: contactTopicToSegment(parsed.data.topic),
      stage: "baru",
      notes: buildLeadNotes(parsed.data.topic, parsed.data.message),
    })
  } catch {
    stored = false
    console.error("[contact] failed to store lead")
  }

  try {
    await sendMail({
      to: process.env.LEAD_NOTIFY_TO ?? "owner@localhost",
      subject: `${stored ? "[Lead]" : "[Lead · DB error]"} ${parsed.data.topic} — ${parsed.data.name}`,
      text: `${parsed.data.name} <${parsed.data.email}>\nTopic: ${parsed.data.topic}\n\n${parsed.data.message}`,
    })
  } catch {
    // The lead is already stored — a notification failure must not make the
    // visitor resubmit and create duplicates.
    console.error("[contact] failed to send lead notification")
  }

  if (!stored) {
    return NextResponse.json(
      {
        error:
          "Pesan belum tersimpan. Silakan coba lagi atau kirim email langsung ke contact@andypratama.studio.",
      },
      { status: 500 }
    )
  }

  return NextResponse.json({ ok: true })
}
