import * as React from "react"
import { ArrowUpRight, Play } from "lucide-react"
import { cn } from "@/lib/utils"

export interface ArrowButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "arrow" | "play"
  asChild?: boolean
}

/** Circular brand action — case study / play. Min 44px touch. */
export function ArrowButton({
  className,
  variant = "arrow",
  type = "button",
  ...props
}: ArrowButtonProps) {
  const Icon = variant === "play" ? Play : ArrowUpRight

  return (
    <button
      type={type}
      className={cn(
        "inline-flex size-11 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition-transform duration-200 ease-out hover:scale-[1.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-[0.98]",
        className
      )}
      {...props}
    >
      <Icon
        className={cn("size-4", variant === "play" && "ml-0.5 fill-current")}
        aria-hidden
      />
    </button>
  )
}
