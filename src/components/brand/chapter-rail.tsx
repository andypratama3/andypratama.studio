"use client"

import * as React from "react"
import { m, useScroll, useSpring } from "motion/react"
import { useMotionOk } from "@/components/brand/use-motion-ok"

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
  const { scrollYProgress } = useScroll()
  const scaleY = useSpring(scrollYProgress, { stiffness: 140, damping: 28, mass: 0.3 })
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
        {motionOk ? (
          <m.div className="h-full w-px origin-top bg-foreground" style={{ scaleY }} />
        ) : (
          <div className="h-full w-px bg-foreground/40" />
        )}
      </div>
      <nav aria-label={label} className="border-b border-border">
        <ol className="mx-auto flex w-full max-w-[1440px] flex-wrap gap-x-6 gap-y-3 px-[clamp(20px,4vw,40px)] py-5">
          {items.map((item) => {
            const on = active === item.id
            return (
              <li key={item.id} className="shrink-0">
                <a
                  href={`#${item.id}`}
                  aria-current={on ? "true" : undefined}
                  className={
                    on
                      ? "text-sm text-foreground"
                      : "text-sm text-muted-foreground hover:text-foreground"
                  }
                >
                  <span className="mr-2 text-[11px] tracking-[0.18em]">{item.index}</span>
                  {item.label}
                </a>
              </li>
            )
          })}
        </ol>
      </nav>
    </>
  )
}
