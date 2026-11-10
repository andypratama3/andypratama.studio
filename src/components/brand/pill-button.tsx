import * as React from "react"
import { buttonVariants } from "@/components/ui/button"
import { Link } from "@/i18n/routing"
import { cn } from "@/lib/utils"
import type { VariantProps } from "class-variance-authority"
import type { ComponentProps } from "react"

type ButtonVariantProps = VariantProps<typeof buttonVariants>

type InternalProps = Omit<ComponentProps<typeof Link>, "href"> & {
  href: string
  variant?: "primary" | "secondary"
  size?: ButtonVariantProps["size"]
  external?: false
}

type ExternalProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string
  variant?: "primary" | "secondary"
  size?: ButtonVariantProps["size"]
  external: true
}

export type PillButtonProps = InternalProps | ExternalProps

/** Rounded-full CTA. Uses next-intl Link for internal routes; plain anchor for external. */
export function PillButton({
  href,
  className,
  variant = "primary",
  size = "lg",
  external,
  children,
  ...props
}: PillButtonProps) {
  const isExternal = external === true || /^https?:\/\//.test(href)
  const classes = cn(
    buttonVariants({
      variant: variant === "primary" ? "default" : "outline",
      size,
    }),
    "inline-flex h-11 min-h-11 rounded-full px-6 font-medium",
    variant === "primary" &&
      "bg-primary text-primary-foreground hover:bg-primary/90",
    className
  )

  if (isExternal) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={classes}
        {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {children}
      </a>
    )
  }

  return (
    <Link href={href} className={classes} {...(props as Omit<ComponentProps<typeof Link>, "href">)}>
      {children}
    </Link>
  )
}
