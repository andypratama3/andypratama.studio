import { getTranslations } from "next-intl/server"
import { Container } from "@/components/brand/container"
import { PageTransition } from "@/components/brand/page-transition"
import { Reveal, TextReveal } from "@/components/brand/reveal"
import { Section } from "@/components/brand/section"
import { SectionHeading } from "@/components/brand/section-heading"
import { buttonVariants } from "@/components/ui/button"
import { Link } from "@/lib/navigation"
import { cn } from "@/lib/utils"

export default async function JournalPage() {
  const t = await getTranslations("journalPage")

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
          <div className="flex min-h-[16rem] flex-col items-start justify-between gap-8 rounded-[1.25rem] border border-border p-6 sm:p-8">
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">—</p>
              <p className="text-base font-medium text-foreground">{t("emptyTitle")}</p>
              <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
                {t("emptyDescription")}
              </p>
            </div>
            <Link
              href="/start?topic=newsletter"
              className={cn(
                buttonVariants({ variant: "outline", size: "default" }),
                "h-11 min-h-11 rounded-full px-4 cta-lift"
              )}
            >
              {t("subscribeCta")}
            </Link>
          </div>
          </Reveal>
        </Container>
      </Section>
    </PageTransition>
  )
}
