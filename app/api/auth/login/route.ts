import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import { Team } from "@/lib/models/team"
import { comparePassword, signToken } from "@/lib/auth"
import { cookies } from "next/headers"

export async function POST(req: NextRequest) {
  try {
    await connectDB()
    const { email, password } = await req.json()
    if (!email || !password) return NextResponse.json({ error: "Email and password required" }, { status: 400 })

    const team = await Team.findOne({ leaderEmail: email })
    if (!team) return NextResponse.json({ error: "No team found with this email" }, { status: 404 })

    const isValid = await comparePassword(password, team.password)
    if (!isValid) return NextResponse.json({ error: "Invalid password" }, { status: 401 })

    const token = signToken({ userId: team._id.toString(), email: team.leaderEmail, role: "user" })
    const cookieStore = await cookies()
    cookieStore.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    })

    return NextResponse.json({ message: "Login successful", teamName: team.teamName })
  } catch (error) {
    return NextResponse.json({ error: "Login failed", details: String(error) }, { status: 500 })
  }
}
