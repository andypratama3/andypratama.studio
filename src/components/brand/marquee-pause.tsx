"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"

import { useMotionOk } from "@/components/brand/use-motion-ok"

const PAUSED = "paused"

export function setMotionPaused(paused: boolean) {
  document.documentElement.toggleAttribute("data-motion", false)
  if (paused) document.documentElement.setAttribute("data-motion", PAUSED)
  else document.documentElement.removeAttribute("data-motion")
}

/**
 * Uses the existing Pause / Play strings. Renders nothing when motion is
 * reduced, so the reduced-motion text dump stays unchanged.
 */
export function MarqueePause() {
  const t = useTranslations("common")
  const motionOk = useMotionOk()
  const [paused, setPaused] = useState(false)

  if (!motionOk) return null

  return (
    <button
      type="button"
      aria-pressed={paused}
      aria-label={paused ? t("marqueePlay") : t("marqueePause")}
      className="absolute top-1/2 right-[max(0.75rem,env(safe-area-inset-right))] z-10 inline-flex min-h-11 -translate-y-1/2 items-center rounded-full border border-border bg-background/90 px-3.5 text-label text-muted-foreground shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand active:scale-[0.97]"
      style={{ transition: "transform var(--dur-press) var(--ease-out)" }}
      onClick={() => {
        const next = !paused
        setPaused(next)
        setMotionPaused(next)
      }}
    >
      {paused ? t("play") : t("pause")}
    </button>
  )
}
