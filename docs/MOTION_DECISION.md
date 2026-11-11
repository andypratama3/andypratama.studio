# Keputusan GSAP, Lenis, dan fitur Motion

Tanggal: 11 November 2026. Tidak ada dependensi baru.

## GSAP

Tidak dipasang. Referensi Kimi memakai GSAP 3.15.0 dan ScrollTrigger untuk kubus yang di-pin. Proyek ini sudah memutar `PracticeCube` dengan `useScroll` + `useSpring` dan memasukkan bagian dengan CSS `view()`. `src/lib/wiring.ts` sudah menandai GSAP `skipped` dengan alasan ukuran. Lisensi GSAP tidak dicek di situs resmi pada sesi ini karena paketnya tidak ditambahkan. Default tetap menolak.

## Lenis

Tidak dipasang. Kimi memuat Lenis 1.3.25. Smooth-scroll pihak ketiga akan bentrok dengan `animation-timeline`, `IntersectionObserver`, `useScroll`, fokus jangkar, dan `scroll-padding-top` yang sudah ada (`--scroll-anchor: 6.5rem`). `wiring.ts` menandai Lenis `Deferred (Owner A.7)`. Tidak ada persetujuan untuk mengubah `package.json`.

## domAnimation, bukan domMax

`layoutId` pada pil nav (`site-nav-pill`) dan garis nav lokal (`local-nav-line`) dihapus. Indikator aktif sekarang `span` biasa. `MotionProvider` memakai `domAnimation`.

Ukuran rollup paket `motion@14.11.1` (bukan gzip aplikasi):

| Berkas | Byte |
|---|---|
| `size-rollup-m-dom-animation.js` | 86787 |
| `size-rollup-m-dom-max.js` | 137541 |
| selisih | 50754 |

First-load JS aplikasi, dijumlah dari `.next/diagnostics/route-bundle-stats.json` lalu `gzipSync` berkas chunk yang sama. Sebelum: `docs/baseline/before/js-first-load.json`. Sesudah: build 11 November 2026 setelah `domMax` keluar dari graf global.

| Rute | Sebelum uncompressed / gzip | Sesudah uncompressed / gzip |
|---|---|---|
| `/[locale]` | 958913 / 310417 | 950151 / 308448 |
| `/[locale]/start` | 1129971 / 362151 | 1106425 / 354777 |
| `/[locale]/products/dualbrand` | 940398 / 303698 | 916646 / 296236 |
| `/[locale]/work` | 921811 / 296682 | 898265 / 289308 |

Selisih gzip home 1969 byte. Jauh di bawah 50KB rollup, karena `domMax` tidak pernah menjadi berkas terpisah di bundle aplikasi. Arahnya turun di keempat rute.
