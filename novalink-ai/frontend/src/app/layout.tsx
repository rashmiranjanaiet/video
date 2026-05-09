import type { Metadata, Viewport } from 'next'
import '../styles/globals.css'

export const metadata: Metadata = {
  title: 'NovaLink AI - Futuristic Video Chat Platform',
  description: 'Connect with anyone, anywhere through AI-powered video chat with advanced matching, translation, and moderation.',
  keywords: 'video chat, random chat, AI matching, real-time communication, online community',
  manifest: '/manifest.json',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0a0e27',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  )
}
