import { NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import { Team } from "@/lib/models/team"
import { Phase } from "@/lib/models/phase"
import { getSession } from "@/lib/auth"

export async function GET() {
  try {
    const session = await getSession()
    if (!session || session.role !== "user") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()
    const team = await Team.findOne({ leaderEmail: session.email }).select("-password")
    if (!team) return NextResponse.json({ error: "Team not found" }, { status: 404 })

    const phases = await Phase.find().sort({ order: 1 })

    return NextResponse.json({ team, phases })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch dashboard", details: String(error) }, { status: 500 })
  }
}
