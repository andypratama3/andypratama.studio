/**
 * Outbound destinations for /go/[slug].
 * Only URLs already cited in the repo — do not invent profiles.
 * Owner: add github / linkedin / youtube / twitter when verified.
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
} as const satisfies Record<string, OutboundLink>

export type OutboundSlug = keyof typeof OUTBOUND_LINKS

export function getOutboundLink(slug: string): OutboundLink | null {
  if (Object.prototype.hasOwnProperty.call(OUTBOUND_LINKS, slug)) {
    return OUTBOUND_LINKS[slug as OutboundSlug]
  }
  return null
}
