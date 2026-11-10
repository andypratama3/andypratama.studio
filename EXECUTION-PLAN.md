# andypratama.studio — Rencana Eksekusi

**Status (diperbarui 9 Nov 2026, Batch 0 rekonsiliasi):** **bukan HOLD.**

| Fase | Status nyata | Catatan (bukti Batch 0) |
|---|---|---|
| Fase 0 (gate/aset) | **sebagian** | Gate 0 (D-01..D-09, A-01..A-10) belum lengkap; repo sudah berisi kode publik |
| Fase 1 (foundation publik) | **sebagian** | Next 16 + React 19 + next-intl + tokens + brand layout ada; `pnpm typecheck/lint/test/build` lulus 9 Nov 2026 |
| Fase 2 (konten MVP + wiring) | **sebagian** | Home, `/start`, DualBrand, `/go`, API contact/newsletter ada; privacy/cv/links masih stub atau tipis; e2e 21 passed setelah `playwright install` |
| Fase 3 (DB/auth/dashboard) | **belum** | `drizzle/` kosong; `src/db/` hilang; better-auth/drizzle-orm missing |
| Fase 4–6 | **belum** | lead DB, CI, Docker, deploy tidak ada |

Dokumen ini hanya menyusun ulang spesifikasi agar bisa dieksekusi berurutan tanpa salah urutan.

- Sumber tunggal detail: `andypratama-studio-site-dashboard-prompt.md` (v3, 8 Nov 2026, 979 baris).
- Dokumen ini **tidak menggantikan** spesifikasi itu. Ia memetakan: apa yang harus diputuskan dulu, apa yang harus diserahkan, apa yang bolong, lalu urutan tugas dengan kriteria terima.
- Bahasa laporan: Indonesia. Identifier, nama tabel, commit: Inggris.
- Rekonsiliasi klaim docs: lihat `docs/STATUS.md` (Batch 0).

---

## 1. Aturan main

1. Jangan sentuh Fase 0 sebelum §3 (Gate 0) selesai. Gate 0 berisi keputusan dan aset yang hanya bisa Anda berikan.
2. Kerjakan Fase 0 → 6 berurutan. Tidak ada lompat fase.
3. Setiap tugas punya ID, kriteria terima, dan perintah verifikasi. Klaim selesai wajib menyertakan output asli.
4. Satu fase selesai = satu laporan pendek: file yang berubah, output verifikasi, risiko sisa.
5. Kerja di cabang `rebuild/studio`. Situs yang tayang tidak ditimpa sebelum Fase 0 lulus.
6. Tindakan di gerbang persetujuan (§3 spesifikasi) berhenti di `butuh_persetujuan`, tidak pernah dieksekusi otomatis.

---

## 2. Keputusan yang sudah dikunci

Tidak perlu dibahas lagi kecuali Anda mengubahnya sebelum Fase 0.

| Area | Pilihan |
|---|---|
| Framework | Next.js 16 App Router + React 19 + TypeScript strict |
| UI | shadcn/ui + Tailwind CSS v4, komponen dimiliki repo |
| Database | MySQL 8 + Drizzle ORM (VPS yang sudah ada) |
| Auth | Better Auth, satu pemilik, pendaftaran publik mati |
| Bahasa | Publik: EN default + ID (`next-intl`). Dashboard: Indonesia |
| Konten panjang | MDX di repo (`src/content/work`, `src/content/journal`) |
| Operasional | MySQL (lead, tugas, metrik, penjualan, agen) |
| Hosting | Docker Compose di VPS Ubuntu + Nginx + Cloudflare |
| Package manager | pnpm |
| Warna | Palet Realtime Colors §5.1, satu aksen `--brand` |
| Font | Inter tunggal |
| Nomor halaman Home | 15 section, urutan §7.6 |

---

## 3. Gate 0 — harus selesai sebelum Fase 0

Semua butir di bawah menghambat. Tanpa ini, Fase 0–2 akan berhenti di tengah.

