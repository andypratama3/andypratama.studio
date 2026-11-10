# REFERENCES — Sumber referensi Owner untuk UI landing

Dokumen ini adalah **daftar referensi yang Anda berikan**. Bukan pilihan agen.
Adaptasi = pola layout/struktur/tokens. Bukan salinan kit berbayar utuh.

---

## 0. Daftar sumber (Owner)

### A. Curation desain (marcelodesignxh)

| # | Sumber | Peran di proyek |
|---|---|---|
| 1 | [horizonx.so](https://horizonx.so) | Premium UI kits + arah komposisi hero / display type |
| 2 | [mobbin.com](https://mobbin.com) | Real app/site screens — proof, path, form |
| 3 | [ui8.net](https://ui8.net) | UI kits — preview produk, chrome browser |
| 4 | [refero.design](https://refero.design) | FAQ, tabel, empty state, media |
| 5 | [godly.website](https://godly.website) → [recent.design](https://recent.design) | Anti 3-kartu, brand-first, CTA penutup |

### B. Sistem desain & motion

| Sumber | Peran |
|---|---|
| [Realtime Colors](https://www.realtimecolors.com/?colors=050315-fbfbfe-2f27ce-dedcff-433bff&fonts=Inter-Inter) | Palet + Inter |
| [Unicorn Studio](https://www.unicorn.studio/) (+ [docs](https://www.unicorn.studio/docs/getting-started/)) | Hero WebGL; fallback SVG grid/wave |
| [Jiro](https://jiro.build/) | Section prompts (MCP belum terhubung) |
| **Video `detail-v2.mp4`** (Norvane) | Pola dianalisis 9 Nov 2026 — **tidak ada aset disalin** |
| **Video `velto-hero.mp4`** (Velto) | Pola dianalisis 9 Nov 2026 — nav pil, StickySteps; **tolak** avatar/happy-customers/pastel/3D stok |
| **Apple MacBook Pro display page** | Pola struktur saja (local nav, stats+footnote, ritme). **Dilarang** salin teks/gambar/istilah merek |

---

## 1. Status penerapan

| Layer | Status | Bukti / blocker |
|---|---|---|
| Realtime Colors + Inter | Diterapkan | `globals.css` |
| Layout system §3 | Diterapkan | Container 1200 / Wide 1440, Section, typography |
| FloatingNav (Velto) | Diterapkan | `floating-nav.tsx` + Header |
| StatsGrid + FootnoteList | Diterapkan | proof + footer Catatan |
| StickySteps | Diterapkan | section stack Home |
| LocalNav + DualBrand | Diterapkan | `/products/dualbrand` (BrandToggle menunggu aset) |
| Unicorn WebGL | Slot + fallback | Butuh A-08 |
| Higgsfield hero/intro media | Poster wired | MCP auth OK; generate gagal: out of credits / plan. File: `public/media/*-poster.jpg`. Video slot siap di `HeroVisual` |
| Jiro MCP | Belum | `mcp.jiro.build` |
| Lenis / GSAP | Belum | Default A.7: motion+CSS dulu |
| StickySteps ritme | Diperkuat 9 Nov | min-height sticky ≥640; stack biasa di mobile |
| PublicPageShell | Diperkuat 9 Nov | `navTheme="light"` agar FloatingNav konsisten |

---

## 2. Mapping section Home → referensi → lisensi

| # | Section | Referensi | Lisensi adaptasi | Catatan |
|---|---|---|---|---|
| 1 | Header | Velto + Norvane + Apple local | Internal rewrite | FloatingNav kapsul adaptif |
| 2 | Hero | Norvane + unicorn + Apple ritme | Internal | wordmark + text-hero 700/0.95 |
| 3 | Bukti | Apple stats + mobbin | Internal | StatsGrid + ¹ ² ³ → FootnoteList |
| 4 | Video | Norvane media + refero | Internal | |
| 5 | Yang saya kerjakan | godly lists | Internal | Row (bukan kartu) |
| 6 | SAKOLENTRA | Norvane bento | Internal | |
| 7 | Proyek lain | refero | Internal | |
| 8 | DualBrand | ui8 + Apple toggle | Internal | BrandToggle siap; 1 preview sampai aset ada |
| 9 | Stack | Velto steps + mobbin | Internal | StickySteps CSS |
| 10 | Jurnal | refero empty | Internal | |
| 11 | Bukti sosial | Norvane | Internal | Hidden bila kosong |
| 12 | FAQ | refero | Internal | |
| 13 | Newsletter | mobbin | Internal | |
| 14 | CTA akhir | godly + surface-contrast | Internal | |
| 15 | Footer | internal + Apple notes | Internal | FootnoteList di atas kolom |

---

## 3. Gate

| ID | Butuh Owner | Untuk |
|---|---|---|
| A-08 | Unicorn Project ID + frame | WebGL hero |
| X-Jiro | MCP Jiro | Prompt section |
| RTC-dark | Nilai dark RTC | Verifikasi |
| DualBrand shots | 3 tangkapan nyata | BrandToggle Holding/A/B |
| Font mono | Persetujuan | Default Inter uppercase |
