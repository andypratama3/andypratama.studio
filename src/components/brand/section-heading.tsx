import * as React from "react"
import { Kicker } from "@/components/brand/kicker"
import { cn } from "@/lib/utils"

export interface SectionHeadingProps {
  kicker?: React.ReactNode
  title: React.ReactNode
  description?: React.ReactNode
  action?: React.ReactNode
  className?: string
  titleId?: string
  align?: "left" | "center"
  /** Page hero uses h1; in-page sections use h2 (default). */
  titleAs?: "h1" | "h2"
}

export function SectionHeading({
  kicker,
  title,
  description,
  action,
  className,
  titleId,
  align = "left",
  titleAs: TitleTag = "h2",
}: SectionHeadingProps) {
  const centered = align === "center"

  return (
    <div
      className={cn(
        "flex flex-col gap-5",
        centered
          ? "items-center text-center"
          : "sm:flex-row sm:items-end sm:justify-between sm:gap-8",
        className
      )}
    >
      <div
        className={cn(
          "space-y-3",
          centered ? "mx-auto w-full max-w-2xl" : "w-full max-w-2xl",
        )}
      >
        {kicker ? <Kicker className={centered ? "mb-0" : undefined}>{kicker}</Kicker> : null}
        <TitleTag
          id={titleId}
          className="text-display text-title-measure text-balance text-foreground"
        >
          {title}
        </TitleTag>
        {description ? (
          <p className="text-body-measure text-pretty text-base leading-relaxed text-muted-foreground">
            {description}
          </p>
        ) : null}
      </div>
      {action ? <div className="w-full shrink-0 sm:w-auto">{action}</div> : null}
    </div>
  )
}
