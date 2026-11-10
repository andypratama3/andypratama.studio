"use client"

import * as React from "react"
import { useTheme } from "next-themes"

/** Dev-only: fills window.__wiring for /dev/wiring probes. */
export function WiringProbe() {
  const { resolvedTheme, theme } = useTheme()

  React.useEffect(() => {
    if (process.env.NODE_ENV === "production") return

    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches

    window.__wiring = {
      theme: resolvedTheme ?? theme ?? null,
      motionReduced: reduce,
      lenis: document.documentElement.getAttribute("data-smooth-scroll"),
      gsapPlugins: false,
      unicorn:
        document.querySelector("[data-hero-scene]")?.getAttribute("data-hero-scene") ??
        "skipped",
      analytics: Boolean(
        (window as Window & { umami?: unknown; plausible?: unknown }).umami ||
          (window as Window & { plausible?: unknown }).plausible
      ),
    }
  }, [resolvedTheme, theme])

  return null
}
