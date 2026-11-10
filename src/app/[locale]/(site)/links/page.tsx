import { getTranslations } from "next-intl/server"
import { Container } from "@/components/brand/container"
import { PageTransition } from "@/components/brand/page-transition"
import { Reveal, TextReveal } from "@/components/brand/reveal"
import { Section } from "@/components/brand/section"
import { SectionHeading } from "@/components/brand/section-heading"
import { Link } from "@/lib/navigation"

export default async function LinksPage() {
  const t = await getTranslations("linksPage")

  const links = [
    { slug: "dualbrand", label: t("dualbrandLabel") },
    { slug: "dualbrand-demo", label: t("dualbrandDemoLabel") },
  ] as const

  return (
    <PageTransition>
      <Section emphasis navTheme="light" className="border-b border-border bg-secondary">
        <Container>
          <TextReveal>
          <SectionHeading title={t("title")} titleAs="h1" />
          </TextReveal>
        </Container>
      </Section>

      <Section navTheme="light" className="border-b border-border">
        <Container>
          <Reveal delayMs={80}>
          <ul className="divide-y divide-border border-y border-border">
            {links.map((item) => (
              <li key={item.slug} className="flex items-center justify-between gap-4 py-4">
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm font-medium text-foreground">{item.label}</span>
                  <span className="text-xs text-muted-foreground">/go/{item.slug}</span>
                </div>
                <Link
                  href={`/go/${item.slug}`}
                  className="text-xs text-muted-foreground underline-offset-4 hover:text-brand hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                >
                  {t("pendingNote")}
                </Link>
              </li>
            ))}
          </ul>
          </Reveal>
        </Container>
      </Section>
    </PageTransition>
  )
}
