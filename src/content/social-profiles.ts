/**
 * Public social profiles for the media kit.
 * Do not invent handles or URLs. Set `verified: true` only after the owner confirms.
 * Unverified rows render as pending — never as live outbound CTAs.
 */
export type SocialPlatformId = "tiktok" | "threads" | "instagram" | "linkedin"

export type SocialProfile = {
  id: SocialPlatformId
  /** Public @handle without @, when known */
  handle: string | null
  href: string | null
  verified: boolean
  /** Suggested utm_source when the profile later becomes a /go slug */
  utmSource: SocialPlatformId
}

export const socialProfiles: readonly SocialProfile[] = [
  {
    id: "tiktok",
    handle: null,
    href: null,
    verified: false,
    utmSource: "tiktok",
  },
  {
    id: "threads",
    handle: null,
    href: null,
    verified: false,
    utmSource: "threads",
  },
  {
    id: "instagram",
    handle: null,
    href: null,
    verified: false,
    utmSource: "instagram",
  },
  {
    id: "linkedin",
    handle: null,
    href: null,
    verified: false,
    utmSource: "linkedin",
  },
] as const

export function verifiedSocialProfiles() {
  return socialProfiles.filter((profile) => profile.verified && profile.href)
}
