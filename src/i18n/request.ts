import { getRequestConfig } from "next-intl/server"
import { hasLocale } from "next-intl"
import { routing, type Locale } from "./routing"
import enMessages from "../messages/en.json"
import idMessages from "../messages/id.json"

const messages: Record<Locale, Record<string, unknown>> = {
  en: enMessages as Record<string, unknown>,
  id: idMessages as Record<string, unknown>,
}

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale

  if (!locale || !hasLocale(routing.locales, locale)) {
    locale = routing.defaultLocale
  }

  const selectedLocale = locale as Locale

  return {
    locale: selectedLocale,
    messages: messages[selectedLocale] ?? messages[routing.defaultLocale],
  }
})
