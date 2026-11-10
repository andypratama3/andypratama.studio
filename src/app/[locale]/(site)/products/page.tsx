import { getTranslations } from "next-intl/server"
import { ArrowUpRight } from "lucide-react"
import { DualBrandPreview } from "@/components/brand/dualbrand-preview"
import { Reveal } from "@/components/brand/reveal"
import { PublicPageShell } from "@/components/brand/public-page"
import { Container } from "@/components/brand/container"
import { Section } from "@/components/brand/section"
import { Link } from "@/lib/navigation"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

export default async function ProductsPage() {
  const t = await getTranslations("productsPage")
  const tDual = await getTranslations("home.dualbrand")

  return (
    <PublicPageShell title={t("title")} description={t("description")} showStub={false}>
      <Section navTheme="light" className="border-b border-border">
        <Container>
          <Reveal>
          <Link
            href="/products/dualbrand"
            className="group soft-card panel-soft interactive-surface block overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
          >
            <div className="grid grid-cols-1 gap-0 lg:grid-cols-12">
              <div className="border-b border-border p-6 sm:p-8 lg:col-span-5 lg:border-b-0 lg:border-r">
                <p className="text-label text-brand">01</p>
                <h2 className="mt-3 text-section text-foreground transition-colors group-hover:text-brand">
                  {t("dualbrandTitle")}
                </h2>
                <p className="text-body-measure mt-3 text-base leading-relaxed text-muted-foreground">
                  {t("dualbrandDesc")}
                </p>
                <span
                  className={cn(
                    buttonVariants({ size: "sm" }),
                    "mt-6 inline-flex h-11 min-h-11 items-center gap-1.5 rounded-full bg-primary px-4 font-medium text-primary-foreground"
                  )}
                >
                  {t("dualbrandCta")}
                  <ArrowUpRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </div>
              <div className="overflow-hidden lg:col-span-7">
                <DualBrandPreview
                  className="border-0"
                  title={tDual("previewTitle")}
                  lead={tDual("previewLead")}
                  items={tDual("previewItems").split("·").map((s) => s.trim()).filter(Boolean)}
                />
              </div>
            </div>
          </Link>
          <p className="mt-8 text-sm text-muted-foreground">{t("moreSoon")}</p>
          </Reveal>
        </Container>
      </Section>
    </PublicPageShell>
  )
}
