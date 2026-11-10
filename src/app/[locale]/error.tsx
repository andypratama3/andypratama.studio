"use client"

import { useEffect } from "react"
import Link from "next/link"
import { Container } from "@/components/brand/container"
import { Section } from "@/components/brand/section"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ErrorPageProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    // Log to console in development; replace with error reporting service in Phase 3.
    if (process.env.NODE_ENV !== "production") {
      console.error("[ErrorBoundary]", error)
    }
  }, [error])

  return (
    <Section emphasis navTheme="light" className="border-b border-border">
      <Container className="space-y-6 py-10 sm:py-16">
        <p className="text-label text-brand">500</p>
        <h1 className="text-display text-foreground">Something went wrong</h1>
        <p className="text-body-measure text-muted-foreground">
          An unexpected error occurred. Try again, or head back home.
        </p>
        <div className="flex flex-wrap gap-3 pt-2">
          <button
            type="button"
            onClick={reset}
            className={cn(
              buttonVariants({ size: "lg" }),
              "cta-lift h-11 rounded-full bg-primary px-6 font-medium text-primary-foreground hover:bg-primary/90"
            )}
          >
            Try again
          </button>
          <Link
            href="/"
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "cta-lift h-11 rounded-full px-6"
            )}
          >
            Back home
          </Link>
        </div>
      </Container>
    </Section>
  )
}
