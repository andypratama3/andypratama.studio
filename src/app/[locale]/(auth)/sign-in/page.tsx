"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { signIn } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PanelReveal } from "@/components/brand/reveal"
import { ShieldAlert, Lock, ArrowRight, Loader2 } from "lucide-react"

export default function SignInPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleEmailSignIn(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const res = await signIn.email({
        email,
        password,
      })

      if (res.error) {
        setError(res.error.message || "Gagal masuk. Periksa email atau kata sandi.")
      } else {
        router.push("/dashboard")
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Terjadi kesalahan saat masuk."
      setError(msg)
    } finally {
      setIsLoading(false)
    }
  }

  async function handleGitHubSignIn() {
    setIsLoading(true)
    setError(null)
    try {
      await signIn.social({
        provider: "github",
        callbackURL: "/dashboard",
      })
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal mengalihkan ke GitHub."
      setError(msg)
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center p-4">
      <PanelReveal className="w-full max-w-sm rounded-[1.75rem] border border-border bg-card p-6 shadow-sm">
        <div className="mb-6 flex flex-col items-center text-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Lock className="h-6 w-6 text-brand" />
          </div>
          <h1 className="text-xl font-bold tracking-tight">Andy Pratama Studio</h1>
          <p className="mt-1 text-xs text-muted-foreground">
            Akses Khusus Pemilik (Owner-Only Operational Console)
          </p>
        </div>

        {error && (
          <div className="mb-4 flex items-start gap-2.5 rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-xs text-destructive">
            <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleEmailSignIn} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-xs">
              Email Pemilik
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="andypratamaworkspace@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
              className="text-sm"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="password" className="text-xs">
              Kata Sandi
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
              className="text-sm"
            />
          </div>

          <Button
            type="submit"
            className="h-11 w-full rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <span>Masuk ke Dashboard</span>
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </form>

        <div className="relative my-6 text-center text-xs text-muted-foreground">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
          <span className="relative bg-card px-2">atau</span>
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={handleGitHubSignIn}
          disabled={isLoading}
          className="h-11 w-full rounded-full text-xs"
        >
          Masuk dengan GitHub
        </Button>

        <p className="mt-6 text-center text-[11px] text-muted-foreground">
          Pendaftaran publik dinonaktifkan. Akses dibatasi pada kredensial pemilik terdaftar.
        </p>
      </PanelReveal>
    </div>
  )
}
