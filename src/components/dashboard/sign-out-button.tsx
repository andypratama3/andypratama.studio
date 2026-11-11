"use client"

import { signOut } from "@/lib/auth-client"
import { useRouter } from "@/i18n/routing"
import { LogOut } from "lucide-react"

export function SignOutButton() {
  const router = useRouter()

  async function handleSignOut() {
    try {
      await signOut()
      router.replace("/sign-in")
    } catch (err) {
      console.error("Sign out error:", err)
      router.replace("/sign-in")
    }
  }

  return (
    <button
      type="button"
      onClick={handleSignOut}
      className="flex h-8 w-8 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      title="Keluar"
      aria-label="Keluar dari sesi"
    >
      <LogOut className="h-4 w-4" />
    </button>
  )
}
