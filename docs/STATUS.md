# STATUS — sumber tunggal status proyek

Update: **13 November 2026**. Cabang `main`, commit `2749615` + perubahan J0.
Dokumen lain (`PLUGIN-AUDIT`, `COMPONENT-QA`, `LAYOUT-AUDIT`, `REFERENCES`, `INTEGRATIONS`, `MOTION`)
menunjuk ke halaman ini untuk status; isi mereka adalah arsip bertanggal.

## Tabel status (satu-satunya)

| Area | Status | Bukti | Tanggal |
|---|---|---|---|
| Typecheck & lint | ok | `pnpm typecheck` 0 error, `pnpm lint` 0 error | 13 Nov 2026 |
| Unit test | ok | `pnpm test` → 21 file / 62 tes lulus | 13 Nov 2026 |
| Build | ok | `pnpm build` sukses; `.next/standalone/server.js` ada | 13 Nov 2026 |
| E2E + axe | ok | `PORT=3001 … pnpm test:e2e` → 63 passed | 13 Nov 2026 |
| Wiring | sebagian | `ok=13 partial=1 missing=0 skipped=2`; partial `unicornstudio-react` (A-08), skipped `lenis`/`gsap` | 13 Nov 2026 |
| Database | ok | MySQL lokal 21 tabel, migrasi `0000`–`0002`, seed idempoten | 13 Nov 2026 |
| Auth owner | ok | `/dashboard` tanpa sesi → 307 `/sign-in`; login browser + `scripts/set-owner-password.mjs` teruji | 13 Nov 2026 |
| Tulis publik → DB | sebagian | kontak → `leads` (dengan `email`), newsletter double opt-in, `/go` → `link_clicks`; email masih transport `file` (D-01) | 13 Nov 2026 |
| Baca publik dari DB | sebagian | availability (`site_settings`) + gate produk; sisanya konten statis (by design) | 12 Nov 2026 |
| Dashboard | sebagian | 11 halaman, server action ber-`requireOwner`; validasi link/harga/lead (Zod), banner DB down, export CSV aman formula | 13 Nov 2026 |
| API agen | ok | per-key SHA-256, scope, gate `butuh_persetujuan` | 12 Nov 2026 |
| Operasional | sebagian | Dockerfile + compose ada (image belum di-build), backup + restore teruji, CI ada | 12 Nov 2026 |
| SEO / metadata | belum diaudit | J6 belum dijalankan; sitemap/robots dasar ada | 13 Nov 2026 |
| Aksesibilitas | sebagian | 63 tes e2e memuat axe public routes; dashboard axe & matriks viewport ada di J2/J5 | 13 Nov 2026 |
| Dokumen | ok | 13 dokumen tersisa; 5 audit motion + 2 rencana superpowers dihapus, rujukan nol | 13 Nov 2026 |
| Font | ok | Inter di-vendor `src/fonts/inter-latin.woff2` (48.432 B, OFL); `next/font/local`; 0 permintaan `fonts.gstatic.com` | 13 Nov 2026 |

## Menunggu Owner

| Kode | Keputusan |
|---|---|
| D-01 | provider email transaksional |
| D-02 | analitik: Umami vs Plausible |
| D-03 | anti-spam: honeypot vs Turnstile |
| D-04 | rate limit persisten: DB vs Cloudflare |
| A-03 | CV PDF EN + ID |
| A-08 | Unicorn Project ID + frame |
| X-05 | GitHub OAuth client ID/secret |
| — | deploy/DNS, ubah `facts.ts`, harga, hapus data |

---

# Arsip — Rekonsiliasi Batch 0

Tanggal: 9 November 2026.  
Cabang: `rebuild/studio` (belum ada commit; seluruh tree masih untracked).  
Aturan: tidak ada baris "ok/lulus" tanpa output perintah di laporan Batch 0.  
Matriks alat/plugin (v4.1 §1): lihat `docs/INTEGRATIONS.md`.

## Inventaris file §1.1 (repo asli vs klaim arsip)

| Item | Di repo asli? | Catatan |
|---|---|---|
| `package.json` | **ada** | tidak masuk arsip audit |
| `pnpm-lock.yaml` | **ada** | |
| `next.config.ts` | **ada** | bukan `next.config.mjs` |
| `eslint.config.mjs` | **ada** | |
| `postcss.config.mjs` | **ada** | |
| `next-env.d.ts` | **ada** | di-gitignore juga |
| `.env.example` | **ada** | |
| `.gitignore` | **ada** | memuat `/tmp/`, `.env` |
| `tests/` | **ada** | unit + `tests/wiring/` |
| `playwright.config.ts` | **ada** | |
| `vitest.config.ts` | **ada** | |
| `docker/` | **hilang** | |
| `.github/` | **hilang** | |
| `src/db/` | **hilang** | |
| `drizzle/` | **ada, kosong** | hanya direktori |

