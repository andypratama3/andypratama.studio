# INTEGRATION-LOG — eksekusi `docs/INTEGRATION-PLAN.md`

Cabang: `feat/full-integration` (dari `motion/polish`).
Ledger: satu baris per tugas + ruling. Bukti perintah, bukan klaim.

## I0 — DB bootstrap

- I0-01 docker compose (`docker/docker-compose.yml`) + `scripts/db-up.mjs` / `db-down.mjs` + script `db:up|db:down`.
- I0-02 `.env.local` dibuat (gitignored): DATABASE_URL, BETTER_AUTH_SECRET, OWNER_EMAIL, OWNER_SETUP_TOKEN, MAIL_TRANSPORT=file.
- I0-03 `pnpm db:migrate` → applied. 20 tabel.
- I0-04 `pnpm db:seed` 2× → agents 6 (5 aktif + owner nonaktif), products 1, projects 4, links 5, site_settings 2. Idempoten.
- I0-05 `wiring.ts` diperbarui; `pnpm wiring:check` → ok=13 partial=1 missing=0 skipped=2.
- Ruling: Docker tidak terpasang di mesin ini → pakai MySQL lokal (brew, port 3306). Compose tetap disediakan untuk CI/produksi.
- Ruling: `seed.ts`/`import-csv.ts` tidak lagi auto-run saat diimpor (menyebabkan seed jalan 2× dan duplikat).
- Ruling: D-07 — `owner` dihapus dari roster seed; baris lama dinonaktifkan (bukan dihapus).
- Ruling: `availability.status` seed → `open_project` (enum D-08).
- Dependency: `tsx@4.23.15` (dev) untuk menjalankan seed/import TS di Node 26 ESM. Sudah ada di store sebagai transitif drizzle-kit.
- Bukti: typecheck 0, test 49/49, build sukses.

## I1 — Auth fail-closed

- `src/proxy.ts`: `/dashboard` (+ `/id/dashboard`) tanpa cookie sesi → 307 `/sign-in`.
- `(dashboard)/layout.tsx`: bypass hanya `DASHBOARD_DEV_BYPASS=1` dan bukan produksi.
- `(auth)/layout.tsx`: sesi aktif → redirect `/dashboard`.
- `/api/owner/bootstrap`: token header `x-bootstrap-token`, hanya email `OWNER_EMAIL`, 404 jika token kosong.
- Bukti: tanpa sesi `GET /dashboard` → 307 `/sign-in`; login owner → `/dashboard` 200; `/sign-in` dengan sesi → 307 `/dashboard`.

## I2 — Tulis publik → DB

- I2-01 `POST /api/contact` → insert `leads` (platform email, segment dari topik, notes `[topic] message`), notifikasi email tetap. Bukti: 1 baris `leads` (sekolah).
- I2-02/03 newsletter pindah dari file ke tabel `subscribers` (`src/lib/newsletter.ts`), token hash, single-use. Kolom `unsubscribe_token_hash` (migrasi 0001).
- I2-04 `GET /api/newsletter/unsubscribe` + halaman `/newsletter?state=...` (en/id). Bukti: confirmed → unsubscribed.
- I2-05 `/go/[slug]` baca tabel `links` (fallback konten), insert `link_clicks` (slug, waktu, referrer host; tanpa IP/UA). Bukti: 0 → 1 baris.
- I2-06 Ruling: `/links` tetap kurasi konten (bukan tabel `links`), karena tabel `links` berisi redirect UTM untuk bio — bukan daftar tautan publik.
- I2-07 Ruling: unduhan CV ditunda sampai aset A-03 ada; `/cv` tetap CTA "request CV" (tidak ada PDF di repo).
- Migrasi: `drizzle/0001_kind_grandmaster.sql` (`links.active`, `subscribers.unsubscribe_token_hash`).
- Bukti: newsletter pending → confirmed → token reuse invalid → unsubscribed; `/go/threads-start` 302 + tercatat.

## Verifikasi kumulatif I0–I2

```text
pnpm typecheck → 0 error
pnpm lint → 0 error
pnpm test → 18 files / 49 tests passed
pnpm build → sukses
pnpm wiring:check → ok=13 partial=1 missing=0 skipped=2
```
