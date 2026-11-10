import { Inter } from "next/font/google"
import { notFound } from "next/navigation"
import { hasLocale, NextIntlClientProvider } from "next-intl"
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server"

import "@/app/globals.css"
import { MotionProvider } from "@/components/providers/motion-provider"
import { AppToaster } from "@/components/providers/toaster"
import { ThemeProvider } from "@/components/theme-provider"
import { TooltipProvider } from "@/components/ui/tooltip"
import { routing } from "@/i18n/routing"
import { cn } from "@/lib/utils"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) {
    return {}
  }
  const t = await getTranslations({ locale, namespace: "common" })
  const brand = t("brand")
  const description = t("siteDescription")
  return {
    metadataBase: new URL(
      (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "")
    ),
    title: { default: brand, template: `%s · ${brand}` },
    description,
    openGraph: {
      title: brand,
      description,
      siteName: brand,
      locale: locale === "id" ? "id_ID" : "en_US",
      type: "website",
    },
    robots: { index: true, follow: true },
  }
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode
  params: Promise<{ locale: string }>
}>) {
  const { locale } = await params

  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }

  setRequestLocale(locale)
  const messages = await getMessages()
  const t = await getTranslations({ locale, namespace: "common" })
  const origin = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(
    /\/$/,
    ""
  )
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Andy Pratama",
    url: origin,
    jobTitle: t("brand"),
    address: {
      "@type": "PostalAddress",
      addressLocality: "Samarinda",
      addressCountry: "ID",
    },
  }

  return (
    <html
      lang={locale}
      suppressHydrationWarning
      className={cn("antialiased", inter.variable)}
    >
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
        >
          <NextIntlClientProvider messages={messages} locale={locale}>
            <TooltipProvider>
              <MotionProvider>
                {children}
                <AppToaster />
              </MotionProvider>
            </TooltipProvider>
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
