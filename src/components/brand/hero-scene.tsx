import * as React from "react"
import { HeroVisual } from "@/components/brand/hero-visual"
import { cn } from "@/lib/utils"

export interface HeroSceneProps extends React.HTMLAttributes<HTMLDivElement> {
  projectId?: string
}

const PLACEHOLDER_IDS = new Set(["", "dev-unicorn-project-id"])

/**
 * Full-bleed hero scene slot.
 * Docs: https://www.unicorn.studio/docs/getting-started/
 * Embed: unicornstudio-react/next + variables brandColor / Light+Dark (F2-06).
 */
export function HeroScene({
  projectId,
  className,
  children,
  ...props
}: HeroSceneProps) {
  const hasRealProject =
    typeof projectId === "string" && !PLACEHOLDER_IDS.has(projectId)

  return (
    <div
      className={cn("relative isolate min-h-[100svh] w-full", className)}
      data-hero-scene={hasRealProject ? "unicorn-pending" : "static-fallback"}
      data-us-project={hasRealProject ? projectId : undefined}
      {...props}
    >
      <HeroVisual />
      <div className="relative z-10 flex min-h-[100svh] flex-col">{children}</div>
    </div>
  )
}
