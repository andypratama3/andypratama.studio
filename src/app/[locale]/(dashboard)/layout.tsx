import { getLocale } from "next-intl/server"
import type { Metadata } from "next"
import { redirect } from "@/i18n/routing"
import { getOwnerSession } from "@/lib/auth"
import { DashboardNav } from "@/components/dashboard/dashboard-nav"
import { ThemeSwitcher } from "@/components/site/theme-switcher"
import { SignOutButton } from "@/components/dashboard/sign-out-button"
import { ShieldCheck, User } from "lucide-react"

export const metadata: Metadata = {
  robots: { index: false, follow: false },
}

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await getOwnerSession()

  // Protect dashboard in production. In development without DB/OAuth, display dev banner if unauthenticated.
  const isProd = process.env.NODE_ENV === "production"
  if (isProd && !session) {
    redirect({ href: "/sign-in", locale: await getLocale() })
  }

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Sidebar navigation */}
      <DashboardNav />

      {/* Main content wrapper */}
      <div className="flex flex-1 flex-col md:pl-64">
        {/* Top header bar */}
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border bg-background/80 px-4 backdrop-blur-md sm:px-6">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 rounded-full border border-border bg-muted/40 px-2.5 py-0.5 text-[11px] font-medium text-foreground">
              <ShieldCheck className="h-3.5 w-3.5 text-brand" />
              <span>Owner Mode</span>
            </span>
            <span className="hidden text-xs text-muted-foreground sm:inline">
              Andy Pratama Studio Console
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-muted">
                <User className="h-3.5 w-3.5" />
              </div>
              <span className="hidden sm:inline">
                {session?.user?.name ?? "Andy Pratama"}
              </span>
            </div>
            <ThemeSwitcher />
            <SignOutButton />
          </div>
        </header>

        {/* Dashboard page content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  )
}
