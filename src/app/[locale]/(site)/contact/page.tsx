import { redirect } from "@/i18n/routing"

/** Canonical intake is /start (nav CTA). Keep /contact as alias. */
export default async function ContactPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const { locale } = await params
  const query = await searchParams
  const topic = typeof query.topic === "string" ? query.topic : undefined

  redirect({
    href: topic ? { pathname: "/start", query: { topic } } : "/start",
    locale,
  })
}
