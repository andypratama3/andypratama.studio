import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

/** Finished empty state — honest, not broken-looking. */
export function EmptyPanel({
  status,
  title,
  description,
  action,
  className,
}: {
  status?: string
  title: string
  description: string
  action?: ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        "panel-soft flex min-h-[16rem] flex-col justify-between gap-8 p-6 sm:min-h-[18rem] sm:p-8",
        className
      )}
    >
      <div className="space-y-3">
        {status ? (
          <p className="inline-flex items-center gap-2 text-sm text-muted-foreground">
            <span aria-hidden className="size-1.5 rounded-full bg-brand" />
            {status}
          </p>
        ) : null}
        <p className="text-section text-foreground">{title}</p>
        <p className="max-w-md text-sm leading-relaxed text-muted-foreground">{description}</p>
      </div>
      {action ? <div className="flex flex-wrap gap-3">{action}</div> : null}
    </div>
  )
}
