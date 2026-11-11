import { db } from "@/db"
import { siteSettings, subscribers } from "@/db/schema"
import { desc, eq } from "drizzle-orm"
import { updateSiteSetting } from "../../actions"
import { facts, type FactStatus } from "@/content/facts"
import { Settings, Users, Save } from "lucide-react"

export const dynamic = "force-dynamic"

interface AvailabilityVal {
  status: "open" | "limited" | "closed"
  noteEn: string
  noteId: string
}

interface ReplyTimeVal {
  en: string
  id: string
}

export default async function SettingsDashboardPage() {
  let availability: AvailabilityVal = {
    status: "open",
    noteEn: "Open for Q1 projects and advisory roles",
    noteId: "Terbuka untuk proyek Q1 dan peran penasihat",
  }

  let replyTime: ReplyTimeVal = {
    en: "Usually responds within 24 hours on weekdays",
    id: "Biasanya membalas dalam 24 jam pada hari kerja",
  }

  let allSubscribers: (typeof subscribers.$inferSelect)[] = []

  try {
    const availRow = await db
      .select()
      .from(siteSettings)
      .where(eq(siteSettings.key, "availability"))
      .limit(1)
    if (availRow.length > 0 && availRow[0].value) {
      availability = availRow[0].value as AvailabilityVal
    }

    const replyRow = await db
      .select()
      .from(siteSettings)
      .where(eq(siteSettings.key, "reply_time"))
      .limit(1)
    if (replyRow.length > 0 && replyRow[0].value) {
      replyTime = replyRow[0].value as ReplyTimeVal
    }

    allSubscribers = await db
      .select()
      .from(subscribers)
      .orderBy(desc(subscribers.createdAt))
  } catch (err) {
    console.warn("DB fallback in settings page:", err)
  }

  // Count facts status
  const factsList = Object.entries(facts)
  const statedCount = factsList.filter(([, f]) => (f.status as FactStatus) === "stated").length
  const verifiedCount = factsList.filter(([, f]) => (f.status as FactStatus) === "verified").length
  const unverifiedCount = factsList.filter(([, f]) => (f.status as FactStatus) === "unverified").length

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-brand">
          <Settings className="h-4 w-4" />
          <span>Konfigurasi & Pengaturan Situs</span>
        </div>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Pengaturan Studio
        </h1>
        <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
          Kelola ketersediaan publik, estimasi balas pesan, pantau integritas facts.ts, dan kelola subscriber newsletter.
        </p>
      </div>

      {/* Grid Konfigurasi */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Form Ketersediaan Proyek */}
        <div className="rounded-xl border border-border bg-card p-5">
          <h2 className="text-sm font-semibold text-foreground">
            Status Ketersediaan Publik (Availability Badge)
          </h2>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Ditampilkan di badge ketersediaan FloatingNav & Footer publik.
          </p>

          <form
            action={async (fd: FormData) => {
              "use server"
              const status = fd.get("status") as "open" | "limited" | "closed"
              const noteEn = String(fd.get("noteEn") || "").trim()
              const noteId = String(fd.get("noteId") || "").trim()
              await updateSiteSetting("availability", { status, noteEn, noteId })
            }}
            className="mt-4 space-y-3"
          >
            <div>
              <label className="text-xs font-medium text-muted-foreground">Status</label>
              <select
                name="status"
                defaultValue={availability.status}
                className="mt-1 w-full rounded-md border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-brand"
              >
                <option value="open">Open (Terbuka untuk proyek)</option>
                <option value="limited">Limited (Slot terbatas)</option>
                <option value="closed">Closed (Penuh / Tidak menerima proyek)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-medium text-muted-foreground">Catatan Teks (English)</label>
              <input
                name="noteEn"
                type="text"
                defaultValue={availability.noteEn}
                className="mt-1 w-full rounded-md border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-brand"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-muted-foreground">Catatan Teks (Indonesia)</label>
              <input
                name="noteId"
                type="text"
                defaultValue={availability.noteId}
                className="mt-1 w-full rounded-md border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-brand"
              />
            </div>

            <button
              type="submit"
              className="flex items-center gap-1.5 rounded-md bg-brand px-3.5 py-1.5 text-xs font-medium text-brand-foreground hover:bg-brand/90"
            >
              <Save className="h-3.5 w-3.5" />
              <span>Simpan Ketersediaan</span>
            </button>
          </form>
        </div>

        {/* Form Estimasi Balas Pesan */}
        <div className="rounded-xl border border-border bg-card p-5">
          <h2 className="text-sm font-semibold text-foreground">
            Estimasi Waktu Balas Pesan (/start)
          </h2>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Teks yang muncul di halaman kontak kanonik saat prospek mengisi formulir.
          </p>

          <form
            action={async (fd: FormData) => {
              "use server"
              const en = String(fd.get("en") || "").trim()
              const id = String(fd.get("id") || "").trim()
              await updateSiteSetting("reply_time", { en, id })
            }}
            className="mt-4 space-y-3"
          >
            <div>
              <label className="text-xs font-medium text-muted-foreground">Teks Balas (English)</label>
              <input
                name="en"
                type="text"
                defaultValue={replyTime.en}
                className="mt-1 w-full rounded-md border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-brand"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-muted-foreground">Teks Balas (Indonesia)</label>
              <input
                name="id"
                type="text"
                defaultValue={replyTime.id}
                className="mt-1 w-full rounded-md border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-brand"
              />
            </div>

            <button
              type="submit"
              className="flex items-center gap-1.5 rounded-md bg-brand px-3.5 py-1.5 text-xs font-medium text-brand-foreground hover:bg-brand/90"
            >
              <Save className="h-3.5 w-3.5" />
              <span>Simpan Waktu Balas</span>
            </button>
          </form>
        </div>
      </div>

      {/* Integritas facts.ts */}
      <div className="rounded-xl border border-border bg-card p-5">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div>
            <h2 className="text-sm font-semibold text-foreground">
              Integritas & Status Fakta (src/content/facts.ts)
            </h2>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Semua angka publik harus berasal dari file fakta. Angka dengan status unverified otomatis ditolak oleh komponen &lt;Fact /&gt;.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="rounded bg-emerald-500/10 px-2 py-0.5 font-bold text-emerald-600 dark:text-emerald-400">
              {verifiedCount} Verified
            </span>
            <span className="rounded bg-brand/10 px-2 py-0.5 font-bold text-brand">
              {statedCount} Stated
            </span>
            <span className="rounded bg-muted px-2 py-0.5 font-bold text-muted-foreground">
              {unverifiedCount} Unverified
            </span>
          </div>
        </div>

        <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {factsList.map(([key, item]) => (
            <div
              key={key}
              className="flex items-center justify-between rounded-lg border border-border bg-muted/20 p-2.5 text-xs"
            >
              <div>
                <span className="font-mono font-semibold text-foreground">{key}</span>
                <div className="text-[11px] text-muted-foreground">
                  Nilai: {item.value || "(kosong/belum ada data)"}
                </div>
              </div>
              <span
                className={`rounded px-1.5 py-0.5 text-[9px] font-bold uppercase ${
                  (item.status as FactStatus) === "verified"
                    ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                    : item.status === "stated"
                    ? "bg-brand/20 text-brand"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {item.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Subscriber Newsletter Manager */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="flex items-center justify-between border-b border-border p-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
            <Users className="h-4 w-4 text-brand" />
            <span>Manajemen Subscriber Newsletter ({allSubscribers.length})</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-border bg-muted/40 font-medium text-muted-foreground">
              <tr>
                <th className="p-3">Email</th>
                <th className="p-3">Status</th>
                <th className="p-3">Bahasa</th>
                <th className="p-3">Sumber UTM</th>
                <th className="p-3">Tanggal Terdaftar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {allSubscribers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-6 text-center text-muted-foreground">
                    Belum ada subscriber newsletter terdaftar.
                  </td>
                </tr>
              ) : (
                allSubscribers.map((sub) => (
                  <tr key={sub.id} className="hover:bg-muted/20">
                    <td className="p-3 font-medium text-foreground">{sub.email}</td>
                    <td className="p-3">
                      <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] capitalize">
                        {sub.status}
                      </span>
                    </td>
                    <td className="p-3 uppercase text-[10px]">{sub.locale}</td>
                    <td className="p-3 text-muted-foreground">{sub.sourceUtm ?? "-"}</td>
                    <td className="p-3 text-muted-foreground whitespace-nowrap">
                      {new Date(sub.createdAt).toLocaleDateString("id-ID")}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
