import { type NextRequest, NextResponse } from "next/server"
import createIntlMiddleware from "next-intl/middleware"

import { routing } from "@/i18n/routing"

const intlMiddleware = createIntlMiddleware(routing)

// Dashboard is protected in Phase 3 when auth exists.
// Until then, we do NOT redirect to a non-existent /auth/sign-in.
// See DECISIONS.md §13 for the rationale.
const protectedPaths: string[] = []

function isProtectedPath(pathname: string): boolean {
  return protectedPaths.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  )
}

export async function proxy(request: NextRequest): Promise<NextResponse> {
  const { pathname } = request.nextUrl

  if (isProtectedPath(pathname)) {
    // Phase 3 placeholder: return 404 until auth is wired.
    return new NextResponse(null, { status: 404 })
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
