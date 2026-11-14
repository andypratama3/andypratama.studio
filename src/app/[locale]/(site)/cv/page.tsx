import { getTranslations } from "next-intl/server"
import type { Metadata } from "next"
import { buildPageMetadata } from "@/lib/page-metadata"
import { Container } from "@/components/brand/container"
import { PublicPageShell } from "@/components/brand/public-page"
import { Reveal } from "@/components/brand/reveal"
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
  const t = await getTranslations({ locale, namespace: "cvPage" })
  return buildPageMetadata({ locale, path: "/cv", title: t("title"), description: t("intro") })
}

export default async function CvPage() {
  const t = await getTranslations("cvPage")

  return (
    <PublicPageShell title={t("title")} description={t("intro")} showStub={false}>
      <Section navTheme="light" className="border-b border-border">
        <Container>
          <Reveal delayMs={80}>
            <div className="max-w-prose space-y-6">
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
    </PublicPageShell>
  )
}
