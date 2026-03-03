import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Circle, Triangle, Square, ArrowLeft } from "lucide-react"

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      {/* Squid Shapes */}
      <div className="mb-8 flex items-center gap-6">
        <Circle className="h-10 w-10 text-squid-red opacity-40" />
        <Triangle className="h-10 w-10 text-squid-green opacity-40" />
        <Square className="h-10 w-10 text-squid-gold opacity-40" />
      </div>

      {/* Error Code */}
      <h1 className="font-[var(--font-changa)] text-8xl font-extrabold tracking-tight text-squid-red sm:text-9xl">
        404
      </h1>

      {/* Message */}
      <p className="mt-4 text-center font-[var(--font-changa)] text-lg font-semibold uppercase tracking-wider text-foreground">
        Player Not Found
      </p>
      <p className="mt-2 max-w-md text-center text-sm leading-relaxed text-muted-foreground">
        The page you are looking for has been eliminated from the game. It may have been moved, deleted, or never existed in the first place.
      </p>

      {/* Actions */}
      <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
        <Link href="/">
          <Button className="bg-squid-red px-6 text-sm font-bold uppercase tracking-wider text-primary-foreground hover:bg-squid-red/90">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Return Home
          </Button>
        </Link>
        <Link href="/register">
          <Button variant="outline" className="border-border/60 px-6 text-sm uppercase tracking-wider text-foreground hover:bg-squid-card">
            Register
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
