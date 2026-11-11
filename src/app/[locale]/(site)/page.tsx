import { ArrowDown, ArrowRight, FileText } from "lucide-react"
import { getTranslations } from "next-intl/server"
import { publicEnv } from "@/lib/env"
import { Container, ContainerWide } from "@/components/brand/container"
import { DualBrandPreview } from "@/components/brand/dualbrand-preview"
import { FaqAccordion } from "@/components/brand/faq-accordion"
import { HairlineTable } from "@/components/brand/hairline-table"
import { HeroScene } from "@/components/brand/hero-scene"
import { Row } from "@/components/brand/row"
import { SakolentraDiagram } from "@/components/brand/sakolentra-diagram"
import { Section } from "@/components/brand/section"
import { SectionHeading } from "@/components/brand/section-heading"
import { StatBlock } from "@/components/brand/stat-block"
import { HeroBeat } from "@/components/brand/hero-entrance"
import { Magnetic } from "@/components/brand/magnetic"
import { MediaFrame } from "@/components/brand/media-frame"
import { MediaReveal, PanelReveal, Reveal, Stagger, TextReveal } from "@/components/brand/reveal"
import { ScrollBridge } from "@/components/brand/scroll-bridge"
import { ScrollDepth, ScrollMedia } from "@/components/brand/scroll-media"
import { StatsGrid } from "@/components/brand/stats-grid"
import { StickySteps } from "@/components/brand/sticky-steps"
import { WordmarkMarquee } from "@/components/brand/wordmark-marquee"
import { NewsletterForm } from "@/components/brand/newsletter-form"
import { PageTransition } from "@/components/brand/page-transition"
import { buttonVariants } from "@/components/ui/button"
import { OUTBOUND_LINKS } from "@/content/outbound-links"
import { getResolvedFaqItems } from "@/lib/resolve-faq-tokens"
import { TrackedAnchor, TrackedLink } from "@/components/brand/tracked-link"
import { Link } from "@/lib/navigation"
import { cn } from "@/lib/utils"

