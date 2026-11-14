# LAYOUT-AUDIT — Home (revisi v2, 9 Nov 2026)

> **Update 14 November 2026 (J7).** Sumber status tunggal: `docs/STATUS.md`.
> Butir 4: video intro **tidak ada**; yang tersisa hanya poster statis di seksi `#proof`
> (`src/app/[locale]/(site)/page.tsx`). Angka tes di bawah adalah arsip 9 Nov 2026.
> Catatan J7: `<header>` kini `relative z-[var(--z-nav)]` (nav pill sempat tidak bisa diklik
> karena stacking context `view-transition-name`); overflow 320px pada `/about`, `/media-kit`,
> `/id/products/dualbrand` sudah diperbaiki; sweep 36 route × 7 viewport (320–1440) → 0 overflow.

Viewport acuan: 375 / 768 / 1280 / 1440. Sumber: Norvane + Velto + Apple (pola saja).
Audit ulang setelah pass FloatingNav / StatsGrid / StickySteps.

## Status vs target v2

| # | Target | Status | Sisa gap |
|---|---|---|---|
| 1 | FloatingNav kapsul adaptif | **Ada** | Wordmark kapsul panjang di mobile; pantau overflow |
| 2 | Hero 100svh + wordmark + path | **Ada** | Unicorn A-08 masih fallback SVG/poster |
| 3 | StatsGrid + ¹→FootnoteList | **Ada** | — |
| 4 | Video intro + poster | **Poster saja** | Video file belum (poster only); `IntroVideo` tidak dirender |
| 5 | Row tipografis 01–03 | **Ada** | — |
| 6 | SAKOLENTRA bento + SVG | **Ada** | Crash `nodes` undefined diperbaiki 9 Nov |
| 7 | HairlineTable proyek | **Ada** | — |
| 8 | DualBrand split + LocalNav | **Ada** | BrandToggle / ScrollSequence menunggu 3 shot nyata |
| 9 | StickySteps 4 panel | **Ada** | Ritme sticky diperkuat (min-height) |
| 10 | Jurnal empty bermerek | **Ada** | ArrowButton per entri saat data ada |
| 11 | Bukti sosial | **Hidden** | Benar: tidak dirender tanpa testimoni |
| 12 | FAQ 4+8 | **Ada** | Accordion shadcn masih G1 (details OK) |
| 13 | Newsletter 1 baris | **Ada** | — |
| 14 | CTA akhir invert | **Ada** | — |
| 15 | Footer + Catatan | **Ada** | — |

## Masalah layout yang masih terbuka

1. **Hero media**: menunggu Unicorn A-08 / Higgsfield credits — poster interim OK.
2. **DualBrand shots**: tanpa 3 tangkapan, BrandToggle menampilkan 1 preview editorial.
3. **StickySteps di 375**: harus tumpukan biasa (CSS sudah); verifikasi visual wajib.
4. **Lighthouse / Playwright / LHCI**: belum dijalankan ulang di pass ini — lihat laporan §7.
5. **Lampiran C (plugin gaps)**: di luar scope layout; ditunda kecuali G1 jika FAQ diganti accordion.

## Default Owner (§9) yang dipakai

- FloatingNav: semua halaman publik (bukan dashboard)
- Footnote: status dinyatakan/terverifikasi tampil
- BrandToggle: satu gambar sampai aset lengkap
- Tanpa GSAP/Lenis (A.7)
- Copy `src/messages/` **tidak** diubah di pass layout ini (kecuali sudah berubah di sesi copy sebelumnya)

## Verifikasi cepat audit

```bash
pnpm typecheck && pnpm lint
```
