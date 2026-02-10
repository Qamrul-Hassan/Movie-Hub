'use client'

import { useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Image from 'next/image'
import { FaPlay, FaStar } from 'react-icons/fa'
import MovieRow from '@/components/MovieRow'
import { playTrailer } from '@/lib/trailer'
import { fetchPopular } from '@/store'
import type { AppDispatch, RootState } from '@/store'

export default function PopularMoviesPage() {
  const dispatch = useDispatch<AppDispatch>()
  const popular = useSelector((state: RootState) => state.movies.popular)
  const hero = popular[0]

  useEffect(() => {
    dispatch(fetchPopular())
  }, [dispatch])

  const handlePlayTrailer = useCallback(async (movieId: number) => {
    try {
      await playTrailer(movieId, 'movie')
    } catch {
      alert('Trailer not available')
    }
  }, [])

  return (
    <main className="min-h-screen text-white">
      {hero && (
        <section className="relative mx-auto max-w-7xl overflow-hidden rounded-3xl border border-white/10" aria-label="Popular hero">
          <div className="relative h-[50vh] min-h-[320px] w-full">
            <Image
              src={`https://image.tmdb.org/t/p/original${hero.backdrop_path || hero.poster_path}`}
              alt={hero.title || hero.name || 'Popular movie'}
              fill
              priority
              className="object-cover brightness-[0.6]"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/35 to-transparent" />
            <div className="relative z-10 flex h-full items-end p-5 sm:p-8">
              <div className="max-w-2xl">
                <h1 className="text-3xl font-black leading-tight sm:text-5xl">{hero.title || hero.name}</h1>
                <p className="mt-3 flex items-center gap-2 text-base text-slate-200">
                  <FaStar className="text-amber-400" aria-hidden="true" />
                  {(hero.vote_average ?? 0).toFixed(1)} | {hero.release_date?.slice(0, 4)}
                </p>
                <button
                  className="mt-5 inline-flex items-center gap-2 rounded-full border border-red-300/35 bg-red-600/85 px-5 py-2.5 text-sm font-semibold transition hover:bg-red-500"
                  onClick={() => handlePlayTrailer(hero.id)}
                  type="button"
                >
                  <FaPlay aria-hidden="true" />
                  Play Trailer
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="mx-auto max-w-7xl pt-7">
        <MovieRow title="Popular Movies" movies={popular} handlePlayTrailer={handlePlayTrailer} />
      </section>
    </main>
  )
}
