'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import type { Movie } from '@/store'

const FAVORITES_KEY = 'moviehub:favorites'
const FAVORITES_UPDATED_EVENT = 'moviehub:favorites-updated'

function readFavorites(): Movie[] {
  if (typeof window === 'undefined') return []

  try {
    const stored = window.localStorage.getItem(FAVORITES_KEY)
    if (!stored) return []
    const parsed = JSON.parse(stored)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function writeFavorites(nextFavorites: Movie[]) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(FAVORITES_KEY, JSON.stringify(nextFavorites))
  window.dispatchEvent(new Event(FAVORITES_UPDATED_EVENT))
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<Movie[]>([])

  useEffect(() => {
    const sync = () => setFavorites(readFavorites())
    sync()

    window.addEventListener('storage', sync)
    window.addEventListener(FAVORITES_UPDATED_EVENT, sync)

    return () => {
      window.removeEventListener('storage', sync)
      window.removeEventListener(FAVORITES_UPDATED_EVENT, sync)
    }
  }, [])

  const favoriteIds = useMemo(() => new Set(favorites.map((movie) => movie.id)), [favorites])

  const isFavorite = useCallback((movieId: number) => favoriteIds.has(movieId), [favoriteIds])

  const toggleFavorite = useCallback((movie: Movie) => {
    const current = readFavorites()
    const exists = current.some((item) => item.id === movie.id)
    const next = exists ? current.filter((item) => item.id !== movie.id) : [movie, ...current]
    writeFavorites(next)
    setFavorites(next)
  }, [])

  return { favorites, isFavorite, toggleFavorite }
}
