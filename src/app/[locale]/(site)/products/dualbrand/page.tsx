import { getTranslations } from "next-intl/server"
import { BrandToggle } from "@/components/brand/brand-toggle"
import { Container } from "@/components/brand/container"
import { DualBrandPreview } from "@/components/brand/dualbrand-preview"
import { PageTransition } from "@/components/brand/page-transition"
import { MediaReveal, TextReveal } from "@/components/brand/reveal"
import { PublicStubPanel } from "@/components/brand/public-page"
import { Section } from "@/components/brand/section"
import { SectionHeading } from "@/components/brand/section-heading"
import { buttonVariants } from "@/components/ui/button"
import { OUTBOUND_LINKS } from "@/content/outbound-links"
import { Link } from "@/lib/navigation"
import { LocalNav } from "@/components/brand/local-nav"
import { cn } from "@/lib/utils"

export default async function DualBrandPage() {
  const tDual = await getTranslations("home.dualbrand")
  const tLocal = await getTranslations("localNav")

  // Real screenshots only — empty until Owner supplies Holding / A / B assets.
  const brandShots: Array<{
    id: string
    label: string
    src: string
    alt: string
  }> = []

  return (
    <PageTransition>
    <div className="flex min-w-0 flex-col">
      <LocalNav
        aria-label={tDual("title")}
        items={[
          { href: "#overview", label: tLocal("overview") },
          { href: "#docs", label: tLocal("docs") },
          { href: "#license", label: tLocal("license") },
        ]}
        action={
          OUTBOUND_LINKS.dualbrand.verified
            ? { href: "/go/dualbrand", label: tLocal("buy") }
            : undefined
        }
      />

      <Section
        id="overview"
        emphasis
        navTheme="light"
        className="border-b border-border"
      >
        <Container>
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-center lg:gap-16">
            <TextReveal className="flex min-w-0 flex-col gap-5 lg:col-span-5">
              <SectionHeading
                kicker={tDual("subtitle")}
                title={tDual("title")}
                description={tDual("description")}
                titleAs="h1"
                align="left"
              />
              {(OUTBOUND_LINKS["dualbrand-demo"].verified || OUTBOUND_LINKS.dualbrand.verified) ? (
                <div className="flex flex-wrap items-center gap-3">
                  {OUTBOUND_LINKS["dualbrand-demo"].verified ? (
                    // eslint-disable-next-line @next/next/no-html-link-for-pages -- route handler outside the locale router
                    <a
                      href="/go/dualbrand-demo"
                      className={cn(
                        buttonVariants({ variant: "outline", size: "default" }),
                        "cta-lift inline-flex h-11 min-h-11 items-center rounded-full px-4"
                      )}
                    >
                      {tDual("demoCta")}
                    </a>
                  ) : null}
                  {OUTBOUND_LINKS.dualbrand.verified ? (
                    // eslint-disable-next-line @next/next/no-html-link-for-pages -- route handler outside the locale router
                    <a
                      href="/go/dualbrand"
                      className={cn(
                        buttonVariants({ size: "default" }),
                        "cta-lift inline-flex h-11 min-h-11 items-center rounded-full bg-primary px-4 font-medium text-primary-foreground hover:bg-primary/90"
                      )}
                    >
                      {tDual("buyCta")}
                    </a>
                  ) : null}
                </div>
              ) : null}
            </TextReveal>
            <MediaReveal className="min-w-0 lg:col-span-7">
              {brandShots.length > 0 ? (
                <BrandToggle options={brandShots} />
              ) : (
                <DualBrandPreview
                  title={tDual("previewTitle")}
                  lead={tDual("previewLead")}
                  items={tDual("previewItems").split("·").map((s) => s.trim()).filter(Boolean)}
                />
              )}
            </MediaReveal>
          </div>
        </Container>
      </Section>

      <Section id="docs" navTheme="light" className="border-b border-border">
        <Container className="space-y-10">
          <TextReveal>
          <SectionHeading
            kicker={tLocal("docs")}
            title={tLocal("docs")}
            description={tDual("description")}
          />
          </TextReveal>
          <PublicStubPanel />
        </Container>
      </Section>

      <Section id="license" navTheme="light" className="border-b border-border">
        <Container className="space-y-8">
          <TextReveal>
          <SectionHeading
            kicker={tLocal("license")}
            title={tLocal("license")}
            description={tDual("licenseNote")}
          />
          </TextReveal>
          <Link
            href="/license"
            className="inline-flex min-h-11 items-center text-base text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
          >
            {tDual("licenseNote")}
          </Link>
        </Container>
      </Section>
    </div>
    </PageTransition>
  )
}
