"use client"

import { useState } from "react"
import { usePathname } from "@/i18n/routing"
import {
  Calendar,
  CheckSquare,
  Users,
  Briefcase,
  FileText,
  BarChart3,
  Package,
  FolderGit2,
  Bot,
  Link2,
  Settings,
  Menu,
  X,
  ExternalLink,
} from "lucide-react"
import { Link } from "@/i18n/routing"
import { cn } from "@/lib/utils"

export const navItems = [
  { href: "/dashboard", label: "Hari Ini", icon: Calendar },
  { href: "/dashboard/tasks", label: "Tugas", icon: CheckSquare },
  { href: "/dashboard/leads", label: "Lead", icon: Users },
  { href: "/dashboard/applications", label: "Lamaran", icon: Briefcase },
  { href: "/dashboard/content", label: "Konten", icon: FileText },
  { href: "/dashboard/metrics", label: "Metrik", icon: BarChart3 },
  { href: "/dashboard/products", label: "Produk", icon: Package },
  { href: "/dashboard/projects", label: "Proyek", icon: FolderGit2 },
  { href: "/dashboard/agents", label: "Agen", icon: Bot },
  { href: "/dashboard/links", label: "Tautan", icon: Link2 },
  { href: "/dashboard/settings", label: "Pengaturan", icon: Settings },
]

export function DashboardNav() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  // Normalize pathname to strip locale prefix for active link detection
  const normalizedPath = pathname.replace(/^\/(?:en|id)/, "") || "/"

  function isLinkActive(href: string) {
    if (href === "/dashboard") {
      return normalizedPath === "/dashboard"
    }
    return normalizedPath.startsWith(href)
  }

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        className="fixed bottom-4 right-4 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-brand text-brand-foreground shadow-lg md:hidden"
        aria-label="Buka menu navigasi"
      >
        <Menu className="h-6 w-6" />
      </button>

      {/* Mobile Overlay Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar: Fixed on desktop, sliding sheet on mobile */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-border bg-card transition-transform duration-200 ease-in-out md:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Brand header */}
        <div className="flex h-14 items-center justify-between border-b border-border px-5">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-sm font-semibold tracking-tight text-foreground"
            onClick={() => setMobileOpen(false)}
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-brand text-xs font-bold text-brand-foreground">
              AP
            </div>
            <span>Studio Console</span>
          </Link>
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="rounded-md p-1.5 text-muted-foreground hover:bg-muted md:hidden"
            aria-label="Tutup menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          <div className="px-2 pb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Operasional
          </div>
          {navItems.map((item) => {
            const Icon = item.icon
            const active = isLinkActive(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-xs font-medium transition-colors",
                  active
                    ? "bg-brand/10 text-brand font-semibold"
                    : "text-muted-foreground hover:bg-muted/70 hover:text-foreground"
                )}
              >
                <Icon
                  className={cn(
                    "h-4 w-4 shrink-0",
                    active ? "text-brand" : "text-muted-foreground"
                  )}
                />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* Footer shortcuts */}
        <div className="border-t border-border p-3">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between rounded-md px-3 py-2 text-xs text-muted-foreground hover:bg-muted/60 hover:text-foreground"
          >
            <span>Lihat Website Publik</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </Link>
        </div>
      </aside>
    </>
  )
}
