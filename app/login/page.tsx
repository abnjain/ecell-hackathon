"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Loader2, LogIn } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) return toast.error("Fill all fields")
    setLoading(true)
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (res.ok) {
        toast.success(`Welcome back, ${data.teamName}!`)
        router.push("/dashboard")
      } else {
        toast.error(data.error || "Login failed")
      }
    } catch {
      toast.error("Network error")
    }
    setLoading(false)
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <Card className="w-full max-w-sm border-border/40 bg-squid-card">
        <CardHeader className="flex flex-col items-center gap-2 pb-3">
          <Link href="/" className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-3 w-3" /> Back to home
          </Link>
          <CardTitle className="font-[var(--font-changa)] text-xl font-bold uppercase tracking-wider text-squid-red">
            Team Login
          </CardTitle>
          <p className="text-xs text-muted-foreground">Use your leader email & password</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div>
              <Label className="text-xs text-muted-foreground">Leader Email</Label>
              <Input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="leader@email.com" className="mt-1 border-border/60 bg-background text-foreground" />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Password</Label>
              <Input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Your password" className="mt-1 border-border/60 bg-background text-foreground" />
            </div>
            <Button type="submit" disabled={loading} className="bg-squid-red text-primary-foreground hover:bg-squid-red/90">
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <LogIn className="mr-2 h-4 w-4" />}
              Login
            </Button>
            <p className="text-center text-xs text-muted-foreground">
              {"Don't have an account? "}
              <Link href="/register" className="text-squid-red hover:underline">Register</Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
