import Image from "next/image"
import { getTranslations } from "next-intl/server"
import type { Metadata } from "next"
import { pageMetadata } from "@/lib/seo"
import { ArrowUpRight } from "lucide-react"
import { DualBrandStage } from "@/components/brand/dualbrand-stage"
import { Reveal } from "@/components/brand/reveal"
import { PublicPageShell } from "@/components/brand/public-page"
import { Container } from "@/components/brand/container"
import { Section } from "@/components/brand/section"
import { Link } from "@/lib/navigation"
import { productCatalog } from "@/content/product-catalog"
import { getDualBrandView } from "@/lib/public-product"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "productsPage" })
  return pageMetadata({
    locale,
    path: "/products",
    title: t("title"),
    description: t("description"),
  })
}

export default async function ProductsPage() {
  const t = await getTranslations("productsPage")
  const tDual = await getTranslations("home.dualbrand")
  const tBrand = await getTranslations("brandToggle")
  const tCommon = await getTranslations("common")
  const product = await getDualBrandView()
  const items = tDual("previewItems").split("·").map((s) => s.trim()).filter(Boolean)
  const shelf = productCatalog.map((item) => ({
    ...item,
    title: t(`catalog.${item.id}.title`),
    blurb: t(`catalog.${item.id}.blurb`),
  }))

  return (
    <PublicPageShell title={t("title")} description={t("description")} showStub={false}>
      <Section navTheme="light" className="border-b border-border">
        <Container>
          <Reveal className="space-y-10">
            <div>
              <p className="text-label text-muted-foreground">{t("shelfTitle")}</p>
              <ul className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {shelf.map((item, index) => {
                  const status =
                    item.status === "live" ? t("liveLabel") : t("soonLabel")
                  return (
                    <li key={item.id}>
                      <Link
                        href={item.href}
                        className="group panel-soft flex h-full flex-col overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                      >
                        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                          <Image
                            src={item.image}
                            alt=""
                            fill
                            sizes="(min-width: 1024px) 22vw, (min-width: 640px) 40vw, 90vw"
                            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                          />
                        </div>
                        <div className="flex flex-1 flex-col gap-2 p-5 sm:p-6">
                          <div className="flex items-center justify-between gap-3">
                            <p className="text-xs tabular-nums text-muted-foreground">
                              {String(index + 1).padStart(2, "0")} · {status}
                            </p>
                            {item.status === "live" ? (
                              <ArrowUpRight
                                aria-hidden
                                className="size-3.5 text-muted-foreground transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-brand"
                              />
                            ) : null}
                          </div>
                          <p className="text-base leading-snug font-medium text-foreground">
                            {item.title}
                          </p>
                          <p className="text-sm leading-relaxed text-muted-foreground">
                            {item.blurb}
                          </p>
                          {item.status === "soon" ? (
                            <p className="mt-auto pt-3 text-xs text-muted-foreground">
                              {tCommon("comingSoon")}
                            </p>
                          ) : null}
                        </div>
                      </Link>
                    </li>
                  )
                })}
              </ul>
              <p className="mt-6 text-sm text-muted-foreground">{t("moreSoon")}</p>
            </div>

            <div className="overflow-hidden rounded-[1.25rem] border border-border">
              <div className="grid grid-cols-1 gap-0 lg:grid-cols-12">
                <div className="flex flex-col border-b border-border p-6 sm:p-8 lg:col-span-5 lg:border-b-0 lg:border-r">
                  <p className="text-sm text-muted-foreground">01</p>
                  <h2 className="mt-3 text-section text-foreground">{t("dualbrandTitle")}</h2>
                  <p className="text-body-measure mt-3 text-base leading-relaxed text-muted-foreground">
                    {t("dualbrandDesc")}
                  </p>
                  {product.priceUsd ? (
                    <p className="mt-4 text-sm font-medium tabular-nums text-foreground">
                      ${product.priceUsd}
                    </p>
                  ) : (
                    <p className="mt-4 text-sm text-muted-foreground">{t("availabilityNote")}</p>
                  )}
                  <div className="mt-auto flex flex-wrap gap-3 pt-6">
                    <Link
                      href="/products/dualbrand"
                      className={cn(
                        buttonVariants({ size: "sm" }),
                        "inline-flex h-11 min-h-11 items-center gap-1.5 rounded-full bg-primary px-4 font-medium text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                      )}
                    >
                      {t("dualbrandCta")}
                      <ArrowUpRight className="size-3.5" />
                    </Link>
                  </div>
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
          </Reveal>
        </Container>
      </Section>
    </PublicPageShell>
  )
}
