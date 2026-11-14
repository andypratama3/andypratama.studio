import Image from "next/image"
import { getTranslations } from "next-intl/server"
import type { Metadata } from "next"
import { buildPageMetadata } from "@/lib/page-metadata"
import { ArrowRight } from "lucide-react"
import { Container } from "@/components/brand/container"
import { EmptyPanel } from "@/components/brand/empty-panel"
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
  const t = await getTranslations({ locale, namespace: "journalPage" })
  return buildPageMetadata({
    locale,
    path: "/journal",
    title: t("title"),
    description: t("subtitle"),
  })
}

export default async function JournalPage() {
  const t = await getTranslations("journalPage")
  const tCommon = await getTranslations("common")

  return (
    <PublicPageShell title={t("title")} description={t("subtitle")} showStub={false}>
      <Section navTheme="light" className="border-b border-border">
        <Container>
          <Reveal delayMs={80} className="space-y-10">
            <div className="overflow-hidden rounded-[1.25rem] border border-border">
              <div className="relative aspect-[21/9] min-h-44 bg-muted sm:aspect-[2.6/1]">
                <Image
                  src="/media/path-notes.jpg"
                  alt=""
                  fill
                  priority
                  sizes="(min-width: 1024px) 70vw, 100vw"
                  className="object-cover"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <article className="panel-soft flex min-h-48 flex-col justify-between gap-8 p-6 sm:p-8">
                <p className="text-sm text-muted-foreground">01 · {t("winLabel")}</p>
                <div className="flex items-end justify-between gap-4">
                  <p className="max-w-[28ch] text-base leading-snug text-foreground">
                    {t("winEmpty")}
                  </p>
                  <ArrowRight aria-hidden className="size-4 text-muted-foreground" />
                </div>
              </article>
              <article className="panel-soft flex min-h-48 flex-col justify-between gap-8 p-6 sm:p-8">
                <p className="text-sm text-muted-foreground">02 · {t("problemLabel")}</p>
                <div className="flex items-end justify-between gap-4">
                  <p className="max-w-[28ch] text-base leading-snug text-foreground">
                    {t("problemEmpty")}
                  </p>
                  <ArrowRight aria-hidden className="size-4 text-muted-foreground" />
                </div>
              </article>
            </div>

            <EmptyPanel
              status={tCommon("comingSoon")}
              title={t("emptyTitle")}
              description={t("emptyDescription")}
              action={
                <>
                  <Link
                    href="/start?topic=other"
                    className={cn(
                      buttonVariants({ size: "default" }),
                      "h-11 min-h-11 rounded-full bg-primary px-4 font-medium text-primary-foreground cta-lift"
                    )}
                  >
                    {t("subscribeCta")}
                  </Link>
                  <Link
                    href="/"
                    className={cn(
                      buttonVariants({ variant: "outline", size: "default" }),
                      "h-11 min-h-11 rounded-full px-4 cta-lift"
                    )}
                  >
                    {t("homeCta")}
                  </Link>
                </>
              }
            />
          </Reveal>
        </Container>
      </Section>
    </PublicPageShell>
  )
}
