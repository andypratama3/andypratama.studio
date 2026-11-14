# COMPONENT-QA — D.3 × D.6 (10 titik)

> **Update 14 November 2026 (J7).** Sumber status tunggal: `docs/STATUS.md`.
> Dashboard **ada** (11 halaman, 21 server action ber-`requireOwner`); Drizzle + Better Auth terpasang.
> `pnpm test:e2e` → **69 passed** (bukan 21). Axe WCAG 2.x AA: 0 pelanggaran di 22 route ×
> light/dark (390px). Sweep 36 route × 7 viewport (320–1440): 0 overflow, 0 duplicate `id`,
> 0 heading skip, semua input berlabel. Matriks D.6 di bawah adalah arsip 9 Nov 2026.

Tanggal: 9 November 2026 (setelah eksekusi penuh).  
Legenda: ✅ lulus · ⚠️ sebagian · ❌ gagal · — tidak relevan · ⏳ e2e/manual

Titik D.6: (1) token (2) dua tema AA (3) 375/768/1280 (4) keyboard (5) SR/axe (6) keadaan D.4 (7) reduced-motion/no-JS (8) konsol bersih (9) bundel (10) events.ts

## D.3.1 Layout & nav

| Komponen | Ada? | Catatan |
|---|---|---|
| SkipLink | ✅ | Site + dev layout; e2e Tab focus |
| FloatingNav | ✅ | IO probeY=72; events via path cards |
| LocalNav | ✅ | DualBrand |
| LanguageSwitcher / ThemeToggle | ✅ | Header |
| Footer + FootnoteList | ✅ | ¹ tautan StatsGrid |

## D.3.2 Hero

| Komponen | Ada? | Catatan |
|---|---|---|
| HeroVisual | — | dihapus 14 Nov 2026 (dead code); hero pakai poster statis + `ScrollParallax` |
| WordmarkMarquee | ✅ | Pause + reduced-motion static |
| AudienceRoutes | ✅ | path-card di Home |
| AvailabilityBadge | — | kosong = tidak render |

## D.3.3 Home isi

| Komponen | Ada? | Catatan |
|---|---|---|
| StatsGrid / StatBlock | ✅ | menolak unverified |
| IntroVideo | ✅ | poster; sources opsional |
| WorkRows / HairlineTable | ✅ | |
| SakolentraDiagram | ✅ | defaults aman |
| DualBrandPreview | ⚠️ | BrandToggle; ScrollSequence belum (aset) |
| StickySteps | ✅ | CSS sticky |
| FaqAccordion | ✅ | shadcn accordion + track |
| NewsletterForm | ✅ | honeypot + rate limit + file mail |
| FinalCta | ✅ | |

## D.3.4 Halaman lain

| Halaman | Status |
|---|---|
| ContactForm | ✅ Suspense + API |
| Services HighlightsTabs | ✅ |
| Product DualBrand | LocalNav + preview |
| Legal / stub pages | PublicPageShell |
| /dev/wiring · /dev/components | ✅ inventory + gallery |

## D.3.5 Dashboard

**Ada** (11 halaman, 21 server action ber-`requireOwner`) — dikoreksi 13 Nov 2026; Drizzle + Better Auth terpasang.

## Galeri & e2e

- `/dev/components` — D.4 panels (idle/loading/empty/error/success/disabled)
- `pnpm test:e2e` — Home skip-link + axe; theme; **15 route axe** (`tests/wiring/pages-axe.spec.ts`)

## Cross-check 9 Nov 2026 (improve-ui + a11y + browser)

| Temuan | Severity | Status |
|---|---|---|
| Footnote angka Home di Footer semua halaman | HIGH | Diperbaiki (hanya `/`) |
| `/start` stub padahal CTA utama | HIGH | Form contact di `/start`; `/contact` → redirect |
| FAQ title/desc salah (stubNote) | MEDIUM | `faqPage` messages |
| Tidak ada not-found branded | MEDIUM | `[locale]/not-found.tsx` |
| Stub tanpa jalan keluar | MEDIUM | CTA → `/start` di PublicStubPanel |
| `/go/*` 404 | HIGH | Route + registry; sosial ditunda sampai URL Owner |
| `/work` + `/work/sakolentra` stub | HIGH | Diisi dari messages Home |
| `/license` kosong di jalur DualBrand | MEDIUM | Overview + Gumroad/FAQ (tanpa klausul dikarang) |

Verifier: `pnpm test:e2e` → **69 passed** (14 Nov 2026; 65 passed setelah J7, 63 passed pada 13 Nov; arsip 9 Nov mencatat 21 passed).

Owner: tambah profil sosial di `src/content/outbound-links.ts` bila URL sudah diverifikasi.
