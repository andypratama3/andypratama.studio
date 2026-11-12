import { db } from "@/db"
import { products, sales } from "@/db/schema"
import { desc } from "drizzle-orm"
import { createSale, updateProductPrice } from "../../actions"
import { Package, ExternalLink, DollarSign } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function ProductsDashboardPage() {
  let allProducts: (typeof products.$inferSelect)[] = []
  let allSales: (typeof sales.$inferSelect)[] = []

  try {
    allProducts = await db.select().from(products).orderBy(desc(products.createdAt))
    allSales = await db.select().from(sales).orderBy(desc(sales.occurredAt))
  } catch (err) {
    console.warn("DB fallback in products page:", err)
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-brand">
          <Package className="h-4 w-4" />
          <span>Katalog Produk Digital</span>
        </div>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Produk & Penjualan
        </h1>
        <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
          Kelola status produk digital, harga jual USD, serta pantau konversi dan tautan checkout.
        </p>
      </div>

      {/* Daftar Produk */}
      <div className="grid gap-6 md:grid-cols-2">
        {allProducts.length === 0 ? (
          <div className="col-span-2 rounded-xl border border-border bg-card p-8 text-center text-xs text-muted-foreground">
            Belum ada produk terdaftar. Jalankan seed database untuk memuat produk DualBrand.
          </div>
        ) : (
          allProducts.map((p) => {
            const productSales = allSales.filter((s) => s.productId === p.id)
            const totalGross = productSales.reduce((acc, s) => acc + (Number(s.grossUsd) || 0), 0)

            return (
              <div
                key={p.id}
                className="flex flex-col justify-between rounded-xl border border-border bg-card p-5 shadow-2xs"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="rounded bg-brand/10 px-2 py-0.5 text-[10px] font-bold text-brand uppercase">
                      {p.status}
                    </span>
                    <span className="text-xs font-mono text-muted-foreground">
                      slug: {p.slug}
                    </span>
                  </div>

                  <h2 className="mt-2 text-lg font-bold text-foreground">{p.name}</h2>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {p.licenseNote ?? "Lisensi komersial satu organisasi"}
                  </p>

                  <div className="mt-4 grid grid-cols-2 gap-3 border-y border-border py-3 text-xs">
                    <div>
                      <span className="text-muted-foreground">Harga Aktif:</span>
                      <div className="font-mono text-base font-bold text-foreground">
                        ${p.priceUsd ?? "—"} USD
                      </div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Total Penjualan:</span>
                      <div className="font-mono text-base font-bold text-emerald-600 dark:text-emerald-400">
                        ${totalGross.toFixed(2)} USD ({productSales.length} unit)
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 space-y-2 text-xs">
                    {p.demoUrl && (
                      <div className="flex items-center justify-between text-muted-foreground">
                        <span>Demo URL:</span>
                        <a
                          href={p.demoUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1 text-brand hover:underline"
                        >
                          Buka Demo <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    )}
                    {p.gumroadUrl && (
                      <div className="flex items-center justify-between text-muted-foreground">
                        <span>Checkout Gumroad:</span>
                        <a
                          href={p.gumroadUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1 text-brand hover:underline truncate max-w-[200px]"
                        >
                          {p.gumroadUrl} <ExternalLink className="h-3 w-3 shrink-0" />
                        </a>
                      </div>
                    )}
                    {p.lynkUrl && (
                      <div className="flex items-center justify-between text-muted-foreground">
                        <span>Checkout Lynk.id:</span>
                        <a
                          href={p.lynkUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1 text-brand hover:underline truncate max-w-[200px]"
                        >
                          {p.lynkUrl} <ExternalLink className="h-3 w-3 shrink-0" />
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                {/* Form Ubah Harga (Owner Action) */}
                <div className="mt-6 border-t border-border pt-4">
                  <form
                    action={async (fd: FormData) => {
                      "use server"
                      const newPrice = String(fd.get("priceUsd") || "").trim()
                      if (newPrice) {
                        await updateProductPrice(p.id, newPrice)
                      }
                    }}
                    className="flex items-center gap-2"
                  >
                    <div className="relative flex-1">
                      <DollarSign className="absolute left-2.5 top-2 h-3.5 w-3.5 text-muted-foreground" />
                      <input
                        name="priceUsd"
                        type="number"
                        step="0.01"
                        defaultValue={p.priceUsd ?? ""}
                        placeholder="Ubah harga..."
                        className="w-full rounded-md border border-border bg-background pl-8 pr-3 py-1 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-brand"
                      />
                    </div>
                    <button
                      type="submit"
                      className="rounded-md bg-brand px-3 py-1 text-xs font-medium text-brand-foreground hover:bg-brand/90 transition-colors whitespace-nowrap"
                    >
                      Perbarui Harga
                    </button>
                  </form>
                  <p className="mt-1.5 text-[10px] text-muted-foreground">
                    Perubahan harga adalah tindakan gerbang persetujuan: agen dilarang mengubah harga tanpa konfirmasi pemilik.
                  </p>

                  <details className="mt-3 rounded-md border border-border bg-muted/20 p-2">
                    <summary className="cursor-pointer text-[11px] font-medium text-foreground">
                      Catat penjualan manual
                    </summary>
                    <form action={createSale} className="mt-2 grid gap-2 sm:grid-cols-2">
                      <input type="hidden" name="productId" value={p.id} />
                      <select
                        name="platform"
                        className="rounded border border-border bg-background px-2 py-1 text-[11px]"
                      >
                        <option value="gumroad">Gumroad</option>
                        <option value="lynk">Lynk.id</option>
                        <option value="etsy">Etsy</option>
                        <option value="payhip">Payhip</option>
                        <option value="direct">Direct</option>
                      </select>
                      <input
                        name="grossUsd"
                        inputMode="decimal"
                        placeholder="Gross USD (mis. 49.00)"
                        className="rounded border border-border bg-background px-2 py-1 text-[11px]"
                      />
                      <input
                        name="externalId"
                        placeholder="ID eksternal (opsional)"
                        className="rounded border border-border bg-background px-2 py-1 text-[11px]"
                      />
                      <input
                        name="referrerUtm"
                        placeholder="UTM (opsional)"
                        className="rounded border border-border bg-background px-2 py-1 text-[11px]"
                      />
                      <button
                        type="submit"
                        className="rounded bg-brand px-3 py-1 text-[11px] font-medium text-brand-foreground hover:bg-brand/90 sm:col-span-2"
                      >
                        Simpan penjualan
                      </button>
                    </form>
                  </details>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
