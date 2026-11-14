import { NextResponse, type NextRequest } from "next/server"
import { randomUUID } from "node:crypto"
import { db } from "@/db"
import { agentMessages, agentTasks } from "@/db/schema"
import { desc } from "drizzle-orm"
import { z } from "zod"

import { authenticateAgent, agentCanWrite } from "@/lib/agent-auth"
import { rateLimit } from "@/lib/rate-limit"

const agentTaskSchema = z.object({
  agentSlug: z.string().min(2),
  taskId: z.string().optional(),
  summary: z.string().min(3),
  evidence: z.string().optional(),
  approvalGate: z
    .enum([
      "ubah_harga",
      "deploy",
      "publish",
      "kirim_pesan",
      "hapus_data",
      "ubah_facts",
    ])
    .optional(),
})

function unauthorized(message: string) {
  return NextResponse.json({ error: message }, { status: 401 })
}

export async function GET(request: NextRequest) {
  const agent = await authenticateAgent(request)
  if (!agent) {
    return unauthorized("Akses ditolak: API key agen tidak valid.")
  }

  const limited = rateLimit(`agent-get:${agent.id}`, 60, 60_000)
  if (!limited.ok) {
    return NextResponse.json(
      { error: "Terlalu banyak permintaan." },
      {
        status: 429,
        headers: { "Retry-After": String(limited.retryAfterSec) },
      }
    )
  }

  try {
    const list = await db
      .select()
      .from(agentTasks)
      .orderBy(desc(agentTasks.createdAt))
      .limit(50)

    return NextResponse.json({ tasks: list, agent: agent.slug })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Gagal mengambil tugas agen."
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const agent = await authenticateAgent(request)
  if (!agent) {
    return unauthorized("Akses ditolak: API key agen tidak valid.")
  }

  if (!agentCanWrite(agent, "tasks")) {
    return NextResponse.json(
      { error: `Agen '${agent.slug}' tidak memiliki izin menulis tugas.` },
      { status: 403 }
    )
  }

  const limited = rateLimit(`agent-post:${agent.id}`, 30, 60_000)
  if (!limited.ok) {
    return NextResponse.json(
      { error: "Terlalu banyak permintaan." },
      {
        status: 429,
        headers: { "Retry-After": String(limited.retryAfterSec) },
      }
    )
  }

  try {
    const body: unknown = await request.json()
    const parsed = agentTaskSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Payload tidak valid", details: parsed.error.issues },
        { status: 400 }
      )
    }

    const { agentSlug, taskId, summary, evidence, approvalGate } = parsed.data

    if (agentSlug !== agent.slug) {
      return NextResponse.json(
        { error: "API key tidak cocok dengan agen yang diklaim." },
        { status: 403 }
      )
    }

    const needsApproval = Boolean(approvalGate)
    const status = needsApproval ? "butuh_persetujuan" : "selesai"

    const id = randomUUID()
    await db.insert(agentTasks).values({
      id,
      agentId: agent.id,
      taskId: taskId || null,
      summary,
      evidence: evidence || null,
      approvalGate: approvalGate || null,
      status,
      approvedAt: status === "selesai" ? new Date() : null,
    })

    await db.insert(agentMessages).values({
      fromAgentId: agent.id,
      agentTaskId: id,
      body: `Task logged: ${summary}`,
    })

    return NextResponse.json(
      {
        id,
        agent: agent.slug,
        status,
        message: needsApproval
          ? "Tindakan tertahan di gerbang persetujuan. Menunggu konfirmasi pemilik."
          : "Tugas agen berhasil dicatat dan diselesaikan.",
      },
      { status: 201 }
    )
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Gagal memproses tugas agen."
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
