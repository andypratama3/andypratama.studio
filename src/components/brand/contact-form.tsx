"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useTranslations } from "next-intl"
import { useSearchParams } from "next/navigation"
import { CheckCircle } from "lucide-react"
import { Link } from "@/i18n/routing"
import { track } from "@/lib/events"
import { Magnetic } from "@/components/brand/magnetic"
import { PanelReveal } from "@/components/brand/reveal"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form"
import {
  makeContactSchema,
  TOPICS,
  type ContactFormValues,
} from "@/lib/schemas/contact"

type Labels = {
  name: string
  email: string
  topic: string
  message: string
  submit: string
  topics: {
    project: string
    hiring: string
    school: string
    other: string
  }
}

export function ContactForm({ labels }: { labels: Labels }) {
  const t = useTranslations("contactForm")
  const params = useSearchParams()
  const rawTopic = params.get("topic")
  const initialTopic =
    rawTopic !== null && (TOPICS as readonly string[]).includes(rawTopic)
      ? (rawTopic as (typeof TOPICS)[number])
      : "project"

  const startedAtRef = React.useRef(0)
  const [serverError, setServerError] = React.useState<string | null>(null)
  const [isSuccess, setIsSuccess] = React.useState(false)

  React.useEffect(() => {
    startedAtRef.current = Date.now()
  }, [])

  const schema = React.useMemo(
    () =>
      makeContactSchema({
        nameRequired: t("fieldRequired"),
        emailInvalid: t("emailInvalid"),
        topicRequired: t("topicRequired"),
        messageRequired: t("messageRequired"),
      }),
    [t],
  )

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      topic: initialTopic,
      message: "",
    },
  })

  const { isSubmitting } = form.formState

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    form.handleSubmit(async (values: ContactFormValues) => {
      setServerError(null)
      const data = new FormData()
      data.set("name", values.name)
      data.set("email", values.email)
      data.set("topic", values.topic)
      data.set("message", values.message)
      data.set("website", "") // honeypot — always empty
      data.set(
        "startedAt",
        String(startedAtRef.current || Date.now()),
      )

      try {
        const res = await fetch("/api/contact", { method: "POST", body: data })
        if (res.status === 429) {
          setServerError(t("errorRateLimit"))
          return
        }
        if (!res.ok) {
          // The API explains what to do next (for example when mail transport
          // is unavailable). Prefer that message over a generic error.
          const detail = await res
            .json()
            .then((body: { error?: string }) => body?.error)
            .catch(() => undefined)
          setServerError(detail?.trim() ? detail : t("errorServer"))
          return
        }
        track("contact_submit", { topic: values.topic })
        setIsSuccess(true)
        startedAtRef.current = Date.now()
      } catch {
        setServerError(t("errorNetwork"))
      }
    })(event)
  }

  if (isSuccess) {
    return (
      <PanelReveal
        role="status"
        className="panel-soft mx-auto flex max-w-xl items-start gap-3 p-6"
      >
        <CheckCircle
          className="mt-0.5 size-5 shrink-0 text-brand"
          aria-hidden
        />
        <p className="font-medium text-foreground">{t("successSent")}</p>
      </PanelReveal>
    )
  }

  return (
    <Form {...form}>
      <form
        onSubmit={handleFormSubmit}
        className="panel-soft mx-auto max-w-xl space-y-5 p-6 sm:p-8"
        noValidate
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{labels.name}</FormLabel>
              <FormControl>
                <Input
                  autoComplete="name"
                  disabled={isSubmitting}
                  className="border-input-border"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{labels.email}</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  autoComplete="email"
                  disabled={isSubmitting}
                  className="border-input-border"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="topic"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{labels.topic}</FormLabel>
              <Select
                value={field.value}
                onValueChange={(v) => field.onChange(v)}
                disabled={isSubmitting}
                name={field.name}
              >
                <FormControl>
                  <SelectTrigger className="w-full border-input-border">
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="project">{labels.topics.project}</SelectItem>
                  <SelectItem value="hiring">{labels.topics.hiring}</SelectItem>
                  <SelectItem value="school">{labels.topics.school}</SelectItem>
                  <SelectItem value="other">{labels.topics.other}</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{labels.message}</FormLabel>
              <FormControl>
                <Textarea
                  rows={6}
                  disabled={isSubmitting}
                  className="border-input-border"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Honeypot: hidden from users and screen readers, not keyboard-reachable */}
        <span className="sr-only" aria-hidden="true">
          <Input
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            className="sr-only"
          />
        </span>

        {serverError !== null && (
          <p role="alert" className="text-sm font-medium text-destructive">
            {serverError}
          </p>
        )}

        <div className="space-y-3">
          <Magnetic>
          <Button
            type="submit"
            disabled={isSubmitting}
            aria-busy={isSubmitting}
            className="h-11 min-h-11 rounded-full bg-primary px-6 font-medium text-primary-foreground hover:bg-primary/90 cta-lift"
          >
            {isSubmitting ? t("sending") : labels.submit}
          </Button>
          </Magnetic>
          <p className="text-xs text-muted-foreground">
            <Link
              href="/privacy"
              className="underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
            >
              {t("privacyNote")}
            </Link>
          </p>
        </div>
      </form>
    </Form>
  )
}
