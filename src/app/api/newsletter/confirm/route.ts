import { NextResponse } from "next/server"
import { z } from "zod"
import { confirmNewsletterSubscription } from "@/lib/newsletter"

const querySchema = z.object({
  token: z.string().min(1).max(256),
})

const newsletterEnabled = process.env.NEWSLETTER_ENABLED === "1"

/** Double opt-in confirmation. Token is single-use. */
export async function GET(request: Request) {
  const url = new URL(request.url)
  const base = new URL("/newsletter", request.url)

  if (!newsletterEnabled) {
    return NextResponse.redirect(new URL("/newsletter?state=invalid", base))
  }

  const parsed = querySchema.safeParse({ token: url.searchParams.get("token") })
  if (!parsed.success) {
    return NextResponse.redirect(new URL("/newsletter?state=invalid", base))
  }

  const result = await confirmNewsletterSubscription(parsed.data.token)
  if (!result) {
    return NextResponse.redirect(new URL("/newsletter?state=invalid", base))
  }

  const target = new URL(
    result.locale === "id" ? "/id/newsletter" : "/newsletter",
    base
  )
  target.searchParams.set("state", "confirmed")
  return NextResponse.redirect(target)
}
