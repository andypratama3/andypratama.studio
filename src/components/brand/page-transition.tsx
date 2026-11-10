import type { ReactNode } from "react"
import { ViewTransition } from "react"

/**
 * Route enter/exit crossfade (Next 16 / React 19.3 ViewTransition).
 * Place around page content — not in a persistent layout shell alone.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  return (
    <ViewTransition enter="auto" exit="auto" default="none">
      {children}
    </ViewTransition>
  )
}
