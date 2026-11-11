"use client"

import { useEffect } from "react"

import { motionMs } from "@/lib/motion"

/** Opens the home intro after mount. No script tag, so React does not warn. */
export function StudioIntroBoot() {
  useEffect(() => {
    const root = document.documentElement
    let reduce = false
    try {
      reduce =
        typeof window.matchMedia === "function" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
    } catch {
      reduce = true
    }
    let seen = false
    try {
      seen = window.sessionStorage.getItem("studio-intro-seen") === "1"
    } catch {
      seen = true
    }
    if (reduce || seen || !document.querySelector(".studio-intro")) return

    root.setAttribute("data-studio-intro", "on")
    let closeTimer = 0
    const dismiss = () => {
      if (root.getAttribute("data-studio-intro") !== "on") return
      root.setAttribute("data-studio-intro", "closing")
      try {
        window.sessionStorage.setItem("studio-intro-seen", "1")
      } catch {
        /* storage unavailable */
      }
      closeTimer = window.setTimeout(() => {
        root.setAttribute("data-studio-intro", "off")
      }, motionMs.fast)
    }
    const onClick = (event: MouseEvent) => {
      const target = event.target
      if (target instanceof Element && target.closest("[data-studio-intro-skip]")) dismiss()
    }
    document.addEventListener("click", onClick)
    const hold = window.setTimeout(dismiss, motionMs.intro)
    return () => {
      document.removeEventListener("click", onClick)
      window.clearTimeout(hold)
      window.clearTimeout(closeTimer)
      if (root.getAttribute("data-studio-intro") === "on") {
        root.setAttribute("data-studio-intro", "off")
      }
    }
  }, [])

  return null
}
