export function isAllowedBrowserOrigin(request: Request): boolean {
  const origin = request.headers.get("origin")
  if (!origin) return true

  const expected = new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
  ).origin
  return origin === expected
}
