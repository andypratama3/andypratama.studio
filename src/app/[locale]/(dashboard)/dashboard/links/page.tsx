import { db } from "@/db"
import { links, linkClicks } from "@/db/schema"
import { desc } from "drizzle-orm"
import { createLink, setLinkActive } from "../../actions"
import { Link2, Plus, MousePointerClick, ExternalLink } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function LinksDashboardPage() {
  let allLinks: (typeof links.$inferSelect)[] = []
  let allClicks: (typeof linkClicks.$inferSelect)[] = []

  try {
    allLinks = await db.select().from(links).orderBy(desc(links.createdAt))
    allClicks = await db.select().from(linkClicks).orderBy(desc(linkClicks.clickedAt))
  } catch (err) {
    console.warn("DB fallback in links page:", err)
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-brand">
          <Link2 className="h-4 w-4" />
          <span>Pengalihan & Pelacakan Kampanye</span>
        </div>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Tautan Pendek & UTM
        </h1>
        <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
          Kelola tautan cepat (/go/slug) untuk pelacakan bio profil TikTok, Instagram, Threads, LinkedIn, dan deskripsi YouTube.
        </p>
      </div>

      {/* Form Buat Tautan Baru */}
      <div className="rounded-xl border border-border bg-card p-5">
        <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
          <Plus className="h-4 w-4 text-brand" />
          <span>Buat Tautan Pendek Baru</span>
        </h2>
        <form action={createLink} className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label className="text-xs font-medium text-muted-foreground">Slug Tautan</label>
            <div className="mt-1 flex items-center rounded-md border border-border bg-background px-3 py-1.5 text-xs text-foreground focus-within:ring-1 focus-within:ring-brand">
              <span className="text-muted-foreground mr-1">/go/</span>
              <input
                name="slug"
                type="text"
                required
                placeholder="promo-dualbrand"
                className="w-full bg-transparent focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground">Platform Target</label>
            <select
              name="platform"
              className="mt-1 w-full rounded-md border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-brand"
            >
              <option value="threads">Threads</option>
              <option value="tiktok">TikTok</option>
              <option value="instagram">Instagram</option>
              <option value="linkedin">LinkedIn</option>
              <option value="youtube">YouTube</option>
              <option value="email">Email</option>
              <option value="lainnya">Lainnya</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground">Nama Kampanye (UTM)</label>
            <input
              name="campaign"
              type="text"
              placeholder="bio, post-video1, launch"
              className="mt-1 w-full rounded-md border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-brand"
            />
          </div>

          <div className="sm:col-span-2 lg:col-span-4">
            <label className="text-xs font-medium text-muted-foreground">URL Tujuan Lengkap</label>
            <input
              name="destination"
              type="url"
              required
              placeholder="https://andypratama.studio/start?utm_source=tiktok&utm_medium=organic..."
              className="mt-1 w-full rounded-md border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-brand"
            />
          </div>

          <div className="flex items-end sm:col-span-2 lg:col-span-4">
            <button
              type="submit"
              className="rounded-md bg-brand px-4 py-1.5 text-xs font-medium text-brand-foreground hover:bg-brand/90 transition-colors"
            >
              Simpan Tautan
            </button>
          </div>
        </form>
      </div>

      {/* Tabel Tautan Terdaftar */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="flex items-center justify-between border-b border-border p-4">
          <div className="text-xs font-semibold text-foreground">
            Daftar Tautan Terdaftar ({allLinks.length})
          </div>
          <span className="text-[11px] text-muted-foreground">
            Privasi terlindungi: analitik klik tidak mencatat IP mentah atau data pribadi.
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-border bg-muted/40 font-medium text-muted-foreground">
              <tr>
                <th className="p-3">Slug</th>
                <th className="p-3">Platform</th>
                <th className="p-3">Kampanye</th>
                <th className="p-3">Status</th>
                <th className="p-3">Tujuan</th>
                <th className="p-3 text-right">Total Klik</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {allLinks.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-muted-foreground">
                    Belum ada tautan. Jalankan seed database atau buat tautan di atas.
                  </td>
                </tr>
              ) : (
                allLinks.map((l) => {
                  const clickCount = allClicks.filter((c) => c.linkId === l.id).length
                  return (
                    <tr key={l.id} className="hover:bg-muted/20">
                      <td className="p-3 font-mono font-semibold text-brand">
                        /go/{l.slug}
                      </td>
                      <td className="p-3 uppercase text-[10px]">{l.platform ?? "-"}</td>
                      <td className="p-3 text-muted-foreground">{l.campaign ?? "-"}</td>
                      <td className="p-3">
                        <form
                          action={async () => {
                            "use server"
                            await setLinkActive(l.id, !l.active)
                          }}
                        >
                          <button
                            type="submit"
                            className={`rounded px-2 py-0.5 text-[10px] font-medium ${l.active ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300" : "bg-muted text-muted-foreground"}`}
                          >
                            {l.active ? "Aktif" : "Nonaktif"}
                          </button>
                        </form>
                      </td>
                      <td className="p-3 max-w-sm truncate text-muted-foreground font-mono text-[11px]">
                        <a
                          href={l.destination}
                          target="_blank"
                          rel="noreferrer"
                          className="hover:underline flex items-center gap-1"
                        >
                          <span className="truncate">{l.destination}</span>
                          <ExternalLink className="h-3 w-3 shrink-0" />
                        </a>
                      </td>
                      <td className="p-3 text-right font-mono font-bold text-foreground">
                        <span className="inline-flex items-center gap-1">
                          <MousePointerClick className="h-3 w-3 text-muted-foreground" />
                          {clickCount}
                        </span>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
