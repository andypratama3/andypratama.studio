  # PRD — andypratama.studio

  | | |
  |---|---|
  | Versi | 1.0 |
  | Tanggal | 13 November 2026 |
  | Branch | `main` |
  | Commit | `2749615` |
  | Sumber kebenaran eksekusi | `docs/INTEGRATION-LOG.md`, `docs/DECISIONS.md` |
  | Sumber fakta publik | `src/content/facts.ts` (satu-satunya) |
  | Bahasa produk | EN (default) + ID, `next-intl` |

  Dokumen ini menjelaskan sistem **sebagaimana terpasang**, bukan rencana ideal. Setiap requirement diberi status: **Terpasang** (ada kode + bukti uji), **Sebagian** (ada kode, cakupan kurang), **Belum** (belum ada), **Ditunda** (menunggu keputusan/aset). Angka dan klaim hanya diambil dari repo.

  ---

  ## 1. Ringkasan produk

  Situs portofolio + katalog produk + dashboard operasional untuk studio satu orang (Andy Pratama, Samarinda). Nilai utamanya: bukti kerja nyata (SAKOLENTRA di SD Muhammadiyah 3 Samarinda) tanpa angka karangan, dengan alur kontak → lead → tindak lanjut yang tersimpan di database.

  Tiga permukaan:

  1. **Publik** — 18 rute dwibahasa: profil, studi kasus, layanan, produk, jurnal, FAQ, media kit, kontak, legal.
  2. **Dashboard owner** — 11 halaman, satu-satunya penulis data operasional (lead, tautan, penjualan, subscriber, konten, metrik, setting).
  3. **API** — form publik, short link, newsletter, auth, dan API agen per-key.

  Prinsip yang mengikat seluruh sistem:

  - Fakta hanya dari `facts.ts`; status `unverified` tidak dirender.
  - Tidak ada testimoni, logo klien, harga karangan, atau data siswa.
  - Warna lewat token CSS; satu font (Inter); satu aksen `--brand`.
  - Gerbang persetujuan manusia untuk: publish, kirim pesan, ubah harga, deploy, hapus data, ubah `facts.ts`.

  ---

  ## 2. Masalah & tujuan

  | Masalah | Tujuan produk | Ukuran keberhasilan (dapat diverifikasi) |
  |---|---|---|
  | Portofolio tersebar, klaim tidak bisa dipertanggungjawabkan | Satu situs dengan fakta berlabel status | Setiap angka di UI berasal dari `facts.ts`; `grep` tidak menemukan angka hardcode di komponen |
  | Permintaan masuk lewat DM/email dan hilang | Semua permintaan masuk satu pipeline lead | Submit `/start` → baris `leads` + notifikasi |
  | Tautan bio tersebar tanpa ukuran | Short link terpusat + pencatatan klik | `/go/[slug]` → 302 + baris `link_clicks` |
  | Newsletter tanpa dasar consent | Double opt-in dengan token sekali pakai | `pending → confirmed → unsubscribed` |
  | Operasional studio tidak tercatat | Dashboard CRUD untuk data yang dipakai publik | Ubah setting di dashboard → halaman publik berubah |
  | Agen otomatis berisiko menulis sembarang | API per-agen dengan cakupan tulis + gate | 401 tanpa key; 403 slug salah; gate `butuh_persetujuan` |

  ---

  ## 3. Persona & peran

  | Peran | Siapa | Hak |
  |---|---|---|
  | **Pengunjung** | Publik, tanpa login | Baca semua halaman publik, kirim kontak, berlangganan |
  | **Owner** | `OWNER_EMAIL` (tunggal) | Semua data dashboard, setting publik, ekspor CSV, issue/revoke key agen |
  | **Agen** | 5 agen aktif di tabel `agents` | Baca/tulis `agent_tasks` sesuai `can_write` dan scope `tasks` |
  | **Sistem** | Cron/CI/operator | Backup, migrasi, seed, build |

  Catatan: `owner` **bukan** agen (D-07). Baris lama dinonaktifkan, bukan dihapus. Tidak ada registrasi publik; owner dibuat lewat bootstrap bertoken atau skrip.

  ---

  ## 4. Ruang lingkup

  ### 4.1 Termasuk

  - Situs publik EN/ID, tema terang/gelap, intro animasi first-paint.
  - Form kontak kanonik (`/start`) dan form kontak alternatif (`/contact`).
  - Newsletter double opt-in (di balik flag).
  - Short link + pencatatan klik agregat.
  - Katalog produk dengan gate checkout/demo.
  - Dashboard owner (baca + tulis) dan auth fail-closed.
  - API agen per-key dengan gate persetujuan.
  - Operasional: Dockerfile, compose prod, backup terenkripsi, CI, redirect legacy, header keamanan.

  ### 4.2 Tidak termasuk

  - Multi-tenant / multi-owner.
  - Pembayaran di dalam situs (checkout terjadi di Gumroad/Lynk).
  - CMS visual; konten jurnal/studi kasus berbasis kode (`src/content`, halaman statis), bukan editor.
  - Aplikasi mobile.
  - Email marketing broadcast (hanya transaksional).

  ---

  ## 5. Arsitektur

  ### 5.1 Stack

  | Lapisan | Teknologi |
  |---|---|
  | Framework | Next.js 16.4.4 (App Router, `output: "standalone"`) |
  | UI | React 19.3.1, Tailwind v4, shadcn + `@base-ui/react`, `lucide-react` |
  | i18n | `next-intl` 4, locale `en`/`id`, `localePrefix: as-needed` |
  | Tema | `next-themes` (class di `<html>`) |
  | Animasi | `motion@14.11.1` (`LazyMotion` `domAnimation`) untuk interaksi; CSS untuk loop |
  | Form | `react-hook-form` + `zod` |
  | DB | MySQL 8 + `drizzle-orm` + `mysql2` |
  | Auth | `better-auth` + Drizzle adapter |
  | Email | `nodemailer` (SMTP) atau transport file |
  | Notifikasi UI | `sonner` |
  | Uji | `vitest` (unit), Playwright + axe (e2e) |

  ### 5.2 Topologi produksi

  ```text
  Browser
    │  HTTPS
    ▼
  Nginx (rencana; belum ada konfigurasi repo)
    ▼
  Next.js standalone (node server.js, user non-root, :3000)
    ├─► MySQL 8.4 (db)  ◄── migrator (job sekali jalan)
    └─► SMTP transaksional (belum dipilih — D-01)
  ```

  `docker/docker-compose.prod.yml`: `db` → `migrate` (selesai baru lanjut) → `app`, dengan healthcheck. **Image belum pernah di-build** (Docker tidak terpasang di mesin ini).

  ### 5.3 Peta direktori

  ```text
  src/app/[locale]/(site)        18 rute publik
  src/app/[locale]/(auth)        /sign-in
  src/app/[locale]/(dashboard)   11 halaman + actions.ts (21 server action)
  src/app/api                    contact, newsletter×3, agent/tasks, auth, owner/bootstrap, subscribers.csv
  src/app/go/[slug]              short link
  src/components/brand|site|dashboard|ui
  src/content                    facts, faq, products, product-catalog, outbound-links, social-profiles
  src/db                         schema.ts + client
  src/lib                        auth, agent-*, newsletter, site-settings, public-product, mail, rate-limit, wiring, dll.
  src/messages                   en.json, id.json (397 kunci masing-masing)
  drizzle/                       migrasi SQL
  scripts/                       db-up/down, seed, import-csv, agent-key, backup, wiring-check, start-standalone, export-copy-deck
  tests/                         24 file unit + tests/wiring, tests/motion
  ```

  ---

  ## 6. Peta rute

  ### 6.1 Publik (EN tanpa prefiks, ID dengan `/id`)

  | Rute | Isi | Sumber data |
  |---|---|---|
  | `/` | Landing: hero, bukti, SAKOLENTRA, DualBrand, layanan, jurnal, CTA | `messages`, `facts`, `product-catalog` |
  | `/about` | Profil, format kerja, angka | `messages`, `facts`, `site_settings.availability` |
  | `/work`, `/work/sakolentra` | Daftar & studi kasus | Halaman statis (slug whitelist: `sakolentra`) |
  | `/services` | 3 paket jasa | `messages` |
  | `/products`, `/products/dualbrand` | Rak produk + produk live | `product-catalog`, `products` (gate) |
  | `/journal` | Jurnal mingguan (dua empty state) | `messages` |
  | `/faq` | 20 item, token `{fact:…}` di-resolve | `src/content/faq.ts` |
  | `/media-kit` | Bio per platform, positioning | `messages`, `facts`, `site_settings` |
  | `/links` | Tautan kurasi | `src/content` (bukan tabel `links`) |
  | `/start` | Form kontak kanonik (`?topic=`) | `POST /api/contact` |
  | `/contact` | Form kontak alternatif | `POST /api/contact` |
  | `/cv` | Status CV "on request" | `messages` |
  | `/privacy`, `/terms`, `/license` | Legal | `messages` |
  | `/newsletter` | Status konfirmasi/berhenti (`?state=`) | `subscribers` |
  | `/sign-in` | Login owner | `better-auth` |

  Non-halaman: `/sitemap.xml`, `/robots.txt`, `/go/[slug]`, `/api/*`, `/(dev)/wiring`, `/(dev)/components` (dev-only, `notFound` di produksi).

  ### 6.2 Dashboard (owner)

  | Halaman | Baca | Tulis (server action) |
  |---|---|---|
  | `/dashboard` | Ringkasan counts | — |
  | `/dashboard/tasks` | `tasks` | `createTask`, `updateTaskStatus` |
  | `/dashboard/leads` | `leads` | `createLead`, `updateLeadStage`, `updateLeadDetails`, `addOutreachEvent` |
  | `/dashboard/applications` | `applications` | `createApplication`, `updateApplicationStatus` |
  | `/dashboard/content` | `contentItems` | `createContentItem`, `updateContentStatus` |
  | `/dashboard/metrics` | `metricsDaily` | `recordMetric` |
  | `/dashboard/links` | `links` | `createLink`, `setLinkActive` |
  | `/dashboard/products` | `products`, `sales` | `createSale`, `updateProductPrice` |
  | `/dashboard/projects` | `projects` | `updateProjectStage`, `updateSakolentraChecklist` |
  | `/dashboard/agents` | `agents`, `agentTasks` | `resolveAgentTask` (approve/reject) |
  | `/dashboard/settings` | `site_settings`, `subscribers` | `updateSiteSetting`, `approveSubscriber`, `unsubscribeSubscriber` |

  Semua action: `requireOwner()` → Zod → tulis → `revalidatePath`. Dashboard `no-store` + `noindex`.

  ### 6.3 API

  | Endpoint | Metode | Auth | Efek |
  |---|---|---|---|
  | `/api/contact` | POST | origin allow-list + rate limit | Insert `leads`, kirim notifikasi |
  | `/api/newsletter/subscribe` | POST | flag + rate limit | Upsert `subscribers` `pending`, kirim email konfirmasi |
  | `/api/newsletter/confirm` | GET | token | `confirmed`, token hangus |
  | `/api/newsletter/unsubscribe` | GET | token | `unsubscribed` |
  | `/go/[slug]` | GET | publik + rate limit | Resolve `links`, insert `link_clicks`, 302 |
  | `/api/dashboard/subscribers.csv` | GET | owner | Ekspor CSV tanpa token |
  | `/api/agent/tasks` | GET/POST | Bearer `ap_…` | `agent_tasks` + `agent_messages` |
  | `/api/auth/[...all]` | * | — | Better Auth |
  | `/api/owner/bootstrap` | POST | header token | Buat owner pertama; 404 tanpa token |

  ---

  ## 7. Model data (20 tabel)

  Grup Better Auth: `user`, `session`, `account`, `verification`.

  | Tabel | Kolom kunci | Dipakai oleh |
  |---|---|---|
  | `agents` | `slug`, `role`, `scope`, `can_write`, `requires_approval`, `api_key_hash`, `active` | API agen, dashboard |
  | `tasks` | `lane`, `status`, `planned_date`, `duration_min` | Dashboard tugas |
  | `agent_tasks` | `agent_id`, `task_id`, `status`, `summary`, `approval_gate` | API agen |
  | `agent_messages` | `from_agent_id`, `to_agent_id`, `body` | Log komunikasi agen |
  | `leads` | `name`, `handle`, `platform`, `segment`, `stage`, `source_utm`, `notes` | Kontak + dashboard |
  | `outreach_events` | `lead_id`, `channel`, `direction`, `approved_by_owner` | Dashboard lead |
  | `applications` | `company`, `role`, `status`, `sent_at` | Dashboard lamaran |
  | `content_items` | `title`, `platform`, `format`, `series`, `status` | Dashboard konten |
  | `metrics_daily` | `date`, `platform`, `metric`, `value`, `source` | Dashboard metrik |
  | `links` | `slug`, `destination`, `platform`, `active` | `/go`, dashboard |
  | `link_clicks` | `link_id`, `clicked_at`, `referrer_host`, `device_type` | `/go` |
  | `products` | `slug`, `status` (`draft/live/arsip`), `price_usd`, URL, `license_note` | Gate `/products` |
  | `sales` | `product_id`, `platform`, `gross_usd`, `net_usd`, `external_id` | Dashboard produk |
  | `projects` | `kind`, `stage`, `next_step` | Dashboard proyek |
  | `subscribers` | `email` (unik), `locale`, `status`, `confirm_token_hash`, `unsubscribe_token_hash` | Newsletter |
  | `site_settings` | `key`, `value` (JSON) | Availability publik |

  Privasi data: tidak ada IP atau user-agent yang disimpan. Token disimpan sebagai SHA-256. CSV ekspor tidak memuat token. Tidak ada data siswa, VA, atau kredensial di repo.

  ---

  ## 8. Functional requirements

  ### FR-1 — Situs publik dwibahasa

  | ID | Requirement | Acceptance | Status |
  |---|---|---|---|
  | FR-1.1 | Semua halaman publik tersedia EN dan ID dengan URL bersih | `/about` dan `/id/about` merender konten berbeda bahasa | Terpasang |
  | FR-1.2 | Bahasa default EN tanpa prefiks; ID berprefiks | `localePrefix: as-needed`; `/id` 200 | Terpasang |
  | FR-1.3 | Tema terang/gelap mengikuti sistem + toggle manual | Toggle mengubah class `html` tanpa error | Terpasang |
  | FR-1.4 | Navigasi nav/footer ke halaman nyata, bukan anchor lintas halaman | Semua tautan nav resolve 200 | Terpasang |
  | FR-1.5 | Metadata SEO + hreflang per rute | `sitemap.xml` memuat 16 path × 2 bahasa | Terpasang |
  | FR-1.6 | Redirect 301 aset lama | 8 slug → `/work`, 2 → `/work/sakolentra` (en/id) | Terpasang |

  ### FR-2 — Fakta & FAQ

  | ID | Requirement | Acceptance | Status |
  |---|---|---|---|
  | FR-2.1 | Angka publik hanya dari `facts.ts` | Komponen `<Fact />` menolak status `unverified` | Terpasang |
  | FR-2.2 | Status fakta transparan | Halaman menampilkan label "dinyatakan"/"sudah dicek" | Terpasang |
  | FR-2.3 | FAQ 20 item, dua bahasa, token `{fact:…}` | Token ter-resolve dari fakta; jumlah item tetap 20 | Terpasang |
  | FR-2.4 | Item `pendingOwner` disembunyikan | `faq.ai`, `faq.start` tidak tampil sampai disetujui | Terpasang |

  Fakta aktif: siswa `1,000+` (stated), tahun `3+` (stated), sekolah `SD Muhammadiyah 3 Samarinda` (stated), modul `52` (stated). `endpoints` dan `tests` kosong/`unverified` sehingga tidak dirender.

  ### FR-3 — Kontak → lead

  | ID | Requirement | Acceptance | Status |
  |---|---|---|---|
  | FR-3.1 | `/start` menjadi form kanonik; semua CTA mengarah ke sana | CTA utama membuka `/start` (opsional `?topic=`) | Terpasang |
  | FR-3.2 | Submit menulis `leads` + notifikasi email | 1 submit → 1 baris `leads` + 1 email | Terpasang |
  | FR-3.3 | Anti-spam berlapis | Honeypot `website`, `startedAt` ≥ 1200 ms, origin allow-list, Zod | Terpasang |
  | FR-3.4 | Rate limit 5 permintaan/60 dtk per IP | Permintaan ke-6 → 429 + `Retry-After` | Terpasang (in-memory) |
  | FR-3.5 | Produksi menolak jalan tanpa transport email nyata | Tanpa `SMTP_HOST` → 503 dengan pesan alternatif | Terpasang |
  | FR-3.6 | Alamat email pengirim tersimpan di baris lead | Kolom email pada `leads` | **Belum** (lihat GAP-01) |

  ### FR-4 — Newsletter double opt-in

  | ID | Requirement | Acceptance | Status |
  |---|---|---|---|
  | FR-4.1 | Fitur di balik flag | `NEWSLETTER_ENABLED=1` menampilkan form; default mati | Terpasang |
  | FR-4.2 | Subscribe menyimpan `pending` + token hash | Baris `subscribers` status `pending`, hanya hash tersimpan | Terpasang |
  | FR-4.3 | Konfirmasi sekali pakai | Token dipakai ulang → ditolak | Terpasang |
  | FR-4.4 | Unsubscribe per token | `confirmed → unsubscribed`; halaman status jelas | Terpasang |
  | FR-4.5 | Ekspor CSV owner-only | Tanpa auth 401; dengan auth 200; tanpa token | Terpasang |
  | FR-4.6 | Rate limit subscribe 5/60 dtk | Permintaan ke-6 → 429 | Terpasang (in-memory) |

  ### FR-5 — Short link

  | ID | Requirement | Acceptance | Status |
  |---|---|---|---|
  | FR-5.1 | `/go/[slug]` resolve dari DB, fallback konten | Slug aktif → 302 tujuan | Terpasang |
  | FR-5.2 | Klik dicatat tanpa PII | Baris `link_clicks` hanya id, waktu, host referrer, tipe device | Terpasang |
  | FR-5.3 | Slug nonaktif tidak diarahkan | Toggle `active=false` → fallback/404 | Terpasang |
  | FR-5.4 | Rate limit 120/60 dtk per slug | 429 saat melebihi | Terpasang (in-memory) |

  ### FR-6 — Produk & gate checkout

  | ID | Requirement | Acceptance | Status |
  |---|---|---|---|
  | FR-6.1 | Harga hanya dari `content/products.ts` | Harga DB tidak pernah dirender | Terpasang |
  | FR-6.2 | Beli/demo hanya bila tautan `verified` + status `live` | Status `draft`/`arsip` menyembunyikan keduanya | Terpasang |
  | FR-6.3 | Rak produk menandai item belum siap sebagai "soon" | 1 live (DualBrand) + 4 soon | Terpasang |
  | FR-6.4 | Harga DualBrand belum ditetapkan | `priceUsd: null` → tidak ada angka harga tampil | Sesuai keputusan |

  ### FR-7 — Availability dari DB

  | ID | Requirement | Acceptance | Status |
  |---|---|---|---|
  | FR-7.1 | Status ketersediaan disimpan di `site_settings` | Enum `open_fulltime｜open_project｜closed` | Terpasang |
  | FR-7.2 | Catatan tampil di `/about` dan `/media-kit` | Ubah di dashboard → `curl` halaman memuat teks baru | Terpasang |
  | FR-7.3 | Fallback aman saat DB mati | `getAvailabilityNote` → `null`, copy i18n dipakai | Terpasang |
  | FR-7.4 | Revalidasi setelah perubahan | `revalidatePath("/", "layout")` | Terpasang |

  ### FR-8 — Dashboard owner

  | ID | Requirement | Acceptance | Status |
  |---|---|---|---|
  | FR-8.1 | 11 halaman baca data nyata | Tiap halaman query tabel terkait | Terpasang |
  | FR-8.2 | 21 server action tulis dengan Zod + auth | Unit test auth/Zod; action tanpa sesi ditolak | Terpasang |
  | FR-8.3 | Aksi sensitif tercatat, bukan hard delete | Subscriber/tautan memakai state, bukan hapus permanen | Terpasang |
  | FR-8.4 | Ekspor CSV subscriber | Unduh 200 dengan header `no-store` | Terpasang |
  | FR-8.5 | Error DB tidak senyap di UI | Banner "DB tidak terhubung" | **Sebagian** (halaman mencatat `console.warn`, UI kosong) |
  | FR-8.6 | Form lamaran publik | Pendaftaran dari situs → `applications` | **Belum** (hanya input dashboard) |

  ### FR-9 — Auth owner

  | ID | Requirement | Acceptance | Status |
  |---|---|---|---|
  | FR-9.1 | `/dashboard` tertutup tanpa sesi | 307 → `/sign-in` | Terpasang |
  | FR-9.2 | Hanya `OWNER_EMAIL` boleh masuk | Email lain ditolak | Terpasang |
  | FR-9.3 | Bypass dev eksplisit & tidak berlaku di produksi | Hanya `DASHBOARD_DEV_BYPASS=1` + non-produksi | Terpasang |
  | FR-9.4 | Bootstrap owner bertoken | Tanpa `x-bootstrap-token` → 404; token salah ditolak | Terpasang |
  | FR-9.5 | Sesi aktif tidak bisa membuka `/sign-in` | Redirect ke `/dashboard` | Terpasang |

  ### FR-10 — API agen

  | ID | Requirement | Acceptance | Status |
  |---|---|---|---|
  | FR-10.1 | Key per agen, bukan master secret | `ap_` + 43 base64url; hanya hash disimpan | Terpasang |
  | FR-10.2 | Verifikasi fail-closed + timing-safe | Tanpa key 401; key salah 401; agen nonaktif 401 | Terpasang |
  | FR-10.3 | Cakupan tulis dibatasi `can_write` | Slug salah 403; di luar cakupan ditolak | Terpasang |
  | FR-10.4 | Gate persetujuan tidak bisa ditembus | Status selalu `butuh_persetujuan` | Terpasang |
  | FR-10.5 | Semua panggilan tercatat | Baris `agent_messages` tanpa isi sensitif | Terpasang |
  | FR-10.6 | Siklus key | `pnpm agent:key <slug>` / `--revoke`; key mentah tampil sekali | Terpasang |

  ### FR-11 — Intro & motion

  | ID | Requirement | Acceptance | Status |
  |---|---|---|---|
  | FR-11.1 | Overlay intro hanya di kunjungan pertama | `/` dan `/id`; kunjungan ulang tidak menampilkan | Terpasang |
  | FR-11.2 | Tidak ada flash sebelum paint | Skrip inline di awal `<body>` set `data-studio-intro` | Terpasang |
  | FR-11.3 | Reduced-motion & tanpa JS aman | Overlay tidak tampil, konten tetap terbaca | Terpasang |
  | FR-11.4 | Durasi 1,1 dtk, tidak memblokir interaksi | Overlay hilang otomatis | Terpasang |
  | FR-11.5 | Loop berat tetap CSS | Marquee/reveal CSS; Motion hanya interaksi | Terpasang |

  ### FR-12 — Operasional

  | ID | Requirement | Acceptance | Status |
  |---|---|---|---|
  | FR-12.1 | Image produksi non-root + migrator | Dockerfile multi-stage, `USER nextjs`, target `migrator` | Terpasang (belum di-build) |
  | FR-12.2 | Compose prod: db → migrate → app | Healthcheck di app | Terpasang (belum dijalankan) |
  | FR-12.3 | Backup terenkripsi + retensi | `mysqldump --single-transaction`, GPG default, 14 hari | Terpasang |
  | FR-12.4 | Restore teruji | Restore ke DB bersih → 21 tabel (20 + migrasi) | Terpasang |
  | FR-12.5 | CI: typecheck, lint, unit, build, e2e | Workflow `ci.yml`, Node 22, pnpm 12, TZ Asia/Jakarta | Terpasang |
  | FR-12.6 | Header keamanan + CSP | nosniff, referrer-policy, frame DENY, permissions-policy, CSP | Terpasang (CSP masih `unsafe-inline`) |

  ---

  ## 9. Non-functional requirements

  ### 9.1 Aksesibilitas

  - Target WCAG AA; axe (serious/critical) dijalankan pada semua rute publik dalam e2e.
  - Skip link, fokus terlihat, honeypot `aria-hidden` + `tabIndex={-1}`.
  - Target sentuh ≥44 px diuji dengan `expect.poll`.
  - `prefers-reduced-motion` mematikan intro, marquee, dan transisi halaman.
  - Konten tetap terbaca tanpa JavaScript.

  ### 9.2 Performa

  - Home memakai CSS untuk animasi berulang; Motion dimuat via `LazyMotion` (subset), bukan paket penuh.
  - Font tunggal Inter via `next/font/local`: berkas latin di-vendor di `src/fonts/inter-latin.woff2` (SIL OFL 1.1), tanpa permintaan runtime ke `fonts.gstatic.com`.
  - `output: standalone` untuk image kecil.
  - Ambang Lighthouse CI **belum** dijalankan (rencana I6-07).

  ### 9.3 Keamanan

  - Auth fail-closed; cookie `secure` di produksi; dashboard `no-store` + `noindex`.
  - Semua input server divalidasi Zod; origin browser dibatasi untuk form.
  - Token newsletter disimpan sebagai hash, sekali pakai.
  - API agen: hash + `timingSafeEqual` + scope + rate limit.
  - CSP baseline masih mengizinkan `unsafe-inline`/`unsafe-eval` (kebutuhan hidrasi Next & next-themes) — utang teknis yang tercatat.
  - Tanpa IP/user-agent di DB; tanpa secret di repo (`.env.local` gitignored).

  ### 9.4 SEO & internasionalisasi

  - `sitemap.xml` dengan alternates `en`/`id`; `robots.txt`; metadata per halaman.
  - Dashboard, `/sign-in`, `/auth/*` dikecualikan dari indeks.
  - Semua copy lewat katalog pesan; tidak ada string UI hardcode (kecuali nama merek/produk).

  ### 9.5 Observabilitas

  - `console.error`/`warn` terstruktur pada kegagalan DB dan insert klik.
  - `docs/baseline/before/metrics-*.json` menyimpan metrik gerak sebagai baseline.
  - Analitik produk (`events.track`) masih no-op — **belum** ada provider (D-02).

  ### 9.6 Batas & kuota (terpasang)

  | Aksi | Batas |
  |---|---|
  | Kontak | 5 / 60 dtk / IP |
  | Subscribe newsletter | 5 / 60 dtk / IP |
  | `/go/[slug]` | 120 / 60 dtk / slug |
  | Agen GET | 60 / 60 dtk / agen |
  | Agen POST | 30 / 60 dtk / agen |

  ---

  ## 10. Konfigurasi & operasi

  ### 10.1 Environment

  Wajib: `DATABASE_URL`, `BETTER_AUTH_SECRET` (≥32 char), `BETTER_AUTH_URL`, `OWNER_EMAIL`, `NEXT_PUBLIC_SITE_URL`.

  Opsional: `NEWSLETTER_ENABLED`, `SMTP_*`, `MAIL_TRANSPORT`, `LEAD_NOTIFY_TO`, `CONTACT_EMAIL`, `OWNER_SETUP_TOKEN`, `DASHBOARD_DEV_BYPASS` (dev), `ENABLE_DEV_ROUTES` (dev), `NEXT_PUBLIC_UMAMI_*`, `NEXT_PUBLIC_UNICORN_PROJECT_ID`.

  ### 10.2 Perintah

  ```bash
  pnpm dev | build | start | start:standalone
  pnpm typecheck | lint | test | test:e2e
  pnpm db:up | db:down | db:generate | db:migrate | db:seed | db:import-csv
  pnpm db:backup
  pnpm agent:key <slug> [--revoke]
  pnpm wiring:check | copy:deck
  ```

  ### 10.3 Alur rilis

  1. `pnpm typecheck && pnpm lint && pnpm test && pnpm build`
  2. `PORT=3001 PLAYWRIGHT_BASE_URL=http://127.0.0.1:3001 pnpm test:e2e`
  3. `pnpm db:backup` sebelum migrasi
  4. Build image (belum pernah dijalankan), jalankan compose prod, cek healthcheck
  5. Verifikasi `curl -I` untuk header & redirect

  Deploy/DNS adalah **gerbang persetujuan**; belum dieksekusi.

  ---

  ## 11. Bukti verifikasi

  | Perintah | Hasil (14 Nov 2026) |
  |---|---|
  | `pnpm typecheck` | 0 error |
  | `pnpm lint` | 0 error |
  | `pnpm test` | 24 file / 70 tes lulus |
  | `pnpm build` | sukses **tanpa** `DATABASE_URL`/`BETTER_AUTH_SECRET`; `.next/standalone/server.js` ada |
  | `pnpm test:e2e` | 69 lulus (server standalone, port 3010) |
  | `pnpm wiring:check` | `ok=13 partial=1 missing=0 skipped=2` |
  | Backup + restore | dump 33K → restore ke DB bersih → 21 tabel |
  | Axe WCAG AA | 0 pelanggaran di 22 route × light/dark |
  | Sweep viewport | 36 route × 7 viewport (320–1440): 0 overflow, 0 duplicate id, 0 heading skip |

  Wiring `partial`: `unicornstudio-react` (slot + fallback statis, SDK tidak dimuat).
  Wiring `skipped`: `lenis` (ditunda), `gsap` (ditolak karena ukuran).

  ---

  ## 12. Register celah (gap)

  Diurutkan menurut dampak. **Tidak ada yang boleh ditutup dengan mengarang data.**

  | ID | Celah | Dampak | Status |
  |---|---|---|---|
  | GAP-01 | `leads` tidak punya kolom email; alamat pengirim hanya ada di body email notifikasi | Jika email gagal, kontak tidak bisa dibalas dari DB | **Tinggi** — perlu migrasi kolom `email` |
  | GAP-02 | Transport email default `file`; produksi butuh SMTP | Tanpa SMTP, form kontak 503 di produksi | Menunggu D-01 |
  | GAP-03 | Kegagalan insert lead tetap dibalas `ok: true` | Pengunjung melihat sukses walau data hilang | Sedang — perlu penanganan eksplisit |
  | GAP-04 | Analitik no-op | Tidak ada data kunjungan/funnel | Menunggu D-02 |
  | GAP-05 | Rate limit in-memory | Reset saat restart; tidak berlaku lintas instans | Menunggu D-04 |
  | GAP-06 | Anti-spam hanya honeypot + timing + origin | Bot terdistribusi bisa lolos | Menunggu D-03 |
  | GAP-07 | Lamaran hanya bisa dibuat dari dashboard | Tidak ada jalur publik ke `applications` | Belum |
  | GAP-08 | CV PDF belum ada | Label unduhan harus tetap "on request" | Menunggu A-03 |
  | GAP-09 | Image Docker belum di-build; Nginx belum ada di repo | Rilis produksi belum teruji | Sedang |
  | GAP-10 | CSP masih `unsafe-inline`/`unsafe-eval` | Perlindungan XSS tidak maksimal | Utang teknis |
  | GAP-11 | Dashboard menelan error DB menjadi daftar kosong | Owner bisa salah kira data hilang | Sedang (FR-8.5) |
  | GAP-12 | Lighthouse CI belum dijalankan | Ambang performa belum terbukti | Belum |

  Catatan: GAP-01/03 ditemukan saat penyusunan PRD ini (pembacaan `src/app/api/contact/route.ts` dan `src/db/schema.ts`), belum ada di dokumen lain.

  ---

  ## 13. Gerbang persetujuan

  Pekerjaan berhenti di status **butuh_persetujuan** untuk:

  | Kode | Keputusan |
  |---|---|
  | D-01 | Provider email transaksional |
  | D-02 | Analitik: Umami vs Plausible |
  | D-03 | Anti-spam: honeypot vs Turnstile |
  | D-04 | Rate limit: DB vs Redis/Cloudflare |
  | D-05 | Mekanisme token unsubscribe (sudah: hash kolom) |
  | D-06 | Sumber harga DualBrand (sudah: konten, bukan DB) |
  | A-03 | CV PDF EN + ID |
  | — | Deploy, DNS, hapus data, ubah `facts.ts`, publish, kirim pesan, ubah harga |

  ---

  ## 14. Roadmap

  | Milestone | Isi | Status |
  |---|---|---|
  | M1 | DB + auth owner + dashboard tertutup | Selesai |
  | M2 | Alur tulis publik → DB (kontak, newsletter, klik) | Selesai (dengan GAP-01/03) |
  | M3 | Dashboard mengelola data yang dipakai publik | Selesai |
  | M4 | API agen aman + gate | Selesai |
  | M5 | Produksi: email, analitik, anti-spam, Docker, CI, redirect | Sebagian — diblokir D-01…D-04 |

  Usulan urutan berikutnya: **GAP-01 + GAP-03** (migrasi kolom email + penanganan gagal simpan), lalu SMTP (D-01), lalu Docker build + Nginx, lalu analitik (D-02).

  ---

  ## 15. Lampiran

  ### 15.1 Katalog copy

  - `src/messages/en.json` dan `src/messages/id.json`: 397 kunci, struktur identik.
  - `src/content/faq.ts`: 20 item (en/id).
  - `docs/COPY-DECK.md`: hasil `pnpm copy:deck` (397 kunci + FAQ + tabel fakta). Dokumen ini **stale** setelah revisi copy 13 Nov 2026 — jalankan ulang generator sebelum dipakai sebagai acuan.

  ### 15.2 Istilah

  | Istilah | Arti di proyek ini |
  |---|---|
  | Lead | Permintaan masuk dari form kontak |
  | Segment | Kategori lead: freelancer, agency, multi_brand, sekolah, perekrut, lainnya |
  | Stage | Tahap lead: baru → dihubungi → balas → diskusi → penawaran → menang/kalah |
  | Gate | Status `butuh_persetujuan` yang tidak bisa ditembus agen |
  | Wiring | Status sambungan frontend ↔ backend (`src/lib/wiring.ts`) |
  | Fact status | `verified` / `stated` / `unverified`; `unverified` tidak dirender |

  ### 15.3 Batas dokumen

  PRD ini tidak menetapkan angka bisnis baru, tidak menambah klaim, dan tidak mengubah `facts.ts`. Semua status "Terpasang" merujuk pada kode di commit `2749615` dan output perintah pada §11.
