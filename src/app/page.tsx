'use client'

import { useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Image from 'next/image'
import Link from 'next/link'
import { FaPlay, FaStar } from 'react-icons/fa'
import MovieRow from '@/components/MovieRow'
import { countryCategories } from '@/lib/countries'
import { playTrailer } from '@/lib/trailer'
import {
  fetchPopular,
  fetchTopRated,
  fetchTrailers,
  fetchTrending,
  setTrailersTime,
  setTrendingTime,
} from '@/store'
import type { AppDispatch, RootState } from '@/store'

export default function Home() {
  const dispatch = useDispatch<AppDispatch>()
  const { trending, popular, topRated, hero, trailers, trendingTime, trailersTime } = useSelector(
    (state: RootState) => state.movies
  )

  useEffect(() => {
    dispatch(fetchTrending(trendingTime))
    dispatch(fetchPopular())
    dispatch(fetchTopRated())
  }, [dispatch, trendingTime])

  useEffect(() => {
    dispatch(fetchTrailers(trailersTime))
  }, [dispatch, trailersTime])

  const handlePlayTrailer = useCallback(async (movieId: number) => {
    try {
      await playTrailer(movieId, 'movie')
    } catch {
      alert('Trailer not available')
    }
  }, [])

  return (
    <main className="min-h-screen text-white">
      <section className="pt-2" aria-label="Browse by country">
        <div className="glass-country-card mb-4 p-3 sm:p-4">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-xl font-semibold sm:text-2xl">Browse by Country</h2>
            <p className="text-xs text-slate-300 sm:text-sm">Open a country page to see popular drama and TV series.</p>
          </div>
          <div className="country-chip-wrap">
            {countryCategories.map((category) => (
              <Link
                key={category.key}
                href={`/countries/${category.key}`}
                className="country-chip"
              >
                {category.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {hero && (
        <section className="relative mt-2 h-[55vh] min-h-[360px] w-full overflow-hidden rounded-3xl" aria-label="Featured movie">
          <Image
            src={`https://image.tmdb.org/t/p/original${hero.backdrop_path}`}
            alt={hero.title || hero.name || 'Hero movie'}
            fill
            className="object-cover brightness-[0.6]"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/35 to-transparent" />
          <div className="relative z-10 flex h-full items-end p-5 sm:p-8 lg:p-10 motion-safe:animate-fade-in">
            <div className="max-w-2xl">
              <h1 className="text-3xl font-black leading-tight sm:text-5xl lg:text-6xl">{hero.title || hero.name}</h1>
              <p className="mt-4 flex items-center gap-2 text-base text-slate-200 sm:text-lg">
                <FaStar className="text-amber-400" aria-hidden="true" />
                {hero.vote_average.toFixed(1)} | {hero.release_date?.slice(0, 4)}
              </p>
              <button
                className="mt-6 inline-flex items-center gap-2 rounded-full border border-red-300/35 bg-red-600/85 px-5 py-2.5 text-sm font-semibold transition hover:bg-red-500 sm:text-base"
                onClick={() => handlePlayTrailer(hero.id)}
                type="button"
              >
                <FaPlay aria-hidden="true" />
                Play Trailer
              </button>
            </div>
          </div>
        </section>
      )}

      <section className="glass-panel pt-7 px-4 pb-5 sm:px-5 sm:pb-6" aria-label="Trending movies">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-2xl font-semibold">Trending</h2>
          <div className="inline-flex rounded-full border border-white/15 bg-slate-900/60 p-1" role="tablist" aria-label="Trending period">
            <button
              className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${
                trendingTime === 'day' ? 'bg-cyan-300 text-[#032541]' : 'text-slate-100 hover:bg-white/10'
              }`}
              onClick={() => dispatch(setTrendingTime('day'))}
              type="button"
              aria-pressed={trendingTime === 'day'}
            >
              Today
            </button>
            <button
              className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${
                trendingTime === 'week' ? 'bg-cyan-300 text-[#032541]' : 'text-slate-100 hover:bg-white/10'
              }`}
              onClick={() => dispatch(setTrendingTime('week'))}
              type="button"
              aria-pressed={trendingTime === 'week'}
            >
              This Week
            </button>
          </div>
        </div>
        <MovieRow movies={trending} handlePlayTrailer={handlePlayTrailer} />
      </section>

      <section className="glass-panel mt-3 pt-5 px-4 pb-5 sm:px-5 sm:pb-6" aria-label="Latest trailers">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-2xl font-semibold">Latest Trailers</h2>
          <div className="inline-flex rounded-full border border-white/15 bg-slate-900/60 p-1" role="tablist" aria-label="Trailer type">
            <button
              className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${
                trailersTime === 'popular' ? 'bg-cyan-300 text-[#032541]' : 'text-slate-100 hover:bg-white/10'
              }`}
              onClick={() => dispatch(setTrailersTime('popular'))}
              type="button"
              aria-pressed={trailersTime === 'popular'}
            >
              Popular
            </button>
            <button
              className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${
                trailersTime === 'intheaters' ? 'bg-cyan-300 text-[#032541]' : 'text-slate-100 hover:bg-white/10'
              }`}
              onClick={() => dispatch(setTrailersTime('intheaters'))}
              type="button"
              aria-pressed={trailersTime === 'intheaters'}
            >
              In Theaters
            </button>
          </div>
        </div>
        <MovieRow movies={trailers} handlePlayTrailer={handlePlayTrailer} />
      </section>

      <section className="glass-panel mt-3 space-y-8 px-4 py-5 sm:px-5 sm:py-6" aria-label="Popular and top rated movies">
        <MovieRow title="Popular Movies" movies={popular} handlePlayTrailer={handlePlayTrailer} />
        <MovieRow title="Top Rated Movies" movies={topRated} handlePlayTrailer={handlePlayTrailer} />
      </section>
    </main>
  )
}
