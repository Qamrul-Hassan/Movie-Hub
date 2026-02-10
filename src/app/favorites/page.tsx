'use client'

import { useCallback } from 'react'
import MovieRow from '@/components/MovieRow'
import { useFavorites } from '@/hooks/useFavorites'
import { playTrailer } from '@/lib/trailer'

export default function FavoritesPage() {
  const { favorites } = useFavorites()

  const handlePlayTrailer = useCallback(async (movieId: number) => {
    try {
      await playTrailer(movieId, 'movie')
    } catch {
      alert('Trailer not available')
    }
  }, [])

  return (
    <main className="min-h-screen text-white">
      <section className="max-w-7xl mx-auto rounded-3xl border border-white/10 bg-slate-900/45 px-4 py-8 sm:px-6">
        <h1 className="text-3xl sm:text-4xl font-bold">Favorites</h1>
        <p className="text-gray-300 mt-2">All movies and shows you marked as favorite.</p>
      </section>

      <section className="max-w-7xl mx-auto px-4 pb-12">
        {favorites.length > 0 ? (
          <MovieRow
            title="Your Favorites"
            movies={favorites}
            handlePlayTrailer={handlePlayTrailer}
            showRemoveFavorite
          />
        ) : (
          <div className="rounded-2xl border border-slate-700 bg-slate-900/70 p-6">
            <p className="text-gray-300">No favorites yet. Tap the Favorite button on any card to save it here.</p>
          </div>
        )}
      </section>
    </main>
  )
}
