# REDIRECTS — inventaris URL situs lama

Status: **diimplementasikan 9 Nov 2026 (Batch 4, default O-09 / B-26).**  
Studi kasus lama yang belum punya halaman → **301 `/work`**.  
`productschool` dan `sdmuhammadiyah3new` → **301 `/work/sakolentra`**.  
`sdmuhammadiyah3` (v1) ikut `/work` sampai ada studi kasus terpisah.  
Tabel §2 yang “slug dipertahankan” **ditimpakan** oleh keputusan ini; jangan dibaca sebagai target hidup.

- Sumber: `https://www.andypratama.studio/sitemap.xml` + verifikasi status HTTP per URL.
- Tanggal crawl: 8 November 2026.
- Apex `andypratama.studio` → 308 ke `www.andypratama.studio` (perilaku hosting lama, bukan keputusan kita).
- `robots.txt` lama: `Allow: /`, `Disallow: /api/`, sitemap tunggal tanpa `hreflang` (hanya `x-default`).
- Konteks dari Owner: situs ini adalah portfolio yang sedang berjalan; **domain akan di-repoint** ke situs baru nanti. Karena itu 301 harus siap sebelum repoint, bukan sesudah.

## 1. Inventaris

14 URL terdaftar di sitemap. Semua 200 kecuali satu yang tidak merespons saat crawl.

| # | URL lama | Status | Judul / isi | Catatan |
|---|---|---|---|---|
| 1 | `/` | 200 | Home | — |
| 2 | `/about` | 200 | About | — |
| 3 | `/products` | 200 | Products (kartu DualBrand) | — |
| 4 | `/work` | 200 | Work index | — |
| 5 | `/work/bappedakaltim` | 200 | Bappeda Kaltim | — |
| 6 | `/work/blk-management-system` | 200 | BLK Management System | — |
| 7 | `/work/database-ansor-kaltim` | **000** | — | Ada di sitemap, tidak merespons (timeout/TLS). Tetap dipetakan. |
| 8 | `/work/ismi` | 200 | ISMI | `<title>` kosong, konten kemungkinan render client-side |
| 9 | `/work/kartaspa` | 200 | Karta Spa | — |
| 10 | `/work/koetai-mahkota` | 200 | Koetai Mahkota | — |
| 11 | `/work/kuepandanasli` | 200 | Kue Pandan Asli | — |
| 12 | `/work/productschool` | 200 | **Sakolentra** (judul lama sudah SAKOLENTRA) | Nama "ProductSchool" hanya riwayat, tidak tampil di halaman baru |
| 13 | `/work/sdmuhammadiyah3` | 200 | School Management System **v1** | — |
| 14 | `/work/sdmuhammadiyah3new` | 200 | School Management System **v2** | Duplikat topik dengan #13 |

Tidak ada `/services`, `/journal`, `/links`, `/cv`, `/faq`, `/privacy`, `/terms`, `/license` di sitemap lama — jadi URL baru tersebut murni penambahan, bukan pengganti.

## 2. Pemetaan lama → baru

Target mengikuti struktur §6 spesifikasi. Kolom "baru" memakai locale default **tanpa prefiks** (`/work`, bukan `/en/work`); lihat §4 G-13.

| URL lama | URL baru | Tipe | Alasan |
|---|---|---|---|
| `/` | `/` | 301 | Home baru menggantikan home lama |
| `/about` | `/about` | 301 | Sama |
| `/products` | `/products` | 301 | Sama |
| `/work` | `/work` | 301 | Sama |
| `/work/bappedakaltim` | `/work/bappedakaltim` | 301 | Slug dipertahankan |
| `/work/blk-management-system` | `/work/blk-management-system` | 301 | Slug dipertahankan |
| `/work/database-ansor-kaltim` | `/work/database-ansor-kaltim` | 301 | Dipertahankan walau lama tidak merespons |
| `/work/ismi` | `/work/ismi` | 301 | Slug dipertahankan |
| `/work/kartaspa` | `/work/kartaspa` | 301 | Slug dipertahankan |
| `/work/koetai-mahkota` | `/work/koetai-mahkota` | 301 | Slug dipertahankan |
| `/work/kuepandanasli` | `/work/kuepandanasli` | 301 | Slug dipertahankan |
| `/work/productschool` | `/work/sakolentra` | 301 | Ganti nama resmi; URL lama tidak boleh tampil |
| `/work/sdmuhammadiyah3` | `/work/sdmuhammadiyah3` | 301 | Studi kasus v1 |
| `/work/sdmuhammadiyah3new` | `/work/sdmuhammadiyah3` | 301 | Konsolidasi v1+v2 jadi satu studi kasus |

Anchor lama (`/#engineering`, `/#contact`) tidak butuh 301 — anchor tidak dikirim ke server. Pastikan section pengganti ada di Home baru (§7.6) atau arahkan ke `/about` dan `/contact`.

## 3. Yang harus diputuskan sebelum menulis `next.config.ts`

1. **Locale prefix (G-13).** Bila `next-intl` memakai `localePrefix: 'as-needed'` (EN tanpa prefiks), tabel §2 berlaku apa adanya. Bila `'always'`, setiap target jadi `/en/...` dan URL lama kehilangan kesetaraan — 301 harus menunjuk `/en/...` plus `hreflang`.
2. **Nasib portfolio lama.** Bila portfolio lama dipindah ke domain lain dan tetap hidup, 301 di `andypratama.studio` akan memindahkan trafik keluar dari sana. Konfirmasi apakah yang diinginkan 301 (permanen) atau 302 sementara sampai portfolio lama selesai dipindah.
3. **Konten yang tidak dibawa.** Bila salah satu studi kasus (mis. `koetai-mahkota`, `kuepandanasli`) tidak dibuat ulang, 301-nya harus menunjuk `/work` (index), bukan halaman yang tidak ada. Ini bergantung pada A-10 dan izin klien (§2).
4. **`/work/sdmuhammadiyah3` vs `/work/sakolentra`.** Keduanya menyangkut SD Muhammadiyah 3. Putuskan apakah jadi satu studi kasus atau dua (sistem sekolah vs sistem administrasi/keuangan).

## 4. Verifikasi setelah implementasi (F6-03)

- `curl -sI https://www.andypratama.studio/work/productschool` → `301` + `Location: .../work/sakolentra`
- Semua 14 URL lama → status `301`, tanpa rantai lebih dari satu hop.
- Tidak ada 301 ke `404`: jalankan crawler setelah build produksi, bandingkan dengan tabel §1.
- `sitemap.ts` baru hanya memuat URL baru; URL lama tidak muncul lagi.
