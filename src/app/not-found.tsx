import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "404 — Page not found / Halaman tidak ditemukan",
  robots: { index: false, follow: false },
}

/**
 * Root fallback for URLs that never reach the locale router.
 * Kept inline-styled: global tokens may not be loaded at this level.
 */
export default function RootNotFound() {
  return (
    <main
      style={{
        display: "flex",
        minHeight: "100dvh",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "0.75rem",
        padding: "1.5rem",
        textAlign: "center",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <p style={{ margin: 0, fontSize: "0.75rem", letterSpacing: "0.2em" }}>404</p>
      <h1 style={{ margin: 0, fontSize: "2rem", fontWeight: 700 }}>
        Page not found
      </h1>
      <p style={{ margin: 0, maxWidth: "32rem", fontSize: "0.875rem", opacity: 0.75 }}>
        This page is unavailable or has moved.
        <br />
        Halaman ini tidak tersedia atau sudah dipindahkan.
      </p>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "0.75rem",
          marginTop: "0.75rem",
        }}
      >
        <Link
          href="/"
          style={{
            borderRadius: "9999px",
            border: "1px solid currentColor",
            padding: "0.625rem 1.25rem",
            fontSize: "0.875rem",
          }}
        >
          Back home / Beranda
        </Link>
        <Link
          href="/start"
          style={{
            borderRadius: "9999px",
            border: "1px solid currentColor",
            padding: "0.625rem 1.25rem",
            fontSize: "0.875rem",
          }}
        >
          Contact / Hubungi
        </Link>
      </div>
    </main>
  )
}
