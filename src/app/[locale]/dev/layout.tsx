import { notFound } from "next/navigation"
import { SkipLink } from "@/components/brand/skip-link"
import { WiringProbe } from "@/components/providers/wiring-probe"
import { Link } from "@/lib/navigation"

export default function DevLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  // Hidden in production unless ENABLE_DEV_ROUTES=1 (Playwright wiring suite).
  if (
    process.env.NODE_ENV === "production" &&
    process.env.ENABLE_DEV_ROUTES !== "1"
  ) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SkipLink />
      <WiringProbe />
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-[1200px] items-center gap-4 px-[clamp(20px,4vw,40px)] py-4">
          <p className="text-label text-brand">Dev</p>
          <nav aria-label="Diagnostics" className="flex gap-3 text-sm">
            <Link
              href="/dev/wiring"
              className="text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
            >
              Wiring
            </Link>
            <Link
              href="/dev/components"
              className="text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
            >
              Components
            </Link>
            <Link
              href="/"
              className="text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
            >
              Site
            </Link>
          </nav>
        </div>
      </header>
      <main id="main" className="mx-auto max-w-[1200px] px-[clamp(20px,4vw,40px)] py-10">
        {children}
      </main>
    </div>
  )
}
