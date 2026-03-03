import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import { Sponsor } from "@/lib/models/sponsor"
import { getAdminSession } from "@/lib/auth"

export async function GET() {
  try {
    await connectDB()
    const sponsors = await Sponsor.find()
    return NextResponse.json({ sponsors })
  } catch {
    return NextResponse.json({ sponsors: [] })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getAdminSession()
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    await connectDB()
    const data = await req.json()
    const sponsor = await Sponsor.create(data)
    return NextResponse.json({ sponsor })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create sponsor", details: String(error) }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getAdminSession()
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    await connectDB()
    const { id } = await req.json()
    await Sponsor.findByIdAndDelete(id)
    return NextResponse.json({ message: "Sponsor deleted" })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete sponsor", details: String(error) }, { status: 500 })
  }
}
