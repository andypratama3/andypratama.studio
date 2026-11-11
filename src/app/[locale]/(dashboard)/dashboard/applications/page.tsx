import { db } from "@/db"
import { applications } from "@/db/schema"
import { desc } from "drizzle-orm"
import { createApplication, updateApplicationStatus } from "../../actions"
import { Briefcase, Plus, Filter, Calendar } from "lucide-react"

export const dynamic = "force-dynamic"

const statuses = [
  "terkirim",
  "balasan",
  "wawancara",
  "tes",
  "tawaran",
  "ditolak",
  "tidak_ada_kabar",
] as const

type ApplicationStatus = (typeof statuses)[number]

export default async function ApplicationsPage() {
  let allApps: (typeof applications.$inferSelect)[] = []
  try {
    allApps = await db.select().from(applications).orderBy(desc(applications.createdAt))
  } catch (err) {
    console.warn("DB fallback in applications page:", err)
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-brand">
          <Briefcase className="h-4 w-4" />
          <span>Pipeline Karier</span>
        </div>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Lamaran Kerja
        </h1>
        <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
          Target 9 lamaran/minggu (Tech Lead, Senior Fullstack, Solution Architect). Pantau proses rekrutmen dan tanggal tindak lanjut.
        </p>
      </div>

      {/* Form Tambah Lamaran */}
      <div className="rounded-xl border border-border bg-card p-5">
        <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
          <Plus className="h-4 w-4 text-brand" />
          <span>Catat Lamaran Baru</span>
        </h2>
        <form action={createApplication} className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label className="text-xs font-medium text-muted-foreground">Perusahaan</label>
            <input
              name="company"
              type="text"
              required
              placeholder="Contoh: FinTech Global Ltd"
              className="mt-1 w-full rounded-md border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-brand"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground">Posisi / Peran</label>
            <input
              name="role"
              type="text"
              required
              placeholder="Contoh: Senior Fullstack Engineer"
              className="mt-1 w-full rounded-md border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-brand"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground">Kanal Lamaran</label>
            <input
              name="channel"
              type="text"
              placeholder="LinkedIn, Wellfound, Direct Email"
              className="mt-1 w-full rounded-md border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-brand"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground">URL Lowongan / Lamaran</label>
            <input
              name="url"
              type="url"
              placeholder="https://..."
              className="mt-1 w-full rounded-md border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-brand"
            />
          </div>

          <div className="sm:col-span-2 lg:col-span-3">
            <label className="text-xs font-medium text-muted-foreground">Catatan / Detail Tambahan</label>
            <input
              name="notes"
              type="text"
              placeholder="Contoh: Dikirim via recruiter di LinkedIn, resume v2"
              className="mt-1 w-full rounded-md border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-brand"
            />
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              className="w-full rounded-md bg-brand px-4 py-1.5 text-xs font-medium text-brand-foreground hover:bg-brand/90 transition-colors"
            >
              Simpan Lamaran
            </button>
          </div>
        </form>
      </div>

      {/* Tabel Lamaran */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="flex items-center justify-between border-b border-border p-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span>Semua Lamaran Aktif ({allApps.length})</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-border bg-muted/40 font-medium text-muted-foreground">
              <tr>
                <th className="p-3">Status</th>
                <th className="p-3">Perusahaan</th>
                <th className="p-3">Peran</th>
                <th className="p-3">Kanal</th>
                <th className="p-3">Tanggal Kirim</th>
                <th className="p-3">Tindak Lanjut</th>
                <th className="p-3">Catatan</th>
                <th className="p-3 text-right">Ubah Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {allApps.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-muted-foreground">
                    Belum ada lamaran tercatat. Isi form di atas untuk memulai tracking lamaran minggu ini.
                  </td>
                </tr>
              ) : (
                allApps.map((app) => (
                  <tr key={app.id} className="hover:bg-muted/20">
                    <td className="p-3 whitespace-nowrap">
                      <span
                        className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                          app.status === "tawaran"
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                            : app.status === "wawancara" || app.status === "tes"
                            ? "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                            : app.status === "ditolak"
                            ? "bg-red-500/10 text-red-600 dark:text-red-400"
                            : app.status === "balasan"
                            ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {app.status}
                      </span>
                    </td>
                    <td className="p-3 font-semibold text-foreground">{app.company}</td>
                    <td className="p-3 text-foreground">{app.role}</td>
                    <td className="p-3 text-muted-foreground">{app.channel ?? "-"}</td>
                    <td className="p-3 text-muted-foreground whitespace-nowrap">
                      {app.sentAt
                        ? new Date(app.sentAt).toLocaleDateString("id-ID")
                        : "-"}
                    </td>
                    <td className="p-3 text-muted-foreground whitespace-nowrap">
                      {app.followUpAt ? (
                        <span className="flex items-center gap-1 text-amber-500 font-medium">
                          <Calendar className="h-3 w-3" />
                          {new Date(app.followUpAt).toLocaleDateString("id-ID")}
                        </span>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td className="p-3 text-muted-foreground max-w-xs truncate">
                      {app.notes ?? "-"}
                    </td>
                    <td className="p-3 text-right whitespace-nowrap">
                      <form
                        action={async (fd: FormData) => {
                          "use server"
                          const newStatus = fd.get("newStatus") as ApplicationStatus
                          await updateApplicationStatus(app.id, newStatus)
                        }}
                        className="inline-flex items-center gap-1"
                      >
                        <select
                          name="newStatus"
                          defaultValue={app.status}
                          className="rounded border border-border bg-background px-1.5 py-0.5 text-[10px]"
                        >
                          {statuses.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                        <button
                          type="submit"
                          className="rounded bg-muted px-2 py-0.5 text-[10px] font-medium hover:bg-muted/80"
                        >
                          Ubah
                        </button>
                      </form>
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
