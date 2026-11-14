import { NextResponse, type NextRequest } from "next/server"
import { notFound } from "next/navigation"
import { and, eq } from "drizzle-orm"

import { getOutboundLink } from "@/content/outbound-links"
import { db } from "@/db"
import { linkClicks, links } from "@/db/schema"
import { isSafeDestination } from "@/lib/link-validation"
import { rateLimit } from "@/lib/rate-limit"

export const dynamic = "force-dynamic"

function hostOf(value: string | null): string | null {
  if (!value) return null
  try {
    return new URL(value).host.slice(0, 120)
  } catch {
    return null
  }
}

/**
 * 302 hop for outbound CTAs.
 * Destination comes from the `links` table, falling back to content/outbound-links.
 * Only slug, time and referrer host are recorded — never IP or user-agent.
 */
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  const { slug } = await context.params

  const limited = rateLimit(`go:${slug}`, 120, 60_000)
  if (!limited.ok) {
    return new NextResponse("Too many requests", {
      status: 429,
      headers: { "Retry-After": String(limited.retryAfterSec) },
    })
  }

  let destination: string | null = null
  let linkId: string | null = null
  let fallbackUtm: string | undefined

  try {
    const rows = await db
      .select({ id: links.id, destination: links.destination })
      .from(links)
      .where(and(eq(links.slug, slug), eq(links.active, true)))
      .limit(1)
    if (rows[0]) {
      linkId = rows[0].id
      destination = rows[0].destination
    }
  } catch (error) {
    console.error("[go] link lookup failed, using static fallback:", error)
  }

  if (!destination) {
    const link = getOutboundLink(slug)
    // Fail closed: static destinations stay unreachable until the Owner
    // verifies them, matching the CTA gating on public pages.
    if (!link || !link.verified) {
      notFound()
    }
    destination = link.href
    fallbackUtm = link.utmSource
  }

  if (!isSafeDestination(destination)) {
    notFound()
  }

  let target: URL
  try {
    target = new URL(destination)
  } catch {
    notFound()
  }

  if (fallbackUtm && !target.searchParams.has("utm_source")) {
    target.searchParams.set("utm_source", fallbackUtm)
  }
  for (const key of ["utm_source", "utm_medium", "utm_campaign", "utm_content"] as const) {
    const value = request.nextUrl.searchParams.get(key)
    if (value && !target.searchParams.has(key)) {
      target.searchParams.set(key, value)
    }
  }

  if (linkId) {
    try {
      await db.insert(linkClicks).values({
        linkId,
        referrerHost: hostOf(request.headers.get("referer")),
      })
    } catch (error) {
      console.error("[go] click insert failed:", error)
    }
  }

  return NextResponse.redirect(target, 302)
}