### 3.1 Keputusan teknis yang belum ada di spesifikasi

| ID | Pertanyaan | Kenapa menghambat | Default kalau Anda diam |
|---|---|---|---|
| D-01 | Provider email transaksional untuk double opt-in (Resend / Amazon SES / Postmark / lain) | §7.6 #13 mewajibkan email konfirmasi + unsubscribe. Tidak ada paket maupun env di §4/§10 | TIDAK ADA. Tugas F2-05 diblokir |
| D-02 | Analitik: Umami (self-host) atau Plausible | §11 menyebut dua opsi tanpa memilih; CSP §10 belum mengizinkan domainnya | TIDAK ADA. Tugas F2-07 dan F4-04 diblokir |
| D-03 | Anti-spam formulir: honeypot saja, atau Cloudflare Turnstile | §10 menulis "honeypot atau Turnstile"; beda env, beda UI, beda CSP | Honeypot + rate limit DB (paling murah) |
| D-04 | Strategi rate limit: in-memory, tabel MySQL, atau middleware Cloudflare | Mempengaruhi skema dan Fase 3 | Tabel `rate_limits` di MySQL (bertahan saat restart) |
| D-05 | Mekanisme token unsubscribe: signed URL ber-expiry, atau hash di tabel | `/newsletter/unsubscribe` ada di rute, tapi `subscribers` hanya punya `confirm_token_hash` | Tambah kolom `unsubscribe_token_hash` |
| D-06 | Harga DualBrand: ambil dari Gumroad saat seed, atau isi manual | §8 melarang mengetik dari ingatan | Ambil manual dari halaman Gumroad, catat tanggal |
| D-07 | Apakah baris `owner` masuk tabel `agents` | §8 seed menyebut "termasuk owner"; owner bukan agen | Owner **tidak** dibuat sebagai agen; roster hanya 5 agen |
| D-08 | `site_settings.availability.status` pakai enum tertutup? | Lencana Home tidak boleh menampilkan teks bebas | Enum: `open_fulltime`, `open_project`, `closed` + catatan bebas |
| D-09 | Hapus data sesuai janji `/privacy` | Halaman menjanjikan cara minta hapus, belum ada jalurnya | Prosedur manual via `CONTACT_EMAIL`, dicatat di dashboard |

### 3.2 Aset yang harus Anda serahkan

| ID | Aset | Dipakai di | Batasan |
|---|---|---|---|
| A-01 | Video intro 45 detik: MP4 + WebM + poster | Home §7.6 #4 | < 15 MB total, tanpa musik berhak cipta |
| A-02 | Caption video: `en.vtt` + `id.vtt` | Home #4 | Harus cocok dengan audio |
| A-03 | CV PDF EN + ID (terbaru) | `/cv` | Tanpa telepon, tanggal lahir, alamat rumah |
| A-04 | Tangkapan layar DualBrand asli (min. 3: desktop, mobile, halaman fitur) | Home #8, `/products/dualbrand` | Bukan mockup palsu |
| A-05 | URL demo DualBrand yang hidup | Home #8, FAQ | — |
| A-06 | URL Gumroad + Lynk.id DualBrand | Seed `products` | — |
| A-07 | Teks lisensi DualBrand final | `/license`, FAQ | Anda yang menetapkan |
| A-08 | Unicorn Studio Project ID + 1 frame statis (WEBP/PNG) | Hero §5.2 | Adegan dibuat creative-director |
| A-09 | Daftar URL situs lama (atau akses crawl) | `docs/REDIRECTS.md` | Untuk 301 di Fase 0 |
| A-10 | Testimoni berizin tertulis (`permission: true`) — **opsional** | Home #11 | Kalau kosong, section disembunyikan. Jangan diisi karangan |

### 3.3 Akses yang harus tersedia

