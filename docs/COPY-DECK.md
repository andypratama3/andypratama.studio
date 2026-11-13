# Copy Deck — andypratama.studio

Seluruh teks yang tampil di situs publik, berpasangan Inggris (`en`) dan Indonesia (`id`).
Dokumen ini dihasilkan dari `src/messages/en.json`, `src/messages/id.json`, dan `src/content/`,
jadi setiap kunci di sini benar-benar dipakai (kecuali yang ditandai).

## Cara memakai dokumen ini

Tempel bagian **Aturan** dan bagian teks yang ingin direvisi ke Claude, lalu minta hasil dalam format tabel yang sama.
Contoh prompt:

```text
Revisi copy situs andypratama.studio di bawah ini. Aturan:
1. Jangan mengubah angka, nama sekolah, nama produk, atau klaim faktual apa pun.
2. Pertahankan bahasa Inggris yang tenang dan langsung; bahasa Indonesia yang formal (“Anda”), bukan gaul.
3. Jangan menambah testimoni, logo klien, harga, atau janji hasil.
4. Kembalikan tabel dengan kolom: kunci | EN baru | ID baru | alasan singkat (maks 12 kata).
5. Tandai baris yang tidak perlu diubah dengan “tetap”.

[tempel bagian teks di sini]
```

## Aturan yang tidak boleh dilanggar

- Fakta hanya dari `src/content/facts.ts` (lihat tabel Fakta di bawah). Jangan mengarang angka.
- Tanpa testimoni, logo klien, jumlah pengikut, atau harga publik.
- Satu sapaan: “Anda” (id) dan “you” (en). Jangan campur “kamu”.
- Nama produk dan entitas tetap: DualBrand, SAKOLENTRA, SD Muhammadiyah 3 Samarinda, Midtrans, Laravel, Gumroad, Lynk.id.
- Placeholder `{fact:…}` dan `{setting:…}` harus tetap utuh.
- Tanda pisah: pilih satu gaya. Saat ini 22 kunci memakai “ — ” (spasi) dan 10 kunci memakai “—tanpa spasi”.

## Peta halaman

| Rute | Bagian di dokumen |
|---|---|
| Semua halaman | Global |
| Semua halaman | Navigasi, tema, bahasa, footer |
| / dan /id | Home |
| /products, /products/dualbrand | Products |
| /services | Services |
| /work, /work/sakolentra | Work |
| /about | About |
| /media-kit | Media kit |
| /cv | CV |
| /journal | Journal |
| /links | Links |
| /faq | FAQ |
| /contact, /start | Kontak & intake |
| Form di home + /newsletter/status | Newsletter |
| /license, /privacy, /terms | Legal |
| Halaman tidak ditemukan | 404 |
| Semua rute | Isi FAQ (`src/content/faq.ts`) |

## 1. Global

Rute: Semua halaman

Sumber: `src/messages/*.json` → metadata + `PublicPageShell` + halaman stub

Catatan: `siteDescription` adalah meta description global. `stubNote`/`stubCta` hanya tampil di halaman yang belum berisi.

### `common`

| Kunci | EN | ID |
|---|---|---|
| `brand` | Andy Pratama Studio | Andy Pratama Studio |
| `siteDescription` | Andy Pratama Studio — day-to-day operations software from Samarinda, Indonesia. | Andy Pratama Studio — perangkat lunak operasional harian dari Samarinda, Indonesia. |
| `comingSoon` | Coming soon | Segera hadir |
| `stubStatus` | In progress | Sedang disiapkan |
| `stubNote` | This page is being prepared. Content will appear here when it is ready. | Halaman ini masih disusun. Isinya akan muncul di sini setelah siap. |
| `stubCta` | Tell me what you need instead | Ceritakan kebutuhan Anda saja |
| `scrollHint` | Scroll down | Geser ke bawah |
| `pause` | Pause | Jeda |
| `play` | Play | Putar |
| `marqueePause` | Pause wordmark marquee | Jeda tulisan berjalan |
| `marqueePlay` | Play wordmark marquee | Putar tulisan berjalan |

## 2. Navigasi, tema, bahasa, footer

Rute: Semua halaman

Sumber: `src/components/brand/floating-nav.tsx`, `src/components/site/theme-switcher.tsx`, `src/components/site/lang-switcher.tsx`, `src/components/site/site-footer.tsx`

Catatan: `nav.brand` tampil di kiri navbar dan footer. Label ini juga dipakai untuk judul halaman di metadata.

### `nav`

| Kunci | EN | ID |
|---|---|---|
| `brand` | Andy Pratama Studio | Andy Pratama Studio |
| `menu` | Menu | Menu |
| `closeMenu` | Close menu | Tutup menu |
| `work` | Work | Karya |
| `products` | Products | Produk |
| `services` | Services | Jasa |
| `journal` | Journal | Jurnal |
| `about` | About | Tentang |
| `start` | Start here | Mulai di sini |

### `theme`

| Kunci | EN | ID |
|---|---|---|
| `toggle` | Toggle theme | Ganti tema |
| `system` | System | Sistem |
| `light` | Light | Terang |
| `dark` | Dark | Gelap |

### `lang`

| Kunci | EN | ID |
|---|---|---|
| `toggle` | Switch language | Ganti bahasa |
| `en` | English | English |
| `id` | Bahasa Indonesia | Bahasa Indonesia |
| `current` | EN | ID |

### `footer`

| Kunci | EN | ID |
|---|---|---|
| `rights` | All rights reserved. | Hak cipta dilindungi. |
| `location` | Samarinda, Indonesia | Samarinda, Indonesia |
| `navLabel` | Explore | Jelajah |
| `socialLabel` | Social | Sosial |
| `legalLabel` | Legal | Legal |
| `privacy` | Privacy | Privasi |
| `terms` | Terms | Syarat & Ketentuan |
| `license` | License | Lisensi |
| `github` | GitHub | GitHub |
| `twitter` | X | X |
| `linkedin` | LinkedIn | LinkedIn |
| `youtube` | YouTube | YouTube |
| `notesTitle` | About these numbers | Catatan angka |
| `statusStated` | Stated here, not rechecked | Dinyatakan di sini, belum dicek ulang |
| `statusVerified` | Checked | Sudah dicek |

## 3. Home

Rute: / dan /id

Sumber: `src/app/[locale]/(site)/page.tsx` + komponen `src/components/brand/*`

Catatan: Urutan bagian di halaman: hero → proof → video → how I can help → SAKOLENTRA → other projects → DualBrand → cara kerja → journal → partner → FAQ → newsletter → final CTA.

### `home.hero`

| Kunci | EN | ID |
|---|---|---|
| `title` | Clearer day-to-day operations—without you needing the tech talk. | Operasional yang lebih rapi—tanpa Anda harus paham teknisnya. |
| `description` | I help schools, agencies, and companies tidy billing, payments, notifications, and how teams work each day. This studio is open to see. | Saya membantu sekolah, instansi, dan perusahaan merapikan tagihan, pembayaran, pemberitahuan, dan kerja harian tim. Studio ini terbuka untuk dilihat. |
| `primaryCta` | See the work | Lihat hasil kerja |
| `secondaryCta` | Tell me what you need | Ceritakan kebutuhan Anda |
| `pathBuild` | I need something built | Saya butuh dibuatkan |
| `pathTemplate` | I need a ready-made template | Saya butuh template siap pakai |
| `pathHiring` | I'm hiring | Saya ingin merekrut |
| `mark` | A·P | A·P |
| `discipline` | Day-to-day operations | Operasional harian |
| `cubeCaption` | Scroll to turn — six sides of the practice | Gulir untuk memutar — enam sisi praktik |
| `surface` | Surface | Permukaan |
| `depth` | Depth | Kedalaman |
| `skipIntro` | Skip intro | Lewati pembuka |
| `stripLabel` | Ways in | Jalan masuk |

