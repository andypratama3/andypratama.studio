# INTEGRATION-PLAN — Frontend ⇄ Backend sampai selesai

> **Update 13 November 2026 (J0-02).** Dokumen ini **arsip rencana** (baseline 12 Nov: 17 file/47 tes,
> MySQL mati). Eksekusi sebenarnya ada di `docs/INTEGRATION-LOG.md`; status tunggal di `docs/STATUS.md`.
> Angka baseline terkini: `pnpm test` 21 file / 62 tes, `pnpm test:e2e` 63 passed.
> `EXECUTION-PLAN.md` **tidak ada** di repo — rujukan ke berkas itu hanya historis.

Tanggal: 12 November 2026. Cabang: `motion/polish` (tree bersih, 3 commit terakhir).
Dokumen ini menggantikan status Fase 3–6 di `EXECUTION-PLAN.md` (masih menyebut DB/auth "belum", padahal sudah ada).
Aturan: satu fase = satu laporan + output perintah nyata. Tanpa output = belum selesai.

## 0. Baseline (diukur 12 Nov 2026)

| Perintah | Hasil |
|---|---|
| `pnpm typecheck` | exit 0 |
| `pnpm lint` | exit 0 |
| `pnpm test` | 17 file / 47 tes lulus |
| `pnpm build` | sukses, 42+ rute, `ƒ Proxy (Middleware)` |
| MySQL lokal | **mati** (`mysqladmin ping` gagal), `docker/` tidak ada |
| codebase-memory | terindeks ulang: **2.498 node / 4.423 edge**, generation 12 Nov 2026 |

Index ulang (MCP dimatikan, pakai CLI):

```bash
~/.local/bin/codebase-memory-mcp cli --progress index_repository '{"repo_path":"'"$PWD"'"}'
```

## 1. Peta integrasi nyata (bukan klaim docs lama)

| Permukaan | Frontend | Backend saat ini | Status |
|---|---|---|---|
| Kontak | `components/brand/contact-form.tsx` | `api/contact` → mail + `tmp/leads.jsonl` | **tidak masuk DB** |
| Newsletter | `components/brand/newsletter-form.tsx` | `api/newsletter/*` → `tmp/newsletter-confirmations.jsonl` | **tidak masuk DB**, tanpa unsubscribe |
| `/go/[slug]` | link CTA | `content/outbound-links` + `tmp/link-clicks.jsonl` | **tidak menulis `link_clicks`** |
| `/links` | halaman publik | slug hard-code | tidak baca tabel `links` |
| Harga/produk | `/products`, `/products/dualbrand` | `lib/public-product` → DB hanya untuk `status` | setengah terhubung |
| Availability | about / media-kit / products | teks dari `messages/*` | tidak baca `site_settings` |
| Dashboard baca | 10 halaman | Drizzle select + fallback kosong | **terhubung** |
| Dashboard tulis | `(dashboard)/actions.ts` | 13 server action + `requireOwner` | sebagian (tanpa sales, hapus, edit) |
| Auth | `/sign-in` | Better Auth + `requireOwner`; layout bypass di dev | **belum fail-closed** |
| Proxy | `src/proxy.ts` | `protectedPaths = []` | proteksi dashboard hanya di layout |
| Agent API | — | Bearer master secret + bypass di dev | belum token per agen |
| Analitik | `lib/events.ts` | `track()` no-op tanpa Umami | belum ada provider |
| Email | form | default `MAIL_TRANSPORT=file` | belum ada SMTP nyata |
| Rate limit | — | in-memory | reset saat restart |
| Docker/CI | — | tidak ada | belum |

## 2. Prinsip eksekusi

1. Urut I0 → I6. Tidak lompat.
2. Setiap server action/route: Zod + `requireOwner()`/token + `revalidatePath` yang benar.
3. Angka/testimoni hanya dari `src/content/facts.ts`. File itu **tidak disentuh** tanpa persetujuan.
4. Berhenti di `butuh_persetujuan` untuk: ubah harga, deploy, publish, kirim pesan, hapus data, ubah `facts.ts`.
5. Data siswa/VA/kredensial tidak masuk repo, log, atau fixture.
6. Verifikasi wajib per fase: `pnpm typecheck && pnpm lint && pnpm test`; tambah `pnpm build` di akhir fase.

## 3. Fase

### I0 — DB bootstrap & skrip (0,5 hari)

Tugas:
- I0-01 `docker/docker-compose.yml` (MySQL 8) + skrip `db:up`/`db:down` (sekarang `pnpm db:up` disebut di `AGENTS.md` tapi tidak ada).
- I0-02 `.env.local` dari `.env.example`; isi `DATABASE_URL`, `BETTER_AUTH_SECRET` (≥32 char), `BETTER_AUTH_URL`, `OWNER_EMAIL`.
- I0-03 Terapkan `drizzle/0000_fancy_scarecrow.sql` ke DB kosong; cek 20 tabel.
- I0-04 `pnpm db:seed` 2× idempoten; hitung baris sama (`agents=5`, `products`, `projects`, `links`, `site_settings`).
- I0-05 Perbaiki `scripts/wiring-check.mjs` + `src/lib/wiring.ts` yang masih menyebut drizzle/better-auth "missing".

