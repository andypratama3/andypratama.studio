/**
 * Single source for motion timing (Lampiran D.1 + cinematic landing).
 * CSS mirrors these via --dur-* and --ease-out in globals.css.
 */
export const motionTokens = {
  /** Micro-interactions: CTA, chips, press */
  fast: 0.18,
  /** Nav / button / active indicators */
  base: 0.24,
  /** Generic section entrance */
  slow: 0.55,
  /** Text / heading reveal */
  text: 0.9,
  /** Media clip / mask reveal */
  media: 1.05,
  /** Hero choreography total window */
  hero: 1.2,
  /** cubic-bezier ease-out */
  ease: [0.22, 1, 0.36, 1] as const,
  /** ease-in-out for scrubbed transitions */
  easeInOut: [0.45, 0, 0.55, 1] as const,
  enterY: 40,
} as const

export type MotionTokens = typeof motionTokens

/** Milliseconds for CSS / timeouts (derived, not separate constants). */
export const motionMs = {
  fast: motionTokens.fast * 1000,
  base: motionTokens.base * 1000,
  slow: motionTokens.slow * 1000,
  text: motionTokens.text * 1000,
  media: motionTokens.media * 1000,
  hero: motionTokens.hero * 1000,
} as const
