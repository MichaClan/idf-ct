import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'CT Forge',
  description: 'Build your Cursed Technique',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}