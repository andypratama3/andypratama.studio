import "server-only"
import { eq } from "drizzle-orm"
import { z } from "zod"

import { db } from "@/db"
import { siteSettings } from "@/db/schema"

export const availabilitySchema = z.object({
  status: z.enum(["open_fulltime", "open_project", "closed"]),
  noteEn: z.string().max(280).default(""),
  noteId: z.string().max(280).default(""),
})

export type Availability = z.infer<typeof availabilitySchema>

/** Public availability note from site_settings, or null when unset/invalid/DB down. */
export async function getAvailabilityNote(
  locale: string
): Promise<string | null> {
  try {
    const rows = await db
      .select({ value: siteSettings.value })
      .from(siteSettings)
      .where(eq(siteSettings.key, "availability"))
      .limit(1)

    const parsed = availabilitySchema.safeParse(rows[0]?.value)
    if (!parsed.success) return null

    const note = locale === "id" ? parsed.data.noteId : parsed.data.noteEn
    return note.trim() ? note.trim() : null
  } catch {
    return null
  }
}
