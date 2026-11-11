import { Fact } from "@/components/brand/fact"
import { TextReveal } from "@/components/brand/reveal"
import { facts, type FactId } from "@/content/facts"
import { cn } from "@/lib/utils"

export interface StatsGridItem {
  id: FactId
  label: string
}

export interface StatsGridProps {
  items: StatsGridItem[]
  className?: string
  /** When true, render ¹ ² ³ linking to #fn-<id> for facts with notes or status. */
  withFootnotes?: boolean
}

const SUPER = ["¹", "²", "³", "⁴", "⁵", "⁶"] as const

function isRenderable(id: FactId) {
  const fact = facts[id]
  return Boolean(fact && fact.status !== "unverified" && fact.value)
}

/** Apple-style "Strength in numbers" strip. Rejects unverified facts. */
export function StatsGrid({
  items,
  className,
  withFootnotes = true,
}: StatsGridProps) {
  const visible = items.filter((item) => isRenderable(item.id))
  if (visible.length === 0) return null

  return (
    <div
      className={cn(
        "grid grid-cols-1 divide-y divide-border sm:grid-cols-3 sm:divide-y-0",
        className
      )}
    >
      {visible.map((item, i) => {
        const mark = withFootnotes ? SUPER[i] : null
        return (
          <div
            key={item.id}
            className={cn(
              "py-8 first:pt-0 last:pb-0 sm:px-8 sm:py-0",
              "text-center sm:text-left",
              i > 0 && "sm:border-l sm:border-border",
              i === 0 && "sm:pl-0",
              i === visible.length - 1 && "sm:pr-0"
            )}
          >
            <TextReveal delayMs={i * 60}>
            <p
              id={`stat-${item.id}`}
              className="text-stat scroll-anchor text-primary tabular-nums"
            >
              <Fact id={item.id} />
              {mark ? (
                <a
                  href={`#fn-${item.id}`}
                  className="ml-1 align-super text-sm font-medium text-muted-foreground no-underline hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                  aria-label={`Note ${i + 1}: ${item.label}`}
                >
                  {mark}
                </a>
              ) : null}
            </p>
            <p className="mx-auto mt-3 max-w-[28ch] text-sm leading-snug text-muted-foreground sm:mx-0">
              {item.label}
            </p>
            </TextReveal>
          </div>
        )
      })}
    </div>
  )
}

/** Fact ids that StatsGrid would footnote, in order. */
export function footnoteIdsFromStats(items: StatsGridItem[]): FactId[] {
  return items.filter((item) => isRenderable(item.id)).map((item) => item.id)
}
