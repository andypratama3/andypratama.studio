# Gerak — andypratama.studio

Satu sumber waktu: `src/lib/motion.ts`. Pasangan CSS ada di `:root` pada `src/app/globals.css` dan dijaga `tests/motion/tokens.test.ts`.

## Aturan

- Satu mesin per elemen. Bagian yang berisi `Reveal` tidak ikut `animation-timeline: view()` karena `Reveal` memasang `data-reveal`. Hero memakai kelas `hero-beat`, bukan Motion.
- Gerak berulang hanya `transform` dan `opacity`.
- Hover yang menggeser hanya di dalam `@media (hover: hover) and (pointer: fine)`.
- Tekan memakai `--dur-press` (80ms).
- `prefers-reduced-motion: reduce` menampilkan isi penuh dan mematikan animasi non-esensial. `useMotionOk` snapshot server tetap `false`, jadi cat pertama tidak mulai tersembunyi.
- Jeda global: `html[data-motion="paused"]`. Tombol publik `MarqueePause` hanya ada saat gerak diizinkan, supaya dump reduced-motion tidak mendapat string baru. Tab tersembunyi memakai `data-tab-hidden`. Dekor di luar layar memakai `data-offscreen` pada `[data-decor]`.
- `will-change` hanya saat elemen dekat viewport.
- Header dan footer punya `view-transition-name`. Durasi root memakai `--dur-base`. Reduced-motion mengosongkan transisi itu.

## Token

| Token | Nilai | Pemakaian |
|---|---|---|
| `--dur-press` | 80ms | `:active` |
| `--dur-fast` | 180ms | hover, keluar intro |
| `--dur-base` | 240ms | UI, view transition |
| `--dur-slow` / `--dur-text` | 550ms | masuk bagian |
| `--dur-media` | 700ms | media |
| `--dur-hero` | 720ms | `hero-beat` |
| `--dur-intro` | 1100ms | tahan intro |
| `--dur-neon` | 1.8s | kedip opacity |
| `--dur-marquee` | 36s | pita |
| `--dur-drift` | 48s | grid |
| `--rise` | 16px | jarak masuk |
| stagger | 60ms | urutan, total sekitar 600ms |

Spring: `stiff` 140/28/0.3 untuk progres gulir bersama, `soft` 80/24/0.4 untuk kubus dan parallax, `quick` 220/18/0.35 untuk magnet.

## Menambah gerak

1. Pakai token. Jangan menulis milidetik baru di komponen.
2. Pilih satu mesin: CSS `view()` untuk bagian tanpa urutan, atau `Reveal` untuk urutan dan mask. Jangan keduanya pada elemen yang sama.
3. Tandai loop dekoratif dengan `data-decor` supaya jeda offscreen dan tab berlaku.
4. Jangan menganimasikan `top`, `left`, `width`, atau `height` pada elemen yang berulang.
5. Jalankan `pnpm test` (kontrak token) dan dump teks reduced-motion. Diff `docs/baseline/before` lawan `docs/baseline/after` harus kosong untuk berkas teks.

## Komponen

| Berkas | Peran |
|---|---|
| `src/lib/motion.ts` | Token, spring, `motionCss` |
| `src/components/brand/use-motion-ok.ts` | Satu pembaca `prefers-reduced-motion` |
| `src/components/providers/motion-provider.tsx` | `LazyMotion` `domAnimation`, jeda offscreen dan tab |
| `src/components/brand/scroll-progress.tsx` | Satu `useScroll` + satu spring untuk nav, rel bab, dan depth |
| `src/components/brand/reveal.tsx` | Satu `IntersectionObserver` bersama, `data-reveal` |
| `src/components/brand/marquee-pause.tsx` | Tombol jeda global |
| `src/components/brand/studio-intro.tsx` | `<template>` + skrip. Tidak berjalan saat reduced-motion atau `sessionStorage` `studio-intro-seen` |
| `src/components/brand/practice-cube.tsx` | Pohon yang sama. `inert` pada muka bukan depan saat 3D. Reduced-motion meratakan lewat CSS |
| `src/components/brand/magnetic.tsx` | Rect di-cache di `pointerenter`, `pointer: fine` sekali |
| `src/components/brand/floating-nav.tsx` | Progres dari provider. Tanpa `layoutId` |
| `src/components/brand/local-nav.tsx` | Indikator aktif tanpa `layoutId` |
| `src/components/brand/chapter-rail.tsx` | Skala dari provider |
| `src/components/brand/depth-gauge.tsx` | Posisi dari provider |
| `src/components/brand/scroll-media.tsx` | `ScrollDepth` di home. `ScrollMedia` tidak terpasang di rute |
| `src/components/brand/page-transition.tsx` | `ViewTransition` isi halaman |

`useScroll` bertarget tetap di `practice-cube`, `scroll-bridge`, dan `scroll-media`. Itu bukan pendengar progres dokumen kedua.

## Tidak dihapus

`HeroEntrance`, `HeroBeat`, `HeroScene`, `HeroVisual`, `ScrollMedia`, `MediaFrame`, kelas `.reveal-block`, `.reveal-enter`, `.js-reveal`, `.hero-parallax`, `.hero-fade`. Tidak ada impor rute untuk komponen itu. `WordmarkMarquee` hanya di `/dev/components`.

## Intro

Intro dipasang oleh `StudioIntroBoot` setelah mount, tanpa tag `script`. Dialog tetap `display: none` sampai `data-studio-intro="on"`. Reduced-motion, tanpa JS, atau kunjungan kedua (`studio-intro-seen`) tidak memasang atribut itu, jadi halaman tidak tertutup. Huruf tetap `A ◇ P`. Tombol lewati memakai string `home.hero.skipIntro` yang sudah ada. Navigasi dari halaman lain tidak mengulang intro.

## Kubus

Panah keyboard tidak memutar kubus. Muka belakang `inert`, jadi tidak bisa menerima fokus, dan memutar spring gulir dari tombol akan bentrok dengan scroll. Reduced-motion meratakan keenam muka menjadi kisi dan melepas `inert`.
