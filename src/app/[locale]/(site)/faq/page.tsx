import { getTranslations } from "next-intl/server"
import type { Metadata } from "next"
import { buildPageMetadata } from "@/lib/page-metadata"
import { Container } from "@/components/brand/container"
import { FaqAccordion } from "@/components/brand/faq-accordion"
import { PublicPageShell } from "@/components/brand/public-page"
import { Section } from "@/components/brand/section"
import { getResolvedFaqItems } from "@/lib/resolve-faq-tokens"
import { getFaqSettings } from "@/lib/site-settings"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "faqPage" })
  return buildPageMetadata({ locale, path: "/faq", title: t("title"), description: t("description") })
}

export default async function FaqPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const currentLocale = locale === "id" ? "id" : "en"
  const t = await getTranslations("faqPage")

  const settings = await getFaqSettings(currentLocale)
  const items = getResolvedFaqItems(currentLocale, settings).map((item) => ({
    id: item.id,
    question: item.q[currentLocale],
    answer: item.resolvedAnswer,
  }))

  return (
    <PublicPageShell title={t("title")} description={t("description")} showStub={false}>
      <Section navTheme="light" className="border-b border-border">
        <Container>
          <FaqAccordion items={items} />
        </Container>
      </Section>
    </PublicPageShell>
  )
}
