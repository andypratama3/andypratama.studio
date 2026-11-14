import type { Metadata } from "next"
import { hasLocale } from "next-intl"
import { getTranslations } from "next-intl/server"
import { routing } from "@/i18n/routing"

const FALLBACK_SITE_URL = "http://localhost:3000"
const OG_IMAGE_PATH = "/media/intro-video-poster.jpg"
const OG_IMAGE_WIDTH = 1280
const OG_IMAGE_HEIGHT = 720

export function siteOrigin() {
  return (process.env.NEXT_PUBLIC_SITE_URL ?? FALLBACK_SITE_URL).replace(/\/$/, "")
}

function pathPair(path: string) {
  const clean = path === "/" ? "" : path.startsWith("/") ? path : `/${path}`
  return {
    en: clean || "/",
    id: `/id${clean}`,
  }
}

export async function pageMetadata({
  locale,
  path,
  title,
  description,
}: {
  locale: string
  path: string
  title?: string
  description?: string
}): Promise<Metadata> {
  if (!hasLocale(routing.locales, locale)) {
    return {}
  }

  const t = await getTranslations({ locale, namespace: "common" })
  const siteName = t("brand")
  const resolvedDescription = description ?? t("siteDescription")
  const origin = siteOrigin()
  const paths = pathPair(path)
  const canonical = `${origin}${locale === "id" ? paths.id : paths.en}`
  const ogImage = `${origin}${OG_IMAGE_PATH}`
  const openGraph = {
    title: title ?? siteName,
    description: resolvedDescription,
    url: canonical,
    siteName,
    locale: locale === "id" ? "id_ID" : "en_US",
    type: "website" as const,
    images: [
      {
        url: ogImage,
        width: OG_IMAGE_WIDTH,
        height: OG_IMAGE_HEIGHT,
        alt: siteName,
      },
    ],
  }

  return {
    ...(title ? { title } : {}),
    description: resolvedDescription,
    alternates: {
      canonical,
      languages: {
        en: `${origin}${paths.en}`,
        id: `${origin}${paths.id}`,
      },
    },
    openGraph,
    twitter: {
      card: "summary_large_image",
      title: title ?? siteName,
      description: resolvedDescription,
      images: [ogImage],
    },
  }
}
