# andypratama.studio — Situs Utama + Dashboard Pribadi

Prompt eksekusi untuk OpenCode/OMP atau Cursor. Tanggal dokumen: 8 November 2026.

**Revisi v3 (8 Nov 2026):** nama SD Muhammadiyah 3 Samarinda boleh disebut; tidak ada hadiah pendaftaran email; FAQ ditulis lengkap (19 pertanyaan, EN dan ID, halaman `/faq`, §7.7).

**Revisi v2 (8 Nov 2026):** landing page (Home) dilengkapi: jalur tiga jenis pengunjung, status ketersediaan, video intro, daftar proyek lain, stack dan cara kerja, bukti sosial yang hanya berisi testimoni berizin, FAQ, pendaftaran email, CTA akhir, footer, unduh CV, halaman hukum (privasi, syarat, lisensi), status loading/error, dan daftar peristiwa pelacakan.

Dokumen ini merangkum seluruh pembahasan kita: positioning "Andy Pratama Studio", tiga lini kerja (jasa terpaket, produk digital, konten), SAKOLENTRA milik Andy, rencana minggu 1, video intro, dan seri mingguan "satu hal berhasil, satu hal rusak". Situs ini punya dua wajah: **etalase publik** dan **dashboard privat** untuk menjalankan semuanya.

---

## 0. Cara memakai

1. Buka repo baru atau cabang baru (`rebuild/studio`). Jangan menimpa situs yang sedang tayang sebelum Fase 0 selesai.
2. Tempel dokumen ini sebagai instruksi utama. Kerjakan **berurutan Fase 0 sampai 6**. Jangan lompat fase.
3. Setelah tiap fase: jalankan verifikasi yang tertulis, tempel output asli, baru lanjut. Klaim "selesai" tanpa output perintah nyata dianggap belum selesai.
4. Pembagian peran: Claude hanya menulis spesifikasi ini. Eksekusi, pengujian, dan perbaikan dikerjakan agen coding (OpenCode/OMP atau Cursor).
5. Bahasa laporan: Indonesia. Identifier kode, nama tabel, dan komit: Inggris.

---

## 1. Tujuan dan keputusan

### Tujuan situs
| Wajah | Fungsi | Pengunjung |
|---|---|---|
| Publik | Mengubah pengunjung baru menjadi follower, pembeli DualBrand, atau klien jasa. Menjadi hub tunggal untuk bio semua platform | Calon klien, pembeli, perekrut, sesama developer |
| Privat (`/dashboard`) | Satu tempat untuk tugas mingguan, lead dan outreach, lamaran kerja, kalender konten, metrik, produk dan penjualan, proyek, serta kerja para agen | Hanya Andy |

### Keputusan yang saya ambil (ubah bila tidak cocok, sebelum Fase 0)
| Keputusan | Pilihan default | Alasan |
|---|---|---|
| Framework | Next.js 16 (App Router) + React 19 + TypeScript strict | Anda minta Next/React; satu codebase untuk situs dan dashboard |
| UI | shadcn/ui + Tailwind CSS v4 | Anda minta shadcn; komponen dimiliki di repo, bisa disesuaikan penuh |
| Database | MySQL 8 + Drizzle ORM | Anda sudah kuat di MySQL; satu server di VPS yang sudah Anda kelola |
| Auth | Better Auth, satu pemilik (allowlist) | Dashboard hanya untuk Anda; tanpa pendaftaran publik |
| Bahasa situs publik | Inggris default, Indonesia sebagai terjemahan (`next-intl`) | Target global; komunitas lokal tetap terlayani |
| Bahasa dashboard | Indonesia | Hanya Anda yang memakai |
| Konten panjang (studi kasus, jurnal) | File MDX di repo | Versi git, tanpa editor tambahan |
| Data operasional | MySQL | Lead, tugas, metrik, penjualan |
| Hosting | Docker Compose di VPS Ubuntu (Nginx + Cloudflare) | Sesuai keahlian Anda. Alternatif: Vercel + database terkelola |
| Package manager | pnpm | Cepat, lockfile deterministik |

---

## 2. Fakta dan aturan keras

### Fakta yang boleh tampil (dari profil Anda)
- Andy Pratama, Software Engineer / Full-Stack Developer dan Digital Creator, Samarinda, Indonesia. Bukan "backend-only".
- 3+ tahun membangun sistem web produksi untuk klien pendidikan, pemerintahan, dan komersial.
- **SAKOLENTRA** (nama lama ProductSchool): Sistem Administrasi, Keuangan, dan Operasional Sekolah Terintegrasi. Milik Andy. Dipakai di SD Muhammadiyah 3 Samarinda, 1.000+ siswa. Fokus: tagihan, SPP, virtual account, rekonsiliasi, notifikasi WhatsApp. Bukan ERP umum.
- Proyek lain (deskripsi umum saja): portal pemerintah dengan migrasi data legacy; backend multi-cabang dengan presensi biometrik ke payroll; sistem presensi QR dengan peta anggota; platform ticketing dengan checkout Midtrans.
- Andy Pratama Studio: produk digital (DualBrand) dan software custom.
- **SD Muhammadiyah 3 Samarinda boleh disebut** di situs, studi kasus, dan materi publik (izin Andy, 8 Nov 2026). Izin ini hanya untuk **nama**: logo, foto, dan data sekolah tidak termasuk. Klien lain tidak disebut tanpa izin tertulis.
- Akun: Instagram, Threads, TikTok `@andypratama3_`; LinkedIn dan GitHub `andypratama3`; YouTube "Andy Pratama".
- Lulus Agustus 2026 (S.Tr.Kom.), tersedia full-time, terbuka remote dan onsite Jakarta.

### Satu sumber fakta: `src/content/facts.ts`
Semua angka dan klaim di situs diambil dari satu file. Tidak ada angka yang diketik langsung di komponen.

```ts
export type FactStatus = "verified" | "stated" | "unverified";
export type Fact = { value: string; status: FactStatus; verifiedAt?: string; note?: string };

export const facts = {
  students:   { value: "1,000+", status: "stated", note: "CV terbaru; ukur ulang bila ada angka aktif" },
  yearsBuilding: { value: "3+", status: "stated" },
  school:     { value: "SD Muhammadiyah 3 Samarinda", status: "stated", note: "boleh disebut sebagai nama; tanpa logo/foto/data" },
  modules:    { value: "52", status: "stated", note: "CV terbaru" },
  // Angka di bawah ini punya beberapa versi lama; isi hanya dari hasil pengukuran hari ini
  endpoints:  { value: "", status: "unverified" },
  tests:      { value: "", status: "unverified" },
} satisfies Record<string, Fact>;
```
Aturan: komponen `<Fact id="..." />` menolak merender fakta `unverified`. Test `facts.test.ts` gagal jika ada `unverified` yang dirujuk di halaman publik.

### Dilarang
- Mengarang testimoni, logo klien, angka penjualan, jumlah pengikut, rating, atau "as seen on".
- Menampilkan data siswa, nomor VA, kredensial, repo privat, atau layar internal klien. Demo SAKOLENTRA hanya dengan data dummy.
- Menyebut DualBrand "production-ready" sebelum build, demo, dan dokumentasi lulus cek.
- Menyimpan password, token, API key, atau secret di repo. Hanya nama variabel di `.env.example`.
- Menyembunyikan elemen bermasalah dengan `opacity: 0`, `display: none`, atau `font-size: 0`.
- Menambah dependency tanpa menyebut alasan dan ukuran paket.
- `Math.random()` tanpa seed untuk tampilan yang harus konsisten antara server dan klien.
- Memakai `any`, mematikan aturan TypeScript/ESLint, atau `ignoreBuildErrors`.
- Menyalin template berlisensi utuh (termasuk dari perpustakaan prompt desain) tanpa memeriksa lisensinya.
- Menghapus halaman lama tanpa redirect 301.
- Mengirim DM, memposting, mengubah harga, men-deploy ke produksi, atau menghapus data **tanpa persetujuan Andy** (lihat §3).

---

## 3. Mapping agen

Struktur organisasi agen Anda: **Owner** memberi visi dan persetujuan; **executive-assistant** (Chief of Staff) menerima instruksi, mendelegasikan, dan merangkum; empat departemen mengerjakan; semua hasil dilaporkan lewat executive-assistant.

### Roster untuk proyek ini
| Agen | Tanggung jawab di proyek ini | Boleh menulis ke | Tidak boleh |
|---|---|---|---|
| **Owner (Andy)** | Menyetujui rilis, harga, outreach, dan semua langkah di §3 gerbang persetujuan | Semua | — |
| **executive-assistant** | Memecah backlog jadi tugas, menetapkan agen, membuat ringkasan mingguan di dashboard, menagih persetujuan, mencatat keputusan | `tasks`, `agent_tasks`, `agent_messages`, `projects` (status saja) | Mengubah kode, harga, atau konten publik |
| **engineering-lead** | Next.js, skema database, migrasi, auth, API, deploy, pengujian, performa | `src/`, `drizzle/`, `tests/`, `docker/`, `.github/` | Menyentuh isi copy publik dan `facts.ts` tanpa persetujuan; menerbitkan ke produksi sendiri |
| **creative-director** | Token desain, tipografi, adegan Unicorn Studio, referensi Jiro, gambar OG, motion | `src/styles/`, `src/components/brand/`, `public/media/` | Mengubah fakta atau copy; menambah aset berhak cipta |
| **content-strategist** | Copy situs (EN/ID), studi kasus, jurnal "berhasil/rusak", caption, CTA | `src/content/`, `src/messages/`, MDX | Menulis angka atau klaim yang belum ada di `facts.ts`; menerbitkan |
| **business-operations** | Produk, harga, lisensi, lead dan outreach, lamaran, sales tracking, UTM, pipeline pilot SAKOLENTRA | `products`, `sales`, `leads`, `applications`, `links` (usulan) | Mengirim pesan atau mengubah harga langsung; mengakses data siswa |

