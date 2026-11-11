"use client"

import { m, useTransform } from "motion/react"

import { useMotionOk } from "@/components/brand/use-motion-ok"
import { useScrollProgress } from "@/components/brand/scroll-progress"

export function DepthGauge({
  surface,
  depth,
}: {
  surface: string
  depth: string
}) {
  const motionOk = useMotionOk()
  const { smooth } = useScrollProgress()
  const y = useTransform(smooth, [0, 1], ["0%", "100%"])

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute top-24 right-3 bottom-8 hidden w-28 md:block"
    >
      <span className="absolute top-0 right-6 text-xs text-foreground/55">{surface}</span>
      <div className="absolute top-6 right-2 bottom-6 w-px bg-foreground/20">
          <m.span
            className="absolute -left-[4px] size-2.5 rotate-45 border border-brand bg-background"
            style={motionOk ? { top: y } : { top: 0 }}
          />
      </div>
      <span className="absolute right-6 bottom-0 text-xs text-foreground/55">{depth}</span>
    </div>
  )
}
