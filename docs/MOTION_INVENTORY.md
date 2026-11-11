# Inventaris gerak — 11 November 2026

Tabel di bawah adalah inventaris **sebelum** perbaikan. Daftar komponen dan aturan yang berlaku sekarang ada di `docs/MOTION.md`.

Sumber: `rg` pada pohon kerja cabang `motion/polish` setelah komit `a4a0dbd`. Bukan dari ingatan dan bukan dari graph (indeks graph terakhir `2026-11-10T01:35:14Z`, sebelum berkas chapter/intro yang baru masuk).

Mesin yang terpasang: `motion` `14.11.1` (`LazyMotion features={domMax}`). `gsap`, `lenis`, dan `unicornstudio-react` tidak ada di `package.json`. `src/lib/wiring.ts` menandai Lenis `skipped`, GSAP `skipped`, Unicorn `partial`.

## Komponen

| Berkas | Ekspor | Mesin | Pemakai (dari impor / JSX) |
|---|---|---|---|
| `src/components/brand/use-motion-ok.ts` | `useMotionOk` | `useSyncExternalStore` pada `prefers-reduced-motion`; snapshot server `false` | 14 berkas klien di bawah, kecuali `hero-visual`, `wordmark-marquee`, `sakolentra-diagram` |
| `src/components/brand/reveal.tsx` | `Reveal`, `TextReveal`, `MediaReveal`, `PanelReveal`, `Stagger` | Motion `m` + satu `IntersectionObserver` per instance | Home, `public-page`, journal, services, products, faq, footer, chapter-card, work slug, terms, privacy, links, cv, about, work, sign-in, dualbrand, not-found, contact-form, dualbrand-preview, license, hairline-table, stats-grid, start |
| `src/components/brand/hero-entrance.tsx` | `HeroEntrance`, `HeroBeat` | Motion variants | Tidak ada pemakai |
| `src/components/brand/hero-scene.tsx` | `HeroScene` | Slot + `HeroVisual` | Tidak ada pemakai. `wiring.ts` hanya menyebut namanya |
| `src/components/brand/hero-visual.tsx` | `HeroVisual` | Motion `useSpring` + CSS `hero-fade` / `animate-hero-grid-drift` | Hanya `hero-scene.tsx` |
| `src/components/brand/studio-intro.tsx` | `StudioIntro` | `useEffect` + `setTimeout(1100)` + `sessionStorage` | Home |
| `src/components/brand/floating-nav.tsx` | `FloatingNav` | `useScroll()` global + `useSpring` + `layoutId="site-nav-pill"` | `header.tsx` (semua halaman situs) |
| `src/components/brand/chapter-rail.tsx` | `ChapterRail` | `useScroll()` global + `useSpring` | Home |
| `src/components/brand/depth-gauge.tsx` | `DepthGauge` | `useScroll()` global + `useSpring` | Home |
| `src/components/brand/local-nav.tsx` | `LocalNav` | Motion `layoutId="local-nav-line"` | `products/dualbrand` |
| `src/components/brand/scroll-bridge.tsx` | `ScrollBridge` | `useScroll({ target })` | Home |
| `src/components/brand/scroll-media.tsx` | `ScrollMedia`, `ScrollDepth` | `useScroll({ target })`; `ScrollMedia` memakai `will-change-transform` | `ScrollDepth` di home. `ScrollMedia` tidak dipakai |
| `src/components/brand/sticky-steps.tsx` | `StickySteps` | `IntersectionObserver` + CSS sticky | Home dan `dev/components` |
| `src/components/brand/practice-cube.tsx` | `PracticeCube` | `useScroll({ target })` + `useSpring(useTransform)` | Home |
| `src/components/brand/magnetic.tsx` | `Magnetic` | `useMotionValue` + `useSpring`; `getBoundingClientRect` di `pointermove` | Home, `local-nav`, `floating-nav`, `contact-form` |
| `src/components/brand/wordmark-marquee.tsx` | `WordmarkMarquee` | CSS marquee + `matchMedia` sendiri + tombol jeda | Hanya `dev/components` |
| `src/components/brand/page-transition.tsx` | `PageTransition` | React `ViewTransition` `enter="auto" exit="auto" default="none"` | Langsung: home, journal, terms, work slug, links, cv, privacy, about, dualbrand, not-found. Lewat `PublicPageShell`: products, services, work, license, start, faq |
| `src/components/brand/media-frame.tsx` | `MediaFrame` | Motion | Tidak ada pemakai |
| `src/components/brand/sakolentra-diagram.tsx` | `SakolentraDiagram` | Motion + `useReducedMotion` | Home, work slug |
| `src/components/providers/motion-provider.tsx` | `MotionProvider` | `LazyMotion` `domMax` `strict` | Layout klien |
| `src/app/globals.css` | kelas di bawah | CSS | Seluruh kanvas publik |

`/contact` tidak merender gerak. Berkas itu hanya `redirect` ke `/start`.

## CSS yang benar-benar dipasang di JSX

| Kelas | Dipasang di |
|---|---|
| `hero-beat` | Home hero (nama, deskripsi, sel strip) |
| `fluid-neon` / `fluid-neon-letter` | Kata kedua hero |
| `view-rise` | Pita marquee home, `footer.tsx` |
| `fluid-marquee-track` | Pita marquee home. Tidak ada tombol jeda |
| `cta-lift`, `path-card`, `soft-card`, `interactive-surface` | Komponen merek / tautan |
| `practice-cube` / `practice-face` | `PracticeCube` saat gerak diizinkan |

Kelas yang ada di CSS dan tidak muncul di `src/**/*.tsx`: `reveal-block`, `reveal-enter`, `js-reveal`, `nav-enter`, `hero-parallax`. `hero-fade` dan `animate-hero-grid-drift` hanya ada di `hero-visual.tsx`, yang tidak terpasang di rute.

## Token

`src/lib/motion.ts`: `fast` 0.18, `base` 0.24, `slow` 0.55, `text` 0.9, `media` 1.05, `hero` 1.2, `ease` `[0.22, 1, 0.36, 1]`, `easeInOut` `[0.45, 0, 0.55, 1]`, `enterY` 40.

`globals.css` `:root`: `--dur-fast: 180ms`, `--dur-base: 240ms`, `--dur-slow: 550ms`, `--ease-out: cubic-bezier(0.22, 1, 0.36, 1)`. Tidak ada variabel CSS untuk `text`, `media`, `hero`, atau `easeInOut`. Angka mentah yang masih tersebar meliputi `220ms`, `280ms`, `320ms`, `720ms`, `1100ms`, `36s`, `48s`.

## Tiga `useScroll()` global di Home

`FloatingNav` (`floating-nav.tsx` baris 46), `ChapterRail` (baris 22), `DepthGauge` (baris 15). Masing-masing membuat pegas sendiri. `PracticeCube`, `ScrollDepth`, dan `ScrollBridge` memakai `useScroll({ target })`, jadi bukan pendengar dokumen yang sama.
