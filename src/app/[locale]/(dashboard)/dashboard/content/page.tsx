import { db } from "@/db"
import { contentItems } from "@/db/schema"
import { desc } from "drizzle-orm"
import { createContentItem, updateContentStatus } from "../../actions"
import { FileText, Plus, Video } from "lucide-react"

export const dynamic = "force-dynamic"

const contentStatuses = [
  "ide",
  "naskah",
  "produksi",
  "terjadwal",
  "tayang",
] as const

type ContentStatus = (typeof contentStatuses)[number]

export default async function ContentPage() {
  let allContent: (typeof contentItems.$inferSelect)[] = []
  try {
    allContent = await db.select().from(contentItems).orderBy(desc(contentItems.createdAt))
  } catch (err) {
    console.warn("DB fallback in content page:", err)
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-brand">
          <FileText className="h-4 w-4" />
          <span>Strategi & Kalender Konten</span>
        </div>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Konten & Publikasi
        </h1>
        <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
          Alur produksi konten multi-platform: 2 video intro/pendek dan 1 catatan mingguan per minggu.
        </p>
      </div>

      {/* Form Tambah Ide Konten */}
      <div className="rounded-xl border border-border bg-card p-5">
        <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
          <Plus className="h-4 w-4 text-brand" />
          <span>Tambah Rencana Konten Baru</span>
        </h2>
        <form action={createContentItem} className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="sm:col-span-2">
            <label className="text-xs font-medium text-muted-foreground">Judul / Topik</label>
            <input
              name="title"
              type="text"
              required
              placeholder="Contoh: Mengapa multi-subbrand lebih sulit dari dugaan"
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
              <option value="youtube">YouTube</option>
              <option value="website">Website / Journal</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground">Format</label>
            <select
              name="format"
              className="mt-1 w-full rounded-md border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-brand"
            >
              <option value="video">Video (45s–90s)</option>
              <option value="post">Post Singkat</option>
              <option value="carousel">Carousel Slide</option>
              <option value="artikel">Artikel Mendalam</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground">Seri Konten</label>
            <select
              name="series"
              className="mt-1 w-full rounded-md border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-brand"
            >
              <option value="build_in_public">Build in Public</option>
              <option value="production_notes">Production Notes (1 Win 1 Problem)</option>
              <option value="remotion_tips">Remotion / Next.js Tips</option>
              <option value="case_study">Case Study SAKOLENTRA</option>
              <option value="lainnya">Lainnya</option>
            </select>
          </div>

          <div className="sm:col-span-2 lg:col-span-3">
            <label className="text-xs font-medium text-muted-foreground">Hook / Kalimat Pembuka (3 detik pertama)</label>
            <input
              name="hook"
              type="text"
              placeholder="Contoh: Ini yang terjadi ketika satu database melayani 3 brand berbeda..."
              className="mt-1 w-full rounded-md border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-brand"
            />
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              className="w-full rounded-md bg-brand px-4 py-1.5 text-xs font-medium text-white hover:bg-brand/90 transition-colors"
            >
              Simpan Ide
            </button>
          </div>
        </form>
      </div>

      {/* Content Pipeline Columns */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {contentStatuses.map((status) => {
          const items = allContent.filter((c) => c.status === status)
          return (
            <div
              key={status}
              className="flex flex-col rounded-xl border border-border bg-card p-3"
            >
              <div className="flex items-center justify-between border-b border-border pb-2 text-xs">
                <span className="font-semibold uppercase tracking-wider text-foreground">
                  {status}
                </span>
                <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-bold">
                  {items.length}
                </span>
              </div>

              <div className="mt-3 flex-1 space-y-2">
                {items.length === 0 ? (
                  <p className="py-4 text-center text-[11px] text-muted-foreground">
                    Tidak ada item
                  </p>
                ) : (
                  items.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-lg border border-border bg-muted/20 p-2.5 text-xs space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="rounded bg-muted px-1.5 py-0.5 text-[9px] font-medium uppercase">
                          {item.platform}
                        </span>
                        {item.format === "video" && (
                          <Video className="h-3 w-3 text-brand" />
                        )}
                      </div>

                      <div className="font-semibold text-foreground leading-snug">
                        {item.title}
                      </div>

                      {item.hook && (
                        <p className="text-[11px] text-muted-foreground italic line-clamp-2">
                          &ldquo;{item.hook}&rdquo;
                        </p>
                      )}

                      <div className="border-t border-border pt-1.5">
                        <form
                          action={async (fd: FormData) => {
                            "use server"
                            const nextStatus = fd.get("nextStatus") as ContentStatus
                            await updateContentStatus(item.id, nextStatus)
                          }}
                          className="flex items-center gap-1"
                        >
                          <select
                            name="nextStatus"
                            defaultValue={item.status}
                            className="w-full rounded border border-border bg-background px-1 py-0.5 text-[9px]"
                          >
                            {contentStatuses.map((s) => (
                              <option key={s} value={s}>
                                → {s}
                              </option>
                            ))}
                          </select>
                          <button
                            type="submit"
                            className="rounded bg-muted px-2 py-0.5 text-[9px] font-medium hover:bg-muted/80"
                          >
                            Set
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
  )
}
