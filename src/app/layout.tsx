import './globals.css'
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import Navbar from '@/components/Navbar'
import Providers from '@/components/Providers'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Movie & Web Series App',
  description: 'Stay updated with the latest movies and web series',
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon.png',
    apple: '/favicon.png',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}>
        <Providers>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <div className="flex-grow px-3 py-4 sm:px-6 sm:py-6 lg:px-10 lg:py-8">{children}</div>
            <footer className="p-6 bg-background text-gray-500 text-center border-t border-gray-200 dark:border-gray-700">
              &copy; {new Date().getFullYear()} Movie App. All rights reserved.
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  )
}
