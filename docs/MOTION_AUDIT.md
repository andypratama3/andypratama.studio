# Audit gerak F1–F17 — 11 November 2026

Tabel di bawah adalah temuan **sebelum** perbaikan (fase 0, pohon pada komit `a4a0dbd` plus dokumen yang belum dikomit). Keadaan setelah perbaikan ada di `docs/MOTION.md`. Angka metrik di bagian bawah adalah baseline `docs/baseline/before/`.

Hipotesis di prompt dicek pada sumber dan, untuk referensi luar, pada browser. Tidak ada gerak yang diubah di fase ini. Perbaikan menyusul di fase 1–6.

Keparahan di kolom dampak adalah untuk fase perbaikan, bukan untuk rilis hari ini.

| ID | Terjadi? | Bukti | Dampak |
|---|---|---|---|
| F1 | Ya, ganda | `globals.css` 745–752: `main section:not(.fluid-hero)` dan `.view-rise` memakai `animation-timeline: view()`. `Reveal` menganimasikan anak di dalamnya (`reveal.tsx` 85–96). CSS `.reveal-block` / `html.js-reveal` (baris 342–376) tidak dipasang: `rg js-reveal` dan `rg reveal-block` di `*.tsx` kosong. Tanpa dukungan `animation-timeline`, blok `@supports` tidak menyembunyikan apa pun, jadi isinya tetap terlihat | Sedang |
| F2 | Ya, tiga jalur | `use-motion-ok.ts` 6–18 snapshot server `false`. `hero-visual.tsx` 25 memakai `useReducedMotion`. `wordmark-marquee.tsx` 25–33 dan `sakolentra-diagram.tsx` 10 memakai jalur lain. `PracticeCube` 35–45 menukar pohon (kisi datar saat snapshot `false`, kubus setelah klien membaca media query). `HeroEntrance` juga bercabang, tetapi tidak terpasang | Sedang |
| F3 | Ya | `reveal.tsx` 57–82: satu `IntersectionObserver` dan state `armed` per instance, diset di efek. `initial` tetap `false`, jadi cat pertama tidak mulai dari tersembunyi. Elemen di luar lipatan baru disembunyikan setelah efek | Sedang |
| F4 | Ya | Tiga `useScroll()` tanpa target: `floating-nav.tsx` 46, `chapter-rail.tsx` 22, `depth-gauge.tsx` 15, masing-masing dengan `useSpring`. Belum dihitung di DevTools proyek ini | Rendah |
| F5 | Ya, dari kode | `studio-intro.tsx` 13–23: `visible` mulai `false`, diset `true` di efek, lalu `setTimeout(1100)`. Tidak ada `AnimatePresence`. Overlay tidak punya `role` atau `aria-modal`. Lint saat ini gagal di baris 22 (`react-hooks/set-state-in-effect`) | Sedang |
| F6 | Sebagian | Neon hidup di home: `page.tsx` 124–132 dan `globals.css` 552–571 menganimasikan `color`, stroke, dan `text-shadow` 1.8s tanpa jeda. `hero-grid-drift` 48s ada (`globals.css` 517–518) tetapi kelasnya hanya di `hero-visual.tsx`, dan komponen itu tidak terpasang di rute. Jadi drift tidak berjalan di home | Sedang untuk neon |
| F7 | Ya, dari kode | `practice-cube.tsx` 58–74: enam `Link` tanpa `tabIndex` / `inert`. CSS `backface-visibility: hidden` di `globals.css` 641. Uji tab keyboard belum dijalankan | Sedang |
| F8 | Ya, belum ditukar | `motion-provider.tsx` 12 memuat `domMax` global. `layoutId` hanya di `floating-nav.tsx` 149 (`site-nav-pill`) dan `local-nav.tsx` 94 (`local-nav-line`). Rollup paket: `dom-animation` 86787 byte, `dom-max` 137541 byte, selisih 50754 byte belum terminyak. Bukan selisih gzip aplikasi | Sedang |
| F9 | Ya | `rg` tidak menemukan impor `HeroEntrance` atau `HeroBeat`. Hero memakai kelas `hero-beat`. Tidak dihapus | Rendah |
| F10 | Ya | Token TS dan `--dur-fast/base/slow` serta `--ease-out` cocok (180/240/550 dan kurva yang sama). `text`, `media`, `hero`, `easeInOut` tidak punya pasangan CSS. Angka mentah tetap di CSS (220, 280, 320, 720, 1100, 36s, 48s) dan di `studio-intro.tsx` 23 (`1100`) serta `hero-entrance.tsx` 25 (`0.72`) | Rendah |
| F11 | Ya | `magnetic.tsx` 29–35 memanggil `matchMedia` dan `getBoundingClientRect` di setiap `pointermove` | Rendah |
| F12 | Sebagian | `will-change-transform` permanen ada di `scroll-media.tsx` 37 pada `ScrollMedia`, yang tidak dipakai rute mana pun. Marquee dev memakai kelas itu hanya saat tidak dijeda (`wordmark-marquee.tsx` 59) | Rendah |
| F13 | Ya | Tidak ada `data-motion`. Jeda marquee hanya ada di `WordmarkMarquee`, dan komponen itu hanya dipasang di `dev/components`. Pita publik `fluid-marquee-track` (`page.tsx` 201, `globals.css` 574–575, 36s) tidak punya kontrol. Reduced-motion mematikan animasinya (`globals.css` 872–875) | Rendah, celah WCAG pada pita publik |
| F14 | Ya, dari kode | `PageTransition` membungkus isi halaman, bukan header/footer. `rg view-transition-name` di `src` kosong. Reduced-motion mengosongkan durasi view transition (`globals.css` 889–894). Belum direkam di browser proyek | Sedang |
| F15 | Ya | `<img>` di `page.tsx` 181 dan `hero-visual.tsx` 92. `next/image` hanya di `brand-toggle.tsx` dan `highlights-tabs.tsx`. Ukuran berkas: hero poster 106382, path 186209–294909, intro poster 269837 byte. Lint memperingatkan `no-img-element` di `page.tsx` 181 | Sedang |
| F16 | Tidak seperti dugaan arsip | `playwright.config.ts`, `vitest.config.ts`, dan `tests/` sudah ada. Yang belum ada adalah `tests/motion/`. Config diperlebar agar `wiring/**/*.spec.ts` dan `motion/**/*.spec.ts` ikut terkumpul. Tidak ada dependensi baru | Rendah |
| F17 | Ya, di luar lingkup | `wiring.ts` 70–73: Unicorn `partial`, SDK tidak dimuat. `HeroScene` tidak terpasang. Tidak ditambah | — |

