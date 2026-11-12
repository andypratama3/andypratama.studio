import { NextResponse } from "next/server"
import { z } from "zod"
import { unsubscribeNewsletter } from "@/lib/newsletter"

const querySchema = z.object({
  token: z.string().min(1).max(256),
})

export async function GET(request: Request) {
  const url = new URL(request.url)
  const base = new URL("/newsletter", request.url)

  const parsed = querySchema.safeParse({ token: url.searchParams.get("token") })
  if (!parsed.success) {
    return NextResponse.redirect(new URL("/newsletter?state=invalid", base))
  }

  const email = await unsubscribeNewsletter(parsed.data.token)
  if (!email) {
    return NextResponse.redirect(new URL("/newsletter?state=invalid", base))
  }

  return NextResponse.redirect(new URL("/newsletter?state=unsubscribed", base))
}
