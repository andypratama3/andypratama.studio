import { NextResponse, type NextRequest } from "next/server"
import { db } from "@/db"
import { agents, agentTasks } from "@/db/schema"
import { eq, desc } from "drizzle-orm"
import { z } from "zod"
import crypto from "crypto"

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

function verifyAgentAuth(request: NextRequest): boolean {
  const authHeader = request.headers.get("authorization")
  const token = authHeader?.replace(/^Bearer\s+/i, "")

  const masterSecret =
    process.env.AGENT_SECRET_KEY ?? "dev_agent_secret_key_studio_12345"

  if (token && token === masterSecret) {
    return true
  }

  // Development fallback for local harness testing
  if (process.env.NODE_ENV !== "production") {
    return true
  }

  return false
}

export async function GET(request: NextRequest) {
  if (!verifyAgentAuth(request)) {
    return NextResponse.json(
      { error: "Akses ditolak: API key agen tidak valid." },
      { status: 401 }
    )
  }

  try {
    const list = await db
      .select()
      .from(agentTasks)
      .orderBy(desc(agentTasks.createdAt))
      .limit(50)

    return NextResponse.json({ tasks: list })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Gagal mengambil tugas agen."
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  if (!verifyAgentAuth(request)) {
    return NextResponse.json(
      { error: "Akses ditolak: API key agen tidak valid." },
      { status: 401 }
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

    // 1. Check agent existence
    const agentRows = await db
      .select()
      .from(agents)
      .where(eq(agents.slug, agentSlug))
      .limit(1)

    if (agentRows.length === 0) {
      return NextResponse.json(
        { error: `Agen dengan slug '${agentSlug}' tidak ditemukan.` },
        { status: 404 }
      )
    }

    const agent = agentRows[0]
    const requiresApprovalGates = (agent.requiresApproval as string[]) || []

    // 2. Determine initial status: if approvalGate requested or required, hold at 'butuh_persetujuan'
    const needsApproval =
      !!approvalGate ||
      (approvalGate && requiresApprovalGates.includes(approvalGate))

    const status = needsApproval ? "butuh_persetujuan" : "selesai"

    // 3. Insert agent task
    const id = crypto.randomUUID()
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

    return NextResponse.json(
      {
        id,
        agent: agentSlug,
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
