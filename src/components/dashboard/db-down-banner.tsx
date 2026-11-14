import { AlertTriangle } from "lucide-react"

/** Owner-only warning when the dashboard is rendering fallback data. */
export function DbDownBanner() {
  return (
    <div
      role="status"
      className="mb-4 flex items-start gap-2.5 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-xs text-destructive"
    >
      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
      <span>
        Database tidak terhubung. Daftar di bawah berasal dari fallback kosong dan perubahan tidak
        akan tersimpan sampai koneksi pulih.
      </span>
    </div>
  )
}
