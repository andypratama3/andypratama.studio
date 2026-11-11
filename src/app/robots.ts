import type { MetadataRoute } from "next"

function siteOrigin() {
  return (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "")
}

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
      "/api/",
      "/dev/",
      "/dashboard",
      "/en/dashboard",
      "/id/dashboard",
      "/sign-in",
      "/en/sign-in",
      "/id/sign-in",
      "/auth",
    ],
    },
    sitemap: `${siteOrigin()}/sitemap.xml`,
  }
}