| ID | Akses | Dipakai di |
|---|---|---|
| X-01 | Repo Git baru / cabang `rebuild/studio` | Fase 0 |
| X-02 | VPS Ubuntu + Docker (staging dulu, produksi belakangan) | Fase 0 (lokal), Fase 6 |
| X-03 | DNS + Cloudflare untuk `andypratama.studio` | Fase 6 |
| X-04 | Pastikan `sakolentra.andypratama.studio` punya DNS terpisah | Fase 0 & 6 |
| X-05 | GitHub OAuth app (client ID/secret) untuk Better Auth | Fase 3 |
| X-06 | Akun Gumroad + Lynk.id | Fase 4 |

### 3.4 Konten yang harus Anda konfirmasi

| ID | Butir | Lokasi | Status |
|---|---|---|---|
| C-01 | FAQ `ai` — apakah Anda setuju kalimatnya | §7.7 | Belum dikonfirmasi |
| C-02 | FAQ `start` — apakah Anda setuju kalimatnya | §7.7 | Belum dikonfirmasi |
| C-03 | `reply_time` — janji waktu balas | `site_settings` | Belum ditetapkan (FAQ `reply` tetap tersembunyi) |
| C-04 | Izin menyebut SD Muhammadiyah 3 Samarinda | §2 | Sudah, 8 Nov 2026 (nama saja) |
| C-05 | Angka `endpoints` dan `tests` | `facts.ts` | Kosong / `unverified` — ukur dulu atau biarkan kosong |
| C-06 | Nama karakter agen (Alya, Bagas, Sekar, Nadia, Dimas) → peran | `agent-characters.ts` | Belum dipetakan — jangan ditebak |

---

## 4. Celah spesifikasi yang perlu ditambal

Bukan blocking untuk mulai Fase 0, tapi harus ditutup sebelum fase yang disebut.

| ID | Celah | Bukti | Tindakan | Fase |
|---|---|---|---|---|
| G-01 | Tidak ada provider email, padahal double opt-in wajib | §7.6 #13 vs §4 & §10 | Putuskan D-01, tambah paket + `EMAIL_API_KEY`, `EMAIL_FROM` | 2 |
| G-02 | Analitik belum dipilih dan belum masuk CSP | §11 vs §10 | Putuskan D-02, tambah env + `script-src` | 2 |
| G-03 | Rate limit & Turnstile tanpa paket/env | §10 | Putuskan D-03/D-04 | 3 |
| G-04 | ~~`proxy.ts` sebagai pengganti `middleware.ts` (Next.js 16) belum diverifikasi~~ **TERTUTUP** | §6, §10 | Terverifikasi (docs Next.js v16.2.9): file `proxy.ts`, named export **`proxy`** (bukan `middleware`, wajib diganti walau default export), matcher lewat `export const config = { matcher }`, header di-set via `NextResponse.next({ request: { headers } })` | 0 |
| G-05 | ~~Flag `shadcn init -t next` belum diverifikasi~~ **TERTUTUP** | §4 | Terverifikasi (docs CLI shadcn): `-t, --template <next\|vite\|start\|react-router\|laravel\|astro>`, `-b, --base <base\|radix\|aria>`, `-p, --preset`, `-d/--defaults` = `--template=next --preset=nova`, `-n/--name` untuk proyek baru. **Implikasi:** `-b` jadi penentu D-03/§4 (Radix vs Base UI) | 0 |
| G-06 | Token unsubscribe tidak ada kolomnya | §8 `subscribers` | Putuskan D-05, tambah kolom di migrasi | 2–3 |
| G-07 | Unique index `sales(platform, externalId)` tidak men-dedupe `NULL` | §8 | Penjualan manual wajib `externalId` sintetis (`manual-<uuid>`) | 3 |
| G-08 | `availability` hanya komentar, bukan tipe | §8 | Putuskan D-08, jadikan tipe Zod | 1 |
| G-09 | "Hapus data" dijanjikan tanpa jalur | §7.6 `/privacy` | Putuskan D-09 | 2 |
| G-10 | Proyek lain Home #7 butuh periode, tidak ada di `facts.ts` | §7.6 #7 | Sumber: MDX `work/*.mdx` atau seed `projects`, bukan `facts.ts` | 2 |
| G-11 | ~~Better Auth + adapter Drizzle belum diverifikasi~~ **TERTUTUP** | §8 catatan | Terverifikasi: `drizzleAdapter(db, { provider: "mysql" })` dari `better-auth/adapters/drizzle`; skema digenerate CLI `npx auth generate --adapter drizzle --dialect mysql --output src/db/auth-schema.ts`; sesi di server action = `auth.api.getSession({ headers: await headers() })`. Jangan tulis tabel auth tangan | 3 |
| G-12 | CSP untuk SDK Unicorn Studio belum berisi domain persis | §10 | **Masih terbuka** — paket `unicornstudio-react` tidak terindeks di Context7. Cek README npm/GitHub saat F2-04, lalu isi `script-src`/`connect-src` | 2 |
| G-13 | `localePrefix` `next-intl` tidak ditentukan; menentukan bentuk semua 301, `sitemap.ts`, `hreflang` | §6, §7.6 | Putuskan `as-needed` (EN tanpa prefiks, 301 apa adanya) atau `always` (semua target `/en/...`). Rekomendasi: `as-needed` | 0 |