### `home.proof`

| Kunci | EN | ID |
|---|---|---|
| `yearsLabel` | years helping day-to-day operations | tahun membantu operasional yang dipakai setiap hari |
| `studentsLabel` | students served at SD Muhammadiyah 3 Samarinda | siswa terlayani di SD Muhammadiyah 3 Samarinda |
| `modulesLabel` | active features in SAKOLENTRA | fitur aktif di SAKOLENTRA |

### `home.introVideo`

| Kunci | EN | ID |
|---|---|---|
| `title` | A quick hello, 45 seconds | Kenalan singkat, 45 detik |
| `summary` | I help real operations—from schools to businesses—from Samarinda, Indonesia. | Saya membantu operasional nyata—dari sekolah sampai bisnis—dari Samarinda, Indonesia. |
| `placeholder` | Video coming soon | Video segera hadir |

### `home.whatIDo`

| Kunci | EN | ID |
|---|---|---|
| `title` | How I can help | Bagaimana saya bisa membantu |
| `servicesTitle` | Services | Jasa |
| `servicesDesc` | Connect payments and WhatsApp to what you already have, or build a new flow around your needs. We agree the scope first so nothing is fuzzy. | Menyambungkan pembayaran dan WhatsApp ke yang sudah Anda punya, atau membangun alur baru sesuai kebutuhan. Lingkup dibahas dulu supaya jelas. |
| `productsTitle` | Products | Produk |
| `productsDesc` | DualBrand: a website template for one parent brand and two child brands. Live demo included. | DualBrand: template website untuk satu merek induk dan dua merek anak. Ada demo langsung. |
| `journalTitle` | Journal | Jurnal |
| `journalDesc` | Every week I share one win and one problem—plain language, no fluff. | Setiap minggu saya bagikan satu yang berhasil dan satu yang bermasalah—bahasa plain, tanpa basa-basi. |

### `home.sakolentra`

| Kunci | EN | ID |
|---|---|---|
| `title` | SAKOLENTRA at SD Muhammadiyah 3 Samarinda | SAKOLENTRA di SD Muhammadiyah 3 Samarinda |
| `description` | Helps school admin and finance: tuition billing, bank payments, automatic matching, and WhatsApp updates for parents. | Membantu administrasi dan keuangan sekolah: tagihan SPP, pembayaran lewat bank, pencocokan otomatis, dan kabar WhatsApp ke orang tua. |
| `pilotCta` | Try it at your school | Coba di sekolah Anda |
| `caseStudyCta` | Read the story | Baca ceritanya |
| `flowTitle` | How SAKOLENTRA flows | Alur SAKOLENTRA |
| `flowSubtitle` | Bill → pay → match → tell parents | Tagihan → bayar → cocok → kabari orang tua |
| `flowBadge` | Example flow | Contoh alur |
| `flowFooter` | No real student data is shown. | Tidak menampilkan data siswa asli. |
| `step1Title` | Billing | Tagihan |
| `step1Desc` | Tuition & school fee schedule | Jadwal SPP & biaya sekolah |
| `step2Title` | Pay via bank | Bayar lewat bank |
| `step2Desc` | A unique pay number per student | Nomor bayar unik per siswa |
| `step3Title` | Matched | Dicocokkan |
| `step3Desc` | Incoming transfers are spotted | Transfer masuk langsung ketahuan |
| `step4Title` | WhatsApp | WhatsApp |
| `step4Desc` | Parents get an update | Orang tua dapat kabar |

### `home.otherProjects`

| Kunci | EN | ID |
|---|---|---|
| `title` | Other projects | Proyek lain |
| `description` | Other projects—general descriptions. | Proyek lain—deskripsi umum. |
| `colName` | Project | Proyek |
| `colType` | Type | Jenis |
| `colBuilt` | Outcome for the client | Hasil untuk klien |
| `p1Name` | Government Portal | Portal Pemerintah |
| `p1Type` | Public website | Situs publik |
| `p1Built` | New portal + older data moved cleanly | Portal baru + data lama dipindahkan rapi |
| `p2Name` | Multi-branch Operations | Operasional Multi-cabang |
| `p2Type` | Day-to-day ops | Operasional harian |
| `p2Built` | Branch attendance tied to payroll | Absensi cabang terhubung ke penggajian |
| `p3Name` | Membership Attendance | Presensi Keanggotaan |
| `p3Type` | Internal tool | Alat internal |
| `p3Built` | QR check-in and member map | Absensi QR dan peta anggota |
| `p4Name` | Ticket Sales | Penjualan Tiket |
| `p4Type` | Online sales | Penjualan online |
| `p4Built` | Online tickets with checkout | Tiket online dengan pembayaran langsung |

### `home.dualbrand`

| Kunci | EN | ID |
|---|---|---|
| `title` | DualBrand | DualBrand |
| `subtitle` | Multi-brand website template | Template website multi-merek |
| `description` | One package for a parent brand and two child brands—without building three separate sites. | Satu paket untuk merek induk dan dua merek anak—tanpa membangun tiga situs terpisah. |
| `demoCta` | See live demo | Lihat demo |
| `buyCta` | Buy template | Beli template |
| `licenseNote` | Read the license before you buy. | Baca ketentuan lisensi sebelum membeli. |
| `previewTitle` | One parent brand. Two child brands. | Satu merek induk. Dua merek anak. |
| `previewLead` | A ready-made website package that handles a holding brand and two distinct sub-brands in one codebase. | Paket website siap pakai untuk merek holding dan dua sub-merek berbeda dalam satu kode. |
| `previewItems` | Source files · Documentation · Live demo · License · Setup guide | File sumber · Dokumentasi · Demo langsung · Lisensi · Panduan pemasangan |
| `packageHeading` | What ships in the package | Isi paket |
| `docsLead` | The full write-up comes with the download. This is what the package includes. | Tulisan lengkap ikut di unduhan. Ini yang ada di dalam paket. |
| `askCta` | Ask before you buy | Tanya dulu sebelum beli |

### `home.stack`

| Kunci | EN | ID |
|---|---|---|
| `title` | How we work | Cara kita bekerja |
| `techTitle` | What I usually connect | Yang biasa saya sambungkan |
| `techList` | Midtrans · WhatsApp · Laravel · dashboards · portals · attendance · data migration | Midtrans · WhatsApp · Laravel · dasbor · portal · absensi · migrasi data |
| `habitsTitle` | Working together | Langkah kerja sama |
| `habit1` | We clarify the need first—then I build and hand over something ready to use. | Kita bahas kebutuhannya dulu—baru saya bangun sampai siap dipakai. |
| `habit2` | Before people rely on it, the flow is checked so common mistakes are caught early. | Sebelum dipakai, alurnya dicek supaya kesalahan umum tertangkap lebih awal. |
| `habit3` | The setup stays simple so your team can keep it going after launch. | Susunannya dijaga sederhana agar mudah dirawat setelah tim Anda memakai. |
| `habit4` | After it goes live, I watch that it keeps running smoothly. | Setelah jalan, saya pantau apakah semuanya tetap berjalan baik. |

### `home.journal`

| Kunci | EN | ID |
|---|---|---|
| `title` | Weekly notes | Catatan mingguan |
| `subtitle` | One win, one problem | Satu yang berhasil, satu yang bermasalah |
| `allCta` | All notes | Semua catatan |
| `emptyState` | First notes coming soon | Catatan pertama segera hadir |
| `builtLabel` | Win | Berhasil |
| `brokenLabel` | Problem | Bermasalah |
| `builtEmpty` | First win landing soon | Cerita berhasil segera hadir |
| `brokenEmpty` | First problem landing soon | Cerita masalah segera hadir |

