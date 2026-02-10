'use client'

import Link from 'next/link'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useParams } from 'next/navigation'
import MovieRow from '@/components/MovieRow'
import { playTrailer } from '@/lib/trailer'
import type { Movie } from '@/store'

type SectionKey = 'movies' | 'tv' | 'people'

const catalogConfig: Record<
  SectionKey,
  Record<string, { title: string; endpoint: string; mediaType: 'movie' | 'tv' | 'person' }>
> = {
  movies: {
    popular: { title: 'Popular Movies', endpoint: '/movie/popular?language=en-US&page=1', mediaType: 'movie' },
    'now-playing': { title: 'Now Playing Movies', endpoint: '/movie/now_playing?language=en-US&page=1', mediaType: 'movie' },
    upcoming: { title: 'Upcoming Movies', endpoint: '/movie/upcoming?language=en-US&page=1', mediaType: 'movie' },
    'top-rated': { title: 'Top Rated Movies', endpoint: '/movie/top_rated?language=en-US&page=1', mediaType: 'movie' },
  },
  tv: {
    popular: { title: 'Popular TV Shows', endpoint: '/tv/popular?language=en-US&page=1', mediaType: 'tv' },
    'airing-today': { title: 'Airing Today', endpoint: '/tv/airing_today?language=en-US&page=1', mediaType: 'tv' },
    'on-tv': { title: 'On TV', endpoint: '/tv/on_the_air?language=en-US&page=1', mediaType: 'tv' },
    'top-rated': { title: 'Top Rated TV Shows', endpoint: '/tv/top_rated?language=en-US&page=1', mediaType: 'tv' },
  },
  people: {
    popular: { title: 'Popular People', endpoint: '/person/popular?language=en-US&page=1', mediaType: 'person' },
  },
}

interface TMDBListItem {
  id: number
  title?: string
  name?: string
  poster_path?: string | null
  profile_path?: string | null
  vote_average?: number
  release_date?: string
  first_air_date?: string
}

export default function SectionCategoryPage() {
  const params = useParams<{ section: string; slug: string }>()
  const section = params.section as SectionKey
  const slug = params.slug

  const config = useMemo(() => catalogConfig[section]?.[slug], [section, slug])
  const [items, setItems] = useState<Movie[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    const run = async () => {
      if (!config) return
      try {
        setIsLoading(true)
        setError('')
        const response = await fetch(
          `https://api.themoviedb.org/3${config.endpoint}&api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`
        )

        if (!response.ok) {
          throw new Error('Unable to fetch catalog')
        }

        const data = await response.json()
        if (!isMounted) return

        const normalized = (data.results || []).map((item: TMDBListItem): Movie => ({
          ...item,
          poster_path: item.poster_path ?? item.profile_path ?? null,
          title: item.title ?? item.name,
          vote_average: item.vote_average ?? 0,
          release_date: item.release_date ?? item.first_air_date,
        }))

        setItems(normalized)
      } catch {
        if (isMounted) {
          setError('Could not load this section. Please try again.')
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    run()
    return () => {
      isMounted = false
    }
  }, [config])

  const handlePlayTrailer = useCallback(
    async (id: number) => {
      if (!config || config.mediaType === 'person') return
      try {
        await playTrailer(id, config.mediaType)
      } catch {
        alert('Trailer not available')
      }
    },
    [config]
  )

  if (!config) {
    return (
      <main className="min-h-screen text-white">
        <section className="mx-auto max-w-3xl rounded-2xl border border-white/10 bg-slate-900/50 p-6 sm:p-8">
          <h1 className="text-2xl font-bold">Page not found</h1>
          <p className="mt-2 text-slate-300">This section does not exist yet.</p>
          <Link href="/" className="mt-5 inline-flex rounded-full bg-cyan-300 px-4 py-2 text-sm font-semibold text-[#032541]">
            Go Home
          </Link>
        </section>
      </main>
    )
  }

  return (
    <main className="min-h-screen text-white">
      <section className="mx-auto max-w-7xl rounded-3xl border border-white/10 bg-slate-900/45 p-5 sm:p-8">
        <h1 className="text-3xl font-bold sm:text-4xl">{config.title}</h1>
      </section>

      <section className="mx-auto max-w-7xl pt-7">
        {isLoading && <p className="text-slate-300">Loading...</p>}
        {!isLoading && error && <p className="text-red-300">{error}</p>}
        {!isLoading && !error && (
          <MovieRow
            movies={items}
            handlePlayTrailer={config.mediaType === 'person' ? undefined : handlePlayTrailer}
          />
        )}
      </section>
    </main>
  )
}
