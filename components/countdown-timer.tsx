"use client"

import { useState, useEffect } from "react"

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

export function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    const target = new Date("2026-03-17T00:00:00").getTime()
    const interval = setInterval(() => {
      const now = Date.now()
      const diff = target - now
      if (diff <= 0) {
        clearInterval(interval)
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
        return
      }
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const blocks = [
    { label: "Days", value: timeLeft.days },
    { label: "Hours", value: timeLeft.hours },
    { label: "Minutes", value: timeLeft.minutes },
    { label: "Seconds", value: timeLeft.seconds },
  ]

  return (
    <div className="flex gap-3 sm:gap-4">
      {blocks.map((block) => (
        <div key={block.label} className="flex flex-col items-center">
          <div className="relative flex h-16 w-16 items-center justify-center rounded-lg border border-squid-red/30 bg-squid-card sm:h-20 sm:w-20">
            <span className="font-[var(--font-changa)] text-2xl font-bold text-squid-red sm:text-3xl">
              {String(block.value).padStart(2, "0")}
            </span>
            <div className="absolute inset-0 rounded-lg bg-squid-red/5" />
          </div>
          <span className="mt-1.5 text-[10px] uppercase tracking-widest text-muted-foreground sm:text-xs">{block.label}</span>
        </div>
      ))}
    </div>
  )
}
