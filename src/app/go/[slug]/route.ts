import { appendFile, mkdir } from "node:fs/promises"
import path from "node:path"
import { NextResponse, type NextRequest } from "next/server"
import { getOutboundLink } from "@/content/outbound-links"
import { rateLimit } from "@/lib/rate-limit"

export const dynamic = "force-dynamic"

/**
 * 302 hop for outbound CTAs. Logs slug + time only (no IP / UA).
 */
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  const { slug } = await context.params
  const link = getOutboundLink(slug)

  if (!link) {
    return NextResponse.redirect(new URL("/", request.url), 302)
  }

  const limited = rateLimit(`go:${slug}`, 120, 60_000)
  if (!limited.ok) {
    return new NextResponse("Too many requests", {
      status: 429,
      headers: { "Retry-After": String(limited.retryAfterSec) },
    })
  }

  const target = new URL(link.href)
  if (link.utmSource && !target.searchParams.has("utm_source")) {
    target.searchParams.set("utm_source", link.utmSource)
  }
  for (const key of ["utm_medium", "utm_campaign", "utm_content"] as const) {
    const value = request.nextUrl.searchParams.get(key)
    if (value && !target.searchParams.has(key)) {
      target.searchParams.set(key, value)
    }
  }

  try {
    const dir = path.join(process.cwd(), "tmp")
    await mkdir(dir, { recursive: true })
    await appendFile(
      path.join(dir, "link-clicks.jsonl"),
      `${JSON.stringify({ slug, at: new Date().toISOString() })}\n`,
      "utf8"
    )
  } catch {
    // redirect anyway
  }

  return NextResponse.redirect(target, 302)
}
