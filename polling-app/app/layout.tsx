import type { Metadata } from 'next'
import './globals.css'
import { Inter } from 'next/font/google'
import NextSessionProvider from '@/components/NextSessionProvider';

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Atom',
  description: 'Learn',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <NextSessionProvider>
          <main>{children}</main>
        </NextSessionProvider>
      </body>
    </html>
  )
}

