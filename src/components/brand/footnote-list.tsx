import { ArrowUp } from "lucide-react"
import { facts, type Fact, type FactId } from "@/content/facts"
import { cn } from "@/lib/utils"

export interface FootnoteListProps {
  ids: FactId[]
  title: string
  statedLabel: string
  verifiedLabel: string
  locale: "en" | "id"
  captions?: Partial<Record<FactId, string>>
  className?: string
}

const SUPER = ["¹", "²", "³", "⁴", "⁵", "⁶"] as const

/**
 * Numbered notes from facts.ts (note + status + verifiedAt).
 * Default: show stated vs verified openly (Owner §9).
 */
export function FootnoteList({
  ids,
  title,
  statedLabel,
  verifiedLabel,
  locale,
  captions,
  className,
}: FootnoteListProps) {
  const entries: Array<{ id: FactId; index: number; fact: Fact }> = []

  for (const id of ids) {
    const fact = facts[id] as Fact
    if (!fact || fact.status === "unverified" || !fact.value) continue
    entries.push({ id, index: entries.length, fact })
  }

  if (entries.length === 0) return null

  return (
    <section
      aria-labelledby="footnotes-heading"
      className={cn("border-t border-border pt-8", className)}
    >
      <h2 id="footnotes-heading" className="text-sm text-muted-foreground">
        {title}
      </h2>
      <ol className="mt-5 grid grid-cols-1 divide-y divide-border border-y border-border sm:grid-cols-3 sm:divide-x sm:divide-y-0">
        {entries.map(({ id, index, fact }) => {
          const statusLabel =
            fact.status === "verified" ? verifiedLabel : statedLabel
          const caption = captions?.[id] ?? fact.publicNote?.[locale]
          return (
            <li key={id} id={`fn-${id}`} className="scroll-anchor py-5 sm:px-6 sm:first:pl-0 sm:last:pr-0">
              <div className="flex items-baseline justify-between gap-3">
                <p className="text-[clamp(1.75rem,3vw,2.4rem)] font-medium leading-none tracking-[-0.04em] text-foreground tabular-nums">
                  <span className="mr-1 align-super text-[0.45em] font-medium text-muted-foreground">
                    {SUPER[index] ?? `${index + 1}.`}
                  </span>
                  {fact.value}
                </p>
                <a
                  href={`#stat-${id}`}
                  aria-label={`${title} ${index + 1}`}
                  className="inline-flex size-8 items-center justify-center rounded-full border border-border text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                >
                  <ArrowUp aria-hidden className="size-3.5" />
                </a>
              </div>
              {caption ? (
                <p className="mt-3 max-w-[28ch] text-sm leading-snug text-foreground">{caption}</p>
              ) : null}
              <p className="mt-2 text-sm leading-snug text-muted-foreground">
                {statusLabel}
                {fact.verifiedAt ? <span className="tabular-nums"> · {fact.verifiedAt}</span> : null}
              </p>
            </li>
          )
        })}
      </ol>
    </section>
  )
}