## Temuan tambahan

| ID | Terjadi? | Bukti | Dampak |
|---|---|---|---|
| F18 | Ya | `HeroScene`, `HeroVisual`, `ScrollMedia`, `MediaFrame` tidak punya pemakai rute. `nav-enter`, `reveal-enter`, `reveal-block`, `hero-parallax` tidak dipakai JSX. Tidak dihapus | Rendah |
| F19 | Ya | `rg "@media (hover"` di `src` kosong. Hover `.path-card`, `.cta-lift`, `.soft-card` berlaku tanpa `(hover: hover)` | Sedang untuk sentuh |
| F20 | Ya | Pita `fluid-marquee-track` beranimasi lebih dari 5 detik tanpa kontrol di halaman publik. Lihat F13 | Sedang |
| F21 | Ya | `motionTokens.enterY` 40, `view-rise` 36px, `hero-beat` 40px. Di atas panduan 8–28 px. Bukan kerusakan, hanya jarak yang akan diseragamkan | Rendah |
| F22 | Tidak berlebih | Dashboard tidak mengimpor `motion`. Yang ada hanya `transition-colors` / `transition-all` pada tombol dan batang. Tidak diubah | Catatan |

## Baseline yang sudah diukur

Perintah: `PLAYWRIGHT_BASE_URL=http://127.0.0.1:3100 PLAYWRIGHT_WEB_SERVER="pnpm exec next start -p 3100" pnpm exec playwright test tests/motion`. 20 lulus. Port 3100 supaya tidak menabrak `next dev` di 3000. Tanpa throttle CPU.

| Rute | CLS | LCP (ms, observer) | Tugas panjang | Animasi saat load | Animasi setelah 12× wheel |
|---|---|---|---|---|---|
| `/` | 0 | 224 | 0 | 28 | 59 |
| `/start` | 0 | 204 | 0 | 3 | 3 |
| `/products/dualbrand` | 0 | 212 | 0 | 4 | 4 |

`performance.getEntriesByType("largest-contentful-paint")` tetap 0 karena entri itu tidak masuk buffer tanpa observer. Angka yang dibandingkan nanti adalah `lcp` dari observer. Home naik dari 28 ke 59 animasi saat scroll: itu jejak `animation-timeline: view()` pada section yang masuk layar.

JS awal dari `pnpm build`, berkas `.next/diagnostics/route-bundle-stats.json`: home `/[locale]` 958913 byte mentah, 310417 byte gzip. Rincian di `docs/baseline/before/js-first-load.json`.

`/contact` mengikuti redirect ke `/start` (`docs/baseline/before/_contact.json` field `url`).

## Yang belum dijalankan pada situs ini

Uji keyboard kubus dan rekaman kedip hidrasi belum dilakukan. Itu milik fase 2 dan 3. Graph kode tidak dipakai sebagai bukti karena indeksnya `2026-11-10`, sebelum komit baseline.