Nama karakter di office-dashboard (Alya, Bagas, Sekar, Nadia, Dimas, Andy) belum tercatat pemetaannya ke peran di atas. Isi sendiri di `src/content/agent-characters.ts` jika ingin ditampilkan; jangan ditebak.

### Alur serah-terima
`Owner → executive-assistant → agen departemen → (bukti) → executive-assistant → Owner`

Setiap pekerjaan agen tercatat sebagai baris di `agent_tasks` dengan status: `antri → dikerjakan → butuh_persetujuan → selesai | ditolak`, dan wajib melampirkan **bukti** (output perintah, URL pratinjau, atau diff). Pesan antar agen dicatat di `agent_messages`.

### Gerbang persetujuan Owner (status `butuh_persetujuan`)
1. Menerbitkan postingan atau halaman publik.
2. Mengirim DM, email, atau lamaran.
3. Mengubah harga atau lisensi produk.
4. Deploy ke produksi atau migrasi database di produksi.
5. Menghapus data atau berkas.
6. Mengubah `facts.ts`.

### Alat per agen (untuk eksekutor)
| Alat | Dipakai oleh | Fungsi |
|---|---|---|
| shadcn MCP | engineering-lead, creative-director | Cari dan pasang komponen/blok dari registry |
| Next.js devtools MCP | engineering-lead | Membaca error dan status dev server Next.js 16 |
| Jiro MCP | creative-director | Mengambil referensi struktur section (§5.3) |
| Unicorn Studio (editor web) | creative-director | Membuat dan mempublikasikan adegan WebGL (§5.2) |
| Realtime Colors | creative-director | Memeriksa palet dan kontras (§5.1) |

Catatan: status A2A dan proyek AndyOS belum diverifikasi. Dashboard hanya mencatat serah-terima secara manual dulu (Fase 5); integrasi otomatis dengan runtime agen adalah pekerjaan lanjutan setelah dicek di workspace.

---

## 4. Stack dan plugin

### Dependensi inti
| Paket | Fungsi | Alasan |
|---|---|---|
| `next`, `react`, `react-dom` | Framework | Wajib |
| `typescript` | Tipe | Strict mode |
| `tailwindcss` v4 | Gaya | Dibawa shadcn |
| `shadcn` (CLI) + komponen | UI | Komponen dimiliki di repo |
| `lucide-react` | Ikon | Dibawa shadcn |
| `next-themes` | Mode terang/gelap | Token palet punya dua mode |
| `motion` | Animasi | Referensi Jiro memakai Framer Motion; `motion` adalah penerusnya |
| `next-intl` | EN/ID | Routing per locale, metadata per bahasa |
| `zod` | Validasi | Form, env, API |
| `react-hook-form` + `@hookform/resolvers` | Form | Dibawa pola form shadcn |
| `drizzle-orm`, `drizzle-kit`, `mysql2` | Database | Tipe aman, migrasi SQL tertulis |
| `better-auth` | Auth | Satu pemilik, OAuth GitHub atau email |
| `@tanstack/react-table` | Tabel dashboard | Dipakai komponen data-table shadcn |
| `recharts` (via komponen `chart` shadcn) | Grafik | Dibawa shadcn |
| `sonner` | Toast | Komponen shadcn |
| `date-fns` | Tanggal | Ringan, tree-shakable |
| `unicornstudio-react` | Adegan WebGL | Paket yang dipakai panduan embed Unicorn Studio untuk React/Next.js |
| `nuqs` | State filter di URL | Filter dashboard bisa dibagikan |
| `@next/mdx` atau `next-mdx-remote` | MDX | Studi kasus dan jurnal |
| `vitest`, `@playwright/test`, `@axe-core/playwright` | Pengujian | Unit, E2E, aksesibilitas |
| `@lhci/cli` | Performa | Lighthouse di CI |
| `eslint`, `prettier` (atau `biome`) | Kualitas kode | Satu saja, jangan keduanya bertabrakan |

Setiap paket di luar daftar ini wajib dilaporkan dengan alasan dan ukuran sebelum dipasang. Sebelum memakai pustaka mana pun, **baca dokumentasi versi terbaru** (API Next.js 16, Better Auth, dan Drizzle bisa berbeda dari ingatan model).

### Komponen shadcn yang dipakai
`button, input, textarea, label, form, select, checkbox, switch, tabs, dialog, sheet, drawer, dropdown-menu, command, popover, calendar, badge, card, separator, skeleton, table, data-table, sidebar, chart, sonner, tooltip, avatar, breadcrumb, pagination`. Blok awal dashboard: gunakan pencarian CLI atau MCP shadcn (`dashboard-01` dan varian sidebar) sebagai titik mulai, lalu sesuaikan, jangan dibiarkan polos.

### Setup awal
```bash
pnpm dlx shadcn@latest init -t next     # scaffold Next.js + Tailwind v4 + components.json
pnpm dlx shadcn@latest mcp init --client cursor   # sesuaikan --client dengan editor/agen yang dipakai
```
Pilihan primitif (Base UI atau Radix) saat `init`: pilih sesuai prompt CLI saat itu dan catat di `docs/DECISIONS.md`.

MCP Next.js 16 (untuk membaca error dev server):
```json
{
  "mcpServers": {
    "next-devtools": { "command": "npx", "args": ["-y", "next-devtools-mcp@latest"] }
  }
}
```
MCP Jiro: salin URL persis dari halaman setup di jiro.build/mcp, lalu masuk dengan akun Jiro saat diminta izin.

---

## 5. Tiga integrasi yang Anda minta

### 5.1 Realtime Colors (palet dan font)
Tautan Anda memuat palet berikut (urutan Realtime Colors: teks, latar, primer, sekunder, aksen) dan font Inter untuk judul dan isi:

| Peran | Hex |
|---|---|
| Text | `#050315` |
| Background | `#fbfbfe` |
| Primary | `#2f27ce` |
| Secondary | `#dedcff` |
| Accent | `#433bff` |

Realtime Colors adalah alat pratinjau, bukan layanan yang terhubung lewat API. "Terintegrasi" berarti: palet itu menjadi token CSS di repo, dan kontrasnya diperiksa di situsnya.

Kontras terhitung (mode terang): teks `#050315` di atas latar `#fbfbfe` sangat tinggi; primer `#2f27ce` di atas latar sekitar 8,8:1; aksen `#433bff` di atas latar sekitar 6,1:1; teks putih di atas primer sekitar 9:1. Lolos WCAG AA.

Mode gelap tidak ada di tautan. Nilai di bawah adalah **turunan saya**; buka Realtime Colors, aktifkan mode gelap, dan ganti dengan nilainya bila berbeda.

**Aturan pemetaan ke shadcn (penting):** `accent` di shadcn adalah warna latar hover untuk menu dan item, bukan warna aksen merek. Jangan memetakan `#433bff` ke `--accent`; pakai token terpisah `--brand`.

`src/app/globals.css` (bagian token; sisanya dari hasil `init`):
```css
:root {
  --background: #fbfbfe;
  --foreground: #050315;
  --card: #ffffff;
  --card-foreground: #050315;
  --popover: #ffffff;
  --popover-foreground: #050315;
  --primary: #2f27ce;
  --primary-foreground: #fbfbfe;
  --secondary: #dedcff;
  --secondary-foreground: #050315;
  --muted: #eeedfc;
  --muted-foreground: #4a4766;
  --accent: #eeedfc;               /* hover subtle, bukan aksen merek */
  --accent-foreground: #050315;
  --destructive: #c4262e;
  --border: #dedcff;
  --input: #cfcdf5;
  --ring: #433bff;
  --brand: #433bff;                /* aksen merek (Realtime Colors: accent) */
  --radius: 0.625rem;
}

.dark {                            /* TURUNAN: verifikasi di Realtime Colors */
  --background: #050315;
  --foreground: #fbfbfe;
  --card: #0c0a24;
  --card-foreground: #fbfbfe;
  --popover: #0c0a24;
  --popover-foreground: #fbfbfe;
  --primary: #8b86ff;
  --primary-foreground: #050315;
  --secondary: #1b1850;
  --secondary-foreground: #fbfbfe;
  --muted: #14123a;
  --muted-foreground: #a9a6c9;
  --accent: #14123a;
  --accent-foreground: #fbfbfe;
  --destructive: #ff6b6b;
  --border: #25226a;
  --input: #25226a;
  --ring: #8b86ff;
  --brand: #6f69ff;
}
```
Tambahkan juga `--color-brand: var(--brand)` ke blok `@theme inline` agar `bg-brand` dan `text-brand` tersedia di Tailwind.

Font: Inter untuk judul dan isi lewat `next/font/google` (variabel `--font-inter`), tanpa font kedua. Judul: bobot 600–700, `letter-spacing: -0.02em`, `line-height: 1.1–1.15`. Isi: 16–18 px, `line-height: 1.6`. Angka di tabel dan dashboard: `font-variant-numeric: tabular-nums`.

Warna merek di video dan materi lain (navy `#071B33`, hijau `#20AD57`) berbeda dengan palet ini. Putuskan satu: untuk situs, **pakai palet Realtime Colors di atas**. Sesuaikan video dan thumbnail berikutnya agar konsisten.

### 5.2 Unicorn Studio (adegan WebGL)
Unicorn Studio bekerja dengan lapisan di kanvas, efek WebGL, interaktivitas (mouse, hover, scroll), dan **variables** yang bisa diubah dari kode saat runtime. Adegan dipublikasikan lalu ditanam; untuk React/Next.js dipakai paket `unicornstudio-react`.