### `home.socialProof`

| Kunci | EN | ID |
|---|---|---|
| `title` | From partners | Kata mitra |

### `home.faq`

| Kunci | EN | ID |
|---|---|---|
| `title` | Common questions | Pertanyaan yang sering diajukan |
| `allCta` | All questions | Semua pertanyaan |

### `home.newsletter`

| Kunci | EN | ID |
|---|---|---|
| `title` | Occasional email: what I built, what went wrong. | Sesekali satu email: apa yang saya bangun, apa yang bermasalah. |
| `description` | No spam. Unsubscribe anytime. | Tanpa spam. Bisa berhenti kapan saja. |
| `inputPlaceholder` | Your email address | Alamat email Anda |
| `submitButton` | Subscribe | Langganan |
| `privacyNote` | Your email stays private. See the privacy policy. | Email Anda dijaga aman. Baca kebijakan privasi. |

### `home.finalCta`

| Kunci | EN | ID |
|---|---|---|
| `title` | Ready to start? | Siap mulai? |
| `hireMe` | Hire me | Rekrut saya |
| `getTemplate` | Get the template | Ambil template |
| `workWithMe` | Book a project | Pesan jasa |
| `downloadCv` | Download CV | Unduh CV |
| `cvEn` | English CV (PDF) | CV Bahasa Inggris (PDF) |
| `cvId` | Indonesian CV (PDF) | CV Bahasa Indonesia (PDF) |

### `home.footer`

| Kunci | EN | ID |
|---|---|---|
| `rights` | All rights reserved. | Hak cipta dilindungi. |
| `location` | Samarinda, Indonesia | Samarinda, Indonesia |
| `privacy` | Privacy | Privasi |
| `terms` | Terms | Syarat & Ketentuan |
| `license` | License | Lisensi |

## 4. Products

Rute: /products, /products/dualbrand

Sumber: `src/app/[locale]/(site)/products/page.tsx`, `src/app/[locale]/(site)/products/dualbrand/page.tsx`, `src/content/product-catalog.ts`

Catatan: Status setiap produk diambil dari `product-catalog.ts` (DualBrand live, empat lain soon). `moreSoon` menyebut jumlah paket; ubah bila katalog berubah.

### `productsPage`

| Kunci | EN | ID |
|---|---|---|
| `title` | Ready-made products | Produk siap pakai |
| `description` | Templates and tools you can use right away—without starting from scratch. | Template dan alat yang bisa langsung dipakai—tanpa mulai dari nol. |
| `dualbrandTitle` | DualBrand | DualBrand |
| `dualbrandDesc` | A website for one parent brand and two child brands. Live demo included. | Website untuk satu merek induk dan dua merek anak. Ada demo langsung. |
| `dualbrandCta` | See DualBrand | Lihat DualBrand |
| `moreSoon` | Four more packages are being prepared. They stay unlabeled as live until checkout is ready. | Empat paket lain sedang disiapkan. Belum ditandai tersedia sampai checkout siap. |
| `availabilityNote` | Checkout and the live demo open here when the listing is ready. | Checkout dan demo langsung muncul di sini setelah listing siap. |
| `layerParent` | Parent brand | Merek induk |
| `layerChildA` | Child brand A | Merek anak A |
| `layerChildB` | Child brand B | Merek anak B |
| `liveLabel` | Available | Tersedia |
| `soonLabel` | Coming soon | Segera hadir |
| `browseLabel` | Browse all products | Lihat semua produk |
| `shelfTitle` | On the shelf | Di rak |
| `catalog.dualbrand.title` | DualBrand | DualBrand |
| `catalog.dualbrand.blurb` | One parent brand, two child brands, one codebase. | Satu merek induk, dua merek anak, satu codebase. |
| `catalog.paywa.title` | Payments + WhatsApp | Pembayaran + WhatsApp |
| `catalog.paywa.blurb` | Midtrans matching and WhatsApp updates for Laravel apps. | Pencocokan Midtrans dan pembaruan WhatsApp untuk aplikasi Laravel. |
| `catalog.schoolops.title` | School ops starter | Starter operasional sekolah |
| `catalog.schoolops.blurb` | Billing-to-notify flow shaped for school day-to-day work. | Alur tagihan ke pemberitahuan untuk kerja harian sekolah. |
| `catalog.portal.title` | Portal starter | Starter portal |
| `catalog.portal.blurb` | Public site shell with clean handoff for older data. | Kerangka situs publik dengan serah terima data lama yang rapi. |
| `catalog.attendance.title` | Attendance kit | Kit absensi |
| `catalog.attendance.blurb` | Check-in patterns for teams that need a simple daily record. | Pola check-in untuk tim yang butuh catatan harian yang sederhana. |

### `localNav`

| Kunci | EN | ID |
|---|---|---|
| `overview` | Overview | Ikhtisar |
| `docs` | Guide | Panduan |
| `license` | License | Lisensi |
| `buy` | Buy | Beli |

### `brandToggle`

| Kunci | EN | ID |
|---|---|---|
| `groupLabel` | Brand view | Tampilan merek |
| `notePrefix` | Note | Catatan |

## 5. Services

Rute: /services

Sumber: `src/app/[locale]/(site)/services/page.tsx`

Catatan: Dua paket: integrasi pembayaran + WhatsApp, dan software khusus. Tidak ada harga publik.

### `servicesPage`

| Kunci | EN | ID |
|---|---|---|
| `title` | Services | Jasa |
| `description` | Two packages for teams that want to tidy operations without building from scratch. | Dua paket untuk tim yang ingin merapikan operasional tanpa membangun dari nol. |
| `pkg1Label` | 01 | 01 |
| `pkg1Title` | Payments + WhatsApp for Laravel | Pembayaran + WhatsApp untuk Laravel |
| `pkg1Desc` | Connect Midtrans payment gateway and WhatsApp Business API to your existing Laravel application. Invoices are created, matched to incoming transfers, and the right person gets a WhatsApp message automatically. | Sambungkan Midtrans payment gateway dan WhatsApp Business API ke aplikasi Laravel yang sudah ada. Tagihan dibuat, dicocokkan dengan transfer masuk, lalu orang yang perlu tahu mendapat pesan WhatsApp secara otomatis. |
| `pkg1Scope` | Scope: Midtrans webhook, payment matching, WhatsApp template message send. | Lingkup: webhook Midtrans, pencocokan pembayaran, pengiriman template WhatsApp. |
| `pkg1Prereq` | Prerequisite: running Laravel application with database access. | Prasyarat: aplikasi Laravel yang sudah berjalan dengan akses database. |
| `pkg2Label` | 02 | 02 |
| `pkg2Title` | Custom software | Perangkat lunak khusus |
| `pkg2Desc` | Portals, attendance systems, dashboards, data migration—anything your team uses every day. We agree the full scope before anything is built, and I hand over something ready to use. | Portal, sistem absensi, dasbor, migrasi data—apa pun yang dipakai tim setiap hari. Lingkup disepakati sebelum pekerjaan dimulai, lalu saya serahkan sesuatu yang siap dipakai. |
| `pkg2Scope` | Scope: agreed before work begins. No open-ended engagements. | Lingkup: disepakati sebelum pekerjaan dimulai. Tidak ada keterlibatan tanpa batas. |
| `pkg2Prereq` | Prerequisite: a clear problem statement. We work it out together if needed. | Prasyarat: pernyataan masalah yang jelas. Kita diskusikan bersama jika diperlukan. |
| `cta` | Tell me what you need | Ceritakan kebutuhan Anda |

