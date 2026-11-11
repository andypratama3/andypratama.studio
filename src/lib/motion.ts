/**
 * Single source for motion timing.
 * CSS custom properties in globals.css must match `motionCss`.
 * Durations stay inside the editorial scale: press <100ms, micro 180ms,
 * UI 240ms, section 550ms, hero 720ms, intro hold 1100ms.
 * `enterY` is 16px (the 8–28px band). Longer rises were competing with the type.
 */
export const motionTokens = {
  press: 0.08,
  fast: 0.18,
  base: 0.24,
  slow: 0.55,
  text: 0.55,
  media: 0.7,
  hero: 0.72,
  /** Studio intro hold. Exit uses `fast`. */
  intro: 1.1,
  /** Decorative loops. Not entrance timing. */
  marquee: 36,
  drift: 48,
  neon: 1.8,
  ease: [0.22, 1, 0.36, 1] as const,
  easeInOut: [0.45, 0, 0.55, 1] as const,
  enterY: 16,
  /** 60ms. Sequences stay under ~600ms. */
  stagger: 0.06,
} as const

export type MotionTokens = typeof motionTokens

/** stiff: scroll progress. soft: parallax and the cube. quick: pointer follow. */
export const motionSprings = {
  stiff: { stiffness: 140, damping: 28, mass: 0.3 },
  soft: { stiffness: 80, damping: 24, mass: 0.4 },
  quick: { stiffness: 220, damping: 18, mass: 0.35 },
} as const

function ms(seconds: number) {
  return `${Math.round(seconds * 1000)}ms`
}

function bezier(curve: readonly number[]) {
  return `cubic-bezier(${curve.join(", ")})`
}

/** Values that globals.css :root must repeat. The token test compares them. */
export const motionCss = {
  "--dur-press": ms(motionTokens.press),
  "--dur-fast": ms(motionTokens.fast),
  "--dur-base": ms(motionTokens.base),
  "--dur-slow": ms(motionTokens.slow),
  "--dur-text": ms(motionTokens.text),
  "--dur-media": ms(motionTokens.media),
  "--dur-hero": ms(motionTokens.hero),
  "--dur-intro": ms(motionTokens.intro),
  "--dur-neon": `${motionTokens.neon}s`,
  "--dur-marquee": `${motionTokens.marquee}s`,
  "--dur-drift": `${motionTokens.drift}s`,
  "--ease-out": bezier(motionTokens.ease),
  "--ease-in-out": bezier(motionTokens.easeInOut),
  "--rise": `${motionTokens.enterY}px`,
} as const

export const motionMs = {
  press: motionTokens.press * 1000,
  fast: motionTokens.fast * 1000,
  base: motionTokens.base * 1000,
  slow: motionTokens.slow * 1000,
  text: motionTokens.text * 1000,
  media: motionTokens.media * 1000,
  hero: motionTokens.hero * 1000,
  intro: motionTokens.intro * 1000,
} as const
