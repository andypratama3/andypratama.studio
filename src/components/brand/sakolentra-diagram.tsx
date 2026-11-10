"use client"

import * as React from "react"
import {
  CreditCard,
  FileSpreadsheet,
  MessageSquare,
  RefreshCw,
} from "lucide-react"
import { m, useReducedMotion } from "motion/react"
import { motionTokens } from "@/lib/motion"
import { cn } from "@/lib/utils"

export type SakolentraFlowNode = {
  step: string
  title: string
  description: string
}

export interface SakolentraDiagramProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
  title?: string
  subtitle?: string
  badge?: string
  footer?: string
  nodes?: SakolentraFlowNode[]
}

const icons = [FileSpreadsheet, CreditCard, RefreshCw, MessageSquare] as const

/**
 * Selectable flow. Full labels — no truncated percentages or invented coverage.
 */
export function SakolentraDiagram({
  className,
  title = "SAKOLENTRA",
  subtitle = "",
  badge = "",
  footer = "",
  nodes = [],
  ...props
}: SakolentraDiagramProps) {
  const displayNodes = nodes.slice(0, 4)
  const baseId = React.useId()
  const reduce = useReducedMotion()
  const [active, setActive] = React.useState(0)

  if (displayNodes.length === 0) return null

  const count = displayNodes.length
  const selected = Math.min(active, count - 1)

  function move(from: number, direction: 1 | -1) {
    const next = (from + direction + count) % count
    setActive(next)
    document.getElementById(`${baseId}-step-${next}`)?.focus()
  }

  return (
    <div
      className={cn(
        "panel-soft relative w-full p-4 sm:p-6",
        className
      )}
      {...props}
    >
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3">
        <div className="space-y-0.5">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-foreground">
            {title}
          </p>
          {subtitle ? (
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          ) : null}
        </div>
        {badge ? (
          <span className="inline-flex items-center gap-2 text-xs text-muted-foreground">
            <span className="size-1.5 rounded-full bg-brand" />
            {badge}
          </span>
        ) : null}
      </div>

      <div
        role="radiogroup"
        aria-label={subtitle || title}
        className="grid grid-cols-1 gap-3 pt-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        {displayNodes.map((node, index) => {
          const Icon = icons[index] ?? FileSpreadsheet
          const checked = selected === index
          return (
            <m.button
              key={node.step}
              id={`${baseId}-step-${index}`}
              type="button"
              role="radio"
              aria-checked={checked}
              tabIndex={checked ? 0 : -1}
              onClick={() => setActive(index)}
              onKeyDown={(event) => {
                if (event.key === "ArrowRight" || event.key === "ArrowDown") {
                  event.preventDefault()
                  move(index, 1)
                }
                if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
                  event.preventDefault()
                  move(index, -1)
                }
              }}
              whileHover={reduce === false ? { y: -2 } : undefined}
              whileTap={reduce === false ? { y: 0 } : undefined}
              transition={{ duration: motionTokens.fast, ease: motionTokens.ease }}
              className={cn(
                "flow-card flex min-h-11 flex-col gap-3 rounded-[1.35rem] border bg-card/90 p-4 text-left shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand",
                checked
                  ? "border-brand bg-secondary shadow-[0_10px_28px_color-mix(in_oklab,var(--brand)_14%,transparent)]"
                  : "border-border/80"
              )}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-[0.16em] text-brand">
                  {node.step}
                </span>
                <Icon className="size-4 text-muted-foreground" aria-hidden />
              </div>
              <span className="text-sm font-semibold tracking-tight text-foreground">
                {node.title}
              </span>
              <span className="text-xs leading-relaxed text-muted-foreground">
                {node.description}
              </span>
            </m.button>
          )
        })}
      </div>

      {footer ? (
        <div className="mt-4 border-t border-border pt-3 text-xs text-muted-foreground">
          {footer}
        </div>
      ) : null}
    </div>
  )
}
