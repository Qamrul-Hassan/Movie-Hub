'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useCallback, useEffect, useMemo, useState } from 'react'
import MovieRow from '@/components/MovieRow'
import { countryCategories, countryLabelMap, isCountryKey } from '@/lib/countries'
import { playTrailer } from '@/lib/trailer'
import type { Movie } from '@/store'

type TMDBItem = {
  id: number
  title?: string
  name?: string
  poster_path?: string | null
  backdrop_path?: string | null
  vote_average?: number
  release_date?: string
  first_air_date?: string
}

const normalizeItems = (items: TMDBItem[]): Movie[] =>
  items.map((item) => ({
    ...item,
    title: item.title ?? item.name,
    release_date: item.release_date ?? item.first_air_date,
    poster_path: item.poster_path ?? null,
    backdrop_path: item.backdrop_path ?? item.poster_path ?? null,
    vote_average: item.vote_average ?? 0,
  }))

export default function CountryDetailsPage() {
  const params = useParams<{ country: string }>()
  const countryParam = params?.country ?? 'en'
  const country = isCountryKey(countryParam) ? countryParam : 'en'
  const countryLabel = countryLabelMap[country]

  const [dramaMovies, setDramaMovies] = useState<Movie[]>([])
  const [tvSeries, setTvSeries] = useState<Movie[]>([])
  const [loading, setLoading] = useState(true)

  const availableOtherCountries = useMemo(
    () => countryCategories.filter((item) => item.key !== country),
    [country]
  )

  useEffect(() => {
    let isMounted = true

    const fetchCountryMedia = async () => {
      setLoading(true)
      try {
        const [moviesResponse, tvResponse] = await Promise.all([
          fetch(
            `https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc&with_original_language=${country}&with_genres=18&api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`
          ),
          fetch(
            `https://api.themoviedb.org/3/discover/tv?include_adult=false&include_null_first_air_dates=false&language=en-US&page=1&sort_by=popularity.desc&with_original_language=${country}&api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`
          ),
        ])

        if (!moviesResponse.ok || !tvResponse.ok) {
          throw new Error('Country media unavailable')
        }

        const [moviesData, tvData] = await Promise.all([moviesResponse.json(), tvResponse.json()])
        if (!isMounted) return

        setDramaMovies(normalizeItems(moviesData.results || []))
        setTvSeries(normalizeItems(tvData.results || []))
      } catch {
        if (isMounted) {
          setDramaMovies([])
          setTvSeries([])
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    fetchCountryMedia()
    return () => {
      isMounted = false
    }
  }, [country])

  const handlePlayMovieTrailer = useCallback(async (movieId: number) => {
    try {
      await playTrailer(movieId, 'movie')
    } catch {
      alert('Trailer not available')
    }
  }, [])

  const handlePlayTvTrailer = useCallback(async (tvId: number) => {
    try {
      await playTrailer(tvId, 'tv')
    } catch {
      alert('Trailer not available')
    }
  }, [])

  return (
    <main className="min-h-screen text-white">
      <section className="pt-2" aria-label={`${countryLabel} media`}>
        <div className="glass-country-card mb-4 p-4 sm:p-5">
          <h1 className="text-2xl font-semibold sm:text-3xl">{countryLabel} Spotlight</h1>
          <p className="mt-2 text-sm text-slate-300">
            Popular drama movies and TV series in {countryLabel}.
          </p>
          <div className="country-chip-wrap mt-4">
            {availableOtherCountries.map((item) => (
              <Link
                key={item.key}
                href={`/countries/${item.key}`}
                className="country-chip"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {loading ? (
        <p className="text-slate-300">Loading country content...</p>
      ) : (
        <section className="space-y-8 pt-2" aria-label="Country results">
          <MovieRow
            title={`${countryLabel} Popular Dramas`}
            movies={dramaMovies}
            handlePlayTrailer={handlePlayMovieTrailer}
            mediaType="movie"
          />
          <MovieRow
            title={`${countryLabel} Popular TV Series`}
            movies={tvSeries}
            handlePlayTrailer={handlePlayTvTrailer}
            mediaType="tv"
          />
        </section>
      )}
    </main>
  )
}
