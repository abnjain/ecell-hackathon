"use client"

import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
  LogOut, Users, CreditCard, CheckCircle2, Clock, XCircle, Download,
  Plus, Trash2, Send, Shield, BarChart3, Loader2, Eye
} from "lucide-react"

interface TeamInfo {
  _id: string
  teamName: string
  leaderName: string
  leaderEmail: string
  leaderPhone: string
  collegeName: string
  courseYear: string
  facultyMentor: { type: string; ownDetails?: { name: string; number: string } }
  members: { name: string; email: string; gender: string }[]
  utr: string
  status: string
  paymentAmount: number
  registrationDate: string
}

interface Stats {
  total: number
  pending: number
  verified: number
  invalidated: number
  totalRevenue: number
}

interface PhaseInfo {
  _id: string
  name: string
  description: string
  contentLink: string
  status: string
}

interface SponsorInfo {
  _id: string
  name: string
  logoUrl: string
}

export default function AdminDashboard() {
  const router = useRouter()
  const [teams, setTeams] = useState<TeamInfo[]>([])
  const [stats, setStats] = useState<Stats>({ total: 0, pending: 0, verified: 0, invalidated: 0, totalRevenue: 0 })
  const [phases, setPhases] = useState<PhaseInfo[]>([])
  const [sponsors, setSponsors] = useState<SponsorInfo[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedTeam, setSelectedTeam] = useState<TeamInfo | null>(null)
  const [statusFilter, setStatusFilter] = useState("all")

  // Reminder form
  const [reminderSubject, setReminderSubject] = useState("")
  const [reminderMessage, setReminderMessage] = useState("")
  const [sendingReminder, setSendingReminder] = useState(false)

  // Phase form
  const [newPhase, setNewPhase] = useState({ name: "", description: "", contentLink: "", status: "upcoming" })

  // Sponsor form
  const [newSponsor, setNewSponsor] = useState({ name: "", logoUrl: "" })

  const fetchData = useCallback(async () => {
    try {
      const [teamsRes, phasesRes, sponsorsRes] = await Promise.all([
        fetch("/api/admin/teams"),
        fetch("/api/admin/phases"),
        fetch("/api/admin/sponsors"),
      ])
      if (teamsRes.status === 401) { router.push("/admin/login"); return }
      const teamsData = await teamsRes.json()
      const phasesData = await phasesRes.json()
      const sponsorsData = await sponsorsRes.json()
      setTeams(teamsData.teams || [])
      setStats(teamsData.stats || stats)
      setPhases(phasesData.phases || [])
      setSponsors(sponsorsData.sponsors || [])
    } catch {
      router.push("/admin/login")
    }
    setLoading(false)
  }, [router, stats])

  useEffect(() => { fetchData() }, [fetchData])

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" })
    toast.success("Logged out")
    router.push("/")
  }

  const updateTeamStatus = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/admin/teams/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      })
      if (res.ok) {
        toast.success(`Team ${status}`)
        fetchData()
      } else {
        toast.error("Update failed")
      }
    } catch { toast.error("Network error") }
  }

  const exportCSV = () => {
    window.open("/api/admin/export", "_blank")
  }

  const sendReminder = async () => {
    if (!reminderSubject || !reminderMessage) return toast.error("Fill subject and message")
    setSendingReminder(true)
    try {
      const res = await fetch("/api/admin/reminders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject: reminderSubject, message: reminderMessage }),
      })
      const data = await res.json()
      if (res.ok) {
        toast.success(`Sent to ${data.results?.length || 0} teams`)
        setReminderSubject("")
        setReminderMessage("")
      } else toast.error("Failed")
    } catch { toast.error("Network error") }
    setSendingReminder(false)
  }

  const addPhase = async () => {
    if (!newPhase.name) return toast.error("Phase name required")
    try {
      const res = await fetch("/api/admin/phases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPhase),
      })
      if (res.ok) {
        toast.success("Phase added")
        setNewPhase({ name: "", description: "", contentLink: "", status: "upcoming" })
        fetchData()
      }
    } catch { toast.error("Failed") }
  }

  const updatePhaseStatus = async (id: string, status: string) => {
    try {
      await fetch("/api/admin/phases", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      })
      fetchData()
    } catch { toast.error("Failed") }
  }

  const deletePhase = async (id: string) => {
    try {
      await fetch("/api/admin/phases", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      })
      toast.success("Phase deleted")
      fetchData()
    } catch { toast.error("Failed") }
  }

  const addSponsor = async () => {
    if (!newSponsor.name || !newSponsor.logoUrl) return toast.error("Name and logo URL required")
    try {
      const res = await fetch("/api/admin/sponsors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSponsor),
      })
      if (res.ok) {
        toast.success("Sponsor added")
        setNewSponsor({ name: "", logoUrl: "" })
        fetchData()
      }
    } catch { toast.error("Failed") }
  }

  const deleteSponsor = async (id: string) => {
    try {
      await fetch("/api/admin/sponsors", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      })
      toast.success("Sponsor removed")
      fetchData()
    } catch { toast.error("Failed") }
  }

  const filteredTeams = statusFilter === "all" ? teams : teams.filter((t) => t.status === statusFilter)

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-squid-red border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-border/40 bg-squid-card/50 px-4 py-3 sm:px-8">
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-squid-red" />
          <span className="font-[var(--font-changa)] text-sm font-bold uppercase tracking-wider text-squid-red">Admin Panel</span>
        </div>
        <Button size="sm" variant="outline" onClick={handleLogout} className="border-border/60 text-foreground">
          <LogOut className="mr-1 h-3.5 w-3.5" /> Logout
        </Button>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">
        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <Card className="border-border/40 bg-squid-card">
            <CardContent className="flex items-center gap-3 p-4">
              <Users className="h-8 w-8 text-squid-red" />
              <div><p className="text-[10px] uppercase tracking-wider text-muted-foreground">Total Teams</p><p className="text-xl font-bold text-foreground">{stats.total}</p></div>
            </CardContent>
          </Card>
          <Card className="border-border/40 bg-squid-card">
            <CardContent className="flex items-center gap-3 p-4">
              <Clock className="h-8 w-8 text-squid-gold" />
              <div><p className="text-[10px] uppercase tracking-wider text-muted-foreground">Pending</p><p className="text-xl font-bold text-squid-gold">{stats.pending}</p></div>
            </CardContent>
          </Card>
          <Card className="border-border/40 bg-squid-card">
            <CardContent className="flex items-center gap-3 p-4">
              <CheckCircle2 className="h-8 w-8 text-squid-green" />
              <div><p className="text-[10px] uppercase tracking-wider text-muted-foreground">Verified</p><p className="text-xl font-bold text-squid-green">{stats.verified}</p></div>
            </CardContent>
          </Card>
          <Card className="border-border/40 bg-squid-card">
            <CardContent className="flex items-center gap-3 p-4">
              <XCircle className="h-8 w-8 text-destructive" />
              <div><p className="text-[10px] uppercase tracking-wider text-muted-foreground">Invalidated</p><p className="text-xl font-bold text-destructive">{stats.invalidated}</p></div>
            </CardContent>
          </Card>
          <Card className="border-border/40 bg-squid-card">
            <CardContent className="flex items-center gap-3 p-4">
              <CreditCard className="h-8 w-8 text-squid-green" />
              <div><p className="text-[10px] uppercase tracking-wider text-muted-foreground">Revenue</p><p className="text-xl font-bold text-foreground">{"₹"}{stats.totalRevenue}</p></div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="teams" className="mt-8">
          <TabsList className="bg-squid-card">
            <TabsTrigger value="teams" className="data-[state=active]:bg-squid-red data-[state=active]:text-primary-foreground">Teams</TabsTrigger>
            <TabsTrigger value="phases" className="data-[state=active]:bg-squid-red data-[state=active]:text-primary-foreground">Phases</TabsTrigger>
            <TabsTrigger value="sponsors" className="data-[state=active]:bg-squid-red data-[state=active]:text-primary-foreground">Sponsors</TabsTrigger>
            <TabsTrigger value="reminders" className="data-[state=active]:bg-squid-red data-[state=active]:text-primary-foreground">Reminders</TabsTrigger>
          </TabsList>

          {/* Teams Tab */}
          <TabsContent value="teams" className="mt-4">
            <div className="mb-4 flex flex-wrap items-center gap-3">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40 border-border/60 bg-squid-card text-foreground"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Teams</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="verified">Verified</SelectItem>
                  <SelectItem value="invalidated">Invalidated</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" onClick={exportCSV} className="border-border/60 text-foreground">
                <Download className="mr-2 h-4 w-4" /> Export CSV
              </Button>
              <span className="text-xs text-muted-foreground">{filteredTeams.length} teams</span>
            </div>

            {/* Team Detail Modal */}
            {selectedTeam && (
              <Card className="mb-4 border-squid-red/30 bg-squid-card">
                <CardHeader className="flex flex-row items-center justify-between pb-3">
                  <CardTitle className="font-[var(--font-changa)] text-sm uppercase tracking-wider text-foreground">{selectedTeam.teamName}</CardTitle>
                  <Button size="sm" variant="ghost" onClick={() => setSelectedTeam(null)} className="text-muted-foreground">Close</Button>
                </CardHeader>
                <CardContent className="flex flex-col gap-2 text-xs">
                  <div className="grid gap-2 sm:grid-cols-2">
                    <div><span className="text-muted-foreground">Leader: </span><span className="text-foreground">{selectedTeam.leaderName}</span></div>
                    <div><span className="text-muted-foreground">Email: </span><span className="text-foreground">{selectedTeam.leaderEmail}</span></div>
                    <div><span className="text-muted-foreground">Phone: </span><span className="text-foreground">{selectedTeam.leaderPhone}</span></div>
                    <div><span className="text-muted-foreground">College: </span><span className="text-foreground">{selectedTeam.collegeName}</span></div>
                    <div><span className="text-muted-foreground">Course/Year: </span><span className="text-foreground">{selectedTeam.courseYear}</span></div>
                    <div><span className="text-muted-foreground">Mentor: </span><span className="text-foreground">{selectedTeam.facultyMentor.type}{selectedTeam.facultyMentor.ownDetails ? ` - ${selectedTeam.facultyMentor.ownDetails.name}` : ""}</span></div>
                    <div><span className="text-muted-foreground">UTR: </span><span className="font-mono text-foreground">{selectedTeam.utr}</span></div>
                    <div><span className="text-muted-foreground">Amount: </span><span className="text-foreground">{"₹"}{selectedTeam.paymentAmount}</span></div>
                  </div>
                  <div className="mt-2 border-t border-border/30 pt-2">
                    <p className="mb-1 text-muted-foreground">Members:</p>
                    {selectedTeam.members.map((m, i) => (
                      <span key={i} className="mr-2 text-foreground">{m.name} ({m.gender})</span>
                    ))}
                  </div>
                  <div className="mt-3 flex gap-2">
                    <Button size="sm" onClick={() => updateTeamStatus(selectedTeam._id, "verified")} className="bg-squid-green text-squid-dark hover:bg-squid-green/90">
                      <CheckCircle2 className="mr-1 h-3.5 w-3.5" /> Verify
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => updateTeamStatus(selectedTeam._id, "invalidated")}>
                      <XCircle className="mr-1 h-3.5 w-3.5" /> Invalidate
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => updateTeamStatus(selectedTeam._id, "pending")} className="border-border/60 text-foreground">
                      <Clock className="mr-1 h-3.5 w-3.5" /> Set Pending
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Teams List */}
            <div className="flex flex-col gap-2">
              {filteredTeams.map((team) => (
                <div key={team._id} className="flex items-center justify-between rounded-lg border border-border/40 bg-squid-card p-3">
                  <div className="flex items-center gap-3">
                    <div>
                      <p className="text-sm font-medium text-foreground">{team.teamName}</p>
                      <p className="text-xs text-muted-foreground">{team.leaderName} &middot; {team.leaderEmail}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={team.status === "verified" ? "default" : "outline"} className={`text-[10px] ${team.status === "verified" ? "bg-squid-green text-squid-dark" : team.status === "pending" ? "border-squid-gold/50 text-squid-gold" : "border-destructive/50 text-destructive"}`}>
                      {team.status}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{"₹"}{team.paymentAmount}</span>
                    <Button size="sm" variant="ghost" onClick={() => setSelectedTeam(team)} className="text-muted-foreground hover:text-foreground">
                      <Eye className="h-4 w-4" />
                    </Button>
                    {team.status === "pending" && (
                      <>
                        <Button size="sm" onClick={() => updateTeamStatus(team._id, "verified")} className="bg-squid-green text-squid-dark hover:bg-squid-green/90">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => updateTeamStatus(team._id, "invalidated")}>
                          <XCircle className="h-3.5 w-3.5" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              ))}
              {filteredTeams.length === 0 && (
                <p className="py-8 text-center text-sm text-muted-foreground">No teams found</p>
              )}
            </div>
          </TabsContent>

          {/* Phases Tab */}
          <TabsContent value="phases" className="mt-4">
            <Card className="mb-4 border-border/40 bg-squid-card">
              <CardHeader className="pb-3">
                <CardTitle className="font-[var(--font-changa)] text-sm uppercase tracking-wider text-foreground">Add Phase</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <Label className="text-xs text-muted-foreground">Phase Name</Label>
                    <Input value={newPhase.name} onChange={(e) => setNewPhase((p) => ({ ...p, name: e.target.value }))} placeholder="e.g. Round 1" className="mt-1 border-border/60 bg-background text-foreground" />
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Content Link</Label>
                    <Input value={newPhase.contentLink} onChange={(e) => setNewPhase((p) => ({ ...p, contentLink: e.target.value }))} placeholder="https://..." className="mt-1 border-border/60 bg-background text-foreground" />
                  </div>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Description</Label>
                  <Textarea value={newPhase.description} onChange={(e) => setNewPhase((p) => ({ ...p, description: e.target.value }))} placeholder="Phase description" className="mt-1 border-border/60 bg-background text-foreground" rows={2} />
                </div>
                <Button onClick={addPhase} className="w-fit bg-squid-red text-primary-foreground hover:bg-squid-red/90">
                  <Plus className="mr-2 h-4 w-4" /> Add Phase
                </Button>
              </CardContent>
            </Card>

            <div className="flex flex-col gap-2">
              {phases.map((phase) => (
                <div key={phase._id} className="flex items-center justify-between rounded-lg border border-border/40 bg-squid-card p-3">
                  <div>
                    <p className="text-sm font-medium text-foreground">{phase.name}</p>
                    <p className="text-xs text-muted-foreground">{phase.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Select value={phase.status} onValueChange={(v) => updatePhaseStatus(phase._id, v)}>
                      <SelectTrigger className="h-8 w-28 border-border/60 bg-background text-xs text-foreground"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="upcoming">Upcoming</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button size="sm" variant="destructive" onClick={() => deletePhase(phase._id)}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
              {phases.length === 0 && (
                <p className="py-8 text-center text-sm text-muted-foreground">No phases added yet</p>
              )}
            </div>
          </TabsContent>

          {/* Sponsors Tab */}
          <TabsContent value="sponsors" className="mt-4">
            <Card className="mb-4 border-border/40 bg-squid-card">
              <CardHeader className="pb-3">
                <CardTitle className="font-[var(--font-changa)] text-sm uppercase tracking-wider text-foreground">Add Sponsor</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <Label className="text-xs text-muted-foreground">Sponsor Name</Label>
                    <Input value={newSponsor.name} onChange={(e) => setNewSponsor((p) => ({ ...p, name: e.target.value }))} placeholder="Sponsor name" className="mt-1 border-border/60 bg-background text-foreground" />
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Logo URL</Label>
                    <Input value={newSponsor.logoUrl} onChange={(e) => setNewSponsor((p) => ({ ...p, logoUrl: e.target.value }))} placeholder="https://logo.png" className="mt-1 border-border/60 bg-background text-foreground" />
                  </div>
                </div>
                <Button onClick={addSponsor} className="w-fit bg-squid-red text-primary-foreground hover:bg-squid-red/90">
                  <Plus className="mr-2 h-4 w-4" /> Add Sponsor
                </Button>
              </CardContent>
            </Card>

            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {sponsors.map((s) => (
                <div key={s._id} className="flex items-center justify-between rounded-lg border border-border/40 bg-squid-card p-3">
                  <div className="flex items-center gap-3">
                    <img src={s.logoUrl} alt={s.name} className="h-10 w-10 rounded-full object-contain" crossOrigin="anonymous" />
                    <span className="text-sm text-foreground">{s.name}</span>
                  </div>
                  <Button size="sm" variant="destructive" onClick={() => deleteSponsor(s._id)}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              ))}
              {sponsors.length === 0 && (
                <p className="col-span-full py-8 text-center text-sm text-muted-foreground">No sponsors added yet</p>
              )}
            </div>
          </TabsContent>

          {/* Reminders Tab */}
          <TabsContent value="reminders" className="mt-4">
            <Card className="border-border/40 bg-squid-card">
              <CardHeader className="pb-3">
                <CardTitle className="font-[var(--font-changa)] text-sm uppercase tracking-wider text-foreground">Send Reminder to Verified Teams</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                <div>
                  <Label className="text-xs text-muted-foreground">Subject</Label>
                  <Input value={reminderSubject} onChange={(e) => setReminderSubject(e.target.value)} placeholder="Email subject" className="mt-1 border-border/60 bg-background text-foreground" />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Message (HTML supported)</Label>
                  <Textarea value={reminderMessage} onChange={(e) => setReminderMessage(e.target.value)} placeholder="Type your message here..." className="mt-1 border-border/60 bg-background text-foreground" rows={5} />
                </div>
                <Button onClick={sendReminder} disabled={sendingReminder} className="w-fit bg-squid-red text-primary-foreground hover:bg-squid-red/90">
                  {sendingReminder ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                  Send to All Verified Teams
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
