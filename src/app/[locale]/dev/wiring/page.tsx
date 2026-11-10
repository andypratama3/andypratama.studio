import { getWiringInventory, type WiringStatus } from "@/lib/wiring"
import { EVENT_NAMES } from "@/lib/events"
import { motionTokens } from "@/lib/motion"
import { WiringClientPanel } from "@/app/[locale]/dev/wiring/wiring-client-panel"

export const dynamic = "force-dynamic"

function statusClass(status: WiringStatus) {
  switch (status) {
    case "ok":
      return "text-foreground"
    case "partial":
      return "text-muted-foreground"
    case "skipped":
      return "text-muted-foreground"
    default:
      return "text-destructive"
  }
}

function statusMark(status: WiringStatus) {
  switch (status) {
    case "ok":
      return "OK"
    case "partial":
      return "PARTIAL"
    case "skipped":
      return "SKIP"
    default:
      return "MISSING"
  }
}

export default function DevWiringPage() {
  const rows = getWiringInventory()

  return (
    <div className="space-y-10">
      <header className="space-y-2">
        <p className="text-label text-muted-foreground">Lampiran D.5</p>
        <h1 className="text-display text-foreground">Plugin wiring</h1>
        <p className="text-body-measure text-muted-foreground">
          Dev-only inventory. Green means installed and used on a real route; red means
          missing. Runtime probes fill <code className="text-foreground">window.__wiring</code>.
        </p>
      </header>

      <section aria-labelledby="inventory-heading" className="space-y-4">
        <h2 id="inventory-heading" className="text-section text-foreground">
          Inventory
        </h2>
        <div className="overflow-x-auto border border-border">
          <table className="w-full min-w-[36rem] text-left text-sm">
            <thead>
              <tr className="border-b border-border text-label text-muted-foreground">
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Plugin</th>
                <th className="px-4 py-3 font-semibold">Detail</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className="border-b border-border/70">
                  <td className={`px-4 py-3 font-semibold tabular-nums ${statusClass(row.status)}`}>
                    {statusMark(row.status)}
                  </td>
                  <td className="px-4 py-3 font-medium text-foreground">{row.label}</td>
                  <td className="px-4 py-3 text-muted-foreground">{row.detail}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section aria-labelledby="tokens-heading" className="space-y-3">
        <h2 id="tokens-heading" className="text-section text-foreground">
          Motion tokens
        </h2>
        <ul className="text-sm text-muted-foreground">
          <li>
            fast {motionTokens.fast}s · base {motionTokens.base}s · slow {motionTokens.slow}s ·
            enterY {motionTokens.enterY}px
          </li>
          <li>ease [{motionTokens.ease.join(", ")}]</li>
        </ul>
      </section>

      <section aria-labelledby="events-heading" className="space-y-3">
        <h2 id="events-heading" className="text-section text-foreground">
          Allowed events
        </h2>
        <p className="text-sm text-muted-foreground">{EVENT_NAMES.join(" · ")}</p>
      </section>

      <WiringClientPanel />
    </div>
  )
}
