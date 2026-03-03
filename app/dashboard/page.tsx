"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { LogOut, Users, CreditCard, Clock, ExternalLink, CheckCircle2, AlertCircle, Circle } from "lucide-react"

interface TeamData {
  teamName: string
  leaderName: string
  leaderEmail: string
  leaderPhone: string
  collegeName: string
  courseYear: string
  members: { name: string; email: string; gender: string }[]
  status: string
  paymentAmount: number
  utr: string
  registrationDate: string
}

interface PhaseData {
  _id: string
  name: string
  description: string
  contentLink: string
  status: string
}

export default function DashboardPage() {
  const router = useRouter()
  const [team, setTeam] = useState<TeamData | null>(null)
  const [phases, setPhases] = useState<PhaseData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/dashboard")
      .then((r) => {
        if (r.status === 401) {
          router.push("/login")
          return null
        }
        if (r.status === 403) {
          router.push("/forbidden")
          return null
        }
        return r.json()
      })
      .then((data) => {
        if (data) {
          setTeam(data.team)
          setPhases(data.phases || [])
        }
        setLoading(false)
      })
      .catch(() => {
        router.push("/login")
      })
  }, [router])

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" })
    toast.success("Logged out")
    router.push("/")
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-squid-red border-t-transparent" />
      </div>
    )
  }

  if (!team) return null

  const statusColor = team.status === "verified" ? "text-squid-green" : team.status === "pending" ? "text-squid-gold" : "text-destructive"
  const completedPhases = phases.filter((p) => p.status === "completed").length
  const progressPercent = phases.length > 0 ? (completedPhases / phases.length) * 100 : 0

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-border/40 bg-squid-card/50 px-4 py-3 sm:px-8">
        <Link href="/" className="font-[var(--font-changa)] text-sm font-bold uppercase tracking-wider text-squid-red">
          Squid Games
        </Link>
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground">{team.teamName}</span>
          <Button size="sm" variant="outline" onClick={handleLogout} className="border-border/60 text-foreground">
            <LogOut className="mr-1 h-3.5 w-3.5" /> Logout
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-8">
        <h1 className="font-[var(--font-changa)] text-2xl font-bold uppercase tracking-wider text-foreground">Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">Welcome, {team.leaderName}</p>

        {/* Status Cards */}
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <Card className="border-border/40 bg-squid-card">
            <CardContent className="flex items-center gap-3 p-4">
              {team.status === "verified" ? <CheckCircle2 className="h-8 w-8 text-squid-green" /> : team.status === "pending" ? <Clock className="h-8 w-8 text-squid-gold" /> : <AlertCircle className="h-8 w-8 text-destructive" />}
              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Status</p>
                <p className={`text-sm font-bold capitalize ${statusColor}`}>{team.status}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/40 bg-squid-card">
            <CardContent className="flex items-center gap-3 p-4">
              <CreditCard className="h-8 w-8 text-squid-red" />
              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Payment</p>
                <p className="text-sm font-bold text-foreground">{"₹"}{team.paymentAmount}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/40 bg-squid-card">
            <CardContent className="flex items-center gap-3 p-4">
              <Users className="h-8 w-8 text-squid-green" />
              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Team Size</p>
                <p className="text-sm font-bold text-foreground">{team.members.length + 1} members</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Team Info */}
        <Card className="mt-6 border-border/40 bg-squid-card">
          <CardHeader className="pb-3">
            <CardTitle className="font-[var(--font-changa)] text-sm uppercase tracking-wider text-foreground">Team Details</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2 text-xs">
            <div className="flex justify-between"><span className="text-muted-foreground">Team Name</span><span className="text-foreground">{team.teamName}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Leader</span><span className="text-foreground">{team.leaderName}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Email</span><span className="text-foreground">{team.leaderEmail}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Phone</span><span className="text-foreground">{team.leaderPhone}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">College</span><span className="text-foreground">{team.collegeName}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Course/Year</span><span className="text-foreground">{team.courseYear}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">UTR</span><span className="font-mono text-foreground">{team.utr}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Registered</span><span className="text-foreground">{new Date(team.registrationDate).toLocaleDateString()}</span></div>
            <div className="mt-2 border-t border-border/30 pt-2">
              <p className="mb-1 text-muted-foreground">Members:</p>
              {team.members.map((m, i) => (
                <div key={i} className="flex items-center justify-between py-0.5">
                  <span className="text-foreground">{m.name}</span>
                  <Badge variant="outline" className="text-[10px]">{m.gender}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Event Phases */}
        {phases.length > 0 && (
          <Card className="mt-6 border-border/40 bg-squid-card">
            <CardHeader className="pb-3">
              <CardTitle className="font-[var(--font-changa)] text-sm uppercase tracking-wider text-foreground">Event Phases</CardTitle>
              <div className="mt-2">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Progress</span>
                  <span>{completedPhases}/{phases.length} completed</span>
                </div>
                <Progress value={progressPercent} className="mt-1 h-2" />
              </div>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              {phases.map((phase) => (
                <div key={phase._id} className={`flex items-start gap-3 rounded-md border p-3 ${phase.status === "active" ? "border-squid-red/30 bg-squid-red/5" : phase.status === "completed" ? "border-squid-green/30 bg-squid-green/5" : "border-border/30 bg-background"}`}>
                  <div className="mt-0.5">
                    {phase.status === "completed" ? <CheckCircle2 className="h-4 w-4 text-squid-green" /> : phase.status === "active" ? <Circle className="h-4 w-4 text-squid-red" /> : <Circle className="h-4 w-4 text-muted-foreground" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-foreground">{phase.name}</p>
                      <Badge variant={phase.status === "active" ? "default" : "outline"} className={`text-[10px] ${phase.status === "active" ? "bg-squid-red text-primary-foreground" : ""}`}>
                        {phase.status}
                      </Badge>
                    </div>
                    <p className="mt-0.5 text-xs text-muted-foreground">{phase.description}</p>
                    {phase.contentLink && (
                      <a href={phase.contentLink} target="_blank" rel="noopener noreferrer" className="mt-1 inline-flex items-center gap-1 text-xs text-squid-red hover:underline">
                        View content <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}
