import { db } from "@/db"
import { tasks } from "@/db/schema"
import { desc } from "drizzle-orm"
import { createTask, updateTaskStatus } from "../../actions"
import { CheckSquare, Plus, Filter } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function TasksPage() {
  let allTasks: (typeof tasks.$inferSelect)[] = []
  try {
    allTasks = await db.select().from(tasks).orderBy(desc(tasks.createdAt))
  } catch (err) {
    console.warn("DB fallback in tasks page:", err)
  }

  return (
    <div className="space-y-8">
      {/* Page Title */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-brand">
            <CheckSquare className="h-4 w-4" />
            <span>Eksekusi Operasional</span>
          </div>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Daftar Tugas
          </h1>
          <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
            Manajemen tugas terstruktur berdasarkan jalur, sesi, dan kriteria selesai.
          </p>
        </div>
      </div>

      {/* Form Tambah Tugas Baru */}
      <div className="rounded-xl border border-border bg-card p-5">
        <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
          <Plus className="h-4 w-4 text-brand" />
          <span>Tambah Tugas Baru</span>
        </h2>
        <form action={createTask} className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="sm:col-span-2">
            <label className="text-xs font-medium text-muted-foreground">Judul Tugas</label>
            <input
              name="title"
              type="text"
              required
              placeholder="Contoh: Buat draft naskah video 45s"
              className="mt-1 w-full rounded-md border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-brand"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground">Jalur</label>
            <select
              name="lane"
              className="mt-1 w-full rounded-md border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-brand"
            >
              <option value="produk">Produk (DualBrand)</option>
              <option value="video">Video Intro</option>
              <option value="karier">Karier</option>
              <option value="distribusi">Distribusi</option>
              <option value="review">Review</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground">Sesi</label>
            <select
              name="session"
              className="mt-1 w-full rounded-md border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-brand"
            >
              <option value="pagi">Pagi (08:00 - 11:30)</option>
              <option value="siang">Siang (13:00 - 16:30)</option>
              <option value="malam">Malam (19:30 - 21:30)</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground">Prioritas</label>
            <select
              name="priority"
              className="mt-1 w-full rounded-md border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-brand"
            >
              <option value="kritis">Kritis</option>
              <option value="tinggi">Tinggi</option>
              <option value="fleksibel">Fleksibel</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground">Durasi (Menit)</label>
            <input
              name="durationMin"
              type="number"
              placeholder="60"
              className="mt-1 w-full rounded-md border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-brand"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="text-xs font-medium text-muted-foreground">Kriteria Selesai (Acceptance Criteria)</label>
            <input
              name="doneCriteria"
              type="text"
              placeholder="Contoh: Script disetujui, siap direkam"
              className="mt-1 w-full rounded-md border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-brand"
            />
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              className="w-full rounded-md bg-brand px-4 py-1.5 text-xs font-medium text-brand-foreground hover:bg-brand/90 transition-colors"
            >
              Simpan Tugas
            </button>
          </div>
        </form>
      </div>

      {/* Tabel Tugas */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="flex items-center justify-between border-b border-border p-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span>Semua Tugas Terdaftar ({allTasks.length})</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-border bg-muted/40 font-medium text-muted-foreground">
              <tr>
                <th className="p-3">Status</th>
                <th className="p-3">Judul</th>
                <th className="p-3">Jalur</th>
                <th className="p-3">Sesi</th>
                <th className="p-3">Prioritas</th>
                <th className="p-3">Durasi</th>
                <th className="p-3">Kriteria Selesai</th>
                <th className="p-3 text-right">Ubah Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {allTasks.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-muted-foreground">
                    Belum ada tugas. Buat tugas baru di atas atau jalankan impor CSV.
                  </td>
                </tr>
              ) : (
                allTasks.map((t) => (
                  <tr key={t.id} className="hover:bg-muted/20">
                    <td className="p-3 whitespace-nowrap">
                      <span
                        className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                          t.status === "selesai"
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                            : t.status === "jalan"
                            ? "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                            : t.status === "ditunda"
                            ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {t.status}
                      </span>
                    </td>
                    <td className="p-3 font-medium text-foreground max-w-xs truncate">
                      {t.title}
                    </td>
                    <td className="p-3 whitespace-nowrap">
                      <span className="rounded bg-muted px-1.5 py-0.5 text-[10px]">
                        {t.lane}
                      </span>
                    </td>
                    <td className="p-3 capitalize whitespace-nowrap">{t.session}</td>
                    <td className="p-3 whitespace-nowrap">
                      <span
                        className={`text-[10px] font-semibold ${
                          t.priority === "kritis"
                            ? "text-red-500"
                            : t.priority === "tinggi"
                            ? "text-amber-500"
                            : "text-muted-foreground"
                        }`}
                      >
                        {t.priority}
                      </span>
                    </td>
                    <td className="p-3 whitespace-nowrap text-muted-foreground">
                      {t.durationMin ? `${t.durationMin}m` : "-"}
                    </td>
                    <td className="p-3 text-muted-foreground max-w-xs truncate">
                      {t.doneCriteria ?? "-"}
                    </td>
                    <td className="p-3 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <form
                          action={async () => {
                            "use server"
                            await updateTaskStatus(t.id, "jalan")
                          }}
                        >
                          <button
                            type="submit"
                            title="Tandai sedang jalan"
                            className="rounded px-2 py-1 text-[10px] border border-border hover:bg-muted"
                          >
                            Jalan
                          </button>
                        </form>
                        <form
                          action={async () => {
                            "use server"
                            await updateTaskStatus(t.id, "selesai")
                          }}
                        >
                          <button
                            type="submit"
                            title="Tandai selesai"
                            className="rounded px-2 py-1 text-[10px] bg-emerald-600 text-white hover:bg-emerald-700"
                          >
                            Selesai
                          </button>
                        </form>
                      </div>
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
