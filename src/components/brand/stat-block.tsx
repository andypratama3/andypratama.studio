import { Fact } from "@/components/brand/fact"
import { facts, type FactId } from "@/content/facts"
import { cn } from "@/lib/utils"

export interface StatBlockProps {
  id: FactId
  label: string
  className?: string
  valueClassName?: string
}

/** Giant fact + label. Renders nothing for unverified / empty facts. */
export function StatBlock({
  id,
  label,
  className,
  valueClassName,
}: StatBlockProps) {
  const fact = facts[id]
  if (!fact || fact.status === "unverified" || !fact.value) {
    return null
  }

  return (
    <div className={cn("space-y-2", className)}>
      <p
        className={cn(
          "text-display tabular-nums tracking-tight text-primary",
          valueClassName
        )}
      >
        <Fact id={id} />
      </p>
      <p className="text-body-measure text-sm leading-snug text-muted-foreground">
        {label}
      </p>
    </div>
  )
}
