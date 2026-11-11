"use client"

import * as React from "react"
import { m, useScroll, useTransform, type MotionValue } from "motion/react"
import { useMotionOk } from "@/components/brand/use-motion-ok"
import { wordNeonWindow } from "@/lib/word-neon"

const rest = "color-mix(in oklab, var(--foreground) 28%, transparent)"
const neon = "var(--word-neon)"

function NeonWord({
  word,
  progress,
  index,
  count,
  motionOk,
}: {
  word: string
  progress: MotionValue<number>
  index: number
  count: number
  motionOk: boolean
}) {
  const { start, mid, end } = wordNeonWindow(index, count)
  const color = useTransform(progress, [start, mid, end], [rest, neon, rest])
  const opacity = useTransform(progress, [start, mid, end], [0.28, 1, 0.28])
  const textShadow = useTransform(progress, [start, mid, end], [
    "0 0 0 transparent",
    "0 0 22px var(--word-neon)",
    "0 0 0 transparent",
  ])

  return (
    <m.span
      className="inline-block pr-[0.28em]"
      style={motionOk ? { color, opacity, textShadow } : { color: "var(--foreground)", opacity: 0.4 }}
    >
      {word}
    </m.span>
  )
}

/**
 * Horizontal wordmark scrubbed by this band's own scroll progress.
 * Neon blue travels word by word in the scroll direction.
 * Static when motion is reduced. Decorative only.
 */
export function ScrollBridge({ text }: { text: string }) {
  const ref = React.useRef<HTMLDivElement | null>(null)
  const motionOk = useMotionOk()
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })
  const x = useTransform(scrollYProgress, [0, 1], ["12%", "-28%"])
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.96, 1, 0.98])
  const words = `${text} ${text}`.split(/\s+/).filter(Boolean)

  return (
    <div ref={ref} className="relative overflow-hidden py-12 sm:py-16" aria-hidden="true">
      <m.p
        className="text-wordmark whitespace-nowrap"
        style={motionOk ? { x, scale } : { x: 0 }}
      >
        {words.map((word, index) => (
          <NeonWord
            key={`${word}-${index}`}
            word={word}
            progress={scrollYProgress}
            index={index}
            count={words.length}
            motionOk={motionOk}
          />
        ))}
      </m.p>
    </div>
  )
}
