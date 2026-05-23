import type { Metadata } from 'next'
import { Anton, Archivo } from 'next/font/google'
import './globals.css'
import TransitionProvider from '@/components/transition/TransitionProvider'

const anton = Anton({
  variable: '--font-display',
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
})

const archivo = Archivo({
  variable: '--font-body',
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'PatchMood',
  description: 'Wear your mood — browse our collection',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${anton.variable} ${archivo.variable} h-full`}
    >
      <body className="min-h-full flex flex-col">
        <TransitionProvider>{children}</TransitionProvider>
      </body>
    </html>
  )
}
