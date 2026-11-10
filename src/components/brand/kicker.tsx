import * as React from "react"
import { cn } from "@/lib/utils"

export interface KickerProps extends React.HTMLAttributes<HTMLParagraphElement> {
  as?: React.ElementType
}

/** Inter uppercase label — not a second mono font (Owner default §9). */
export function Kicker({
  as: Component = "p",
  className,
  children,
  ...props
}: KickerProps) {
  return (
    <Component
      className={cn("text-label mb-3 text-brand", className)}
      {...props}
    >
      {children}
    </Component>
  )
}
