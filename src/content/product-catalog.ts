/**
 * Public product shelf. Live listing only when checkout/demo is ready.
 * Placeholders are labeled soon — no prices or testimonials.
 */
export type ProductStatus = "live" | "soon"

export type ProductCatalogItem = {
  id: "dualbrand" | "paywa" | "schoolops" | "portal" | "attendance"
  status: ProductStatus
  href: "/products/dualbrand" | "/products"
  image: string
}

export const productCatalog: readonly ProductCatalogItem[] = [
  {
    id: "dualbrand",
    status: "live",
    href: "/products/dualbrand",
    image: "/media/path-template.jpg",
  },
  {
    id: "paywa",
    status: "soon",
    href: "/products",
    image: "/media/path-build.jpg",
  },
  {
    id: "schoolops",
    status: "soon",
    href: "/products",
    image: "/media/path-ledger.jpg",
  },
  {
    id: "portal",
    status: "soon",
    href: "/products",
    image: "/media/path-hiring.jpg",
  },
  {
    id: "attendance",
    status: "soon",
    href: "/products",
    image: "/media/path-notes.jpg",
  },
] as const
