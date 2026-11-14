import { Suspense } from "react"
import { getTranslations } from "next-intl/server"
import type { Metadata } from "next"
import { buildPageMetadata } from "@/lib/page-metadata"
import { Container } from "@/components/brand/container"
import { ContactForm } from "@/components/brand/contact-form"
import { PublicPageShell } from "@/components/brand/public-page"
import { Reveal } from "@/components/brand/reveal"
import { Section } from "@/components/brand/section"

/** Primary CTA target — same intake form as /contact. */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "contactPage" })
  const tNav = await getTranslations({ locale, namespace: "nav" })
  return buildPageMetadata({
    locale,
    path: "/start",
    title: tNav("start"),
    description: t("description"),
  })
}

export default async function StartPage() {
  const tNav = await getTranslations("nav")
  const t = await getTranslations("contactPage")

  return (
    <PublicPageShell
      title={tNav("start")}
      description={t("description")}
      showStub={false}
    >
      <Section navTheme="light" className="border-b border-border">
        <Container>
          <Reveal>
          <Suspense fallback={<div className="h-64 animate-pulse rounded-[1.25rem] bg-muted" />}>
            <ContactForm
              labels={{
                name: t("name"),
                email: t("email"),
                topic: t("topic"),
                message: t("message"),
                submit: t("submit"),
                topics: {
                  project: t("topicProject"),
                  hiring: t("topicHiring"),
                  school: t("topicSchool"),
                  other: t("topicOther"),
                },
              }}
            />
          </Suspense>
          </Reveal>
        </Container>
      </Section>
    </PublicPageShell>
  )
}
