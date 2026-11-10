import { getTranslations } from "next-intl/server"
import { Container } from "@/components/brand/container"
import { PageTransition } from "@/components/brand/page-transition"
import { TextReveal } from "@/components/brand/reveal"
import { Section } from "@/components/brand/section"
import { buttonVariants } from "@/components/ui/button"
import { Link } from "@/lib/navigation"
import { cn } from "@/lib/utils"

export default async function NotFound() {
  const t = await getTranslations("notFound")
  const tNav = await getTranslations("nav")

  return (
    <PageTransition>
      <Section emphasis navTheme="light" className="border-b border-border">
        <Container className="space-y-6 py-10 sm:py-16">
          <TextReveal>
            <p className="text-label text-brand">{t("kicker")}</p>
            <h1 className="text-display text-foreground">{t("title")}</h1>
            <p className="text-body-measure mt-4 text-muted-foreground">{t("description")}</p>
          </TextReveal>
          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              href="/"
              className={cn(
                buttonVariants({ size: "lg" }),
                "cta-lift h-11 rounded-full bg-primary px-6 font-medium text-primary-foreground hover:bg-primary/90"
              )}
            >
              {t("homeCta")}
            </Link>
            <Link
              href="/start"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "cta-lift h-11 rounded-full px-6"
              )}
            >
              {tNav("start")}
            </Link>
          </div>
        </Container>
      </Section>
    </PageTransition>
  )
}
