import { getTranslations } from "next-intl/server"
import type { Metadata } from "next"
import { pageMetadata } from "@/lib/seo"
import { ArrowUpRight } from "lucide-react"
import { Container } from "@/components/brand/container"
import { PublicPageShell } from "@/components/brand/public-page"
import { Reveal } from "@/components/brand/reveal"
import { Section } from "@/components/brand/section"
import { Link } from "@/lib/navigation"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "linksPage" })
  return pageMetadata({ locale, path: "/links", title: t("title") })
}

export default async function LinksPage() {
  const t = await getTranslations("linksPage")

  const outbound = [
    { slug: "dualbrand", label: t("dualbrandLabel") },
    { slug: "dualbrand-demo", label: t("dualbrandDemoLabel") },
  ] as const

  return (
    <PublicPageShell title={t("title")} showStub={false}>
      <Section navTheme="light" className="border-b border-border">
        <Container>
          <Reveal delayMs={80} className="space-y-8">
            <div className="rounded-[1.25rem] border border-border p-5 sm:p-6">
              <Link
                href="/media-kit"
                className="group flex items-center justify-between gap-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground group-hover:text-brand">
                    {t("mediaKitLabel")}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">/media-kit</p>
                </div>
                <ArrowUpRight
                  aria-hidden
                  className="size-4 shrink-0 text-muted-foreground transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-brand"
                />
              </Link>
            </div>

            <ul className="divide-y divide-border border-y border-border">
              {outbound.map((item) => (
                <li key={item.slug} className="flex items-center justify-between gap-4 py-4">
                  <div className="flex min-w-0 flex-col gap-0.5">
                    <span className="text-sm font-medium text-foreground">{item.label}</span>
                    <span className="text-xs text-muted-foreground">/go/{item.slug}</span>
                  </div>
                  <a
                    href={`/go/${item.slug}`}
                    className="inline-flex min-h-7 shrink-0 items-center text-xs text-muted-foreground underline-offset-4 hover:text-brand hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                  >
                    {t("pendingNote")}
                  </a>
                </li>
              ))}
            </ul>
          </Reveal>
        </Container>
      </Section>
    </PublicPageShell>
  )
}
