import { db } from "@/db"
import { leads, outreachEvents } from "@/db/schema"
import { desc } from "drizzle-orm"
import { createLead, updateLeadDetails, addOutreachEvent } from "../../actions"
import { Users, Plus, MessageSquare, Send } from "lucide-react"

export const dynamic = "force-dynamic"

const stages = [
  { id: "baru", label: "Baru" },
  { id: "dihubungi", label: "Dihubungi" },
  { id: "balas", label: "Balas" },
  { id: "diskusi", label: "Diskusi" },
  { id: "penawaran", label: "Penawaran" },
  { id: "menang", label: "Menang" },
  { id: "kalah", label: "Kalah" },
] as const

const segments = [
  { id: "freelancer", label: "Freelancer" },
  { id: "agency", label: "Agency" },
  { id: "multi_brand", label: "Multi-brand" },
  { id: "sekolah", label: "Sekolah" },
  { id: "perekrut", label: "Perekrut" },
  { id: "lainnya", label: "Lainnya" },
] as const

export default async function LeadsPage() {
  let allLeads: (typeof leads.$inferSelect)[] = []
  let allOutreach: (typeof outreachEvents.$inferSelect)[] = []

  try {
    allLeads = await db.select().from(leads).orderBy(desc(leads.createdAt))
    allOutreach = await db.select().from(outreachEvents).orderBy(desc(outreachEvents.sentAt))
  } catch (err) {
    console.warn("DB fallback in leads page:", err)
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-brand">
          <Users className="h-4 w-4" />
          <span>Pipeline Penjualan & Klien</span>
        </div>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Lead & Distribusi
        </h1>
        <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
          Pantau prospek dari kontak pertama hingga penawaran dan status akhir.
        </p>
      </div>

      {/* Form Tambah Lead Baru */}
      <div className="rounded-xl border border-border bg-card p-5">
        <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
          <Plus className="h-4 w-4 text-brand" />
          <span>Tambah Prospek (Lead) Baru</span>
        </h2>
        <form action={createLead} className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label className="text-xs font-medium text-muted-foreground">Nama / Institusi</label>
            <input
              name="name"
              type="text"
              required
              placeholder="Contoh: Agensi Studio Kreatif"
              className="mt-1 w-full rounded-md border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-brand"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground">Handle / Username</label>
            <input
              name="handle"
              type="text"
              placeholder="@studiokreatif"
              className="mt-1 w-full rounded-md border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-brand"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground">Platform</label>
            <select
              name="platform"
              className="mt-1 w-full rounded-md border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-brand"
            >
              <option value="linkedin">LinkedIn</option>
              <option value="tiktok">TikTok</option>
              <option value="instagram">Instagram</option>
              <option value="threads">Threads</option>
              <option value="email">Email</option>
              <option value="lainnya">Lainnya</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground">Segmen</label>
            <select
              name="segment"
              className="mt-1 w-full rounded-md border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-brand"
            >
              <option value="agency">Agensi Desain/Web</option>
              <option value="multi_brand">Bisnis Multi-brand</option>
              <option value="sekolah">Sekolah / Yayasan</option>
              <option value="freelancer">Freelancer</option>
              <option value="perekrut">Perekrut / HR</option>
              <option value="lainnya">Lainnya</option>
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className="text-xs font-medium text-muted-foreground">URL Profil / Situs</label>
            <input
              name="url"
              type="url"
              placeholder="https://linkedin.com/in/..."
              className="mt-1 w-full rounded-md border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-brand"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="text-xs font-medium text-muted-foreground">Catatan Kebutuhan</label>
            <input
              name="notes"
              type="text"
              placeholder="Contoh: Butuh sistem multi-subbrand untuk 3 klien"
              className="mt-1 w-full rounded-md border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-brand"
            />
          </div>

          <div className="flex items-end sm:col-span-2 lg:col-span-4">
            <button
              type="submit"
              className="rounded-md bg-brand px-4 py-1.5 text-xs font-medium text-brand-foreground hover:bg-brand/90 transition-colors"
            >
              Simpan Lead
            </button>
          </div>
        </form>
      </div>

      {/* 7-Stage Pipeline Board */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-foreground">Pipeline 7 Tahapan</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-7 overflow-x-auto">
          {stages.map((stage) => {
            const stageLeads = allLeads.filter((l) => l.stage === stage.id)
            return (
              <div
                key={stage.id}
                className="flex flex-col rounded-xl border border-border bg-card p-3 min-w-[200px]"
              >
                <div className="flex items-center justify-between border-b border-border pb-2 text-xs">
                  <span className="font-semibold text-foreground">{stage.label}</span>
                  <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-bold">
                    {stageLeads.length}
                  </span>
                </div>

                <div className="mt-3 flex-1 space-y-2">
                  {stageLeads.length === 0 ? (
                    <p className="py-4 text-center text-[11px] text-muted-foreground">
                      Kosong
                    </p>
                  ) : (
                    stageLeads.map((lead) => (
                      <div
                        key={lead.id}
                        className="rounded-lg border border-border bg-muted/20 p-2.5 text-xs space-y-2"
                      >
                        <div>
                          <div className="font-medium text-foreground">{lead.name}</div>
                          {lead.handle && (
                            <div className="text-[11px] text-muted-foreground">
                              {lead.handle} ({lead.platform})
                            </div>
                          )}
                          <span className="mt-1 inline-block rounded bg-muted px-1.5 py-0.5 text-[9px]">
                            {lead.segment}
                          </span>
                        </div>

                        {lead.notes && (
                          <p className="text-[11px] text-muted-foreground italic">
                            {lead.notes}
                          </p>
                        )}

                        {/* Quick Action: Change Stage, Segment, Source UTM */}
                        <div className="border-t border-border pt-2">
                          <form
                            action={updateLeadDetails}
                            className="flex flex-wrap items-center gap-1"
                          >
                            <input type="hidden" name="leadId" value={lead.id} />
                            <select
                              name="stage"
                              defaultValue={lead.stage}
                              aria-label="Stage"
                              className="rounded border border-border bg-background px-1.5 py-0.5 text-[10px]"
                            >
                              {stages.map((s) => (
                                <option key={s.id} value={s.id}>
                                  → {s.label}
                                </option>
                              ))}
                            </select>
                            <select
                              name="segment"
                              defaultValue={lead.segment}
                              aria-label="Segment"
                              className="rounded border border-border bg-background px-1.5 py-0.5 text-[10px]"
                            >
                              {segments.map((s) => (
                                <option key={s.id} value={s.id}>
                                  {s.label}
                                </option>
                              ))}
                            </select>
                            <input
                              name="sourceUtm"
                              defaultValue={lead.sourceUtm ?? ""}
                              placeholder="UTM"
                              aria-label="Source UTM"
                              className="w-20 rounded border border-border bg-background px-1.5 py-0.5 text-[10px]"
                            />
                            <button
                              type="submit"
                              className="rounded bg-muted px-2 py-0.5 text-[10px] font-medium hover:bg-muted/80"
                            >
                              Simpan
                            </button>
                          </form>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Log Outreach Cepat */}
      <div className="rounded-xl border border-border bg-card p-5">
        <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
          <MessageSquare className="h-4 w-4 text-brand" />
          <span>Catat Interaksi Outreach Baru</span>
        </h2>
        <form action={addOutreachEvent} className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label className="text-xs font-medium text-muted-foreground">Pilih Lead</label>
            <select
              name="leadId"
              required
              className="mt-1 w-full rounded-md border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-brand"
            >
              {allLeads.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.name} ({l.platform})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground">Kanal</label>
            <input
              name="channel"
              type="text"
              defaultValue="linkedin"
              className="mt-1 w-full rounded-md border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-brand"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground">Arah Pesan</label>
            <select
              name="direction"
              className="mt-1 w-full rounded-md border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-brand"
            >
              <option value="keluar">Pesan Keluar (Outbound DM)</option>
              <option value="masuk">Pesan Masuk (Inbound / Balasan)</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground">Ringkasan Pesan</label>
            <input
              name="body"
              type="text"
              placeholder="Contoh: Mengirim proposal intro DualBrand"
              className="mt-1 w-full rounded-md border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-brand"
            />
          </div>

          <div className="flex items-end sm:col-span-2 lg:col-span-4">
            <button
              type="submit"
              className="flex items-center gap-2 rounded-md bg-brand px-4 py-1.5 text-xs font-medium text-brand-foreground hover:bg-brand/90 transition-colors"
            >
              <Send className="h-3.5 w-3.5" />
              <span>Simpan Catatan Outreach</span>
            </button>
          </div>
        </form>

        {/* Riwayat Outreach Terakhir */}
        <div className="mt-6 border-t border-border pt-4">
          <div className="text-xs font-semibold text-foreground mb-3">
            Riwayat 5 Pesan Terakhir
          </div>
          <div className="space-y-2">
            {allOutreach.slice(0, 5).map((evt) => (
              <div
                key={evt.id}
                className="flex items-center justify-between rounded-lg border border-border bg-muted/20 px-3 py-2 text-xs"
              >
                <div>
                  <span className="font-semibold capitalize text-foreground mr-2">
                    [{evt.channel} / {evt.direction}]
                  </span>
                  <span className="text-muted-foreground">{evt.body ?? "Tanpa catatan"}</span>
                </div>
                <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                  {new Date(evt.sentAt).toLocaleDateString("id-ID")}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
