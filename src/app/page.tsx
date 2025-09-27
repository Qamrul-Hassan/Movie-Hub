'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import { mockMovies } from '@/lib/mockMovies'
import { useWatchlistStore } from '@/store/watchlistStore'

export default function Home() {
  const [movies, setMovies] = useState<
    { id: number; title: string; poster_path: string; release_date: string; vote_average?: number; trailer?: string }[]
  >([])
  const [trailerUrl, setTrailerUrl] = useState<string | null>(null)

  const addToWatchlist = useWatchlistStore((state) => state.addItem)
  const watchlist = useWatchlistStore((state) => state.items)

  useEffect(() => {
    setMovies(mockMovies)
  }, [])

  return (
    <section className="p-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
      {movies.map((movie) => (
        <div
          key={movie.id}
          className="bg-background dark:bg-gray-900 rounded-lg shadow-md overflow-hidden flex flex-col relative"
        >
          {/* Poster */}
          {movie.poster_path ? (
            <Image
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              width={500}
              height={750}
              className="object-cover w-full h-[300px]"
            />
          ) : (
            <div className="bg-gray-200 dark:bg-gray-700 w-full h-[300px] flex items-center justify-center">
              No Image
            </div>
          )}

          <div className="p-4 flex flex-col flex-1 justify-between">
            {/* Title & Release */}
            <h2 className="text-lg font-semibold mb-1">{movie.title}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
              Release: {movie.release_date}
            </p>

            {/* Ratings */}
            <div className="flex items-center gap-1 mb-2">
              <span className="text-yellow-400">★</span>
              <span className="font-medium">{movie.vote_average ?? '8.5'}</span>
            </div>

            {/* Buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => addToWatchlist(movie)}
                disabled={watchlist.some((m) => m.id === movie.id)}
                className={`py-1 px-2 rounded-md text-white font-medium transition-colors ${
                  watchlist.some((m) => m.id === movie.id)
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-primary hover:bg-secondary'
                }`}
              >
                {watchlist.some((m) => m.id === movie.id) ? 'Added' : 'Watchlist'}
              </button>

              <button
                onClick={() =>
                  setTrailerUrl(
                    movie.trailer || 'https://www.youtube.com/embed/dQw4w9WgXcQ'
                  )
                }
                className="py-1 px-2 rounded-md bg-red-600 hover:bg-red-700 text-white font-medium"
              >
                Play Trailer
              </button>
            </div>
          </div>
        </div>
      ))}

      {/* Trailer Modal */}
      {trailerUrl && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
          onClick={() => setTrailerUrl(null)}
        >
          <iframe
            src={trailerUrl}
            width="800"
            height="450"
            className="rounded-lg shadow-lg"
            allow="autoplay; encrypted-media"
            allowFullScreen
            onClick={(e) => e.stopPropagation()}
          ></iframe>
        </div>
      )}
    </section>
  )
}
