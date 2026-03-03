"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { CalendarDays, Users, Zap, Shield, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CountdownTimer } from "@/components/countdown-timer"
import { FloatingSponsors } from "@/components/floating-sponsors"
import { Marquee } from "@/components/marquee"
import { SquidShapes } from "@/components/squid-shapes"
import { LogoBar } from "@/components/logo-bar"

interface Sponsor {
  _id: string
  name: string
  logoUrl: string
}

export default function Home() {
  const [sponsors, setSponsors] = useState<Sponsor[]>([])

  useEffect(() => {
    fetch("/api/sponsors")
      .then((r) => r.json())
      .then((d) => setSponsors(d.sponsors || []))
      .catch(() => {})
  }, [])

  return (
    <div className="relative min-h-screen bg-background">
      {/* Fixed Logo Bar */}
      <LogoBar />

      {/* Hero Section */}
      <main className="relative">
        <SquidShapes />

        <section className="relative flex flex-col items-center justify-center px-4 pb-16 pt-16 sm:pt-24">
          {/* Badge */}
          <div className="animate-fade-in-up mb-6 flex items-center gap-2 rounded-full border border-squid-red/30 bg-squid-card px-4 py-1.5">
            <Zap className="h-3.5 w-3.5 text-squid-red" />
            <span className="text-xs font-medium tracking-wider text-squid-red">ECELL SCSIT DAVV PRESENTS</span>
          </div>

          {/* Title */}
          <h1 className="animate-fade-in-up text-center font-[var(--font-changa)] text-5xl font-extrabold leading-tight tracking-tight text-foreground sm:text-7xl lg:text-8xl" style={{ animationDelay: "0.1s" }}>
            <span className="text-squid-red">SQUID</span>{" "}
            <span className="text-foreground">GAMES</span>
          </h1>

          <p className="animate-fade-in-up mt-2 font-[var(--font-changa)] text-lg font-semibold tracking-widest text-squid-green sm:text-xl" style={{ animationDelay: "0.2s" }}>
            MARCH 17, 2026
          </p>

          <p className="animate-fade-in-up mt-4 max-w-md text-center text-sm leading-relaxed text-muted-foreground sm:text-base" style={{ animationDelay: "0.3s" }}>
            The ultimate survival challenge awaits. Form your team, pay your entry, and prepare for the games. Only the strongest will prevail.
          </p>

          {/* Countdown */}
          <div className="animate-fade-in-up mt-10" style={{ animationDelay: "0.4s" }}>
            <CountdownTimer />
          </div>

          {/* Pricing Cards */}
          <div className="animate-fade-in-up mt-12 flex flex-col gap-4 sm:flex-row" style={{ animationDelay: "0.5s" }}>
            <div className="relative flex flex-col items-center rounded-lg border border-squid-green/30 bg-squid-card px-8 py-5">
              <span className="mb-1 text-[10px] uppercase tracking-widest text-squid-green">Early Bird</span>
              <span className="font-[var(--font-changa)] text-3xl font-bold text-foreground">
                {"₹540"}
              </span>
              <span className="mt-1 text-xs text-muted-foreground">Limited slots</span>
              <div className="absolute -top-2 right-3 rounded-full bg-squid-green px-2 py-0.5 text-[9px] font-bold uppercase text-squid-dark">
                Save ₹140
              </div>
            </div>
            <div className="flex flex-col items-center rounded-lg border border-border/50 bg-squid-card px-8 py-5">
              <span className="mb-1 text-[10px] uppercase tracking-widest text-muted-foreground">Standard</span>
              <span className="font-[var(--font-changa)] text-3xl font-bold text-foreground">
                {"₹680"}
              </span>
              <span className="mt-1 text-xs text-muted-foreground">Per team</span>
            </div>
          </div>

          {/* CTA */}
          <div className="animate-fade-in-up mt-10 flex flex-col items-center gap-3 sm:flex-row" style={{ animationDelay: "0.6s" }}>
            <Link href="/register">
              <Button size="lg" className="bg-squid-red px-8 text-sm font-bold uppercase tracking-wider text-primary-foreground hover:bg-squid-red/90" style={{ animation: "pulse-glow 2s ease-in-out infinite" }}>
                Register Now
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="lg" className="border-border/60 px-8 text-sm uppercase tracking-wider text-foreground hover:bg-squid-card">
                Team Login
              </Button>
            </Link>
          </div>

          {/* Sponsors */}
          {sponsors.length > 0 && (
            <div className="mt-16 w-full max-w-2xl">
              <p className="mb-4 text-center text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Our Sponsors</p>
              <FloatingSponsors sponsors={sponsors} />
            </div>
          )}
        </section>

        {/* Feature Cards */}
        <section className="mx-auto max-w-4xl px-4 py-16">
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { icon: Users, title: "Team Based", desc: "3-4 members per team. Strategy and teamwork required.", color: "text-squid-red" },
              { icon: CalendarDays, title: "Multi-Phase", desc: "Progress through dynamic event phases and challenges.", color: "text-squid-green" },
              { icon: Shield, title: "75 Teams Max", desc: "Limited slots ensure intense competition. Register early.", color: "text-squid-gold" },
            ].map((f) => (
              <div key={f.title} className="flex flex-col items-center rounded-lg border border-border/40 bg-squid-card p-6 text-center">
                <f.icon className={`mb-3 h-8 w-8 ${f.color}`} />
                <h3 className="mb-1 font-[var(--font-changa)] text-sm font-bold uppercase tracking-wider text-foreground">{f.title}</h3>
                <p className="text-xs leading-relaxed text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Marquee */}
      <Marquee />

      {/* Footer */}
      <footer className="flex flex-col items-center gap-2 px-4 py-8">
        <p className="text-xs text-muted-foreground">ECELL SCSIT DAVV &middot; Squid Games 2026</p>
        <Link href="/admin/login" className="text-[10px] text-muted-foreground/50 hover:text-muted-foreground transition-colors">
          Admin
        </Link>
      </footer>
    </div>
  )
}
