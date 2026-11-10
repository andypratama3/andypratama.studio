import type { MetadataRoute } from "next"

const paths = [
  "",
  "/about",
  "/products",
  "/products/dualbrand",
  "/work",
  "/work/sakolentra",
  "/services",
  "/journal",
  "/faq",
  "/start",
  "/privacy",
  "/terms",
  "/license",
  "/links",
  "/cv",
] as const

function siteOrigin() {
  return (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "")
}

export default function sitemap(): MetadataRoute.Sitemap {
  const origin = siteOrigin()
  return paths.map((path) => ({
    url: `${origin}${path || "/"}`,
    alternates: {
      languages: {
        en: `${origin}${path || "/"}`,
        id: path === "" ? `${origin}/id` : `${origin}/id${path}`,
      },
    },
  }))
}
