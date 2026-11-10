import type { ReactNode } from "react"
import { getTranslations } from "next-intl/server"
import { Container } from "@/components/brand/container"
import { PageTransition } from "@/components/brand/page-transition"
import { PanelReveal, TextReveal } from "@/components/brand/reveal"
import { Section } from "@/components/brand/section"
import { SectionHeading } from "@/components/brand/section-heading"
import { buttonVariants } from "@/components/ui/button"
import { Link } from "@/lib/navigation"
import { cn } from "@/lib/utils"

/** Branded in-progress panel (journal empty-state rhythm). */
export async function PublicStubPanel() {
  const t = await getTranslations("common")
  return (
    <div className="panel-soft overflow-hidden">
      <div className="flex min-h-[11rem] flex-col justify-between gap-6 bg-background/80 p-6 sm:min-h-[14rem] sm:p-8">
        <div className="space-y-3">
          <p className="text-label text-brand">{t("stubStatus")}</p>
          <p className="max-w-md text-base leading-relaxed text-muted-foreground">
            {t("stubNote")}
          </p>
        </div>
        <Link
          href="/start"
          className={cn(
            buttonVariants({ size: "lg" }),
            "inline-flex h-11 w-fit rounded-full bg-primary px-6 font-medium text-primary-foreground hover:bg-primary/90 cta-lift"
          )}
        >
          {t("stubCta")}
        </Link>
      </div>
    </div>
  )
}

export async function PublicPageShell({
  title,
  description,
  kicker,
  children,
  showStub = true,
}: {
  title: string
  description?: string
  kicker?: string
  children?: ReactNode
  showStub?: boolean
}) {
  return (
    <PageTransition>
      <Section emphasis navTheme="light" className="border-b border-border bg-secondary">
        <Container>
          <TextReveal>
            <SectionHeading
              kicker={kicker}
              title={title}
              description={description}
              titleAs="h1"
            />
          </TextReveal>
        </Container>
      </Section>
      {children ? (
        children
      ) : showStub ? (
        <Section navTheme="light" className="border-b border-border">
          <Container>
            <PanelReveal>
              <PublicStubPanel />
            </PanelReveal>
          </Container>
        </Section>
      ) : null}
    </PageTransition>
  )
}
