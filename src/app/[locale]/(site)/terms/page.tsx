import { getTranslations } from "next-intl/server"
import type { Metadata } from "next"
import { pageMetadata } from "@/lib/seo"
import { Container } from "@/components/brand/container"
import { PublicPageShell } from "@/components/brand/public-page"
import { Reveal } from "@/components/brand/reveal"
import { Section } from "@/components/brand/section"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "termsPage" })
  return pageMetadata({ locale, path: "/terms", title: t("title"), description: t("intro") })
}

export default async function TermsPage() {
  const t = await getTranslations("termsPage")
  const tFooter = await getTranslations("footer")

  return (
    <PublicPageShell kicker={tFooter("legalLabel")} title={t("title")} showStub={false}>
      <Section navTheme="light" className="border-b border-border">
        <Container>
          <Reveal delayMs={80}>
            <div className="max-w-prose space-y-6">
              <p className="text-label text-brand">{t("draftDisclaimer")}</p>
              <p className="text-base leading-relaxed text-muted-foreground">{t("intro")}</p>
              <p className="text-sm leading-relaxed text-muted-foreground">{t("products")}</p>
              <p className="text-sm text-muted-foreground">{t("contact")}</p>
            </div>
          </Reveal>
        </Container>
      </Section>
    </PublicPageShell>
  )
}
