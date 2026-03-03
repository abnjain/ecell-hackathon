import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import { OTP } from "@/lib/models/otp"

export async function POST(req: NextRequest) {
  try {
    await connectDB()
    const { email, code } = await req.json()
    if (!email || !code) return NextResponse.json({ error: "Email and code required" }, { status: 400 })

    const otpDoc = await OTP.findOne({ email, code })
    if (!otpDoc) return NextResponse.json({ error: "Invalid or expired OTP" }, { status: 400 })
    if (otpDoc.expiresAt < new Date()) {
      await OTP.deleteOne({ _id: otpDoc._id })
      return NextResponse.json({ error: "OTP expired" }, { status: 400 })
    }

    await OTP.deleteOne({ _id: otpDoc._id })
    return NextResponse.json({ verified: true })
  } catch (error) {
    return NextResponse.json({ error: "Verification failed", details: String(error) }, { status: 500 })
  }
}
