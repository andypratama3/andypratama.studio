import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import { Container } from "@/components/brand/container"
import { PublicPageShell } from "@/components/brand/public-page"
import { Reveal } from "@/components/brand/reveal"
import { Section } from "@/components/brand/section"
import { Link } from "@/lib/navigation"

type State = "confirmed" | "unsubscribed" | "invalid"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("newsletterStatus")
  return { title: t("title"), robots: { index: false, follow: false } }
}

export default async function NewsletterStatusPage({
  searchParams,
}: {
  searchParams: Promise<{ state?: string }>
}) {
  const t = await getTranslations("newsletterStatus")
  const { state } = await searchParams
  const current: State =
    state === "confirmed" || state === "unsubscribed" || state === "invalid"
      ? state
      : "invalid"

  return (
    <PublicPageShell title={t(current)} description={t(`${current}Note`)} showStub={false}>
      <Section navTheme="light" className="border-b border-border">
        <Container>
          <Reveal delayMs={80}>
            <Link
              href="/"
              className="inline-flex min-h-7 items-center text-sm font-medium text-brand underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
            >
              {t("backHome")}
            </Link>
          </Reveal>
        </Container>
      </Section>
    </PublicPageShell>
  )
}
