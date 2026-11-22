export const products = {
  dualbrand: { priceUsd: 49, checkedAt: null as string | null },
} as const

export function hasDualBrandPrice(): boolean {
  return products.dualbrand.priceUsd != null
}
