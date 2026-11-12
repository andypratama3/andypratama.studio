"use server"

import { revalidatePath } from "next/cache"
import { db } from "@/db"
import {
  agentTasks,
  applications,
  contentItems,
  leads,
  links,
  metricsDaily,
  outreachEvents,
  products,
  projects,
  sales,
  siteSettings,
  subscribers,
  tasks,
} from "@/db/schema"
import { requireOwner } from "@/lib/auth"
import { and, eq } from "drizzle-orm"

// ==========================================
// Tasks Actions
// ==========================================
export async function updateTaskStatus(
  taskId: string,
  status: "belum" | "jalan" | "selesai" | "ditunda"
): Promise<void> {
  await requireOwner()
  const completedAt = status === "selesai" ? new Date() : null
  await db
    .update(tasks)
    .set({ status, completedAt })
    .where(eq(tasks.id, taskId))
  revalidatePath("/dashboard")
  revalidatePath("/dashboard/tasks")
}

export async function createTask(formData: FormData): Promise<void> {
  await requireOwner()
  const title = String(formData.get("title") || "").trim()
  const lane = (formData.get("lane") || "produk") as
    | "produk"
    | "video"
    | "karier"
    | "distribusi"
    | "review"
  const session = (formData.get("session") || "pagi") as
    | "pagi"
    | "siang"
    | "malam"
  const priority = (formData.get("priority") || "tinggi") as
    | "kritis"
    | "tinggi"
    | "fleksibel"
  const plannedDate = String(formData.get("plannedDate") || "") || null
  const durationMin = parseInt(String(formData.get("durationMin") || "0"), 10) || null
  const doneCriteria = String(formData.get("doneCriteria") || "").trim() || null

  if (!title) throw new Error("Judul tugas wajib diisi")

  await db.insert(tasks).values({
    title,
    lane,
    session,
    priority,
    plannedDate,
    durationMin,
    doneCriteria,
    status: "belum",
  })

  revalidatePath("/dashboard")
  revalidatePath("/dashboard/tasks")
}

// ==========================================
// Lead & Outreach Actions
// ==========================================
export async function updateLeadStage(
  leadId: string,
  stage:
    | "baru"
    | "dihubungi"
    | "balas"
    | "diskusi"
    | "penawaran"
    | "menang"
    | "kalah"
): Promise<void> {
  await requireOwner()
  await db
    .update(leads)
    .set({ stage })
    .where(eq(leads.id, leadId))
  revalidatePath("/dashboard/leads")
}

export async function createLead(formData: FormData): Promise<void> {
  await requireOwner()
  const name = String(formData.get("name") || "").trim()
  const handle = String(formData.get("handle") || "").trim() || null
  const platform = (formData.get("platform") || "linkedin") as
    | "linkedin"
    | "tiktok"
    | "instagram"
    | "threads"
    | "email"
    | "lainnya"
  const segment = (formData.get("segment") || "freelancer") as
    | "freelancer"
    | "agency"
    | "multi_brand"
    | "sekolah"
    | "perekrut"
    | "lainnya"
  const url = String(formData.get("url") || "").trim() || null
  const notes = String(formData.get("notes") || "").trim() || null

  if (!name) throw new Error("Nama lead wajib diisi")

  await db.insert(leads).values({
    name,
    handle,
    platform,
    segment,
    stage: "baru",
    url,
    notes,
  })

  revalidatePath("/dashboard/leads")
}

export async function addOutreachEvent(formData: FormData): Promise<void> {
  await requireOwner()
  const leadId = String(formData.get("leadId") || "")
  const channel = String(formData.get("channel") || "linkedin").trim()
  const direction = (formData.get("direction") || "keluar") as "keluar" | "masuk"
  const body = String(formData.get("body") || "").trim() || null

  if (!leadId) throw new Error("Lead ID diperlukan")

  await db.insert(outreachEvents).values({
    leadId,
    channel,
    direction,
    body,
    createdBy: "owner",
    approvedByOwner: true,
  })

  await db
    .update(leads)
    .set({
      lastContactAt: new Date(),
      stage: direction === "keluar" ? "dihubungi" : "balas",
    })
    .where(eq(leads.id, leadId))

  revalidatePath("/dashboard/leads")
}

// ==========================================
// Application Actions
// ==========================================
export async function createApplication(formData: FormData): Promise<void> {
  await requireOwner()
  const company = String(formData.get("company") || "").trim()
  const role = String(formData.get("role") || "").trim()
  const channel = String(formData.get("channel") || "").trim() || null
  const url = String(formData.get("url") || "").trim() || null
  const notes = String(formData.get("notes") || "").trim() || null

  if (!company || !role) throw new Error("Nama perusahaan dan peran wajib diisi")

  await db.insert(applications).values({
    company,
    role,
    channel,
    url,
    notes,
    status: "terkirim",
    sentAt: new Date(),
  })

  revalidatePath("/dashboard/applications")
}

