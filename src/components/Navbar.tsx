'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { FaFilm, FaSearch } from 'react-icons/fa'
import { useEffect, useRef, useState } from 'react'

type MenuKey = 'movies' | 'tvshows' | 'people' | 'more'

const navMenus: {
  key: MenuKey
  label: string
  links: { href: string; label: string }[]
}[] = [
  {
    key: 'movies',
    label: 'Movies',
    links: [
      { href: '/movies/popular', label: 'Popular' },
      { href: '/movies/now-playing', label: 'Now Playing' },
      { href: '/movies/upcoming', label: 'Upcoming' },
      { href: '/movies/top-rated', label: 'Top Rated' },
    ],
  },
  {
    key: 'tvshows',
    label: 'TV Shows',
    links: [
      { href: '/tv/popular', label: 'Popular' },
      { href: '/tv/airing-today', label: 'Airing Today' },
      { href: '/tv/on-tv', label: 'On TV' },
      { href: '/tv/top-rated', label: 'Top Rated' },
    ],
  },
  {
    key: 'people',
    label: 'People',
    links: [{ href: '/people/popular', label: 'Popular People' }],
  },
  {
    key: 'more',
    label: 'More',
    links: [
      { href: '/discussion', label: 'Discussion' },
      { href: '/leaderboard', label: 'Leaderboard' },
    ],
  },
]

const navButtonBase =
  'inline-flex items-center justify-center rounded-full px-3.5 py-1.5 text-sm font-semibold whitespace-nowrap transition-all duration-200'

export default function Navbar() {
  const [openMenu, setOpenMenu] = useState<MenuKey | null>(null)
  const [query, setQuery] = useState('')
  const navRef = useRef<HTMLElement>(null)
  const pathname = usePathname()
  const router = useRouter()

  const isLinkActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`)

  useEffect(() => {
    setOpenMenu(null)
  }, [pathname])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setOpenMenu(null)
      }
    }

    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpenMenu(null)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEsc)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEsc)
    }
  }, [])

  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const nextQuery = query.trim()
    if (!nextQuery) return
    router.push(`/search?q=${encodeURIComponent(nextQuery)}`)
    setOpenMenu(null)
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-[#031c30]/90 backdrop-blur-xl">
      <nav ref={navRef} className="flex w-full flex-col gap-3 px-3 py-3 sm:px-6 lg:px-10" aria-label="Primary">
        <div className="rounded-2xl border border-white/10 bg-gradient-to-r from-[#0b2e4a] via-[#0f3656] to-[#0c2e48] p-3 shadow-[0_14px_35px_rgba(0,0,0,0.35)] sm:p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex min-w-0 flex-wrap items-center gap-2 sm:gap-3">
              <Link href="/" className="inline-flex items-center gap-2 pr-1">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-300 text-[#032541]">
                  <FaFilm aria-hidden="true" />
                </span>
                <span className="text-xl font-black tracking-tight text-white sm:text-2xl">Movie Hub</span>
              </Link>

              <Link
                href="/"
                className={`${navButtonBase} ${pathname === '/' ? 'bg-white text-[#032541] shadow-sm' : 'bg-white/10 text-slate-100 hover:bg-white/20'}`}
                aria-current={pathname === '/' ? 'page' : undefined}
              >
                Home
              </Link>

              {navMenus.map((menu) => {
                const isOpen = openMenu === menu.key
                const isMenuActive = menu.links.some((link) => isLinkActive(link.href))

                return (
                  <div key={menu.key} className="relative">
                    <button
                      type="button"
                      className={`${navButtonBase} ${isMenuActive ? 'bg-cyan-200 text-[#032541]' : 'bg-white/10 text-slate-100 hover:bg-white/20'}`}
                      aria-expanded={isOpen}
                      aria-haspopup="menu"
                      aria-controls={`menu-${menu.key}`}
                      onClick={() => setOpenMenu(isOpen ? null : menu.key)}
                    >
                      {menu.label}
                    </button>

                    {isOpen && (
                      <div
                        id={`menu-${menu.key}`}
                        className="absolute left-0 top-[calc(100%+8px)] z-20 w-48 rounded-xl border border-white/15 bg-[#07253d] p-1.5 shadow-xl animate-dropdown"
                        role="menu"
                      >
                        {menu.links.map((link) => (
                          <Link
                            key={link.href}
                            href={link.href}
                            className={`block rounded-lg px-3 py-2 text-sm transition-colors ${
                              isLinkActive(link.href) ? 'bg-cyan-200 text-[#032541]' : 'text-slate-100 hover:bg-[#0f3b5d]'
                            }`}
                            aria-current={isLinkActive(link.href) ? 'page' : undefined}
                            role="menuitem"
                            onClick={() => setOpenMenu(null)}
                          >
                            {link.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            <div className="flex w-full items-center gap-2 sm:gap-3 lg:w-auto">
              <form
                className="flex min-w-0 flex-1 items-center gap-2 rounded-full border border-cyan-300/40 bg-[#0c3a5c]/90 px-3 py-2 shadow-[0_0_20px_rgba(34,211,238,0.18)] transition-all duration-300 focus-within:border-cyan-200 focus-within:shadow-[0_0_28px_rgba(34,211,238,0.48)] lg:w-[360px]"
                onSubmit={handleSearchSubmit}
                role="search"
              >
                <FaSearch aria-hidden="true" focusable="false" className="shrink-0 text-cyan-100" />
                <label htmlFor="movie-search" className="sr-only">
                  Search movies
                </label>
                <input
                  id="movie-search"
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  autoComplete="off"
                  placeholder="Search movies, TV shows, people..."
                  className="w-full appearance-none border-0 bg-transparent text-sm text-white shadow-none outline-none placeholder:text-slate-300 focus:border-0 focus:outline-none focus:ring-0 focus-visible:border-0 focus-visible:outline-none focus-visible:ring-0"
                />
              </form>

              <Link
                id="favorites-nav-button"
                className={`${navButtonBase} ${isLinkActive('/favorites') ? 'bg-white text-[#032541]' : 'bg-slate-100 text-[#032541] hover:bg-white'}`}
                href="/favorites"
                aria-current={isLinkActive('/favorites') ? 'page' : undefined}
              >
                Favorites
              </Link>
              <Link
                className={`${navButtonBase} ${isLinkActive('/support') ? 'bg-cyan-300 text-[#032541]' : 'bg-cyan-400/90 text-[#032541] hover:brightness-110'}`}
                href="/support"
                aria-current={isLinkActive('/support') ? 'page' : undefined}
              >
                Support
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </header>
  )
}
