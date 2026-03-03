import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import { Team } from "@/lib/models/team"
import { getAdminSession } from "@/lib/auth"
import { sendReminderEmail } from "@/lib/email"

export async function POST(req: NextRequest) {
  try {
    const session = await getAdminSession()
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    await connectDB()
    const { teamIds, subject, message } = await req.json()

    const teams = teamIds
      ? await Team.find({ _id: { $in: teamIds } })
      : await Team.find({ status: "verified" })

    const results = []
    for (const team of teams) {
      try {
        await sendReminderEmail(team.leaderEmail, team.teamName, subject, message)
        results.push({ team: team.teamName, status: "sent" })
      } catch {
        results.push({ team: team.teamName, status: "failed" })
      }
    }

    return NextResponse.json({ results })
  } catch (error) {
    return NextResponse.json({ error: "Failed to send reminders", details: String(error) }, { status: 500 })
  }
}
