'use client'

import { useState, useEffect, useRef } from 'react'

export default function Navbar() {
  const [openDropdown, setOpenDropdown] = useState<'movies' | 'web' | null>(null)
  const navRef = useRef<HTMLDivElement>(null)

  const toggleDropdown = (menu: 'movies' | 'web') => {
    setOpenDropdown(openDropdown === menu ? null : menu)
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setOpenDropdown(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <nav
      ref={navRef}
      className="bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 text-white px-6 py-4 flex justify-between items-center shadow-lg sticky top-0 z-50"
    >
      {/* Logo */}
      <div className="text-2xl font-bold tracking-wider cursor-pointer hover:scale-105 transition-transform">
        Movie Hub
      </div>

      {/* Desktop Links */}
      <ul className="hidden md:flex gap-8 font-medium items-center">
        {/* Movies Dropdown */}
        <li className="relative">
          <button
            onClick={() => toggleDropdown('movies')}
            className="cursor-pointer hover:underline focus:outline-none"
          >
            Movies
          </button>
          {openDropdown === 'movies' && (
            <ul className="absolute top-full left-0 mt-2 bg-white text-black rounded shadow-md min-w-[140px] overflow-hidden z-50">
              <li className="px-4 py-2 hover:bg-purple-200 cursor-pointer">Hindi</li>
              <li className="px-4 py-2 hover:bg-purple-200 cursor-pointer">Bangla</li>
            </ul>
          )}
        </li>

        {/* Web Series Dropdown */}
        <li className="relative">
          <button
            onClick={() => toggleDropdown('web')}
            className="cursor-pointer hover:underline focus:outline-none"
          >
            Web Series
          </button>
          {openDropdown === 'web' && (
            <ul className="absolute top-full left-0 mt-2 bg-white text-black rounded shadow-md min-w-[140px] overflow-hidden z-50">
              <li className="px-4 py-2 hover:bg-pink-200 cursor-pointer">Hindi</li>
              <li className="px-4 py-2 hover:bg-pink-200 cursor-pointer">Bangla</li>
            </ul>
          )}
        </li>

        <li className="hover:underline cursor-pointer">Watchlist</li>
      </ul>

      {/* Mobile Menu Placeholder */}
      <div className="md:hidden flex gap-4">
        <span className="cursor-pointer">Menu</span>
      </div>
    </nav>
  )
}
