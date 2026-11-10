"use client"

import { LazyMotion, domMax } from "motion/react"
import type { ReactNode } from "react"

/**
 * `domMax` is the same `motion` package. Scroll progress and the nav pill
 * need the scroll + layout features. The wordmark loop stays CSS.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={domMax} strict>
      {children}
    </LazyMotion>
  )
}
