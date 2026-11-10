import * as React from "react"
import { cn } from "@/lib/utils"

export interface ProseProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: React.ElementType
}

export function Prose({
  as: Component = "div",
  className,
  children,
  ...props
}: ProseProps) {
  return (
    <Component
      className={cn(
        "max-w-prose leading-relaxed text-muted-foreground",
        className
      )}
      {...props}
    >
      {children}
    </Component>
  )
}
