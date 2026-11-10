import { NextResponse } from "next/server"
import { z } from "zod"
import { mkdir, appendFile } from "node:fs/promises"
import path from "node:path"
import { consumeNewsletterConfirmation } from "@/lib/newsletter-confirmation"

const querySchema = z.object({
  token: z.string().min(1).max(256),
})

const newsletterEnabled = process.env.NEWSLETTER_ENABLED === "1"

/** Double opt-in confirm — logs confirmation; no real CRM yet. */
export async function GET(request: Request) {
  if (!newsletterEnabled) {
    return NextResponse.json(
      { error: "Newsletter is not available." },
      { status: 503 }
    )
  }

  const url = new URL(request.url)
  const parsed = querySchema.safeParse({ token: url.searchParams.get("token") })
  if (!parsed.success) {
    return NextResponse.redirect(new URL("/?newsletter=invalid", request.url))
  }
  const email = await consumeNewsletterConfirmation(parsed.data.token)
  if (!email) {
    return NextResponse.redirect(new URL("/?newsletter=invalid", request.url))
  }

  const dir = path.join(process.cwd(), "tmp")
  await mkdir(dir, { recursive: true })
  await appendFile(
    path.join(dir, "subscribers.jsonl"),
    `${JSON.stringify({ email, status: "confirmed", at: new Date().toISOString() })}\n`,
    "utf8"
  )

  return NextResponse.redirect(new URL("/?newsletter=confirmed", request.url))
}
