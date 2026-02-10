'use client'

import { FormEvent, Suspense, useCallback, useEffect, useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import MovieRow from '@/components/MovieRow'
import { playTrailer } from '@/lib/trailer'
import type { Movie } from '@/store'

interface SearchResponse {
  results: SearchItem[]
}

interface SearchItem {
  id: number
  title?: string
  name?: string
  poster_path?: string | null
  backdrop_path?: string | null
  profile_path?: string | null
  vote_average?: number
  release_date?: string
  first_air_date?: string
}

function SearchPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const urlQuery = useMemo(() => (searchParams?.get('q') || '').trim(), [searchParams])
  const [inputValue, setInputValue] = useState(urlQuery)
  const [results, setResults] = useState<Movie[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    setInputValue(urlQuery)
  }, [urlQuery])

  const handlePlayTrailer = useCallback(async (movieId: number) => {
    try {
      await playTrailer(movieId, 'movie')
    } catch {
      alert('Trailer not available')
    }
  }, [])

  useEffect(() => {
    let isMounted = true

    const runSearch = async () => {
      if (!urlQuery) {
        setResults([])
        setError('')
        return
      }

      try {
        setIsLoading(true)
        setError('')
        const response = await fetch(
          `https://api.themoviedb.org/3/search/multi?query=${encodeURIComponent(urlQuery)}&include_adult=false&language=en-US&page=1&api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`
        )

        if (!response.ok) {
          throw new Error('Unable to search right now')
        }

        const data: SearchResponse = await response.json()
        if (isMounted) {
          const normalized: Movie[] = (data.results || []).map((item) => ({
            ...item,
            poster_path: item.poster_path ?? item.profile_path ?? null,
            backdrop_path: item.backdrop_path ?? item.poster_path ?? item.profile_path ?? null,
            title: item.title ?? item.name,
            vote_average: item.vote_average ?? 0,
            release_date: item.release_date ?? item.first_air_date,
          }))
          setResults(normalized.filter((item) => item.poster_path))
        }
      } catch {
        if (isMounted) {
          setError('Search is temporarily unavailable. Please try again.')
          setResults([])
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    runSearch()

    return () => {
      isMounted = false
    }
  }, [urlQuery])

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const nextQuery = inputValue.trim()
    if (!nextQuery) return
    router.push(`/search?q=${encodeURIComponent(nextQuery)}`)
  }

  return (
    <main className="min-h-screen text-white">
      <section className="mx-auto max-w-6xl rounded-3xl border border-white/10 bg-slate-900/45 p-5 sm:p-8">
        <h1 className="text-3xl font-bold sm:text-4xl">Search</h1>
        <p className="mt-2 text-slate-300">Find movies, TV shows, and people instantly.</p>

        <form
          onSubmit={handleSubmit}
          className="mt-6 flex gap-2 rounded-2xl border border-cyan-300/20 bg-[#0f3b5d]/75 p-2"
          role="search"
        >
          <label htmlFor="global-search" className="sr-only">
            Search
          </label>
          <input
            id="global-search"
            type="search"
            value={inputValue}
            onChange={(event) => setInputValue(event.target.value)}
            placeholder="Search for Avatar, Breaking Bad, Zendaya..."
            className="w-full rounded-xl bg-transparent px-3 py-2 outline-none placeholder:text-slate-300"
          />
          <button
            type="submit"
            className="rounded-xl border border-cyan-300/30 bg-cyan-500/25 px-5 py-2 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-500/35"
          >
            Search
          </button>
        </form>
      </section>

      <section className="mx-auto max-w-7xl px-1 pt-8">
        {isLoading && <p className="text-slate-300">Searching...</p>}
        {!isLoading && error && <p className="text-red-300">{error}</p>}
        {!isLoading && !error && urlQuery && results.length === 0 && (
          <p className="text-slate-300">No results found for &quot;{urlQuery}&quot;.</p>
        )}
        {!isLoading && results.length > 0 && (
          <MovieRow title={`Results for "${urlQuery}"`} movies={results} handlePlayTrailer={handlePlayTrailer} />
        )}
      </section>
    </main>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={<main className="min-h-screen text-white p-6">Loading search...</main>}>
      <SearchPageContent />
    </Suspense>
  )
}
