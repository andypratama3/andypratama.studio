import type { ReactNode } from "react"
import { getTranslations } from "next-intl/server"
import { Container } from "@/components/brand/container"
import { EmptyPanel } from "@/components/brand/empty-panel"
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
    <EmptyPanel
      status={t("stubStatus")}
      title={t("comingSoon")}
      description={t("stubNote")}
      action={
        <Link
          href="/start"
          className={cn(
            buttonVariants({ size: "lg" }),
            "inline-flex h-11 w-fit rounded-full bg-primary px-6 font-medium text-primary-foreground hover:bg-primary/90 cta-lift"
          )}
        >
          {t("stubCta")}
        </Link>
      }
    />
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
      <Section navTheme="light" className="border-b border-border pt-28 md:pt-32">
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
