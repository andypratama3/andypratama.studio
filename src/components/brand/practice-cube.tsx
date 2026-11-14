"use client"

import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react"
import { animate, m, useMotionValue, useMotionValueEvent, useScroll, useSpring, useTransform } from "motion/react"
import { Reveal } from "@/components/brand/reveal"

import { Link } from "@/lib/navigation"
import { yawAdjustToFace } from "@/lib/cube-yaw"
import { motionSprings, motionTokens } from "@/lib/motion"
import { useMotionOk } from "@/components/brand/use-motion-ok"

export interface PracticeFace {
  index: string
  title: string
  body: string
  href: string
}

const FACE_YAW = [0, 90, 180, -90]

function frontFace(yaw: number) {
  let best = 0
  let bestDistance = 360
  for (let index = 0; index < FACE_YAW.length; index += 1) {
    const combined = FACE_YAW[index] + yaw
    let distance = Math.abs(((combined % 360) + 360) % 360)
    if (distance > 180) distance = 360 - distance
    if (distance < bestDistance) {
      bestDistance = distance
      best = index
    }
  }
  return best
}

export function PracticeCube({
  faces,
  caption,
  scrollReveal = false,
  scrollRevealDelayMs = 0,
}: {
  faces: PracticeFace[]
  caption: string
  scrollReveal?: boolean
  scrollRevealDelayMs?: number
}) {
  const motionOk = useMotionOk()
  const ref = useRef<HTMLElement>(null)
  const faceRefs = useRef<Array<HTMLDivElement | null>>([])
  const [hot, setHot] = useState(false)
  const [dragging, setDragging] = useState(false)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })
  const scrollYaw = useSpring(useTransform(scrollYProgress, [0, 1], [-18, 300]), motionSprings.soft)
  const dragYaw = useMotionValue(0)
  const scrollEnabled = useMotionValue(1)
  const baseYaw = useMotionValue(0)
  const yaw = useTransform(
    [scrollYaw, dragYaw, scrollEnabled, baseYaw],
    ([scroll, drag, enabled, base]) => (Number(enabled) === 1 ? Number(scroll) : Number(base) + Number(drag)),
  )
  const gesture = useRef({ x: 0, yaw: 0, moved: false, id: -1 })

  useMotionValueEvent(yaw, "change", (value) => {
    if (!motionOk) return
    const front = frontFace(value)
    faceRefs.current.forEach((face, index) => {
      if (!face) return
      if (index === front) face.removeAttribute("inert")
      else face.setAttribute("inert", "")
    })
  })

  useEffect(() => {
    const node = ref.current
    if (!node) return
    const observer = new IntersectionObserver(([entry]) => {
      setHot(Boolean(entry?.isIntersecting))
    }, { rootMargin: "15% 0px" })
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const apply = () => {
      if (!motionOk) {
        faceRefs.current.forEach((face) => face?.removeAttribute("inert"))
        return
      }
      const front = frontFace(yaw.get())
      faceRefs.current.forEach((face, index) => {
        if (!face) return
        if (index === front) face.removeAttribute("inert")
        else face.setAttribute("inert", "")
      })
    }
    apply()
  }, [motionOk, yaw])

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!motionOk || event.button !== 0) return
    const currentYaw = scrollEnabled.get() === 0 ? yaw.get() : scrollYaw.get()
    baseYaw.set(currentYaw)
    dragYaw.set(0)
    scrollEnabled.set(0)
    gesture.current = { x: event.clientX, yaw: 0, moved: false, id: event.pointerId }
  }

  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerId !== gesture.current.id) return
    const dx = event.clientX - gesture.current.x
    if (!gesture.current.moved) {
      if (Math.abs(dx) < 8) return
      gesture.current.moved = true
      setDragging(true)
      try {
        event.currentTarget.setPointerCapture(event.pointerId)
      } catch {
        /* Pointer capture is unavailable for this event. */
      }
    }
    dragYaw.set(gesture.current.yaw + dx * 0.55)
  }

  const endGesture = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerId !== gesture.current.id) return
    const moved = gesture.current.moved
    gesture.current.id = -1
    setDragging(false)
    if (!moved) return
    const stopClick = (click: Event) => {
      click.preventDefault()
      click.stopPropagation()
    }
    event.currentTarget.addEventListener("click", stopClick, { capture: true, once: true })
    const total = baseYaw.get() + dragYaw.get()
    const adjust = yawAdjustToFace(total)
    if (adjust !== 0) {
      animate(dragYaw, dragYaw.get() + adjust, {
        duration: motionTokens.base,
        ease: [...motionTokens.ease],
      })
    }
  }

  const cubeContent = (
    <section
      ref={ref}
      aria-label={caption}
      data-nav-theme="light"
      className="relative border-b border-border bg-background"
    >
      <div className="flex min-h-[70vh] flex-col items-center justify-center gap-8 px-6 py-20">
        <p className="practice-caption text-sm text-muted-foreground mb-30">{caption}</p>
        <div
          className={motionOk ? "practice-scene practice-scene-drag" : "practice-scene"}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endGesture}
          onPointerCancel={endGesture}
        >
          <m.div
            className={(hot && motionOk) || dragging ? "practice-cube will-change-transform" : "practice-cube"}
            style={motionOk ? { rotateY: yaw, rotateX: 16 } : undefined}
          >
            {faces.slice(0, 6).map((face, index) => (
              <div
                key={face.href}
                ref={(node) => {
                  faceRefs.current[index] = node
                }}
                className="practice-face"
              >
                <FaceCard face={face} />
              </div>
            ))}
          </m.div>
        </div>
      </div>
    </section>
  )

  return scrollReveal ? (
    <Reveal delayMs={scrollRevealDelayMs}>{cubeContent}</Reveal>
  ) : (
    cubeContent
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
