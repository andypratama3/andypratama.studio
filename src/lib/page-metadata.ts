import type { Metadata } from "next"

import { routing } from "@/i18n/routing"

export function siteOrigin(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(
    /\/$/,
    ""
  )
}

/**
 * Locale-aware public path. `localePrefix: "as-needed"` means English has no
 * prefix and Indonesian always has `/id`.
 */
export function localePath(locale: string, path: string): string {
  const clean = path.replace(/^\/+/, "").replace(/\/+$/, "")
  if (routing.defaultLocale === locale) {
    return clean ? `/${clean}` : "/"
  }
  return `/${locale}${clean ? `/${clean}` : ""}`
}

/**
 * Per-page metadata: title, description, canonical, hreflang and social
 * cards. `metadataBase` is set once in the locale layout, so relative URLs
 * are resolved to the production origin.
 */
export function buildPageMetadata(input: {
  locale: string
  path: string
  title: string
  description?: string
  noIndex?: boolean
}): Metadata {
  const { locale, path, title, description, noIndex = false } = input
  const canonical = localePath(locale, path)
  const enPath = localePath(routing.defaultLocale, path)
  const idPath = localePath(
    routing.locales.find((item) => item !== routing.defaultLocale) ?? "id",
    path
  )

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: {
        en: enPath,
        id: idPath,
        "x-default": enPath,
      },
    },
    openGraph: {
      title,
      description,
      url: canonical,
      type: "website",
      locale: locale === "id" ? "id_ID" : "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
  }
}
