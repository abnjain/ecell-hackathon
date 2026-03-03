import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import { OTP } from "@/lib/models/otp"
import { sendOTP } from "@/lib/email"

export async function POST(req: NextRequest) {
  try {
    await connectDB()
    const { email } = await req.json()
    if (!email) return NextResponse.json({ error: "Email required" }, { status: 400 })

    const code = Math.floor(100000 + Math.random() * 900000).toString()
    await OTP.deleteMany({ email })
    await OTP.create({ email, code, expiresAt: new Date(Date.now() + 10 * 60 * 1000) })

    try {
      await sendOTP(email, code)
    } catch {
      // If email fails, still store OTP for testing
    }

    return NextResponse.json({ message: "OTP sent" })
  } catch (error) {
    return NextResponse.json({ error: "Failed to send OTP", details: String(error) }, { status: 500 })
  }
}
