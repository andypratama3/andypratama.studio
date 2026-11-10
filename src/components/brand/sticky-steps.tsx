"use client"

import * as React from "react"
import { m } from "motion/react"
import { motionTokens } from "@/lib/motion"
import { useMotionOk } from "@/components/brand/use-motion-ok"
import { cn } from "@/lib/utils"

export interface StickyStep {
  title: string
  description?: string
}

export interface StickyStepsProps {
  steps: StickyStep[]
  className?: string
}

/**
 * Sticky stack from 640px up. The active step follows scroll.
 * Mobile and reduced-motion stay a normal list. No extra empty height.
 */
export function StickySteps({ steps, className }: StickyStepsProps) {
  const motionOk = useMotionOk()
  const [active, setActive] = React.useState(0)
  const itemRefs = React.useRef<Array<HTMLElement | null>>([])

  React.useEffect(() => {
    if (!motionOk) return
    if (typeof IntersectionObserver === "undefined") return
    const nodes = itemRefs.current.filter((node): node is HTMLElement => node !== null)
    if (nodes.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        const hit = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (!hit) return
        const index = nodes.indexOf(hit.target as HTMLElement)
        if (index >= 0) setActive(index)
      },
      { rootMargin: "-72px 0px -55% 0px", threshold: [0.15, 0.4, 0.75] }
    )
    for (const node of nodes) observer.observe(node)
    return () => observer.disconnect()
  }, [motionOk, steps.length])

  if (steps.length === 0) return null

  const showProgress = motionOk

  return (
    <div className={cn("sticky-steps", className)}>
      {showProgress ? (
        <div
          className="mb-3 hidden h-1 overflow-hidden rounded-full bg-border sm:block"
          aria-hidden="true"
        >
          <m.div
            className="h-full origin-left rounded-full bg-brand"
            initial={false}
            animate={{ scaleX: (active + 1) / steps.length }}
            transition={{ duration: motionTokens.base, ease: motionTokens.ease }}
          />
        </div>
      ) : null}
      {steps.map((step, index) => (
        <article
          key={step.title}
          ref={(node) => {
            itemRefs.current[index] = node
          }}
          data-active={showProgress && active === index ? "true" : undefined}
          className={cn(
            "sticky-step border border-border/70 bg-secondary/90 p-5 sm:rounded-[1.75rem] sm:p-8 sm:shadow-sm",
            "max-sm:rounded-2xl max-sm:border-border/50 max-sm:bg-secondary/60 max-sm:p-6"
          )}
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-8">
            <span
              aria-hidden
              className="sticky-index inline-flex size-11 min-h-11 min-w-11 items-center justify-center rounded-full border border-border text-label tabular-nums text-foreground"
            >
              {String(index + 1).padStart(2, "0")}
            </span>
            <div className="min-w-0 space-y-2">
              <h3 className="text-lg font-semibold leading-snug tracking-tight text-foreground sm:text-xl">
                {step.title}
              </h3>
              {step.description ? (
                <p className="text-body-measure text-base leading-relaxed text-muted-foreground">
                  {step.description}
                </p>
              ) : null}
            </div>
          </div>
        </article>
      ))}
    </div>
  )
}
