/**
 * Fixed analytics event names aligned with spec §11.
 * Unknown names are rejected. No-op when analytics script is absent (Lampiran D.2).
 */

export const EVENT_NAMES = [
  "hero_cta_click",
  "product_demo_click",
  "product_buy_click",
  "subscribe_submit",
  "subscribe_confirm",
  "social_click",
  "audience_route_click",
  "final_cta_click",
  "cv_download",
  "faq_open",
  "contact_submit",
  "video_play",
  "video_progress",
] as const

export type EventName = (typeof EVENT_NAMES)[number]

export type TrackPayload = Record<string, string | number | boolean | null | undefined>

function isEventName(name: string): name is EventName {
  return (EVENT_NAMES as readonly string[]).includes(name)
}

/**
 * Fire a named event. Never throws. Unknown names are ignored (and logged in dev).
 */
export function track(name: string, payload?: TrackPayload): void {
  if (!isEventName(name)) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(`[events] rejected unknown event: ${name}`)
    }
    return
  }

  try {
    const w = typeof window !== "undefined" ? window : undefined
    const bridge = w as
      | (Window & {
          umami?: { track: (n: string, d?: TrackPayload) => void }
          plausible?: (n: string, o?: { props?: TrackPayload }) => void
        })
      | undefined

    if (bridge?.umami?.track) {
      bridge.umami.track(name, payload)
      return
    }
    if (bridge?.plausible) {
      bridge.plausible(name, payload ? { props: payload } : undefined)
      return
    }
  } catch {
    // no-op
  }
}