## 6. Work

Rute: /work, /work/sakolentra

Sumber: `src/app/[locale]/(site)/work/page.tsx`, `src/app/[locale]/(site)/work/[slug]/page.tsx`

Catatan: Halaman studi kasus memakai namespace `home.sakolentra` di atas. `workPage.description` hanya meta description.

### `workPage`

| Kunci | EN | ID |
|---|---|---|
| `description` | Selected work — school systems, operations tools, and client projects. | Karya pilihan — sistem sekolah, alat operasional, dan proyek klien. |

## 7. About

Rute: /about

Sumber: `src/app/[locale]/(site)/about/page.tsx`

Catatan: Angka di halaman ini berasal dari `src/content/facts.ts`. Jangan ubah nilainya tanpa persetujuan pemilik data.

### `aboutPage`

| Kunci | EN | ID |
|---|---|---|
| `title` | About | Tentang |
| `kicker` | Studio profile | Profil studio |
| `role` | Software engineer · day-to-day operations | Software engineer · operasional harian |
| `location` | Samarinda, Indonesia | Samarinda, Indonesia |
| `timezone` | WITA (UTC+8) | WITA (UTC+8) |
| `availability` | Open for projects | Terbuka untuk proyek |
| `intro` | Andy Pratama is a software engineer based in Samarinda, Indonesia. | Andy Pratama adalah software engineer berbasis di Samarinda, Indonesia. |
| `bio` | I build web systems for schools, agencies, and companies — focused on billing, payments, and day-to-day operations. | Saya membangun sistem web untuk sekolah, instansi, dan perusahaan — fokus pada tagihan, pembayaran, dan operasional harian. |
| `school` | Creator of SAKOLENTRA, a school administration system running at SD Muhammadiyah 3 Samarinda. | Pembuat SAKOLENTRA, sistem administrasi sekolah yang berjalan di SD Muhammadiyah 3 Samarinda. |
| `positioning` | Clearer day-to-day operations—without you needing the tech talk. Scope first, then a handoff your team can keep running. | Operasional harian yang lebih jelas—tanpa Anda harus ikut bahas teknis. Lingkup dulu, lalu serah terima yang bisa dijaga tim Anda. |
| `numbersTitle` | Numbers I can stand behind | Angka yang bisa saya tanggung |
| `studentsLabel` | students served at SD Muhammadiyah 3 Samarinda | siswa terlayani di SD Muhammadiyah 3 Samarinda |
| `yearsLabel` | years helping day-to-day operations | tahun membantu operasional harian |
| `modulesLabel` | active features in SAKOLENTRA | fitur aktif di SAKOLENTRA |
| `howTitle` | How the numbers are used | Cara angka dipakai |
| `howNote` | Only stated or verified facts appear here. Empty or unverified claims stay off the page. | Hanya fakta stated atau verified yang tampil di sini. Klaim kosong atau belum diverifikasi tidak ditampilkan. |
| `audienceTitle` | Who I work with | Dengan siapa saya bekerja |
| `audience1` | Schools that need billing, payments, and parent updates to stay clear. | Sekolah yang butuh tagihan, pembayaran, dan kabar ke orang tua yang jelas. |
| `audience2` | Agencies that want a multi-brand site without three separate codebases. | Agensi yang ingin situs multi-merek tanpa tiga codebase terpisah. |
| `audience3` | Companies tidying portals, attendance, dashboards, or data handoffs. | Perusahaan yang merapikan portal, absensi, dasbor, atau migrasi data. |
| `focusTitle` | Focus | Fokus |
| `focusList` | Billing · Payments · WhatsApp updates · Portals · Attendance · Data migration | Tagihan · Pembayaran · Kabar WhatsApp · Portal · Absensi · Migrasi data |
| `connectTitle` | What I usually connect | Yang biasa saya sambungkan |
| `connectList` | Midtrans · WhatsApp · Laravel · dashboards · portals · attendance · data migration | Midtrans · WhatsApp · Laravel · dasbor · portal · absensi · migrasi data |
| `workTitle` | Selected work | Karya pilihan |
| `workSakolentraName` | SAKOLENTRA | SAKOLENTRA |
| `workSakolentraType` | School operations | Operasional sekolah |
| `workSakolentraResult` | Billing → bank pay → match → WhatsApp for parents | Tagihan → bayar bank → cocok → WhatsApp ke orang tua |
| `formatsTitle` | Ways to work together | Cara kerja sama |
| `format1Name` | Payments + WhatsApp for Laravel | Pembayaran + WhatsApp untuk Laravel |
| `format1Note` | Fixed scope → fixed quote after we confirm the app and flow. | Lingkup tetap → harga tetap setelah aplikasi dan alur dikonfirmasi. |
| `format1Price` | Quote after brief | Quote setelah brief |
| `format2Name` | Custom software | Perangkat lunak khusus |
| `format2Note` | Portals, attendance, dashboards, migrations — scope agreed first. | Portal, absensi, dasbor, migrasi — lingkup disepakati dulu. |
| `format2Price` | Quote after brief | Quote setelah brief |
| `format3Name` | DualBrand template | Template DualBrand |
| `format3Note` | Ready-made site for one parent brand and two child brands. | Situs siap pakai untuk satu merek induk dan dua merek anak. |
| `format3Price` | Listed when checkout is ready | Tampil saat checkout siap |
| `formatsNote` | There is no public price list yet. Full terms follow the FAQ and the license at checkout for products. | Belum ada daftar harga publik. Ketentuan lengkap mengikuti FAQ dan lisensi di checkout untuk produk. |
| `formatsFaq` | Read the pricing FAQ | Baca FAQ harga |
| `quickLinksTitle` | On this site | Di situs ini |
| `linkWork` | Work | Karya |
| `linkProducts` | Products | Produk |
| `linkServices` | Services | Jasa |
| `linkStart` | Start here | Mulai di sini |
| `ctaTitle` | Want a clear scope and quote? | Butuh lingkup dan quote yang jelas? |
| `ctaBody` | Send the problem, who will use it, and any deadline that matters. I reply with questions or a simple plan. | Kirim masalahnya, siapa yang memakai, dan tenggat yang penting. Saya balas dengan pertanyaan atau rencana sederhana. |
| `ctaMail` | Email contact@andypratama.studio | Email contact@andypratama.studio |
| `ctaBrief` | Send a brief | Kirim brief |
| `ctaDisclaimer` | Numbers on this page come from facts.ts. Rates stay private until we agree scope — so social posts and this page stay aligned. | Angka di halaman ini dari facts.ts. Harga tetap privat sampai lingkup disepakati — supaya postingan sosial dan halaman ini selaras. |
| `startCta` | Start here | Mulai di sini |
| `workCta` | See the work | Lihat karya |
| `cvCta` | Request CV | Minta CV |
| `mediaKitCta` | Open media kit | Buka media kit |
| `footnoteTitle` | About these numbers | Tentang angka ini |
| `statedLabel` | Stated here, not rechecked | Dinyatakan di sini, belum dicek ulang |
| `verifiedLabel` | Verified | Terverifikasi |

## 8. Media kit

Rute: /media-kit

Sumber: `src/app/[locale]/(site)/media-kit/page.tsx`, `src/content/social-profiles.ts`

Catatan: Bio siap tempel per platform. Handle/URL profil masih `null` sampai pemilik memverifikasi, jadi tampil sebagai pending. Batas karakter tiap platform berbeda—periksa sebelum memperpanjang bio.

### `mediaKitPage`

