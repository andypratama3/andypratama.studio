"use client"

import { createContext, useContext } from "react"
import { useScroll, useSpring, type MotionValue } from "motion/react"

import { motionSprings } from "@/lib/motion"

type ScrollProgressValue = {
  scrollYProgress: MotionValue<number>
  smooth: MotionValue<number>
}

const ScrollProgressContext = createContext<ScrollProgressValue | null>(null)

/** One document scroll listener and one spring for the public shell. */
export function ScrollProgressProvider({ children }: { children: React.ReactNode }) {
  const { scrollYProgress } = useScroll()
  const smooth = useSpring(scrollYProgress, motionSprings.stiff)

  return (
    <ScrollProgressContext.Provider value={{ scrollYProgress, smooth }}>
      {children}
    </ScrollProgressContext.Provider>
  )
}

export function useScrollProgress() {
  const value = useContext(ScrollProgressContext)
  if (!value) {
    throw new Error("useScrollProgress requires ScrollProgressProvider")
  }
  return value
}