export async function updateApplicationStatus(
  id: string,
  status:
    | "terkirim"
    | "balasan"
    | "wawancara"
    | "tes"
    | "tawaran"
    | "ditolak"
    | "tidak_ada_kabar"
): Promise<void> {
  await requireOwner()
  await db
    .update(applications)
    .set({ status })
    .where(eq(applications.id, id))
  revalidatePath("/dashboard/applications")
}

// ==========================================
// Content Actions
// ==========================================
export async function createContentItem(formData: FormData): Promise<void> {
  await requireOwner()
  const title = String(formData.get("title") || "").trim()
  const platform = (formData.get("platform") || "tiktok") as
    | "tiktok"
    | "instagram"
    | "threads"
    | "linkedin"
    | "youtube"
    | "website"
  const format = (formData.get("format") || "video") as
    | "video"
    | "post"
    | "carousel"
    | "artikel"
  const series = (formData.get("series") || "build_in_public") as
    | "build_in_public"
    | "production_notes"
    | "remotion_tips"
    | "case_study"
    | "lainnya"
  const hook = String(formData.get("hook") || "").trim() || null

  if (!title) throw new Error("Judul konten wajib diisi")

  await db.insert(contentItems).values({
    title,
    platform,
    format,
    series,
    hook,
    status: "ide",
  })

  revalidatePath("/dashboard/content")
}

export async function updateContentStatus(
  id: string,
  status: "ide" | "naskah" | "produksi" | "terjadwal" | "tayang"
): Promise<void> {
  await requireOwner()
  const publishedAt = status === "tayang" ? new Date() : null
  await db
    .update(contentItems)
    .set({ status, publishedAt })
    .where(eq(contentItems.id, id))
  revalidatePath("/dashboard/content")
}

// ==========================================
// Metrics Actions
// ==========================================
export async function recordMetric(formData: FormData): Promise<void> {
  await requireOwner()
  const date = String(formData.get("date") || new Date().toISOString().split("T")[0])
  const platform = (formData.get("platform") || "all") as
    | "all"
    | "tiktok"
    | "instagram"
    | "threads"
    | "linkedin"
    | "youtube"
    | "gumroad"
    | "lynk"
    | "website"
  const metric = String(formData.get("metric") || "").trim()
  const value = String(formData.get("value") || "0").trim()

  if (!metric) throw new Error("Nama metrik wajib diisi")

  await db
    .insert(metricsDaily)
    .values({
      date,
      platform,
      metric,
      value,
      source: "manual",
    })
    .onDuplicateKeyUpdate({
      set: { value, source: "manual" },
    })

  revalidatePath("/dashboard/metrics")
  revalidatePath("/dashboard")
}

// ==========================================
// Agent Approval Gates
// ==========================================
export async function resolveAgentTask(
  agentTaskId: string,
  action: "setujui" | "tolak"
): Promise<void> {
  await requireOwner()

  const rows = await db
    .select({ status: agentTasks.status })
    .from(agentTasks)
    .where(eq(agentTasks.id, agentTaskId))
    .limit(1)

  if (rows[0]?.status !== "butuh_persetujuan") {
    throw new Error("Hanya tugas di gerbang persetujuan yang bisa diputuskan.")
  }

  const status = action === "setujui" ? "selesai" : "ditolak"
  await db
    .update(agentTasks)
    .set({
      status,
      approvedAt: action === "setujui" ? new Date() : null,
    })
    .where(eq(agentTasks.id, agentTaskId))

  revalidatePath("/dashboard")
  revalidatePath("/dashboard/agents")
}

// ==========================================
// Links & Settings Actions
// ==========================================
export async function createLink(formData: FormData): Promise<void> {
  await requireOwner()
  const slug = String(formData.get("slug") || "").trim()
  const destination = String(formData.get("destination") || "").trim()
  const platform = String(formData.get("platform") || "").trim() || null
  const campaign = String(formData.get("campaign") || "").trim() || null

  if (!slug || !destination) throw new Error("Slug dan URL tujuan wajib diisi")

  await db.insert(links).values({
    slug,
    destination,
    platform,
    campaign,
    medium: "organic",
  })

  revalidatePath("/dashboard/links")
}

export async function updateSiteSetting(key: string, value: unknown): Promise<void> {
  await requireOwner()
  await db
    .insert(siteSettings)
    .values({
      key,
      value,
    })
    .onDuplicateKeyUpdate({
      set: { value },
    })

  revalidatePath("/dashboard/settings")
  revalidatePath("/", "layout")
}

