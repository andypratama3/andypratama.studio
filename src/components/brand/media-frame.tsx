"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

/**
 * Interactive media/project frame. Hover/focus zooms media inside overflow.
 * Touch devices keep content readable without hover dependency.
 */
export function MediaFrame({
  children,
  className,
  overlay,
}: {
  children: React.ReactNode
  className?: string
  overlay?: React.ReactNode
}) {
  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-[1.75rem] border border-border/70 bg-secondary focus-within:ring-2 focus-within:ring-brand",
        className
      )}
    >
      <div className="media-zoom overflow-hidden">
        <div className="media-zoom-inner">
          {children}
        </div>
      </div>
      {overlay ? (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-surface-contrast/55 via-surface-contrast/10 to-transparent p-5 opacity-100 sm:opacity-0 sm:transition-opacity sm:duration-300 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100">
          {overlay}
        </div>
      ) : null}
    </div>
  )
}
