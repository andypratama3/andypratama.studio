"use client"

import { useLocale, useTranslations } from "next-intl"

import { FootnoteList } from "@/components/brand/footnote-list"
import { Reveal } from "@/components/brand/reveal"
import { cn } from "@/lib/utils"
import { Link, usePathname } from "@/i18n/routing"
import { LangSwitcher } from "./lang-switcher"

const navLinks = [
  { href: "/work", key: "work" },
  { href: "/products", key: "products" },
  { href: "/services", key: "services" },
  { href: "/journal", key: "journal" },
  { href: "/about", key: "about" },
] as const

/** Only slugs present in src/content/outbound-links.ts. Owner adds socials there. */
const socialLinks: Array<{ href: string; key: "github" | "twitter" | "linkedin" | "youtube" }> =
  []

const legalLinks = [
  { href: "/privacy", key: "privacy" },
  { href: "/terms", key: "terms" },
  { href: "/license", key: "license" },
] as const

const HOME_FACT_IDS = ["students", "yearsBuilding", "modules"] as const

export function Footer() {
  const tNav = useTranslations("nav")
  const tFooter = useTranslations("footer")
  const pathname = usePathname()
  const locale = useLocale()
  const currentLocale = locale === "id" ? "id" : "en"
  const isHome = pathname === "/"
  const currentYear = new Date().getFullYear()

  return (
    <footer className="w-full border-t border-border bg-background text-foreground">
      <div className="mx-auto max-w-[1200px] px-[clamp(20px,4vw,40px)] py-16">
        {isHome ? (
          <FootnoteList
            ids={[...HOME_FACT_IDS]}
            title={tFooter("notesTitle")}
            statedLabel={tFooter("statusStated")}
            verifiedLabel={tFooter("statusVerified")}
            locale={currentLocale}
            className="mb-12 border-t-0 pt-0"
          />
        ) : null}

        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          <Reveal className="space-y-4 lg:col-span-4">
            <Link
              href="/"
              className="inline-block rounded-sm text-base font-semibold tracking-tight text-foreground transition-colors hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
            >
              {tNav("brand")}
            </Link>
            <p className="text-label text-muted-foreground">
              {tFooter("location")}
            </p>
            <div className="pt-1">
              <LangSwitcher />
            </div>
          </Reveal>

          <Reveal
            delayMs={90}
            className={cn("space-y-3", socialLinks.length > 0 ? "lg:col-span-2" : "lg:col-span-4")}
          >
            <p className="text-label text-muted-foreground">
              {tFooter("navLabel")}
            </p>
            <nav aria-label={tNav("brand")} className="flex flex-col gap-2.5">
              {navLinks.map((item) => (
                <Link
                  key={item.key}
                  href={item.href}
                  className="w-fit rounded-sm text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                >
                  {tNav(item.key)}
                </Link>
              ))}
            </nav>
          </Reveal>

          {socialLinks.length > 0 ? (
            <Reveal delayMs={160} className="space-y-3 lg:col-span-3">
              <p className="text-label text-muted-foreground">
                {tFooter("socialLabel")}
              </p>
              <div className="flex flex-col gap-2.5">
                {socialLinks.map((item) => (
                  <Link
                    key={item.key}
                    href={item.href}
                    className="w-fit rounded-sm text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                  >
                    {tFooter(item.key)}
                  </Link>
                ))}
              </div>
            </Reveal>
          ) : null}

          <Reveal
            delayMs={180}
            className={cn("space-y-3", socialLinks.length > 0 ? "lg:col-span-3" : "lg:col-span-4")}
          >
            <p className="text-label text-muted-foreground">
              {tFooter("legalLabel")}
            </p>
            <div className="flex flex-col gap-2.5">
              {legalLinks.map((item) => (
                <Link
                  key={item.key}
                  href={item.href}
                  className="w-fit rounded-sm text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                >
                  {tFooter(item.key)}
                </Link>
              ))}
            </div>
          </Reveal>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {currentYear} {tNav("brand")}. {tFooter("rights")}
          </p>
          <p className="text-label">{tFooter("location")}</p>
        </div>
      </div>
    </footer>
  )
}
