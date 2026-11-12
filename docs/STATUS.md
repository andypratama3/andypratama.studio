# STATUS — Rekonsiliasi klaim vs bukti

> **Update 12 November 2026 — integrasi penuh (I0–I6).**
> Cabang `feat/full-integration`. Sumber kebenaran eksekusi: `docs/INTEGRATION-LOG.md`.
> Ringkas: MySQL lokal 20 tabel + seed idempoten; auth owner fail-closed; kontak → `leads`;
> newsletter double opt-in di DB; `/go` baca `links` + `link_clicks`; dashboard menulis
> settings/links/sales/leads/subscribers; API agen per-key; Dockerfile + compose produksi;
> backup terenkripsi teruji restore. Verifikasi: typecheck 0, lint 0, 55 test, build sukses.
> Masih tertahan persetujuan: email provider (D-01), analitik (D-02), anti-spam (D-03),
> rate-limit persisten (D-04), CV PDF (A-03), deploy/DNS. Dokumen di bawah adalah arsip
> Batch 0 (9 Nov 2026) dan tidak mencerminkan kondisi setelah integrasi.


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
