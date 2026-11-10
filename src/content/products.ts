export const products = {
  dualbrand: { priceUsd: null as number | null, checkedAt: null as string | null },
} as const

export function hasDualBrandPrice(): boolean {
  return products.dualbrand.priceUsd != null
}
