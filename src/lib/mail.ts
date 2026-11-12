import "server-only"
import { mkdir, writeFile, appendFile } from "node:fs/promises"
import path from "node:path"

/**
 * Returns true when a real SMTP transport is configured.
 * Use this in production route handlers to gate on mail availability.
 */
export function hasMailTransport(): boolean {
  return Boolean(process.env.SMTP_HOST) && process.env.MAIL_TRANSPORT !== "file"
}

export type MailMessage = {
  to: string
  subject: string
  text: string
  html?: string
}

/**
 * Test/log transport by default. Writes to tmp/outbox.jsonl.
 * Real SMTP only when SMTP_HOST is set (Owner gate — do not send in CI).
 */
export async function sendMail(message: MailMessage): Promise<{ id: string }> {
  const id = `mail_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
  const host = process.env.SMTP_HOST

  if (!host || process.env.MAIL_TRANSPORT === "file") {
    const dir = path.join(process.cwd(), "tmp")
    await mkdir(dir, { recursive: true })
    const line = JSON.stringify({ id, at: new Date().toISOString(), ...message })
    await appendFile(path.join(dir, "outbox.jsonl"), `${line}\n`, "utf8")
    await writeFile(
      path.join(dir, "outbox.json"),
      JSON.stringify({ latest: { id, ...message } }, null, 2),
      "utf8"
    )
    return { id }
  }

  const nodemailer = await import("nodemailer")
  const transporter = nodemailer.createTransport({
    host,
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: process.env.SMTP_SECURE === "true",
    auth:
      process.env.SMTP_USER && process.env.SMTP_PASS
        ? {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          }
        : undefined,
  })

  await transporter.sendMail({
    from: process.env.SMTP_FROM ?? "noreply@andypratama.studio",
    to: message.to,
    subject: message.subject,
    text: message.text,
    html: message.html,
  })

  return { id }
}

export function confirmationEmail(
  to: string,
  confirmUrl: string,
  unsubscribeUrl?: string
): MailMessage {
  const unsubscribe = unsubscribeUrl
    ? `\n\nUnsubscribe: ${unsubscribeUrl}`
    : ""
  const unsubscribeHtml = unsubscribeUrl
    ? `<p style="font-size:12px;color:#666">Tidak ingin menerima email? <a href="${unsubscribeUrl}">Berhenti berlangganan</a>.</p>`
    : ""

  return {
    to,
    subject: "Confirm your subscription — Andy Pratama Studio",
    text: `Confirm your email by opening this link:\n${confirmUrl}\n\nIf you did not subscribe, ignore this message.${unsubscribe}`,
    html: `<p>Confirm your email:</p><p><a href="${confirmUrl}">${confirmUrl}</a></p><p>If you did not subscribe, ignore this message.</p>${unsubscribeHtml}`,
  }
}
