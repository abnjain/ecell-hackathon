import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import { Team } from "@/lib/models/team"
import { AuditLog } from "@/lib/models/audit-log"
import { getAdminSession } from "@/lib/auth"

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getAdminSession()
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    await connectDB()
    const { status } = await req.json()
    const { id } = await params
    if (!["pending", "verified", "invalidated"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 })
    }

    const team = await Team.findByIdAndUpdate(id, { status }, { new: true }).select("-password")
    if (!team) return NextResponse.json({ error: "Team not found" }, { status: 404 })

    await AuditLog.create({
      action: `Team status changed to ${status}`,
      performedBy: session.email,
      details: `Team: ${team.teamName}, UTR: ${team.utr}`,
    })

    return NextResponse.json({ team })
  } catch (error) {
    return NextResponse.json({ error: "Update failed", details: String(error) }, { status: 500 })
  }
}
