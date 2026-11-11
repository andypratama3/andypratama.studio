"use client"

import { LazyMotion, domAnimation } from "motion/react"
import { useEffect, type ReactNode } from "react"

/**
 * `domAnimation` is enough once nav indicators no longer use `layoutId`.
 * `domMax` stays out of the global graph (about 50KB uncompressed in the
 * package rollup). Decorative loops pause off-screen and while the tab is hidden.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return
    const root = document.documentElement
    const nodes = Array.from(document.querySelectorAll<HTMLElement>("[data-decor]"))
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        entry.target.toggleAttribute("data-offscreen", !entry.isIntersecting)
      }
    })
    for (const node of nodes) observer.observe(node)

    const onVisibility = () => {
      root.toggleAttribute("data-tab-hidden", document.hidden)
    }
    onVisibility()
    document.addEventListener("visibilitychange", onVisibility)
    return () => {
      observer.disconnect()
      document.removeEventListener("visibilitychange", onVisibility)
    }
  }, [])

  return (
    <LazyMotion features={domAnimation} strict>
      {children}
    </LazyMotion>
  )
}
