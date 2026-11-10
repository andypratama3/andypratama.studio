"use client"

import * as React from "react"
import { m } from "motion/react"
import { motionTokens } from "@/lib/motion"
import { useMotionOk } from "@/components/brand/use-motion-ok"
import { cn } from "@/lib/utils"

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.08,
    },
  },
}

const item = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.72,
      ease: motionTokens.ease,
    },
  },
}

/**
 * Hero entrance choreography. Visible on first paint when motion is off
 * (`initial={false}` path via useMotionOk). Children stay in document flow —
 * no per-letter split that breaks accessibility.
 */
export function HeroEntrance({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  const motionOk = useMotionOk()

  if (!motionOk) {
    return <div className={className}>{children}</div>
  }

  return (
    <m.div
      className={className}
      variants={container}
      initial="hidden"
      animate="show"
    >
      {React.Children.map(children, (child) => {
        if (!React.isValidElement(child)) return child
        return (
          <m.div variants={item} className="w-full">
            {child}
          </m.div>
        )
      })}
    </m.div>
  )
}

export function HeroBeat({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode
  className?: string
  delay?: number
}) {
  const motionOk = useMotionOk()

  if (!motionOk) {
    return <div className={className}>{children}</div>
  }

  return (
    <m.div
      className={cn(className)}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.7,
        delay,
        ease: motionTokens.ease,
      }}
    >
      {children}
    </m.div>
  )
}
