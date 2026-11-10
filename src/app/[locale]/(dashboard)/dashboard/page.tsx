import { db } from "@/db"
import { agentTasks, applications, leads, metricsDaily, tasks } from "@/db/schema"
import { eq, desc } from "drizzle-orm"
import { generateOperationalAdvice } from "@/lib/rules"
import { updateTaskStatus, resolveAgentTask } from "../actions"
import {
  Calendar,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Lightbulb,
  ArrowUpRight,
  TrendingUp,
  Target,
} from "lucide-react"
import Link from "next/link"

export const dynamic = "force-dynamic"

export default async function DashboardTodayPage() {
  let allTasks: (typeof tasks.$inferSelect)[] = []
  let pendingApprovals: (typeof agentTasks.$inferSelect)[] = []
  let totalApps = 0
  let totalLeads = 0
  let totalVisits = 0
  let totalSales = 0

  try {
    allTasks = await db.select().from(tasks).orderBy(desc(tasks.createdAt))
    pendingApprovals = await db
      .select()
      .from(agentTasks)
      .where(eq(agentTasks.status, "butuh_persetujuan"))

    const appRows = await db.select().from(applications)
    totalApps = appRows.length

    const leadRows = await db.select().from(leads)
    totalLeads = leadRows.length

    const metricRows = await db.select().from(metricsDaily)
    for (const m of metricRows) {
      if (m.metric === "kunjungan_produk") totalVisits += Number(m.value) || 0
      if (m.metric === "penjualan") totalSales += Number(m.value) || 0
    }
  } catch (err) {
    console.warn("Database fallback in dashboard page:", err)
  }

  const adviceList = generateOperationalAdvice({
    applications: totalApps,
    outreach: totalLeads,
    productVisits: totalVisits,
    sales: totalSales,
  })

  const pagiTasks = allTasks.filter((t) => t.session === "pagi")
  const siangTasks = allTasks.filter((t) => t.session === "siang")
  const malamTasks = allTasks.filter((t) => t.session === "malam")

  return (
    <div className="space-y-8">
      {/* Page Title & Intro */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-brand">
          <Calendar className="h-4 w-4" />
          <span>Fokus Harian</span>
        </div>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Hari Ini
        </h1>
        <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
          Alokasi 3 sesi harian, gerbang persetujuan agen, dan kecepatan target mingguan.
        </p>
      </div>

      {/* Target Mingguan Progress Bar */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-border bg-card p-4 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Target Lamaran</span>
            <Target className="h-4 w-4 text-brand" />
          </div>
          <div className="mt-2 text-2xl font-bold tracking-tight">
            {totalApps} <span className="text-xs font-normal text-muted-foreground">/ 9 minggu ini</span>
          </div>
          <div className="mt-2 h-1.5 w-full rounded-full bg-muted overflow-hidden">
            <div
              className="h-full bg-brand rounded-full transition-all"
              style={{ width: `${Math.min(100, (totalApps / 9) * 100)}%` }}
            />
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-4 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Target Outreach/DM</span>
            <TrendingUp className="h-4 w-4 text-brand" />
          </div>
          <div className="mt-2 text-2xl font-bold tracking-tight">
            {totalLeads} <span className="text-xs font-normal text-muted-foreground">/ 30 kontak</span>
          </div>
          <div className="mt-2 h-1.5 w-full rounded-full bg-muted overflow-hidden">
            <div
              className="h-full bg-brand rounded-full transition-all"
              style={{ width: `${Math.min(100, (totalLeads / 30) * 100)}%` }}
            />
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-4 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Kunjungan Produk</span>
            <ArrowUpRight className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="mt-2 text-2xl font-bold tracking-tight">{totalVisits}</div>
          <p className="mt-2 text-[11px] text-muted-foreground">
            Total sesi halaman DualBrand
          </p>
        </div>

        <div className="rounded-xl border border-border bg-card p-4 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Penjualan</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="mt-2 text-2xl font-bold tracking-tight">
            {totalSales} <span className="text-xs font-normal text-muted-foreground">unit</span>
          </div>
          <p className="mt-2 text-[11px] text-muted-foreground">
            Gumroad & Lynk.id terverifikasi
          </p>
        </div>
      </div>

      {/* Pending Approval Gates (if any) */}
      {pendingApprovals.length > 0 && (
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-5">
          <div className="flex items-center gap-2 text-amber-500">
            <AlertTriangle className="h-5 w-5" />
            <h2 className="text-sm font-semibold">
              Butuh Persetujuan Pemilik ({pendingApprovals.length} Tindakan Tertahan)
            </h2>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Agen AI mengusulkan tindakan di gerbang persetujuan kritis. Konfirmasi tindakan di bawah:
          </p>
          <div className="mt-4 space-y-3">
            {pendingApprovals.map((ap) => (
              <div
                key={ap.id}
                className="flex flex-col gap-3 rounded-lg border border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-amber-500/20 px-2 py-0.5 text-[10px] font-semibold text-amber-600 dark:text-amber-400">
                      {ap.approvalGate ?? "Persetujuan"}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(ap.createdAt).toLocaleDateString("id-ID")}
                    </span>
                  </div>
                  <p className="mt-1 text-xs font-medium text-foreground sm:text-sm">
                    {ap.summary}
                  </p>
                  {ap.evidence && (
                    <p className="mt-1 text-xs text-muted-foreground font-mono">
                      Bukti: {ap.evidence}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <form
                    action={async () => {
                      "use server"
                      await resolveAgentTask(ap.id, "setujui")
                    }}
                  >
                    <button
                      type="submit"
                      className="rounded-md bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-700"
                    >
                      Setujui
                    </button>
                  </form>
                  <form
                    action={async () => {
                      "use server"
                      await resolveAgentTask(ap.id, "tolak")
                    }}
                  >
                    <button
                      type="submit"
                      className="rounded-md border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted"
                    >
                      Tolak
                    </button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3 Sesi Hari Ini */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-foreground">
            Struktur 3 Sesi Hari Ini
          </h2>
          <Link
            href="/dashboard/tasks"
            className="text-xs font-medium text-brand hover:underline"
          >
            Kelola Semua Tugas →
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Sesi Pagi */}
          <div className="flex flex-col rounded-xl border border-border bg-card p-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <div className="text-xs font-bold text-foreground">Sesi Pagi</div>
                <div className="text-[11px] text-muted-foreground">08:00 – 11:30 (Deep Work)</div>
              </div>
              <Clock className="h-4 w-4 text-brand" />
            </div>
            <div className="mt-3 flex-1 space-y-2">
              {pagiTasks.length === 0 ? (
                <p className="py-6 text-center text-xs text-muted-foreground">
                  Belum ada tugas pagi terjadwal.
                </p>
              ) : (
                pagiTasks.map((t) => (
                  <TaskCard key={t.id} task={t} />
                ))
              )}
            </div>
          </div>

          {/* Sesi Siang */}
          <div className="flex flex-col rounded-xl border border-border bg-card p-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <div className="text-xs font-bold text-foreground">Sesi Siang</div>
                <div className="text-[11px] text-muted-foreground">13:00 – 16:30 (Produksi & Eksekusi)</div>
              </div>
              <Clock className="h-4 w-4 text-amber-500" />
            </div>
            <div className="mt-3 flex-1 space-y-2">
              {siangTasks.length === 0 ? (
                <p className="py-6 text-center text-xs text-muted-foreground">
                  Belum ada tugas siang terjadwal.
                </p>
              ) : (
                siangTasks.map((t) => (
                  <TaskCard key={t.id} task={t} />
                ))
              )}
            </div>
          </div>

          {/* Sesi Malam */}
          <div className="flex flex-col rounded-xl border border-border bg-card p-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <div className="text-xs font-bold text-foreground">Sesi Malam</div>
                <div className="text-[11px] text-muted-foreground">19:30 – 21:30 (Karier & Review)</div>
              </div>
              <Clock className="h-4 w-4 text-indigo-500" />
            </div>
            <div className="mt-3 flex-1 space-y-2">
              {malamTasks.length === 0 ? (
                <p className="py-6 text-center text-xs text-muted-foreground">
                  Belum ada tugas malam terjadwal.
                </p>
              ) : (
                malamTasks.map((t) => (
                  <TaskCard key={t.id} task={t} />
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Saran Sistem Deterministik */}
      <div className="rounded-xl border border-border bg-card p-5">
        <div className="flex items-center gap-2">
          <Lightbulb className="h-4 w-4 text-brand" />
          <h2 className="text-xs font-semibold uppercase tracking-wider text-foreground">
            Saran Operasional Sistem
          </h2>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {adviceList.map((adv) => (
            <div
              key={adv.id}
              className="rounded-lg border border-border bg-muted/30 p-3.5 text-xs"
            >
              <div className="font-semibold text-foreground">{adv.title}</div>
              <p className="mt-1 text-muted-foreground">{adv.description}</p>
              {adv.metricOrTarget && (
                <div className="mt-2 text-[10px] font-mono text-brand">
                  {adv.metricOrTarget}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function TaskCard({ task }: { task: typeof tasks.$inferSelect }) {
  const isDone = task.status === "selesai"
  return (
    <div className="flex items-start justify-between gap-2 rounded-lg border border-border bg-muted/20 p-2.5 text-xs">
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium text-foreground">
            {task.lane}
          </span>
          {task.durationMin && (
            <span className="text-[10px] text-muted-foreground">
              {task.durationMin}m
            </span>
          )}
        </div>
        <p
          className={`mt-1 font-medium leading-snug ${
            isDone ? "line-through text-muted-foreground" : "text-foreground"
          }`}
        >
          {task.title}
        </p>
      </div>
      <form
        action={async () => {
          "use server"
          const next = isDone ? "belum" : "selesai"
          await updateTaskStatus(task.id, next)
        }}
      >
        <button
          type="submit"
          className={`shrink-0 rounded p-1 transition-colors ${
            isDone
              ? "text-emerald-500 hover:text-emerald-600"
              : "text-muted-foreground hover:text-foreground"
          }`}
          title={isDone ? "Tandai belum selesai" : "Tandai selesai"}
        >
          <CheckCircle2 className="h-4 w-4" />
        </button>
      </form>
    </div>
  )
}
