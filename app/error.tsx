"use client"

import { useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { AlertTriangle, ArrowLeft, RotateCcw } from "lucide-react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("[v0] App error:", error)
  }, [error])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      {/* Icon */}
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full border-2 border-squid-red/30 bg-squid-card">
        <AlertTriangle className="h-10 w-10 text-squid-red" />
      </div>

      {/* Title */}
      <h1 className="font-[var(--font-changa)] text-3xl font-bold uppercase tracking-wider text-squid-red sm:text-4xl">
        Something Went Wrong
      </h1>

      {/* Message */}
      <p className="mt-4 max-w-md text-center text-sm leading-relaxed text-muted-foreground">
        An unexpected error occurred. The game encountered a problem. Please try again or return to the home page.
      </p>

      {error.digest && (
        <p className="mt-2 font-mono text-xs text-muted-foreground/60">
          Error ID: {error.digest}
        </p>
      )}

      {/* Actions */}
      <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
        <Button
          onClick={reset}
          className="bg-squid-red px-6 text-sm font-bold uppercase tracking-wider text-primary-foreground hover:bg-squid-red/90"
        >
          <RotateCcw className="mr-2 h-4 w-4" />
          Try Again
        </Button>
        <Link href="/">
          <Button variant="outline" className="border-border/60 px-6 text-sm uppercase tracking-wider text-foreground hover:bg-squid-card">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Return Home
          </Button>
        </Link>
      </div>

      {/* Decorative line */}
      <div className="mt-16 h-px w-40 bg-gradient-to-r from-transparent via-squid-red/30 to-transparent" />
      <p className="mt-4 text-[10px] uppercase tracking-widest text-muted-foreground/50">
        ECELL SCSIT DAVV
      </p>
    </div>
  )
}
