/**
 * CSRF guard for browser form posts.
 *
 * Allowed origins:
 * - the configured `NEXT_PUBLIC_SITE_URL` (canonical origin), and
 * - the origin the request was sent to (same-origin), so preview and local
 *   deployments work before the canonical URL is configured.
 *
 * A cross-site page cannot forge `Origin`, so it never matches either entry.
 */
export function isAllowedBrowserOrigin(request: Request): boolean {
  const origin = request.headers.get("origin")
  if (!origin) return true

  const allowed = new Set<string>()
  allowed.add(
    new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").origin
  )
  try {
    allowed.add(new URL(request.url).origin)
  } catch {
    // keep the configured origin only
  }

  // Reverse proxies rewrite the internal URL, so the browser origin is also
  // matched against the host the request was addressed to.
  try {
    const host =
      request.headers.get("x-forwarded-host") ?? request.headers.get("host")
    if (host) {
      const protocol = new URL(origin).protocol
      allowed.add(`${protocol}//${host}`)
    }
  } catch {
    // ignore malformed origin
  }

  return allowed.has(origin)
}
