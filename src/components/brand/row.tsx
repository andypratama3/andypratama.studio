import { ArrowUpRight } from "lucide-react"
import { Link } from "@/lib/navigation"
import { cn } from "@/lib/utils"

export interface RowProps {
  index: string
  title: string
  description: string
  href: string
  className?: string
}

/** Numbered typographic row — replaces 3 equal feature cards. */
export function Row({ index, title, description, href, className }: RowProps) {
  return (
    <Link
      href={href}
      className={cn(
        "group reveal-line grid min-h-11 grid-cols-1 gap-3 border-b border-border py-7 first:border-t focus-visible:rounded-[calc(var(--radius)*1.25)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-4 focus-visible:ring-offset-background active:translate-y-px sm:grid-cols-12 sm:items-baseline sm:gap-6 sm:py-9",
        className
      )}
    >
      <span className="text-label tabular-nums text-muted-foreground sm:col-span-1">
        {index}
      </span>
      <span className="text-section relative text-foreground transition-colors group-hover:text-brand sm:col-span-4">
        {title}
        <span
          aria-hidden
          className="link-rule absolute -bottom-1 left-0 hidden h-px w-full origin-left scale-x-0 bg-brand transition-transform duration-300 ease-out group-hover:scale-x-100 group-focus-visible:scale-x-100 sm:block"
        />
      </span>
      <span className="text-body-measure text-base leading-relaxed text-muted-foreground sm:col-span-6">
        {description}
      </span>
      <span className="hidden sm:col-span-1 sm:flex sm:justify-end">
        <ArrowUpRight
          className="size-4 text-muted-foreground transition-transform duration-300 ease-out group-hover:translate-x-1 group-hover:-translate-y-0.5 group-hover:text-brand"
          aria-hidden
        />
      </span>
    </Link>
  )
}
