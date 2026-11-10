export interface OperationalAdvice {
  id: string
  type: "info" | "warning" | "action"
  title: string
  description: string
  metricOrTarget?: string
}

export interface MetricSummary {
  applications: number
  outreach: number
  productVisits: number
  sales: number
}

/**
 * Generates deterministic weekly and daily operational advice based on hardcoded rules.
 * Does NOT call any LLM or external API.
 */
export function generateOperationalAdvice(metrics: MetricSummary): OperationalAdvice[] {
  const advice: OperationalAdvice[] = []

  // Rule 1: Application volume pace (Target: 9 per week)
  if (metrics.applications < 3) {
    advice.push({
      id: "app-pace",
      type: "action",
      title: "Tingkatkan Volume Lamaran Karier",
      description: `Baru ${metrics.applications} dari target 9 lamaran terkirim. Jadwalkan 3 pengiriman di sesi malam ini.`,
      metricOrTarget: `${metrics.applications}/9 lamaran`,
    })
  } else if (metrics.applications >= 9) {
    advice.push({
      id: "app-done",
      type: "info",
      title: "Target Lamaran Mingguan Tercapai",
      description: "Fokus bergeser ke persiapan materi teknis dan tindak lanjut wawancara.",
      metricOrTarget: `${metrics.applications}/9 lamaran`,
    })
  }

  // Rule 2: Outreach / DM pipeline (Target: 30 per week)
  if (metrics.outreach < 15) {
    advice.push({
      id: "outreach-pace",
      type: "warning",
      title: "Pipeline Distribusi Masih Rendah",
      description: `Tercatat ${metrics.outreach} outreach (target 30/minggu). Alokasikan 45 menit di sesi pagi untuk menjangkau 5 agensi/sekolah.`,
      metricOrTarget: `${metrics.outreach}/30 kontak`,
    })
  } else {
    advice.push({
      id: "outreach-healthy",
      type: "info",
      title: "Aktivitas Distribusi Sehat",
      description: "Monitor tingkat balasan dan segera catat respon ke tahapan diskusi.",
      metricOrTarget: `${metrics.outreach}/30 kontak`,
    })
  }

  // Rule 3: Product traffic vs sales conversion
  if (metrics.productVisits > 50 && metrics.sales === 0) {
    advice.push({
      id: "sales-conversion",
      type: "warning",
      title: "Optimasi Konversi Demo ke Checkout",
      description: "Kunjungan produk sudah melampaui 50 sesi tanpa penjualan. Periksa kejelasan tombol CTA di halaman DualBrand.",
      metricOrTarget: `${metrics.sales} penjualan dari ${metrics.productVisits} kunjungan`,
    })
  }

  return advice
}
