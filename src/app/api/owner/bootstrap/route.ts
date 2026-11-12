import { timingSafeEqual } from "node:crypto"
import { NextResponse } from "next/server"
import { eq } from "drizzle-orm"
import { z } from "zod"

import { db } from "@/db"
import { user } from "@/db/schema"
import { auth } from "@/lib/auth"

const bodySchema = z.object({
  name: z.string().min(1).max(120),
  password: z.string().min(10).max(200),
})

function safeEqual(a: string, b: string): boolean {
  const left = Buffer.from(a)
  const right = Buffer.from(b)
  if (left.length !== right.length) return false
  return timingSafeEqual(left, right)
}

/**
 * One-time owner creation. Disabled unless OWNER_SETUP_TOKEN is set.
 * Public sign-up stays closed; only the owner email is accepted.
 */
export async function POST(request: Request) {
  const expected = process.env.OWNER_SETUP_TOKEN
  if (!expected || expected.length < 16) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  const provided = request.headers.get("x-bootstrap-token") ?? ""
  if (!safeEqual(provided, expected)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const email = (process.env.OWNER_EMAIL ?? "").trim().toLowerCase()
  if (!email) {
    return NextResponse.json(
      { error: "OWNER_EMAIL is not configured" },
      { status: 500 }
    )
  }

  const existing = await db
    .select({ id: user.id })
    .from(user)
    .where(eq(user.email, email))
    .limit(1)

  if (existing.length > 0) {
    return NextResponse.json(
      { error: "Owner account already exists" },
      { status: 409 }
    )
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 })
  }

  const parsed = bodySchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid body", details: parsed.error.issues },
      { status: 400 }
    )
  }

  try {
    const created = await auth.api.signUpEmail({
      body: {
        email,
        name: parsed.data.name,
        password: parsed.data.password,
      },
    })

    return NextResponse.json({
      ok: true,
      userId: created.user?.id ?? null,
      email,
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Sign-up failed"
    return NextResponse.json({ error: message }, { status: 400 })
  }
}
