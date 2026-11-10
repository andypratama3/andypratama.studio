# DECISIONS — Catatan Keputusan Teknis Proyek

Dokumen ini mencatat keputusan arsitektural dan teknis yang diambil selama pembangunan `andypratama.studio`.

## 1. Pilihan Primitif UI (F0-03) — diperbarui 9 Nov 2026
- **Keputusan**: Base UI (`@base-ui/react`) menggantikan Radix UI. Paket `@base-ui/react` sudah terpasang di repo (`^1.9.0`). Komponen shadcn yang sudah ada tetap berjalan; migrasi ke Base UI dilakukan bertahap.
- **Alasan**: Base UI adalah penerus resmi Radix UI dari tim MUI/Radix, aksesibilitas WCAG AA out-of-the-box, kompatibel dengan React 19 / Next.js 16. Owner mengonfirmasi pilihan Base UI pada sesi Batch 1 (9 Nov 2026).
- **Tanggal direvisi**: 9 November 2026 (semula: 8 November 2026 — Radix UI).

## 2. Server Routing & Middleware (G-04)
- **Keputusan**: Menggunakan `src/proxy.ts` (Next.js 16 named export `proxy`) menggantikan `middleware.ts`.
- **Alasan**: Sesuai pembaruan Next.js 16.2+, middleware diubah menjadi file `proxy.ts` dengan export named `proxy`.
- **Tanggal**: 8 November 2026.

## 3. Database & ORM (F0-06, F3-01)
- **Keputusan**: MySQL 8 dengan Drizzle ORM (`drizzle-orm`, `drizzle-kit`, `mysql2`).
- **Alasan**: Sesuai VPS Ubuntu yang sudah ada, type-safe query, idempoten, performa tinggi, dan adapter resmi Better Auth tersedia (`@better-auth/drizzle-adapter` atau `better-auth/adapters/drizzle`).
- **Tanggal**: 8 November 2026.

