import { type NextRequest, NextResponse } from "next/server"
import createIntlMiddleware from "next-intl/middleware"

import { routing } from "@/i18n/routing"

const intlMiddleware = createIntlMiddleware(routing)

function isProtectedPath(pathname: string): boolean {
  const normalized = pathname.replace(/^\/(en|id)(?=\/|$)/, "") || "/"
  return normalized === "/dashboard" || normalized.startsWith("/dashboard/")
}

function hasSessionCookie(request: NextRequest): boolean {
  return request.cookies
    .getAll()
    .some((cookie) => cookie.name.replace(/^__Secure-/, "") === "better-auth.session_token")
}

function signInPath(pathname: string): string {
  return pathname.startsWith("/id") ? "/id/sign-in" : "/sign-in"
}

/**
 * Development-only escape hatch so the dashboard can be inspected without a
 * session. Never active in production.
 */
function devBypassEnabled(): boolean {
  return (
    process.env.NODE_ENV !== "production" &&
    process.env.DASHBOARD_DEV_BYPASS === "1"
  )
}

export async function proxy(request: NextRequest): Promise<NextResponse> {
  const { pathname } = request.nextUrl

  if (
    isProtectedPath(pathname) &&
    !devBypassEnabled() &&
    !hasSessionCookie(request)
  ) {
    const url = request.nextUrl.clone()
    const target = signInPath(pathname)
    url.pathname = target
    url.search = ""
    return NextResponse.redirect(url)
  }

  return intlMiddleware(request) as NextResponse
}

export const config = {
  /*
   * Run the proxy middleware only for page routes.
   * Excluded patterns (negative lookahead):
   *   api        — Next.js API routes
   *   go         — outbound redirect handlers
   *   _next      — static assets + image optimisation
   *   favicon.ico
   *   .*\..*     — any path containing a dot (robots.txt, sitemap.xml, manifest, etc.)
   */
  matcher: ["/((?!api|go|_next|favicon\\.ico|.*\\..*).*)"],
}