Pekerjaan Anda (creative-director) di editor, bukan di kode:
1. Buat **satu** adegan hero: abstrak, lembut, selaras palet (indigo ke biru dengan latar sangat gelap). Hindari gaya "blob ungu bersinar" yang generik; pilih bentuk yang spesifik (misalnya garis grid atau gelombang tipis) dan gerak yang pelan.
2. Ekspos variables: `brandColor`, `intensity`, dan preset `Light` dan `Dark`.
3. Publikasikan, catat Project ID, dan ekspor satu frame statis (PNG/WEBP) untuk fallback.
4. Gunakan tombol **LLM instructions** di panel Export bila ingin agen coding membaca cara kontrol adegan.

Aturan kode (engineering-lead):
```tsx
// src/components/brand/hero-scene.tsx  ("use client")
import UnicornScene from "unicornstudio-react/next";
// Project ID dan fallback dari env/aset; jangan hard-code di komponen lain.
```
- Komponen hanya dirender di klien, **lazy** (tidak di atas lipatan jika LCP buruk), dengan `Suspense` dan fallback gambar statis.
- Hormati `prefers-reduced-motion`: tampilkan gambar statis, jangan muat SDK.
- Sinkronkan `brandColor` dengan token tema saat mode berganti (lewat prop `variables`).
- Di layar sempit: skala render lebih rendah dan interaksi mouse/scroll dimatikan. Nama prop persisnya (skala, DPI, lazy load, mode produksi, FPS) **cek di README paket**; bila belum tersedia sebagai prop, gunakan atribut `data-us-*` dari panduan embed HTML.
- Satu adegan per halaman. Adegan tidak boleh menjadi satu-satunya cara memahami konten (teks tetap ada, `alt`/`aria-label` terisi).
- Ukuran dan batas rencana (watermark, jumlah proyek): cek halaman pricing Unicorn Studio sebelum bergantung padanya.
- Panduan performa resmi: unicorn.studio/docs/performance.

### 5.3 Jiro (perpustakaan prompt desain + MCP)
Jiro adalah perpustakaan template dan komponen section dengan prompt siap tempel, plus server MCP (masuk dengan akun Jiro) yang bisa disambungkan ke Claude Code, Cursor, dan Codex. Prompt-nya ditulis untuk Framer Motion.

Cara memakainya di proyek ini:
1. Pasang MCP Jiro di editor agen (lihat §4).
2. Gunakan sebagai **referensi struktur** untuk section: header, fitur, harga, FAQ, kontak, footer. Kategori yang relevan: Portfolio, Developer Tools, Agency.
3. Setiap section dibangun ulang memakai komponen shadcn dan token §5.1. Jangan meninggalkan gaya visual template asli.
4. Terjemahkan Framer Motion ke `motion`; batasi animasi sesuai §7.4.
5. Periksa syarat lisensi Jiro (FAQ "Can I use JIRO for client work?" dan paket Anda) sebelum memakai kode dari template premium. Bila ragu, pakai hanya sebagai inspirasi tata letak dan tulis ulang komponennya sendiri.
6. Catat section mana yang diadaptasi dari referensi apa di `docs/REFERENCES.md`.

---

## 6. Arsitektur

### Struktur folder
```
src/
  app/
    [locale]/                 # EN default, ID
      (site)/
        page.tsx              # Home
        start/page.tsx        # "Mulai dari sini"
        work/page.tsx, work/[slug]/page.tsx
        products/page.tsx, products/[slug]/page.tsx
        services/page.tsx
        journal/page.tsx, journal/[slug]/page.tsx
        about/page.tsx
        contact/page.tsx
        links/page.tsx        # hub untuk bio semua platform
        cv/page.tsx           # unduh CV (EN/ID)
        faq/page.tsx          # semua pertanyaan, dikelompokkan
        newsletter/confirm/page.tsx, newsletter/unsubscribe/page.tsx
        privacy/page.tsx, terms/page.tsx, license/page.tsx
        not-found.tsx, error.tsx
    go/[slug]/route.ts        # redirect pendek + catat klik (tanpa locale)
    dashboard/                # privat, bahasa Indonesia
      layout.tsx, page.tsx
      tasks/ leads/ applications/ content/ metrics/
      products/ projects/ agents/ links/ settings/
    api/
      auth/[...all]/route.ts
      agent/[...path]/route.ts   # Fase 5, token per agen
    sitemap.ts, robots.ts, opengraph-image.tsx
  components/
    ui/                       # komponen shadcn
    brand/                    # hero-scene, wordmark, section primitif
    dashboard/                # data-table, kartu metrik, kanban
  content/
    facts.ts
    faq.ts
    work/*.mdx
    journal/*.mdx
    agent-characters.ts
  db/
    schema.ts, index.ts, seed.ts, import-csv.ts
  lib/
    auth.ts, env.ts, utm.ts, rules.ts
  messages/
    en.json, id.json
  proxy.ts                    # Next.js 16: ganti nama dari middleware
drizzle/                      # migrasi SQL
tests/                        # unit + e2e
docs/                         # DECISIONS.md, REFERENCES.md
docker/                       # Dockerfile, compose, nginx.conf
```

### Strategi render
- Halaman publik: statis (SSG) atau ISR, kecuali `/links` dan `/go/*` yang dinamis.
- Dashboard: dinamis, server components untuk baca data, server actions untuk tulis, validasi `zod` di setiap action.
- Gambar: `next/image` dengan ukuran eksplisit. Tanpa gambar stok.
- Subdomain `sakolentra.andypratama.studio` adalah demo terpisah. Pastikan situs baru tidak mengganggu DNS maupun rutenya.

### Inventaris dan redirect (Fase 0)
Crawl situs lama, daftar semua URL, buat tabel pemetaan lama → baru di `docs/REDIRECTS.md`, implementasikan 301 di `next.config.ts`. Nama lama "ProductSchool" tidak boleh tampil di halaman baru (hanya sebagai riwayat di studi kasus).

---

## 7. Desain, bebas "AI slop"

### 7.1 Prinsip
1. **Spesifik, bukan generik.** Setiap kalimat, gambar, dan angka harus bisa dibuktikan atau dilihat.
2. **Bukti di depan.** Diagram alur nyata SAKOLENTRA, tangkapan layar DualBrand sungguhan, entri jurnal sungguhan.
3. **Hierarki lewat tipografi dan ruang**, bukan lewat kartu bertumpuk.
4. **Satu aksen** (`--brand`). Tidak ada gradien pelangi.
5. **Gerak menjelaskan**, bukan menghias.

### 7.2 Daftar larangan visual
- Hero dengan teks "Build the future" dan gradien blob ungu-biru yang bersinar.
- Tiga kartu fitur sejajar dengan ikon Lucide di lingkaran berwarna (pola paling umum). Pakai baris tipografis, tabel, atau diagram.
- Glassmorphism di mana-mana, bayangan berwarna, border bergradien pada semua kartu.
- Emoji di judul atau bullet.
- Gambar stok, avatar palsu, "trusted by" dengan logo yang bukan klien Anda.
- Hitung mundur palsu, badge "limited", angka acak.
- Animasi masuk pada semua elemen sekaligus; parallax berlebihan.

### 7.3 Daftar larangan kata (copy EN dan ID)
EN: seamless, elevate, unlock, leverage, cutting-edge, revolutionize, next-level, game-changer, supercharge, empower, robust, delve, "in today's fast-paced world".
ID: revolusioner, solusi terdepan, transformasi digital (tanpa konteks), sinergi, "era digital ini", "kami berkomitmen".
Pakai kata kerja konkret: bangun, kirim, ukur, perbaiki, rusak, jalan.

Tes otomatis `copy.test.ts` memindai `messages/*.json` dan MDX untuk kata terlarang dan gagal bila ada.

### 7.4 Motion
- Durasi 150–400 ms, easing `ease-out`; satu pola masuk (fade + geser 8–12 px) dipakai ulang.
- Maksimal satu animasi scroll yang menonjol per halaman.
- `prefers-reduced-motion`: matikan semuanya, termasuk adegan Unicorn.
- Tidak ada animasi yang menggeser tata letak (CLS tetap rendah).

### 7.5 Aksesibilitas dan keterbacaan
Kontras AA, fokus terlihat, urutan heading benar, `alt` bermakna, ukuran target sentuh 44 px, tidak ada teks di dalam gambar untuk konten penting, `lang` benar per locale.

### 7.6 Spesifikasi halaman publik
Teks di bawah adalah draf copy yang boleh dipakai content-strategist. Angka selalu dari `facts.ts`.

**Home (landing page lengkap)**

Prinsip: halaman ini melayani **tiga jenis pengunjung** yang datang dengan niat berbeda, dan harus menjawab "ini untuk siapa dan apa langkah saya" dalam 5 detik pertama.

| Pengunjung | Mau apa | Jalur di Home |
|---|---|---|
| Klien / pemilik bisnis / sekolah | Membangun atau memperbaiki sistem | Jasa → `/services`, pilot sekolah → `/contact?topic=school` |
| Pembeli / developer | Template atau starter kit | DualBrand → `/products/dualbrand` |
| Perekrut / tim engineering | Menilai Andy untuk peran penuh waktu | Karya → `/work`, CV → `/cv`, ringkasan → `/about` |

Urutan section (satu halaman, semua tertaut dari header):

