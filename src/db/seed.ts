import { db } from "./index"
import {
  agents,
  links,
  products,
  projects,
  siteSettings,
} from "./schema"
import { eq } from "drizzle-orm"

export async function seed() {
  console.log("🌱 Running idempotent database seed...")

  // 1. Seed Agents (Roster §3 & §8)
  const roster = [
    {
      slug: "owner",
      displayName: "Andy Pratama",
      role: "Owner & Lead Architect",
      scope: "Keputusan akhir, rilis produksi, harga, persetujuan gerbang",
      canWrite: ["all"],
      requiresApproval: [],
      active: true,
    },
    {
      slug: "executive-assistant",
      displayName: "Executive Assistant",
      role: "Dokumentasi keputusan, ringkasan, koordinasi jadwal",
      scope: "Ringkasan metrik, draf agenda, persiapan tindak lanjut",
      canWrite: ["tasks", "metrics_daily", "site_settings"],
      requiresApproval: ["ubah_harga", "deploy", "hapus_data"],
      active: true,
    },
    {
      slug: "engineering-lead",
      displayName: "Engineering Lead",
      role: "Arsitektur kode, performa, migrasi database, CI/CD",
      scope: "src/, drizzle/, tests/, next.config.ts, docker/",
      canWrite: ["tasks", "projects", "applications"],
      requiresApproval: ["deploy", "hapus_data", "ubah_facts"],
      active: true,
    },
    {
      slug: "creative-director",
      displayName: "Creative Director",
      role: "Desain sistem, estetika visual, komponen UI brand",
      scope: "src/styles/, src/components/brand/, visual tokens",
      canWrite: ["content_items", "tasks"],
      requiresApproval: ["publish", "ubah_facts"],
      active: true,
    },
    {
      slug: "content-strategist",
      displayName: "Content Strategist",
      role: "Strategi konten, naskah, kalender publikasi, FAQ",
      scope: "src/content/, src/messages/, catatan mingguan",
      canWrite: ["content_items", "tasks"],
      requiresApproval: ["publish", "kirim_pesan"],
      active: true,
    },
    {
      slug: "business-operations",
      displayName: "Business Operations",
      role: "Pipeline lead, outreach, analitik produk, penawaran",
      scope: "leads, outreach_events, sales, links",
      canWrite: ["leads", "outreach_events", "links", "sales"],
      requiresApproval: ["kirim_pesan", "ubah_harga"],
      active: true,
    },
  ]

  for (const agent of roster) {
    const existing = await db
      .select({ id: agents.id })
      .from(agents)
      .where(eq(agents.slug, agent.slug))
      .limit(1)

    if (existing.length === 0) {
      await db.insert(agents).values(agent)
      console.log(`  ✓ Agent created: ${agent.slug}`)
    } else {
      await db
        .update(agents)
        .set(agent)
        .where(eq(agents.slug, agent.slug))
      console.log(`  ✓ Agent updated: ${agent.slug}`)
    }
  }

  // 2. Seed Products
  const initialProducts = [
    {
      slug: "dualbrand",
      name: "DualBrand",
      status: "live" as const,
      priceUsd: "49.00",
      gumroadUrl: "https://gumroad.com/l/dualbrand",
      lynkUrl: "https://lynk.id/dualbrand",
      demoUrl: "https://andypratama.studio/products/dualbrand",
      licenseNote: "Lisensi komersial satu organisasi atau klien.",
    },
  ]

  for (const product of initialProducts) {
    const existing = await db
      .select({ id: products.id })
      .from(products)
      .where(eq(products.slug, product.slug))
      .limit(1)

    if (existing.length === 0) {
      await db.insert(products).values(product)
      console.log(`  ✓ Product created: ${product.slug}`)
    } else {
      await db
        .update(products)
        .set(product)
        .where(eq(products.slug, product.slug))
      console.log(`  ✓ Product updated: ${product.slug}`)
    }
  }

  // 3. Seed Projects
  const initialProjects = [
    {
      slug: "dualbrand",
      name: "DualBrand Template",
      kind: "produk" as const,
      stage: "validasi" as const,
      summary: "Template multi-brand Next.js & Tailwind untuk holding dan dua sub-brand.",
      nextStep: "Kumpulkan feedback awal pembeli dan siapkan materi dokumentasi lanjutan.",
    },
    {
      slug: "sakolentra-pilot",
      name: "SAKOLENTRA (Multi-sekolah)",
      kind: "produk" as const,
      stage: "ide" as const,
      summary: "Ekspansi sistem pembayaran dan operasional sekolah ke jaringan sekolah lain.",
      nextStep: "Selesaikan daftar periksa kesiapan pilot multi-tenant vs single-tenant.",
    },
    {
      slug: "paket-midtrans-wa",
      name: "Jasa Terpaket Midtrans + WhatsApp",
      kind: "jasa" as const,
      stage: "ide" as const,
      summary: "Paket integrasi cepat pembayaran otomatis dan WhatsApp broadcast/notifikasi.",
      nextStep: "Susun proposal cakupan kerja standar dan durasi implementasi.",
    },
    {
      slug: "seri-konten-mingguan",
      name: "Seri Konten Mingguan",
      kind: "konten" as const,
      stage: "bangun" as const,
      summary: "Publikasi mingguan catatan operasional 1 win dan 1 problem di berbagai kanal.",
      nextStep: "Siapkan draft konten minggu pertama dan jadwal tayang.",
    },
  ]

  for (const project of initialProjects) {
    const existing = await db
      .select({ id: projects.id })
      .from(projects)
      .where(eq(projects.slug, project.slug))
      .limit(1)

    if (existing.length === 0) {
      await db.insert(projects).values(project)
      console.log(`  ✓ Project created: ${project.slug}`)
    } else {
      await db
        .update(projects)
        .set(project)
        .where(eq(projects.slug, project.slug))
      console.log(`  ✓ Project updated: ${project.slug}`)
    }
  }

  // 4. Seed Links
  const initialLinks = [
    {
      slug: "threads-start",
      destination: "https://andypratama.studio/start?utm_source=threads&utm_medium=organic&utm_campaign=bio",
      platform: "threads",
      campaign: "bio",
      medium: "organic",
    },
    {
      slug: "tiktok-start",
      destination: "https://andypratama.studio/start?utm_source=tiktok&utm_medium=organic&utm_campaign=bio",
      platform: "tiktok",
      campaign: "bio",
      medium: "organic",
    },
    {
      slug: "instagram-start",
      destination: "https://andypratama.studio/start?utm_source=instagram&utm_medium=organic&utm_campaign=bio",
      platform: "instagram",
      campaign: "bio",
      medium: "organic",
    },
    {
      slug: "linkedin-start",
      destination: "https://andypratama.studio/start?utm_source=linkedin&utm_medium=organic&utm_campaign=featured",
      platform: "linkedin",
      campaign: "featured",
      medium: "organic",
    },
    {
      slug: "youtube-start",
      destination: "https://andypratama.studio/start?utm_source=youtube&utm_medium=organic&utm_campaign=description",
      platform: "youtube",
      campaign: "description",
      medium: "organic",
    },
  ]

  for (const link of initialLinks) {
    const existing = await db
      .select({ id: links.id })
      .from(links)
      .where(eq(links.slug, link.slug))
      .limit(1)

    if (existing.length === 0) {
      await db.insert(links).values(link)
      console.log(`  ✓ Link created: ${link.slug}`)
    } else {
      await db
        .update(links)
        .set(link)
        .where(eq(links.slug, link.slug))
      console.log(`  ✓ Link updated: ${link.slug}`)
    }
  }

  // 5. Seed Site Settings
  const initialSettings = [
    {
      key: "availability",
      value: {
        status: "open",
        noteEn: "Open for Q1 projects and advisory roles",
        noteId: "Terbuka untuk proyek Q1 dan peran penasihat",
      },
    },
    {
      key: "reply_time",
      value: {
        en: "Usually responds within 24 hours on weekdays",
        id: "Biasanya membalas dalam 24 jam pada hari kerja",
      },
    },
  ]

  for (const setting of initialSettings) {
    const existing = await db
      .select({ key: siteSettings.key })
      .from(siteSettings)
      .where(eq(siteSettings.key, setting.key))
      .limit(1)

    if (existing.length === 0) {
      await db.insert(siteSettings).values(setting)
      console.log(`  ✓ Setting created: ${setting.key}`)
    } else {
      await db
        .update(siteSettings)
        .set(setting)
        .where(eq(siteSettings.key, setting.key))
      console.log(`  ✓ Setting updated: ${setting.key}`)
    }
  }

  console.log("✅ Seed completed successfully.")
}

if (process.argv[1]?.endsWith("seed.ts") || process.argv[1]?.endsWith("seed.mjs")) {
  seed()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error("❌ Seed failed:", err)
      process.exit(1)
    })
}