---

## 5. Peta fase

| Fase | Hasil | Blocking dari Gate 0 | Verifikasi utama |
|---|---|---|---|
| 0 | Fondasi repo, token, DB lokal, inventaris lama | X-01, X-02, A-09 | `typecheck && lint && build` |
| 1 | Sistem desain + kerangka publik + Home v1 (tanpa Unicorn) | D-08 | `test` + screenshot 3 lebar × 2 tema |
| 2 | Semua halaman publik + Unicorn + SEO | D-01, D-02, D-09, A-01..A-08, C-01, C-02 | Playwright 200, axe, Lighthouse ≥ 90 |
| 3 | DB, auth, dashboard inti | D-03, D-04, D-05, X-05 | migrasi bersih, seed idempoten, E2E auth |
| 4 | Lead, lamaran, konten, produk, tautan, `/go/*` | X-06 | E2E kontak → lead, klik → tercatat |
| 5 | Agen + proyek | — | tes otorisasi cakupan |
| 6 | Peluncuran | X-03, X-04 | `curl -I`, redirect 301, LHCI |

**Garis potong MVP (minggu 2):** Fase 0 + 1 + subset Fase 2 = Home, `/start`, `/products/dualbrand`, `/links`, `/cv`, `/privacy`. Enam halaman ini harus lulus verifikasi sebelum tayang. Sisanya boleh menyusul.

---

## 6. Breakdown tugas

Format: `ID — tugas — terima jika — bukti`.

### Fase 0 — Fondasi dan inventaris

| ID | Tugas | Terima jika | Bukti |
|---|---|---|---|
| F0-01 | Crawl situs lama, daftar URL + aset + dependensi — **selesai** 14 URL dari `sitemap.xml`, semua 200 kecuali `/work/database-ansor-kaltim` (000) | `docs/REDIRECTS.md` memuat tabel lama → baru untuk **setiap** URL | **14/14 baris** + status HTTP per URL |
| F0-02 | `pnpm dlx shadcn@latest init -t next`, TS strict, ESLint + Prettier (satu saja) | `pnpm build` lulus di repo kosong | Output build |
| F0-03 | Pasang MCP shadcn, Next devtools, Jiro; catat pilihan primitif (Base UI/Radix) | `docs/DECISIONS.md` memuat 3 entri | File |
| F0-04 | `.env.example` (nama saja) + `src/lib/env.ts` dengan Zod | App gagal start kalau var kosong | Tes env |
| F0-05 | Token §5.1 di `globals.css` + `@theme inline --color-brand` + `next-themes` + Inter | Mode terang/gelap tampil, tidak ada hex di komponen | Screenshot 2 mode |
| F0-06 | Docker Compose MySQL 8 + skrip `pnpm db:up` | `pnpm db:up` lalu `mysqladmin ping` OK | Output |
| F0-07 | `docs/REFERENCES.md` kerangka kosong | Ada heading per section Home | File |