## 4. Sistem Warna & Tema (F0-05)
- **Keputusan**: Palet Realtime Colors dengan token `--brand: #433bff` (mode terang) dan `--brand: #6f69ff` (mode gelap).
- **Alasan**: Token `--accent` di shadcn difungsikan khusus sebagai hover/muted latar belakang menu, sedangkan warna merek Andy Pratama Studio menggunakan `--brand` dan `@theme inline { --color-brand: var(--brand) }`.
- **Sumber Owner**: [Realtime Colors](https://www.realtimecolors.com/?colors=050315-fbfbfe-2f27ce-dedcff-433bff&fonts=Inter-Inter) + curation marcelodesignxh + [Unicorn Studio](https://www.unicorn.studio/docs/getting-started/) + [Jiro](https://jiro.build/). Inventaris: `docs/REFERENCES.md`.
- **Tanggal**: 8 November 2026.

## 5. Sumber Fakta & Larangan Karangan (F1-03, F1-04)
- **Keputusan**: Seluruh angka dan klaim harus melalui `src/content/facts.ts` dengan status `verified` atau `stated`. Komponen `<Fact />` menolak status `unverified`.
- **Alasan**: Mencegah "AI slop", menjaga kredibilitas portfolio, dan mematuhi batas izin SD Muhammadiyah 3 Samarinda (nama saja tanpa logo/foto).
- **Tanggal**: 8 November 2026.

## 6. Label tipografi tanpa font mono (layout improve 9 Nov 2026)
- **Keputusan**: Label gaya referensi (`/EST 2025/`, kicker, corner hero) memakai **Inter** uppercase, `letter-spacing: 0.08em`, 11–12 px, `tabular-nums` via utility `.text-label`. Tidak menambah font mono.
- **Alasan**: Aturan repo satu font Inter; Owner default §9 prompt layout. Font mono butuh persetujuan terpisah.
- **Tanggal**: 9 November 2026.

## 7. Hero wordmark marquee + permukaan invert (9 Nov 2026)
- **Keputusan**: Wordmark "ANDY PRATAMA" marquee pelan; **statis** saat `prefers-reduced-motion` dan tanpa JS. Hero + CTA akhir memakai `surface-invert` lewat token `--surface-contrast` / `--surface-contrast-foreground` (selalu papan gelap di terang dan gelap). **Tidak** memakai `bg-foreground text-background` — di `.dark` pasangan itu terbalik jadi papan terang. Visual Unicorn = SVG grid/wave sampai A-08.
- **Alasan**: Pola video detail-v2 + Unicorn Studio; aturan hardcoded warna dan reduced-motion; perbaikan kontras dark mode.
- **Tanggal**: 9 November 2026.

## 8. FloatingNav + StickySteps + footnotes (revisi v2, 9 Nov 2026)
- **Keputusan**: Nav pil melayang Velto di **semua halaman publik** (bukan dashboard). Adaptasi terang/gelap via `data-nav-theme` + IntersectionObserver. StickySteps murni CSS (stack biasa <640px / reduced-motion). FootnoteList menampilkan status dinyatakan/terverifikasi dari `facts.ts`. Tanpa Lenis/GSAP (A.7 default). Tanpa istilah Apple/Velto di UI.
- **Alasan**: Prompt layout v2 Lampiran B; Owner defaults §9.
- **Tanggal**: 9 November 2026.

## 9. Hero / intro media via Higgsfield (9 Nov 2026)
- **Keputusan**: Target generator = Higgsfield MCP (`seedance_2_5` video ~35 kredit; `gpt_image_2_6` poster). Saat ini akun **out of credits** / butuh plan basic+. Interim: poster di `public/media/hero-bg-poster.jpg` dan `intro-video-poster.jpg` (generated in-session), di-wire ke `HeroVisual` + blok video intro. Slot video `/media/hero-bg.mp4` siap; aktifkan prop `videoSrc` setelah file ada dari Higgsfield.
- **Alasan**: Owner minta generate background lewat Higgsfield; tidak boleh memblokir layout menunggu kredit.
- **Tanggal**: 9 November 2026.

## 10. Layout improve pass — scope (9 Nov 2026)
- **Keputusan**: Pass layout v2 menutup crash `SakolentraDiagram` (nodes wajib aman), memperkuat StickySteps (min-height sticky ≥640), truncate wordmark FloatingNav, `navTheme` di `PublicPageShell`. **Tidak** mengubah `facts.ts`. Copy messages tidak disentuh di pass layout ini. Lampiran C (plugin gaps G1–G14), Playwright E2E, dan LHCI **ditunda** — Playwright/`@lhci/cli` belum terpasang di repo.
- **Alasan**: Prompt layout §5–§7; verifikasi yang ada: typecheck, lint, vitest, build, grep §7/B.6.
- **Tanggal**: 9 November 2026.

## 11. Lampiran D L0–L1 (9 Nov 2026)
- **Keputusan**: Mulai D.9 dari L0 (audit jujur) lalu L1 fondasi: `src/lib/motion.ts`, `events.ts`, `wiring.ts`, SkipLink, `/dev/wiring` + `/dev/components` (dev-only via `notFound` di production), `pnpm wiring:check` (saat ini gagal dengan sengaja sampai Playwright hijau). **Belum** memasang `motion` / `lenis` / `gsap` — ukuran dilaporkan di PLUGIN-AUDIT; GSAP ditolak sementara (A.7); Lenis ditunda; `motion` menunggu persetujuan Owner bila anggaran JS Home ketat.
- **Alasan**: Konflik D vs C: D menang; bukti runtime wajib, bukan klaim terpasang.
- **Tanggal**: 9 November 2026.

## 12. Owner Defaults O-01..O-11 — Batch 1 (9 Nov 2026)

Keputusan-keputusan berikut dikonfirmasi Owner sebelum eksekusi Batch 1.

| Kode  | Topik | Keputusan |
|-------|-------|-----------|
| O-01  | Font tunggal | Inter saja; tidak ada font tambahan tanpa persetujuan. |
| O-02  | Warna aksen | Token `--brand` saja; tidak ada hex hardcode di komponen. |
| O-03  | Nama brand UI | Tidak menyebut Apple/Velto/Unicorn di teks UI publik. |
| O-04  | Bahasa ID sapaan | Saya/Anda konsisten; tidak ada "kamu" untuk menyapa pengunjung. |
| O-05  | Fakta publik | Semua angka dan klaim dari `src/content/facts.ts`; tidak ada karangan. |
| O-06  | Note internal | `fact.note` tidak pernah ditampilkan ke publik; gunakan `publicNote` bila perlu. |
| O-07  | CTA DualBrand | Demo dan beli disembunyikan sampai `OUTBOUND_LINKS.*.verified = true`. |
| O-08  | Harga produk | Tidak ada harga hardcode di komponen atau pesan; gunakan `products.ts`. |
| O-09  | Video intro | Bagian IntroVideo dihapus dari Home sampai aset video tersedia. |
| O-10  | Periode proyek | Kolom periode dihilangkan dari HairlineTable di Home (data umum). |
| O-11  | FAQ pendingOwner | Item `ai` dan `start` disembunyikan dari publik sampai Owner mengonfirmasi. |

- **Tanggal**: 9 November 2026.

## 13. Dashboard Auth Redirect (B-17, Batch 2) — 9 Nov 2026
- **Keputusan**: Perlindungan rute `/dashboard` dinonaktifkan (`protectedPaths = []`) sampai auth Phase 3 tersambung. Sebelumnya: redirect ke `/auth/sign-in` yang belum ada → error 404 tersembunyi. Sekarang: `proxy.ts` tidak melindungi rute apapun sementara ini.
- **Alternatif bila perlu segera**: ganti `NextResponse.notFound()` jika branded-404 diperlukan.
- **Rencana Phase 3**: Tambah kembali `/dashboard` ke `protectedPaths` setelah `better-auth` tersambung dan `/auth/sign-in` ada.
- **Tanggal**: 9 November 2026.

## 15. ThemeHotkey removed (B-19, Batch 3) — 9 Nov 2026
- **Keputusan**: `ThemeHotkey` (single-key `d`) dihapus dari `src/components/theme-provider.tsx`. Toggle tema tetap tersedia lewat `ThemeSwitcher` di FloatingNav.
- **Alasan**: Single-key shortcut tanpa modifier tidak memenuhi standar aksesibilitas keyboard (mengganggu pengguna screen reader dan pengguna keyboard). Preferensi spec B-19: hapus bila tidak dibutuhkan.
- **Tanggal**: 9 November 2026.

## 16. `/start` sebagai form kanonik, kontak dialihkan (O-05, B-24, Batch 3) — 9 Nov 2026
- **Keputusan**: `/start` adalah halaman kontak kanonik satu-satunya. CTA "Tell me what you need" / "Ceritakan kebutuhan Anda" selalu menuju `/start`. Halaman `/contact` tetap ada tetapi bukan CTA utama.
- **Alasan**: O-05 menetapkan `/start?topic=…` sebagai entry point untuk semua permintaan; menghindari dua form yang bersaing.
- **Tanggal**: 9 November 2026.

## 17. Nav & footer link ke halaman nyata, bukan anchor (B-23, Batch 3) — 9 Nov 2026
- **Keputusan**: FloatingNav dan Footer menggunakan `/work`, `/products`, `/services`, `/journal`, `/about` — bukan `/#work` dll. Home page mempertahankan anchor in-page secara terpisah via `id` di `<Section>`.
- **Alasan**: Hash link ke halaman lain tidak berfungsi saat pengguna sudah berada di halaman selain Home. Link nyata memberikan navigasi yang dapat diandalkan dari halaman mana pun.
- **Tanggal**: 9 November 2026.

## 14. In-memory Rate Limit & IP Spoofing (B-32, Batch 2) — 9 Nov 2026
- **Keputusan**: `src/lib/rate-limit.ts` menggunakan `Map` in-process. Batasan diketahui:
  1. **IP spoofing**: header `x-forwarded-for` bisa dipalsukan oleh klien tanpa trusted proxy. Mudah dilewati.
  2. **Multi-instance**: setiap instance Next.js memiliki Map sendiri; rate limit tidak berbagi state di cluster atau serverless.
  3. **Memory leak**: entri lama tidak expire otomatis tanpa cleanup job.
- **Mitigasi sementara**: Berguna untuk menghambat bot sederhana + flood dari satu IP; bukan keamanan penuh.
- **Rencana Phase 3**: Ganti dengan Redis-backed rate limit (misal `@upstash/ratelimit`) di balik trusted reverse proxy yang men-set `x-forwarded-for` dengan benar.
- **Tanggal**: 9 November 2026.

## 19. Redirect lama + CSP baseline (Batch 4, O-09, B-26, B-34) — 9 Nov 2026
- **Keputusan**: 301 sesuai default O-09. CSP memakai `script-src 'unsafe-inline' 'unsafe-eval'` dan `style-src 'unsafe-inline'` supaya Next + next-themes tetap jalan. Host Unicorn/analitik **belum** masuk `connect-src` sampai A-08 / D-02.
- **Tanggal**: 9 November 2026.

## 18. Pengecualian Aksesibilitas Honeypot (Batch 3B) — 9 Nov 2026
- **Keputusan**: Kolom spam honeypot (`name="website"`) pada `ContactForm` dan `NewsletterForm` menggunakan komponen `<Input />` shadcn yang dibungkus `<span className="sr-only" aria-hidden="true">` dengan atribut `tabIndex={-1}` dan `autoComplete="off"`.
- **Alasan**: Honeypot harus tersembunyi secara visual dari pengguna manusia, tidak dapat difokuskan melalui navigasi keyboard (`tabIndex={-1}`), dan diabaikan oleh teknologi asistif / screen reader (`aria-hidden="true"`), namun tetap terbaca oleh bot spam otomatis yang memindai formulir.
- **Tanggal**: 9 November 2026.

## 20. motion untuk interaksi, CSS untuk gerak terus-menerus — 9 Nov 2026
- **Keputusan**: Pasang `motion@14.11.1` lewat `LazyMotion` + `domAnimation` saja. Dipakai untuk pegas pointer hero, pil nav aktif, dan langkah alur yang bisa dipilih. Marquee, reveal, dan sticky steps tetap CSS. Tanpa Lenis/GSAP.
- **Alasan**: Owner minta landing interaktif dan Framer benar-benar terpasang. Paket penuh npm unpacked 999743 byte; tree `motion-dom` 6.2M. Subset DOM menjaga anggaran JS. Gerak tak terbatas lebih murah di compositor CSS, dan tetap statis saat `prefers-reduced-motion`.
- **Tanggal**: 9 November 2026.

## 21. Motion untuk narasi scroll — 9 Nov 2026
- **Keputusan**: `LazyMotion` memakai `domMax` dari paket `motion` yang sama, tanpa dependency baru. Reveal section, mask media, panel, progress nav, dan wordmark penghubung memakai `motion/react`. Koreografi hero dan loop wordmark tetap CSS supaya first paint tidak transparan. Tanpa Lenis/GSAP.
- **Alasan**: Owner minta landing terasa hidup dari hero sampai footer. Konten tetap terbaca tanpa JavaScript dan saat `prefers-reduced-motion`.
- **Tanggal**: 9 November 2026.

