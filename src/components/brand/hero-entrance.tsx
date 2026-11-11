"use client"

import { cn } from "@/lib/utils"

/**
 * Unused. The home entrance is the CSS class `hero-beat`.
 * These stay as plain wrappers so mounting them cannot swap the DOM
 * or start from opacity 0. Do not mount them beside `hero-beat`.
 */
export function HeroEntrance({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return <div className={className}>{children}</div>
}

export function HeroBeat({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
  delay?: number
}) {
  return <div className={cn(className)}>{children}</div>
}
