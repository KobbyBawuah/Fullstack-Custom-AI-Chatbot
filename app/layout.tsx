// import '@vercel/examples-ui/globals.css'
import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  //change the fav icon
  title: 'Vault Whisperer',
  description: 'Ask your PDFs, Markdown documents, or Text files 💬',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className} style={{ backgroundColor: '#f0f0f0' }}>{children}</body>
    </html>
  )
}