| Kunci | EN | ID |
|---|---|---|
| `title` | Media kit | Media kit |
| `description` | One source for TikTok, Threads, Instagram, and LinkedIn — same facts, same offers, no invented numbers. | Satu sumber untuk TikTok, Threads, Instagram, dan LinkedIn — fakta sama, tawaran sama, tanpa angka dikarang. |
| `kicker` | Media kit · Andy Pratama Studio | Media kit · Andy Pratama Studio |
| `role` | Software engineer · day-to-day operations | Software engineer · operasional harian |
| `location` | Samarinda, Indonesia | Samarinda, Indonesia |
| `timezone` | WITA (UTC+8) | WITA (UTC+8) |
| `availability` | Open for projects | Terbuka untuk proyek |
| `positioning` | Clearer day-to-day operations—without you needing the tech talk. Scope first, then a handoff your team can keep running. | Operasional harian yang lebih jelas—tanpa Anda harus ikut bahas teknis. Lingkup dulu, lalu serah terima yang bisa dijaga tim Anda. |
| `platformsTitle` | Social channels | Kanal sosial |
| `platformsLead` | Use this page in each bio. Profile links appear live only after the owner verifies the URL. | Pakai halaman ini di setiap bio. Tautan profil baru muncul live setelah URL diverifikasi pemilik. |
| `pendingProfile` | Profile URL pending confirmation | URL profil menunggu konfirmasi |
| `verifiedProfile` | Open profile | Buka profil |
| `handlePending` | Handle not set yet | Handle belum diisi |
| `platform.tiktok` | TikTok | TikTok |
| `platform.threads` | Threads | Threads |
| `platform.instagram` | Instagram | Instagram |
| `platform.linkedin` | LinkedIn | LinkedIn |
| `bioTitle` | Ready-to-paste bios | Bio siap tempel |
| `bioLead` | Same studio story, trimmed per platform. Numbers only from facts.ts. | Cerita studio yang sama, dipotong per platform. Angka hanya dari facts.ts. |
| `bio.tiktok` | Andy Pratama Studio · Samarinda. Day-to-day ops software for schools & teams — billing, payments, WhatsApp. Start: andypratama.studio/start | Andy Pratama Studio · Samarinda. Software operasional harian untuk sekolah & tim — tagihan, bayar, WhatsApp. Mulai: andypratama.studio/start |
| `bio.threads` | I build day-to-day operations software from Samarinda — billing, payments, WhatsApp updates, portals. Scope first, then a handoff your team can keep. andypratama.studio/media-kit | Saya bangun software operasional harian dari Samarinda — tagihan, pembayaran, kabar WhatsApp, portal. Lingkup dulu, lalu serah terima yang bisa dijaga tim. andypratama.studio/media-kit |
| `bio.instagram` | Andy Pratama Studio · Samarinda<br />Day-to-day ops for schools & companies<br />Billing · payments · WhatsApp · portals<br />↓ Media kit & start | Andy Pratama Studio · Samarinda<br />Operasional harian untuk sekolah & perusahaan<br />Tagihan · bayar · WhatsApp · portal<br />↓ Media kit & mulai |
| `bio.linkedin` | Software engineer based in Samarinda, Indonesia. I help schools, agencies, and companies tidy billing, payments, WhatsApp updates, portals, and attendance — with clear scope and a handoff teams can keep running. Creator of SAKOLENTRA (school ops). Open for projects and roles. | Software engineer berbasis di Samarinda, Indonesia. Saya membantu sekolah, instansi, dan perusahaan merapikan tagihan, pembayaran, kabar WhatsApp, portal, dan absensi — dengan lingkup jelas dan serah terima yang bisa dijaga tim. Pembuat SAKOLENTRA (operasional sekolah). Terbuka untuk proyek dan peran penuh waktu. |
| `pinTitle` | Suggested bio link | Tautan bio yang disarankan |
| `pinUrl` | andypratama.studio/media-kit | andypratama.studio/media-kit |
| `pinAlt` | Or send people to /start for a brief. | Atau arahkan ke /start untuk brief. |
| `numbersTitle` | Numbers I can stand behind | Angka yang bisa saya tanggung |
| `studentsLabel` | students served at SD Muhammadiyah 3 Samarinda | siswa terlayani di SD Muhammadiyah 3 Samarinda |
| `yearsLabel` | years helping day-to-day operations | tahun membantu operasional harian |
| `modulesLabel` | active features in SAKOLENTRA | fitur aktif di SAKOLENTRA |
| `howNote` | Only stated or verified facts. Unverified claims stay off this kit. | Hanya fakta stated atau verified. Klaim belum diverifikasi tidak masuk kit ini. |
| `audienceTitle` | Who this is for | Untuk siapa |
| `audience1` | Schools that need billing, payments, and parent updates to stay clear. | Sekolah yang butuh tagihan, pembayaran, dan kabar ke orang tua yang jelas. |
| `audience2` | Agencies that want a multi-brand site without three separate codebases. | Agensi yang ingin situs multi-merek tanpa tiga codebase terpisah. |
| `audience3` | Companies tidying portals, attendance, dashboards, or data handoffs. | Perusahaan yang merapikan portal, absensi, dasbor, atau migrasi data. |
| `focusTitle` | Focus topics for posts | Topik fokus untuk postingan |
| `focusList` | Billing · Payments · WhatsApp updates · Portals · Attendance · Data migration | Tagihan · Pembayaran · Kabar WhatsApp · Portal · Absensi · Migrasi data |
| `connectTitle` | What I usually connect | Yang biasa saya sambungkan |
| `connectList` | Midtrans · WhatsApp · Laravel · dashboards · portals · attendance · data migration | Midtrans · WhatsApp · Laravel · dasbor · portal · absensi · migrasi data |
| `workTitle` | Selected work (safe to mention) | Karya yang aman disebut |
| `formatsTitle` | Ways to work together | Cara kerja sama |
| `format1Name` | Payments + WhatsApp for Laravel | Pembayaran + WhatsApp untuk Laravel |
| `format1Note` | Fixed scope → fixed quote after we confirm the app and flow. | Lingkup tetap → harga tetap setelah aplikasi dan alur dikonfirmasi. |
| `format1Price` | Quote after brief | Quote setelah brief |
| `format2Name` | Custom software | Perangkat lunak khusus |
| `format2Note` | Portals, attendance, dashboards, migrations — scope agreed first. | Portal, absensi, dasbor, migrasi — lingkup disepakati dulu. |
| `format2Price` | Quote after brief | Quote setelah brief |
| `format3Name` | DualBrand template | Template DualBrand |
| `format3Note` | Ready-made site for one parent brand and two child brands. | Situs siap pakai untuk satu merek induk dan dua merek anak. |
| `format3Price` | Listed when checkout is ready | Tampil saat checkout siap |
| `formatsNote` | No public price list yet — so social captions and this kit stay aligned. Details in the FAQ. | Belum ada daftar harga publik — supaya caption sosial dan kit ini selaras. Detail di FAQ. |
| `formatsFaq` | Pricing FAQ | FAQ harga |
| `assetsTitle` | Link destinations for captions | Tujuan tautan untuk caption |
| `assetStart` | Start / brief | Mulai / brief |
| `assetAbout` | About | Tentang |
| `assetProducts` | Products | Produk |
| `assetWork` | Work | Karya |
| `assetFaq` | FAQ | FAQ |
| `ctaTitle` | Want a scope and quote? | Butuh lingkup dan quote? |
| `ctaBody` | Send the problem, who will use it, and any deadline. Same contact for every platform. | Kirim masalahnya, siapa yang memakai, dan tenggat. Kontak sama untuk semua platform. |
| `ctaMail` | Email contact@andypratama.studio | Email contact@andypratama.studio |
| `ctaBrief` | Send a brief | Kirim brief |
| `ctaDisclaimer` | Use this kit as the single source for TikTok, Threads, Instagram, and LinkedIn. Do not invent follower counts, rates, or client logos in posts. | Pakai kit ini sebagai satu sumber untuk TikTok, Threads, Instagram, dan LinkedIn. Jangan karang jumlah follower, harga, atau logo klien di postingan. |
| `footnoteTitle` | About these numbers | Tentang angka ini |
| `statedLabel` | Stated here, not rechecked | Dinyatakan di sini, belum dicek ulang |
| `verifiedLabel` | Verified | Terverifikasi |
| `startCta` | Start here | Mulai di sini |
| `aboutCta` | Full about page | Halaman tentang lengkap |

