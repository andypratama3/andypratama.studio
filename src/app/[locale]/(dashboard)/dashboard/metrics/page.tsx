import { db } from "@/db"
import { metricsDaily } from "@/db/schema"
import { desc } from "drizzle-orm"
import { recordMetric } from "../../actions"
import { BarChart3, Plus } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function MetricsPage() {
  let allMetrics: (typeof metricsDaily.$inferSelect)[] = []
  try {
    allMetrics = await db.select().from(metricsDaily).orderBy(desc(metricsDaily.date))
  } catch (err) {
    console.warn("DB fallback in metrics page:", err)
  }

  // Calculate totals
  const totals: Record<string, number> = {}
  for (const m of allMetrics) {
    totals[m.metric] = (totals[m.metric] || 0) + Number(m.value)
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-brand">
          <BarChart3 className="h-4 w-4" />
          <span>Analitik & Pelacakan Kinerja</span>
        </div>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Metrik Harian
        </h1>
        <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
          Pencatatan metrik manual atau terimpor dari platform (kunjungan, klik beli, penjualan, DM, dan lamaran).
        </p>
      </div>

      {/* Metric Cards Summary */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="text-xs text-muted-foreground">Kunjungan Produk</div>
          <div className="mt-2 text-2xl font-bold text-foreground">
            {totals["kunjungan_produk"] ?? 0}
          </div>
          <div className="mt-1 text-[11px] text-muted-foreground">Traffic DualBrand</div>
        </div>

        <div className="rounded-xl border border-border bg-card p-4">
          <div className="text-xs text-muted-foreground">Klik Beli (Checkout)</div>
          <div className="mt-2 text-2xl font-bold text-foreground">
            {totals["klik_beli"] ?? 0}
          </div>
          <div className="mt-1 text-[11px] text-muted-foreground">Lynk.id / Gumroad clicks</div>
        </div>

        <div className="rounded-xl border border-border bg-card p-4">
          <div className="text-xs text-muted-foreground">Total Penjualan</div>
          <div className="mt-2 text-2xl font-bold text-emerald-600 dark:text-emerald-400">
            {totals["penjualan"] ?? 0}
          </div>
          <div className="mt-1 text-[11px] text-muted-foreground">Unit terkonfirmasi</div>
        </div>

        <div className="rounded-xl border border-border bg-card p-4">
          <div className="text-xs text-muted-foreground">Outreach / DM</div>
          <div className="mt-2 text-2xl font-bold text-foreground">
            {totals["dm"] ?? 0}
          </div>
          <div className="mt-1 text-[11px] text-muted-foreground">Target 30 kontak</div>
        </div>

        <div className="rounded-xl border border-border bg-card p-4">
          <div className="text-xs text-muted-foreground">Lamaran Terkirim</div>
          <div className="mt-2 text-2xl font-bold text-foreground">
            {totals["lamaran"] ?? 0}
          </div>
          <div className="mt-1 text-[11px] text-muted-foreground">Target 9 lamaran</div>
        </div>
      </div>

      {/* Form Input Metrik Harian */}
      <div className="rounded-xl border border-border bg-card p-5">
        <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
          <Plus className="h-4 w-4 text-brand" />
          <span>Input Entri Metrik Baru</span>
        </h2>
        <form action={recordMetric} className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <div>
            <label className="text-xs font-medium text-muted-foreground">Tanggal</label>
            <input
              name="date"
              type="date"
              required
              defaultValue={new Date().toISOString().split("T")[0]}
              className="mt-1 w-full rounded-md border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-brand"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground">Platform</label>
            <select
              name="platform"
              className="mt-1 w-full rounded-md border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-brand"
            >
              <option value="all">Semua / Global (All)</option>
              <option value="gumroad">Gumroad</option>
              <option value="lynk">Lynk.id</option>
              <option value="website">Website</option>
              <option value="linkedin">LinkedIn</option>
              <option value="tiktok">TikTok</option>
              <option value="instagram">Instagram</option>
              <option value="threads">Threads</option>
              <option value="youtube">YouTube</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground">Nama Metrik</label>
            <select
              name="metric"
              className="mt-1 w-full rounded-md border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-brand"
            >
              <option value="kunjungan_produk">kunjungan_produk</option>
              <option value="klik_beli">klik_beli</option>
              <option value="penjualan">penjualan</option>
              <option value="dm">dm (outreach)</option>
              <option value="lamaran">lamaran (karier)</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground">Nilai</label>
            <input
              name="value"
              type="number"
              step="any"
              required
              placeholder="Contoh: 15"
              className="mt-1 w-full rounded-md border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-brand"
            />
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              className="w-full rounded-md bg-brand px-4 py-1.5 text-xs font-medium text-white hover:bg-brand/90 transition-colors"
            >
              Simpan Metrik
            </button>
          </div>
        </form>
      </div>

      {/* Tabel Riwayat Metrik */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="flex items-center justify-between border-b border-border p-4">
          <div className="text-xs font-semibold text-foreground">
            Riwayat Entri Metrik Harian ({allMetrics.length} Catatan)
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-border bg-muted/40 font-medium text-muted-foreground">
              <tr>
                <th className="p-3">Tanggal</th>
                <th className="p-3">Platform</th>
                <th className="p-3">Metrik</th>
                <th className="p-3">Nilai</th>
                <th className="p-3">Sumber</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {allMetrics.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-muted-foreground">
                    Belum ada data metrik. Impor CSV atau input di atas.
                  </td>
                </tr>
              ) : (
                allMetrics.map((m) => (
                  <tr key={m.id} className="hover:bg-muted/20">
                    <td className="p-3 font-mono text-muted-foreground">{m.date}</td>
                    <td className="p-3 uppercase text-[10px]">{m.platform}</td>
                    <td className="p-3 font-medium text-foreground">{m.metric}</td>
                    <td className="p-3 font-mono font-semibold">{m.value}</td>
                    <td className="p-3">
                      <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">
                        {m.source}
                      </span>
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
