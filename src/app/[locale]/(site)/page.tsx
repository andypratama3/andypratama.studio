import { AppWindow, ArrowRight, Code2, CreditCard, Database, FileText, LayoutDashboard, MessageCircle, UserCheck } from "lucide-react"
import { getTranslations } from "next-intl/server"
import Image from "next/image"
import { publicEnv } from "@/lib/env"
import { Container, ContainerWide } from "@/components/brand/container"
import { DualBrandStage } from "@/components/brand/dualbrand-stage"
import { FaqAccordion } from "@/components/brand/faq-accordion"
import { HairlineTable } from "@/components/brand/hairline-table"
import { Row } from "@/components/brand/row"
import { SakolentraDiagram } from "@/components/brand/sakolentra-diagram"
import { Section } from "@/components/brand/section"
import { StatBlock } from "@/components/brand/stat-block"
import { Magnetic } from "@/components/brand/magnetic"
import { ChapterCard } from "@/components/brand/chapter-card"
import { ChapterRail } from "@/components/brand/chapter-rail"
import { DepthGauge } from "@/components/brand/depth-gauge"
import { PracticeCube } from "@/components/brand/practice-cube"
import { StudioIntro } from "@/components/brand/studio-intro"
import { ProductStrip } from "@/components/brand/product-strip"
import { productCatalog } from "@/content/product-catalog"
import { Fact } from "@/components/brand/fact"
import { MediaReveal, PanelReveal, Reveal, TextReveal } from "@/components/brand/reveal"
import { ScrollBridge } from "@/components/brand/scroll-bridge"
import { ScrollDepth } from "@/components/brand/scroll-media"
import { StickySteps } from "@/components/brand/sticky-steps"
import { NewsletterForm } from "@/components/brand/newsletter-form"
import { PageTransition } from "@/components/brand/page-transition"
import { buttonVariants } from "@/components/ui/button"
import { OUTBOUND_LINKS } from "@/content/outbound-links"
import { getResolvedFaqItems } from "@/lib/resolve-faq-tokens"
import { TrackedAnchor, TrackedLink } from "@/components/brand/tracked-link"
import { Link } from "@/lib/navigation"
import { motionTokens } from "@/lib/motion"
import { cn } from "@/lib/utils"

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const currentLocale = locale === "id" ? "id" : "en"

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
  const tBrand = await getTranslations("brandToggle")
  const tCta = await getTranslations("home.finalCta")

  const homeFaqItems = getResolvedFaqItems(currentLocale).filter((item) => item.home)

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

  const stackIcons = [CreditCard, MessageCircle, Code2, LayoutDashboard, AppWindow, UserCheck, Database] as const

  const stackTechs = tStack("techList")
    .split(/[·,]/)
    .map((item) => item.trim())
    .filter(Boolean)

  const strip = [
    { href: "/services", label: tHero("pathBuild"), index: "01", image: "/media/path-build.jpg" },
    { href: "/products/dualbrand", label: tHero("pathTemplate"), index: "02", image: "/media/path-template.jpg" },
    { href: "/work", label: tHero("pathHiring"), index: "03", image: "/media/path-hiring.jpg" },
    { href: "/work/sakolentra", label: tSakolentra("step1Title"), index: "04", image: "/media/path-ledger.jpg" },
    { href: "/journal", label: tJournal("title"), index: "05", image: "/media/path-notes.jpg" },
  ]

  const cubeFaces = [
    { index: "01", title: tWhat("servicesTitle"), body: tWhat("servicesDesc"), href: "/services" },
    { index: "02", title: tWhat("productsTitle"), body: tWhat("productsDesc"), href: "/products" },
    { index: "03", title: tWhat("journalTitle"), body: tWhat("journalDesc"), href: "/journal" },
    { index: "04", title: tSakolentra("flowTitle"), body: tSakolentra("description"), href: "/work/sakolentra" },
    { index: "05", title: tOther("title"), body: tOther("description"), href: "/work" },
    { index: "06", title: tCta("workWithMe"), body: tHero("secondaryCta"), href: "/start" },
  ]

  return (
    <PageTransition>
    <div className="flex flex-col">
      <StudioIntro />
      <section
        aria-labelledby="home-hero-heading"
        data-nav-theme="dark"
        data-decor=""
        className="fluid-hero relative flex min-h-dvh flex-col border-b border-border"
      >
        <DepthGauge surface={tHero("surface")} depth={tHero("depth")} />
        <ContainerWide className="relative flex flex-1 flex-col justify-end pt-28 pr-0 pb-10 md:pr-20 md:pb-14">
          <h1 id="home-hero-heading" className="fluid-word max-w-[16ch]">
            <span className="hero-beat block">Andy</span>
            <span className="sr-only">Pratama Studio</span>
            <span aria-hidden className="fluid-neon hero-beat block" style={{ ["--reveal-delay" as string]: "80ms" }}>
              {"Pratama Studio".split(" ").map((word, wordIndex, words) => {
                const base = words
                  .slice(0, wordIndex)
                  .reduce((total, part) => total + part.length + 1, 0)
                return (
                  <span key={word} className="fluid-neon-word">
                    {word.split("").map((letter, letterIndex) => (
                      <span
                        key={`${word}-${letter}-${letterIndex}`}
                        className="fluid-neon-letter"
                        data-letter={letter}
                        style={{
                          animationDelay: `${(base + letterIndex) * motionTokens.stagger}s`,
                        }}
                      >
                        {letter}
                      </span>
                    ))}
                  </span>
                )
              })}
            </span>
          </h1>
          <div className="hero-beat mt-8 max-w-xl" style={{ ["--reveal-delay" as string]: "160ms" }}>
            <p className="text-lg leading-snug font-medium">
              {tHero("title")}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base">
              {tHero("description")}
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
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
            <TrackedLink
              event="hero_cta_click"
              payload={{ cta: "secondary" }}
              href="/start"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "cta-lift h-11 rounded-full border-foreground/25 bg-transparent px-6 text-foreground hover:bg-foreground/5"
              )}
            >
              {tHero("secondaryCta")}
            </TrackedLink>
            </div>
          </div>
        </ContainerWide>

        <nav aria-label={tHero("stripLabel")} className="relative">
          <ul className="fluid-strip">
            {strip.map((item) => (
              <li key={item.href}>
                <TrackedLink
                  event="audience_route_click"
                  payload={{ href: item.href, index: item.index }}
                  href={item.href}
                  className="fluid-cell hero-beat focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-inset"
                  style={{ ["--reveal-delay" as string]: `${240 + strip.indexOf(item) * 60}ms` }}
                >
                  <Image
                    src={item.image}
                    alt=""
                    width={800}
                    height={600}
                    sizes="(min-width: 1200px) 18vw, 78vw"
                    className="aspect-[4/3] w-full rounded-[1.25rem] object-cover"
                  />
                  <span className="flex flex-col gap-1 px-0.5 pb-1">
                    <span className="text-xs tabular-nums text-muted-foreground">{item.index}</span>
                    <span className="text-sm leading-snug font-medium">{item.label}</span>
                  </span>
                </TrackedLink>
              </li>
            ))}
          </ul>
        </nav>
      </section>

      <ProductStrip
        liveLabel={tProducts("liveLabel")}
        soonLabel={tProducts("soonLabel")}
        browseLabel={tProducts("browseLabel")}
        items={productCatalog.map((item) => ({
          ...item,
          title: tProducts(`catalog.${item.id}.title`),
          blurb: tProducts(`catalog.${item.id}.blurb`),
        }))}
      />

      <PracticeCube faces={cubeFaces} caption={tHero("cubeCaption")} />

      <ChapterRail
        label={tHero("stripLabel")}
        items={[
          { id: "proof", index: "I", label: tIntro("title") },
          { id: "services", index: "II", label: tWhat("title") },
          { id: "work", index: "III", label: tSakolentra("flowTitle") },
          { id: "projects", index: "IV", label: tOther("title") },
          { id: "products", index: "V", label: tDual("title") },
          { id: "practice", index: "VI", label: tStack("title") },
          { id: "journal", index: "VII", label: tJournal("title") },
          { id: "faq", index: "VIII", label: tFaq("title") },
        ]}
      />

      <Section id="proof" navTheme="light" className="border-b border-border">
        <Container className="flex min-h-[72vh] items-center">
          <ChapterCard
            index="I"
            eyebrow={tHero("discipline")}
            title={tIntro("title")}
            description={tIntro("summary")}
            spec={proofItems.map((item, index) => ({
              id: `stat-${item.id}`,
              label: item.label,
              value: (
                <>
                  <Fact id={item.id} />
                  <a
                    href={`#fn-${item.id}`}
                    className="ml-0.5 align-super text-[0.55em] font-medium text-muted-foreground no-underline hover:text-foreground"
                  >
                    <span className="sr-only">{item.label}. </span>
                    {["¹", "²", "³"][index]}
                  </a>
                </>
              ),
            }))}
          />
        </Container>
        <Container className="pb-16">
          <figure className="relative overflow-hidden rounded-[1.25rem] border border-border">
            {/* eslint-disable-next-line @next/next/no-img-element -- static poster until a video file exists */}
            <img
              src="/media/intro-video-poster.jpg"
              alt=""
              width={1280}
              height={720}
              className="aspect-[4/3] w-full object-cover object-[center_35%] sm:aspect-[2.2/1]"
            />
            <figcaption className="absolute inset-x-0 bottom-0 flex justify-end bg-gradient-to-t from-surface-contrast/80 via-surface-contrast/25 to-transparent px-5 pb-5 pt-20 sm:px-7 sm:pb-6">
              <span className="rounded-full border border-surface-contrast-foreground/25 bg-surface-contrast/55 px-3.5 py-1.5 text-sm text-surface-contrast-foreground backdrop-blur-sm">
                {tIntro("placeholder")}
              </span>
            </figcaption>
          </figure>
        </Container>
      </Section>

      <Section id="services" navTheme="light" className="border-b border-border">
        <Container>
          <div className="space-y-10">
            <ChapterCard
              side="right"
              index="II"
              eyebrow={tWhat("servicesTitle")}
              title={tWhat("title")}
            />
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
            <TextReveal delayMs={0} className="flex flex-col gap-6 lg:col-span-5 lg:col-start-8">
              <ChapterCard
                index="III"
                eyebrow={tSakolentra("flowBadge")}
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
            <PanelReveal delayMs={120} className="lg:col-span-7 lg:col-start-1 lg:row-start-1">
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
      <Section id="projects" navTheme="light" className="border-b border-border">
        <Container>
          <div className="space-y-10">
            <ChapterCard
              index="IV"
              eyebrow={tOther("colName")}
              title={tOther("title")}
              description={tOther("description")}
            />
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
            <TextReveal className="flex flex-col gap-5 lg:col-span-5 lg:col-start-8">
              <ChapterCard
                index="V"
                eyebrow={tDual("subtitle")}
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
            <ScrollDepth className="lg:col-span-7 lg:col-start-1 lg:row-start-1" intensity={22}>
              <MediaReveal delayMs={100}>
                <DualBrandStage
                  groupLabel={tBrand("groupLabel")}
                  layers={[
                    { id: "parent", label: tProducts("layerParent") },
                    { id: "child-a", label: tProducts("layerChildA") },
                    { id: "child-b", label: tProducts("layerChildB") },
                  ]}
                  title={tDual("previewTitle")}
                  lead={tDual("previewLead")}
                  items={tDual("previewItems").split("·").map((s) => s.trim()).filter(Boolean)}
                />
              </MediaReveal>
            </ScrollDepth>
          </div>
        </Container>
      </Section>

      {/* 9. Stack — tech list + Velto StickySteps */}
      <Section id="practice" navTheme="light" className="border-b border-border">
        <Container>
          <div className="space-y-12">
            <TextReveal>
              <ChapterCard
                side="right"
                index="VI"
                eyebrow={tStack("techTitle")}
                title={tStack("title")}
              />
            </TextReveal>
            <div className="grid grid-cols-1 gap-10 border-t border-border pt-10 lg:grid-cols-12 lg:gap-16 lg:pt-12">
              <div className="space-y-4 lg:col-span-4">
                <h3 className="text-label text-foreground">{tStack("techTitle")}</h3>
                <ul className="divide-y divide-border border-y border-border">
                  {stackTechs.map((item, index) => {
                    const Icon = stackIcons[index] ?? Code2
                    return (
                      <li key={item} className="flex items-center gap-3 py-3 text-sm text-foreground">
                        <Icon aria-hidden className="size-4 shrink-0 text-muted-foreground" />
                        {item}
                      </li>
                    )
                  })}
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
      <Section id="journal" navTheme="light" className="border-b border-border">
        <Container>
          <Reveal className="space-y-10">
            <ChapterCard
              index="VII"
              eyebrow={tJournal("builtLabel")}
              title={tJournal("title")}
              description={tJournal("subtitle")}
            />
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Link
                href="/journal"
                className="group panel-soft flex min-h-44 flex-col justify-between gap-8 p-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand sm:p-8"
              >
                <p className="text-sm text-muted-foreground">
                  01 · {tJournal("builtLabel")}
                </p>
                <div className="flex items-end justify-between gap-4">
                  <p className="max-w-[24ch] text-base leading-snug text-foreground">
                    {tJournal("builtEmpty")}
                  </p>
                  <ArrowRight aria-hidden className="size-4 text-muted-foreground transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-brand" />
                </div>
              </Link>
              <Link
                href="/journal"
                className="group panel-soft flex min-h-44 flex-col justify-between gap-8 p-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand sm:p-8"
              >
                <p className="text-sm text-muted-foreground">
                  02 · {tJournal("brokenLabel")}
                </p>
                <div className="flex items-end justify-between gap-4">
                  <p className="max-w-[24ch] text-base leading-snug text-foreground">
                    {tJournal("brokenEmpty")}
                  </p>
                  <ArrowRight aria-hidden className="size-4 text-muted-foreground transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-brand" />
                </div>
              </Link>
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
      <div data-nav-theme="light" className="scroll-anchor border-b border-border">
        <ScrollBridge text="ANDY PRATAMA STUDIO" />
      </div>

      {/* 12. FAQ 4+8 */}
      <Section id="faq" navTheme="light" className="border-b border-border">
        <Container>
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-14">
            <TextReveal className="space-y-5 lg:col-span-4">
              <ChapterCard
                index="VIII"
                eyebrow={tFaq("allCta")}
                title={tFaq("title")}
              />
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
        className="surface-invert surface-glow border-b border-border"
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
                  "cta-lift h-11 rounded-full bg-surface-contrast-foreground px-6 font-medium text-surface-contrast hover:bg-surface-contrast-foreground/90"
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
                  "cta-lift h-11 rounded-full border-surface-contrast-foreground/30 bg-transparent px-6 text-surface-contrast-foreground hover:bg-surface-contrast-foreground/10"
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
                  "cta-lift h-11 rounded-full border-surface-contrast-foreground/30 bg-transparent px-6 text-surface-contrast-foreground hover:bg-surface-contrast-foreground/10"
                )}
              >
                {tCta("workWithMe")}
              </TrackedLink>
            </div>
            <div className="inline-flex flex-wrap items-center gap-2 rounded-full border border-surface-contrast-foreground/20 px-4 py-2.5 text-xs text-surface-contrast-foreground/70">
              <FileText className="size-3.5" />
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
