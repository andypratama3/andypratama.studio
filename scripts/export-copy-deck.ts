/**
 * Builds docs/COPY-DECK.md from the message catalogues and content sources.
 * Run: pnpm exec tsx scripts/export-copy-deck.ts
 */
import { readFileSync, writeFileSync } from "node:fs"
import path from "node:path"

import { faq } from "../src/content/faq"
import { facts } from "../src/content/facts"

type Catalog = Record<string, unknown>

const root = path.resolve(import.meta.dirname, "..")
const en = JSON.parse(readFileSync(path.join(root, "src/messages/en.json"), "utf8")) as Catalog
const id = JSON.parse(readFileSync(path.join(root, "src/messages/id.json"), "utf8")) as Catalog

function get(catalog: Catalog, key: string): string {
  return key.split(".").reduce<unknown>((node, part) => {
    if (node && typeof node === "object" && part in (node as Catalog)) {
      return (node as Catalog)[part]
    }
    return undefined
  }, catalog) as string
}

function entries(prefix: string): [string, string, string][] {
  const rows: [string, string, string][] = []
  const walk = (node: unknown, trail: string) => {
    if (!node || typeof node !== "object") return
    for (const [key, value] of Object.entries(node as Catalog)) {
      const next = trail ? `${trail}.${key}` : key
      if (value && typeof value === "object") walk(value, next)
      else rows.push([next, String(get(en, `${prefix}.${next}`) ?? ""), String(get(id, `${prefix}.${next}`) ?? "")])
    }
  }
  walk(get(en, prefix), "")
  return rows
}

const cell = (value: string) =>
  value.replace(/\|/g, "\\|").replace(/\r?\n/g, "<br />").trim() || "—"

type Section = {
  title: string
  route: string
  files: string
  notes?: string
  namespaces: string[]
}

