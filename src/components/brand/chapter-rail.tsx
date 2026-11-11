"use client"

import * as React from "react"
import { m } from "motion/react"
import { useMotionOk } from "@/components/brand/use-motion-ok"
import { useScrollProgress } from "@/components/brand/scroll-progress"
import { cn } from "@/lib/utils"

export interface ChapterRailItem {
  id: string
  index: string
  label: string
}

/** Side index + scroll progress, in the rhythm of a chaptered scroll page. */
export function ChapterRail({
  items,
  label,
}: {
  items: ChapterRailItem[]
  label: string
}) {
  const motionOk = useMotionOk()
  const { smooth } = useScrollProgress()
  const [active, setActive] = React.useState(items[0]?.id ?? "")

  React.useEffect(() => {
    const nodes = items
      .map((item) => document.getElementById(item.id))
      .filter((node): node is HTMLElement => node !== null)
    if (nodes.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (visible?.target.id) setActive(visible.target.id)
      },
      { rootMargin: "-35% 0px -50% 0px", threshold: [0.15, 0.4] }
    )
    for (const node of nodes) observer.observe(node)
    return () => observer.disconnect()
  }, [items])

  return (
    <>
      <div
        aria-hidden
        className="pointer-events-none fixed inset-y-0 right-0 z-30 hidden w-px bg-border md:block"
      >
        <m.div
          className="h-full w-px origin-top bg-foreground"
          style={motionOk ? { scaleY: smooth } : { scaleY: 1 }}
        />
      </div>
      <nav
        aria-label={label}
        className="sticky top-[4.5rem] z-[var(--z-sticky)] border-b border-border/80 bg-background/90 backdrop-blur-md"
      >
        <ol className="mx-auto flex w-full max-w-[1440px] gap-1 overflow-x-auto px-[clamp(20px,4vw,40px)] py-3 [-webkit-overflow-scrolling:touch]">
          {items.map((item) => {
            const on = active === item.id
            return (
              <li key={item.id} className="shrink-0">
                <a
                  href={`#${item.id}`}
                  aria-current={on ? "true" : undefined}
                  className={cn(
                    "relative inline-flex min-h-11 items-center gap-2 rounded-full px-3 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand",
                    on
                      ? "bg-foreground/5 text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <span className="text-[11px] tracking-[0.18em] text-muted-foreground">
                    {item.index}
                  </span>
                  <span className="whitespace-nowrap">{item.label}</span>
                  {on ? (
                    <span
                      aria-hidden
                      className="absolute inset-x-3 bottom-1.5 h-px bg-brand"
                    />
                  ) : null}
                </a>
              </li>
            )
          })}
        </ol>
      </nav>
    </>
  )
}