## 9. CV

Rute: /cv

Sumber: `src/app/[locale]/(site)/cv/page.tsx`

Catatan: Halaman ini belum menyajikan berkas PDF (aset A-03 tertunda). CTA di home berlabel “Download CV”, tetapi mengarah ke halaman ini.

### `cvPage`

| Kunci | EN | ID |
|---|---|---|
| `title` | CV | CV |
| `intro` | Andy Pratama — software engineer based in Samarinda, Indonesia. | Andy Pratama — software engineer berbasis di Samarinda, Indonesia. |
| `skills` | Full-stack web development, payment integration, WhatsApp automation, and school management systems. | Pengembangan web full-stack, integrasi pembayaran, otomasi WhatsApp, dan sistem manajemen sekolah. |
| `requestNote` | The full CV is available on request. Use the link below. | CV lengkap tersedia atas permintaan. Gunakan tautan di bawah. |
| `requestCta` | Request CV | Minta CV |

## 10. Journal

Rute: /journal

Sumber: `src/app/[locale]/(site)/journal/page.tsx`

Catatan: Belum ada entri; yang tampil hanya empty state.

### `journalPage`

| Kunci | EN | ID |
|---|---|---|
| `title` | Journal | Jurnal |
| `subtitle` | One win, one problem — plain language, no fluff. | Satu yang berhasil, satu masalah — bahasa plain, tanpa basa-basi. |
| `emptyTitle` | No entries yet | Belum ada catatan |
| `emptyDescription` | Weekly notes will appear here — one thing that worked, one problem found. | Catatan mingguan akan muncul di sini — satu yang berhasil, satu masalah yang ditemui. |
| `winLabel` | Win | Berhasil |
| `problemLabel` | Problem | Masalah |
| `winEmpty` | First win landing soon | Catatan berhasil pertama segera hadir |
| `problemEmpty` | First problem landing soon | Catatan masalah pertama segera hadir |
| `subscribeCta` | Subscribe for updates | Langganan pembaruan |
| `homeCta` | Back to home | Kembali ke beranda |

## 11. Links

Rute: /links

Sumber: `src/app/[locale]/(site)/links/page.tsx`

Catatan: Konten kurasi, bukan tabel database. Tautan keluar tetap di balik konfirmasi pemilik.

### `linksPage`

| Kunci | EN | ID |
|---|---|---|
| `title` | Links | Tautan |
| `dualbrandLabel` | DualBrand — website template | DualBrand — template website |
| `dualbrandDemoLabel` | DualBrand — live demo | DualBrand — demo langsung |
| `mediaKitLabel` | Media kit — for TikTok, Threads, Instagram, LinkedIn | Media kit — untuk TikTok, Threads, Instagram, LinkedIn |
| `pendingNote` | pending confirmation | menunggu konfirmasi |

## 12. FAQ

Rute: /faq

Sumber: `src/app/[locale]/(site)/faq/page.tsx`, `src/content/faq.ts`

Catatan: Judul halaman di namespace ini; isi tanya-jawab ada di bagian “Isi FAQ” di bawah.

### `faqPage`

| Kunci | EN | ID |
|---|---|---|
| `title` | FAQ | FAQ |
| `description` | Straight answers about projects, hiring, DualBrand, and school pilots. | Jawaban langsung tentang proyek, rekrutmen, DualBrand, dan pilot sekolah. |

## 13. Kontak & intake

Rute: /contact, /start

Sumber: `src/app/[locale]/(site)/contact/page.tsx`, `src/app/[locale]/(site)/start/page.tsx`

Catatan: `/start` memakai form dan label yang sama dengan `/contact`; topik dipilih lewat query `?topic=`.

### `contactPage`

| Kunci | EN | ID |
|---|---|---|
| `description` | Tell me what you need. Choose a topic so the message lands in the right place. | Ceritakan kebutuhan Anda. Pilih topik agar pesan sampai ke tempat yang tepat. |
| `name` | Name | Nama |
| `email` | Email | Email |
| `topic` | Topic | Topik |
| `message` | Message | Pesan |
| `submit` | Send message | Kirim pesan |
| `topicProject` | Project / services | Proyek / jasa |
| `topicHiring` | Hiring | Rekrutmen |
| `topicSchool` | School pilot | Pilot sekolah |
| `topicOther` | Something else | Lainnya |

### `contactForm`

| Kunci | EN | ID |
|---|---|---|
| `errorRateLimit` | Too many requests. Try again shortly. | Terlalu banyak percobaan. Coba lagi sebentar. |
| `errorServer` | Could not send. Check the fields. | Pesan gagal terkirim. Periksa isian formulir. |
| `errorNetwork` | Network error. Try again. | Kesalahan jaringan. Coba lagi. |
| `successSent` | Message received. I will reply by email. | Pesan diterima. Saya akan membalas lewat email. |
| `fieldRequired` | This field is required. | Kolom ini wajib diisi. |
| `emailInvalid` | Please enter a valid email address. | Masukkan alamat email yang valid. |
| `topicRequired` | Please select a topic. | Pilih topik terlebih dahulu. |
| `messageRequired` | Please enter your message. | Masukkan pesan Anda. |
| `sending` | Sending… | Mengirim… |
| `privacyNote` | Privacy policy | Kebijakan privasi |

## 14. Newsletter

Rute: Form di home + /newsletter/status

Sumber: `src/components/brand/newsletter-form.tsx`, halaman status langganan

Catatan: Alur double opt-in: konfirmasi lewat email, lalu halaman status menampilkan hasilnya.

### `newsletterForm`

| Kunci | EN | ID |
|---|---|---|
| `errorRateLimit` | Too many requests. Try again shortly. | Terlalu banyak percobaan. Coba lagi sebentar. |
| `errorSubscribe` | Could not subscribe. Check your email. | Gagal berlangganan. Periksa alamat email Anda. |
| `errorNetwork` | Network error. Try again. | Kesalahan jaringan. Coba lagi. |
| `successConfirm` | Check your email to confirm. | Cek email Anda untuk konfirmasi. |

### `newsletterStatus`

| Kunci | EN | ID |
|---|---|---|
| `title` | Newsletter status | Status newsletter |
| `confirmed` | Subscription confirmed | Langganan dikonfirmasi |
| `confirmedNote` | You are on the list. You can unsubscribe from any email we send. | Email Anda sudah terdaftar. Anda bisa berhenti kapan saja lewat tautan di setiap email. |
| `unsubscribed` | You have been unsubscribed | Anda sudah berhenti berlangganan |
| `unsubscribedNote` | You will not receive further newsletter emails. | Anda tidak akan menerima email newsletter berikutnya. |
| `invalid` | This link is no longer valid | Tautan ini tidak valid lagi |
| `invalidNote` | The link may have expired or already been used. | Tautan mungkin kedaluwarsa atau sudah dipakai. |
| `backHome` | Back to home | Kembali ke beranda |

## 15. Legal

Rute: /license, /privacy, /terms

Sumber: Halaman `license`, `privacy`, `terms`