**Verifikasi fase:** `pnpm typecheck && pnpm lint && pnpm build` + screenshot halaman uji token (terang & gelap).

### Fase 1 — Sistem desain dan kerangka publik

| ID | Tugas | Terima jika | Bukti |
|---|---|---|---|
| F1-01 | Primitif `Section`, `Container`, `Prose`, `Kicker` | Dipakai semua section, tanpa spacing hard-code | Grep |
| F1-02 | Header sticky, footer, pengalih bahasa + tema, `sheet` di layar sempit | Fokus keyboard terlihat, tidak menutupi konten | Screenshot 375/768/1280 |
| F1-03 | `src/content/facts.ts` + `<Fact />` + `facts.test.ts` | `<Fact />` menolak `unverified`; tes gagal kalau halaman publik merujuk `unverified` | `pnpm test` |
| F1-04 | `copy.test.ts` (kata terlarang EN/ID) | Gagal saat kata terlarang ditambahkan | Tes negatif |
| F1-05 | `next-intl`, `messages/en.json` + `id.json` | Kedua locale render, `lang` benar | Playwright |
| F1-06 | Home v1: 15 section, hero gambar statis, semua teks dari `messages/` | Tidak ada teks terpotong/tumpang tindih di 3 lebar | Screenshot |

**Verifikasi fase:** `pnpm test` + still Playwright 375/768/1280 px, dua tema.

### Fase 2 — Konten publik dan Unicorn

| ID | Tugas | Terima jika | Bukti |
|---|---|---|---|
| F2-01 | `/start`, `/work` + `/work/[slug]` (MDX SAKOLENTRA), `/services`, `/about`, `/contact` | Semua 200, topik `?topic=` bekerja | Playwright |
| F2-02 | `/products`, `/products/dualbrand`, `/journal`, `/links`, `/cv` | Harga dari tabel `products`, bukan hard-code; unduhan CV tercatat | Playwright + event |
| F2-03 | `/faq` + `faq.test.ts` | 19 pertanyaan EN+ID, `home: true` tepat 6, `reply` tersembunyi | `pnpm test` |
| F2-04 | `/privacy`, `/terms`, `/license`, `not-found`, `error` | Isi cocok dengan data yang benar-benar dikumpulkan | Review manual |
| F2-05 | Newsletter: submit → `pending` → email konfirmasi → `confirmed` → unsubscribe | E2E dua arah lulus; token tidak bisa dipakai ulang | E2E |
| F2-06 | Adegan Unicorn: lazy, `Suspense`, fallback statis, mati saat `prefers-reduced-motion`, `brandColor` ikut tema | Tidak ada SDK termuat saat reduced-motion | Network log |
| F2-07 | Metadata, `sitemap.ts`, `robots.ts`, OG image, JSON-LD Person+Organization, `hreflang` | Semua rute punya canonical + OG | Cek per rute |
| F2-08 | `docs/REFERENCES.md` diisi: section mana dari Jiro mana + status lisensi | Setiap adaptasi punya baris | File |

**Verifikasi fase:** Playwright semua rute 200 tanpa error konsol; axe tanpa pelanggaran serius; Lighthouse seluler Home: performa/aksesibilitas/SEO ≥ 90, LCP < 2,5 s, CLS < 0,1, INP < 200 ms.

### Fase 3 — Database, auth, dashboard inti