1. **Header** (sticky): wordmark, navigasi (Work, Products, Services, Journal, About), pengalih bahasa dan tema, tombol "Start here" → `/start`. Di layar sempit menjadi `sheet`. Tidak ada banner yang menutupi konten.
2. **Hero**: adegan Unicorn sebagai latar (teks tetap kontras tinggi).
   EN: "I build software that runs real businesses." / "Full-stack engineer in Samarinda. 3+ years of production systems for schools, government, and companies. Now building my own studio, in public."
   ID: "Aku membangun software yang jalan di bisnis nyata." / "Full-stack engineer di Samarinda. 3+ tahun membangun sistem produksi untuk sekolah, pemerintah, dan perusahaan. Sekarang membangun studio sendiri, terbuka untuk dilihat."
   - CTA utama: "See the work" → `/work`. CTA sekunder: "Start here" → `/start`.
   - **Tiga jalur pengunjung** tepat di bawah CTA, sebagai tiga tautan teks (bukan kartu): "I need something built", "I want the template", "I'm hiring".
   - **Lencana ketersediaan** dari `site_settings.availability` (mis. "Open for full-time roles" atau "Taking one new project"). Diisi dari dashboard; **disembunyikan bila kosong**. Tidak ada kelangkaan palsu.
3. **Bukti singkat**: tiga fakta dari `facts.ts` (status terverifikasi atau dinyatakan), satu baris.
4. **Video intro** (45 detik): `<video>` dihosting sendiri (MP4 + WebM, < 15 MB, `preload="metadata"`), poster dari file sendiri, tombol putar, caption EN dan ID (`.vtt`), tidak autoplay dengan suara. Teks ringkasan video ada di bawahnya untuk pengunjung yang tidak memutar.
5. **Yang saya kerjakan**: tiga baris tipografis (Services, Products, Journal), masing-masing satu kalimat dan satu tautan.
   - Services: "Payments and WhatsApp for Laravel apps, fixed scope. Custom software by conversation."
   - Products: "DualBrand, a multi-brand website template, with live demo and docs."
   - Journal: "Every week: one thing I built, one thing that broke."
6. **SAKOLENTRA**, judul seksi "SAKOLENTRA at SD Muhammadiyah 3 Samarinda" (nama sekolah boleh disebut; tanpa logo atau foto): diagram Tagihan → Virtual Account → Rekonsiliasi → WhatsApp (SVG buatan sendiri), tiga kalimat, tautan ke studi kasus, dan tautan sekunder "Run a pilot at your school" → `/contact?topic=school`. Tanpa tangkapan layar data nyata.
7. **Proyek lain**: tabel ringkas (nama, jenis, apa yang dibangun, periode). Isi dan periode dari `facts.ts`/MDX; deskripsi umum saja (portal pemerintah dengan migrasi data legacy, backend multi-cabang dengan presensi biometrik ke payroll, presensi QR dengan peta anggota, platform ticketing dengan checkout Midtrans). SD Muhammadiyah 3 Samarinda boleh disebut sebagai nama; klien lain tidak disebut tanpa izin tertulis.
8. **DualBrand**: tangkapan layar nyata, harga dari tabel `products`, tombol demo dan beli (UTM `utm_source=website`), satu baris lisensi dengan tautan ke `/license`.
9. **Stack dan cara kerja**: dua kolom teks. Kiri: teknologi yang benar-benar dipakai (Laravel/PHP, React, Next.js, TypeScript, MySQL, Midtrans, WhatsApp Cloud API, Docker, Nginx, GitHub Actions), tanpa dinding logo. Kanan: empat kebiasaan kerja yang terbukti, tiap butir satu kalimat: dikerjakan dari ujung ke ujung, ada pengujian otomatis, arsitektur dijaga rapi, dirilis dan dipelihara. Hanya hal yang memang dikerjakan.
10. **Jurnal**: dua entri terbaru berpasangan "berhasil" dan "rusak", tautan ke semua entri.
11. **Bukti sosial**: **hanya testimoni nyata berizin tertulis** (`src/content/testimonials/*.mdx` dengan `permission: true` dan `permissionNote`). Tampil nanti bersama ulasan Gumroad bila ada. **Jika tidak ada, section disembunyikan seluruhnya.** Tidak ada placeholder, kutipan fiktif, atau logo klien tanpa izin.
12. **FAQ**: enam pertanyaan terpilih (`home: true` di `src/content/faq.ts`) dalam komponen `accordion`, plus tautan "All questions" ke `/faq`. Seluruh isi dan terjemahan ada di §7.7.
13. **Pendaftaran email**: "One email, now and then: what I built, what broke." Satu kolom email + tombol, tautan ke `/privacy`. Double opt-in (email konfirmasi, tautan `/newsletter/confirm`), tautan berhenti berlangganan di setiap email, disimpan di `subscribers`. Tidak ada pop-up, tidak ada teks "jangan lewatkan". Tidak ada hadiah pendaftaran; jangan menjanjikan apa pun yang belum ada.
14. **CTA akhir**: tiga tombol sesuai tiga pengunjung (Hire me / Get the template / Work with me), unduh CV (EN dan ID), dan tautan sosial dengan UTM lewat `/go/*`.
15. **Footer**: navigasi, sosial, tautan hukum (`/privacy`, `/terms`, `/license`), lokasi (Samarinda, Indonesia), tahun, pengalih bahasa.

Perilaku responsif: urutan section sama di semua ukuran; tiga jalur menjadi tumpukan vertikal di bawah 640 px; tabel proyek lain menjadi daftar; tidak ada elemen sticky yang menutupi konten selain header.

Keadaan yang harus ditangani: skeleton untuk harga produk dan lencana ketersediaan; fallback bila data tidak tersedia (lencana dan bukti sosial menghilang, bukan menampilkan kosong); tanpa JavaScript, hero berupa gambar statis dan semua teks tetap terbaca; `prefers-reduced-motion` mematikan gerak dan adegan; halaman `not-found` dan `error` bermerek dengan tautan kembali.

**Start (`/start`)**: halaman "mulai dari sini" yang dirujuk narasi intro. Isi: video intro, tiga langkah (lihat karya, baca jurnal, ikuti), tautan sosial dengan UTM. Disematkan di bio.

**Work + SAKOLENTRA**: studi kasus MDX: masalah, keputusan arsitektur, hasil yang terukur (hanya yang terverifikasi), apa yang rusak dan diperbaiki. Tanpa data siswa. Sertakan jalur "bicara dengan saya" untuk pilot sekolah.

**Products + DualBrand**: demo langsung, daftar isi paket, lisensi, FAQ, dokumentasi, changelog, tombol beli ke Gumroad dengan UTM. Tidak memakai kata "production-ready" sebelum cek lulus.

**Services**: dua paket: (1) "Midtrans + WhatsApp untuk aplikasi Laravel" dengan lingkup, durasi, dan syarat awal; (2) software custom (SaaS, dashboard, integrasi API) lewat konsultasi. Formulir kontak menyimpan lead ke database.

**Journal**: daftar entri MDX, tiap entri berformat "satu berhasil, satu rusak" plus tautan ke video.

**Links (`/links`)**: hub untuk bio, tombol ke produk, jasa, jurnal, dan sosial; semua lewat `/go/[slug]` agar klik tercatat.

**About / Contact**: ringkas, fakta dari `facts.ts`; kontak lewat formulir dan alamat email dari variabel lingkungan (jangan hard-code).

**CV (`/cv`)**: dua tombol unduh (EN dan ID, PDF) dengan tanggal pembaruan; ringkasan satu paragraf dan tautan ke LinkedIn dan GitHub. File PDF berasal dari CV Anda yang terbaru; jangan menyertakan nomor telepon, tanggal lahir, atau alamat rumah. Unduhan dicatat sebagai peristiwa `cv_download`.

**Privacy (`/privacy`)**: daftar data yang benar-benar dikumpulkan situs: formulir kontak (nama, email, pesan), pendaftaran email, klik tautan pendek (tanpa IP dan tanpa user-agent mentah), analitik tanpa cookie. Isi: tujuan, lama simpan, cara meminta hapus data, kontak. Ditulis dalam bahasa sederhana; tinjau kebutuhan hukum (termasuk UU PDP) sebelum tayang.

**Terms (`/terms`)**: syarat penggunaan situs dan formulir, ringkas.

**License (`/license`)**: lisensi produk DualBrand dan produk berikutnya: yang boleh (mis. proyek klien), yang tidak boleh (mis. redistribusi), jumlah penggunaan, dukungan, dan pembaruan. Isi final ditetapkan Andy; jangan menyalin lisensi pihak lain tanpa memeriksa.

**Contact (`/contact?topic=`)**: topik terpilih lewat parameter (`school`, `project`, `hiring`, `other`); formulir `zod`, honeypot, simpan ke `leads` dengan segmen sesuai topik; konfirmasi di layar; tanpa mengirim data siswa.

**404 dan error**: bermerek, satu tautan ke Home dan satu ke `/start`.

### 7.7 FAQ (isi lengkap)

Halaman `/faq` menampilkan semua pertanyaan, dikelompokkan (Work with me, SAKOLENTRA, DualBrand, About), dengan tautan langsung per pertanyaan (`#id`). Home menampilkan enam yang bertanda `home: true`. Token `{fact:id}` dirender oleh `<Fact />` dan token `{setting:key}` oleh `site_settings`. Jawaban berasal dari fakta yang sudah Anda sampaikan; dua butir yang menyangkut praktik pribadi Anda (`ai` dan `start`) perlu Anda konfirmasi sebelum tayang.

