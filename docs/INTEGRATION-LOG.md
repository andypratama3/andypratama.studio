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

## I3 — Settings publik dari DB

- `src/lib/site-settings.ts`: `getAvailabilityNote(locale)` membaca `site_settings.availability` (zod), null jika kosong/DB down.
- `/about` dan `/media-kit` (en/id) memakai catatan dari DB, fallback ke teks i18n.
- Form dashboard memakai enum D-08: `open_fulltime | open_project | closed`.
- `updateSiteSetting` melakukan `revalidatePath("/", "layout")` agar badge publik ikut segar.
- Bukti: ubah catatan via action → `curl /about` dan `/id/about` memuat catatan baru.

## I4 — Kelengkapan tulis dashboard

- Action baru: `setLinkActive`, `createSale`, `updateLeadDetails`, `unsubscribeSubscriber`, `approveSubscriber`.
- `resolveAgentTask` menolak tugas yang statusnya bukan `butuh_persetujuan`.
- UI: form penjualan manual (products), kolom status tautan (links), aksi subscriber + ekspor CSV (settings), form stage/segment/UTM (leads).
- `GET /api/dashboard/subscribers.csv`: owner-only, kolom email/locale/status/created_at/confirmed_at/source_utm, tanpa token, `no-store`.
- Bukti (cookie owner): tanpa auth 401; dengan auth 200 CSV. Action diuji lewat route sementara: availability → tampil publik; approve → `confirmed`; unsubscribe → `unsubscribed`; toggle link → `/go` jatuh ke fallback saat nonaktif dan 302 normal saat aktif; lead → `dihubungi/perekrut/ui-verify`; sale → baris `direct/19.00/manual`.
- Bukti: typecheck 0, lint 0, 19 file / 55 test lulus, build sukses.

## I5 — API agen per-key

- `agents.api_key_hash` + `can_write` sudah ada di migrasi awal; tidak perlu migrasi baru.
- `src/lib/agent-key.ts`: hash SHA-256, format `ap_` + 43 base64url, parser Bearer (murni, bisa dites).
- `src/lib/agent-auth.ts`: lookup hash + agen aktif, `timingSafeEqual`, fail-closed; `agentCanWrite`.
- Route `/api/agent/tasks`: tanpa bypass dev/master secret; GET butuh key; POST harus cocok `agentSlug`, scope `tasks`, rate limit per agen; gate selalu `butuh_persetujuan`; tulis `agent_messages`.
- `pnpm agent:key <slug>` (issue) / `--revoke`. Kunci mentah hanya tampil sekali.
- `.env.example`: `AGENT_SECRET_KEY` dihapus.
- Bukti: tanpa key 401, key salah 401, GET valid 200, slug salah 403, POST valid 201 + `butuh_persetujuan`; revoke → 401; issue ulang → 200.
- Test baru: `tests/agent-auth.test.ts` (hash, format, parser, auth) → total 55 test.

## I6 — Operasional

- `next.config.ts`: `output: "standalone"`; build menghasilkan `.next/standalone/server.js`.
- `pnpm start:standalone` (`scripts/start-standalone.mjs`) menyalin `public` + `.next/static` lalu menjalankan server standalone; dipakai Playwright.
- `Dockerfile` multi-stage (deps → builder → runner non-root; target `migrator`).
- `docker/docker-compose.prod.yml`: db + migrate (sekali jalan) + app, healthcheck, env dari `.env.production`.
- `.dockerignore` ditambahkan.
- `scripts/backup.sh`: dump `--single-transaction --set-gtid-purged=OFF`, enkripsi GPG default, retensi 14 hari, `BACKUP_ENCRYPT=0` untuk uji lokal.
- Bukti backup: dump 33K, restore ke DB bersih `studio_restore_test` → 21 tabel, 6 agen, 1 lead; DB uji dihapus. Jalur enkripsi diuji dengan keyring sementara → dekripsi membaca header dump.
- CI sudah ada (`.github/workflows/ci.yml`): typecheck, lint, unit, build, e2e.
- Redirect legacy ada di `next.config.ts`; CSP + header keamanan aktif.
- Belum: build image Docker (Docker tidak terpasang di mesin ini), email/analitik/anti-spam produksi (D-01…D-04), deploy/DNS.

## Verifikasi kumulatif I3–I6

```text
pnpm typecheck → 0 error
pnpm lint → 0 error
pnpm test → 19 files / 55 tests passed
pnpm build → sukses, .next/standalone/server.js ada
pnpm test:e2e → 61 passed (PORT=3001, standalone server), dijalankan 2×
```
