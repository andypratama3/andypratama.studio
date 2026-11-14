import { getTranslations } from "next-intl/server"
import type { Metadata } from "next"
import { pageMetadata } from "@/lib/seo"
import { Container } from "@/components/brand/container"
import { PublicPageShell } from "@/components/brand/public-page"
import { Stagger } from "@/components/brand/reveal"
import { Section } from "@/components/brand/section"
import { buttonVariants } from "@/components/ui/button"
import { Link } from "@/lib/navigation"
import { cn } from "@/lib/utils"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "servicesPage" })
  return pageMetadata({
    locale,
    path: "/services",
    title: t("title"),
    description: t("description"),
  })
}

export default async function ServicesPage() {
  const t = await getTranslations("servicesPage")

  const packages = [
    {
      label: t("pkg1Label"),
      title: t("pkg1Title"),
      desc: t("pkg1Desc"),
      scope: t("pkg1Scope"),
      prereq: t("pkg1Prereq"),
    },
    {
      label: t("pkg2Label"),
      title: t("pkg2Title"),
      desc: t("pkg2Desc"),
      scope: t("pkg2Scope"),
      prereq: t("pkg2Prereq"),
    },
  ]

  return (
    <PublicPageShell title={t("title")} description={t("description")} showStub={false}>
      <Section navTheme="light" className="border-b border-border">
        <Container className="space-y-10">
          <div className="grid grid-cols-1 items-stretch gap-4 lg:grid-cols-2">
            <Stagger className="h-full">
            {packages.map((pkg) => (
              <div
                key={pkg.label}
                className="panel-soft flex h-full flex-col gap-5 p-8 sm:p-10"
              >
                <p className="text-sm text-muted-foreground">{pkg.label}</p>
                <h2 className="text-section font-semibold text-foreground">
                  {pkg.title}
                </h2>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {pkg.desc}
                </p>
                <ul className="space-y-2 border-t border-border pt-5">
                  <li className="text-xs text-muted-foreground">{pkg.scope}</li>
                  <li className="text-xs text-muted-foreground">{pkg.prereq}</li>
                </ul>
              </div>
            ))}
            </Stagger>
          </div>
          <Link
            href="/start"
            className={cn(
              buttonVariants({ size: "lg" }),
              "cta-lift inline-flex h-11 rounded-full bg-primary px-6 font-medium text-primary-foreground hover:bg-primary/90"
            )}
          >
            {t("cta")}
          </Link>
        </Container>
      </Section>
    </PublicPageShell>
  )
}
