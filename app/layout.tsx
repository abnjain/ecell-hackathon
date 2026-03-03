import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Changa } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Toaster } from 'sonner'
import './globals.css'

const _geist = Geist({ subsets: ["latin"], variable: "--font-geist" });
const _geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });
const _changa = Changa({ subsets: ["latin"], variable: "--font-changa", weight: ["400", "600", "700", "800"] });

export const metadata: Metadata = {
  title: 'Squid Games 2026 | ECELL SCSIT DAVV',
  description: 'Register for the ultimate Squid Games event by ECELL SCSIT DAVV - March 17, 2026. Early bird offers available!',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#0a0a0a',
  userScalable: false,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${_geist.variable} ${_geistMono.variable} ${_changa.variable} font-sans antialiased`}>
        {children}
        <Toaster theme="dark" richColors />
        <Analytics />
      </body>
    </html>
  )
}
