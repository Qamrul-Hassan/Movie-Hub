'use client'

import { useState, useRef, useEffect, useMemo } from 'react'
import { FaSearch } from 'react-icons/fa'

export default function NavbarHero() {
  const [openMenu, setOpenMenu] = useState<null | 'movies' | 'tvshows' | 'people' | 'more'>(null)

  // Top-level refs (ESLint safe)
  const moviesRef = useRef<HTMLDivElement>(null)
  const tvshowsRef = useRef<HTMLDivElement>(null)
  const peopleRef = useRef<HTMLDivElement>(null)
  const moreRef = useRef<HTMLDivElement>(null)

  const menuRefs = useMemo(
    () => ({
      movies: moviesRef,
      tvshows: tvshowsRef,
      people: peopleRef,
      more: moreRef,
    }),
    []
  )

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        moviesRef.current &&
        !moviesRef.current.contains(event.target as Node) &&
        tvshowsRef.current &&
        !tvshowsRef.current.contains(event.target as Node) &&
        peopleRef.current &&
        !peopleRef.current.contains(event.target as Node) &&
        moreRef.current &&
        !moreRef.current.contains(event.target as Node)
      ) {
        setOpenMenu(null)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <header className="relative w-full">
      {/* Navbar */}
      <nav className="bg-[#032541] text-white p-4 flex justify-between items-center relative z-10">
        {/* Left side: Logo + Menu Tabs */}
        <div className="flex items-center gap-6">
          <div className="text-4xl font-bold">Movie Hub</div>
          <ul className="flex gap-6 font-bold">
            <li className="relative" onMouseEnter={() => setOpenMenu('movies')} onMouseLeave={() => setOpenMenu(null)}>
              Movies
              <div ref={menuRefs.movies}>
                {openMenu === 'movies' && (
                  <div className="absolute top-full left-0 bg-[#041f34] rounded shadow-lg py-2 w-40">
                    <a href="#" className="block px-4 py-2 hover:bg-[#0f3b5d]">Popular</a>
                    <a href="#" className="block px-4 py-2 hover:bg-[#0f3b5d]">Now Playing</a>
                    <a href="#" className="block px-4 py-2 hover:bg-[#0f3b5d]">Up Coming</a>
                    <a href="#" className="block px-4 py-2 hover:bg-[#0f3b5d]">Top Rated</a>
                  </div>
                )}
              </div>
            </li>

            <li className="relative" onMouseEnter={() => setOpenMenu('tvshows')} onMouseLeave={() => setOpenMenu(null)}>
              TV Shows
              <div ref={menuRefs.tvshows}>
                {openMenu === 'tvshows' && (
                  <div className="absolute top-full left-0 bg-[#041f34] rounded shadow-lg py-2 w-40">
                    <a href="#" className="block px-4 py-2 hover:bg-[#0f3b5d]">Popular</a>
                    <a href="#" className="block px-4 py-2 hover:bg-[#0f3b5d]">Airing Today</a>
                    <a href="#" className="block px-4 py-2 hover:bg-[#0f3b5d]">On TV</a>
                    <a href="#" className="block px-4 py-2 hover:bg-[#0f3b5d]">Top Rated</a>
                  </div>
                )}
              </div>
            </li>

            <li className="relative" onMouseEnter={() => setOpenMenu('people')} onMouseLeave={() => setOpenMenu(null)}>
              People
              <div ref={menuRefs.people}>
                {openMenu === 'people' && (
                  <div className="absolute top-full left-0 bg-[#041f34] rounded shadow-lg py-2 w-40">
                    <a href="#" className="block px-4 py-2 hover:bg-[#0f3b5d]">Popular People</a>
                  </div>
                )}
              </div>
            </li>

            <li className="relative" onMouseEnter={() => setOpenMenu('more')} onMouseLeave={() => setOpenMenu(null)}>
              More
              <div ref={menuRefs.more}>
                {openMenu === 'more' && (
                  <div className="absolute top-full left-0 bg-[#041f34] rounded shadow-lg py-2 w-40">
                    <a href="#" className="block px-4 py-2 hover:bg-[#0f3b5d]">Discussion</a>
                    <a href="#" className="block px-4 py-2 hover:bg-[#0f3b5d]">Leaderboard</a>
                  </div>
                )}
              </div>
            </li>
          </ul>
        </div>

        {/* Right side: Search Icon + Language + Support */}
        <div className="flex items-center gap-4">
          <FaSearch className="text-white cursor-pointer" />
          <select className="bg-[#032541] border border-gray-600 text-white rounded px-2 py-1">
            <option value="en">EN</option>
            <option value="bn">BN</option>
          </select>
          <button className="bg-[#01b4e4] px-3 py-1 rounded font-semibold hover:opacity-90">Support</button>
        </div>
      </nav>

    
    </header>
  )
}
