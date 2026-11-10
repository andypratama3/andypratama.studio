"use client"

import * as React from "react"
import { m, useMotionValue, useSpring } from "motion/react"
import { useMotionOk } from "@/components/brand/use-motion-ok"
import { motionTokens } from "@/lib/motion"
import { cn } from "@/lib/utils"

/**
 * Pointer-follow press for primary actions.
 * Transform only. Off when reduced-motion or a coarse pointer.
 */
export function Magnetic({
  children,
  className,
  strength = 10,
}: {
  children: React.ReactNode
  className?: string
  strength?: number
}) {
  const ok = useMotionOk()
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 220, damping: 18, mass: 0.35 })
  const sy = useSpring(y, { stiffness: 220, damping: 18, mass: 0.35 })
  const ref = React.useRef<HTMLDivElement>(null)

  function onMove(event: React.PointerEvent<HTMLDivElement>) {
    if (!ok) return
    if (typeof window.matchMedia !== "function") return
    if (!window.matchMedia("(pointer: fine)").matches) return
    const node = ref.current
    if (!node) return
    const rect = node.getBoundingClientRect()
    x.set(((event.clientX - (rect.left + rect.width / 2)) / rect.width) * strength)
    y.set(((event.clientY - (rect.top + rect.height / 2)) / rect.height) * strength)
  }

  function onLeave() {
    x.set(0)
    y.set(0)
  }

  return (
    <m.div
      ref={ref}
      className={cn("inline-flex", className)}
      style={ok ? { x: sx, y: sy } : undefined}
      whileHover={ok ? { scale: 1.03 } : undefined}
      whileTap={ok ? { scale: 0.97 } : undefined}
      transition={{ duration: motionTokens.fast, ease: motionTokens.ease }}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
    >
      {children}
    </m.div>
  )
}
