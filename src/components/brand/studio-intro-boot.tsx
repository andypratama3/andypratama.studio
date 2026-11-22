"use client"

import { useEffect } from "react"

import { motionMs } from "@/lib/motion"

/**
 * Marks every sibling along the overlay's ancestor chain inert, so nothing
 * underneath a full-screen overlay can take focus or clicks. The walk stops
 * below `<body>`, whose other children are framework scripts. Returns a
 * release function that restores the previous state.
 */
function inertBehind(element: Element) {
  const blocked: Element[] = []
  let node: Element | null = element
  while (node) {
    const parent: Element | null = node.parentElement
    if (!parent || parent === document.body) break
    for (const sibling of Array.from(parent.children)) {
      if (sibling === node || sibling.hasAttribute("inert")) continue
      sibling.setAttribute("inert", "")
      blocked.push(sibling)
    }
    node = parent
  }
  return () => {
    for (const element of blocked) element.removeAttribute("inert")
  }
}

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
    const overlay = document.querySelector(".studio-intro")
    if (reduce || seen || !overlay) return

    // The pre-paint inline script (src/lib/intro-boot-script.ts) sets `on`
    // before first paint so the overlay never flashes; inert and the Escape
    // handler only exist once this effect runs. Sub-100ms window where the
    // overlay is visible but the page is still reachable — accepted, because
    // the same script gap means the overlay cannot be dismissed yet either.
    const release = inertBehind(overlay)
    root.setAttribute("data-studio-intro", "on")
    const skipLink = document.querySelector<HTMLElement>('a[href="#main"]')
    let closeTimer = 0
    let restoreFocus = false
    const dismiss = () => {
      if (root.getAttribute("data-studio-intro") !== "on") return
      root.setAttribute("data-studio-intro", "closing")
      // Hiding the overlay drops focus to <body>, but sequential navigation
      // would resume after it — skipping the skip link. Record it now, while
      // the overlay is still visible.
      restoreFocus = overlay.contains(document.activeElement)
      try {
        window.sessionStorage.setItem("studio-intro-seen", "1")
      } catch {
        /* storage unavailable */
      }
      closeTimer = window.setTimeout(() => {
        root.setAttribute("data-studio-intro", "off")
        release()
        if (restoreFocus) skipLink?.focus()
      }, motionMs.fast)
    }
    const onClick = (event: MouseEvent) => {
      const target = event.target
      if (target instanceof Element && target.closest("[data-studio-intro-skip]")) dismiss()
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") dismiss()
    }
    document.addEventListener("click", onClick)
    document.addEventListener("keydown", onKeyDown)
    const hold = window.setTimeout(dismiss, motionMs.intro)
    return () => {
      document.removeEventListener("click", onClick)
      document.removeEventListener("keydown", onKeyDown)
      window.clearTimeout(hold)
      window.clearTimeout(closeTimer)
      release()
      if (root.getAttribute("data-studio-intro") === "on") {
        root.setAttribute("data-studio-intro", "off")
      }
    }
  }, [])

  return null
}
