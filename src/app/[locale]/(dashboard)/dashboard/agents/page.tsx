import { db } from "@/db"
import { agents, agentTasks } from "@/db/schema"
import { desc } from "drizzle-orm"
import { resolveAgentTask } from "../../actions"
import { Bot, Shield, Clock } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function AgentsDashboardPage() {
  let allAgents: (typeof agents.$inferSelect)[] = []
  let allAgentTasks: (typeof agentTasks.$inferSelect)[] = []

  try {
    allAgents = await db.select().from(agents).orderBy(agents.slug)
    allAgentTasks = await db.select().from(agentTasks).orderBy(desc(agentTasks.createdAt))
  } catch (err) {
    console.warn("DB fallback in agents page:", err)
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-brand">
          <Bot className="h-4 w-4" />
          <span>Sistem Otonom & Delegasi</span>
        </div>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Roster Agen AI
        </h1>
        <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
          Struktur 6 peran operasional dengan batas kewenangan (canWrite) dan gerbang persetujuan pemilik (requiresApproval).
        </p>
      </div>

      {/* Roster Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {allAgents.map((ag) => (
          <div
            key={ag.id}
            className="flex flex-col justify-between rounded-xl border border-border bg-card p-5"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] text-muted-foreground">
                  slug: {ag.slug}
                </span>
                <span
                  className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-bold ${
                    ag.slug === "owner"
                      ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                      : "bg-brand/10 text-brand"
                  }`}
                >
                  <Shield className="h-2.5 w-2.5" />
                  {ag.slug === "owner" ? "Pemilik" : "Agen AI"}
                </span>
              </div>

              <h2 className="mt-2 text-base font-bold text-foreground">
                {ag.displayName}
              </h2>
              <p className="text-xs font-medium text-brand">{ag.role}</p>

              <div className="mt-3 text-xs text-muted-foreground leading-relaxed">
                <span className="font-semibold text-foreground">Ruang Lingkup:</span> {ag.scope}
              </div>

              {/* Hak Tulis */}
              <div className="mt-3 text-xs">
                <span className="font-semibold text-foreground">Hak Tulis:</span>
                <div className="mt-1 flex flex-wrap gap-1">
                  {(ag.canWrite as string[]).map((w) => (
                    <span
                      key={w}
                      className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground"
                    >
                      {w}
                    </span>
                  ))}
                </div>
              </div>

              {/* Gerbang Persetujuan */}
              <div className="mt-3 text-xs">
                <span className="font-semibold text-foreground">Gerbang Wajib Persetujuan:</span>
                <div className="mt-1 flex flex-wrap gap-1">
                  {(ag.requiresApproval as string[]).length === 0 ? (
                    <span className="text-[10px] text-muted-foreground">Tidak ada</span>
                  ) : (
                    (ag.requiresApproval as string[]).map((req) => (
                      <span
                        key={req}
                        className="rounded bg-amber-500/15 px-1.5 py-0.5 text-[10px] font-mono text-amber-600 dark:text-amber-400"
                      >
                        {req}
                      </span>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Antrian Tugas Agen */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="flex items-center justify-between border-b border-border p-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
            <Clock className="h-4 w-4 text-brand" />
            <span>Riwayat & Antrian Tugas Agen ({allAgentTasks.length})</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-border bg-muted/40 font-medium text-muted-foreground">
              <tr>
                <th className="p-3">Status</th>
                <th className="p-3">Ringkasan Tugas</th>
                <th className="p-3">Bukti / Evidence</th>
                <th className="p-3">Gerbang</th>
                <th className="p-3">Waktu</th>
                <th className="p-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {allAgentTasks.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-muted-foreground">
                    Belum ada antrian tugas agen. Agen dapat memposting via API /api/agent/tasks.
                  </td>
                </tr>
              ) : (
                allAgentTasks.map((task) => (
                  <tr key={task.id} className="hover:bg-muted/20">
                    <td className="p-3 whitespace-nowrap">
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                          task.status === "selesai"
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                            : task.status === "butuh_persetujuan"
                            ? "bg-amber-500/15 text-amber-600 dark:text-amber-400"
                            : task.status === "ditolak"
                            ? "bg-red-500/10 text-red-600 dark:text-red-400"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {task.status}
                      </span>
                    </td>
                    <td className="p-3 font-medium text-foreground max-w-sm truncate">
                      {task.summary}
                    </td>
                    <td className="p-3 font-mono text-muted-foreground max-w-xs truncate">
                      {task.evidence ?? "-"}
                    </td>
                    <td className="p-3 font-mono text-[10px]">
                      {task.approvalGate ?? "-"}
                    </td>
                    <td className="p-3 text-muted-foreground whitespace-nowrap">
                      {new Date(task.createdAt).toLocaleDateString("id-ID")}
                    </td>
                    <td className="p-3 text-right whitespace-nowrap">
                      {task.status === "butuh_persetujuan" && (
                        <div className="flex items-center justify-end gap-1.5">
                          <form
                            action={async () => {
                              "use server"
                              await resolveAgentTask(task.id, "setujui")
                            }}
                          >
                            <button
                              type="submit"
                              className="rounded bg-emerald-600 px-2 py-0.5 text-[10px] font-medium text-white hover:bg-emerald-700"
                            >
                              Setujui
                            </button>
                          </form>
                          <form
                            action={async () => {
                              "use server"
                              await resolveAgentTask(task.id, "tolak")
                            }}
                          >
                            <button
                              type="submit"
                              className="rounded border border-border px-2 py-0.5 text-[10px] font-medium text-muted-foreground hover:bg-muted"
                            >
                              Tolak
                            </button>
                          </form>
                        </div>
                      )}
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
