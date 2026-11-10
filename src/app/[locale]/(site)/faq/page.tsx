import { getTranslations } from "next-intl/server"
import { Container } from "@/components/brand/container"
import { FaqAccordion } from "@/components/brand/faq-accordion"
import { PublicPageShell } from "@/components/brand/public-page"
import { Section } from "@/components/brand/section"
import { faq } from "@/content/faq"

export default async function FaqPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const currentLocale = locale === "id" ? "id" : "en"
  const t = await getTranslations("faqPage")

  const items = faq
    .filter((item) => !item.requiresSetting)
    .map((item) => ({
      id: item.id,
      question: item.q[currentLocale],
      answer: item.a[currentLocale],
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