| ID | Tugas | Terima jika | Bukti |
|---|---|---|---|
| F3-01 | Skema §8 (sesuai D-07, D-08, G-06, G-07) + `drizzle-kit generate` + `migrate` | Migrasi bersih di DB kosong | Output migrasi |
| F3-02 | `seed.ts` (agents, products, projects, links) | Jalankan 2× → jumlah baris sama | Hitung baris |
| F3-03 | `import-csv.ts` untuk tugas + metrik minggu 1 | Idempoten, pemetaan kolom §8 benar | Hitung baris 2× |
| F3-04 | Better Auth + `proxy.ts` + cek sesi di **setiap** server action | Tanpa sesi `/dashboard` → redirect | E2E |
| F3-05 | Halaman Hari ini, Tugas (tabel/kanban/kalender), Metrik | Filter lewat `nuqs`, tersimpan di URL | E2E |
| F3-06 | `src/lib/rules.ts` + tes unit | Tiap saran menampilkan angka dasar | `pnpm test` |

**Verifikasi fase:** migrasi bersih, seed + impor idempoten, tes `rules.ts`, E2E auth dua arah.

### Fase 4 — Lead, lamaran, konten, produk, tautan

| ID | Tugas | Terima jika | Bukti |
|---|---|---|---|
| F4-01 | Lead (Kanban + laci riwayat), Lamaran, Konten (kalender), Produk (penjualan + UTM), Tautan | Semua tulis lewat server action ber-Zod | Review + tes |
| F4-02 | `/go/[slug]`: redirect 302 + catat klik tanpa IP/user-agent | Tidak ada kolom IP di `link_clicks` | Query DB |
| F4-03 | Formulir kontak → `leads` dengan segmen sesuai topik + honeypot | Spam tidak masuk, lead valid masuk | E2E |
| F4-04 | `src/lib/events.ts` + semua peristiwa §11 | Tidak ada nama event ditulis di komponen | Grep |

**Verifikasi fase:** E2E "kirim kontak → lead muncul", "klik tautan → tercatat", cek `link_clicks`.

### Fase 5 — Agen dan proyek

| ID | Tugas | Terima jika | Bukti |
|---|---|---|---|
| F5-01 | Halaman Proyek + daftar periksa pilot SAKOLENTRA (5 butir, tiap butir status + catatan) | Semua butir bisa diubah | E2E |
| F5-02 | Halaman Agen: roster, antrian `agent_tasks`, persetujuan, log pesan | Status `butuh_persetujuan` tidak bisa dieksekusi | Tes |
| F5-03 | `/api/agent/*` token per agen (hash), cakupan `canWrite`, log | Agen di luar cakupan ditolak; gerbang selalu berhenti | Tes otorisasi |

**Verifikasi fase:** tes otorisasi cakupan + gerbang persetujuan.

### Fase 6 — Peluncuran

| ID | Tugas | Terima jika | Bukti |
|---|---|---|---|
| F6-01 | Dockerfile, Compose produksi, Nginx, Cloudflare, header keamanan §10 | CSP ketat tapi app jalan (termasuk Unicorn) | `curl -I` |
| F6-02 | Backup `mysqldump` terenkripsi di luar VPS + uji pemulihan sekali | Restore berhasil di DB bersih | Log restore |
| F6-03 | Redirect 301 semua URL di `docs/REDIRECTS.md` | Tiap URL lama → 301 + `Location` benar | `curl -sI` per URL |
| F6-04 | `sakolentra.andypratama.studio` tetap hidup | 200 dan tidak bentrok rute | `curl -sI` |
| F6-05 | Lighthouse CI di GitHub Actions | Gagal kalau skor turun di bawah ambang | Run CI |

**Verifikasi fase:**
```bash
curl -sI https://andypratama.studio | head -n 5
# per URL lama: curl -sI <url-lama> → 301 + Location benar
pnpm exec playwright test && pnpm exec lhci autorun
```

---

## 7. Definition of Done → fase

Setiap butir §15 dipetakan. Tanda fase = fase yang membuktikannya.

