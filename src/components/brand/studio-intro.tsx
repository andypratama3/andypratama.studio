"use client"

import * as React from "react"
import { useTranslations } from "next-intl"

import { useMotionOk } from "@/components/brand/use-motion-ok"

const STORAGE_KEY = "studio-intro-seen"

export function StudioIntro() {
  const t = useTranslations("home.hero")
  const motionOk = useMotionOk()
  const [visible, setVisible] = React.useState(false)

  React.useEffect(() => {
    if (!motionOk) return
    try {
      if (sessionStorage.getItem(STORAGE_KEY) === "1") return
    } catch {
      return
    }
    setVisible(true)
    const timer = window.setTimeout(dismiss, 1100)
    return () => window.clearTimeout(timer)
  }, [motionOk])

  function dismiss() {
    try {
      sessionStorage.setItem(STORAGE_KEY, "1")
    } catch {
      /* private mode */
    }
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="surface-invert fixed inset-0 z-[var(--z-overlay)] flex items-center justify-center">
      <p className="flex items-center gap-[0.14em] text-[clamp(4rem,12vw,7rem)] font-semibold tracking-[-0.06em] text-surface-contrast-foreground">
        <span>A</span>
        <span aria-hidden className="inline-block size-[0.38em] rotate-45 border-2 border-brand-on-dark" />
        <span>P</span>
      </p>
      <button
        type="button"
        onClick={dismiss}
        className="absolute bottom-8 inline-flex min-h-11 items-center rounded-full px-4 text-sm text-surface-contrast-foreground/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
      >
        {t("skipIntro")}
      </button>
    </div>
  )
}
