"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export interface DualBrandLayer {
  id: string
  label: string
}

export interface DualBrandStageProps {
  groupLabel: string
  layers: DualBrandLayer[]
  title: string
  lead: string
  items: string[]
  className?: string
}

export function DualBrandStage({
  groupLabel,
  layers,
  title,
  lead,
  items,
  className,
}: DualBrandStageProps) {
  const [active, setActive] = React.useState(layers[0]?.id ?? "")
  const current = layers.find((layer) => layer.id === active) ?? layers[0]

  if (!current) return null

  return (
    <div className={cn("panel-soft relative w-full overflow-hidden", className)}>
      <span aria-hidden className="absolute inset-x-0 top-0 h-1 bg-brand" />
      <div className="flex flex-col gap-6 p-6 sm:p-8">
        <div
          role="radiogroup"
          aria-label={groupLabel}
          className="grid grid-cols-3 gap-2"
        >
          {layers.map((layer) => {
            const selected = layer.id === current.id
            return (
              <button
                key={layer.id}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => setActive(layer.id)}
                className={cn(
                  "flex min-h-11 flex-col justify-end rounded-2xl border px-3 py-3 text-left transition-[border-color,background-color,transform] duration-[var(--dur-press)] ease-[var(--ease-out)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand",
                  selected
                    ? "border-brand bg-brand/10 text-foreground"
                    : "border-border bg-background text-muted-foreground"
                )}
              >
                <span
                  aria-hidden
                  className={cn(
                    "mb-3 block h-8 origin-bottom rounded-full bg-brand transition-transform duration-[var(--dur-fast)] ease-[var(--ease-out)]",
                    selected ? "scale-y-100" : "scale-y-50"
                  )}
                />
                <span className="text-sm font-medium leading-snug">{layer.label}</span>
              </button>
            )
          })}
        </div>
        <div className="space-y-2">
          <p className="text-section font-semibold leading-snug text-foreground">{title}</p>
          <p className="text-sm leading-relaxed text-secondary-foreground/80">
            <span className="text-foreground">{current.label}. </span>
            {lead}
          </p>
        </div>
        {items.length > 0 ? (
          <ul className="divide-y divide-border border-t border-border">
            {items.map((item) => (
              <li key={item} className="flex items-center gap-3 py-3 text-sm text-secondary-foreground">
                <span aria-hidden className="size-1.5 shrink-0 rounded-full bg-brand" />
                {item}
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </div>
  )
}
