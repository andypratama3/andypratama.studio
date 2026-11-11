import type { ReactNode } from "react"
import { Reveal } from "@/components/brand/reveal"
import { cn } from "@/lib/utils"

export interface ChapterSpec {
  id?: string
  label: string
  value: ReactNode
}

/**
 * One chapter in the FIELD rhythm: roman eyebrow, display title, then a spec list.
 * `side` parks the card on the left or the right of the section.
 */
export function ChapterCard({
  index,
  eyebrow,
  title,
  description,
  side = "left",
  spec,
  children,
  className,
}: {
  index: string
  eyebrow: string
  title: string
  description?: string
  side?: "left" | "right"
  spec?: ChapterSpec[]
  children?: ReactNode
  className?: string
}) {
  return (
    <div className={cn("flex", side === "right" ? "lg:justify-end" : "lg:justify-start", className)}>
      <div className="w-full max-w-xl">
        <Reveal>
          <p className="text-xs tracking-[0.16em] text-muted-foreground">
            <span className="font-medium tracking-normal text-foreground">{index}</span>
            <span aria-hidden> — </span>
            {eyebrow}
          </p>
        </Reveal>
        <Reveal delayMs={90}>
          <h2 className="text-display mt-5 text-balance text-foreground">{title}</h2>
        </Reveal>
        {description ? (
          <Reveal delayMs={160}>
            <p className="mt-4 max-w-[42ch] text-pretty text-base leading-relaxed text-muted-foreground">
              {description}
            </p>
          </Reveal>
        ) : null}
        {spec && spec.length > 0 ? (
          <dl className="mt-8 border-t border-border">
            {spec.map((row, i) => (
              <Reveal
                key={row.id ?? row.label}
                id={row.id}
                delayMs={i * 60}
                className="scroll-anchor flex items-baseline justify-between gap-6 border-b border-border py-3.5"
              >
                <dt className="text-sm leading-snug text-muted-foreground">{row.label}</dt>
                <dd className="shrink-0 text-right text-lg font-medium tabular-nums text-foreground">
                  {row.value}
                </dd>
              </Reveal>
            ))}
          </dl>
        ) : null}
        {children ? <div className="mt-6">{children}</div> : null}
      </div>
    </div>
  )
}