```ts
// src/content/faq.ts
export type FaqGroup = "work" | "sakolentra" | "dualbrand" | "about";
export type FaqItem = {
  id: string;
  group: FaqGroup;
  home?: boolean;                 // tampil di Home (maksimal 6)
  requiresSetting?: string;       // tampil hanya bila site_settings terisi
  q: { en: string; id: string };
  a: { en: string; id: string };
};

export const faq: FaqItem[] = [
  // ---- Work with me ----
  { id: "build", group: "work", home: true,
    q: { en: "What do you build?", id: "Apa yang kamu bangun?" },
    a: { en: "Web systems that handle real operations: billing and payments, reconciliation, WhatsApp notifications, dashboards, and integrations. Backend in Laravel and PHP, frontend in React and Next.js. I take a project end to end: requirements, design, build, testing, and deployment.",
         id: "Sistem web untuk operasional nyata: tagihan dan pembayaran, rekonsiliasi, notifikasi WhatsApp, dashboard, dan integrasi. Backend dengan Laravel dan PHP, frontend dengan React dan Next.js. Aku mengerjakannya dari ujung ke ujung: kebutuhan, desain, implementasi, pengujian, sampai rilis." } },
  { id: "availability", group: "work", home: true,
    q: { en: "Are you taking projects or full-time roles?", id: "Apakah kamu menerima proyek atau peran penuh waktu?" },
    a: { en: "Both. I'm open to full-time roles (remote, onsite in Jakarta, or international teams that hire from Indonesia) and to selected projects. Pick a topic on the contact page so your message reaches the right place.",
         id: "Dua-duanya. Aku terbuka untuk peran penuh waktu (remote, onsite Jakarta, atau tim internasional yang merekrut dari Indonesia) dan untuk proyek terpilih. Pilih topik di halaman kontak supaya pesanmu sampai ke tempat yang tepat." } },
  { id: "pricing", group: "work", home: true,
    q: { en: "How is pricing decided?", id: "Bagaimana harga ditentukan?" },
    a: { en: "The Midtrans and WhatsApp integration package has a fixed scope, so it gets a fixed quote. Custom software is quoted after we talk through the problem. There is no public price list yet.",
         id: "Paket integrasi Midtrans dan WhatsApp punya lingkup tetap, jadi harganya tetap. Software custom dihitung setelah kita membahas masalahnya. Belum ada daftar harga publik." } },
  { id: "start", group: "work",
    q: { en: "What do you need from me to start?", id: "Apa yang kamu butuhkan dariku untuk mulai?" },
    a: { en: "A short description of the problem, who uses the system, which payment methods or services are involved, and any deadline that matters. I'll come back with questions or a proposed approach.",
         id: "Deskripsi singkat masalahnya, siapa yang memakai sistemnya, metode pembayaran atau layanan apa yang terlibat, dan tenggat yang penting. Aku akan kembali dengan pertanyaan atau usulan pendekatan." } },
  { id: "remote", group: "work", home: true,
    q: { en: "Do you work remotely?", id: "Apakah kamu bekerja remote?" },
    a: { en: "Yes. I'm based in Samarinda, Indonesia (UTC+8) and open to remote work with teams in other time zones.",
         id: "Ya. Aku tinggal di Samarinda, Indonesia (UTC+8) dan terbuka untuk kerja remote dengan tim di zona waktu lain." } },
  { id: "stack", group: "work",
    q: { en: "Which technologies do you use?", id: "Teknologi apa yang kamu pakai?" },
    a: { en: "Laravel, PHP, and MySQL for backends; React, Next.js, and TypeScript for frontends; Docker and Nginx on Linux for deployment. Integrations I have built include Midtrans, WhatsApp Cloud API, Claude API, and biometric attendance.",
         id: "Laravel, PHP, dan MySQL untuk backend; React, Next.js, dan TypeScript untuk frontend; Docker dan Nginx di Linux untuk deployment. Integrasi yang pernah kubangun: Midtrans, WhatsApp Cloud API, Claude API, dan presensi biometrik." } },
  { id: "ai", group: "work",   // KONFIRMASI ANDY sebelum tayang
    q: { en: "Do you use AI?", id: "Apakah kamu memakai AI?" },
    a: { en: "Yes, as a tool: AI coding assistants help with drafts and repetitive work. Architecture decisions, review, and testing stay with me. Anything that uses an AI voice or character is labeled.",
         id: "Ya, sebagai alat: asisten coding AI membantu draf dan pekerjaan berulang. Keputusan arsitektur, review, dan pengujian tetap di tanganku. Apa pun yang memakai suara atau karakter AI diberi label." } },

  // ---- SAKOLENTRA ----
  { id: "sakolentra-what", group: "sakolentra",
    q: { en: "What is SAKOLENTRA?", id: "Apa itu SAKOLENTRA?" },
    a: { en: "A system for school administration, finance, and operations: billing, tuition, virtual accounts, reconciliation, and WhatsApp notifications. It runs at SD Muhammadiyah 3 Samarinda with {fact:students} students. I built it and I own it.",
         id: "Sistem untuk administrasi, keuangan, dan operasional sekolah: tagihan, SPP, virtual account, rekonsiliasi, dan notifikasi WhatsApp. Berjalan di SD Muhammadiyah 3 Samarinda dengan {fact:students} siswa. Aku yang membangunnya dan aku pemiliknya." } },
  { id: "sakolentra-school", group: "sakolentra", home: true,
    q: { en: "Can my school use it?", id: "Bisakah sekolahku memakainya?" },
    a: { en: "I'm opening a small pilot with a few schools. Whether it fits depends on how your school collects fees today and which payment channels you use, so we check that first. The public demo uses dummy data only.",
         id: "Aku membuka pilot kecil dengan beberapa sekolah. Cocok atau tidaknya bergantung pada cara sekolahmu menagih biaya saat ini dan kanal pembayaran yang dipakai, jadi itu kita cek dulu. Demo publik hanya memakai data contoh." } },
  { id: "sakolentra-data", group: "sakolentra",
    q: { en: "What happens to student data?", id: "Bagaimana dengan data siswa?" },
    a: { en: "Student data belongs to the school. The public demo never uses real data, and a pilot would need a written data-processing agreement before any real data is loaded.",
         id: "Data siswa milik sekolah. Demo publik tidak pernah memakai data asli, dan pilot membutuhkan perjanjian pemrosesan data tertulis sebelum data asli dimuat." } },
  { id: "sakolentra-name", group: "sakolentra",
    q: { en: "Is SAKOLENTRA the same as ProductSchool?", id: "Apakah SAKOLENTRA sama dengan ProductSchool?" },
    a: { en: "Yes. ProductSchool was the earlier name of the same system.",
         id: "Ya. ProductSchool adalah nama lama dari sistem yang sama." } },

  // ---- DualBrand ----
  { id: "dualbrand-what", group: "dualbrand",
    q: { en: "What is DualBrand?", id: "Apa itu DualBrand?" },
    a: { en: "A Next.js website template for a business with a holding brand and two sub-brands, built on one codebase.",
         id: "Template website Next.js untuk bisnis dengan satu brand induk dan dua sub-brand, dibangun di atas satu codebase." } },
  { id: "dualbrand-license", group: "dualbrand", home: true,
    q: { en: "Can I use DualBrand for client projects?", id: "Bolehkah DualBrand dipakai untuk proyek klien?" },
    a: { en: "The license page lists exactly what you can and can't do, including client projects. Read it before you buy.",
         id: "Halaman lisensi menjelaskan persis apa yang boleh dan tidak boleh, termasuk proyek klien. Baca sebelum membeli." } },
  { id: "dualbrand-contents", group: "dualbrand",
    q: { en: "What do I get after buying?", id: "Apa yang kudapat setelah membeli?" },
    a: { en: "The product page lists the exact contents, the technology versions, and the setup requirements. If something you expected is missing, tell me through the contact page.",
         id: "Halaman produk memuat isi paket, versi teknologi, dan syarat pemasangan secara rinci. Jika ada yang kamu harapkan tetapi tidak ada, kabari aku lewat halaman kontak." } },
  { id: "dualbrand-where", group: "dualbrand",
    q: { en: "Where can I buy it?", id: "Di mana aku bisa membelinya?" },
    a: { en: "On Gumroad for international buyers, and on Lynk.id for buyers in Indonesia.",
         id: "Di Gumroad untuk pembeli internasional, dan di Lynk.id untuk pembeli di Indonesia." } },
  { id: "dualbrand-refund", group: "dualbrand",
    q: { en: "What about support and refunds?", id: "Bagaimana dengan dukungan dan pengembalian dana?" },
    a: { en: "Purchases go through Gumroad or Lynk.id, and the refund terms shown at checkout apply. For setup questions, use the contact page.",
         id: "Pembelian lewat Gumroad atau Lynk.id, dan ketentuan pengembalian dana yang tampil saat checkout berlaku. Untuk pertanyaan pemasangan, gunakan halaman kontak." } },

  // ---- About ----
  { id: "series", group: "about",
    q: { en: "What is the weekly series?", id: "Apa itu seri mingguan?" },
    a: { en: "Every week I share one thing that worked and one thing that broke while building the studio in public.",
         id: "Tiap minggu aku membagikan satu hal yang berhasil dan satu hal yang rusak selagi membangun studio secara terbuka." } },
  { id: "cv", group: "about",
    q: { en: "Where can I get your CV?", id: "Di mana aku bisa mendapatkan CV-mu?" },
    a: { en: "On the CV page, in English and Indonesian.",
         id: "Di halaman CV, dalam bahasa Inggris dan Indonesia." } },
  { id: "reply", group: "about", requiresSetting: "reply_time",   // tersembunyi sampai Andy mengisi
    q: { en: "How fast do you reply?", id: "Seberapa cepat kamu membalas?" },
    a: { en: "{setting:reply_time}", id: "{setting:reply_time}" } },
];
```

Tes `faq.test.ts`: setiap item punya EN dan ID; id unik; `home: true` tepat enam; tiap jawaban maksimal 60 kata; token `{fact:...}` merujuk fakta yang ada dan bukan `unverified`; tidak ada kata terlarang (§7.3); item dengan `requiresSetting` tidak dirender saat pengaturannya kosong.

Catatan: pertanyaan `reply` sengaja tersembunyi karena Anda belum menetapkan janji waktu balas. Isi di Pengaturan dashboard setelah Anda memutuskan.


