import { notFound } from "next/navigation"
import { getTranslations } from "next-intl/server"
import { Container } from "@/components/brand/container"
import { PageTransition } from "@/components/brand/page-transition"
import { SakolentraDiagram } from "@/components/brand/sakolentra-diagram"
import { Section } from "@/components/brand/section"
import { SectionHeading } from "@/components/brand/section-heading"
import { TextReveal, PanelReveal } from "@/components/brand/reveal"
import { StatBlock } from "@/components/brand/stat-block"
import { buttonVariants } from "@/components/ui/button"
import { Link } from "@/lib/navigation"
import { cn } from "@/lib/utils"

const CASE_STUDIES = new Set(["sakolentra"])

export default async function WorkSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  if (!CASE_STUDIES.has(slug)) {
    notFound()
  }

  const tNav = await getTranslations("nav")
  const tSakolentra = await getTranslations("home.sakolentra")
  const tProof = await getTranslations("home.proof")

  return (
    <PageTransition>
      <Section emphasis navTheme="light" className="border-b border-border bg-secondary">
        <Container className="space-y-8">
          <TextReveal>
          <SectionHeading
            kicker={tNav("work")}
            title={tSakolentra("title")}
            description={tSakolentra("description")}
            titleAs="h1"
            align="left"
          />
          </TextReveal>
          <StatBlock id="students" label={tProof("studentsLabel")} />
          <div className="flex flex-wrap gap-3">
            <Link
              href="/start?topic=school"
              className={cn(
                buttonVariants({ size: "lg" }),
                "h-11 rounded-full bg-primary px-6 font-medium text-primary-foreground hover:bg-primary/90 cta-lift"
              )}
            >
              {tSakolentra("pilotCta")}
            </Link>
            <Link
              href="/work"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "h-11 rounded-full px-6 cta-lift"
              )}
            >
              {tNav("work")}
            </Link>
          </div>
        </Container>
      </Section>

      <Section navTheme="light" className="border-b border-border">
        <Container>
          <PanelReveal>
          <SakolentraDiagram
            title={tSakolentra("flowTitle")}
            subtitle={tSakolentra("flowSubtitle")}
            badge={tSakolentra("flowBadge")}
            footer={tSakolentra("flowFooter")}
            nodes={[
              {
                step: "01",
                title: tSakolentra("step1Title"),
                description: tSakolentra("step1Desc"),
              },
              {
                step: "02",
                title: tSakolentra("step2Title"),
                description: tSakolentra("step2Desc"),
              },
              {
                step: "03",
                title: tSakolentra("step3Title"),
                description: tSakolentra("step3Desc"),
              },
              {
                step: "04",
                title: tSakolentra("step4Title"),
                description: tSakolentra("step4Desc"),
              },
            ]}
          />
          </PanelReveal>
        </Container>
      </Section>
    </PageTransition>
  )
}
