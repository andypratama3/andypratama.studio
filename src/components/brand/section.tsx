import * as React from "react"
import { cn } from "@/lib/utils"

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  as?: React.ElementType
  /** Emphasis rhythm: py-32 (mobile py-16 stays). Default: py-24 / py-16. */
  emphasis?: boolean
  /** FloatingNav surface adaptation (Velto). */
  navTheme?: "light" | "dark"
}

export function Section({
  as: Component = "section",
  className,
  emphasis = false,
  navTheme,
  children,
  ...props
}: SectionProps) {
  return (
    <Component
      className={cn(
        "scroll-anchor",
        emphasis ? "py-16 md:py-32" : "py-16 md:py-24",
        className
      )}
      data-nav-theme={navTheme}
      {...props}
    >
      {children}
    </Component>
  )
}
