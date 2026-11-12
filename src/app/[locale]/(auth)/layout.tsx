import { getLocale } from "next-intl/server"
import { redirect } from "@/i18n/routing"
import { getOwnerSession } from "@/lib/auth"

export default async function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await getOwnerSession()
  if (session) {
    redirect({ href: "/dashboard", locale: await getLocale() })
  }

  return children
}
