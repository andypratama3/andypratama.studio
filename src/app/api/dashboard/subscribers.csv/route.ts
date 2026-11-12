import { NextResponse } from "next/server"
import { desc } from "drizzle-orm"

import { db } from "@/db"
import { subscribers } from "@/db/schema"
import { getOwnerSession } from "@/lib/auth"

export const dynamic = "force-dynamic"

function csvCell(value: string | null): string {
  if (!value) return ""
  return /[",\n\r]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value
}

function iso(value: Date | null): string {
  return value ? value.toISOString() : ""
}

/** Owner-only subscriber export. Never includes token hashes. */
export async function GET() {
  const session = await getOwnerSession()
  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  const rows = await db
    .select({
      email: subscribers.email,
      locale: subscribers.locale,
      status: subscribers.status,
      createdAt: subscribers.createdAt,
      confirmedAt: subscribers.confirmedAt,
      sourceUtm: subscribers.sourceUtm,
    })
    .from(subscribers)
    .orderBy(desc(subscribers.createdAt))

  const header = [
    "email",
    "locale",
    "status",
    "created_at",
    "confirmed_at",
    "source_utm",
  ]

  const lines = [header.join(",")]
  for (const row of rows) {
    lines.push(
      [
        csvCell(row.email),
        csvCell(row.locale),
        csvCell(row.status),
        csvCell(iso(row.createdAt)),
        csvCell(iso(row.confirmedAt)),
        csvCell(row.sourceUtm),
      ].join(",")
    )
  }

  const body = `${lines.join("\r\n")}\r\n`
  const stamp = new Date().toISOString().slice(0, 10)

  return new NextResponse(body, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="subscribers-${stamp}.csv"`,
      "Cache-Control": "no-store",
    },
  })
}
