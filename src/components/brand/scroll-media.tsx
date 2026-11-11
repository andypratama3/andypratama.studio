"use client"

import * as React from "react"
import { m, useScroll, useTransform } from "motion/react"
import { useMotionOk } from "@/components/brand/use-motion-ok"
import { cn } from "@/lib/utils"

/**
 * Scroll storytelling: media panel scales + lifts as it crosses the viewport.
 * Transform/opacity only. Static when reduced-motion.
 */
export function ScrollMedia({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  const ref = React.useRef<HTMLDivElement | null>(null)
  const motionOk = useMotionOk()
  const [hot, setHot] = React.useState(false)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center center"],
  })
  const scale = useTransform(scrollYProgress, [0, 1], [0.94, 1])
  const y = useTransform(scrollYProgress, [0, 1], [36, 0])
  const opacity = useTransform(scrollYProgress, [0, 0.35, 1], [0.55, 0.9, 1])

  React.useEffect(() => {
    const node = ref.current
    if (!node) return
    const observer = new IntersectionObserver(([entry]) => {
      setHot(Boolean(entry?.isIntersecting))
    }, { rootMargin: "20% 0px" })
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={ref} className={cn("overflow-hidden", className)}>
      <m.div
        style={
          motionOk
            ? { scale, y, opacity }
            : undefined
        }
        className={hot && motionOk ? "will-change-transform" : undefined}
      >
        {children}
      </m.div>
    </div>
  )
}

/**
 * Soft parallax band for section dividers — depth without layout thrash.
 */
export function ScrollDepth({
  children,
  className,
  intensity = 28,
}: {
  children: React.ReactNode
  className?: string
  intensity?: number
}) {
  const ref = React.useRef<HTMLDivElement | null>(null)
  const motionOk = useMotionOk()
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })
  const y = useTransform(scrollYProgress, [0, 1], [Math.min(intensity, 24), -Math.min(intensity, 24)])

  return (
    <div ref={ref} className={cn("relative", className)}>
      <m.div style={motionOk ? { y } : undefined}>{children}</m.div>
    </div>
  )
}
