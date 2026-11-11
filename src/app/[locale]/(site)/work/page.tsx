import { getTranslations } from "next-intl/server"
import { Container } from "@/components/brand/container"
import { HairlineTable } from "@/components/brand/hairline-table"
import { PublicPageShell } from "@/components/brand/public-page"
import { Row } from "@/components/brand/row"
import { Reveal } from "@/components/brand/reveal"
import { Section } from "@/components/brand/section"
import { buttonVariants } from "@/components/ui/button"
import { Link } from "@/lib/navigation"
import { cn } from "@/lib/utils"

export default async function WorkPage() {
  const tNav = await getTranslations("nav")
  const tWork = await getTranslations("workPage")
  const tSakolentra = await getTranslations("home.sakolentra")
  const tOther = await getTranslations("home.otherProjects")
  const tCta = await getTranslations("home.finalCta")

  const rows = [
    {
      name: tOther("p1Name"),
      type: tOther("p1Type"),
      built: tOther("p1Built"),
    },
    {
      name: tOther("p2Name"),
      type: tOther("p2Type"),
      built: tOther("p2Built"),
    },
    {
      name: tOther("p3Name"),
      type: tOther("p3Type"),
      built: tOther("p3Built"),
    },
    {
      name: tOther("p4Name"),
      type: tOther("p4Type"),
      built: tOther("p4Built"),
    },
  ]

  return (
    <PublicPageShell
      title={tNav("work")}
      description={tWork("description")}
      showStub={false}
    >
      <Section navTheme="light" className="border-b border-border">
        <Container className="space-y-8">
          <Reveal>
          <Row
            href="/work/sakolentra"
            index="01"
            title={tSakolentra("title")}
            description={tSakolentra("description")}
            className="border-t border-border"
          />
          <Link
            href="/work/sakolentra"
            className={cn(
              buttonVariants({ size: "lg" }),
              "inline-flex h-11 rounded-full bg-primary px-6 font-medium text-primary-foreground hover:bg-primary/90 cta-lift"
            )}
          >
            {tSakolentra("caseStudyCta")}
          </Link>
          </Reveal>
        </Container>
      </Section>

      <Section navTheme="light" className="border-b border-border">
        <Container className="space-y-6">
          <Reveal delayMs={80}>
          <h2 className="text-section text-foreground">{tOther("title")}</h2>
          <p className="text-body-measure text-muted-foreground">
            {tOther("description")}
          </p>
          </Reveal>
          <HairlineTable
            columns={{
              name: tOther("colName"),
              type: tOther("colType"),
              built: tOther("colBuilt"),
            }}
            rows={rows}
          />
          <Link
            href="/start"
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "inline-flex h-11 rounded-full px-6 cta-lift"
            )}
          >
            {tCta("workWithMe")}
          </Link>
        </Container>
      </Section>
    </PublicPageShell>
  )
}
