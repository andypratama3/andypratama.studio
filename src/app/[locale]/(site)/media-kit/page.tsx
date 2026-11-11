import Image from "next/image"
import { ArrowUpRight, MapPin } from "lucide-react"
import { getTranslations } from "next-intl/server"
import { Container } from "@/components/brand/container"
import { Fact } from "@/components/brand/fact"
import { FootnoteList } from "@/components/brand/footnote-list"
import { PublicPageShell } from "@/components/brand/public-page"
import { Reveal } from "@/components/brand/reveal"
import { Section } from "@/components/brand/section"
import { footnoteIdsFromStats } from "@/components/brand/stats-grid"
import { buttonVariants } from "@/components/ui/button"
import { socialProfiles, type SocialPlatformId } from "@/content/social-profiles"
import { Link } from "@/lib/navigation"
import { cn } from "@/lib/utils"

export default async function MediaKitPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const currentLocale = locale === "id" ? "id" : "en"
  const t = await getTranslations("mediaKitPage")
  const tOther = await getTranslations("home.otherProjects")
  const tDual = await getTranslations("home.dualbrand")
  const tSako = await getTranslations("home.sakolentra")

  const statItems = [
    { id: "students" as const, label: t("studentsLabel") },
    { id: "yearsBuilding" as const, label: t("yearsLabel") },
    { id: "modules" as const, label: t("modulesLabel") },
  ]

  const connectItems = t("connectList")
    .split("·")
    .map((item) => item.trim())
    .filter(Boolean)

  const focusItems = t("focusList")
    .split("·")
    .map((item) => item.trim())
    .filter(Boolean)

  const audience = [t("audience1"), t("audience2"), t("audience3")]

  const selectedWork = [
    {
      name: "SAKOLENTRA",
      type: tSako("flowTitle"),
      result: tSako("description"),
      href: "/work/sakolentra" as const,
    },
    {
      name: tOther("p1Name"),
      type: tOther("p1Type"),
      result: tOther("p1Built"),
      href: "/work" as const,
    },
    {
      name: tOther("p2Name"),
      type: tOther("p2Type"),
      result: tOther("p2Built"),
      href: "/work" as const,
    },
    {
      name: tOther("p3Name"),
      type: tOther("p3Type"),
      result: tOther("p3Built"),
      href: "/work" as const,
    },
    {
      name: tOther("p4Name"),
      type: tOther("p4Type"),
      result: tOther("p4Built"),
      href: "/work" as const,
    },
    {
      name: tDual("title"),
      type: tDual("subtitle"),
      result: tDual("description"),
      href: "/products/dualbrand" as const,
    },
  ]

  const formats = [
    { name: t("format1Name"), note: t("format1Note"), price: t("format1Price") },
    { name: t("format2Name"), note: t("format2Note"), price: t("format2Price") },
    { name: t("format3Name"), note: t("format3Note"), price: t("format3Price") },
  ]

  const assets = [
    { href: "/start" as const, label: t("assetStart") },
    { href: "/about" as const, label: t("assetAbout") },
    { href: "/products" as const, label: t("assetProducts") },
    { href: "/work" as const, label: t("assetWork") },
    { href: "/faq" as const, label: t("assetFaq") },
  ]

  const platformIds = socialProfiles.map((profile) => profile.id)

  return (
    <PublicPageShell title={t("title")} description={t("description")} showStub={false}>
      <Section navTheme="light" className="border-b border-border">
        <Container>
          <Reveal delayMs={60} className="space-y-4">
            {/* Header */}
            <div className="overflow-hidden rounded-[1.5rem] border border-border bg-card">
              <div className="flex flex-col gap-8 p-6 sm:p-8 lg:flex-row lg:items-center lg:justify-between lg:p-10">
                <div className="flex items-start gap-5 sm:items-center">
                  <div className="relative size-24 shrink-0 overflow-hidden rounded-2xl sm:size-28">
                    <Image
                      src="/media/intro-video-poster.jpg"
                      alt=""
                      fill
                      priority
                      sizes="112px"
                      className="object-cover object-top"
                    />
                  </div>
                  <div>
                    <p className="text-[11px] font-medium tracking-[0.2em] text-muted-foreground uppercase">
                      {t("kicker")}
                    </p>
                    <h2 className="mt-2 text-[clamp(1.75rem,4.5vw,2.75rem)] leading-[1.05] font-semibold tracking-tight text-foreground">
                      Andy Pratama
                    </h2>
                    <p className="mt-1 text-muted-foreground">{t("role")}</p>
                    <p className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                      <span className="inline-flex items-center gap-1.5">
                        <MapPin aria-hidden className="size-3.5" />
                        {t("location")}
                      </span>
                      <span>{t("timezone")}</span>
                      <span className="text-foreground">{t("availability")}</span>
                    </p>
                  </div>
                </div>
                <div className="shrink-0 space-y-2">
                  <p className="text-[11px] font-medium tracking-[0.18em] text-muted-foreground uppercase">
                    {t("pinTitle")}
                  </p>
                  <p className="font-medium tabular-nums text-foreground">{t("pinUrl")}</p>
                  <p className="text-xs text-muted-foreground">{t("pinAlt")}</p>
                  <div className="flex flex-wrap gap-2 pt-2">
                    <Link
                      href="/start"
                      className={cn(
                        buttonVariants({ size: "sm" }),
                        "h-10 rounded-full bg-primary px-4 font-medium text-primary-foreground"
                      )}
                    >
                      {t("startCta")}
                    </Link>
                    <Link
                      href="/about"
                      className={cn(
                        buttonVariants({ variant: "outline", size: "sm" }),
                        "h-10 rounded-full px-4"
                      )}
                    >
                      {t("aboutCta")}
                    </Link>
                  </div>
                </div>
              </div>
              <div className="border-t border-border px-6 py-6 sm:px-8 lg:px-10">
                <p className="max-w-3xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
                  {t("positioning")}
                </p>
              </div>
            </div>

            {/* Platforms */}
            <div className="panel-soft p-6 sm:p-7">
              <h3 className="text-[11px] font-medium tracking-[0.18em] text-muted-foreground uppercase">
                {t("platformsTitle")}
              </h3>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                {t("platformsLead")}
              </p>
              <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                {socialProfiles.map((profile) => {
                  const live = profile.verified && Boolean(profile.href)
                  return (
                    <li
                      key={profile.id}
                      className="flex flex-col gap-3 rounded-2xl border border-border bg-background p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-medium text-foreground">
                            {t(`platform.${profile.id}`)}
                          </p>
                          <p className="mt-1 text-sm text-muted-foreground">
                            {profile.handle ? `@${profile.handle}` : t("handlePending")}
                          </p>
                        </div>
                        {live ? (
                          <a
                            href={profile.href!}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-sm font-medium text-brand underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                          >
                            {t("verifiedProfile")}
                            <ArrowUpRight aria-hidden className="size-3.5" />
                          </a>
                        ) : (
                          <span className="text-xs text-muted-foreground">{t("pendingProfile")}</span>
                        )}
                      </div>
                    </li>
                  )
                })}
              </ul>
            </div>

            {/* Ready bios */}
            <div className="panel-soft p-6 sm:p-7">
              <h3 className="text-[11px] font-medium tracking-[0.18em] text-muted-foreground uppercase">
                {t("bioTitle")}
              </h3>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                {t("bioLead")}
              </p>
              <ul className="mt-6 space-y-4">
                {platformIds.map((id: SocialPlatformId) => (
                  <li key={id} className="border-t border-border pt-4 first:border-0 first:pt-0">
                    <p className="text-sm font-medium text-foreground">{t(`platform.${id}`)}</p>
                    <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
                      {t(`bio.${id}`)}
                    </p>
                  </li>
                ))}
              </ul>
            </div>

            {/* Numbers / audience / focus */}
            <div className="grid gap-4 lg:grid-cols-3">
              <div className="panel-soft p-6 sm:p-7">
                <h3 className="text-[11px] font-medium tracking-[0.18em] text-muted-foreground uppercase">
                  {t("numbersTitle")}
                </h3>
                <div className="mt-6 grid grid-cols-1 gap-5">
                  {statItems.map((item, index) => (
                    <div key={item.id} className="border-t border-border pt-4">
                      <p
                        id={`stat-${item.id}`}
                        className="text-[clamp(1.5rem,3vw,2rem)] leading-none font-semibold tracking-tighter text-foreground tabular-nums"
                      >
                        <Fact id={item.id} />
                        <a
                          href={`#fn-${item.id}`}
                          className="ml-1 align-super text-sm font-medium text-muted-foreground no-underline hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                          aria-label={`${t("footnoteTitle")} ${index + 1}: ${item.label}`}
                        >
                          {["¹", "²", "³"][index]}
                        </a>
                      </p>
                      <p className="mt-1.5 text-xs text-muted-foreground">{item.label}</p>
                    </div>
                  ))}
                </div>
                <p className="mt-6 text-sm leading-relaxed text-muted-foreground">{t("howNote")}</p>
              </div>

              <div className="panel-soft p-6 sm:p-7">
                <h3 className="text-[11px] font-medium tracking-[0.18em] text-muted-foreground uppercase">
                  {t("audienceTitle")}
                </h3>
                <ul className="mt-6 space-y-4">
                  {audience.map((item, index) => (
                    <li key={item} className="border-t border-border pt-4 first:border-0 first:pt-0">
                      <p className="text-xs tabular-nums text-muted-foreground">
                        {String(index + 1).padStart(2, "0")}
                      </p>
                      <p className="mt-1.5 text-sm leading-relaxed text-foreground">{item}</p>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="panel-soft p-6 sm:p-7">
                <h3 className="text-[11px] font-medium tracking-[0.18em] text-muted-foreground uppercase">
                  {t("focusTitle")}
                </h3>
                <ul className="mt-6 flex flex-wrap gap-1.5">
                  {focusItems.map((item) => (
                    <li
                      key={item}
                      className="rounded-full border border-border bg-background px-2.5 py-1 text-xs text-muted-foreground"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
                <h4 className="mt-8 text-[11px] font-medium tracking-[0.18em] text-muted-foreground uppercase">
                  {t("connectTitle")}
                </h4>
                <ul className="mt-4 flex flex-wrap gap-1.5">
                  {connectItems.map((item) => (
                    <li
                      key={item}
                      className="rounded-full border border-border bg-background px-2.5 py-1 text-xs text-muted-foreground"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Work + formats */}
            <div className="grid gap-4 lg:grid-cols-[1.25fr_1fr]">
              <div className="panel-soft p-6 sm:p-7">
                <h3 className="text-[11px] font-medium tracking-[0.18em] text-muted-foreground uppercase">
                  {t("workTitle")}
                </h3>
                <ul className="mt-6 grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2">
                  {selectedWork.map((item) => (
                    <li key={item.name} className="bg-card p-4">
                      <Link
                        href={item.href}
                        className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                      >
                        <p className="font-medium text-foreground group-hover:text-brand">{item.name}</p>
                        <p className="mt-0.5 text-xs text-muted-foreground">{item.type}</p>
                        <p className="mt-2 text-sm leading-snug text-muted-foreground">{item.result}</p>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="panel-soft flex flex-col p-6 sm:p-7">
                <h3 className="text-[11px] font-medium tracking-[0.18em] text-muted-foreground uppercase">
                  {t("formatsTitle")}
                </h3>
                <ul className="mt-6 space-y-4">
                  {formats.map((item) => (
                    <li
                      key={item.name}
                      className="border-t border-border pt-4 first:border-0 first:pt-0"
                    >
                      <div className="flex items-baseline justify-between gap-3">
                        <p className="font-medium text-foreground">{item.name}</p>
                        <p className="shrink-0 text-sm font-semibold text-brand">{item.price}</p>
                      </div>
                      <p className="mt-0.5 text-sm text-muted-foreground">{item.note}</p>
                    </li>
                  ))}
                </ul>
                <p className="mt-6 border-t border-border pt-4 text-xs leading-relaxed text-muted-foreground">
                  {t("formatsNote")}{" "}
                  <Link
                    href="/faq"
                    className="font-medium text-brand underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                  >
                    {t("formatsFaq")}
                  </Link>
                  .
                </p>
              </div>
            </div>

            {/* Link destinations */}
            <div className="panel-soft p-6 sm:p-7">
              <h3 className="text-[11px] font-medium tracking-[0.18em] text-muted-foreground uppercase">
                {t("assetsTitle")}
              </h3>
              <ul className="mt-5 flex flex-wrap gap-2">
                {assets.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3.5 py-1.5 text-sm transition-colors hover:border-brand hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                    >
                      {item.label}
                      <ArrowUpRight aria-hidden className="size-3.5 text-muted-foreground" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* CTA */}
            <div className="overflow-hidden rounded-[1.5rem] border border-border bg-card p-6 sm:p-8 lg:p-10">
              <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
                <div>
                  <h3 className="text-balance text-[clamp(1.5rem,3.5vw,2.25rem)] leading-tight font-semibold tracking-tight text-foreground">
                    {t("ctaTitle")}
                  </h3>
                  <p className="mt-2 max-w-lg text-pretty text-muted-foreground">{t("ctaBody")}</p>
                </div>
                <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
                  <a
                    href="mailto:contact@andypratama.studio?subject=Media%20kit%20brief"
                    className={cn(
                      buttonVariants({ size: "lg" }),
                      "inline-flex h-11 rounded-full bg-primary px-6 font-medium text-primary-foreground hover:bg-primary/90 cta-lift"
                    )}
                  >
                    {t("ctaMail")}
                  </a>
                  <Link
                    href="/start"
                    className={cn(
                      buttonVariants({ variant: "outline", size: "lg" }),
                      "inline-flex h-11 rounded-full px-6 cta-lift"
                    )}
                  >
                    {t("ctaBrief")}
                  </Link>
                </div>
              </div>
              <p className="mt-8 border-t border-border pt-5 text-xs text-muted-foreground">
                {t("ctaDisclaimer")}
              </p>
            </div>

            <FootnoteList
              ids={footnoteIdsFromStats(statItems)}
              title={t("footnoteTitle")}
              statedLabel={t("statedLabel")}
              verifiedLabel={t("verifiedLabel")}
              locale={currentLocale}
              captions={{
                students: t("studentsLabel"),
                yearsBuilding: t("yearsLabel"),
                modules: t("modulesLabel"),
              }}
            />
          </Reveal>
        </Container>
      </Section>
    </PublicPageShell>
  )
}
