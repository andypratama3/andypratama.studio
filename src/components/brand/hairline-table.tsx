import * as React from "react"
import { Stagger } from "@/components/brand/reveal"
import { cn } from "@/lib/utils"

export type HairlineRow = {
  name: string
  type: string
  built: string
  period?: string
}

export interface HairlineTableProps {
  columns: {
    name: string
    type: string
    built: string
    period?: string
  }
  rows: HairlineRow[]
  className?: string
}

export function HairlineTable({ columns, rows, className }: HairlineTableProps) {
  const showPeriod = columns.period !== undefined
  return (
    <div className={cn("w-full", className)}>
      {/* Desktop table */}
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[42rem] text-left text-sm">
          <thead>
            <tr className="border-b border-border text-label text-muted-foreground">
              <th className="pb-3 pr-4 font-semibold">{columns.name}</th>
              <th className="pb-3 pr-4 font-semibold">{columns.type}</th>
              <th className={cn("pb-3 font-semibold", showPeriod && "pr-4")}>{columns.built}</th>
              {showPeriod ? (
                <th className="pb-3 text-right font-semibold">{columns.period}</th>
              ) : null}
            </tr>
          </thead>
          <tbody>
            <Stagger as="tr" className="border-b border-border/70 transition-colors hover:bg-muted/30" stepMs={70}>
            {rows.map((row) => (
              <React.Fragment key={row.name}>
                <td className="py-5 pr-4 font-medium tracking-tight text-foreground">
                  {row.name}
                </td>
                <td className="py-5 pr-4 text-muted-foreground">{row.type}</td>
                <td className={cn("py-5 text-muted-foreground", showPeriod && "pr-4")}>{row.built}</td>
                {showPeriod ? (
                  <td className="py-4 text-right text-xs tabular-nums text-muted-foreground">
                    {row.period}
                  </td>
                ) : null}
              </React.Fragment>
            ))}
            </Stagger>
          </tbody>
        </table>
      </div>

      {/* Mobile stacked list */}
      <ul className="divide-y divide-border border-y border-border md:hidden">
        <Stagger as="li" stepMs={70}>
        {rows.map((row) => (
          <div key={row.name} className="space-y-1.5 py-4">
            <div className="flex items-baseline justify-between gap-3">
              <p className="font-medium tracking-tight text-foreground">
                {row.name}
              </p>
              {showPeriod && row.period ? (
                <p className="text-label shrink-0 tabular-nums text-muted-foreground">
                  {row.period}
                </p>
              ) : null}
            </div>
            <p className="text-sm text-muted-foreground">{row.type}</p>
            <p className="text-sm text-muted-foreground">{row.built}</p>
          </div>
        ))}
        </Stagger>
      </ul>
    </div>
  )
}
