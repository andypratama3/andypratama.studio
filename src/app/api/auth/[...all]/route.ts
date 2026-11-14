import { NextResponse } from "next/server"
import { toNextJsHandler } from "better-auth/next-js"

import { auth, isAuthConfigured } from "@/lib/auth"

const handler = toNextJsHandler(auth.handler)

/**
 * Production without credentials must fail closed with a clear status instead
 * of the better-auth default-secret error.
 */
function notConfigured() {
  return NextResponse.json(
    { error: "Auth is not configured on this deployment." },
    { status: 503 }
  )
}

export async function GET(request: Request) {
  if (!isAuthConfigured()) return notConfigured()
  return handler.GET(request)
}

export async function POST(request: Request) {
  if (!isAuthConfigured()) return notConfigured()
  return handler.POST(request)
}
