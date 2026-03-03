import { NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import { Team } from "@/lib/models/team"
import { getAdminSession } from "@/lib/auth"

export async function GET() {
  try {
    const session = await getAdminSession()
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    await connectDB()
    const teams = await Team.find().select("-password").sort({ registrationDate: -1 })
    const stats = {
      total: teams.length,
      pending: teams.filter((t) => t.status === "pending").length,
      verified: teams.filter((t) => t.status === "verified").length,
      invalidated: teams.filter((t) => t.status === "invalidated").length,
      totalRevenue: teams.filter((t) => t.status === "verified").reduce((a, t) => a + t.paymentAmount, 0),
    }

    return NextResponse.json({ teams, stats })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch teams", details: String(error) }, { status: 500 })
  }
}
