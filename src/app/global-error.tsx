"use client"

import { useEffect } from "react"

interface GlobalErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

/**
 * Root-level error boundary — catches errors outside the locale layout.
 * Minimal: no providers available at this level.
 */
export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") {
      console.error("[GlobalError]", error)
    }
  }, [error])

  return (
    <html lang="en">
      <body
        style={{
          fontFamily: "system-ui, sans-serif",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          minHeight: "100dvh",
          padding: "2rem",
          gap: "1rem",
        }}
      >
        <p style={{ fontSize: "0.75rem", letterSpacing: "0.08em", textTransform: "uppercase" }}>
          500
        </p>
        <h1 style={{ fontSize: "2rem", fontWeight: 700, margin: 0 }}>Something went wrong</h1>
        <p style={{ color: "inherit", opacity: 0.7, margin: 0 }}>
          An unexpected error occurred. Try again or come back later.
        </p>
        <button
          type="button"
          onClick={reset}
          style={{
            marginTop: "0.5rem",
            padding: "0.625rem 1.5rem",
            borderRadius: "9999px",
            border: "none",
            background: "#433bff",
            color: "#fff",
            cursor: "pointer",
            fontWeight: 500,
          }}
        >
          Try again
        </button>
      </body>
    </html>
  )
}
