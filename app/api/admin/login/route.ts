import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import { Admin } from "@/lib/models/admin"
import { comparePassword, hashPassword, signToken } from "@/lib/auth"
import { cookies } from "next/headers"

export async function POST(req: NextRequest) {
  try {
    await connectDB()
    const { email, password } = await req.json()
    if (!email || !password) return NextResponse.json({ error: "Credentials required" }, { status: 400 })

    let admin = await Admin.findOne({ email })

    // Auto-create admin if matches env vars and not exists
    if (!admin && email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
      const hashed = await hashPassword(password)
      admin = await Admin.create({ email, password: hashed })
    }

    if (!admin) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })

    const isValid = await comparePassword(password, admin.password)
    if (!isValid) {
      // Check if raw password matches env (first-time setup)
      if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
        admin.password = await hashPassword(password)
        await admin.save()
      } else {
        return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
      }
    }

    const token = signToken({ userId: admin._id.toString(), email: admin.email, role: "admin" })
    const cookieStore = await cookies()
    cookieStore.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    })

    return NextResponse.json({ message: "Admin login successful" })
  } catch (error) {
    return NextResponse.json({ error: "Login failed", details: String(error) }, { status: 500 })
  }
}
