import fs from "fs"
import path from "path"
import { db } from "./index"
import { metricsDaily, tasks } from "./schema"
import { and, eq } from "drizzle-orm"

function parseCsv(content: string): Record<string, string>[] {
  const lines = content.trim().split(/\r?\n/)
  if (lines.length < 2) return []
  const headers = lines[0].split(",").map((h) => h.trim())
  const rows: Record<string, string>[] = []

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim()
    if (!line) continue
    const values = line.split(",").map((v) => v.trim())
    const row: Record<string, string> = {}
    headers.forEach((h, idx) => {
      row[h] = values[idx] ?? ""
    })
    rows.push(row)
  }
  return rows
}

export async function importTasksCsv(filePath?: string) {
  const resolved =
    filePath ?? path.join(process.cwd(), "data/andy-minggu1-tugas.csv")
  if (!fs.existsSync(resolved)) {
    console.warn(`⚠️ CSV file not found: ${resolved}`)
    return
  }

  const content = fs.readFileSync(resolved, "utf-8")
  const records = parseCsv(content)
  console.log(`📦 Importing ${records.length} tasks from CSV...`)

  const laneMap: Record<string, "produk" | "video" | "karier" | "distribusi" | "review"> = {
    "produk": "produk",
    "produk (dualbrand)": "produk",
    "video": "video",
    "video intro": "video",
    "karier": "karier",
    "distribusi": "distribusi",
    "review": "review",
  }

  const priorityMap: Record<string, "kritis" | "tinggi" | "fleksibel"> = {
    "kritis": "kritis",
    "tinggi": "tinggi",
    "fleksibel": "fleksibel",
  }

  const sessionMap: Record<string, "pagi" | "siang" | "malam"> = {
    "pagi": "pagi",
    "siang": "siang",
    "malam": "malam",
  }

  const statusMap: Record<string, "belum" | "jalan" | "selesai" | "ditunda"> = {
    "belum": "belum",
    "jalan": "jalan",
    "selesai": "selesai",
    "ditunda": "ditunda",
  }

  for (const row of records) {
    const title = row["Tugas"] || row["title"]
    if (!title) continue

    const plannedDate = row["Tanggal"] || row["plannedDate"] || null
    const session = sessionMap[row["Sesi"]?.toLowerCase()] ?? "pagi"
    const lane = laneMap[row["Jalur"]?.toLowerCase()] ?? "produk"
    const durationMin = parseInt(row["Durasi (menit)"] || row["durationMin"] || "0", 10) || null
    const priority = priorityMap[row["Prioritas"]?.toLowerCase()] ?? "tinggi"
    const status = statusMap[row["Status"]?.toLowerCase()] ?? "belum"
    const doneCriteria = row["Hasil selesai"] || row["doneCriteria"] || null

    const existing = await db
      .select({ id: tasks.id })
      .from(tasks)
      .where(and(eq(tasks.title, title), plannedDate ? eq(tasks.plannedDate, plannedDate) : undefined))
      .limit(1)

    if (existing.length === 0) {
      await db.insert(tasks).values({
        title,
        plannedDate,
        session,
        lane,
        durationMin,
        priority,
        status,
        doneCriteria,
      })
      console.log(`  ✓ Inserted task: ${title}`)
    } else {
      await db
        .update(tasks)
        .set({
          session,
          lane,
          durationMin,
          priority,
          status,
          doneCriteria,
        })
        .where(eq(tasks.id, existing[0].id))
      console.log(`  ✓ Updated task: ${title}`)
    }
  }
}

export async function importMetricsCsv(filePath?: string) {
  const resolved =
    filePath ?? path.join(process.cwd(), "data/andy-minggu1-metrik.csv")
  if (!fs.existsSync(resolved)) {
    console.warn(`⚠️ CSV file not found: ${resolved}`)
    return
  }

  const content = fs.readFileSync(resolved, "utf-8")
  const records = parseCsv(content)
  console.log(`📦 Importing ${records.length} metrics from CSV...`)

  for (const row of records) {
    const date = row["Tanggal"] || row["date"]
    const platform = (row["Platform"] || row["platform"] || "all") as "all"
    const metric = row["Metrik"] || row["metric"]
    const value = row["Nilai"] || row["value"] || "0"
    const source = (row["Sumber"] || row["source"] || "import") as "import"

    if (!date || !metric) continue

    const existing = await db
      .select({ id: metricsDaily.id })
      .from(metricsDaily)
      .where(
        and(
          eq(metricsDaily.date, date),
          eq(metricsDaily.platform, platform),
          eq(metricsDaily.metric, metric)
        )
      )
      .limit(1)

    if (existing.length === 0) {
      await db.insert(metricsDaily).values({
        date,
        platform,
        metric,
        value,
        source,
      })
      console.log(`  ✓ Inserted metric: ${date} ${metric}=${value}`)
    } else {
      await db
        .update(metricsDaily)
        .set({ value, source })
        .where(eq(metricsDaily.id, existing[0].id))
      console.log(`  ✓ Updated metric: ${date} ${metric}=${value}`)
    }
  }
}

export async function importAllCsv() {
  await importTasksCsv()
  await importMetricsCsv()
  console.log("✅ All CSV imports completed.")
}