const sections: Section[] = [
  {
    title: "Global",
    route: "Semua halaman",
    files: "`src/messages/*.json` → metadata + `PublicPageShell` + halaman stub",
    notes:
      "`siteDescription` adalah meta description global. `stubNote`/`stubCta` hanya tampil di halaman yang belum berisi.",
    namespaces: ["common"],
  },
  {
    title: "Navigasi, tema, bahasa, footer",
    route: "Semua halaman",
    files:
      "`src/components/brand/floating-nav.tsx`, `src/components/site/theme-switcher.tsx`, `src/components/site/lang-switcher.tsx`, `src/components/site/site-footer.tsx`",
    notes:
      "`nav.brand` tampil di kiri navbar dan footer. Label ini juga dipakai untuk judul halaman di metadata.",
    namespaces: ["nav", "theme", "lang", "footer"],
  },
  {
    title: "Home",
    route: "/ dan /id",
    files: "`src/app/[locale]/(site)/page.tsx` + komponen `src/components/brand/*`",
    notes:
      "Urutan bagian di halaman: hero → proof → video → how I can help → SAKOLENTRA → other projects → DualBrand → cara kerja → journal → partner → FAQ → newsletter → final CTA.",
    namespaces: [
      "home.hero",
      "home.proof",
      "home.introVideo",
      "home.whatIDo",
      "home.sakolentra",
      "home.otherProjects",
      "home.dualbrand",
      "home.stack",
      "home.journal",
      "home.socialProof",
      "home.faq",
      "home.newsletter",
      "home.finalCta",
      "home.footer",
    ],
  },
  {
    title: "Products",
    route: "/products, /products/dualbrand",
    files:
      "`src/app/[locale]/(site)/products/page.tsx`, `src/app/[locale]/(site)/products/dualbrand/page.tsx`, `src/content/product-catalog.ts`",
    notes:
      "Status setiap produk diambil dari `product-catalog.ts` (DualBrand live, empat lain soon). `moreSoon` menyebut jumlah paket; ubah bila katalog berubah.",
    namespaces: ["productsPage", "localNav", "brandToggle"],
  },
  {
    title: "Services",
    route: "/services",
    files: "`src/app/[locale]/(site)/services/page.tsx`",
    notes: "Dua paket: integrasi pembayaran + WhatsApp, dan software khusus. Tidak ada harga publik.",
    namespaces: ["servicesPage"],
  },
  {
    title: "Work",
    route: "/work, /work/sakolentra",
    files: "`src/app/[locale]/(site)/work/page.tsx`, `src/app/[locale]/(site)/work/[slug]/page.tsx`",
    notes:
      "Halaman studi kasus memakai namespace `home.sakolentra` di atas. `workPage.description` hanya meta description.",
    namespaces: ["workPage"],
  },
  {
    title: "About",
    route: "/about",
    files: "`src/app/[locale]/(site)/about/page.tsx`",
    notes:
      "Angka di halaman ini berasal dari `src/content/facts.ts`. Jangan ubah nilainya tanpa persetujuan pemilik data.",
    namespaces: ["aboutPage"],
  },
  {
    title: "Media kit",
    route: "/media-kit",
    files: "`src/app/[locale]/(site)/media-kit/page.tsx`, `src/content/social-profiles.ts`",
    notes:
      "Bio siap tempel per platform. Handle/URL profil masih `null` sampai pemilik memverifikasi, jadi tampil sebagai pending. Batas karakter tiap platform berbeda—periksa sebelum memperpanjang bio.",
    namespaces: ["mediaKitPage"],
  },
  {
    title: "CV",
    route: "/cv",
    files: "`src/app/[locale]/(site)/cv/page.tsx`",
    notes:
      "Halaman ini belum menyajikan berkas PDF (aset A-03 tertunda). CTA di home berlabel “Download CV”, tetapi mengarah ke halaman ini.",
    namespaces: ["cvPage"],
  },
  {
    title: "Journal",
    route: "/journal",
    files: "`src/app/[locale]/(site)/journal/page.tsx`",
    notes: "Belum ada entri; yang tampil hanya empty state.",
    namespaces: ["journalPage"],
  },
  {
    title: "Links",
    route: "/links",
    files: "`src/app/[locale]/(site)/links/page.tsx`",
    notes: "Konten kurasi, bukan tabel database. Tautan keluar tetap di balik konfirmasi pemilik.",
    namespaces: ["linksPage"],
  },
  {
    title: "FAQ",
    route: "/faq",
    files: "`src/app/[locale]/(site)/faq/page.tsx`, `src/content/faq.ts`",
    notes: "Judul halaman di namespace ini; isi tanya-jawab ada di bagian “Isi FAQ” di bawah.",
    namespaces: ["faqPage"],
  },
  {
    title: "Kontak & intake",
    route: "/contact, /start",
    files: "`src/app/[locale]/(site)/contact/page.tsx`, `src/app/[locale]/(site)/start/page.tsx`",
    notes: "`/start` memakai form dan label yang sama dengan `/contact`; topik dipilih lewat query `?topic=`.",
    namespaces: ["contactPage", "contactForm"],
  },
  {
    title: "Newsletter",
    route: "Form di home + /newsletter/status",
    files: "`src/components/brand/newsletter-form.tsx`, halaman status langganan",
    notes: "Alur double opt-in: konfirmasi lewat email, lalu halaman status menampilkan hasilnya.",
    namespaces: ["newsletterForm", "newsletterStatus"],
  },
  {
    title: "Legal",
    route: "/license, /privacy, /terms",
    files: "Halaman `license`, `privacy`, `terms`",
    notes: "Ketiganya masih berstatus draft kecuali teks lisensi yang mengikat di checkout.",
    namespaces: ["licensePage", "privacyPage", "termsPage"],
  },
  {
    title: "404",
    route: "Halaman tidak ditemukan",
    files: "`src/app/[locale]/not-found.tsx`",
    namespaces: ["notFound"],
  },
]

const lines: string[] = []
const push = (line = "") => lines.push(line)

