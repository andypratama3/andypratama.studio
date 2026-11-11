"use client"

import * as React from "react"
import { m } from "motion/react"
import { motionTokens } from "@/lib/motion"
import { useMotionOk } from "@/components/brand/use-motion-ok"

export type RevealKind = "rise" | "mask" | "scale"

type RevealTag = "div" | "li" | "tr"

export interface RevealProps {
  children: React.ReactNode
  className?: string
  /** Delay in ms. Stagger stays under a second. */
  delayMs?: number
  kind?: RevealKind
  /** Use li or tr inside lists and tables. */
  as?: RevealTag
  role?: string
  id?: string
}

const hidden = {
  rise: { opacity: 0, y: motionTokens.enterY },
  mask: { clipPath: "inset(10% 6% 10% 6% round 1.75rem)" },
  scale: { opacity: 0, scale: 0.96 },
} as const

const shown = {
  rise: { opacity: 1, y: 0 },
  mask: { clipPath: "inset(0% 0% 0% 0% round 1.75rem)" },
  scale: { opacity: 1, scale: 1 },
} as const

const durationFor = {
  rise: motionTokens.text,
  mask: motionTokens.media,
  scale: motionTokens.slow,
} as const

type RevealListener = (entry: IntersectionObserverEntry) => void

const listeners = new Map<Element, RevealListener>()
let sharedObserver: IntersectionObserver | null = null

function getObserver() {
  if (sharedObserver) return sharedObserver
  if (typeof IntersectionObserver === "undefined") return null
  sharedObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) listeners.get(entry.target)?.(entry)
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0.16 }
  )
  return sharedObserver
}

function watchReveal(node: Element, listener: RevealListener) {
  const observer = getObserver()
  if (!observer) return () => {}
  listeners.set(node, listener)
  observer.observe(node)
  return () => {
    observer.unobserve(node)
    listeners.delete(node)
  }
}

/**
 * Scroll reveal via Motion. First paint stays visible (`initial={false}`).
 * Off-screen nodes hide instantly, then ease in once. One shared observer.
 * `data-reveal` opts the ancestor section out of CSS `view-rise`.
 */
export function Reveal({
  className,
  delayMs = 0,
  kind = "rise",
  as = "div",
  role,
  id,
  children,
}: RevealProps) {
  const motionOk = useMotionOk()
  const ref = React.useRef<HTMLElement | null>(null)
  const [mode, setMode] = React.useState<"visible" | "armed" | "play">("visible")

  React.useEffect(() => {
    if (!motionOk) return
    const node = ref.current
    if (!node) return

    const arm = () => {
      const rect = node.getBoundingClientRect()
      if (rect.width === 0 && rect.height === 0) return
      const inView = rect.bottom > 48 && rect.top < window.innerHeight * 0.9
      if (inView) return
      setMode("armed")
    }

    arm()

    return watchReveal(node, (entry) => {
      if (entry.isIntersecting) setMode("play")
    })
  }, [motionOk])

  const playing = mode === "play" && motionOk
  const motionProps = {
    className,
    role,
    id,
    "data-reveal": "",
    initial: false as const,
    animate: mode === "armed" && motionOk ? hidden[kind] : shown[kind],
    transition: playing
      ? {
          duration: durationFor[kind],
          delay: delayMs / 1000,
          ease: motionTokens.ease,
        }
      : { duration: 0 },
  }

  if (as === "li") {
    return (
      <m.li ref={ref as React.Ref<HTMLLIElement>} {...motionProps}>
        {children}
      </m.li>
    )
  }

  if (as === "tr") {
    return (
      <m.tr ref={ref as React.Ref<HTMLTableRowElement>} {...motionProps}>
        {children}
      </m.tr>
    )
  }

  return (
    <m.div ref={ref as React.Ref<HTMLDivElement>} {...motionProps}>
      {children}
    </m.div>
  )
}

export function TextReveal(props: Omit<RevealProps, "kind">) {
  return <Reveal kind="rise" {...props} />
}

export function MediaReveal(props: Omit<RevealProps, "kind">) {
  return <Reveal kind="mask" {...props} />
}

export function PanelReveal(props: Omit<RevealProps, "kind">) {
  return <Reveal kind="scale" {...props} />
}

export function Stagger({
  children,
  className,
  stepMs = motionTokens.stagger * 1000,
  kind = "rise",
  as = "div",
}: {
  children: React.ReactNode
  className?: string
  stepMs?: number
  kind?: RevealKind
  as?: RevealTag
}) {
  return React.Children.map(children, (child, index) => (
    <Reveal key={index} as={as} kind={kind} delayMs={index * stepMs} className={className}>
      {child}
    </Reveal>
  ))
}
