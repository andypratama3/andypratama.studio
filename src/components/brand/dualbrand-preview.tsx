import * as React from "react"
import { Stagger } from "@/components/brand/reveal"
import { cn } from "@/lib/utils"

export interface DualBrandPreviewProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  lead: string
  items: string[]
  className?: string
}

/**
 * Neutral product preview block for DualBrand.
 * No browser chrome, no fake URLs, no lock icons.
 */
export function DualBrandPreview({
  title,
  lead,
  items,
  className,
  ...props
}: DualBrandPreviewProps) {
  return (
    <div
      className={cn(
        "panel-soft relative w-full overflow-hidden select-none",
        className
      )}
      {...props}
    >
      <span aria-hidden className="absolute inset-x-0 top-0 h-1 rounded-t-[1.75rem] bg-brand" />
      <div className="flex flex-col gap-6 p-6 sm:p-8">
        <div className="space-y-2">
          <p className="text-section font-semibold leading-snug text-foreground">
            {title}
          </p>
          <p className="text-sm leading-relaxed text-secondary-foreground/80">
            {lead}
          </p>
        </div>
        {items.length > 0 ? (
          <ul className="divide-y divide-border border-t border-border">
            <Stagger as="li" stepMs={80} className="flex items-center gap-3 py-3 text-sm text-secondary-foreground">
              {items.map((item) => (
                <React.Fragment key={item}>
                  <span
                    aria-hidden
                    className="size-1.5 shrink-0 rounded-full bg-brand"
                  />
                  {item}
                </React.Fragment>
              ))}
            </Stagger>
          </ul>
        ) : null}
      </div>
    </div>
  )
}