Ukuran kode (perintah Batch 0): **92** file `.ts`/`.tsx` di `src/`; **6514** baris total (`wc -l`).

## Verifikasi perintah (9 Nov 2026)

| Perintah | Exit | Ringkas bukti |
|---|---:|---|
| `pnpm install --frozen-lockfile` | 0 | pnpm v12.18.0 |
| `pnpm typecheck` | 0 | `tsc --noEmit`; passes in 1.8s with 0 errors |
| `pnpm lint` | 0 | ESLint pass 0 errors |
| `pnpm test` | 0 | **10 files / 38 tests passed** (1.18s) |
| `pnpm build` | 0 | Next.js 16 App Router optimized build in 4.31s (all 42 pages SSG/SSR) |
| `pnpm wiring:check` | 0 | `ok=9 partial=2 missing=2 skipped=2`; Playwright installed |
| `PORT=3001 PLAYWRIGHT_BASE_URL=http://127.0.0.1:3001 pnpm test:e2e` | 0 | **21 passed (4.4s)**; 0 axe violations across all public routes |
| Lightpanda semantic tree Home | 0 | Validated semantic accessibility tree, headings, links, interactive controls, and articles |
| Cinematic scroll storytelling | complete | Hero staggered reveals (0–360ms), edge-fade marquee, SAKOLENTRA/DualBrand staggered columns, StickySteps elevation shadows, final CTA reveal |
| Supplied reference videos | reference-only | `/Users/andypratama3/Downloads/velto-hero.mp4` dan `detail-v2.mp4` tetap murni referensi desain UI; tidak ada aset/runtime video disalin ke repo |

Git remote:

```text
origin https://github.com/andypratama3/andypratama.studio.git
```

Tidak ada commit atau push otomatis.

## package.json — jawaban B-12 / versi

Paket **`cn` ada**: dependency langsung `"cn": "^0.5.2"` (+ transitif `cn@0.2.6` via `shadcn`).  
Deskripsi npm lokal: "Fast, small, compiled class-name merging for Tailwind CSS…"  
Ukuran tree: `du -sh node_modules/.pnpm/cn@0.5.2` → **544K**.  
Impor `from "cn"`: 12 file di `src/components/ui/*` + `src/lib/utils.ts`.

| Paket | Versi di package.json |
|---|---|
| next | 16.4.4 |
| react | 19.3.1 |
| next-intl | ^4.14.9 (terpasang 4.14.9) |
| @base-ui/react | ^1.9.0 |
| motion | **terpasang** `motion@14.11.1` — LazyMotion `domMax`; hero choreography CSS; reveal dan scroll bridge Motion |

## Klaim PLUGIN-AUDIT.md → bukti Batch 0

| Klaim | Status |
|---|---|
| Next 16 + React 19 + next-intl + next-themes | **terbukti (output)** — build route + package.json |
| motion / sonner / shadcn G1 terpasang | **sebagian pada Batch 0** — sonner + shadcn ada; `motion` baru terpasang 9 Nov 2026 (`motion@14.11.1`, LazyMotion) |
| Playwright + axe; `pnpm test:e2e` | **terbukti (output)** — 21 passed *setelah* `playwright install`; klaim tanpa install browser = **salah** untuk sesi fresh |
| `pnpm wiring:check` | **terbukti (output)** — exit 0, ok=9 partial=2 missing=2 skipped=2 |
| drizzle-orm / better-auth missing | **terbukti** — tidak ada di package.json; `drizzle/` kosong |
| nodemailer file transport "ok" | **sebagian** — kode + dep ada; SMTP produksi / double-opt-in belum (lihat prompt v4 B-07/B-08) |
| ViewTransition "ok" | **tidak terbukti di Batch 0** — tidak diuji khusus; hanya ada di kode |
| "eksekusi penuh Owner" | **salah** — Gate 0/O-* belum; banyak stub MVP |

## Klaim COMPONENT-QA.md → bukti Batch 0

