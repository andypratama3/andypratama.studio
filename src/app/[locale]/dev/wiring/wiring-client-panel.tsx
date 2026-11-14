"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import { useLocale } from "next-intl"
import { track } from "@/lib/events"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const subscribeToClient = () => () => {}

function useIsMounted() {
  return React.useSyncExternalStore(
    subscribeToClient,
    () => true,
    () => false
  )
}

export function WiringClientPanel() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const locale = useLocale()
  const mounted = useIsMounted()
  const [probe, setProbe] = React.useState<string>("(not read)")

  const activeTheme = mounted ? (resolvedTheme ?? theme ?? "—") : "—"

  function readProbe() {
    setProbe(JSON.stringify(window.__wiring ?? {}, null, 2))
  }

  return (
    <section aria-labelledby="runtime-heading" className="space-y-4 border-t border-border pt-8">
      <h2 id="runtime-heading" className="text-section text-foreground">
        Runtime probes
      </h2>
      <p className="text-sm text-muted-foreground">
        Locale: <span className="text-foreground">{locale}</span> · Theme:{" "}
        <span className="text-foreground">{activeTheme}</span>
        {mounted ? null : " (hydrating…)"}
      </p>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          className={cn(buttonVariants({ size: "sm" }), "h-11 rounded-full px-4")}
          onClick={() => setTheme("light")}
        >
          Theme light
        </button>
        <button
          type="button"
          className={cn(buttonVariants({ size: "sm" }), "h-11 rounded-full px-4")}
          onClick={() => setTheme("dark")}
        >
          Theme dark
        </button>
        <button
          type="button"
          className={cn(buttonVariants({ size: "sm" }), "h-11 rounded-full px-4")}
          onClick={() => setTheme("system")}
        >
          Theme system
        </button>
        <button
          type="button"
          className={cn(
            buttonVariants({ variant: "outline", size: "sm" }),
            "h-11 rounded-full px-4"
          )}
          onClick={() => {
            track("final_cta_click", { source: "dev-wiring" })
            readProbe()
          }}
        >
          track() + read __wiring
        </button>
      </div>
      <pre className="overflow-x-auto border border-border bg-muted/40 p-4 text-xs text-foreground">
        {probe}
      </pre>
    </section>
  )
}
