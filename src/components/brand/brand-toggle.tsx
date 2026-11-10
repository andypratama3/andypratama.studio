"use client"

import * as React from "react"
import Image from "next/image"
import { useTranslations } from "next-intl"
import { cn } from "@/lib/utils"

export interface BrandToggleOption {
  id: string
  label: string
  src: string
  alt: string
}

export interface BrandToggleProps {
  options: BrandToggleOption[]
  className?: string
}

/**
 * Segmented Holding / A / B viewer. Renders nothing without real images.
 * Single option → static image (no stock placeholders).
 */
export function BrandToggle({ options, className }: BrandToggleProps) {
  const t = useTranslations("brandToggle")
  const real = options.filter((o) => Boolean(o.src))
  const [active, setActive] = React.useState(real[0]?.id ?? "")

  if (real.length === 0) return null

  const current = real.find((o) => o.id === active) ?? real[0]

  return (
    <div className={cn("space-y-4", className)}>
      {real.length > 1 ? (
        <div
          role="group"
          aria-label={t("groupLabel")}
          className="inline-flex rounded-full border border-border bg-muted/60 p-1"
        >
          {real.map((option) => {
            const pressed = option.id === current.id
            return (
              <button
                key={option.id}
                type="button"
                aria-pressed={pressed}
                onClick={() => setActive(option.id)}
                className={cn(
                  "min-h-11 rounded-full px-4 text-xs font-medium transition-colors duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand sm:text-sm",
                  pressed
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {option.label}
              </button>
            )
          })}
        </div>
      ) : null}

      <div className="relative aspect-[16/10] overflow-hidden rounded-[calc(var(--radius)*2)] border border-border bg-muted">
        <Image
          key={current.id}
          src={current.src}
          alt={current.alt}
          fill
          sizes="(max-width: 768px) 100vw, 640px"
          className="object-cover"
        />
      </div>
    </div>
  )
}
