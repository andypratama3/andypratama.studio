import { eq } from "drizzle-orm"

import { products as catalog } from "@/content/products"
import { db } from "@/db"
import { products } from "@/db/schema"
import { OUTBOUND_LINKS } from "@/content/outbound-links"

type ProductStatus = "draft" | "live" | "arsip"

export interface DualBrandRow {
  status: ProductStatus
  priceUsd: string | null
  gumroadUrl: string | null
  demoUrl: string | null
}

export interface DualBrandView {
  priceUsd: string | null
  showBuy: boolean
  showDemo: boolean
}

/**
 * Public DualBrand gate.
 * The price comes from content/products.ts. A database price is never shown.
 * Checkout and demo appear only after the outbound link is verified.
 * A draft or archived row hides them. A missing row (database down) does not.
 */
export function presentDualBrand(input: {
  contentPriceUsd: number | null
  buyVerified: boolean
  demoVerified: boolean
  row: DualBrandRow | null
}): DualBrandView {
  const live = input.row?.status === "live"
  const price = input.contentPriceUsd
  return {
    priceUsd: price == null ? null : price.toFixed(2),
    showBuy: input.buyVerified && live,
    showDemo: input.demoVerified && live,
  }
}

export async function getDualBrandView(): Promise<DualBrandView> {
  let row: DualBrandRow | null = null
  try {
    const found = await Promise.race([
      db
        .select({
          status: products.status,
          priceUsd: products.priceUsd,
          gumroadUrl: products.gumroadUrl,
          demoUrl: products.demoUrl,
        })
        .from(products)
        .where(eq(products.slug, "dualbrand"))
        .limit(1),
      new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error("dualbrand lookup timed out")), 800)
      }),
    ])
    row = found[0] ?? null
  } catch {
    row = null
  }

  return presentDualBrand({
    contentPriceUsd: catalog.dualbrand.priceUsd,
    buyVerified: OUTBOUND_LINKS.dualbrand.verified,
    demoVerified: OUTBOUND_LINKS["dualbrand-demo"].verified,
    row,
  })
}
