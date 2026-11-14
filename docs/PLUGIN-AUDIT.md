# PLUGIN-AUDIT — Status nyata vs Lampiran C.1 / D.5

> **Update 14 November 2026 (J7).** Sumber status tunggal: `docs/STATUS.md`.
> Koreksi: motion memakai `domAnimation` (bukan `domMax`); drizzle + better-auth **sudah terpasang**
> (21 tabel aplikasi, owner-only, fail-closed saat runtime); `react-hook-form` dipakai di contact form;
> `pnpm test:e2e` → 65 passed; `pnpm build` lulus tanpa `DATABASE_URL`/`BETTER_AUTH_SECRET`.
> Isi di bawah adalah arsip 9 Nov 2026.

Tanggal: 9 November 2026 (eksekusi penuh Owner).

Sumber: `package.json`, `components.json`, `src/lib/wiring.ts`, `/dev/wiring`.

## Ringkas

| Plugin | Status | Bukti |
|---|---|---|
| Next 16 + React 19 + next-intl + next-themes | ok | locale layout |
| motion (LazyMotion) | ok | `MotionProvider` + `domAnimation` (13 Nov 2026); reveal/scroll Motion; marquee hero tetap CSS |
| sonner | ok | AppToaster |
| shadcn G1 (accordion, tabs, table, tooltip, skeleton, toggle) | ok | `src/components/ui/*` |
| react-hook-form + zod server | partial | RHF terpasang; form publik pakai fetch + zod server |
| nodemailer file transport | ok | `src/lib/mail.ts` → `tmp/outbox.jsonl` |
| rate-limit | ok | contact + newsletter |
| events.track | ok | `src/lib/events.ts` |
| ViewTransition | ok | `PageTransition` di Home + PublicPageShell |
| Playwright + axe | ok | `tests/wiring/*`, `pnpm test:e2e` |
| lenis | skipped | ditunda Owner A.7 |
| gsap | skipped | ditolak ukuran |
| unicornstudio-react | partial | slot hero + fallback statis; SDK menunggu A-08 |
| drizzle-orm | ok (13 Nov 2026) | 20 tabel aplikasi, migrasi `0000`–`0002`; arsip lama mencatat `missing` |
| better-auth | ok (13 Nov 2026) | owner-only + proxy/layout guard; arsip lama mencatat `missing` |

## Perintah verifikasi

```bash
pnpm lint && pnpm typecheck && pnpm test && pnpm build
pnpm wiring:check
pnpm test:e2e   # uses `pnpm start` + ENABLE_DEV_ROUTES=1 (not next-dev)
```

Catatan e2e: `reuseExistingServer: false`. Stale `next-dev` HMR websocket memutus hidrasi client (setTheme no-op).

## Gate Owner (tidak dikerjakan tanpa persetujuan)

- SMTP produksi (`SMTP_HOST`)
- Unicorn project ID / aset DualBrand nyata
- Schema drizzle + auth + dashboard
- Deploy / publish
- Ubah `facts.ts`
