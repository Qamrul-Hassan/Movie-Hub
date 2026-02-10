'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { FaFilm, FaSearch } from 'react-icons/fa'
import { useEffect, useRef, useState } from 'react'

type MenuKey = 'movies' | 'tvshows' | 'people' | 'kids' | 'more'

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
    key: 'kids',
    label: 'Kids Zone',
    links: [
      { href: '/kids/animated', label: 'Animated' },
      { href: '/kids/cartoons', label: 'Cartoons' },
      { href: '/kids/family', label: 'Family' },
    ],
  },
  {
    key: 'more',
    label: 'More',
    links: [
      { href: '/countries', label: 'Countries' },
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
  const [mobilePanelOpen, setMobilePanelOpen] = useState(false)
  const navRef = useRef<HTMLElement>(null)
  const pathname = usePathname()
  const router = useRouter()
  const currentPath = pathname || ''

  const isLinkActive = (href: string) => currentPath === href || currentPath.startsWith(`${href}/`)

  useEffect(() => {
    setOpenMenu(null)
    setMobilePanelOpen(false)
  }, [pathname])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setOpenMenu(null)
        setMobilePanelOpen(false)
      }
    }

    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpenMenu(null)
        setMobilePanelOpen(false)
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
    setMobilePanelOpen(false)
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-[#031c30]/90 backdrop-blur-xl">
      <nav ref={navRef} className="flex w-full flex-col gap-3 px-3 py-3 sm:px-6 lg:px-10" aria-label="Primary">
        <div className="rounded-2xl border border-white/10 bg-gradient-to-r from-[#0b2e4a] via-[#0f3656] to-[#0c2e48] p-3 shadow-[0_14px_35px_rgba(0,0,0,0.35)] sm:p-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 pr-2 sm:pr-0">
              <Link href="/" className="inline-flex items-center gap-2 pr-1">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-300 text-[#032541]">
                  <FaFilm aria-hidden="true" />
                </span>
                <span className="text-xl font-black tracking-tight text-white sm:text-2xl">Movie Hub</span>
              </Link>
              <Link
                href="/"
                className={`md:hidden inline-flex items-center justify-center rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                  pathname === '/'
                    ? 'bg-cyan-300 text-[#032541] shadow-[0_0_16px_rgba(34,211,238,0.55)]'
                    : 'bg-cyan-400/90 text-[#032541] shadow-[0_0_12px_rgba(34,211,238,0.35)]'
                }`}
                aria-current={currentPath === '/' ? 'page' : undefined}
              >
                Home
              </Link>
            </div>

            <button
              type="button"
              aria-label="Toggle menu"
              className="relative inline-flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-300/35 bg-[#0c3a5c]/90 text-cyan-100 shadow-[0_0_18px_rgba(34,211,238,0.2)] transition md:hidden"
              onClick={() => setMobilePanelOpen((open) => !open)}
            >
              <span className="relative h-5 w-5">
                <span
                  className={`absolute left-0 top-0 h-2 w-2 rounded-full bg-cyan-200 transition-all duration-300 ${mobilePanelOpen ? 'translate-x-[6px] translate-y-[6px] scale-90' : ''}`}
                />
                <span
                  className={`absolute right-0 top-0 h-2 w-2 rounded-full bg-cyan-200 transition-all duration-300 ${mobilePanelOpen ? '-translate-x-[6px] translate-y-[6px] scale-90' : ''}`}
                />
                <span
                  className={`absolute left-0 bottom-0 h-2 w-2 rounded-full bg-cyan-200 transition-all duration-300 ${mobilePanelOpen ? 'translate-x-[6px] -translate-y-[6px] scale-90' : ''}`}
                />
                <span
                  className={`absolute right-0 bottom-0 h-2 w-2 rounded-full bg-cyan-200 transition-all duration-300 ${mobilePanelOpen ? '-translate-x-[6px] -translate-y-[6px] scale-90' : ''}`}
                />
              </span>
            </button>

            <div className="hidden min-w-0 flex-wrap items-center gap-2 sm:gap-3 md:flex">
              <Link
                href="/"
                className={`${navButtonBase} ${currentPath === '/' ? 'bg-white text-[#032541] shadow-sm' : 'bg-white/10 text-slate-100 hover:bg-white/20'}`}
                aria-current={currentPath === '/' ? 'page' : undefined}
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

            <div className="hidden items-center gap-2 md:flex">
              <form
                className="flex min-w-0 items-center gap-2 rounded-full border border-cyan-300/40 bg-[#0c3a5c]/90 px-3 py-2 shadow-[0_0_20px_rgba(34,211,238,0.18)] transition-all duration-300 focus-within:border-cyan-200 focus-within:shadow-[0_0_28px_rgba(34,211,238,0.48)] md:w-[360px] lg:w-[430px]"
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
                className={`${navButtonBase} ${isLinkActive('/favorites') ? 'bg-red-500 text-white shadow-[0_0_22px_rgba(239,68,68,0.55)]' : 'bg-slate-100 text-[#032541] shadow-[0_0_10px_rgba(239,68,68,0.2)] hover:bg-red-500 hover:text-white hover:shadow-[0_0_20px_rgba(239,68,68,0.5)]'}`}
                href="/favorites"
                aria-current={isLinkActive('/favorites') ? 'page' : undefined}
              >
                Favorites
              </Link>
              <Link
                className={`${navButtonBase} ${isLinkActive('/support') ? 'bg-cyan-300 text-[#032541] shadow-[0_0_24px_rgba(34,211,238,0.58)]' : 'bg-cyan-400/90 text-[#032541] shadow-[0_0_12px_rgba(34,211,238,0.34)] hover:brightness-110 hover:shadow-[0_0_24px_rgba(34,211,238,0.56)]'}`}
                href="/support"
                aria-current={isLinkActive('/support') ? 'page' : undefined}
              >
                Support
              </Link>
            </div>
          </div>

          <div className="mt-3 flex w-full items-center gap-2 sm:gap-3 md:hidden">
            <form
              className="flex min-w-0 flex-1 items-center gap-2 rounded-full border border-cyan-300/40 bg-[#0c3a5c]/90 px-3 py-2 shadow-[0_0_20px_rgba(34,211,238,0.18)] transition-all duration-300 focus-within:border-cyan-200 focus-within:shadow-[0_0_28px_rgba(34,211,238,0.48)]"
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
          </div>

          {mobilePanelOpen && (
            <div className="mt-3 space-y-2 rounded-xl border border-white/15 bg-[#082d4a]/95 p-3 md:hidden motion-safe:animate-fade-in">
              <Link
                href="/"
                className={`${navButtonBase} w-full justify-center ${currentPath === '/' ? 'bg-cyan-300 text-[#032541] shadow-[0_0_18px_rgba(34,211,238,0.45)]' : 'bg-white/10 text-slate-100'}`}
                aria-current={currentPath === '/' ? 'page' : undefined}
              >
                Home
              </Link>

              {navMenus.map((menu) => {
                const isOpen = openMenu === menu.key
                const isMenuActive = menu.links.some((link) => isLinkActive(link.href))

                return (
                  <div key={menu.key} className="rounded-lg border border-white/10 bg-[#0b3658]/70 p-2">
                    <button
                      type="button"
                      className={`${navButtonBase} w-full justify-between ${isMenuActive ? 'bg-cyan-200 text-[#032541]' : 'bg-white/10 text-slate-100'}`}
                      aria-expanded={isOpen}
                      onClick={() => setOpenMenu(isOpen ? null : menu.key)}
                    >
                      {menu.label}
                      <span className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}>v</span>
                    </button>
                    {isOpen && (
                      <div className="mt-2 grid gap-1">
                        {menu.links.map((link) => (
                          <Link
                            key={link.href}
                            href={link.href}
                            className={`rounded-lg px-3 py-2 text-sm ${
                              isLinkActive(link.href) ? 'bg-cyan-200 text-[#032541]' : 'text-slate-100 hover:bg-[#0f3b5d]'
                            }`}
                            aria-current={isLinkActive(link.href) ? 'page' : undefined}
                          >
                            {link.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}

              <div className="grid grid-cols-2 gap-2 pt-1">
                <Link
                  className={`${navButtonBase} ${isLinkActive('/favorites') ? 'bg-red-500 text-white shadow-[0_0_22px_rgba(239,68,68,0.55)]' : 'bg-slate-100 text-[#032541] shadow-[0_0_10px_rgba(239,68,68,0.2)] hover:bg-red-500 hover:text-white hover:shadow-[0_0_20px_rgba(239,68,68,0.5)]'}`}
                  href="/favorites"
                  aria-current={isLinkActive('/favorites') ? 'page' : undefined}
                >
                  Favorites
                </Link>
                <Link
                  className={`${navButtonBase} ${isLinkActive('/support') ? 'bg-cyan-300 text-[#032541] shadow-[0_0_24px_rgba(34,211,238,0.58)]' : 'bg-cyan-400/90 text-[#032541] shadow-[0_0_12px_rgba(34,211,238,0.34)] hover:brightness-110 hover:shadow-[0_0_24px_rgba(34,211,238,0.56)]'}`}
                  href="/support"
                  aria-current={isLinkActive('/support') ? 'page' : undefined}
                >
                  Support
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>
    </header>
  )
}