push("# Copy Deck — andypratama.studio")
push()
push("Seluruh teks yang tampil di situs publik, berpasangan Inggris (`en`) dan Indonesia (`id`).")
push("Dokumen ini dihasilkan dari `src/messages/en.json`, `src/messages/id.json`, dan `src/content/`,")
push("jadi setiap kunci di sini benar-benar dipakai (kecuali yang ditandai).")
push()
push("## Cara memakai dokumen ini")
push()
push("Tempel bagian **Aturan** dan bagian teks yang ingin direvisi ke Claude, lalu minta hasil dalam format tabel yang sama.")
push("Contoh prompt:")
push()
push("```text")
push("Revisi copy situs andypratama.studio di bawah ini. Aturan:")
push("1. Jangan mengubah angka, nama sekolah, nama produk, atau klaim faktual apa pun.")
push("2. Pertahankan bahasa Inggris yang tenang dan langsung; bahasa Indonesia yang formal (“Anda”), bukan gaul.")
push("3. Jangan menambah testimoni, logo klien, harga, atau janji hasil.")
push("4. Kembalikan tabel dengan kolom: kunci | EN baru | ID baru | alasan singkat (maks 12 kata).")
push("5. Tandai baris yang tidak perlu diubah dengan “tetap”.")
push("")
push("[tempel bagian teks di sini]")
push("```")
push()
push("## Aturan yang tidak boleh dilanggar")
push()
push("- Fakta hanya dari `src/content/facts.ts` (lihat tabel Fakta di bawah). Jangan mengarang angka.")
push("- Tanpa testimoni, logo klien, jumlah pengikut, atau harga publik.")
push("- Satu sapaan: “Anda” (id) dan “you” (en). Jangan campur “kamu”.")
push("- Nama produk dan entitas tetap: DualBrand, SAKOLENTRA, SD Muhammadiyah 3 Samarinda, Midtrans, Laravel, Gumroad, Lynk.id.")
push("- Placeholder `{fact:…}` dan `{setting:…}` harus tetap utuh.")
push("- Tanda pisah: pilih satu gaya. Saat ini 22 kunci memakai “ — ” (spasi) dan 10 kunci memakai “—tanpa spasi”.")
push()
push("## Peta halaman")
push()
push("| Rute | Bagian di dokumen |")
push("|---|---|")
for (const section of sections) {
  push(`| ${section.route} | ${section.title} |`)
}
push("| Semua rute | Isi FAQ (`src/content/faq.ts`) |")
push()

let index = 0
for (const section of sections) {
  index += 1
  push(`## ${index}. ${section.title}`)
  push()
  push(`Rute: ${section.route}`)
  push()
  push(`Sumber: ${section.files}`)
  if (section.notes) {
    push()
    push(`Catatan: ${section.notes}`)
  }
  push()
  for (const namespace of section.namespaces) {
    const rows = entries(namespace)
    if (!rows.length) continue
    push(`### \`${namespace}\``)
    push()
    push("| Kunci | EN | ID |")
    push("|---|---|---|")
    for (const [key, valueEn, valueId] of rows) {
      push(`| \`${key}\` | ${cell(valueEn)} | ${cell(valueId)} |`)
    }
    push()
  }
}

push("## Isi FAQ (`src/content/faq.ts`)")
push()
push("Ditampilkan di `/faq` dan sebagian di home (`home`). Item dengan `requiresSetting` atau `pendingOwner`")
push("belum tampil sampai pemilik mengisi/menyetujui.")
push()
const groupLabels: Record<string, string> = {
  work: "Cara kerja sama",
  sakolentra: "SAKOLENTRA",
  dualbrand: "DualBrand",
  about: "Tentang",
}
let faqIndex = 0
for (const group of Object.keys(groupLabels)) {
  const items = faq.filter((item) => item.group === group)
  if (!items.length) continue
  push(`### ${groupLabels[group]}`)
  push()
  for (const item of items) {
    faqIndex += 1
    const flags = [
      item.home ? "tampil di home" : null,
      item.pendingOwner ? "menunggu persetujuan pemilik" : null,
      item.requiresSetting ? `tampil bila setting \`${item.requiresSetting}\` terisi` : null,
    ].filter(Boolean)
    push(`#### ${faqIndex}. \`${item.id}\`${flags.length ? ` — ${flags.join(", ")}` : ""}`)
    push()
    push(`**Q (en):** ${item.q.en}`)
    push()
    push(`**Q (id):** ${item.q.id}`)
    push()
    push(`**A (en):** ${item.a.en}`)
    push()
    push(`**A (id):** ${item.a.id}`)
    push()
  }
}

