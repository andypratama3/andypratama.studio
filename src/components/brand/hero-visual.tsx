"use client"

import * as React from "react"
import {
  m,
  useMotionValue,
  useSpring,
  useTransform,
} from "motion/react"
import { motionSprings } from "@/lib/motion"
import { useMotionOk } from "@/components/brand/use-motion-ok"
import { cn } from "@/lib/utils"

export interface HeroVisualProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
  posterSrc?: string
}

/** Decorative hero backdrop: poster with an SVG grid and wave overlay. */
export function HeroVisual({
  className,
  posterSrc = "/media/hero-bg-poster.jpg",
  ...props
}: HeroVisualProps) {
  const ref = React.useRef<HTMLDivElement | null>(null)
  const motionOk = useMotionOk()
  const px = useMotionValue(0)
  const py = useMotionValue(0)
  const sx = useSpring(px, motionSprings.soft)
  const sy = useSpring(py, motionSprings.soft)
  const posterX = useTransform(sx, (value) => value * -10)
  const posterY = useTransform(sy, (value) => value * -10)
  const gridX = useTransform(sx, (value) => value * 16)
  const gridY = useTransform(sy, (value) => value * 16)

  // Pointer depth on the backdrop only. Fine pointers + motion allowed.
  // Normalised -1…1, applied as transform/opacity-only springs.
  React.useEffect(() => {
    const node = ref.current
    if (!node || !motionOk) return
    if (!window.matchMedia("(pointer: fine)").matches) return

    let live = true
    const observer = new IntersectionObserver(([entry]) => {
      live = Boolean(entry?.isIntersecting)
      if (!live) {
        px.set(0)
        py.set(0)
      }
    })
    observer.observe(node)

    const onMove = (event: PointerEvent) => {
      if (!live) return
      px.set((event.clientX / window.innerWidth - 0.5) * 2)
      py.set((event.clientY / window.innerHeight - 0.5) * 2)
    }

    const reset = () => {
      px.set(0)
      py.set(0)
    }

    window.addEventListener("pointermove", onMove, { passive: true })
    window.addEventListener("pointerleave", reset)
    window.addEventListener("blur", reset)

    return () => {
      observer.disconnect()
      window.removeEventListener("pointermove", onMove)
      window.removeEventListener("pointerleave", reset)
      window.removeEventListener("blur", reset)
    }
  }, [motionOk, px, py])

  return (
    <div
      ref={ref}
      className={cn(
        "hero-fade pointer-events-none absolute inset-0 overflow-hidden text-surface-contrast-foreground",
        className
      )}
      aria-hidden="true"
      data-hero-visual="poster"
      {...props}
    >
      <m.div
        className="absolute inset-0"
        style={{ x: posterX, y: posterY, scale: 1.04 }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- decorative full-bleed poster */}
        <img
          src={posterSrc}
          alt=""
          width={1920}
          height={1080}
          decoding="async"
          fetchPriority="high"
          className="size-full object-cover opacity-70"
        />
      </m.div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_18%,color-mix(in_oklab,var(--brand)_18%,transparent),transparent_58%)]" />
      <div className="absolute inset-0 bg-surface-contrast/35" />
      <m.div
        className="absolute inset-0"
        style={{ x: gridX, y: gridY, scale: 1.04 }}
      >
        <svg
          className="size-full opacity-40 motion-safe:animate-hero-grid-drift"
        data-decor=""
          viewBox="0 0 1000 1000"
          preserveAspectRatio="none"
        >
          <defs>
            <pattern id="hero-us-grid" width="56" height="56" patternUnits="userSpaceOnUse">
              <path d="M56 0H0V56" fill="none" stroke="currentColor" strokeOpacity="0.22" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="1000" height="1000" fill="url(#hero-us-grid)" />
          <path d="M0 620 C 180 520, 320 720, 500 600 S 820 480, 1000 580" fill="none" stroke="currentColor" strokeOpacity="0.28" strokeWidth="1.25" vectorEffect="non-scaling-stroke" />
          <path d="M0 720 C 220 800, 400 620, 580 740 S 880 680, 1000 780" fill="none" stroke="currentColor" strokeOpacity="0.16" strokeWidth="1" vectorEffect="non-scaling-stroke" />
          {/* Technical studio coordinate marks */}
          <g stroke="currentColor" strokeOpacity="0.35" strokeWidth="1">
            <line x1="56" y1="46" x2="56" y2="66" />
            <line x1="46" y1="56" x2="66" y2="56" />
            <line x1="944" y1="46" x2="944" y2="66" />
            <line x1="934" y1="56" x2="954" y2="56" />
          </g>
        </svg>
      </m.div>
      {/* Bottom vignette grounding into the next section */}
      <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-b from-transparent via-surface-contrast/40 to-surface-contrast pointer-events-none" />
    </div>
  )
}
