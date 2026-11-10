"use client"

import { useLocale } from "next-intl"
import { cn } from "@/lib/utils"

export interface SkipLinkProps {
  href?: string
  className?: string
}

/** First focusable control — jumps to #main (Lampiran D.3.1). */
export function SkipLink({ href = "#main", className }: SkipLinkProps) {
  const locale = useLocale()
  const label = locale === "id" ? "Lompat ke konten" : "Skip to content"

  return (
    <a
      href={href}
      className={cn(
        "bg-background text-foreground border-border focus-visible:ring-ring",
        "sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[var(--z-toast)]",
        "focus:rounded-md focus:border focus:px-4 focus:py-2.5 focus:text-sm focus:font-medium",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
        className
      )}
    >
      {label}
    </a>
  )
}