Terima jika: `mysqladmin ping` OK, 20 tabel ada, seed 2× jumlah baris identik.
Verifikasi: `pnpm db:up && pnpm db:migrate && pnpm db:seed && pnpm db:seed` + query `COUNT(*)` per tabel.

### I1 — Auth fail-closed (1 hari)

Tugas:
- I1-01 Isi `protectedPaths = ["/dashboard"]` di `src/proxy.ts`; redirect ke `/sign-in` (bukan 404), kecuali sudah punya sesi.
- I1-02 Hapus bypass dev di `(dashboard)/layout.tsx`; ganti opt-in eksplisit `DASHBOARD_DEV_BYPASS=1` yang hanya berlaku `NODE_ENV !== "production"`.
- I1-03 Tandai rute `/sign-in` sebagai publik; redirect ke `/dashboard` bila sesi ada.
- I1-04 Buat owner pertama lewat skrip (`scripts/create-owner.mjs`, email = `OWNER_EMAIL`) — bukan pendaftaran publik.
- I1-05 Pastikan `/api/auth/[...all]` memakai `auth` yang sama dan cookie `secure` di produksi.

Terima jika: tanpa sesi `/dashboard` → 307 `/sign-in`; login email/password → 200 `/dashboard`; user non-owner ditolak.
Verifikasi: Playwright auth spec + `curl -sI localhost:3000/dashboard`.

### I2 — Alur tulis publik → DB (2–3 hari) · **prioritas**

Tugas:
- I2-01 `api/contact`: insert `leads` (`name,email,topic,segment,message,source,utm...,status="baru"`), lalu kirim notifikasi. File `tmp/leads.jsonl` dihapus. Honeypot + `startedAt` + rate limit tetap.
- I2-02 `api/newsletter/subscribe`: insert/upsert `subscribers` (`status="pending"`, `confirm_token_hash`, `consent_at`), kirim email. Ganti `lib/newsletter-confirmation.ts` (file) → query DB.
- I2-03 `api/newsletter/confirm`: update `status="confirmed"`, `confirmed_at`, token single-use.
- I2-04 Rute + halaman `/newsletter/unsubscribe` (D-05: signed token / hash kolom) → `status="unsubscribed"`.
- I2-05 `go/[slug]`: resolve slug dari tabel `links` (fallback `content/outbound-links`), insert `link_clicks` (`link_id, slug, clicked_at`; **tanpa IP/UA**), redirect 302 tetap.
- I2-06 `/links`: baca `links` aktif dari DB, fallback konten bila DB kosong.
- I2-07 Catat unduhan CV: route `/api/cv-download` (stream file + insert event/`metrics`), tombol `/cv` memakai route itu.
- I2-08 Hapus penulisan `tmp/*.jsonl` yang tersisa; tambah `.gitignore` bila perlu.

Terima jika: kontak → 1 baris `leads`; subscribe → `pending` → email → `confirmed` → unsubscribe; klik tautan → 1 baris `link_clicks`; unduh CV → tercatat.
Verifikasi: unit test route + Playwright `tests/wiring/leads.spec.ts` baru.

### I3 — Baca publik dari DB (1–2 hari)

Tugas:
- I3-01 `site_settings.availability` (enum D-08) dipakai di about/media-kit/products; fallback ke copy i18n bila kosong.
- I3-02 Keputusan D-06: harga DualBrand tetap dari `content/products.ts`; `updateProductPrice` dashboard diberi label "harga internal" atau dihapus agar tidak menyesatkan. Jangan tampilkan harga DB.
- I3-03 Pastikan `/products` hanya menampilkan beli/demo bila `verified` + status `live` (sudah ada di `presentDualBrand`, tambah tes status).
- I3-04 `/work/*` dan `/journal/*` tetap MDX; dashboard `projects`/`content_items` tidak dipakai publik (cukup jelas di UI).
- I3-05 `revalidatePath` setelah ubah setting/produk agar publik ikut berubah.

Terima jika: ubah availability di dashboard → halaman publik berubah setelah revalidate; tidak ada harga DB bocor.
Verifikasi: Playwright "setting berubah → publik berubah" + `tests/public-product.test.ts` diperluas.

### I4 — Kelengkapan tulis dashboard (2 hari)

