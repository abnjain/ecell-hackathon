import nodemailer from "nodemailer"

function getTransporter() {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  })
}

export async function sendOTP(email: string, otp: string) {
  const transporter = getTransporter()
  await transporter.sendMail({
    from: `"Squid Games ECELL" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Your OTP for Squid Games Registration",
    html: `
      <div style="background:#0a0a0a;color:#e8e8e8;padding:40px;font-family:sans-serif;text-align:center;">
        <h1 style="color:#e40010;font-size:28px;">SQUID GAMES 2026</h1>
        <p style="font-size:16px;">Your verification code is:</p>
        <div style="background:#1a1a1a;padding:20px;margin:20px auto;width:fit-content;border-radius:8px;border:1px solid #e40010;">
          <span style="font-size:32px;font-weight:bold;letter-spacing:8px;color:#00b894;">${otp}</span>
        </div>
        <p style="color:#888;">This code expires in 10 minutes.</p>
      </div>
    `,
  })
}

export async function sendReminderEmail(email: string, teamName: string, subject: string, message: string) {
  const transporter = getTransporter()
  await transporter.sendMail({
    from: `"Squid Games ECELL" <${process.env.EMAIL_USER}>`,
    to: email,
    subject,
    html: `
      <div style="background:#0a0a0a;color:#e8e8e8;padding:40px;font-family:sans-serif;">
        <h1 style="color:#e40010;font-size:28px;">SQUID GAMES 2026</h1>
        <p>Hello Team <strong>${teamName}</strong>,</p>
        <div style="background:#1a1a1a;padding:20px;margin:20px 0;border-radius:8px;border:1px solid #2a2a2a;">
          ${message}
        </div>
        <p style="color:#888;font-size:12px;">ECELL SCSIT DAVV - March 17, 2026</p>
      </div>
    `,
  })
}
