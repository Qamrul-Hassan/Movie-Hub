'use client'

import Image from 'next/image'
import { useState } from 'react'
import { FaHeart, FaPlay, FaRegHeart, FaStar, FaTrashAlt } from 'react-icons/fa'
import { useFavorites } from '@/hooks/useFavorites'
import type { Movie } from '@/store'

interface MovieRowProps {
  title?: string
  movies: Movie[]
  handlePlayTrailer?: (id: number) => void
  showRemoveFavorite?: boolean
}

function createTrashImpactBurst(targetX: number, targetY: number) {
  if (typeof window === 'undefined') return
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

  const burstCount = 10
  for (let i = 0; i < burstCount; i += 1) {
    const dot = document.createElement('div')
    dot.style.position = 'fixed'
    dot.style.left = `${targetX}px`
    dot.style.top = `${targetY}px`
    dot.style.width = '8px'
    dot.style.height = '8px'
    dot.style.borderRadius = '999px'
    dot.style.pointerEvents = 'none'
    dot.style.zIndex = '9999'
    dot.style.background = i % 2 === 0 ? '#fb7185' : '#fde047'

    document.body.appendChild(dot)

    const angle = (Math.PI * 2 * i) / burstCount
    const distance = 28 + (i % 3) * 9
    const x = Math.cos(angle) * distance
    const y = Math.sin(angle) * distance

    const animation = dot.animate(
      [
        { transform: 'translate(-50%, -50%) scale(1)', opacity: 0.95 },
        { transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) scale(0.2)`, opacity: 0 },
      ],
      { duration: 460, easing: 'cubic-bezier(0.2, 0.7, 0.3, 1)', fill: 'forwards' }
    )

    animation.onfinish = () => dot.remove()
  }
}

function throwCardToGlobalTrash(sourceCard: HTMLElement) {
  if (typeof window === 'undefined') return
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

  const targetEl = document.getElementById('global-trash-target')
  if (!targetEl) return 0

  const sourceRect = sourceCard.getBoundingClientRect()
  const targetRect = targetEl.getBoundingClientRect()
  const startX = sourceRect.left + sourceRect.width / 2
  const startY = sourceRect.top + sourceRect.height / 2
  const endX = targetRect.left + targetRect.width / 2
  const endY = targetRect.top + targetRect.height / 2
  const deltaX = endX - startX
  const deltaY = endY - startY

  const clone = sourceCard.cloneNode(true) as HTMLElement
  clone.style.position = 'fixed'
  clone.style.left = `${sourceRect.left}px`
  clone.style.top = `${sourceRect.top}px`
  clone.style.width = `${sourceRect.width}px`
  clone.style.height = `${sourceRect.height}px`
  clone.style.margin = '0'
  clone.style.pointerEvents = 'none'
  clone.style.zIndex = '9998'
  clone.style.transformOrigin = 'center'
  clone.style.willChange = 'transform, opacity, filter'
  clone.style.boxShadow = '0 20px 45px rgba(0,0,0,0.5)'
  clone.style.border = '1px solid rgba(255,255,255,0.18)'

  document.body.appendChild(clone)
  const animation = clone.animate(
    [
      { transform: 'translate3d(0, 0, 0) scale(1) rotate(0deg)', opacity: 1, filter: 'blur(0px)', offset: 0 },
      { transform: 'translate3d(0, 0, 0) scaleX(1.08) scaleY(0.88) rotate(-2deg)', opacity: 1, filter: 'blur(0px)', offset: 0.18 },
      { transform: 'translate3d(0, 0, 0) scaleX(0.86) scaleY(1.14) rotate(3deg)', opacity: 1, filter: 'blur(0px)', offset: 0.3 },
      { transform: `translate3d(${deltaX * 0.32}px, ${Math.min(-90, deltaY * -0.35)}px, 0) scale(0.76) rotate(-9deg)`, opacity: 0.98, filter: 'blur(0.2px)', offset: 0.56 },
      { transform: `translate3d(${deltaX * 0.7}px, ${deltaY * 0.45}px, 0) scale(0.48) rotate(11deg)`, opacity: 0.9, filter: 'blur(0.5px)', offset: 0.84 },
      { transform: `translate3d(${deltaX}px, ${deltaY}px, 0) scale(0.1) rotate(18deg)`, opacity: 0, filter: 'blur(1px)', offset: 1 },
    ],
    { duration: 1200, easing: 'cubic-bezier(0.22, 1, 0.36, 1)', fill: 'forwards' }
  )

  animation.onfinish = () => {
    clone.remove()
    targetEl.animate(
      [
        { transform: 'scale(1) rotate(0deg)', boxShadow: '0 0 18px rgba(248, 113, 113, 0.35)' },
        { transform: 'scale(1.12) rotate(-2deg)', boxShadow: '0 0 40px rgba(251, 113, 133, 0.85)' },
        { transform: 'scale(0.96) rotate(2deg)', boxShadow: '0 0 24px rgba(248, 113, 113, 0.55)' },
        { transform: 'scale(1) rotate(0deg)', boxShadow: '0 0 20px rgba(248, 113, 113, 0.45)' },
      ],
      { duration: 500, easing: 'cubic-bezier(0.2, 0.7, 0.3, 1)' }
    )
    createTrashImpactBurst(endX, endY)
  }

  return 1200
}

function flyHeartToFavorites(sourceEl: HTMLElement) {
  if (typeof window === 'undefined') return
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

  const targetEl = document.getElementById('favorites-nav-button')
  if (!targetEl) return

  const sourceRect = sourceEl.getBoundingClientRect()
  const targetRect = targetEl.getBoundingClientRect()

  const startX = sourceRect.left + sourceRect.width / 2
  const startY = sourceRect.top + sourceRect.height / 2
  const endX = targetRect.left + targetRect.width / 2
  const endY = targetRect.top + targetRect.height / 2

  const heart = document.createElement('div')
  heart.innerHTML =
    '<svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true"><path fill="#fb7185" d="M12 21s-7.2-4.36-9.6-8.08C.49 9.9 1.3 6.1 4.3 4.58A5.2 5.2 0 0 1 12 6.36a5.2 5.2 0 0 1 7.7-1.78c3 1.52 3.81 5.32 1.9 8.34C19.2 16.64 12 21 12 21z"/></svg>'
  heart.style.position = 'fixed'
  heart.style.left = `${startX}px`
  heart.style.top = `${startY}px`
  heart.style.transform = 'translate(-50%, -50%)'
  heart.style.display = 'grid'
  heart.style.placeItems = 'center'
  heart.style.width = '28px'
  heart.style.height = '28px'
  heart.style.lineHeight = '1'
  heart.style.zIndex = '9999'
  heart.style.pointerEvents = 'none'
  heart.style.filter = 'drop-shadow(0 0 16px rgba(244,114,182,0.85))'
  heart.style.textShadow = '0 0 18px rgba(244,114,182,0.95)'

  document.body.appendChild(heart)

  const deltaX = endX - startX
  const deltaY = endY - startY
  const arcY = Math.min(-90, deltaY - 80)

  const animation = heart.animate(
    [
      { transform: 'translate(-50%, -50%) scale(0.9)', opacity: 0.95, offset: 0 },
      {
        transform: `translate(calc(-50% + ${deltaX * 0.36}px), calc(-50% + ${arcY}px)) scale(2.2)`,
        opacity: 1,
        offset: 0.48,
      },
      {
        transform: `translate(calc(-50% + ${deltaX * 0.74}px), calc(-50% + ${deltaY * 0.62}px)) scale(1.25)`,
        opacity: 0.95,
        offset: 0.78,
      },
      { transform: `translate(calc(-50% + ${deltaX}px), calc(-50% + ${deltaY}px)) scale(0.55)`, opacity: 0.2, offset: 1 },
    ],
    { duration: 1400, easing: 'cubic-bezier(0.22, 1, 0.36, 1)', fill: 'forwards' }
  )

  animation.onfinish = () => {
    heart.remove()
    targetEl.classList.add('animate-favorites-target-pulse')
    window.setTimeout(() => {
      targetEl.classList.remove('animate-favorites-target-pulse')
    }, 700)
  }
}

export default function MovieRow({ title, movies, handlePlayTrailer, showRemoveFavorite = false }: MovieRowProps) {
  const { isFavorite, toggleFavorite } = useFavorites()
  const [removingId, setRemovingId] = useState<number | null>(null)
  const [justAddedId, setJustAddedId] = useState<number | null>(null)
  const [showGlobalTrash, setShowGlobalTrash] = useState(false)

  const handleRemoveFavorite = (movie: Movie, event: React.MouseEvent<HTMLButtonElement>) => {
    setRemovingId(movie.id)
    const card = event.currentTarget.closest('article') as HTMLElement | null
    // Show trash slightly after click so the throw feels staged, not instant.
    window.setTimeout(() => {
      setShowGlobalTrash(true)
    }, 160)

    // Ensure trash target is mounted before starting throw animation.
    window.setTimeout(() => {
      const duration = card ? throwCardToGlobalTrash(card) : 0
      const effectiveDuration = duration || 1200

      window.setTimeout(() => {
        toggleFavorite(movie)
        setRemovingId((current) => (current === movie.id ? null : current))
      }, effectiveDuration)

      window.setTimeout(() => {
        setShowGlobalTrash(false)
      }, effectiveDuration + 650)
    }, 220)
  }

  const handleToggleFavorite = (
    movie: Movie,
    favorite: boolean,
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    if (!favorite) {
      flyHeartToFavorites(event.currentTarget)
      setJustAddedId(movie.id)
      window.setTimeout(() => {
        setJustAddedId((current) => (current === movie.id ? null : current))
      }, 1600)
    }
    toggleFavorite(movie)
  }

  return (
    <section className="mb-8" aria-label={title || 'Movie row'}>
      {title && <h2 className="mb-4 text-xl font-bold tracking-tight sm:text-2xl">{title}</h2>}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 2xl:grid-cols-8">
        {movies.map((movie, index) => {
          const favorite = isFavorite(movie.id)

          return (
            <article
              key={movie.id}
              className={`group relative overflow-hidden rounded-2xl border border-white/10 bg-slate-900/75 shadow-[0_12px_30px_rgba(0,0,0,0.35)] transition-transform duration-300 hover:-translate-y-1 motion-safe:animate-fade-in ${
                removingId === movie.id ? 'pointer-events-none opacity-90 animate-remove-source-squash' : ''
              }`}
              style={{ animationDelay: `${Math.min(index * 35, 280)}ms` }}
            >
              <div className="relative">
                {movie.poster_path ? (
                  <Image
                    src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                    alt={movie.title || movie.name || 'Movie poster'}
                    width={300}
                    height={450}
                    className="h-[220px] w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 14vw"
                  />
                ) : (
                  <div className="flex h-[220px] items-center justify-center bg-slate-700 text-sm text-slate-300">No Image</div>
                )}
              </div>

              <div className="space-y-2 p-3">
                <h3 className="truncate text-sm font-semibold">{movie.title || movie.name || 'Untitled'}</h3>
                <p className="flex items-center gap-1 text-xs text-slate-300">
                  <FaStar className="text-amber-400" aria-hidden="true" />
                  {(movie.vote_average ?? 0).toFixed(1)}
                </p>

                <div className={`grid gap-2 ${handlePlayTrailer ? 'grid-cols-2' : 'grid-cols-1'}`}>
                  {handlePlayTrailer && (
                    <button
                      className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-cyan-300/30 bg-cyan-500/20 px-2 py-1.5 text-xs font-semibold text-cyan-100 transition hover:bg-cyan-500/35"
                      onClick={() => handlePlayTrailer(movie.id)}
                      type="button"
                    >
                      <FaPlay aria-hidden="true" />
                      Trailer
                    </button>
                  )}

                  {showRemoveFavorite ? (
                    <button
                      className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-red-300/30 bg-red-500/20 px-2 py-1.5 text-xs font-semibold text-red-100 transition hover:bg-red-500/30"
                      onClick={(event) => handleRemoveFavorite(movie, event)}
                      type="button"
                    >
                      <FaTrashAlt aria-hidden="true" />
                      Remove
                    </button>
                  ) : (
                    <button
                      className={`inline-flex items-center justify-center gap-1.5 rounded-lg border px-2 py-1.5 text-xs font-semibold transition ${
                        favorite
                          ? 'border-rose-300/30 bg-rose-500/20 text-rose-100 hover:bg-rose-500/30'
                          : 'border-white/20 bg-slate-700/60 text-slate-100 hover:bg-slate-600/70'
                      } ${justAddedId === movie.id ? 'animate-favorite-add' : ''}`}
                      onClick={(event) => handleToggleFavorite(movie, favorite, event)}
                      type="button"
                      aria-pressed={favorite}
                    >
                      {favorite ? (
                        <FaHeart className={`text-rose-400 ${justAddedId === movie.id ? 'animate-favorite-icon' : ''}`} aria-hidden="true" />
                      ) : (
                        <FaRegHeart aria-hidden="true" />
                      )}
                      {justAddedId === movie.id ? 'Added!' : 'Favorite'}
                    </button>
                  )}
                </div>
              </div>
            </article>
          )
        })}
      </div>
      {showGlobalTrash && (
        <div className="pointer-events-none fixed inset-0 z-[80]">
          <div className="absolute inset-0 animate-trash-spotlight" />
          <div className="absolute bottom-8 right-8 animate-trash-global-in">
          <div
            id="global-trash-target"
            className="flex h-28 w-28 items-center justify-center rounded-3xl border border-red-300/55 bg-red-500/35 text-red-50 shadow-[0_0_36px_rgba(248,113,113,0.6)] animate-trash-global-pulse backdrop-blur-sm"
          >
            <span className="absolute -top-3 h-4 w-20 rounded-full bg-red-300/70 blur-[1px] animate-trash-lid-snap" />
            <FaTrashAlt aria-hidden="true" className="text-5xl" />
          </div>
          </div>
        </div>
      )}
    </section>
  )
}
