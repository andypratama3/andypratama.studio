import { getTranslations } from "next-intl/server"
import type { Metadata } from "next"
import { pageMetadata } from "@/lib/seo"
import { BrandToggle } from "@/components/brand/brand-toggle"
import { Container } from "@/components/brand/container"
import { DualBrandStage } from "@/components/brand/dualbrand-stage"
import { PageTransition } from "@/components/brand/page-transition"
import { MediaReveal, Reveal, TextReveal } from "@/components/brand/reveal"
import { Section } from "@/components/brand/section"
import { SectionHeading } from "@/components/brand/section-heading"
import { buttonVariants } from "@/components/ui/button"
import { getDualBrandView } from "@/lib/public-product"
import { Link } from "@/lib/navigation"
import { LocalNav } from "@/components/brand/local-nav"
import { cn } from "@/lib/utils"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "home.dualbrand" })
  return pageMetadata({
    locale,
    path: "/products/dualbrand",
    title: t("title"),
    description: t("description"),
  })
}

export default async function DualBrandPage() {
  const tDual = await getTranslations("home.dualbrand")
  const tLocal = await getTranslations("localNav")
  const tProducts = await getTranslations("productsPage")
  const tBrand = await getTranslations("brandToggle")
  const product = await getDualBrandView()
  const packageItems = tDual("previewItems")
    .split("·")
    .map((s) => s.trim())
    .filter(Boolean)

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
            product.showBuy
              ? { href: "/go/dualbrand", label: tLocal("buy") }
              : { href: "/start", label: tDual("askCta") }
          }
        />

        <Section id="overview" emphasis navTheme="light" className="border-b border-border">
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
                {(product.showDemo || product.showBuy) ? (
                  <div className="flex flex-wrap items-center gap-3">
                    {product.showDemo ? (
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
                    {product.showBuy ? (
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
                ) : (
                  <p className="text-sm text-muted-foreground">{tProducts("availabilityNote")}</p>
                )}
              </TextReveal>
              <MediaReveal className="min-w-0 lg:col-span-7">
                {brandShots.length > 0 ? (
                  <BrandToggle options={brandShots} />
                ) : (
                  <DualBrandStage
                    groupLabel={tBrand("groupLabel")}
                    layers={[
                      { id: "parent", label: tProducts("layerParent") },
                      { id: "child-a", label: tProducts("layerChildA") },
                      { id: "child-b", label: tProducts("layerChildB") },
                    ]}
                    title={tDual("previewTitle")}
                    lead={tDual("previewLead")}
                    items={packageItems}
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
                title={tDual("packageHeading")}
                description={tDual("docsLead")}
              />
            </TextReveal>
            <Reveal>
              <ol className="divide-y divide-border border-y border-border">
                {packageItems.map((item, index) => (
                  <li
                    key={item}
                    className="flex items-baseline gap-4 py-4 text-base text-foreground"
                  >
                    <span className="w-8 shrink-0 text-sm tabular-nums text-muted-foreground">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ol>
            </Reveal>
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
            <div className="flex flex-wrap gap-3">
              <Link
                href="/license"
                className={cn(
                  buttonVariants({ variant: "outline", size: "default" }),
                  "cta-lift h-11 min-h-11 w-full rounded-full px-4 text-center whitespace-normal sm:w-auto"
                )}
              >
                {tDual("licenseNote")}
              </Link>
              <Link
                href="/start"
                className={cn(
                  buttonVariants({ size: "default" }),
                  "cta-lift h-11 min-h-11 w-full rounded-full bg-primary px-4 font-medium text-primary-foreground hover:bg-primary/90 sm:w-auto"
                )}
              >
                {tDual("askCta")}
              </Link>
            </div>
          </Container>
        </Section>
      </div>
    </PageTransition>
  )
}
