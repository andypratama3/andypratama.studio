import * as React from "react"
import { cn } from "@/lib/utils"

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: React.ElementType
}

/** Standard content width: 1200px, inline pad clamp(20px, 4vw, 40px). */
export function Container({
  as: Component = "div",
  className,
  children,
  ...props
}: ContainerProps) {
  return (
    <Component
      className={cn(
        "mx-auto w-full max-w-[1200px] px-[clamp(20px,4vw,40px)]",
        className
      )}
      {...props}
    >
      {children}
    </Component>
  )
}

/** Wide media / hero shell: 1440px. */
export function ContainerWide({
  as: Component = "div",
  className,
  children,
  ...props
}: ContainerProps) {
  return (
    <Component
      className={cn(
        "mx-auto w-full max-w-[1440px] px-[clamp(20px,4vw,40px)]",
        className
      )}
      {...props}
    >
      {children}
    </Component>
  )
}