Catatan: Ketiganya masih berstatus draft kecuali teks lisensi yang mengikat di checkout.

### `licensePage`

| Kunci | EN | ID |
|---|---|---|
| `description` | How DualBrand may be used. The binding terms are shown at checkout. | Cara DualBrand boleh dipakai. Ketentuan yang mengikat tampil saat checkout. |
| `body` | DualBrand is sold as a template package. What you can and cannot do — including client work — is defined by the license you accept when you buy. | DualBrand dijual sebagai paket template. Apa yang boleh dan tidak — termasuk untuk klien — ditentukan oleh lisensi yang Anda setujui saat membeli. |
| `pointCheckout` | Full license text appears on Gumroad before payment. | Teks lisensi lengkap muncul di Gumroad sebelum pembayaran. |
| `pointFaq` | Common license questions are answered on the FAQ page. | Pertanyaan lisensi umum dijawab di halaman FAQ. |
| `pointContact` | For a clarification before you buy, use Start here. | Untuk klarifikasi sebelum membeli, gunakan Mulai di sini. |
| `faqCta` | Read FAQ | Baca FAQ |

### `privacyPage`

| Kunci | EN | ID |
|---|---|---|
| `title` | Privacy | Privasi |
| `draftDisclaimer` | Draft — full policy in preparation. | Draf — kebijakan lengkap sedang disiapkan. |
| `intro` | This site collects personal data only when you take an action: | Situs ini mengumpulkan data pribadi hanya saat Anda mengambil tindakan: |
| `contactForm` | Contact form: name, email address, and message content. | Formulir kontak: nama, alamat email, dan isi pesan. |
| `newsletter` | Newsletter: email address (when you subscribe). | Newsletter: alamat email (saat Anda berlangganan). |
| `shortLinks` | Short-link clicks through /go/* routes — destination only, no IP address or user-agent stored. | Klik tautan singkat melalui jalur /go/* — hanya tujuan yang dicatat, tanpa alamat IP atau user-agent. |
| `contact` | Questions? Email contact@andypratama.studio. | Ada pertanyaan? Email contact@andypratama.studio. |

### `termsPage`

| Kunci | EN | ID |
|---|---|---|
| `title` | Terms | Syarat & Ketentuan |
| `draftDisclaimer` | Draft — full terms in preparation. | Draf — ketentuan lengkap sedang disiapkan. |
| `intro` | By using this site you agree to these terms. | Dengan menggunakan situs ini Anda menyetujui ketentuan berikut. |
| `products` | Product purchases are governed by the license shown at checkout. | Pembelian produk diatur oleh lisensi yang ditampilkan saat checkout. |
| `contact` | Questions? Email contact@andypratama.studio. | Ada pertanyaan? Email contact@andypratama.studio. |

## 16. 404

Rute: Halaman tidak ditemukan

Sumber: `src/app/[locale]/not-found.tsx`

### `notFound`

| Kunci | EN | ID |
|---|---|---|
| `kicker` | 404 | 404 |
| `title` | This page is not here | Halaman ini tidak ada |
| `description` | The link may be old, or the page moved. Head home or tell me what you need. | Tautannya mungkin lama, atau halaman sudah dipindah. Kembali ke beranda atau ceritakan kebutuhan Anda. |
| `homeCta` | Back home | Kembali ke beranda |

## Isi FAQ (`src/content/faq.ts`)

Ditampilkan di `/faq` dan sebagian di home (`home`). Item dengan `requiresSetting` atau `pendingOwner`
belum tampil sampai pemilik mengisi/menyetujui.

### Cara kerja sama

#### 1. `build` — tampil di home

**Q (en):** What can you help me with?

**Q (id):** Apa yang bisa Anda bantu?

**A (en):** Day-to-day operations your team actually uses: billing and payments, matching bank transfers, WhatsApp updates, dashboards, and connecting the tools you already have. I handle the work from first conversation to launch.

**A (id):** Operasional harian yang benar-benar dipakai tim Anda: tagihan dan pembayaran, pencocokan transfer bank, kabar WhatsApp, dasbor, dan menyambungkan alat yang sudah ada. Saya kerjakan dari percakapan pertama sampai siap dipakai.

#### 2. `availability` — tampil di home

**Q (en):** Do you take projects or full-time roles?

**Q (id):** Apakah Anda menerima proyek atau kerja penuh waktu?

**A (en):** Both. I'm open to full-time roles (remote, Jakarta onsite, or international teams hiring from Indonesia) and to selected projects. Choose a topic on the contact page so your message goes to the right place.

**A (id):** Keduanya. Saya terbuka untuk peran penuh waktu (jarak jauh, onsite Jakarta, atau tim internasional yang merekrut dari Indonesia) dan untuk proyek terpilih. Pilih topik di halaman kontak agar pesan Anda sampai ke tempat yang tepat.

#### 3. `pricing` — tampil di home

**Q (en):** How does pricing work?

**Q (id):** Bagaimana soal harga?

**A (en):** Packages with a clear, fixed scope—like connecting payments and WhatsApp—get a fixed quote. Custom work is priced after we talk through the problem. There is no public price list yet.

**A (id):** Paket dengan lingkup jelas dan tetap—misalnya menyambungkan pembayaran dan WhatsApp—mendapat harga tetap. Pekerjaan khusus dihitung setelah kita bahas masalahnya. Belum ada daftar harga publik.

#### 4. `start` — menunggu persetujuan pemilik

**Q (en):** What do you need from me to start?

**Q (id):** Apa yang perlu saya siapkan untuk mulai?

**A (en):** A short note about the problem, who will use the system, how payments or messages work today, and any deadline that matters. I'll reply with questions or a simple plan.

**A (id):** Catatan singkat tentang masalahnya, siapa yang memakai sistem, bagaimana pembayaran atau pesan berjalan hari ini, dan tenggat yang penting. Saya balas dengan pertanyaan atau rencana sederhana.

#### 5. `remote` — tampil di home

**Q (en):** Can we work remotely?

**Q (id):** Bisakah kerja jarak jauh?

**A (en):** Yes. I'm based in Samarinda, Indonesia (UTC+8) and work with teams in other time zones.

**A (id):** Ya. Saya tinggal di Samarinda, Indonesia (UTC+8) dan terbuka bekerja dengan tim di zona waktu lain.

#### 6. `stack`

**Q (en):** What tools do you use?

**Q (id):** Alat apa yang Anda pakai?

**A (en):** Reliable tools for web systems and day-to-day operations—including payment and WhatsApp connections when needed. The exact mix depends on your project; we pick what fits, not what is trendy.

**A (id):** Alat yang andal untuk sistem web dan operasional harian—termasuk sambungan pembayaran dan WhatsApp bila diperlukan. Kombinasi pastinya mengikuti proyek Anda; dipilih yang cocok, bukan yang sedang tren.

#### 7. `ai` — menunggu persetujuan pemilik

**Q (en):** Do you use AI?

**Q (id):** Apakah Anda memakai AI?

**A (en):** Yes, as a helper for drafts and repetitive tasks. Final decisions, review, and testing stay with me. Anything that uses an AI voice or character is clearly labeled.

**A (id):** Ya, sebagai pembantu untuk draf dan pekerjaan berulang. Keputusan akhir, pengecekan, dan pengujian tetap di tangan saya. Apa pun yang memakai suara atau karakter AI diberi label jelas.

### SAKOLENTRA

#### 8. `sakolentra-what`

**Q (en):** What is SAKOLENTRA?

**Q (id):** Apa itu SAKOLENTRA?

**A (en):** Helps school admin and finance: tuition billing, bank payments, automatic matching, and WhatsApp updates for parents. It runs at SD Muhammadiyah 3 Samarinda with {fact:students} students. I built it and I own it.

**A (id):** Membantu administrasi dan keuangan sekolah: tagihan SPP, pembayaran lewat bank, pencocokan otomatis, dan kabar WhatsApp ke orang tua. Berjalan di SD Muhammadiyah 3 Samarinda dengan {fact:students} siswa. Saya yang membangunnya dan saya pemiliknya.

#### 9. `sakolentra-school` — tampil di home

**Q (en):** Can my school use it?

**Q (id):** Bisakah sekolah saya memakainya?

**A (en):** I'm opening a small pilot with a few schools. Fit depends on how your school collects fees today and which payment channels you use—we check that first. The public demo only uses sample data.

**A (id):** Saya membuka pilot kecil dengan beberapa sekolah. Kecocokan bergantung pada cara sekolah menagih biaya hari ini dan kanal pembayaran yang dipakai—itu kita cek dulu. Demo publik hanya memakai data contoh.

#### 10. `sakolentra-data`

**Q (en):** What happens to student data?

**Q (id):** Bagaimana dengan data siswa?

**A (en):** Student data belongs to the school. The public demo never uses real data. A pilot needs a written agreement before any real data is loaded.

**A (id):** Data siswa milik sekolah. Demo publik tidak pernah memakai data asli. Pilot membutuhkan perjanjian tertulis sebelum data asli dimuat.

#### 11. `sakolentra-name`

**Q (en):** Is SAKOLENTRA the same as ProductSchool?

**Q (id):** Apakah SAKOLENTRA sama dengan ProductSchool?

**A (en):** Yes. ProductSchool was the earlier name of the same system.

**A (id):** Ya. ProductSchool adalah nama lama dari sistem yang sama.

### DualBrand

#### 12. `dualbrand-what`

**Q (en):** What is DualBrand?

**Q (id):** Apa itu DualBrand?

**A (en):** A ready-made website template for a business with one parent brand and two child brands—without building three separate sites.

**A (id):** Template website siap pakai untuk bisnis dengan satu merek induk dan dua merek anak—tanpa membangun tiga situs terpisah.

#### 13. `dualbrand-license` — tampil di home

**Q (en):** Can I use DualBrand for client projects?

**Q (id):** Bolehkah DualBrand dipakai untuk proyek klien?

**A (en):** The license page lists exactly what you can and can't do, including client work. Please read it before you buy.

**A (id):** Halaman lisensi menjelaskan apa yang boleh dan tidak boleh, termasuk pekerjaan klien. Baca dulu sebelum membeli.

#### 14. `dualbrand-contents`

**Q (en):** What do I get after buying?

**Q (id):** Apa yang saya dapat setelah membeli?

**A (en):** The product page lists the package contents and setup needs. If something you expected is missing, tell me on the contact page.

**A (id):** Halaman produk memuat isi paket dan kebutuhan pemasangan. Jika ada yang Anda harapkan tetapi tidak ada, kabari saya lewat halaman kontak.

#### 15. `dualbrand-where`

**Q (en):** Where can I buy it?

**Q (id):** Di mana saya bisa membelinya?

**A (en):** On Gumroad for international buyers, and on Lynk.id for buyers in Indonesia.

**A (id):** Di Gumroad untuk pembeli internasional, dan di Lynk.id untuk pembeli di Indonesia.

#### 16. `dualbrand-refund`

**Q (en):** What about support and refunds?

**Q (id):** Bagaimana soal bantuan dan pengembalian dana?

**A (en):** Purchases go through Gumroad or Lynk.id, and the refund terms shown at checkout apply. For setup questions, use the contact page.

**A (id):** Pembelian lewat Gumroad atau Lynk.id, dan ketentuan pengembalian yang tampil saat checkout berlaku. Untuk pertanyaan pemasangan, gunakan halaman kontak.

### Tentang

#### 17. `series`

**Q (en):** What is the weekly series?

**Q (id):** Apa itu catatan mingguan?

**A (en):** Every week I share one thing that worked and one problem I hit while building the studio in public.

**A (id):** Setiap minggu saya bagikan satu hal yang berhasil dan satu masalah yang ditemui selagi membangun studio secara terbuka.

#### 18. `cv`

**Q (en):** Where can I get your CV?

**Q (id):** Di mana saya bisa mendapatkan CV Anda?

**A (en):** On the CV page, in English and Indonesian.

**A (id):** Di halaman CV, dalam bahasa Inggris dan Indonesia.

#### 19. `reply` — tampil bila setting `reply_time` terisi

**Q (en):** How fast do you reply?

**Q (id):** Seberapa cepat Anda membalas?

**A (en):** {setting:reply_time}

**A (id):** {setting:reply_time}

## Fakta (`src/content/facts.ts`)

Nilai ini dipakai di home, about, media kit, dan FAQ. Status “stated” berarti berasal dari CV/narasi
pemilik dan belum dicek ulang; “unverified” tidak ditampilkan sebagai angka.

| Fakta | Nilai | Status | Dipakai di |
|---|---|---|---|
| `students` | 1,000+ | stated | Proof home, about, media kit, FAQ SAKOLENTRA |
| `yearsBuilding` | 3+ | stated | Proof home, about, media kit |
| `school` | SD Muhammadiyah 3 Samarinda | stated | Home SAKOLENTRA, about, FAQ |
| `modules` | 52 | stated | Proof home, about, media kit |
| `endpoints` | — | unverified | Tidak tampil (kosong) |
| `tests` | — | unverified | Tidak tampil (kosong) |

## Catatan editorial

Temuan saat menyusun dokumen ini—bukan perubahan yang sudah diterapkan.

1. **Gaya tanda pisah tidak konsisten.** 22 kunci memakai “ — ” dan 10 kunci memakai “—tanpa spasi” (mis. `home.hero.title`, `servicesPage.pkg2Desc`). Pilih satu.
2. **Label “Download CV”.** `home.finalCta.downloadCv` dan label “English CV (PDF)” mengarah ke `/cv`, yang belum menyediakan PDF (aset A-03 tertunda) dan menyebut CV “available on request”. Selaraskan label atau sediakan berkas.
3. **Label “I'm hiring” mengarah ke `/work`.** `home.hero.pathHiring` membuka halaman portofolio, sedangkan CTA hiring lainnya menuju `/start?topic=hiring`. Pertimbangkan menyamakan tujuan atau menamai ulang kartu.
4. **Baris placeholder.** `home.otherProjects.description` berbunyi “Other projects—general descriptions.”—terdengar seperti catatan internal.
5. **Kunci tidak terpakai.** `home.hero.mark`, seluruh `home.footer.*`, dan `introVideo.pauseLabel` tidak dirender di mana pun. Bisa dihapus agar katalog bersih.
6. **Dua sumber label CTA.** “Start here”, “Send a brief”, “Tell me what you need”, “Book a project”, dan “Hire me” semuanya menuju form yang sama. Boleh disederhanakan menjadi satu istilah.
7. **FAQ menyebut angka lewat placeholder** (`{fact:students}`). Jangan mengganti placeholder dengan angka hard-code.
8. **Bio media kit punya batas platform.** Periksa batas karakter TikTok/Instagram/Threads/LinkedIn sebelum memperpanjang teks.
9. **Dashboard tidak termasuk.** Teks konsol owner ditulis langsung di `src/components/dashboard/*` dan bukan bagian situs publik.

## Di luar cakupan dokumen

- Teks dashboard owner (hard-coded di `src/components/dashboard/`).
- Email transaksional (konfirmasi newsletter, balasan kontak) yang dibangun di server.
- Metadata dinamis per entri journal (belum ada entri).
