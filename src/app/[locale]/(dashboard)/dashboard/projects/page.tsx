import { db } from "@/db"
import { projects, siteSettings } from "@/db/schema"
import { desc, eq } from "drizzle-orm"
import { updateProjectStage, updateSakolentraChecklist } from "../../actions"
import { FolderGit2, CheckCircle2, Circle, AlertCircle } from "lucide-react"

export const dynamic = "force-dynamic"

const projectStages = [
  "ide",
  "validasi",
  "bangun",
  "pilot",
  "jalan",
  "arsip",
] as const

type ProjectStage = (typeof projectStages)[number]

const sakolentraChecklistItems = [
  { id: "multi_tenant", label: "Konfigurasi isolasi data multi-sekolah (schema/tenant logic)" },
  { id: "midtrans_snap", label: "Integrasi modul pembayaran Midtrans (Snap & Webhook notification)" },
  { id: "wa_billing", label: "Pengiriman otomatis rincian tagihan & kuitansi via WhatsApp" },
  { id: "bank_recon", label: "Rekonsiliasi mutasi bank harian & status lunas otomatis" },
  { id: "export_report", label: "Export laporan keuangan bulanan (PDF / Excel) untuk yayasan" },
  { id: "roles_perms", label: "Role & hak akses bertingkat: Admin, Bendahara, Wali Kelas, Wali Murid" },
  { id: "waba_verify", label: "Pemeriksaan nomor pengirim WhatsApp Business terverifikasi (WABA API)" },
  { id: "sla_compliance", label: "Draft SLA layanan & perlindungan privasi data siswa (UU PDP)" },
  { id: "excel_migration", label: "Script impor & migrasi data siswa dari spreadsheet TU" },
  { id: "sop_handbook", label: "Buku panduan operasional staf TU & SOP penanganan gagal bayar" },
  { id: "dummy_e2e_test", label: "Simulasi pembayaran dummy end-to-end tanpa error" },
  { id: "backup_dr", label: "Prosedur backup harian terenkripsi & disaster recovery VPS" },
]

export default async function ProjectsDashboardPage() {
  let allProjects: (typeof projects.$inferSelect)[] = []
  let checklistState: Record<string, boolean> = {
    midtrans_snap: true,
    wa_billing: true,
    bank_recon: true,
    export_report: true,
    dummy_e2e_test: true,
  }

  try {
    allProjects = await db.select().from(projects).orderBy(desc(projects.createdAt))
    const checklistRow = await db
      .select()
      .from(siteSettings)
      .where(eq(siteSettings.key, "sakolentra_pilot_checklist"))
      .limit(1)

    if (checklistRow.length > 0 && checklistRow[0].value) {
      checklistState = checklistRow[0].value as Record<string, boolean>
    }
  } catch (err) {
    console.warn("DB fallback in projects page:", err)
  }

  const completedCount = sakolentraChecklistItems.filter(
    (item) => checklistState[item.id]
  ).length

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-brand">
          <FolderGit2 className="h-4 w-4" />
          <span>Inisiatif & Roadmap</span>
        </div>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Pipeline Proyek
        </h1>
        <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
          Pantau 4 inisiatif utama (DualBrand, SAKOLENTRA, Paket Midtrans + WA, dan Seri Konten) serta daftar kesiapan pilot.
        </p>
      </div>

      {/* Projects Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {allProjects.map((proj) => (
          <div
            key={proj.id}
            className="flex flex-col justify-between rounded-xl border border-border bg-card p-5"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="rounded bg-muted px-2 py-0.5 text-[10px] font-semibold uppercase text-muted-foreground">
                  Jenis: {proj.kind}
                </span>
                <span className="rounded-full bg-brand/10 px-2.5 py-0.5 text-[10px] font-bold text-brand uppercase">
                  Tahap: {proj.stage}
                </span>
              </div>

              <h2 className="mt-3 text-lg font-bold text-foreground">{proj.name}</h2>
              <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
                {proj.summary}
              </p>

              {proj.nextStep && (
                <div className="mt-4 rounded-lg border border-border bg-muted/20 p-3 text-xs">
                  <span className="font-semibold text-foreground">Langkah Berikutnya:</span>
                  <p className="mt-0.5 text-muted-foreground">{proj.nextStep}</p>
                </div>
              )}
            </div>

            <div className="mt-6 border-t border-border pt-4">
              <form
                action={async (fd: FormData) => {
                  "use server"
                  const newStage = fd.get("stage") as ProjectStage
                  const nextStep = String(fd.get("nextStep") || "")
                  await updateProjectStage(proj.id, newStage, nextStep || undefined)
                }}
                className="flex items-center gap-2"
              >
                <select
                  name="stage"
                  defaultValue={proj.stage}
                  className="rounded-md border border-border bg-background px-2 py-1 text-xs text-foreground"
                >
                  {projectStages.map((s) => (
                    <option key={s} value={s}>
                      Tahap: {s}
                    </option>
                  ))}
                </select>

                <input
                  name="nextStep"
                  type="text"
                  defaultValue={proj.nextStep ?? ""}
                  placeholder="Perbarui langkah berikutnya..."
                  className="flex-1 rounded-md border border-border bg-background px-2.5 py-1 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-brand"
                />

                <button
                  type="submit"
                  className="rounded-md bg-brand px-3 py-1 text-xs font-medium text-white hover:bg-brand/90"
                >
                  Simpan
                </button>
              </form>
            </div>
          </div>
        ))}
      </div>

      {/* SAKOLENTRA Pilot Readiness Checklist */}
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-4">
          <div>
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-brand" />
              <h2 className="text-base font-bold text-foreground">
                Daftar Periksa Kesiapan Pilot SAKOLENTRA (12 Poin)
              </h2>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Verifikasi kelayakan sebelum menawarkan sistem pembayaran sekolah ke sekolah mitra baru.
            </p>
          </div>
          <div className="rounded-lg bg-brand/10 px-3 py-1.5 text-center text-xs font-semibold text-brand">
            {completedCount} / {sakolentraChecklistItems.length} Siap
          </div>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {sakolentraChecklistItems.map((item, idx) => {
            const isChecked = !!checklistState[item.id]
            return (
              <div
                key={item.id}
                className="flex items-start justify-between gap-3 rounded-lg border border-border bg-muted/20 p-3 text-xs"
              >
                <div className="flex items-start gap-2.5">
                  <span className="text-[11px] font-mono text-muted-foreground">
                    {String(idx + 1).padStart(2, "0")}.
                  </span>
                  <span
                    className={`leading-snug ${
                      isChecked
                        ? "line-through text-muted-foreground"
                        : "font-medium text-foreground"
                    }`}
                  >
                    {item.label}
                  </span>
                </div>

                <form
                  action={async () => {
                    "use server"
                    await updateSakolentraChecklist(item.id, !isChecked)
                  }}
                >
                  <button
                    type="submit"
                    className="shrink-0 p-0.5 text-muted-foreground hover:text-foreground"
                    title={isChecked ? "Tandai belum siap" : "Tandai sudah siap"}
                  >
                    {isChecked ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    ) : (
                      <Circle className="h-4 w-4 text-muted-foreground" />
                    )}
                  </button>
                </form>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
