"use client"

import * as React from "react"
import { m, useMotionValue, useSpring } from "motion/react"
import { useMotionOk } from "@/components/brand/use-motion-ok"
import { motionSprings, motionTokens } from "@/lib/motion"
import { cn } from "@/lib/utils"

/**
 * Pointer-follow press for primary actions.
 * Transform only. Off when reduced-motion or a coarse pointer.
 * The bounding rect is cached on enter and refreshed on scroll or resize.
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
  const sx = useSpring(x, motionSprings.quick)
  const sy = useSpring(y, motionSprings.quick)
  const ref = React.useRef<HTMLDivElement>(null)
  const fine = React.useRef(false)
  const rect = React.useRef<DOMRect | null>(null)

  React.useEffect(() => {
    fine.current =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(pointer: fine)").matches
    const update = () => {
      if (ref.current) rect.current = ref.current.getBoundingClientRect()
    }
    window.addEventListener("resize", update)
    window.addEventListener("scroll", update, { passive: true })
    return () => {
      window.removeEventListener("resize", update)
      window.removeEventListener("scroll", update)
    }
  }, [])

  function onEnter() {
    if (!fine.current || !ref.current) return
    rect.current = ref.current.getBoundingClientRect()
  }

  function onMove(event: React.PointerEvent<HTMLDivElement>) {
    if (!ok || !fine.current) return
    const box = rect.current
    if (!box) return
    x.set(((event.clientX - (box.left + box.width / 2)) / box.width) * strength)
    y.set(((event.clientY - (box.top + box.height / 2)) / box.height) * strength)
  }

  function onLeave() {
    x.set(0)
    y.set(0)
  }

  return (
    <m.div
      ref={ref}
      className={cn("magnetic inline-flex", className)}
      style={ok ? { x: sx, y: sy } : undefined}
      whileTap={ok ? { scale: 0.97 } : undefined}
      transition={{ duration: motionTokens.press, ease: motionTokens.ease }}
      onPointerEnter={onEnter}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
    >
      {children}
    </m.div>
  )
}