| Butir DoD | Fase |
|---|---|
| `typecheck`, `lint`, `test`, `build` lulus | 0–6 (tiap fase) |
| Grep `font-size: 0`, `ignoreBuildErrors`, `@ts-ignore` kosong | 1 |
| Angka publik dari `facts.ts`; tes fakta + kata terlarang lulus | 1 |
| Token §5.1 dipakai, tidak ada hex di `src/components` | 1 |
| Unicorn lazy + fallback + mati saat reduced-motion | 2 |
| Adaptasi Jiro tercatat + lisensi dicek | 2 |
| Semua rute 200, tanpa error konsol, axe bersih | 2 |
| Lighthouse seluler ≥ 90, LCP/CLS sesuai | 2 |
| Migrasi bersih, seed + impor idempoten | 3 |
| `/dashboard` hanya pemilik | 3 |
| Redirect 301 terbukti; subdomain SAKOLENTRA hidup | 6 |
| `link_clicks` tanpa IP/user-agent | 4 |
| Home 15 section; bukti sosial & lencana hilang saat kosong | 1–2 |
| Tidak ada testimoni/logo/angka karangan | 2 |
| Video caption EN+ID, tidak autoplay bersuara, < 15 MB | 2 |
| CV EN+ID berfungsi, tanpa data pribadi sensitif | 2 |
| Newsletter double opt-in diuji E2E | 2 |
| `/privacy`, `/terms`, `/license` sesuai data nyata | 2 |
| Nama event hanya dari `src/lib/events.ts` | 4 |
| `/faq` EN+ID, Home 6, `reply` tersembunyi | 2 |
| Hanya **nama** sekolah; tanpa logo/foto | 2 |
| Home terbaca penuh tanpa JS dan saat reduced-motion | 2 |

---

## 8. Register risiko

| Risiko | Dampak | Mitigasi |
|---|---|---|
| D-01/D-02 belum diputuskan | Fase 2 berhenti | Putuskan di Gate 0, sebelum Fase 0 |
| Aset A-01..A-08 terlambat | Home tidak bisa tayang | Bangun dengan placeholder terkontrol (tidak dirender publik), tukar di akhir Fase 2 |
| Next.js 16 API berbeda dari ingatan model | Refactor `proxy.ts`, routing, metadata | F0-04/G-04: baca docs sebelum tulis |
| Lisensi Jiro tidak mengizinkan pemakaian kode | Risiko hukum | Pakai sebagai referensi struktur saja; tulis ulang komponen |
| Palet mode gelap turunan salah | Kontras gagal | Verifikasi Realtime Colors di F0-05 |
| Paket gratis Unicorn ber-watermark / dibatasi | Hero terlihat murah | Cek pricing sebelum Fase 2; fallback statis sudah wajib |
| Scope melebar ke dashboard sebelum situs tayang | Tidak ada hasil ke uang | Ikuti §13: minggu 1 jangan Fase 0 |
| Data nyata masuk repo | Pelanggaran privasi | Seed + demo hanya data dummy; review `git diff` sebelum commit |

---

## 9. Urutan waktu (dari §13)

| Waktu | Yang dikerjakan | Jangan dikerjakan |
|---|---|---|
| Minggu 1 | DualBrand siap jual, video intro, lamaran, outreach, `/start` sementara, bio ber-UTM | Fase 0 |
| Minggu 2 | Fase 0 + 1, lalu subset Fase 2 (6 halaman MVP) | Fase 3+ |
| Minggu 3–4 | Fase 3 + 4 | Fase 5–6 |
| Setelahnya | Fase 5 + 6, lalu `/work`, `/services`, `/journal` penuh | — |

---

## 10. Hold list — tidak dikerjakan sekarang

- Tidak ada `pnpm init`, `shadcn init`, atau instalasi dependency.
- Tidak ada file di `src/`, `drizzle/`, `docker/`, `tests/`.
- Tidak ada migrasi, seed, atau koneksi database.
- Tidak ada perubahan DNS, Cloudflare, atau VPS.
- Tidak ada deploy, tidak ada commit, tidak ada PR.
- Tidak ada pengiriman email, DM, atau lamaran.

**Satu-satunya langkah berikutnya:** isi §3.1 (D-01..D-09) dan serahkan §3.2 (A-01..A-08). Setelah itu Fase 0 boleh dimulai.
