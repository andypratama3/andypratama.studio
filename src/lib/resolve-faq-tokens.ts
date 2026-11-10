import { facts } from "@/content/facts"
import { faq, type FaqItem } from "@/content/faq"

/**
 * Resolve `{fact:id}` and `{setting:key}` tokens in a string.
 * Returns null if any token resolves to nothing (hide the item).
 */
export function resolveFaqTokens(
  text: string,
  {
    factsMap = facts,
    settings,
  }: {
    factsMap?: typeof facts
    settings?: Record<string, string>
  } = {}
): string | null {
  const SENTINEL = "\x00NULL\x00"

  const afterFacts = text.replace(/\{fact:(\w+)\}/g, (_, id) => {
    const fact = factsMap[id as keyof typeof factsMap]
    if (!fact || fact.status === "unverified" || !fact.value) return SENTINEL
    return fact.value
  })
  if (afterFacts.includes(SENTINEL)) return null

  const afterSettings = afterFacts.replace(/\{setting:(\w+)\}/g, (_, key) => {
    const val = settings?.[key]
    if (!val || val === "") return SENTINEL
    return val
  })
  if (afterSettings.includes(SENTINEL)) return null

  return afterSettings
}

/**
 * Return FAQ items visible to the public:
 * - pendingOwner items excluded
 * - requiresSetting items excluded when setting is absent/empty
 * - token-resolved answers: items with unresolvable tokens excluded
 */
export function getResolvedFaqItems(
  locale: "en" | "id",
  settings?: Record<string, string>
): Array<FaqItem & { resolvedAnswer: string }> {
  return faq
    .filter((item) => !item.pendingOwner)
    .filter(
      (item) =>
        !item.requiresSetting ||
        (settings?.[item.requiresSetting] != null &&
          settings[item.requiresSetting] !== "")
    )
    .flatMap((item) => {
      const resolvedAnswer = resolveFaqTokens(item.a[locale], { factsMap: facts, settings })
      if (resolvedAnswer === null) return []
      return [{ ...item, resolvedAnswer }]
    })
}
