import { getTranslations } from "next-intl/server"
import { ArrowUpRight } from "lucide-react"
import { DualBrandStage } from "@/components/brand/dualbrand-stage"
import { Reveal } from "@/components/brand/reveal"
import { PublicPageShell } from "@/components/brand/public-page"
import { Container } from "@/components/brand/container"
import { Section } from "@/components/brand/section"
import { Link } from "@/lib/navigation"
import { getDualBrandView } from "@/lib/public-product"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

export default async function ProductsPage() {
  const t = await getTranslations("productsPage")
  const tDual = await getTranslations("home.dualbrand")
  const tBrand = await getTranslations("brandToggle")
  const product = await getDualBrandView()
  const items = tDual("previewItems").split("·").map((s) => s.trim()).filter(Boolean)

  return (
    <PublicPageShell title={t("title")} description={t("description")} showStub={false}>
      <Section navTheme="light" className="border-b border-border">
        <Container>
          <Reveal>
          <div className="overflow-hidden rounded-[1.25rem] border border-border">
            <div className="grid grid-cols-1 gap-0 lg:grid-cols-12">
              <div className="border-b border-border p-6 sm:p-8 lg:col-span-5 lg:border-b-0 lg:border-r">
                <p className="text-sm text-muted-foreground">01</p>
                <h2 className="mt-3 text-section text-foreground">{t("dualbrandTitle")}</h2>
                <p className="text-body-measure mt-3 text-base leading-relaxed text-muted-foreground">
                  {t("dualbrandDesc")}
                </p>
                {product.priceUsd ? (
                  <p className="mt-4 text-sm font-medium tabular-nums text-foreground">
                    ${product.priceUsd}
                  </p>
                ) : null}
                <Link
                  href="/products/dualbrand"
                  className={cn(
                    buttonVariants({ size: "sm" }),
                    "mt-6 inline-flex h-11 min-h-11 items-center gap-1.5 rounded-full bg-primary px-4 font-medium text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                  )}
                >
                  {t("dualbrandCta")}
                  <ArrowUpRight className="size-3.5" />
                </Link>
              </div>
              <div className="lg:col-span-7">
                <DualBrandStage
                  className="border-0"
                  groupLabel={tBrand("groupLabel")}
                  layers={[
                    { id: "parent", label: t("layerParent") },
                    { id: "child-a", label: t("layerChildA") },
                    { id: "child-b", label: t("layerChildB") },
                  ]}
                  title={tDual("previewTitle")}
                  lead={tDual("previewLead")}
                  items={items}
                />
              </div>
            </div>
          </div>
          <p className="mt-8 text-sm text-muted-foreground">{t("moreSoon")}</p>
          </Reveal>
        </Container>
      </Section>
    </PublicPageShell>
  )
}
