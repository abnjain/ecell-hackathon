"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Shield, ArrowLeft, Lock } from "lucide-react"

export default function ForbiddenPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      {/* Icon */}
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full border-2 border-squid-red/30 bg-squid-card">
        <Lock className="h-10 w-10 text-squid-red" />
      </div>

      {/* Error Code */}
      <h1 className="font-[var(--font-changa)] text-8xl font-extrabold tracking-tight text-squid-red sm:text-9xl">
        403
      </h1>

      {/* Message */}
      <p className="mt-4 text-center font-[var(--font-changa)] text-lg font-semibold uppercase tracking-wider text-foreground">
        Access Denied
      </p>
      <p className="mt-2 max-w-md text-center text-sm leading-relaxed text-muted-foreground">
        You do not have permission to access this area. Only authorized players and administrators can enter this zone.
      </p>

      {/* Actions */}
      <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
        <Link href="/">
          <Button className="bg-squid-red px-6 text-sm font-bold uppercase tracking-wider text-primary-foreground hover:bg-squid-red/90">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Return Home
          </Button>
        </Link>
        <Link href="/login">
          <Button variant="outline" className="border-border/60 px-6 text-sm uppercase tracking-wider text-foreground hover:bg-squid-card">
            <Shield className="mr-2 h-4 w-4" />
            Login
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
