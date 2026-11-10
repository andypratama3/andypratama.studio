"use client"

import * as React from "react"
import { useTranslations } from "next-intl"
import { cn } from "@/lib/utils"

export interface WordmarkMarqueeProps {
  text: string
  className?: string
}

/**
 * Giant Inter wordmark. CSS marquee with pause control.
 * Static when prefers-reduced-motion.
 */
export function WordmarkMarquee({ text, className }: WordmarkMarqueeProps) {
  const t = useTranslations("common")
  const parts = text.trim().split(/\s+/)
  const lineOne = parts[0] ?? text
  const lineTwo = parts.slice(1).join(" ")
  const [paused, setPaused] = React.useState(false)

  // useSyncExternalStore: SSR snapshot = false (no window), client = real value.
  // This avoids hydration mismatch for users with prefers-reduced-motion.
  const reduce = React.useSyncExternalStore(
    (callback) => {
      const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
      mq.addEventListener("change", callback)
      return () => mq.removeEventListener("change", callback)
    },
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false
  )

  return (
    <div className={className}>
      <div className="relative">
        <p
          className="text-wordmark-compact px-[clamp(20px,4vw,40px)] text-center sm:hidden"
          aria-hidden="true"
        >
          <span className="block">{lineOne}</span>
          {lineTwo ? <span className="block">{lineTwo}</span> : null}
        </p>
        <p
          className={cn(
            "text-wordmark px-[clamp(20px,4vw,40px)] max-sm:sr-only",
            !reduce && "sr-only"
          )}
        >
          {text}
        </p>
        {!reduce ? (
          <div className="hidden items-end gap-4 px-[clamp(20px,4vw,40px)] sm:flex">
            <div className="edge-fade-x min-w-0 flex-1 overflow-hidden select-none" aria-hidden="true">
              <div
                className={cn(
                  "animate-wordmark-marquee flex w-max items-center whitespace-nowrap",
                  !paused && "will-change-transform"
                )}
                style={{ animationPlayState: paused ? "paused" : "running" }}
              >
                <span className="text-wordmark pr-[0.12em]">{text}</span>
                <span className="text-wordmark pr-[0.12em]">{text}</span>
              </div>
            </div>
            <button
              type="button"
              className="mb-2 inline-flex min-h-11 shrink-0 items-center rounded-full border border-surface-contrast-foreground/25 bg-surface-contrast/90 px-3.5 text-label text-surface-contrast-foreground/70 shadow-sm backdrop-blur-sm transition-[transform,background-color,color] duration-200 ease-out hover:bg-surface-contrast hover:text-surface-contrast-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand active:scale-[0.97]"
              onClick={() => setPaused((p) => !p)}
              aria-pressed={paused}
              aria-label={paused ? t("marqueePlay") : t("marqueePause")}
            >
              {paused ? t("play") : t("pause")}
            </button>
          </div>
        ) : null}
      </div>
    </div>
  )
}
