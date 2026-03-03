"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, ArrowRight, Check, Loader2, Circle, Triangle, Square } from "lucide-react"
import Link from "next/link"

interface Member {
  name: string
  email: string
  gender: "male" | "female" | "other" | ""
}

const STEPS = ["Team Details", "Payment", "Verify & Submit"]

export default function RegisterPage() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [otpSent, setOtpSent] = useState(false)
  const [otpVerified, setOtpVerified] = useState(false)
  const [otp, setOtp] = useState("")

  const [form, setForm] = useState({
    teamName: "",
    leaderName: "",
    leaderEmail: "",
    leaderPhone: "",
    leaderGender: "" as "male" | "female" | "other" | "",
    collegeName: "",
    courseYear: "",
    facultyMentorType: "SCSIT" as "SCSIT" | "own",
    ownMentorName: "",
    ownMentorNumber: "",
    password: "",
    confirmPassword: "",
    utr: "",
  })

  const [members, setMembers] = useState<Member[]>([
    { name: "", email: "", gender: "" },
    { name: "", email: "", gender: "" },
  ])

  const updateForm = (field: string, value: string) => setForm((p) => ({ ...p, [field]: value }))

  const updateMember = (idx: number, field: keyof Member, value: string) => {
    setMembers((p) => p.map((m, i) => (i === idx ? { ...m, [field]: value } : m)))
  }

  const addMember = () => {
    if (members.length < 3) setMembers((p) => [...p, { name: "", email: "", gender: "" }])
  }

  const removeMember = (idx: number) => {
    if (members.length > 2) setMembers((p) => p.filter((_, i) => i !== idx))
  }

  // OTP
  const sendOtp = async () => {
    if (!form.leaderEmail) return toast.error("Enter email first")
    setLoading(true)
    try {
      const res = await fetch("/api/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.leaderEmail }),
      })
      const data = await res.json()
      if (res.ok) {
        setOtpSent(true)
        toast.success("OTP sent to your email")
      } else {
        toast.error(data.error || "Failed to send OTP")
      }
    } catch {
      toast.error("Network error")
    }
    setLoading(false)
  }

  const verifyOtp = async () => {
    if (!otp) return toast.error("Enter OTP")
    setLoading(true)
    try {
      const res = await fetch("/api/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.leaderEmail, code: otp }),
      })
      const data = await res.json()
      if (res.ok && data.verified) {
        setOtpVerified(true)
        toast.success("Email verified")
      } else {
        toast.error(data.error || "Invalid OTP")
      }
    } catch {
      toast.error("Network error")
    }
    setLoading(false)
  }

  // Validate step 0
  const validateStep0 = () => {
    if (!form.teamName || !form.leaderName || !form.leaderEmail || !form.leaderPhone || !form.leaderGender || !form.collegeName || !form.courseYear || !form.password) {
      toast.error("Fill all required fields")
      return false
    }
    if (!otpVerified) {
      toast.error("Verify your email first")
      return false
    }
    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match")
      return false
    }
    if (form.password.length < 6) {
      toast.error("Password must be at least 6 characters")
      return false
    }
    // Check members
    const filledMembers = members.filter((m) => m.name && m.email && m.gender)
    if (filledMembers.length < 2) {
      toast.error("At least 2 additional members required (3-4 total including leader)")
      return false
    }
    // Check gender rule
    const allGenders = [form.leaderGender, ...filledMembers.map((m) => m.gender)]
    if (!allGenders.includes("female")) {
      toast.error("Team must include at least 1 female member")
      return false
    }
    if (form.facultyMentorType === "own" && (!form.ownMentorName || !form.ownMentorNumber)) {
      toast.error("Faculty mentor details required")
      return false
    }
    return true
  }

  // Submit
  const handleSubmit = async () => {
    if (!form.utr) return toast.error("Enter your UTR number")
    setLoading(true)
    try {
      const filledMembers = members.filter((m) => m.name && m.email && m.gender)
      const payload = {
        teamName: form.teamName,
        leaderName: form.leaderName,
        leaderEmail: form.leaderEmail,
        leaderPhone: form.leaderPhone,
        leaderGender: form.leaderGender,
        collegeName: form.collegeName,
        courseYear: form.courseYear,
        facultyMentor: {
          type: form.facultyMentorType,
          ...(form.facultyMentorType === "own" ? { ownDetails: { name: form.ownMentorName, number: form.ownMentorNumber } } : {}),
        },
        members: filledMembers,
        utr: form.utr,
        password: form.password,
      }
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (res.ok) {
        toast.success(`Registration successful! Amount: ₹${data.paymentAmount}`)
        router.push("/login")
      } else {
        toast.error(data.error || "Registration failed")
      }
    } catch {
      toast.error("Network error")
    }
    setLoading(false)
  }

  const upiLink540 = "upi://pay?pa=9971612509@ybl&pn=SquidGames&am=540&cu=INR&tn=SquidGamesRegistration"
  const upiLink680 = "upi://pay?pa=9971612509@ybl&pn=SquidGames&am=680&cu=INR&tn=SquidGamesRegistration"

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border/40 bg-squid-card/50 px-4 py-3 sm:px-8">
        <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" />
          <span className="text-sm">Back</span>
        </Link>
        <h1 className="font-[var(--font-changa)] text-sm font-bold uppercase tracking-wider text-squid-red">Register</h1>
        <div className="w-16" />
      </div>

      {/* Steps Indicator */}
      <div className="mx-auto flex max-w-lg items-center justify-center gap-0 px-4 py-6">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center">
            <div className="flex flex-col items-center">
              <div className={`flex h-8 w-8 items-center justify-center rounded-full border text-xs font-bold ${i < step ? "border-squid-green bg-squid-green text-squid-dark" : i === step ? "border-squid-red bg-squid-red text-primary-foreground" : "border-border bg-squid-card text-muted-foreground"}`}>
                {i < step ? <Check className="h-4 w-4" /> : i === 0 ? <Circle className="h-3.5 w-3.5" /> : i === 1 ? <Triangle className="h-3.5 w-3.5" /> : <Square className="h-3.5 w-3.5" />}
              </div>
              <span className="mt-1 text-[10px] text-muted-foreground">{s}</span>
            </div>
            {i < STEPS.length - 1 && <div className={`mx-2 mb-4 h-px w-8 sm:w-16 ${i < step ? "bg-squid-green" : "bg-border"}`} />}
          </div>
        ))}
      </div>

      {/* Form Content */}
      <div className="mx-auto max-w-lg px-4 pb-16">
        {step === 0 && (
          <div className="flex flex-col gap-4">
            <Card className="border-border/40 bg-squid-card">
              <CardHeader className="pb-3">
                <CardTitle className="font-[var(--font-changa)] text-sm uppercase tracking-wider text-foreground">Team Info</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                <div>
                  <Label className="text-xs text-muted-foreground">Team Name</Label>
                  <Input value={form.teamName} onChange={(e) => updateForm("teamName", e.target.value)} placeholder="Enter team name" className="mt-1 border-border/60 bg-background text-foreground" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/40 bg-squid-card">
              <CardHeader className="pb-3">
                <CardTitle className="font-[var(--font-changa)] text-sm uppercase tracking-wider text-foreground">Leader Details</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                <div>
                  <Label className="text-xs text-muted-foreground">Full Name</Label>
                  <Input value={form.leaderName} onChange={(e) => updateForm("leaderName", e.target.value)} placeholder="Leader name" className="mt-1 border-border/60 bg-background text-foreground" />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Email</Label>
                  <div className="mt-1 flex gap-2">
                    <Input value={form.leaderEmail} onChange={(e) => updateForm("leaderEmail", e.target.value)} placeholder="leader@email.com" className="border-border/60 bg-background text-foreground" disabled={otpVerified} />
                    {!otpVerified && (
                      <Button size="sm" onClick={sendOtp} disabled={loading || otpSent} className="shrink-0 bg-squid-red text-primary-foreground hover:bg-squid-red/90">
                        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : otpSent ? "Resend" : "Send OTP"}
                      </Button>
                    )}
                    {otpVerified && <span className="flex items-center text-xs text-squid-green">Verified</span>}
                  </div>
                </div>
                {otpSent && !otpVerified && (
                  <div>
                    <Label className="text-xs text-muted-foreground">Enter OTP</Label>
                    <div className="mt-1 flex gap-2">
                      <Input value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="6-digit OTP" maxLength={6} className="border-border/60 bg-background text-foreground" />
                      <Button size="sm" onClick={verifyOtp} disabled={loading} className="shrink-0 bg-squid-green text-squid-dark hover:bg-squid-green/90">
                        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Verify"}
                      </Button>
                    </div>
                  </div>
                )}
                <div>
                  <Label className="text-xs text-muted-foreground">Phone Number</Label>
                  <Input value={form.leaderPhone} onChange={(e) => updateForm("leaderPhone", e.target.value)} placeholder="10-digit phone" className="mt-1 border-border/60 bg-background text-foreground" />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Gender</Label>
                  <Select value={form.leaderGender} onValueChange={(v) => updateForm("leaderGender", v)}>
                    <SelectTrigger className="mt-1 border-border/60 bg-background text-foreground"><SelectValue placeholder="Select gender" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">College Name</Label>
                  <Input value={form.collegeName} onChange={(e) => updateForm("collegeName", e.target.value)} placeholder="College" className="mt-1 border-border/60 bg-background text-foreground" />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Course & Year</Label>
                  <Input value={form.courseYear} onChange={(e) => updateForm("courseYear", e.target.value)} placeholder="e.g. BCA 2nd Year" className="mt-1 border-border/60 bg-background text-foreground" />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Password (for team login)</Label>
                  <Input type="password" value={form.password} onChange={(e) => updateForm("password", e.target.value)} placeholder="Min 6 characters" className="mt-1 border-border/60 bg-background text-foreground" />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Confirm Password</Label>
                  <Input type="password" value={form.confirmPassword} onChange={(e) => updateForm("confirmPassword", e.target.value)} placeholder="Re-enter password" className="mt-1 border-border/60 bg-background text-foreground" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/40 bg-squid-card">
              <CardHeader className="pb-3">
                <CardTitle className="font-[var(--font-changa)] text-sm uppercase tracking-wider text-foreground">Faculty Mentor</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                <Select value={form.facultyMentorType} onValueChange={(v) => updateForm("facultyMentorType", v)}>
                  <SelectTrigger className="border-border/60 bg-background text-foreground"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SCSIT">SCSIT Faculty</SelectItem>
                    <SelectItem value="own">Own Mentor</SelectItem>
                  </SelectContent>
                </Select>
                {form.facultyMentorType === "own" && (
                  <>
                    <Input value={form.ownMentorName} onChange={(e) => updateForm("ownMentorName", e.target.value)} placeholder="Mentor name" className="border-border/60 bg-background text-foreground" />
                    <Input value={form.ownMentorNumber} onChange={(e) => updateForm("ownMentorNumber", e.target.value)} placeholder="Mentor phone" className="border-border/60 bg-background text-foreground" />
                  </>
                )}
              </CardContent>
            </Card>

            <Card className="border-border/40 bg-squid-card">
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <CardTitle className="font-[var(--font-changa)] text-sm uppercase tracking-wider text-foreground">
                  Team Members ({members.length + 1} total)
                </CardTitle>
                {members.length < 3 && (
                  <Button size="sm" variant="outline" onClick={addMember} className="border-squid-green/30 text-squid-green hover:bg-squid-green/10">
                    Add Member
                  </Button>
                )}
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <p className="text-[11px] text-muted-foreground">Min 3, max 4 total (including leader). At least 1 female required.</p>
                {members.map((m, i) => (
                  <div key={i} className="flex flex-col gap-2 rounded-md border border-border/30 bg-background p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-muted-foreground">Member {i + 2}</span>
                      {members.length > 2 && (
                        <button onClick={() => removeMember(i)} className="text-xs text-destructive hover:underline">Remove</button>
                      )}
                    </div>
                    <Input value={m.name} onChange={(e) => updateMember(i, "name", e.target.value)} placeholder="Name" className="border-border/60 bg-squid-card text-foreground" />
                    <Input value={m.email} onChange={(e) => updateMember(i, "email", e.target.value)} placeholder="Email" className="border-border/60 bg-squid-card text-foreground" />
                    <Select value={m.gender} onValueChange={(v) => updateMember(i, "gender", v)}>
                      <SelectTrigger className="border-border/60 bg-squid-card text-foreground"><SelectValue placeholder="Gender" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Button onClick={() => { if (validateStep0()) setStep(1) }} className="bg-squid-red text-primary-foreground hover:bg-squid-red/90">
              Continue to Payment <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )}

        {step === 1 && (
          <div className="flex flex-col gap-4">
            <Card className="border-border/40 bg-squid-card">
              <CardHeader className="pb-3">
                <CardTitle className="font-[var(--font-changa)] text-sm uppercase tracking-wider text-foreground">Payment</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center gap-6">
                <p className="text-center text-sm text-muted-foreground">
                  Scan the QR code below to pay via UPI. After payment, note your UTR number.
                </p>
                <div className="flex flex-col items-center gap-6 sm:flex-row">
                  <div className="flex flex-col items-center gap-2">
                    <p className="text-xs font-semibold text-squid-green">Early Bird - ₹540</p>
                    <div className="rounded-lg border border-squid-green/30 bg-background p-2">
                      <img src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(upiLink540)}`} alt="QR Code ₹540" className="h-40 w-40 sm:h-44 sm:w-44" crossOrigin="anonymous" />
                    </div>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <p className="text-xs font-semibold text-muted-foreground">Standard - ₹680</p>
                    <div className="rounded-lg border border-border/40 bg-background p-2">
                      <img src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(upiLink680)}`} alt="QR Code ₹680" className="h-40 w-40 sm:h-44 sm:w-44" crossOrigin="anonymous" />
                    </div>
                  </div>
                </div>
                <p className="text-center text-xs text-muted-foreground">UPI ID: 9971612509@ybl</p>
              </CardContent>
            </Card>

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep(0)} className="flex-1 border-border/60 text-foreground">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
              </Button>
              <Button onClick={() => setStep(2)} className="flex-1 bg-squid-red text-primary-foreground hover:bg-squid-red/90">
                I Have Paid <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col gap-4">
            <Card className="border-border/40 bg-squid-card">
              <CardHeader className="pb-3">
                <CardTitle className="font-[var(--font-changa)] text-sm uppercase tracking-wider text-foreground">Verify Payment</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                <p className="text-xs text-muted-foreground">Enter the UTR/transaction number from your payment confirmation.</p>
                <div>
                  <Label className="text-xs text-muted-foreground">UTR Number</Label>
                  <Input value={form.utr} onChange={(e) => updateForm("utr", e.target.value)} placeholder="12-digit UTR number" className="mt-1 border-border/60 bg-background text-foreground" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/40 bg-squid-card">
              <CardHeader className="pb-3">
                <CardTitle className="font-[var(--font-changa)] text-sm uppercase tracking-wider text-foreground">Summary</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-2 text-xs">
                <div className="flex justify-between"><span className="text-muted-foreground">Team</span><span className="text-foreground">{form.teamName}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Leader</span><span className="text-foreground">{form.leaderName}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Email</span><span className="text-foreground">{form.leaderEmail}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Members</span><span className="text-foreground">{members.filter((m) => m.name).map((m) => m.name).join(", ")}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">College</span><span className="text-foreground">{form.collegeName}</span></div>
              </CardContent>
            </Card>

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep(1)} className="flex-1 border-border/60 text-foreground">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
              </Button>
              <Button onClick={handleSubmit} disabled={loading} className="flex-1 bg-squid-green text-squid-dark font-bold hover:bg-squid-green/90">
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Check className="mr-2 h-4 w-4" />}
                Submit Registration
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
