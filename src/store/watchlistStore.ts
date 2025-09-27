import { create } from 'zustand'

interface Movie {
  id: number
  title: string
  poster_path: string
  release_date: string
}

interface WatchlistState {
  items: Movie[]
  addItem: (movie: Movie) => void
  removeItem: (id: number) => void
}

export const useWatchlistStore = create<WatchlistState>((set) => ({
  items: [],
  addItem: (movie) => set((state) => ({ items: [...state.items, movie] })),
  removeItem: (id) => set((state) => ({ items: state.items.filter((m) => m.id !== id) })),
}))
