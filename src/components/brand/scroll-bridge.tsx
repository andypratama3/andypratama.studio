"use client"

import * as React from "react"
import { m, useScroll, useTransform } from "motion/react"
import { useMotionOk } from "@/components/brand/use-motion-ok"

/**
 * Horizontal wordmark scrubbed by this band's own scroll progress.
 * Distinct from ScrollMedia (scale) and ScrollDepth (parallax).
 * Static and clipped when motion is reduced. Decorative only.
 */
export function ScrollBridge({ text }: { text: string }) {
  const ref = React.useRef<HTMLDivElement | null>(null)
  const motionOk = useMotionOk()
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })
  const x = useTransform(scrollYProgress, [0, 1], ["12%", "-28%"])
  const opacity = useTransform(scrollYProgress, [0, 0.25, 0.75, 1], [0.25, 0.55, 0.55, 0.2])
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.96, 1, 0.98])

  return (
    <div ref={ref} className="overflow-hidden py-12 sm:py-16" aria-hidden="true">
      <m.p
        className="text-wordmark whitespace-nowrap text-foreground/20"
        style={motionOk ? { x, opacity, scale } : { x: 0, opacity: 0.35 }}
      >
        {text}
        <span className="px-[0.2em]">{text}</span>
      </m.p>
    </div>
  )
}