const unicornProjectId =
  process.env.NEXT_PUBLIC_UNICORN_PROJECT_ID ??
  process.env.UNICORN_PROJECT_ID ??
  ""

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const currentLocale = locale === "id" ? "id" : "en"

  const tCommon = await getTranslations("common")
  const tHero = await getTranslations("home.hero")
  const tProof = await getTranslations("home.proof")
  const tWhat = await getTranslations("home.whatIDo")
  const tSakolentra = await getTranslations("home.sakolentra")
  const tOther = await getTranslations("home.otherProjects")
  const tDual = await getTranslations("home.dualbrand")
  const tStack = await getTranslations("home.stack")
  const tJournal = await getTranslations("home.journal")
  const tFaq = await getTranslations("home.faq")
  const tNews = await getTranslations("home.newsletter")
  const tIntro = await getTranslations("home.introVideo")
  const tProducts = await getTranslations("productsPage")
  const tCta = await getTranslations("home.finalCta")
  const tFooter = await getTranslations("footer")

  const homeFaqItems = getResolvedFaqItems(currentLocale).filter((item) => item.home)

  const audiencePaths = [
    { href: "/services", label: tHero("pathBuild"), index: "01" },
    { href: "/products/dualbrand", label: tHero("pathTemplate"), index: "02" },
    { href: "/work", label: tHero("pathHiring"), index: "03" },
  ] as const

  const proofItems = [
    { id: "students" as const, label: tProof("studentsLabel") },
    { id: "yearsBuilding" as const, label: tProof("yearsLabel") },
    { id: "modules" as const, label: tProof("modulesLabel") },
  ]

  const workRows = [
    {
      name: tOther("p1Name"),
      type: tOther("p1Type"),
      built: tOther("p1Built"),
    },
    {
      name: tOther("p2Name"),
      type: tOther("p2Type"),
      built: tOther("p2Built"),
    },
    {
      name: tOther("p3Name"),
      type: tOther("p3Type"),
      built: tOther("p3Built"),
    },
    {
      name: tOther("p4Name"),
      type: tOther("p4Type"),
      built: tOther("p4Built"),
    },
  ]

  const stackTechs = tStack("techList")
    .split(/[·,]/)
    .map((item) => item.trim())
    .filter(Boolean)

  return (
    <PageTransition>
    <div className="flex flex-col">
      {/* 2. Hero — full viewport, invert surface, Unicorn backdrop, wordmark */}
      <section
        aria-labelledby="home-hero-heading"
        data-nav-theme="dark"
        className="surface-invert relative scroll-mt-0 border-b border-surface-contrast-foreground/15"
      >
        <HeroScene
          projectId={unicornProjectId}
          className="surface-glow"
        >
          <ContainerWide className="flex flex-1 flex-col justify-between gap-6 py-8 pt-[4.75rem] sm:gap-8 sm:pt-20 md:pb-8 md:pt-24">
            <HeroBeat delay={0} className="pt-0 md:pt-2">
              <WordmarkMarquee
                text="ANDY PRATAMA"
                className="text-surface-contrast-foreground/92"
              />
            </HeroBeat>

            <div className="mx-auto flex max-w-2xl flex-col items-center gap-6 text-center">
              <div className="flex flex-col items-center gap-4 text-center">
                <HeroBeat delay={0.1}>
                  <p className="text-label text-surface-contrast-foreground/55">
                    {tCommon("brand")}
                  </p>
                </HeroBeat>
                <HeroBeat delay={0.22}>
                  <h1
                    id="home-hero-heading"
                    className="text-hero text-title-measure text-balance text-surface-contrast-foreground"
                  >
                    {tHero("title")}
                  </h1>
                </HeroBeat>
                <HeroBeat delay={0.38}>
                  <p className="text-body-measure text-pretty text-base leading-relaxed text-surface-contrast-foreground/70 sm:text-lg">
                    {tHero("description")}
                  </p>
                </HeroBeat>
              </div>
              <HeroBeat delay={0.52}>
                <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
                  <Magnetic>
                  <TrackedLink
                    event="hero_cta_click"
                    payload={{ cta: "primary" }}
                    href="/work"
                    className={cn(
                      buttonVariants({ size: "lg" }),
                      "cta-lift h-11 rounded-full bg-primary px-6 font-medium text-primary-foreground hover:bg-primary/90"
                    )}
                  >
                    {tHero("primaryCta")}
                  </TrackedLink>
                  </Magnetic>
                  <Magnetic>
                  <TrackedLink
                    event="hero_cta_click"
                    payload={{ cta: "secondary" }}
                    href="/start"
                    className={cn(
                      buttonVariants({ variant: "outline", size: "lg" }),
                      "cta-lift h-11 rounded-full border-surface-contrast-foreground/35 bg-transparent px-6 text-surface-contrast-foreground hover:bg-surface-contrast-foreground/10 hover:text-surface-contrast-foreground"
                    )}
                  >
                    {tHero("secondaryCta")}
                  </TrackedLink>
                  </Magnetic>
                </div>
              </HeroBeat>
              <HeroBeat delay={0.68} className="w-full max-w-lg pt-4">
                <nav
                  aria-label={currentLocale === "id" ? "Pilih jalur" : "Choose a path"}
                  className="w-full"
                >
                  <ul className="grid grid-cols-1 items-stretch gap-2 sm:grid-cols-3 sm:gap-3">
                    {audiencePaths.map((path) => (
                      <li key={path.href} className="h-full">
                        <Magnetic className="h-full w-full">
                        <TrackedLink
                          event="audience_route_click"
                          payload={{ href: path.href, index: path.index }}
                          href={path.href}
                          className="path-card group flex h-full w-full min-h-11 flex-col gap-2 rounded-[1.5rem] border px-4 py-3.5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                        >
                          <span className="text-label tabular-nums text-surface-contrast-foreground/60">
                            {path.index}
                          </span>
                          <span className="text-sm font-medium leading-snug text-surface-contrast-foreground transition-colors group-hover:text-brand-on-dark">
                            {path.label}
                          </span>
                          <ArrowRight
                            aria-hidden
                            className="mt-auto size-4 text-surface-contrast-foreground/60 transition-transform duration-200 ease-out group-hover:translate-x-1"
                          />
                        </TrackedLink>
                        </Magnetic>
                      </li>
                    ))}
                  </ul>
                </nav>
              </HeroBeat>
            </div>
            <HeroBeat delay={0.86} className="w-full">
              <div className="grid grid-cols-3 items-end gap-3 pb-2 text-surface-contrast-foreground/55">
                <p className="text-label justify-self-start">{tFooter("location")}</p>
                <a
                  href="#proof"
                  className="text-label justify-self-center rounded-full transition-colors hover:text-surface-contrast-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                >
                  <ArrowDown aria-hidden className="mr-1 inline size-3.5" />
                  {tCommon("scrollHint")}
                </a>
                <span className="justify-self-end" />
              </div>
            </HeroBeat>
          </ContainerWide>
        </HeroScene>
      </section>

      {/* 3. Proof — Apple "Strength in numbers" + footnotes */}
      <Section id="proof" navTheme="light" className="border-b border-border bg-muted">
        <Container>
          <div className="border-y border-border">
            <StatsGrid items={proofItems} withFootnotes />
          </div>
        </Container>
      </Section>

      <Section navTheme="light" className="border-b border-border">
        <Container>
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-12">
            <TextReveal className="lg:col-span-5">
              <SectionHeading
                title={tIntro("title")}
                description={tIntro("summary")}
              />
              <p className="mt-4 text-label text-muted-foreground">{tIntro("placeholder")}</p>
            </TextReveal>
            <ScrollMedia className="lg:col-span-7">
              <MediaReveal delayMs={80}>
                <MediaFrame>
                  <figure className="overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element -- static poster until a video file exists */}
                    <img
                      src="/media/intro-video-poster.jpg"
                      alt=""
                      width={1280}
                      height={720}
                      className="aspect-video w-full object-cover"
                    />
                  </figure>
                </MediaFrame>
              </MediaReveal>
            </ScrollMedia>
          </div>
        </Container>
      </Section>

      {/* 5. What I do — Row components */}
      <Section id="services" navTheme="light" className="border-b border-border">
        <Container>
          <div className="space-y-10">
            <Reveal>
              <SectionHeading kicker="01" title={tWhat("title")} />
            </Reveal>
            <div className="border-t border-border">
              <Reveal delayMs={40}>
                <Row
                  index="01"
                  title={tWhat("servicesTitle")}
                  description={tWhat("servicesDesc")}
                  href="/services"
                />
              </Reveal>
              <Reveal delayMs={120}>
                <Row
                  index="02"
                  title={tWhat("productsTitle")}
                  description={tWhat("productsDesc")}
                  href="/products/dualbrand"
                />
              </Reveal>
              <Reveal delayMs={200}>
                <Row
                  index="03"
                  title={tWhat("journalTitle")}
                  description={tWhat("journalDesc")}
                  href="/journal"
                />
              </Reveal>
            </div>
          </div>
        </Container>
      </Section>

      {/* 6. SAKOLENTRA bento */}
      <Section id="work" navTheme="light" className="border-b border-border">
        <Container>
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-12">
            <TextReveal delayMs={0} className="flex flex-col gap-6 lg:col-span-5">
              <SectionHeading
                kicker="02"
                title={tSakolentra("title")}
                description={tSakolentra("description")}
              />
              <StatBlock
                id="students"
                label={tProof("studentsLabel")}
                className="border-t border-border pt-6"
              />
              <div className="flex flex-wrap items-center gap-3">
                <Link
                  href="/work/sakolentra"
                  className={cn(
                    buttonVariants({ size: "default" }),
                    "h-11 min-h-11 rounded-full bg-primary px-4 font-medium text-primary-foreground hover:bg-primary/90 cta-lift"
                  )}
                >
                  {tSakolentra("caseStudyCta")}
                </Link>
                <Link
                  href="/start?topic=school"
                  className={cn(
                    buttonVariants({ variant: "outline", size: "default" }),
                    "h-11 min-h-11 rounded-full px-4"
                  )}
                >
                  {tSakolentra("pilotCta")}
                </Link>
              </div>
            </TextReveal>
            <PanelReveal delayMs={120} className="lg:col-span-7">
              <SakolentraDiagram
                title={tSakolentra("flowTitle")}
                subtitle={tSakolentra("flowSubtitle")}
                badge={tSakolentra("flowBadge")}
                footer={tSakolentra("flowFooter")}
                nodes={[
                  {
                    step: "01",
                    title: tSakolentra("step1Title"),
                    description: tSakolentra("step1Desc"),
                  },
                  {
                    step: "02",
                    title: tSakolentra("step2Title"),
                    description: tSakolentra("step2Desc"),
                  },
                  {
                    step: "03",
                    title: tSakolentra("step3Title"),
                    description: tSakolentra("step3Desc"),
                  },
                  {
                    step: "04",
                    title: tSakolentra("step4Title"),
                    description: tSakolentra("step4Desc"),
                  },
                ]}
              />
            </PanelReveal>
          </div>
        </Container>
      </Section>


      {/* 7. Other projects */}
      <Section navTheme="light" className="border-b border-border">
        <Container>
          <div className="space-y-10">
            <TextReveal>
            <SectionHeading
              kicker="03"
              title={tOther("title")}
              description={tOther("description")}
            />
            </TextReveal>
            <HairlineTable
              columns={{
                name: tOther("colName"),
                type: tOther("colType"),
                built: tOther("colBuilt"),
              }}
              rows={workRows}
            />
          </div>
        </Container>
      </Section>

      {/* 8. DualBrand */}
      <Section id="products" navTheme="light" className="border-b border-border">
        <Container>
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-12">
            <TextReveal className="flex flex-col gap-5 lg:col-span-5">
              <SectionHeading
                kicker={tDual("subtitle")}
                title={tDual("title")}
                description={tDual("description")}
              />
              <div className="flex flex-wrap items-center gap-3">
                <Link
                  href="/products/dualbrand"
                  className={cn(
                    buttonVariants({ size: "default" }),
                    "inline-flex h-11 min-h-11 items-center rounded-full bg-primary px-4 font-medium text-primary-foreground hover:bg-primary/90 cta-lift"
                  )}
                >
                  {tProducts("dualbrandCta")}
                </Link>
                {OUTBOUND_LINKS["dualbrand-demo"].verified ? (
                  <TrackedAnchor
                    event="product_demo_click"
                    href="/go/dualbrand-demo"
                    className={cn(
                      buttonVariants({ variant: "outline", size: "default" }),
                      "inline-flex h-11 min-h-11 items-center rounded-full px-4"
                    )}
                  >
                    {tDual("demoCta")}
                  </TrackedAnchor>
                ) : null}
                {OUTBOUND_LINKS.dualbrand.verified ? (
                  <TrackedAnchor
                    event="product_buy_click"
                    href="/go/dualbrand"
                    className={cn(
                      buttonVariants({ variant: "outline", size: "default" }),
                      "inline-flex h-11 min-h-11 items-center rounded-full px-4"
                    )}
                  >
                    {tDual("buyCta")}
                  </TrackedAnchor>
                ) : null}
              </div>
              <p className="text-xs text-muted-foreground">
                <Link
                  href="/license"
                  className="underline-offset-4 hover:underline"
                >
                  {tDual("licenseNote")}
                </Link>
              </p>
            </TextReveal>
            <ScrollDepth className="lg:col-span-7" intensity={22}>
              <MediaReveal delayMs={100}>
                <Link
                  href="/products/dualbrand"
                  className="interactive-surface block rounded-[1.75rem] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                >
                  <DualBrandPreview
                    title={tDual("previewTitle")}
                    lead={tDual("previewLead")}
                    items={tDual("previewItems").split("·").map((s) => s.trim()).filter(Boolean)}
                  />
                </Link>
              </MediaReveal>
            </ScrollDepth>
          </div>
        </Container>
      </Section>

      {/* 9. Stack — tech list + Velto StickySteps */}
      <Section navTheme="light" className="border-b border-border">
        <Container>
          <div className="space-y-12">
            <TextReveal>
              <SectionHeading kicker="04" title={tStack("title")} />
            </TextReveal>
            <div className="grid grid-cols-1 gap-10 border-t border-border pt-10 lg:grid-cols-12 lg:gap-16 lg:pt-12">
              <div className="space-y-4 lg:col-span-4">
                <h3 className="text-label text-foreground">{tStack("techTitle")}</h3>
                <ul className="flex flex-wrap gap-2">
                  <Stagger as="li" stepMs={50}>
                  {stackTechs.map((item) => (
                    <span
                      key={item}
                      className="capability-chip inline-flex min-h-9 items-center rounded-full border border-border bg-secondary px-3.5 text-sm text-foreground"
                    >
                      {item}
                    </span>
                  ))}
                  </Stagger>
                </ul>
              </div>
              <div className="space-y-4 lg:col-span-8">
                <h3 className="text-label text-foreground">{tStack("habitsTitle")}</h3>
                <StickySteps
                  steps={[
                    { title: tStack("habit1") },
                    { title: tStack("habit2") },
                    { title: tStack("habit3") },
                    { title: tStack("habit4") },
                  ]}
                />
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* 10. Journal */}
      <Section id="journal" navTheme="light" className="border-b border-border bg-muted">
        <Container>
          <Reveal className="space-y-10">
            <SectionHeading
              kicker="05"
              title={tJournal("title")}
              description={tJournal("subtitle")}
              action={
                <Link
                  href="/journal"
                  className={cn(
                    buttonVariants({ variant: "outline", size: "sm" }),
                    "h-11 min-h-11 rounded-full px-4"
                  )}
                >
                  {tJournal("allCta")}
                </Link>
              }
            />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Stagger className="h-full" stepMs={140}>
              <Link
                href="/journal"
                className="group soft-card panel-soft interactive-surface flex h-full min-h-[12rem] flex-col justify-between p-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand sm:p-8"
              >
                <p className="text-label text-brand">
                  01 · {tJournal("builtLabel")}
                </p>
                <div className="flex items-end justify-between gap-4">
                  <p className="text-sm text-muted-foreground">
                    {tJournal("builtEmpty")}
                  </p>
                  <span aria-hidden className="inline-flex size-11 items-center justify-center rounded-full bg-primary text-primary-foreground transition-transform duration-200 group-hover:translate-x-0.5">
                    <ArrowRight className="size-4" />
                  </span>
                </div>
              </Link>
              <Link
                href="/journal"
                className="group soft-card panel-soft interactive-surface flex h-full min-h-[12rem] flex-col justify-between p-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand sm:p-8"
              >
                <p className="text-label text-muted-foreground">
                  02 · {tJournal("brokenLabel")}
                </p>
                <div className="flex items-end justify-between gap-4">
                  <p className="text-sm text-muted-foreground">
                    {tJournal("brokenEmpty")}
                  </p>
                  <span aria-hidden className="inline-flex size-11 items-center justify-center rounded-full bg-secondary text-muted-foreground">
                    <ArrowRight className="size-4" />
                  </span>
                </div>
              </Link>
              </Stagger>
            </div>
          </Reveal>
        </Container>
      </Section>

      {/* 11. Social proof — fully hidden when empty */}
      {false ? (
        <Section className="border-b border-border">
          <Container>
            <h2 className="text-display text-foreground">Feedback</h2>
          </Container>
        </Section>
      ) : null}

      {/* Scroll transition 3 — horizontal wordmark scrub into CTA */}
      <div data-nav-theme="light" className="scroll-anchor border-b border-border bg-muted/40">
        <ScrollBridge text="ANDY PRATAMA" />
      </div>

      {/* 12. FAQ 4+8 */}
      <Section navTheme="light" className="border-b border-border">
        <Container>
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-14">
            <TextReveal className="space-y-5 lg:col-span-4">
              <SectionHeading kicker="06" title={tFaq("title")} />
              <Link
                href="/faq"
                className={cn(
                  buttonVariants({ variant: "outline", size: "sm" }),
                  "h-11 min-h-11 rounded-full px-4"
                )}
              >
                {tFaq("allCta")}
              </Link>
            </TextReveal>
            <div className="lg:col-span-8">
              <FaqAccordion
                items={homeFaqItems.map((item) => ({
                  id: item.id,
                  question: item.q[currentLocale],
                  answer: item.resolvedAnswer,
                }))}
              />
            </div>
          </div>
        </Container>
      </Section>

      {/* 13. Newsletter — hidden unless NEWSLETTER_ENABLED=1 */}
      {publicEnv.NEWSLETTER_ENABLED === "1" ? (
        <Section navTheme="light" className="border-b border-border">
          <Container>
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-end lg:gap-12">
              <div className="space-y-3 lg:col-span-5">
                <h2 className="text-display text-title-measure text-foreground">
                  {tNews("title")}
                </h2>
                <p className="text-body-measure text-sm leading-relaxed text-muted-foreground">
                  {tNews("description")}
                </p>
              </div>
              <div className="lg:col-span-7">
                <NewsletterForm
                  placeholder={tNews("inputPlaceholder")}
                  submitLabel={tNews("submitButton")}
                  privacyNote={tNews("privacyNote")}
                />
              </div>
            </div>
          </Container>
        </Section>
      ) : null}

      {/* 14. Final CTA — invert emphasis */}
      <Section
        id="about"
        emphasis
        navTheme="dark"
        className="surface-invert surface-glow border-b border-surface-contrast-foreground/15"
      >
        <Container>
          <PanelReveal className="flex flex-col items-start gap-8 py-6 text-surface-contrast-foreground sm:items-center sm:py-4 sm:text-center">
            <h2 className="text-display max-w-4xl sm:text-center">
              {tCta("title")}
            </h2>
            <div className="flex flex-wrap items-center gap-3 sm:justify-center">
              <Magnetic>
              <TrackedLink
                event="final_cta_click"
                payload={{ cta: "hire" }}
                href="/start?topic=hiring"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "cta-lift h-11 rounded-full bg-primary px-6 font-medium text-primary-foreground hover:bg-primary/90"
                )}
              >
                {tCta("hireMe")}
              </TrackedLink>
              </Magnetic>
              <TrackedLink
                event="final_cta_click"
                payload={{ cta: "template" }}
                href="/products/dualbrand"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "cta-lift h-11 rounded-full border-surface-contrast-foreground/35 bg-transparent px-6 text-surface-contrast-foreground hover:bg-surface-contrast-foreground/10 hover:text-surface-contrast-foreground"
                )}
              >
                {tCta("getTemplate")}
              </TrackedLink>
              <TrackedLink
                event="final_cta_click"
                payload={{ cta: "project" }}
                href="/start?topic=project"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "cta-lift h-11 rounded-full border-surface-contrast-foreground/35 bg-transparent px-6 text-surface-contrast-foreground hover:bg-surface-contrast-foreground/10 hover:text-surface-contrast-foreground"
                )}
              >
                {tCta("workWithMe")}
              </TrackedLink>
            </div>
            <div className="inline-flex flex-wrap items-center gap-2 rounded-full border border-surface-contrast-foreground/20 bg-surface-contrast-foreground/5 px-4 py-2.5 text-xs text-surface-contrast-foreground/70">
              <FileText className="size-3.5 text-brand-on-dark" />
              <span className="font-medium text-surface-contrast-foreground">
                {tCta("downloadCv")}
              </span>
              <TrackedLink
                event="cv_download"
                payload={{ lang: "en" }}
                href="/cv"
                className="inline-flex min-h-7 items-center transition-colors hover:text-surface-contrast-foreground hover:underline"
              >
                {tCta("cvEn")}
              </TrackedLink>
              <span aria-hidden><ArrowRight className="size-3.5" /></span>
              <TrackedLink
                event="cv_download"
                payload={{ lang: "id" }}
                href="/cv"
                className="inline-flex min-h-7 items-center transition-colors hover:text-surface-contrast-foreground hover:underline"
              >
                {tCta("cvId")}
              </TrackedLink>
            </div>
            {/* Social /go/* only when URLs exist in outbound-links.ts (Owner). */}
          </PanelReveal>
        </Container>
      </Section>
    </div>
    </PageTransition>
  )
}
