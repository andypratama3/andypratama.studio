"use client"

import { FloatingNav } from "@/components/brand/floating-nav"

/** Public marketing header — Velto floating pill (Owner default: all public pages). */
export function Header() {
  return (
    <header className="relative z-[var(--z-nav)]">
      <FloatingNav />
    </header>
  )
}
