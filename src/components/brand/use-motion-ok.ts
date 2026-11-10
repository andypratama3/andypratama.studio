"use client"

import * as React from "react"

/** True only in the browser when the user has not asked for reduced motion. */
export function useMotionOk() {
  return React.useSyncExternalStore(
    (callback) => {
      if (typeof window.matchMedia !== "function") return () => {}
      const query = window.matchMedia("(prefers-reduced-motion: reduce)")
      query.addEventListener("change", callback)
      return () => query.removeEventListener("change", callback)
    },
    () => {
      if (typeof window.matchMedia !== "function") return false
      return !window.matchMedia("(prefers-reduced-motion: reduce)").matches
    },
    () => false
  )
}
