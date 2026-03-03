import { NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import { Sponsor } from "@/lib/models/sponsor"

export async function GET() {
  try {
    await connectDB()
    const sponsors = await Sponsor.find()
    return NextResponse.json({ sponsors })
  } catch {
    return NextResponse.json({ sponsors: [] })
  }
}
