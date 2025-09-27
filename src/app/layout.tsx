import './globals.css'
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import Navbar from '@/components/Navbar' // Import the client Navbar

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
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}>
        <Navbar /> {/* Client component */}
        <main className="min-h-screen p-8 sm:p-16">{children}</main>
        <footer className="p-6 bg-background text-gray-500 text-center border-t border-gray-200 dark:border-gray-700">
          © {new Date().getFullYear()} Movie App. All rights reserved.
        </footer>
      </body>
    </html>
  )
}
