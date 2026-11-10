"use client"

import * as React from "react"
import { Languages } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"

import { Button } from "@/components/ui/button"
import { usePathname, useRouter } from "@/i18n/routing"

export function LangSwitcher() {
  const t = useTranslations("lang")
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const [isPending, startTransition] = React.useTransition()

  function toggleLocale() {
    const nextLocale = locale === "en" ? "id" : "en"
    // Preserve query string read at click time (no useSearchParams → no Suspense requirement).
    const qs =
      typeof window !== "undefined" ? window.location.search.replace(/^\?/, "") : ""
    const target = qs ? `${pathname}?${qs}` : pathname
    startTransition(() => {
      router.replace(target, { locale: nextLocale })
    })
  }

  const nextLocaleLabel = locale === "en" ? t("id") : t("en")
  const current = t("current")

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleLocale}
      disabled={isPending}
      className="gap-1.5 px-2 text-xs uppercase tracking-[0.12em] text-muted-foreground hover:text-foreground focus-visible:ring-2 focus-visible:ring-brand"
      aria-label={`${current} — ${t("toggle")} → ${nextLocaleLabel}`}
      title={`${current} — ${t("toggle")} → ${nextLocaleLabel}`}
    >
      <Languages className="size-3.5" aria-hidden />
      <span>{current}</span>
    </Button>
  )
}
