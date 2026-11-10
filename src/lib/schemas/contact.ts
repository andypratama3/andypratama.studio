import { z } from "zod"

export const TOPICS = ["project", "hiring", "school", "other"] as const
export type ContactTopic = (typeof TOPICS)[number]

/**
 * Server-side schema — no i18n, safe to import in route handlers.
 * Also used as the source of truth for field constraints.
 */
export const contactServerSchema = z.object({
  name: z.string().min(1).max(120),
  email: z.string().email().max(254),
  topic: z.enum(TOPICS),
  message: z.string().min(1).max(5000),
  website: z.string().max(0).optional(),
  startedAt: z.coerce.number().optional(),
})

export type ContactServerInput = z.infer<typeof contactServerSchema>

/**
 * Client-side schema factory — accepts translated error messages so the
 * resolver surfaces locale-correct inline errors.
 */
export function makeContactSchema(msgs: {
  nameRequired: string
  emailInvalid: string
  topicRequired: string
  messageRequired: string
}) {
  return z.object({
    name: z.string().min(1, msgs.nameRequired).max(120),
    email: z.string().email(msgs.emailInvalid).max(254),
    topic: z.enum(TOPICS),
    message: z.string().min(1, msgs.messageRequired).max(5000),
  })
}

export type ContactFormValues = ReturnType<typeof makeContactSchema>["_output"]
