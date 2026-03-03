"use client"

import { useEffect } from "react"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("[v0] Global error:", error)
  }, [error])

  return (
    <html lang="en" className="dark">
      <body style={{ backgroundColor: "#0a0a0a", color: "#e8e8e8", fontFamily: "system-ui, sans-serif", margin: 0 }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", padding: "1rem" }}>
          <div style={{ width: 80, height: 80, borderRadius: "50%", border: "2px solid rgba(228,0,16,0.3)", backgroundColor: "#111111", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24 }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#e40010" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" />
              <path d="M12 9v4" />
              <path d="M12 17h.01" />
            </svg>
          </div>
          <h1 style={{ fontSize: 32, fontWeight: 800, color: "#e40010", textTransform: "uppercase", letterSpacing: "0.1em", margin: 0 }}>
            Critical Error
          </h1>
          <p style={{ marginTop: 16, color: "#888888", fontSize: 14, textAlign: "center", maxWidth: 400 }}>
            A critical error has occurred. Please reload the page to continue.
          </p>
          {error.digest && (
            <p style={{ marginTop: 8, fontFamily: "monospace", fontSize: 12, color: "rgba(136,136,136,0.6)" }}>
              Error ID: {error.digest}
            </p>
          )}
          <div style={{ marginTop: 32, display: "flex", gap: 12 }}>
            <button
              onClick={reset}
              style={{ padding: "10px 24px", backgroundColor: "#e40010", color: "#ffffff", border: "none", borderRadius: 6, fontWeight: 700, fontSize: 13, textTransform: "uppercase", letterSpacing: "0.08em", cursor: "pointer" }}
            >
              Reload
            </button>
            <a
              href="/"
              style={{ padding: "10px 24px", backgroundColor: "transparent", color: "#e8e8e8", border: "1px solid #2a2a2a", borderRadius: 6, fontWeight: 600, fontSize: 13, textTransform: "uppercase", letterSpacing: "0.08em", textDecoration: "none", display: "inline-flex", alignItems: "center" }}
            >
              Home
            </a>
          </div>
        </div>
      </body>
    </html>
  )
}
