"use client"

import * as React from "react"
import { Link } from "@/i18n/routing"
import { track, type EventName, type TrackPayload } from "@/lib/events"
import type { ComponentProps } from "react"

export interface TrackedLinkProps extends ComponentProps<typeof Link> {
  event: EventName
  payload?: TrackPayload
}

/**
 * Thin next-intl Link wrapper that fires a named analytics event on click.
 * No-op safe: if analytics is absent the click still navigates normally.
 *
 * Usage:
 *   <TrackedLink event="hero_cta_click" href="/work">See the work</TrackedLink>
 */
export function TrackedLink({
  event,
  payload,
  onClick,
  children,
  ...props
}: TrackedLinkProps) {
  function handleClick(e: React.MouseEvent<HTMLAnchorElement>) {
    track(event, payload)
    onClick?.(e)
  }
  return (
    <Link onClick={handleClick} {...props}>
      {children}
    </Link>
  )
}

/** For non-locale paths like `/go/*` that must stay plain anchors. */
export function TrackedAnchor({
  event,
  payload,
  onClick,
  children,
  ...props
}: React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  event: EventName
  payload?: TrackPayload
}) {
  function handleClick(e: React.MouseEvent<HTMLAnchorElement>) {
    track(event, payload)
    onClick?.(e)
  }
  return (
    <a onClick={handleClick} {...props}>
      {children}
    </a>
  )
}
