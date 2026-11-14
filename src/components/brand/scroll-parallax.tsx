"use client"

import * as React from "react"
import { m, useScroll, useTransform } from "motion/react"
import { useMotionOk } from "@/components/brand/use-motion-ok"
import { cn } from "@/lib/utils"

/**
 * Scroll parallax layer — moves slower/faster than scroll for depth.
 * Transform-only, no layout thrash. Static when reduced-motion.
 */
export function ScrollParallax({
  children,
  className,
  speed = 0.15,
  direction = "y",
}: {
  children: React.ReactNode
  className?: string
  /** 0 = static, 0.15 = gentle parallax, 0.5 = strong */
  speed?: number
  /** "y" vertical, "x" horizontal */
  direction?: "x" | "y"
}) {
  const ref = React.useRef<HTMLDivElement | null>(null)
  const motionOk = useMotionOk()
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })

  const move = useTransform(
    scrollYProgress,
    [0, 1],
    direction === "x" ? [speed * 60, -speed * 60] : [speed * 40, -speed * 40]
  )

  return (
    <div
      ref={ref}
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden",
        className
      )}
    >
      <m.div
        style={motionOk ? { [direction === "x" ? "x" : "y"]: move } : undefined}
        className={cn("h-full w-full", motionOk && "will-change-transform")}
      >
        {children}
      </m.div>
    </div>
  )
}
