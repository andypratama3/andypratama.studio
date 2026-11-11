# Referensi gerak — FLUID STUDIO

URL dibuka 11 November 2026 di browser Cursor (Chrome) pada 1440×900 dan 390×844. Ini catatan ritme, bukan salinan. Teks, merek, warna, dan gambar halaman itu tidak dipakai di proyek ini.

## Yang terukur di runtime

| Pemeriksaan | Hasil |
|---|---|
| `window.gsap` | `undefined` |
| `window.ScrollTrigger` | `undefined` |
| `window.gsapVersions` | `["3.15.0"]` |
| `window.lenis` | objek `{ version: "1.3.25" }` saja, tanpa `scrollTo` atau `raf` |
| `window.lenisVersion` | `"1.3.25"` |
| `scroll-behavior` pada `documentElement` | `auto` |
| `scrollY` saat kubus terlihat | `1461.5` (pecahan), lalu bergeser ke `3562` setelah `scrollBy(0, 1200)` dari `2362` |
| `animation-timeline` / `view-transition-name` | tidak ada pada elemen yang dihitung |
| Bundel `assets/index-*.js` (464583 byte) | `ScrollTrigger` 5, `gsap.registerPlugin` 3, `lenis` 26, `Lenis` 1, `SplitText` 0, `animation-timeline` 0, `view-transition` 0, `prefers-reduced-motion` 2 |
| CSS | 7 aturan `prefers-reduced-motion`, 4 aturan yang menyebut `hover` |
| `document.getAnimations().length` setelah hero siap | 8–10 |

GSAP dan Lenis ada di bundel dan meninggalkan cap versi di `window`, tetapi konstruktor globalnya tidak dipasang. Scroll halaman panjang (`scrollHeight` 14146 pada viewport 900) dan posisi scroll sempat pecahan, jadi penghalusan scroll hidup, bukan `scroll-behavior: smooth` CSS.

## Pola

### Muat

Layar pertama yang tertangkap adalah overlay penuh dengan monogram di tengah, latar gelap. Saat snapshot aksesibilitas diambil, pohon halaman di bawahnya sudah ada (ada tautan lewati dan heading). Durasi overlay tidak terukur: sampel CDP pertama sudah melewatinya. CSS punya keyframe `loader-letter-in` dan `loader-icon-spin`, tetapi elemen loader sudah tidak ada saat diukur.

Setelah overlay hilang, hero menampilkan satu kata solid dan satu kata garis (stroke terukur 1.5px, isi transparan) di atas bidang lembut. Di bawahnya ada deretan gambar. Lima `IMG` sedang dianimasikan 600 ms, easing `cubic-bezier(0.16, 1, 0.3, 1)`, satu kali, timeline dokumen (bukan CSS `animation-name`).

### Scroll

Halaman dibagi zona (`zone-z0` sampai `zone-z4`). Tiap zona mengganti token permukaan. Transisi antar zona memakai kelas gradien, bukan `animation-timeline`.

Kubus: section sticky, elemen `.cube` ber-`matrix3d` yang berubah antara `scrollY` 1462 dan 3562. Enam wajah punya `translateZ` sekitar 285px. Pemicunya scroll. Mesin yang cocok dengan bukti bundel adalah GSAP ScrollTrigger, bukan CSS scroll-timeline. Jarak rotasinya tidak disederhanakan menjadi satu sudut karena matriksnya sudah campuran sumbu.

Marquee kata berjalan 26000 ms, linear, tak terbatas (`word-marquee-run`). Stylesheet menulis `animation-duration: auto` pada track itu, jadi lamanya diisi dari JS. Marquee lain di CSS: 30s dan 36s, linear, tak terbatas. Kedipan status: 1100 ms, `steps(1)`, tak terbatas.

Jumlah animasi aktif tetap sekitar 10 saat di-scroll. Tidak ada lonjakan.

### Hover dan klik

Transisi CSS yang terukur: garis burger 0.24s `cubic-bezier(0.4, 0, 0.2, 1)` pada `transform`; keadaan menu terbuka 0.42s dengan easing variabel `--ease-inout`. Ada kursor hias (`.cursor-dot`) dengan transisi 0.03s / 0.3s. Itu tidak diambil.

Di 390px, dock tetap di bawah. Klik tombol menu mengubah nama aksesibel menjadi "Close menu" (`expanded`). Shell navigasi mendapat `is-open` dan `transform: matrix(1, 0, 0, 1, -195, 0)`. Panel geser dengan transform, bukan perpindahan rute.

Di 390px hero tetap satu kolom: kata besar, kalimat, lalu strip gambar yang terpotong di tepi bawah. Dock tidak berubah menjadi bilah atas.

## Pemetaan ke proyek ini

| Pola referensi | Di proyek ini | Keputusan untuk fase berikutnya |
|---|---|---|
| Overlay monogram singkat saat muat | `StudioIntro`, tetapi baru muncul setelah efek | Perbaiki urutan (F5). Jangan meniru huruf atau warna mereka |
| Kata solid + kata garis | `fluid-word` + `fluid-neon-letter` | Pertahankan bentuk. Pindahkan cat neon ke compositor (F6) |
| Gambar masuk ~600 ms, ease-out tajam | `Reveal` 0.9–1.05 s dan `hero-beat` 720 ms | Dekatkan ke satu skala token, jangan menyalin kurva mereka mentah |
| Kubus yang ikut scroll, section sticky | `PracticeCube` | Rapikan fokus wajah (F7). Mesin tetap Motion |
| Marquee linear puluhan detik | `fluid-marquee-track` 36s di home, tanpa jeda | Jeda global (F13). Jangan menambah GSAP untuk ini |
| Zona warna per bab | Belum sebagai sistem zona | Tidak diambil. Proyek ini memakai `data-nav-theme` terang/gelap |
| Scroll halus Lenis | Tidak terpasang | Tidak diambil di fase ini. `animation-timeline: view()` dan `useScroll` sudah dipakai |
| GSAP ScrollTrigger | Tidak terpasang | Tidak diambil. Kubus dan jembatan scroll sudah jalan dengan Motion |
| Kursor kustom | Tidak ada | Tidak diambil. Mengganggu sentuh dan kursor asli |
| View Transition | Tidak ada di referensi | Milik proyek ini. Jangan dibuang hanya karena referensi tidak memakainya |
