"use client"

import { useRef } from "react"
import { m, useScroll, useSpring, useTransform } from "motion/react"

import { Link } from "@/lib/navigation"
import { useMotionOk } from "@/components/brand/use-motion-ok"

export interface PracticeFace {
  index: string
  title: string
  body: string
  href: string
}

export function PracticeCube({
  faces,
  caption,
}: {
  faces: PracticeFace[]
  caption: string
}) {
  const motionOk = useMotionOk()
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })
  const rotate = useSpring(useTransform(scrollYProgress, [0, 1], [-18, 300]), {
    stiffness: 80,
    damping: 24,
    mass: 0.4,
  })

  if (!motionOk) {
    return (
      <section ref={ref} aria-label={caption} className="border-b border-border bg-background">
        <div className="mx-auto grid max-w-[1440px] gap-3 px-[clamp(20px,4vw,40px)] py-16 sm:grid-cols-2 lg:grid-cols-3">
          {faces.map((face) => (
            <FaceCard key={face.href} face={face} />
          ))}
        </div>
      </section>
    )
  }

  return (
    <section
      ref={ref}
      aria-label={caption}
      data-nav-theme="light"
      className="relative border-b border-border bg-background"
    >
      <div className="flex min-h-[70vh] flex-col items-center justify-center gap-8 px-6 py-20">
        <p className="text-sm text-muted-foreground">{caption}</p>
        <div className="practice-scene">
          <m.div className="practice-cube" style={{ rotateY: rotate, rotateX: 16 }}>
            {faces.slice(0, 6).map((face) => (
              <div key={face.href} className="practice-face">
                <FaceCard face={face} />
              </div>
            ))}
          </m.div>
        </div>
      </div>
    </section>
  )
}

function FaceCard({ face }: { face: PracticeFace }) {
  return (
    <Link
      href={face.href}
      className="flex h-full flex-col justify-between gap-4 text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
    >
      <span className="text-xs tabular-nums text-muted-foreground">{face.index}</span>
      <span className="space-y-2">
        <span className="block text-section">{face.title}</span>
        <span className="line-clamp-4 block text-sm leading-relaxed text-muted-foreground">
          {face.body}
        </span>
      </span>
    </Link>
  )
}
