import { z } from "zod"

/** Short-link slugs are lowercase, dash-separated, max 60 characters. */
export const linkSlugSchema = z
  .string()
  .trim()
  .min(2)
  .max(60)
  .regex(/^[a-z0-9-]+$/, "Slug hanya boleh huruf kecil, angka, dan tanda hubung.")

export const linkDestinationSchema = z
  .string()
  .trim()
  .max(800)
  .refine(isSafeDestination, "URL tujuan harus https.")

export const createLinkSchema = z.object({
  slug: linkSlugSchema,
  destination: linkDestinationSchema,
  platform: z.string().trim().max(30).optional(),
  campaign: z.string().trim().max(80).optional(),
})

export function isSafeDestination(value: string): boolean {
  try {
    const url = new URL(value)
    if (url.protocol === "https:") return true
    return (
      process.env.NODE_ENV !== "production" &&
      url.protocol === "http:" &&
      (url.hostname === "localhost" || url.hostname === "127.0.0.1")
    )
  } catch {
    return false
  }
}
