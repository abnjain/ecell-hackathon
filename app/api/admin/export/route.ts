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

    const headers = ["Team Name", "Leader", "Email", "Phone", "College", "Course/Year", "Members", "UTR", "Amount", "Status", "Date"]
    const rows = teams.map((t) => [
      t.teamName,
      t.leaderName,
      t.leaderEmail,
      t.leaderPhone,
      t.collegeName,
      t.courseYear,
      t.members.map((m) => `${m.name}(${m.gender})`).join("; "),
      t.utr,
      t.paymentAmount,
      t.status,
      new Date(t.registrationDate).toLocaleDateString(),
    ])

    const csv = [headers.join(","), ...rows.map((r) => r.map((c) => `"${c}"`).join(","))].join("\n")

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="squid-games-teams-${Date.now()}.csv"`,
      },
    })
  } catch (error) {
    return NextResponse.json({ error: "Export failed", details: String(error) }, { status: 500 })
  }
}
