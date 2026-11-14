# INTEGRATIONS — Matriks alat vs bukti

> **Update 14 November 2026 (J7).** Angka tes: `pnpm test` → 23 file / 68 tes; `pnpm test:e2e` → 65 passed.
> Sumber status tunggal: `docs/STATUS.md`. `react-hook-form` **dipakai** di `src/components/brand/contact-form.tsx`.
> Motion final `domAnimation` (`src/components/providers/motion-provider.tsx`), bukan `domMax`.
> Klien DB lazy (`src/db/index.ts`) → `pnpm build` lulus tanpa `DATABASE_URL`.
> `PLAYWRIGHT_CHANNEL` sebagai escape hatch untuk mesin tanpa browser Playwright terunduh.
>
> **Update 12 November 2026.** Status terkini (bukan Batch 0):
>
> | Alat | Status | Bukti |
> |---|---|---|
> | drizzle-orm + drizzle-kit + mysql2 | ok | 21 tabel aplikasi, migrasi `0000`–`0002`, seed idempoten (diverifikasi 14 Nov) |
> | better-auth | ok | owner-only, proxy + layout guard, bootstrap token; fail-closed saat runtime |
> | react-hook-form + zod | ok | contact form RHF; route zod (contact/newsletter/agent) |
> | nodemailer | sebagian | file transport dev; SMTP produksi menunggu D-01 |
> | vitest | ok | 23 file / 68 test |
> | Playwright + axe | ok | `pnpm test:e2e` → 65 passed (server standalone) |
> | Docker | sebagian | Dockerfile + compose produksi ada; image belum dibangun |
> | Backup | ok | `scripts/backup.sh`; dump + restore DB bersih teruji; enkripsi GPG teruji |
> | Analytics (Umami) | menunggu D-02 | env + `track()` no-op; tidak ada script dimuat |
> | Unicorn Studio | menunggu A-08 | slot + fallback statis |
>
> Matriks di bawah adalah arsip Batch 0 (9 Nov 2026).


Tanggal: 9 November 2026.  
Sumber: `package.json`, `pnpm list`, `ls`, `grep`, output Batch 0 (`pnpm typecheck|lint|test|build|test:e2e`).  
Aturan: baris tanpa bukti = **tidak terbukti**. Dilarang menulis "terintegrasi" tanpa bukti.

| Alat / plugin | Di package.json? | Dipakai di kode? | Status | Bukti |
|---|---|---|---|---|
| Next 16.4 + React 19.3 + TS | ya (`next@16.4.4`, `react@19.3.1`) | ya | terbukti | `pnpm build` → Next.js 16.4.4; `pnpm typecheck` exit 0 |
| Tailwind v4 + postcss + tw-animate | ya | ya (`globals.css` @import) | terbukti | `pnpm build` exit 0; file `postcss.config.mjs` |
| shadcn CLI + Base UI base-nova | ya (`shadcn@4.23.0`, `@base-ui/react@1.9.0`) | **14** komponen di `src/components/ui/` | sebagian | `ls src/components/ui` = accordion, button, form, input, label, select, sheet, skeleton, sonner, table, tabs, textarea, toggle, tooltip |
| lucide-react, cva, cn | ya (`cn@0.5.2`) | ya | terbukti | `pnpm list cn`; `src/lib/utils.ts` re-export; B-12 koreksi: cn sah |
| next-themes, next-intl | ya | ya | terbukti | locale layout + ThemeProvider; e2e theme toggle lulus |
| motion 14 | ya (`motion@14.11.1`) | `LazyMotion` `domAnimation`; reveal, scroll bridge, nav progress | terpasang | `src/components/providers/motion-provider.tsx`; `domMax` tidak dipakai |
| sonner | ya | langsung `toast` di form (bukan wrapper shadcn sonner) | sebagian | `contact-form.tsx` / `newsletter-form.tsx` import `sonner` |
| react-hook-form + resolvers | ya | ya — `useForm` di `src/components/brand/contact-form.tsx` (+ `src/components/ui/form.tsx`) | terpakai | `grep -rn useForm\\|react-hook-form src` → kosong (kecuali dep) |
| zod 4 | ya | API route | sebagian | `api/contact`, newsletter |
| nodemailer | ya | `lib/mail.ts` | di luar spec §4; menunggu D-01 | dep + file ada; SMTP produksi belum |
| vitest + RTL + jsdom | ya | `vitest.config.ts` ada; 7 file unit test | sebagian (bukan "kosong") | `pnpm test` → 7 files / 17 tests; config **ada** di repo (klaim arsip "tidak ada config" = salah untuk repo ini) |
| Playwright + axe | ya | `playwright.config.ts` + `tests/wiring/*` | terbukti setelah install browser | `pnpm test:e2e` → **21 passed** (9 Nov 2026) |
| eslint 9 + prettier | ya | `eslint.config.mjs`, `.prettierrc` ada | terbukti | `pnpm lint` exit 0 |
| unicornstudio-react | **tidak** | HeroScene slot saja | belum | `pnpm list` tidak memuat; menunggu A-08 |
| Realtime Colors / token gelap | n/a | token di `globals.css` | terbukti kode; verifikasi manual Owner | hex hanya di globals; kontras AA penuh = Batch 3 |
| Jiro MCP | n/a | tidak | tidak terbukti | REFERENCES: MCP belum; tidak ada tool call |
| shadcn MCP / Next devtools MCP | n/a | tidak | tidak terbukti | `.mcp.json` **tidak ada** di repo (`test -f .mcp.json` → MCP=no) |
| Higgsfield | n/a | tidak | terblokir / menunggu Owner | REFERENCES / A-01 |
| Referensi Velto/Norvane/… | n/a | pola diadopsi | tercatat | `docs/REFERENCES.md` ada; bukan "terintegrasi SDK" |
| drizzle-orm / drizzle-kit / mysql2 | **tidak** | `drizzle/` kosong; `src/db/` hilang | belum | `ls drizzle` kosong; tidak di package.json |
| better-auth | **tidak** | tidak | belum | tidak di package.json |
| Dashboard UI (@tanstack/react-table, recharts, date-fns, react-day-picker, nuqs, cmdk, vaul) | **tidak** | — | belum | tidak di package.json |
| MDX (@next/mdx / next-mdx-remote) | **tidak** | — | belum | tidak di package.json |
| @lhci/cli | **tidak** | — | belum | tidak di package.json |

## Catatan Batch 0

- Klaim arsip "vitest.config / tests tidak ada" **salah untuk repo asli** — keduanya ada.
- Klaim arsip "Playwright tak terbukti" **dibatalkan** oleh `pnpm test:e2e` 21 passed setelah `playwright install chromium`.
- Integrasi Unicorn / Jiro / Higgsfield / dashboard paket = **menunggu Owner** (lihat prompt v4.1 §4 dan O-*).

## Urutan berikutnya

Batch **1** (konten/hukum B-01…B-06, B-11, B-14, B-15) — **belum dimulai**; butuh persetujuan Owner.
