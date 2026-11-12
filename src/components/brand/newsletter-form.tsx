"use client"

import * as React from "react"
import { toast } from "sonner"
import { useLocale, useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { track } from "@/lib/events"
import { Link } from "@/lib/navigation"

export function NewsletterForm({
  placeholder,
  submitLabel,
  privacyNote,
}: {
  placeholder: string
  submitLabel: string
  privacyNote: string
}) {
  const t = useTranslations("newsletterForm")
  const locale = useLocale()
  const [pending, setPending] = React.useState(false)
  const startedAtRef = React.useRef(0)

  React.useEffect(() => {
    startedAtRef.current = Date.now()
  }, [])

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const data = new FormData(form)
    data.set(
      "startedAt",
      String(startedAtRef.current || Date.now())
    )
    setPending(true)
    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        body: data,
      })
      if (res.status === 429) {
        toast.error(t("errorRateLimit"))
        return
      }
      if (!res.ok) {
        toast.error(t("errorSubscribe"))
        return
      }
      track("subscribe_submit", { ok: true })
      toast.success(t("successConfirm"))
      form.reset()
      startedAtRef.current = Date.now()
    } catch {
      toast.error(t("errorNetwork"))
    } finally {
      setPending(false)
    }
  }

  return (
    <div className="space-y-3">
      <form
        onSubmit={onSubmit}
        className="flex w-full flex-col gap-2.5 sm:flex-row sm:items-center"
        noValidate
      >
        <Label className="sr-only" htmlFor="newsletter-email">
          {placeholder}
        </Label>
        <input type="hidden" name="locale" value={locale} />
        <Input
          id="newsletter-email"
          type="email"
          name="email"
          required
          autoComplete="email"
          placeholder={placeholder}
          disabled={pending}
          aria-busy={pending}
          className="h-11 min-h-11 flex-1 border-input-border bg-background px-3.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-brand focus-visible:ring-2 focus-visible:ring-brand/30 disabled:opacity-60"
        />
        {/* Honeypot: hidden from users and screen readers, not keyboard-reachable */}
        <span className="sr-only" aria-hidden="true">
          <Input
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            className="sr-only"
          />
        </span>
        <Button
          type="submit"
          disabled={pending}
          className="h-11 min-h-11 shrink-0 rounded-full bg-primary px-5 font-medium text-primary-foreground hover:bg-primary/90"
        >
          {submitLabel}
        </Button>
      </form>
      <p className="text-xs text-muted-foreground">
        <Link href="/privacy" className="underline-offset-4 hover:underline">
          {privacyNote}
        </Link>
      </p>
    </div>
  )
}
