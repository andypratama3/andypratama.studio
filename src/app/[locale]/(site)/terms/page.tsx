import { getTranslations } from "next-intl/server"
import { Container } from "@/components/brand/container"
import { PageTransition } from "@/components/brand/page-transition"
import { Reveal, TextReveal } from "@/components/brand/reveal"
import { Section } from "@/components/brand/section"
import { SectionHeading } from "@/components/brand/section-heading"

export default async function TermsPage() {
  const t = await getTranslations("termsPage")

  return (
    <PageTransition>
      <Section emphasis navTheme="light" className="border-b border-border bg-secondary">
        <Container>
          <TextReveal>
          <SectionHeading kicker="Legal" title={t("title")} titleAs="h1" />
          </TextReveal>
        </Container>
      </Section>

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
    </PageTransition>
  )
}
