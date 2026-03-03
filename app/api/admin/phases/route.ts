import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import { Phase } from "@/lib/models/phase"
import { getAdminSession } from "@/lib/auth"

export async function GET() {
  try {
    await connectDB()
    const phases = await Phase.find().sort({ order: 1 })
    return NextResponse.json({ phases })
  } catch {
    return NextResponse.json({ phases: [] })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getAdminSession()
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    await connectDB()
    const data = await req.json()
    const count = await Phase.countDocuments()
    const phase = await Phase.create({ ...data, order: count })
    return NextResponse.json({ phase })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create phase", details: String(error) }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getAdminSession()
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    await connectDB()
    const { id, ...data } = await req.json()
    const phase = await Phase.findByIdAndUpdate(id, data, { new: true })
    return NextResponse.json({ phase })
  } catch (error) {
    return NextResponse.json({ error: "Failed to update phase", details: String(error) }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getAdminSession()
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    await connectDB()
    const { id } = await req.json()
    await Phase.findByIdAndDelete(id)
    return NextResponse.json({ message: "Phase deleted" })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete phase", details: String(error) }, { status: 500 })
  }
}