---

## 8. Database

### Skema inti (Drizzle, MySQL)
Tabel pengguna dan sesi dibuat oleh perintah generate Better Auth; jangan ditulis tangan.

```ts
// src/db/schema.ts
import {
  mysqlTable, varchar, text, int, boolean, timestamp, date, json, decimal, mysqlEnum, uniqueIndex, index,
} from "drizzle-orm/mysql-core";

const id = () => varchar("id", { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID());
const createdAt = () => timestamp("created_at").defaultNow().notNull();

export const agents = mysqlTable("agents", {
  id: id(),
  slug: varchar("slug", { length: 40 }).notNull().unique(), // executive-assistant, engineering-lead, ...
  displayName: varchar("display_name", { length: 80 }).notNull(),
  role: varchar("role", { length: 120 }).notNull(),
  scope: text("scope").notNull(),
  canWrite: json("can_write").$type<string[]>().notNull(),
  requiresApproval: json("requires_approval").$type<string[]>().notNull(),
  apiKeyHash: varchar("api_key_hash", { length: 128 }),
  active: boolean("active").default(true).notNull(),
  createdAt: createdAt(),
});

export const tasks = mysqlTable("tasks", {
  id: id(),
  title: varchar("title", { length: 255 }).notNull(),
  plannedDate: date("planned_date"),
  session: mysqlEnum("session", ["pagi", "siang", "malam"]),
  lane: mysqlEnum("lane", ["produk", "video", "karier", "distribusi", "review"]).notNull(),
  durationMin: int("duration_min"),
  priority: mysqlEnum("priority", ["kritis", "tinggi", "fleksibel"]).default("tinggi").notNull(),
  status: mysqlEnum("status", ["belum", "jalan", "selesai", "ditunda"]).default("belum").notNull(),
  doneCriteria: text("done_criteria"),
  notes: text("notes"),
  completedAt: timestamp("completed_at"),
  createdAt: createdAt(),
}, (t) => [index("tasks_date_idx").on(t.plannedDate), index("tasks_status_idx").on(t.status)]);

export const agentTasks = mysqlTable("agent_tasks", {
  id: id(),
  taskId: varchar("task_id", { length: 36 }).references(() => tasks.id),
  agentId: varchar("agent_id", { length: 36 }).references(() => agents.id).notNull(),
  status: mysqlEnum("status", ["antri", "dikerjakan", "butuh_persetujuan", "selesai", "ditolak"]).default("antri").notNull(),
  summary: text("summary").notNull(),
  evidence: text("evidence"),                 // output perintah / URL pratinjau / diff
  approvalGate: varchar("approval_gate", { length: 60 }),
  approvedAt: timestamp("approved_at"),
  createdAt: createdAt(),
});

export const agentMessages = mysqlTable("agent_messages", {
  id: id(),
  fromAgentId: varchar("from_agent_id", { length: 36 }).references(() => agents.id),
  toAgentId: varchar("to_agent_id", { length: 36 }).references(() => agents.id),
  agentTaskId: varchar("agent_task_id", { length: 36 }).references(() => agentTasks.id),
  body: text("body").notNull(),
  createdAt: createdAt(),
});

export const leads = mysqlTable("leads", {
  id: id(),
  name: varchar("name", { length: 120 }).notNull(),
  handle: varchar("handle", { length: 120 }),
  platform: mysqlEnum("platform", ["linkedin", "tiktok", "instagram", "threads", "email", "lainnya"]).notNull(),
  segment: mysqlEnum("segment", ["freelancer", "agency", "multi_brand", "sekolah", "perekrut", "lainnya"]).notNull(),
  stage: mysqlEnum("stage", ["baru", "dihubungi", "balas", "diskusi", "penawaran", "menang", "kalah"]).default("baru").notNull(),
  sourceUtm: varchar("source_utm", { length: 120 }),
  url: varchar("url", { length: 500 }),
  notes: text("notes"),
  lastContactAt: timestamp("last_contact_at"),
  nextActionAt: timestamp("next_action_at"),
  createdAt: createdAt(),
}, (t) => [index("leads_stage_idx").on(t.stage)]);

export const outreachEvents = mysqlTable("outreach_events", {
  id: id(),
  leadId: varchar("lead_id", { length: 36 }).references(() => leads.id).notNull(),
  channel: varchar("channel", { length: 30 }).notNull(),
  direction: mysqlEnum("direction", ["keluar", "masuk"]).notNull(),
  body: text("body"),
  sentAt: timestamp("sent_at").defaultNow().notNull(),
  createdBy: mysqlEnum("created_by", ["owner", "agent"]).default("owner").notNull(),
  approvedByOwner: boolean("approved_by_owner").default(false).notNull(),
});

export const applications = mysqlTable("applications", {
  id: id(),
  company: varchar("company", { length: 160 }).notNull(),
  role: varchar("role", { length: 160 }).notNull(),
  url: varchar("url", { length: 500 }),
  channel: varchar("channel", { length: 40 }),
  status: mysqlEnum("status", ["terkirim", "balasan", "wawancara", "tes", "tawaran", "ditolak", "tidak_ada_kabar"]).default("terkirim").notNull(),
  sentAt: timestamp("sent_at"),
  followUpAt: timestamp("follow_up_at"),
  notes: text("notes"),
  createdAt: createdAt(),
});

export const contentItems = mysqlTable("content_items", {
  id: id(),
  title: varchar("title", { length: 200 }).notNull(),
  platform: mysqlEnum("platform", ["tiktok", "instagram", "threads", "linkedin", "youtube", "website"]).notNull(),
  format: mysqlEnum("format", ["video", "post", "carousel", "artikel"]).notNull(),
  series: mysqlEnum("series", ["build_in_public", "production_notes", "remotion_tips", "case_study", "lainnya"]),
  hook: text("hook"),
  status: mysqlEnum("status", ["ide", "naskah", "produksi", "terjadwal", "tayang"]).default("ide").notNull(),
  scheduledAt: timestamp("scheduled_at"),
  publishedAt: timestamp("published_at"),
  url: varchar("url", { length: 500 }),
  utmCampaign: varchar("utm_campaign", { length: 80 }),
  createdAt: createdAt(),
});

export const metricsDaily = mysqlTable("metrics_daily", {
  id: id(),
  date: date("date").notNull(),
  platform: mysqlEnum("platform", ["all", "tiktok", "instagram", "threads", "linkedin", "youtube", "gumroad", "lynk", "website"]).notNull(),
  metric: varchar("metric", { length: 40 }).notNull(),   // lamaran, dm, kunjungan_produk, klik_beli, penjualan, views, followers, ...
  value: decimal("value", { precision: 14, scale: 2 }).notNull(),
  source: mysqlEnum("source", ["manual", "import", "api"]).default("manual").notNull(),
}, (t) => [uniqueIndex("metrics_unique").on(t.date, t.platform, t.metric)]);

export const links = mysqlTable("links", {
  id: id(),
  slug: varchar("slug", { length: 60 }).notNull().unique(),
  destination: varchar("destination", { length: 800 }).notNull(),
  platform: varchar("platform", { length: 30 }),
  campaign: varchar("campaign", { length: 80 }),
  medium: varchar("medium", { length: 30 }).default("organic"),
  createdAt: createdAt(),
});

export const linkClicks = mysqlTable("link_clicks", {
  id: id(),
  linkId: varchar("link_id", { length: 36 }).references(() => links.id).notNull(),
  clickedAt: timestamp("clicked_at").defaultNow().notNull(),
  referrerHost: varchar("referrer_host", { length: 120 }),
  deviceType: varchar("device_type", { length: 20 }),       // tanpa IP dan tanpa user-agent mentah
}, (t) => [index("clicks_link_time").on(t.linkId, t.clickedAt)]);

export const products = mysqlTable("products", {
  id: id(),
  slug: varchar("slug", { length: 60 }).notNull().unique(),
  name: varchar("name", { length: 120 }).notNull(),
  status: mysqlEnum("status", ["draft", "live", "arsip"]).default("draft").notNull(),
  priceUsd: decimal("price_usd", { precision: 10, scale: 2 }),
  gumroadUrl: varchar("gumroad_url", { length: 500 }),
  lynkUrl: varchar("lynk_url", { length: 500 }),
  demoUrl: varchar("demo_url", { length: 500 }),
  licenseNote: text("license_note"),
  createdAt: createdAt(),
});

export const sales = mysqlTable("sales", {
  id: id(),
  productId: varchar("product_id", { length: 36 }).references(() => products.id).notNull(),
  platform: mysqlEnum("platform", ["gumroad", "lynk", "etsy", "payhip", "direct"]).notNull(),
  occurredAt: timestamp("occurred_at").notNull(),
  grossUsd: decimal("gross_usd", { precision: 10, scale: 2 }),
  netUsd: decimal("net_usd", { precision: 10, scale: 2 }),
  referrerUtm: varchar("referrer_utm", { length: 120 }),
  externalId: varchar("external_id", { length: 120 }),
  source: mysqlEnum("source", ["manual", "import", "ping"]).default("manual").notNull(),
}, (t) => [uniqueIndex("sales_ext").on(t.platform, t.externalId)]);

export const projects = mysqlTable("projects", {
  id: id(),
  slug: varchar("slug", { length: 60 }).notNull().unique(),
  name: varchar("name", { length: 120 }).notNull(),
  kind: mysqlEnum("kind", ["jasa", "produk", "konten", "internal"]).notNull(),
  stage: mysqlEnum("stage", ["ide", "validasi", "bangun", "pilot", "jalan", "arsip"]).default("ide").notNull(),
  summary: text("summary"),
  nextStep: text("next_step"),
  createdAt: createdAt(),
});

export const subscribers = mysqlTable("subscribers", {
  id: id(),
  email: varchar("email", { length: 254 }).notNull().unique(),
  locale: mysqlEnum("locale", ["en", "id"]).default("en").notNull(),
  status: mysqlEnum("status", ["pending", "confirmed", "unsubscribed"]).default("pending").notNull(),
  sourceUtm: varchar("source_utm", { length: 120 }),
  confirmTokenHash: varchar("confirm_token_hash", { length: 128 }),
  confirmedAt: timestamp("confirmed_at"),
  createdAt: createdAt(),
});

// Kunci: availability {status, noteEn, noteId, until?}, reply_time {en, id}
export const siteSettings = mysqlTable("site_settings", {
  key: varchar("key", { length: 60 }).primaryKey(),
  value: json("value").notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});
```