| Klaim | Status |
|---|---|
| `pnpm test:e2e → 21 passed` | **terbukti (output)** pada 9 Nov 2026 setelah install Chromium; **tidak terbukti** pada run pertama (browser hilang) |
| SkipLink / Home axe / theme toggle | **terbukti (output)** — termasuk di 21 tests |
| 15 route axe | **terbukti (output)** — `pages-axe.spec.ts` |
| FloatingNav "events via path cards" | **terbukti di source** — `TrackedLink` memanggil `audience_route_click` pada Home path cards (`src/app/[locale]/(site)/page.tsx:162-165`) |
| FAQ / forms / DualBrand "siap" | **sebagian** — komponen ada; kebenaran konten (harga, token FAQ, privacy) belum Batch 1 |
| Dashboard | **terbukti missing** |

## Catatan untuk Batch 1+

Jangan memperlakukan PLUGIN-AUDIT / COMPONENT-QA sebagai DoD. Gunakan tabel ini + output Batch 0. Temuan P0 (B-01…B-15) **belum dikerjakan** di Batch 0 (dilarang ubah fitur).

## Cross-check menyeluruh — 13 Nov 2026

Cakupan: 175 file `src/`, semua komponen brand/dashboard/ui, 397 key i18n en+id, route vs seluruh `href`, aset `public/media`, token motion, auth tiap API.

Perbaikan yang diterapkan:
- `ScrollParallax` kini layer `absolute inset-0` berukuran penuh (hero + wordmark tidak lagi 0px); gradient `color-mix` valid (tanpa fallback pucat).
- `/faq` memakai `getResolvedFaqItems` + `getFaqSettings`; item `pendingOwner`/token gagal tidak tampil. `reply_time` benar-benar dikonsumsi (format `{en,id}` dipetakan per locale).
- `/links` hanya menautkan `/go/*` yang `verified`; sisanya label status tanpa href.
- `/journal` CTA memakai topik valid (`other`), bukan `newsletter`.
- `FloatingNav` mengamati ulang `[data-nav-theme]` saat `pathname` berubah.
- Dashboard + `error.tsx` memakai Link locale-aware; error copy lewat namespace `errorPage` (en/id).
- `newsletter.ts`: re-subscribe mempertahankan status `confirmed`; unsubscribe menghapus hash token + `confirmedAt`.
- `updateSiteSetting` divalidasi Zod; `direction` outreach divalidasi enum.
- `/api/contact`: kegagalan mail setelah lead tersimpan tidak lagi 502 (mencegah lead duplikat).
- `DATABASE_URL`/`BETTER_AUTH_SECRET`/`OWNER_EMAIL` tanpa fallback rahasia; produksi fail-fast.
- `rateLimit` memangkas bucket (cap 10.000) agar memori stabil.
- Dead code dihapus: 8 komponen brand (termasuk `hero-visual`), `content/agent-characters.ts`, `getServerEnv`/`serverSchema`, 6 komponen shadcn tak terpakai.
- `FactProps.id` menyempit ke `FactId`; root `not-found` bilingual + inline style (tanpa ketergantungan token).

Verifikasi: `pnpm typecheck` 0 error · `pnpm lint` 0 masalah · `pnpm test` 62/62 (21 file) · `pnpm build` sukses 73/73 halaman · Playwright motion 4/4 (cube rotate + scroll bridge).

## Perbaikan bug scroll/neon — 14 November 2026
- `ScrollBridge` kata (`scroll-bridge.tsx`): ganti `inline-block whitespace-nowrap pr-[0.32em] last:pr-0` (spasi kata merata karena gap samar antar `inline-block`) → `flex items-center gap-[0.32em]` pada wadah + `whitespace-nowrap` pada tiap kata. Scroll marker merata.
- Neon (`word-neon.ts`): jendela neon sekarang mencakup rentang penuh scroll 0–1 (`slot = 1/count`, `start = index·slot`, `end = start + slot`) tanpa zona mati di ujung → neon menyelimuti progresif setiap kata saat di-scroll.

## Perbaikan rotasi cube — 14 November 2026 (commit 2f68757)
- `practice-cube.tsx`: `scrollEnabled` motion value mencegah scroll mempengaruhi rotasi saat drag; `baseYaw` motion value (bukan ref) menangkap yaw saat pointer down sehingga snap-to-90 (`yawAdjustToFace`) dihitung dari base yang frozen dan TETEP di posisi tersebut setelah discroll. `dragYaw` di-reset ke 0 saat pointer mulai.
- Verifikasi browser nyata (Playwright Chromium): error snap 0.000° untuk +90/−90/+180, tetep setelah scroll ±600px, tepat satu face tidak `inert`.
- Tambah `tests/motion/cube-rotate.spec.ts` dan `tests/motion/scroll-bridge.spec.ts` (Playwright, 4/4 lulus).
