"use client"

import * as React from "react"
import { m } from "motion/react"
import { Link } from "@/i18n/routing"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { Magnetic } from "@/components/brand/magnetic"
import { useMotionOk } from "@/components/brand/use-motion-ok"
import { motionTokens } from "@/lib/motion"

export interface LocalNavItem {
  href: string
  label: string
}

export interface LocalNavProps {
  items: LocalNavItem[]
  action?: { href: string; label: string; external?: boolean }
  className?: string
  "aria-label"?: string
}

/** Thin product/case-study bar under the floating pill (Apple-style structure). */
export function LocalNav({
  items,
  action,
  className,
  "aria-label": ariaLabel = "Section navigation",
}: LocalNavProps) {
  const motionOk = useMotionOk()
  const [active, setActive] = React.useState(items[0]?.href ?? "")
  const actionClass = cn(
    buttonVariants({ size: "sm" }),
    "h-11 min-h-11 shrink-0 rounded-full bg-primary px-4 text-primary-foreground hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-brand"
  )
  const external =
    action != null &&
    (action.external ??
      (/^https?:\/\//.test(action.href) || action.href.startsWith("/go/")))

  React.useEffect(() => {
    const ids = items
      .map((item) => (item.href.startsWith("#") ? item.href.slice(1) : ""))
      .filter(Boolean)
    const nodes = ids
      .map((id) => document.getElementById(id))
      .filter((node): node is HTMLElement => node !== null)
    if (nodes.length === 0) return
    if (typeof IntersectionObserver === "undefined") return

    const observer = new IntersectionObserver(
      (entries) => {
        const hit = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (!hit) return
        setActive(`#${hit.target.id}`)
      },
      { rootMargin: "-96px 0px -55% 0px", threshold: [0.15, 0.4] }
    )
    for (const node of nodes) observer.observe(node)
    return () => observer.disconnect()
  }, [items])

  return (
    <div
      className={cn(
        "sticky top-[4.5rem] z-[var(--z-sticky)] border-b border-border/80 bg-background/90 backdrop-blur-md",
        className
      )}
    >
      <div className="mx-auto flex min-h-11 max-w-[1200px] items-center gap-4 px-[clamp(20px,4vw,40px)]">
        <nav
          aria-label={ariaLabel}
          className="flex min-w-0 flex-1 items-center gap-0.5 overflow-x-auto overscroll-x-contain [-webkit-overflow-scrolling:touch]"
        >
          {items.map((item) => {
            const isActive = active === item.href
            return (
              <a
                key={item.href}
                href={item.href}
                aria-current={isActive ? "location" : undefined}
                className={cn(
                  "relative inline-flex min-h-11 shrink-0 items-center rounded-md px-3 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand sm:text-[0.8125rem]",
                  isActive
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {motionOk && isActive ? (
                  <m.span
                    layoutId="local-nav-line"
                    className="absolute inset-x-3 bottom-2 h-px bg-brand"
                    transition={{ duration: motionTokens.base, ease: motionTokens.ease }}
                  />
                ) : isActive ? (
                  <span className="absolute inset-x-3 bottom-2 h-px bg-brand" />
                ) : null}
                <span className="relative">{item.label}</span>
              </a>
            )
          })}
        </nav>
        {action != null ? (
          <Magnetic>
            {external ? (
              <a
                href={action.href}
                target="_blank"
                rel="noopener noreferrer"
                className={actionClass}
              >
                {action.label}
              </a>
            ) : (
              <Link href={action.href} className={actionClass}>
                {action.label}
              </Link>
            )}
          </Magnetic>
        ) : null}
      </div>
    </div>
  )
}