// ==========================================
// Links: toggle, sales, subscribers, leads
// ==========================================
export async function setLinkActive(linkId: string, active: boolean): Promise<void> {
  await requireOwner()
  await db.update(links).set({ active }).where(eq(links.id, linkId))
  revalidatePath("/dashboard/links")
}

export async function createSale(formData: FormData): Promise<void> {
  await requireOwner()

  const productId = String(formData.get("productId") || "").trim()
  const platform = String(formData.get("platform") || "").trim()
  const gross = String(formData.get("grossUsd") || "").trim()
  const externalIdRaw = String(formData.get("externalId") || "").trim()
  const referrerUtm = String(formData.get("referrerUtm") || "").trim() || null

  const platforms = ["gumroad", "lynk", "etsy", "payhip", "direct"] as const
  if (!productId || !platforms.includes(platform as (typeof platforms)[number])) {
    throw new Error("Produk dan platform penjualan wajib valid.")
  }
  if (gross && !/^\d+(\.\d{1,2})?$/.test(gross)) {
    throw new Error("Nominal penjualan tidak valid.")
  }

  await db.insert(sales).values({
    productId,
    platform: platform as (typeof platforms)[number],
    occurredAt: new Date(),
    grossUsd: gross || null,
    externalId: externalIdRaw || `manual-${crypto.randomUUID()}`,
    referrerUtm,
    source: "manual",
  })

  revalidatePath("/dashboard/products")
  revalidatePath("/dashboard")
}

export async function updateLeadDetails(formData: FormData): Promise<void> {
  await requireOwner()

  const leadId = String(formData.get("leadId") || "").trim()
  const stage = String(formData.get("stage") || "").trim()
  const segment = String(formData.get("segment") || "").trim()
  const sourceUtm = String(formData.get("sourceUtm") || "").trim() || null

  const stages = ["baru", "dihubungi", "balas", "diskusi", "penawaran", "menang", "kalah"] as const
  const segments = [
    "freelancer",
    "agency",
    "multi_brand",
    "sekolah",
    "perekrut",
    "lainnya",
  ] as const

  if (
    !leadId ||
    !stages.includes(stage as (typeof stages)[number]) ||
    !segments.includes(segment as (typeof segments)[number])
  ) {
    throw new Error("Data lead tidak valid.")
  }

  await db
    .update(leads)
    .set({
      stage: stage as (typeof stages)[number],
      segment: segment as (typeof segments)[number],
      sourceUtm,
    })
    .where(eq(leads.id, leadId))

  revalidatePath("/dashboard/leads")
  revalidatePath("/dashboard")
}

export async function unsubscribeSubscriber(subscriberId: string): Promise<void> {
  await requireOwner()
  await db
    .update(subscribers)
    .set({ status: "unsubscribed", confirmTokenHash: null })
    .where(eq(subscribers.id, subscriberId))
  revalidatePath("/dashboard/settings")
}

export async function approveSubscriber(subscriberId: string): Promise<void> {
  await requireOwner()
  await db
    .update(subscribers)
    .set({ status: "confirmed", confirmedAt: new Date(), confirmTokenHash: null })
    .where(and(eq(subscribers.id, subscriberId), eq(subscribers.status, "pending")))
  revalidatePath("/dashboard/settings")
}

// ==========================================
// Product & Project Actions
// ==========================================
export async function updateProductPrice(
  productId: string,
  priceUsd: string
): Promise<void> {
  await requireOwner()
  await db
    .update(products)
    .set({ priceUsd })
    .where(eq(products.id, productId))
  revalidatePath("/dashboard/products")
}

export async function updateProjectStage(
  projectId: string,
  stage: "ide" | "validasi" | "bangun" | "pilot" | "jalan" | "arsip",
  nextStep?: string
): Promise<void> {
  await requireOwner()
  await db
    .update(projects)
    .set({
      stage,
      ...(nextStep ? { nextStep } : {}),
    })
    .where(eq(projects.id, projectId))
  revalidatePath("/dashboard/projects")
}

export async function updateSakolentraChecklist(itemKey: string, checked: boolean): Promise<void> {
  await requireOwner()
  const existing = await db
    .select()
    .from(siteSettings)
    .where(eq(siteSettings.key, "sakolentra_pilot_checklist"))
    .limit(1)

  const currentVal = (existing[0]?.value as Record<string, boolean>) || {}
  currentVal[itemKey] = checked

  await db
    .insert(siteSettings)
    .values({
      key: "sakolentra_pilot_checklist",
      value: currentVal,
    })
    .onDuplicateKeyUpdate({
      set: { value: currentVal },
    })

  revalidatePath("/dashboard/projects")
}
