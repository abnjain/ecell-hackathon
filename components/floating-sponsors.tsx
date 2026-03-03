"use client"

import { useEffect, useRef } from "react"

interface Sponsor {
  _id: string
  name: string
  logoUrl: string
}

export function FloatingSponsors({ sponsors }: { sponsors: Sponsor[] }) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Randomize positions on mount
    const bubbles = containerRef.current?.querySelectorAll(".sponsor-bubble")
    bubbles?.forEach((b) => {
      const el = b as HTMLElement
      el.style.animationDelay = `${Math.random() * 5}s`
      el.style.animationDuration = `${6 + Math.random() * 6}s`
    })
  }, [sponsors])

  if (!sponsors.length) return null

  return (
    <div ref={containerRef} className="relative flex flex-wrap items-center justify-center gap-6 py-8">
      {sponsors.map((s) => (
        <div
          key={s._id}
          className="sponsor-bubble flex h-16 w-16 items-center justify-center rounded-full border border-border/50 bg-squid-card/80 p-2 shadow-lg shadow-squid-red/5 backdrop-blur-sm animate-[float_6s_ease-in-out_infinite] sm:h-20 sm:w-20"
        >
          <img src={s.logoUrl} alt={s.name} className="h-full w-full rounded-full object-contain" crossOrigin="anonymous" />
        </div>
      ))}
    </div>
  )
}
