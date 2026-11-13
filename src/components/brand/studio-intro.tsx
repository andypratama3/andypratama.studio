import { getTranslations } from "next-intl/server"

import { StudioIntroBoot } from "@/components/brand/studio-intro-boot"

/**
 * Home intro. CSS keeps it hidden until StudioIntroBoot opts in.
 * No-JS and reduced-motion never cover the page.
 */
export async function StudioIntro() {
  const t = await getTranslations("home.hero")

  return (
    <>
      <StudioIntroBoot />
      <div
        className="studio-intro surface-invert fixed inset-0 z-[var(--z-overlay)] items-center justify-center"
        role="dialog"
        aria-modal="true"
        aria-labelledby="studio-intro-title"
      >
        <p
          id="studio-intro-title"
          className="studio-intro__mark flex items-center gap-[0.14em] text-[clamp(4rem,12vw,7rem)] font-semibold tracking-[-0.06em] text-surface-contrast-foreground"
        >
          <span className="studio-intro__letter">A</span>
          <span
            aria-hidden
            className="studio-intro__diamond inline-block size-[0.38em] rotate-45 border-2"
          />
          <span className="studio-intro__letter studio-intro__letter--p">P</span>
        </p>
        <span aria-hidden className="studio-intro__progress" />
        <button
          type="button"
          data-studio-intro-skip=""
          className="absolute bottom-8 inline-flex min-h-11 items-center rounded-full px-4 text-sm text-surface-contrast-foreground/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
        >
          {t("skipIntro")}
        </button>
      </div>
    </>
  )
}
