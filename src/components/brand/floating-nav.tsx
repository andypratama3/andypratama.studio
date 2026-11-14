"use client"

import * as React from "react"
import { Menu } from "lucide-react"
import { useTranslations } from "next-intl"

import { Button, buttonVariants } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Link, usePathname } from "@/i18n/routing"
import { cn } from "@/lib/utils"
import { m } from "motion/react"
import { Magnetic } from "@/components/brand/magnetic"
import { useScrollProgress } from "@/components/brand/scroll-progress"
import { useMotionOk } from "@/components/brand/use-motion-ok"
import { LangSwitcher } from "@/components/site/lang-switcher"
import { ThemeSwitcher } from "@/components/site/theme-switcher"

const navItems = [
  { href: "/work", key: "work" },
  { href: "/products", key: "products" },
  { href: "/services", key: "services" },
  { href: "/journal", key: "journal" },
  { href: "/about", key: "about" },
] as const

type NavSurface = "light" | "dark"

/**
 * Velto-style floating pill nav. Utilities sit outside the capsule.
 * Surface adapts via IntersectionObserver on [data-nav-theme] sections.
 */
function isNavActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`)
}

export function FloatingNav() {
  const t = useTranslations("nav")
  const pathname = usePathname()
  const motionOk = useMotionOk()
  const { smooth } = useScrollProgress()
  const [open, setOpen] = React.useState(false)
  const [surface, setSurface] = React.useState<NavSurface>("light")

  React.useEffect(() => {
    const probeY = 72
    const nodes = Array.from(
      document.querySelectorAll<HTMLElement>("[data-nav-theme]")
    )
    if (nodes.length === 0) return

    const apply = () => {
      const hit = nodes.find((node) => {
        const rect = node.getBoundingClientRect()
        return rect.top <= probeY && rect.bottom >= probeY
      })
      const theme = hit?.getAttribute("data-nav-theme")
      if (theme === "dark" || theme === "light") setSurface(theme)
    }

    apply()
    const observer = new IntersectionObserver(apply, {
      rootMargin: "-72px 0px -45% 0px",
      threshold: [0, 0.15, 0.4, 0.7, 1],
    })
    for (const node of nodes) observer.observe(node)
    window.addEventListener("resize", apply)
    return () => {
      observer.disconnect()
      window.removeEventListener("resize", apply)
    }
  }, [pathname])

  const isDark = surface === "dark"

  return (
    <m.div
      className="nav-enter pointer-events-none fixed inset-x-0 top-[max(0.75rem,env(safe-area-inset-top))] z-[var(--z-nav)] px-[max(0.75rem,env(safe-area-inset-right))] ps-[max(0.75rem,env(safe-area-inset-left))] sm:top-[max(1rem,env(safe-area-inset-top))]"
    >
      <div className="mx-auto flex max-w-[1440px] items-center gap-2 sm:gap-3">
        {/* Lang/theme capsule — hidden on mobile (<md) because Sheet provides them */}
        <div
          className={cn(
            "pointer-events-auto hidden items-center gap-0.5 rounded-full border px-1.5 py-1 backdrop-blur-md transition-[background-color,border-color,color] duration-300 ease-out md:flex",
            isDark
              ? "border-surface-contrast-foreground/15 bg-surface-contrast/70 text-surface-contrast-foreground"
              : "border-border/80 bg-background/80 text-foreground"
          )}
        >
          <LangSwitcher />
          <ThemeSwitcher />
        </div>

        <div
          data-theme={surface}
          className={cn(
            "pointer-events-auto relative mx-auto flex h-12 w-full max-w-[720px] items-center gap-2 rounded-full border px-2 pl-4 shadow-sm backdrop-blur-md transition-[background-color,border-color,color] duration-300 ease-out sm:h-14 sm:px-3",
            isDark
              ? "border-surface-contrast-foreground/15 bg-surface-contrast/75 text-surface-contrast-foreground"
              : "border-border/80 bg-background/85 text-foreground"
          )}
        >
          <Link
            href="/"
            className={cn(
              "inline-flex min-h-11 max-w-[9.5rem] shrink-0 items-center truncate rounded-sm text-sm font-semibold tracking-tight focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand sm:max-w-[14rem]",
              isDark
                ? "text-surface-contrast-foreground hover:text-brand-on-dark"
                : "text-foreground hover:text-brand"
            )}
          >
            {t("brand")}
          </Link>

          <nav
            aria-label={t("menu")}
            className="ml-2 hidden min-w-0 flex-1 items-center justify-center gap-0.5 md:flex"
          >
            {navItems.map((item) => {
              const active = isNavActive(pathname, item.href)
              return (
                <Link
                  key={item.key}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "relative rounded-full px-2.5 py-2 text-[0.8125rem] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand",
                    isDark
                      ? "text-surface-contrast-foreground/65 hover:text-surface-contrast-foreground"
                      : "text-muted-foreground hover:text-foreground",
                    active &&
                      (isDark
                        ? "text-surface-contrast-foreground"
                        : "text-foreground")
                  )}
                >
                  {active ? (
                    <span
                      aria-hidden
                      className="absolute inset-0 rounded-full bg-brand/15"
                    />
                  ) : null}
                  <span className="relative">{t(item.key)}</span>
                </Link>
              )
            })}
          </nav>

          <div className="ml-auto flex items-center gap-1.5">
            <Magnetic className="hidden sm:inline-flex">
            <Link
              href="/start"
              className={cn(
                buttonVariants({ size: "sm" }),
                "h-11 min-h-11 rounded-full bg-primary px-4 font-medium text-primary-foreground hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-brand"
              )}
            >
              {t("start")}
            </Link>
            </Magnetic>

            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger
                render={
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    className={cn(
                      "min-h-11 min-w-11 focus-visible:ring-2 focus-visible:ring-brand md:hidden",
                      isDark
                        ? "text-surface-contrast-foreground/70 hover:text-surface-contrast-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                    aria-label={t("menu")}
                  />
                }
              >
                <Menu className="size-4" />
                <span className="sr-only">{t("menu")}</span>
              </SheetTrigger>

              <SheetContent
                side="right"
                className="flex w-72 flex-col justify-between rounded-l-[1.75rem] border-border p-6"
              >
                <div>
                  <SheetHeader className="border-b border-border pb-4 text-left">
                    <SheetTitle className="text-sm font-semibold text-foreground">
                      {t("brand")}
                    </SheetTitle>
                  </SheetHeader>
                  <nav className="flex flex-col gap-2 py-4">
                    {navItems.map((item) => (
                      <Link
                        key={item.key}
                        href={item.href}
                        aria-current={isNavActive(pathname, item.href) ? "page" : undefined}
                        onClick={() => setOpen(false)}
                        className="rounded-2xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                      >
                        {t(item.key)}
                      </Link>
                    ))}
                    <Link
                      href="/start"
                      onClick={() => setOpen(false)}
                      className={cn(
                        buttonVariants({ size: "sm" }),
                        "mt-2 h-11 w-full justify-center rounded-full bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-brand"
                      )}
                    >
                      {t("start")}
                    </Link>
                  </nav>
                </div>
                <div className="flex items-center justify-between border-t border-border pt-4">
                  <LangSwitcher />
                  <ThemeSwitcher />
                </div>
              </SheetContent>
            </Sheet>
          </div>
          <m.div
            aria-hidden
            className="nav-progress pointer-events-none absolute inset-x-5 bottom-1.5 h-px origin-left rounded-full bg-brand"
            style={motionOk ? { scaleX: smooth } : undefined}
          />
        </div>
      </div>
    </m.div>
  )
}