Tugas:
- I4-01 Sales: action `createSale` (`product_id, platform, external_id` wajib sintetis `manual-<uuid>` untuk baris manual, amount, utm), upsert unik `(platform, external_id)`.
- I4-02 Links: create/edit/delete + toggle aktif; validasi slug `[a-z0-9-]`.
- I4-03 Subscribers: daftar + filter status + hapus (gerbang hapus data) + ekspor CSV.
- I4-04 Tasks: edit/hapus/ubah status; `updateLeadStage` validasi transisi; edit lead (segment/source).
- I4-05 Content: edit/hapus; Metrics: koreksi baris.
- I4-06 Semua action: `requireOwner()` + Zod + `revalidatePath` yang tepat; tidak ada `any`.
- I4-07 Agent approval: `resolveAgentTask` menolak eksekusi gate (hanya approve/reject), tulis `agent_messages`.

Terima jika: setiap aksi punya tes unit (Zod + auth) dan satu E2E happy-path.
Verifikasi: `pnpm test` (tambah ≥8 tes) + Playwright dashboard.

### I5 — Agent API hardening (1 hari)

Tugas:
- I5-01 Skema: `agents.api_key_hash` + `can_write` (migrasi baru) — bukan master secret global.
- I5-02 `verifyAgentAuth`: hash Bearer → cocokkan per agen; 401 jika gagal; **hapus bypass dev tanpa env**.
- I5-03 Cakupan: tolak tulis di luar `can_write`; `GET` juga butuh token.
- I5-04 Gate persetujuan selalu `butuh_persetujuan`; tidak ada jalur "selesai" untuk gate.
- I5-05 Log pesan ke `agent_messages` (tanpa isi sensitif).

Terima jika: tes otorisasi (token salah, agen luar cakupan, gate) lulus.
Verifikasi: `pnpm test tests/agent-auth.test.ts`.

### I6 — Operasional & peluncuran (2–3 hari)

Tugas:
- I6-01 `Dockerfile` + compose produksi (app + MySQL), healthcheck, Nginx, header keamanan/CSP.
- I6-02 Email nyata (D-01): SMTP/Resend + env; uji kirim 1 email; `MAIL_TRANSPORT=smtp` default produksi.
- I6-03 Analitik (D-02): Umami/Plausible + CSP `script-src/connect-src`; `track()` benar-benar mengirim.
- I6-04 Anti-spam (D-03) & rate limit persisten (D-04 tabel `rate_limits`).
- I6-05 Backup `mysqldump` terenkripsi + uji restore di DB bersih.
- I6-06 Redirect 301 dari `docs/REDIRECTS.md`; subdomain SAKOLENTRA tetap 200.
- I6-07 CI: `typecheck`, `lint`, `test`, `build`, `test:e2e`; Lighthouse CI ambang §15.
- I6-08 Perbarui `docs/STATUS.md`, `docs/INTEGRATIONS.md`, `EXECUTION-PLAN.md` agar sesuai kode.

Terima jika: `curl -I` benar, restore berhasil, CI hijau, LH ≥ 90.
Verifikasi: perintah di `EXECUTION-PLAN.md` §6 Fase 6 + `pnpm exec playwright test`.

## 4. Gerbang persetujuan (berhenti, jangan eksekusi)

| ID | Butuh keputusan Owner |
|---|---|
| D-01 | provider email transaksional |
| D-02 | Umami vs Plausible |
| D-03 | honeypot vs Turnstile |
| D-04 | rate limit: DB vs Cloudflare |
| D-05 | mekanisme token unsubscribe |
| D-06 | sumber harga DualBrand |
| X-05 | GitHub OAuth client ID/secret |
| A-03 | CV PDF EN + ID |
| — | deploy, DNS, hapus data, ubah `facts.ts` |

## 5. Urutan & milestone

| Milestone | Fase | Hasil yang bisa didemokan |
|---|---|---|
| M1 | I0–I1 | DB hidup, login owner, dashboard tertutup |
| M2 | I2 | kontak/newsletter/klik/CV benar-benar tersimpan |
| M3 | I3–I4 | dashboard mengelola data yang dipakai publik |
| M4 | I5 | API agen aman + gate |
| M5 | I6 | produksi: email, analitik, Docker, CI, redirect |

Estimasi total: **9–12 hari kerja** (tanpa menunggu aset/keputusan Owner).

## 6. Risiko

| Risiko | Mitigasi |
|---|---|
| MySQL belum ada saat mulai | I0 wajib; jangan menulis fitur DB sebelum `db:up` |
| Migrasi baru saat data sudah ada | `drizzle-kit generate` + review SQL; backup dulu |
| Email provider belum dipilih | I2 jalan dengan transport `file` di dev; produksi menunggu D-01 |
| Dashboard fallback menyembunyikan error DB | log + banner "DB tidak terhubung" di dev, bukan senyap |
| Data nyata masuk repo | seed/fixture dummy; review `git diff` sebelum commit |
| Index codebase-memory basi | index ulang tiap akhir fase (CLI di §0) |

## 7. Langkah berikutnya

Mulai I0. Setelah DB hidup dan migrasi bersih, lanjut I1, lalu I2 (alur tulis publik).
Jangan menyentuh I6 (deploy/DNS) tanpa persetujuan.