### Seed awal (`src/db/seed.ts`)
- **agents**: enam baris sesuai §3 (termasuk `owner`), dengan `canWrite` dan `requiresApproval` diisi dari tabel roster.
- **products**: DualBrand (`gumroadUrl` dan `lynkUrl` dari catatan Anda; harga diambil dari halaman Gumroad terkini, bukan diketik dari ingatan).
- **projects**: DualBrand (validasi), SAKOLENTRA untuk sekolah lain (ide), Jasa terpaket Midtrans + WhatsApp (ide), Seri konten mingguan (bangun).
- **links**: satu tautan per platform dengan UTM (`threads`, `tiktok`, `instagram`, `linkedin`, `youtube`) menuju `/start`.

### Impor CSV rencana minggu 1 (`src/db/import-csv.ts`)
Impor `andy-minggu1-tugas.csv` ke `tasks` dan `andy-minggu1-metrik.csv` ke `metrics_daily` (platform `all`). Pemetaan kolom tugas: Tugas → `title`, Tanggal → `plannedDate`, Sesi → `session`, Jalur → `lane` (Produk (DualBrand) → `produk`, Video Intro → `video`, Karier → `karier`, Distribusi → `distribusi`, Review → `review`), Durasi (menit) → `durationMin`, Prioritas → `priority` (Kritis/Tinggi/Fleksibel), Status → `status`, Hasil selesai → `doneCriteria`. Skrip harus idempoten (jalan dua kali tidak menggandakan baris).

### Privasi data
- Tidak ada data siswa, nomor VA, atau kredensial di database ini.
- `link_clicks` tidak menyimpan IP maupun user-agent mentah.
- Data penjualan dan lamaran hanya terlihat di dashboard dan tidak pernah dirender di halaman publik.
- Backup harian mysqldump terenkripsi di luar VPS; uji pemulihan sekali sebelum produksi.

---

## 9. Dashboard

Bahasa Indonesia. Layout: `sidebar` shadcn (ciutkan di layar sempit) + area konten. Semua tulis lewat server action dengan validasi `zod` dan cek sesi di dalam action (proxy saja tidak cukup).

| Halaman | Isi | Aksi |
|---|---|---|
| **Hari ini** (`/dashboard`) | Tugas hari ini per sesi (pagi/siang/malam), progres minggu vs target (9 lamaran, 30 outreach), 3 angka kemarin, persetujuan yang menunggu | Centang tugas, isi metrik cepat |
| **Tugas** | Tabel, papan (Kanban), dan kalender; filter jalur, prioritas, status | Impor CSV, tambah, geser status |
| **Lead** | Papan pipeline (baru → menang/kalah), laci detail dengan riwayat outreach | Tambah lead, catat pesan, jadwalkan tindak lanjut |
| **Lamaran** | Tabel lamaran dengan status dan tanggal tindak lanjut | Tambah, ubah status |
| **Konten** | Kalender per platform, status ide → tayang, hook per item | Jadwalkan, tandai tayang, tempel URL |
| **Metrik** | Grafik harian per platform dan metrik; tabel angka; catatan | Isi manual, impor CSV |
| **Produk** | Daftar produk, harga, penjualan, laporan UTM (klik → penjualan) | Tambah penjualan manual atau impor |
| **Proyek** | Pipeline proyek dan langkah berikutnya; daftar periksa kesiapan pilot SAKOLENTRA | Ubah tahap, catat langkah |
| **Agen** | Roster, antrian `agent_tasks`, persetujuan, log pesan | Setujui/tolak, tugaskan |
| **Tautan** | Tautan pendek dan jumlah klik per platform | Buat, nonaktifkan |
| **Pengaturan** | Status ketersediaan (lencana Home), estimasi balasan, status verifikasi `facts.ts`, daftar subscriber (konfirmasi, hapus, ekspor), sesi | Ubah `site_settings`, ekspor CSV |

### Saran mingguan berbasis aturan (`src/lib/rules.ts`)
Deterministik, tanpa LLM, mengikuti aturan keputusan dari rencana:
- Ada klik beli tetapi nol penjualan → "Ubah harga atau halaman jual, bukan menambah kanal."
- Tidak ada klik sama sekali → "Ganti hook dan saluran distribusi."
- Ada balasan lamaran atau DM → "Jadikan prioritas minggu berikutnya."
- Target lamaran atau outreach tertinggal dua hari berturut-turut → peringatan.
Setiap saran menampilkan angka dasar yang dipakai.

### Daftar periksa kesiapan pilot SAKOLENTRA (halaman Proyek)
Multi-sekolah (multi-tenant) atau satu instalasi per sekolah; integrasi pembayaran yang dapat dibawa (Midtrans) vs yang terikat bank (H2H Bankaltimtara); perjanjian pemrosesan data siswa dan kebijakan privasi; kontrak dengan sekolah pertama tidak membatasi penjualan; lingkungan demo dengan data dummy. Setiap butir punya status dan catatan; semuanya milik Andy untuk diputuskan.

---

## 10. Auth dan keamanan

- Better Auth dengan satu pemilik. Hanya identitas yang cocok dengan `OWNER_GITHUB_ID` (atau `OWNER_EMAIL`) yang diterima; pendaftaran publik dimatikan.
- `proxy.ts` melindungi `/dashboard/*` dan mengarahkan ke halaman masuk; **setiap** server action dan route handler memeriksa sesi ulang.
- Header keamanan: CSP ketat (izinkan hanya sumber yang dibutuhkan termasuk CDN adegan Unicorn Studio), `X-Content-Type-Options`, `Referrer-Policy`, `frame-ancestors 'none'`.
- Rate limit pada formulir kontak dan `/go/*`; honeypot atau Turnstile Cloudflare untuk spam.
- Variabel lingkungan divalidasi dengan `zod` di `lib/env.ts`; aplikasi gagal start jika ada yang kosong.
- `.env.example` hanya berisi nama: `DATABASE_URL`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `OWNER_GITHUB_ID`, `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`, `UNICORN_PROJECT_ID`, `CONTACT_EMAIL`, `NEXT_PUBLIC_SITE_URL`. Nilai asli tidak pernah masuk repo atau chat.
- API agen (`/api/agent/*`, Fase 5): token per agen disimpan sebagai hash, cakupan sesuai `canWrite`, setiap panggilan dicatat; tindakan di §3 gerbang persetujuan hanya bisa berstatus `butuh_persetujuan`, tidak pernah langsung dieksekusi.

---

## 11. Pelacakan dan analitik

- `/go/[slug]`: redirect 302, catat klik ke `link_clicks` (tanpa IP), tambahkan UTM dari baris `links`.
- Format UTM: `utm_source` (threads, tiktok, instagram, linkedin, youtube, website), `utm_medium=organic`, `utm_campaign` (mis. `dualbrand_launch`, `intro_video`).
- Analitik pengunjung: Umami atau Plausible (tanpa cookie, bisa self-host); tidak memerlukan banner cookie.
- Halaman produk mengirim klik tombol beli sebagai peristiwa agar bisa dibandingkan dengan penjualan di Gumroad/Lynk.
- Peristiwa yang dikirim ke analitik (tanpa data pribadi): `hero_cta_click` (work/start), `audience_route_click` (client/buyer/hiring), `video_play` dan `video_progress` (25/50/100), `product_demo_click`, `product_buy_click`, `cv_download` (en/id), `contact_submit` (topic), `subscribe_submit`, `subscribe_confirm`, `faq_open` (id pertanyaan), `social_click` (platform).
- Satu peristiwa = satu nama tetap di `src/lib/events.ts`; komponen tidak boleh menulis nama peristiwa sendiri.
- Sinkronisasi penjualan Gumroad otomatis (Ping/webhook) opsional di Fase 5; cek dokumentasi Gumroad terkini sebelum dibuat. Sampai itu ada, penjualan dicatat manual atau impor CSV.

---

## 12. Fase kerja

### Fase 0 — Fondasi dan inventaris
1. Inventaris situs lama (daftar URL, aset, dependensi) dan `docs/REDIRECTS.md`.
2. `shadcn init -t next`, pasang MCP shadcn, Next devtools, Jiro; buat `.env.example`, `lib/env.ts`, `docs/DECISIONS.md`.
3. Token §5.1 di `globals.css`, `next-themes`, font Inter, aturan lint.
4. Docker Compose lokal (MySQL 8) dan skrip `pnpm db:up`.
**Verifikasi:**
```bash
pnpm typecheck && pnpm lint && pnpm build
```
Tempel output. Tangkapan layar halaman uji token di mode terang dan gelap.

### Fase 1 — Sistem desain dan kerangka publik
1. Primitif section (`Section`, `Container`, `Prose`, `Kicker`), header, footer, pengalih bahasa dan tema.
2. `facts.ts`, komponen `<Fact />`, tes fakta dan tes kata terlarang.
3. Home versi pertama dengan hero **tanpa** Unicorn (gambar statis), semua teks dari `messages/`.
**Verifikasi:** `pnpm test`, still Playwright 375, 768, 1280 px untuk Home di dua tema, tidak ada teks terpotong atau tumpang tindih.