push("## Fakta (`src/content/facts.ts`)")
push()
push("Nilai ini dipakai di home, about, media kit, dan FAQ. Status “stated” berarti berasal dari CV/narasi")
push("pemilik dan belum dicek ulang; “unverified” tidak ditampilkan sebagai angka.")
push()
push("| Fakta | Nilai | Status | Dipakai di |")
push("|---|---|---|---|")
const factUsage: Record<string, string> = {
  students: "Proof home, about, media kit, FAQ SAKOLENTRA",
  yearsBuilding: "Proof home, about, media kit",
  school: "Home SAKOLENTRA, about, FAQ",
  modules: "Proof home, about, media kit",
  endpoints: "Tidak tampil (kosong)",
  tests: "Tidak tampil (kosong)",
}
for (const [key, fact] of Object.entries(facts)) {
  push(`| \`${key}\` | ${fact.value || "—"} | ${fact.status} | ${factUsage[key] ?? "—"} |`)
}
push()

push("## Catatan editorial")
push()
push("Temuan saat menyusun dokumen ini—bukan perubahan yang sudah diterapkan.")
push()
push("1. **Gaya tanda pisah tidak konsisten.** 22 kunci memakai “ — ” dan 10 kunci memakai “—tanpa spasi” (mis. `home.hero.title`, `servicesPage.pkg2Desc`). Pilih satu.")
push("2. **Label “Download CV”.** `home.finalCta.downloadCv` dan label “English CV (PDF)” mengarah ke `/cv`, yang belum menyediakan PDF (aset A-03 tertunda) dan menyebut CV “available on request”. Selaraskan label atau sediakan berkas.")
push("3. **Label “I'm hiring” mengarah ke `/work`.** `home.hero.pathHiring` membuka halaman portofolio, sedangkan CTA hiring lainnya menuju `/start?topic=hiring`. Pertimbangkan menyamakan tujuan atau menamai ulang kartu.")
push("4. **Baris placeholder.** `home.otherProjects.description` berbunyi “Other projects—general descriptions.”—terdengar seperti catatan internal.")
push("5. **Kunci tidak terpakai.** `home.hero.mark`, seluruh `home.footer.*`, dan `introVideo.pauseLabel` tidak dirender di mana pun. Bisa dihapus agar katalog bersih.")
push("6. **Dua sumber label CTA.** “Start here”, “Send a brief”, “Tell me what you need”, “Book a project”, dan “Hire me” semuanya menuju form yang sama. Boleh disederhanakan menjadi satu istilah.")
push("7. **FAQ menyebut angka lewat placeholder** (`{fact:students}`). Jangan mengganti placeholder dengan angka hard-code.")
push("8. **Bio media kit punya batas platform.** Periksa batas karakter TikTok/Instagram/Threads/LinkedIn sebelum memperpanjang teks.")
push("9. **Dashboard tidak termasuk.** Teks konsol owner ditulis langsung di `src/components/dashboard/*` dan bukan bagian situs publik.")
push()

push("## Di luar cakupan dokumen")
push()
push("- Teks dashboard owner (hard-coded di `src/components/dashboard/`).")
push("- Email transaksional (konfirmasi newsletter, balasan kontak) yang dibangun di server.")
push("- Metadata dinamis per entri journal (belum ada entri).")
push()

writeFileSync(path.join(root, "docs/COPY-DECK.md"), lines.join("\n"), "utf8")
console.log(`docs/COPY-DECK.md written (${lines.length} lines)`)
