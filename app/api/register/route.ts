import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import { Team } from "@/lib/models/team"
import { hashPassword } from "@/lib/auth"

const TEAM_CAP = 75
const EARLY_BIRD_LIMIT = 30
const EARLY_BIRD_PRICE = 540
const STANDARD_PRICE = 680

export async function POST(req: NextRequest) {
  try {
    await connectDB()
    const data = await req.json()
    const { teamName, leaderName, leaderEmail, leaderPhone, collegeName, courseYear, facultyMentor, members, utr, password } = data

    // Validate required fields
    if (!teamName || !leaderName || !leaderEmail || !leaderPhone || !collegeName || !courseYear || !facultyMentor || !members || !utr || !password) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    // Validate members count (includes leader)
    if (members.length < 2 || members.length > 3) {
      return NextResponse.json({ error: "Team must have 3-4 total participants (leader + 2-3 members)" }, { status: 400 })
    }

    // Validate at least one girl in team
    const allGenders = [data.leaderGender, ...members.map((m: { gender: string }) => m.gender)]
    const hasGirl = allGenders.includes("female")
    if (!hasGirl) {
      return NextResponse.json({ error: "Team must have at least 1 female member" }, { status: 400 })
    }

    // Check team cap
    const teamCount = await Team.countDocuments()
    if (teamCount >= TEAM_CAP) {
      return NextResponse.json({ error: "Registration is full. Maximum 75 teams reached." }, { status: 400 })
    }

    // Check duplicate team name or email
    const existingTeam = await Team.findOne({ $or: [{ teamName }, { leaderEmail }] })
    if (existingTeam) {
      return NextResponse.json({ error: "Team name or leader email already registered" }, { status: 400 })
    }

    // Determine pricing
    const verifiedCount = await Team.countDocuments({ status: { $ne: "invalidated" } })
    const paymentAmount = verifiedCount < EARLY_BIRD_LIMIT ? EARLY_BIRD_PRICE : STANDARD_PRICE

    const hashedPassword = await hashPassword(password)

    const team = await Team.create({
      teamName,
      leaderName,
      leaderEmail,
      leaderPhone,
      collegeName,
      courseYear,
      facultyMentor,
      members,
      utr,
      status: "pending",
      paymentAmount,
      password: hashedPassword,
    })

    return NextResponse.json({ message: "Registration successful", teamId: team._id, paymentAmount })
  } catch (error) {
    return NextResponse.json({ error: "Registration failed", details: String(error) }, { status: 500 })
  }
}

export async function GET() {
  try {
    await connectDB()
    const count = await Team.countDocuments()
    const verifiedCount = await Team.countDocuments({ status: { $ne: "invalidated" } })
    return NextResponse.json({
      totalTeams: count,
      slotsRemaining: Math.max(0, TEAM_CAP - count),
      currentPrice: verifiedCount < EARLY_BIRD_LIMIT ? EARLY_BIRD_PRICE : STANDARD_PRICE,
      isEarlyBird: verifiedCount < EARLY_BIRD_LIMIT,
    })
  } catch {
    return NextResponse.json({ error: "Failed to fetch info" }, { status: 500 })
  }
}
