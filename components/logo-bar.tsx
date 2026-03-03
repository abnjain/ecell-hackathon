import { Circle, Triangle, Square } from "lucide-react"

export function LogoBar() {
  return (
    <div className="flex items-center justify-between border-b border-border/40 bg-squid-card/50 px-4 py-3 sm:px-8">
      <div className="flex items-center gap-2">
        <Circle className="h-6 w-6 text-squid-red" />
        <span className="font-[var(--font-changa)] text-xs font-semibold tracking-wider text-foreground sm:text-sm">DAVV</span>
      </div>
      <div className="flex items-center gap-2">
        <Triangle className="h-6 w-6 text-squid-green" />
        <span className="font-[var(--font-changa)] text-xs font-bold tracking-wider text-squid-red sm:text-sm">ECELL</span>
      </div>
      <div className="flex items-center gap-2">
        <Square className="h-6 w-6 text-squid-gold" />
        <span className="font-[var(--font-changa)] text-xs font-semibold tracking-wider text-foreground sm:text-sm">SCSIT</span>
      </div>
    </div>
  )
}
