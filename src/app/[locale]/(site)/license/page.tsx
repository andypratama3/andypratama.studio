import { getTranslations } from "next-intl/server"
import type { Metadata } from "next"
import { buildPageMetadata } from "@/lib/page-metadata"
import { Container } from "@/components/brand/container"
import { PublicPageShell } from "@/components/brand/public-page"
import { Reveal } from "@/components/brand/reveal"
import { Section } from "@/components/brand/section"
import { buttonVariants } from "@/components/ui/button"
import { OUTBOUND_LINKS } from "@/content/outbound-links"
import { Link } from "@/lib/navigation"
import { cn } from "@/lib/utils"

/**
 * DualBrand license overview — full legal text lives at Gumroad checkout.
 * Do not invent clauses beyond messages / FAQ.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "licensePage" })
  const tFooter = await getTranslations({ locale, namespace: "footer" })
  return buildPageMetadata({
    locale,
    path: "/license",
    title: tFooter("license"),
    description: t("description"),
  })
}

export default async function LicensePage() {
  const tFooter = await getTranslations("footer")
  const t = await getTranslations("licensePage")
  const tDual = await getTranslations("home.dualbrand")

  return (
    <PublicPageShell
      title={tFooter("license")}
      description={t("description")}
      showStub={false}
    >
      <Section navTheme="light" className="border-b border-border">
        <Container className="space-y-6">
          <Reveal>
          <p className="text-body-measure text-base leading-relaxed text-muted-foreground">
            {t("body")}
          </p>
          <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
            <li>{t("pointCheckout")}</li>
            <li>{t("pointFaq")}</li>
            <li>{t("pointContact")}</li>
          </ul>
          <div className="flex flex-wrap gap-3 pt-2">
            {OUTBOUND_LINKS.dualbrand.verified ? (
            // /go is a route handler, outside the locale Link.
            // eslint-disable-next-line @next/next/no-html-link-for-pages
            <a
              href="/go/dualbrand"
              className={cn(
                buttonVariants({ size: "lg" }),
                "cta-lift inline-flex h-11 rounded-full bg-primary px-6 font-medium text-primary-foreground hover:bg-primary/90"
              )}
            >
              {tDual("buyCta")}
            </a>
            ) : null}
            <Link
              href="/faq"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "cta-lift inline-flex h-11 rounded-full px-6"
              )}
            >
              {t("faqCta")}
            </Link>
          </div>
          </Reveal>
        </Container>
      </Section>
    </PublicPageShell>
  )
}
