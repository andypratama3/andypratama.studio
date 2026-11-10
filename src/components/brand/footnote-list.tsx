import { ArrowUp } from "lucide-react"
import { facts, type Fact, type FactId } from "@/content/facts"
import { cn } from "@/lib/utils"

export interface FootnoteListProps {
  ids: FactId[]
  title: string
  statedLabel: string
  verifiedLabel: string
  locale: "en" | "id"
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
      <h2 id="footnotes-heading" className="text-label text-muted-foreground">
        {title}
      </h2>
      <ol className="mt-4 space-y-3 text-sm leading-relaxed text-muted-foreground">
        {entries.map(({ id, index, fact }) => {
          const statusLabel =
            fact.status === "verified" ? verifiedLabel : statedLabel
          return (
            <li key={id} id={`fn-${id}`} className="scroll-anchor">
              <span className="mr-1.5 tabular-nums text-foreground">
                {SUPER[index] ?? `${index + 1}.`}
              </span>
              <span className="text-foreground tabular-nums">{fact.value}</span>
              {" — "}
              <span className="text-label text-brand">{statusLabel}</span>
              {fact.verifiedAt ? (
                <span className="tabular-nums"> · {fact.verifiedAt}</span>
              ) : null}
              {fact.publicNote?.[locale] ? (
                <span> · {fact.publicNote[locale]}</span>
              ) : null}
              <a
                href={`#stat-${id}`}
                aria-label={`${title} ${index + 1}`}
                className="ml-2 inline-flex min-h-11 min-w-11 items-center justify-center text-xs text-muted-foreground underline-offset-2 hover:text-brand hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
              >
                <ArrowUp aria-hidden className="size-3.5" />
              </a>
            </li>
          )
        })}
      </ol>
    </section>
  )
}