### Fase 2 — Konten publik dan adegan Unicorn
1. `/start`, `/work` + SAKOLENTRA (MDX), `/products/dualbrand`, `/services`, `/journal`, `/about`, `/contact`, `/links`, `/cv`, `/faq`, `/privacy`, `/terms`, `/license`, alur pendaftaran email (konfirmasi dan berhenti berlangganan), `not-found` dan `error`.
2. Adegan Unicorn Studio di hero sesuai §5.2, dengan fallback dan `prefers-reduced-motion`.
3. Referensi section dari Jiro dicatat di `docs/REFERENCES.md`.
4. Metadata, `sitemap.ts`, `robots.ts`, gambar OG, JSON-LD (Person dan Organization), `hreflang`.
**Verifikasi:** Playwright (semua rute 200, tidak ada error konsol), axe tanpa pelanggaran serius, Lighthouse seluler Home: performa, aksesibilitas, SEO masing-masing ≥ 90, LCP < 2,5 s, CLS < 0,1, INP < 200 ms.

### Fase 3 — Database, auth, dashboard inti
1. Skema §8, migrasi (`drizzle-kit generate` lalu `migrate`), seed, impor CSV.
2. Better Auth + `proxy.ts` + cek sesi di setiap action.
3. Halaman Hari ini, Tugas, Metrik.
**Verifikasi:** migrasi bersih di database kosong, seed dan impor idempoten (jalankan dua kali, jumlah baris sama), tes unit `rules.ts`, E2E: tanpa sesi `/dashboard` redirect ke masuk; dengan sesi pemilik tampil.

### Fase 4 — Lead, lamaran, konten, produk, tautan
1. Halaman Lead (Kanban + laci), Lamaran, Konten (kalender), Produk (penjualan + laporan UTM), Tautan.
2. `/go/[slug]` dan formulir kontak yang menyimpan lead.
**Verifikasi:** E2E alur "kirim formulir kontak → lead muncul di dashboard", "klik tautan pendek → klik tercatat", uji tidak ada IP di `link_clicks`.

### Fase 5 — Agen dan proyek
1. Halaman Proyek (termasuk daftar periksa pilot SAKOLENTRA) dan Agen (roster, antrian, persetujuan, log pesan).
2. API agen dengan token per agen, cakupan, dan log (opsional bila belum ingin dihubungkan).
**Verifikasi:** tes otorisasi (agen tidak bisa menulis di luar `canWrite`; tindakan gerbang selalu berhenti di `butuh_persetujuan`).

### Fase 6 — Peluncuran
1. Dockerfile, Compose produksi, Nginx, Cloudflare, backup terenkripsi, uji pemulihan.
2. Redirect 301 dari URL lama diuji satu per satu.
3. Pastikan `sakolentra.andypratama.studio` tetap berfungsi.
4. Lighthouse CI di GitHub Actions.
**Verifikasi:**
```bash
curl -sI https://andypratama.studio | head -n 5
# untuk tiap URL lama di docs/REDIRECTS.md: curl -sI <url-lama> memuat 301 dan Location benar
pnpm exec playwright test && pnpm exec lhci autorun
```

---

## 13. Urutan terhadap rencana minggu 1

Membangun ulang situs dan dashboard adalah pekerjaan besar dengan hasil tidak langsung ke uang. Rencana minggu 1 (DualBrand siap jual, video intro, lamaran, outreach) tetap prioritas.

- **Minggu 1:** jangan mulai Fase 0. Hanya pastikan tautan DualBrand, `/start` sementara (satu halaman di situs lama atau Gumroad), dan bio memakai UTM.
- **Minggu 2:** Fase 0 dan 1, lalu versi minimum Fase 2: Home, `/start`, `/products/dualbrand`, `/links`, `/cv`, `/privacy`. Tayang bila enam halaman ini lolos verifikasi (`/privacy` wajib karena formulir mengumpulkan data).
- **Minggu 3–4:** Fase 3 dan 4 (dashboard inti, lead, lamaran, metrik). Dashboard menggantikan CSV dan Notion setelah impor berhasil.
- **Setelah itu:** Fase 5 dan 6, dan halaman `/work`, `/services`, `/journal` penuh.

---

## 14. Draf `AGENTS.md` untuk repo

```md
# AGENTS.md — andypratama.studio

Bahasa laporan: Indonesia. Kode: Inggris. Klaim selesai hanya dengan output perintah nyata.

## Aturan
- Fakta hanya dari src/content/facts.ts. Dilarang mengarang angka, testimoni, logo klien.
- Jangan tampilkan data siswa, VA, kredensial. Jangan commit secret.
- Warna lewat token CSS (globals.css). Jangan hard-code hex di komponen.
- Satu font: Inter. Satu aksen: --brand.
- Tidak ada any, @ts-ignore, atau ignoreBuildErrors.
- Dependency baru: sebut alasan dan ukuran dulu.
- Tindakan di gerbang persetujuan (publish, kirim pesan, ubah harga, deploy, hapus data, ubah facts.ts) berhenti di status butuh_persetujuan.

## Perintah
pnpm dev | pnpm typecheck | pnpm lint | pnpm test | pnpm exec playwright test | pnpm build
pnpm db:up | pnpm db:generate | pnpm db:migrate | pnpm db:seed | pnpm db:import-csv

## Pembagian
engineering-lead: src/, drizzle/, tests/, docker/
creative-director: src/styles/, src/components/brand/, public/media/
content-strategist: src/content/, src/messages/
business-operations: data produk, lead, lamaran, tautan (usulan, bukan eksekusi)
```

---

## 15. Definition of done (tempel bukti satu per satu)

- [ ] `pnpm typecheck`, `pnpm lint`, `pnpm test`, `pnpm build` semuanya lulus.
- [ ] `grep -rn "font-size: 0\|ignoreBuildErrors\|@ts-ignore" src next.config.*` kosong.
- [ ] Semua angka publik berasal dari `facts.ts`; tes fakta dan tes kata terlarang lulus.
- [ ] Token warna §5.1 dipakai; tidak ada hex di komponen (`grep` pada `src/components`).
- [ ] Adegan Unicorn lazy, punya fallback statis, dan mati saat `prefers-reduced-motion`.
- [ ] Setiap section yang diadaptasi dari Jiro tercatat di `docs/REFERENCES.md` beserta pemeriksaan lisensi.
- [ ] Semua rute publik 200, tidak ada error konsol, axe tanpa pelanggaran serius.
- [ ] Lighthouse seluler Home ≥ 90 (performa, aksesibilitas, SEO), LCP < 2,5 s, CLS < 0,1.
- [ ] Migrasi bersih, seed dan impor CSV idempoten.
- [ ] `/dashboard` hanya bisa dibuka pemilik; tes otorisasi lulus.
- [ ] Redirect 301 dari semua URL lama terbukti; `sakolentra.andypratama.studio` tetap hidup.
- [ ] `link_clicks` tidak memuat IP atau user-agent mentah.
- [ ] Home memuat 15 section sesuai urutan §7.6; section bukti sosial dan lencana ketersediaan **tidak tampil** bila datanya kosong.
- [ ] Tidak ada testimoni, logo klien, atau angka yang tidak berasal dari `facts.ts` atau MDX berizin (`grep` pada `src/messages` dan `src/content`).
- [ ] Video intro punya caption EN dan ID, tidak autoplay bersuara, ukuran < 15 MB.
- [ ] Unduhan CV (EN dan ID) berfungsi, dan berkas tidak memuat telepon, tanggal lahir, atau alamat rumah.
- [ ] Pendaftaran email memakai double opt-in; konfirmasi dan berhenti berlangganan diuji E2E.
- [ ] `/privacy`, `/terms`, `/license` tayang dan sesuai data yang benar-benar dikumpulkan.
- [ ] Nama peristiwa analitik hanya berasal dari `src/lib/events.ts`.
- [ ] `/faq` menampilkan semua pertanyaan dalam EN dan ID; Home menampilkan tepat enam; `faq.test.ts` lulus; pertanyaan `reply` tidak tampil sebelum pengaturannya diisi.
- [ ] Hanya nama SD Muhammadiyah 3 Samarinda yang muncul sebagai klien; tidak ada logo atau foto sekolah (`grep` pada `public/` dan `src/content`).
- [ ] Home dapat dibaca penuh tanpa JavaScript dan saat `prefers-reduced-motion`.

**Laporan akhir wajib memuat:** daftar file yang diubah, output perintah verifikasi per fase, tabel Lighthouse, daftar dependency baru dengan alasan dan ukuran, pemetaan redirect, dan hal yang belum selesai beserta alasannya.

---

## 16. Hal yang belum bisa dipastikan

- **Mode gelap palet:** nilai di §5.1 adalah turunan, bukan dari tautan Anda. Verifikasi di Realtime Colors.
- **Unicorn Studio:** nama prop `unicornstudio-react` untuk skala, DPI, dan lazy load, serta batas paket gratis, harus dicek di README paket dan halaman pricing.
- **Jiro:** syarat lisensi untuk kode template premium belum saya baca.
- **API terbaru:** Next.js 16, Better Auth, dan Drizzle bisa berubah; baca dokumentasi sebelum menulis kode.
- **Situs lama:** teknologi dan struktur URL-nya belum diinventaris.
- **FAQ:** butir `ai` dan `start` menyangkut praktik pribadi Anda dan harus Anda konfirmasi; janji waktu balas belum ditetapkan.
- **Nama karakter agen** di office-dashboard dan status A2A/AndyOS: belum terverifikasi.
- **Hasil visual:** kualitas adegan, tipografi, dan kesan keseluruhan harus Anda lihat sendiri sebelum tayang.
