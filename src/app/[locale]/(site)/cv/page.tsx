import { getTranslations } from "next-intl/server"
import { Container } from "@/components/brand/container"
import { PageTransition } from "@/components/brand/page-transition"
import { Reveal, TextReveal } from "@/components/brand/reveal"
import { Section } from "@/components/brand/section"
import { SectionHeading } from "@/components/brand/section-heading"
import { buttonVariants } from "@/components/ui/button"
import { Link } from "@/lib/navigation"
import { cn } from "@/lib/utils"

export default async function CvPage() {
  const t = await getTranslations("cvPage")

  return (
    <PageTransition>
      <Section navTheme="light" className="border-b border-border pt-28 md:pt-32">
        <Container>
          <TextReveal>
          <SectionHeading title={t("title")} titleAs="h1" />
          </TextReveal>
        </Container>
      </Section>

      <Section navTheme="light" className="border-b border-border">
        <Container>
          <Reveal delayMs={80}>
          <div className="max-w-prose space-y-6">
            <p className="text-base leading-relaxed text-foreground">{t("intro")}</p>
            <p className="text-sm leading-relaxed text-muted-foreground">{t("skills")}</p>
            <p className="text-sm leading-relaxed text-muted-foreground">{t("requestNote")}</p>
            <Link
              href="/start?topic=hiring"
              className={cn(
                buttonVariants({ size: "default" }),
                "h-11 min-h-11 rounded-full bg-primary px-4 font-medium text-primary-foreground hover:bg-primary/90 cta-lift"
              )}
            >
              {t("requestCta")}
            </Link>
          </div>
          </Reveal>
        </Container>
      </Section>
    </PageTransition>
  )
}
