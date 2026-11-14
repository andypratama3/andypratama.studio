/**
 * Outbound destinations for /go/[slug].
 * Only URLs already cited in the repo — do not invent profiles.
 * Owner: add github / linkedin / youtube / twitter when verified.
 *
 * The social-bio links mirror `src/db/seed.ts` so `/go/*` keeps working when
 * the database is unavailable; a seeded row always wins over the static copy.
 */
export type OutboundLink = {
  href: string
  /** Default utm_source when absent on the request */
  utmSource?: string
  /** Owner must set true before CTAs pointing here are shown publicly. */
  verified: boolean
}

export const OUTBOUND_LINKS = {
  dualbrand: {
    href: "https://andypratama.gumroad.com/l/dualbrand",
    utmSource: "website",
    verified: false,
  },
  "dualbrand-demo": {
    href: "https://dualbrand.andypratama.studio",
    utmSource: "website",
    verified: false,
  },
  "threads-start": {
    href: "https://andypratama.studio/start?utm_source=threads&utm_medium=organic&utm_campaign=bio",
    utmSource: "threads",
    verified: true,
  },
  "tiktok-start": {
    href: "https://andypratama.studio/start?utm_source=tiktok&utm_medium=organic&utm_campaign=bio",
    utmSource: "tiktok",
    verified: true,
  },
  "instagram-start": {
    href: "https://andypratama.studio/start?utm_source=instagram&utm_medium=organic&utm_campaign=bio",
    utmSource: "instagram",
    verified: true,
  },
  "linkedin-start": {
    href: "https://andypratama.studio/start?utm_source=linkedin&utm_medium=organic&utm_campaign=featured",
    utmSource: "linkedin",
    verified: true,
  },
  "youtube-start": {
    href: "https://andypratama.studio/start?utm_source=youtube&utm_medium=organic&utm_campaign=description",
    utmSource: "youtube",
    verified: true,
  },
} as const satisfies Record<string, OutboundLink>

export type OutboundSlug = keyof typeof OUTBOUND_LINKS

export function getOutboundLink(slug: string): OutboundLink | null {
  if (Object.prototype.hasOwnProperty.call(OUTBOUND_LINKS, slug)) {
    return OUTBOUND_LINKS[slug as OutboundSlug]
  }
  return null
}
