'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'

// Types
interface Movie {
  id: number
  title?: string
  name?: string
  poster_path: string | null
  backdrop_path: string | null
  vote_average: number
  release_date?: string
}

// TMDB fetch helper
async function fetchFromTMDB(endpoint: string) {
  const res = await fetch(
    `https://api.themoviedb.org/3${endpoint}&api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`,
    { next: { revalidate: 3600 } }
  )
  if (!res.ok) throw new Error(`TMDB API error: ${res.status}`)
  return res.json()
}

export default function Home() {
  const [trending, setTrending] = useState<Movie[]>([])
  const [popular, setPopular] = useState<Movie[]>([])
  const [topRated, setTopRated] = useState<Movie[]>([])
  const [hero, setHero] = useState<Movie | null>(null)
  const [trendingTime, setTrendingTime] = useState<'day' | 'week'>('week')

  const [trailers, setTrailers] = useState<Movie[]>([])
  const [trailersTime, setTrailersTime] = useState<'popular' | 'intheaters'>('popular')

  // Fetch trending, popular, top rated
  useEffect(() => {
    async function loadMovies() {
      try {
        const trendingRes = await fetchFromTMDB(`/trending/movie/${trendingTime}?language=en-US`)
        const popularRes = await fetchFromTMDB('/movie/popular?language=en-US&page=1')
        const topRatedRes = await fetchFromTMDB('/movie/top_rated?language=en-US&page=1')

        setTrending(trendingRes.results)
        setPopular(popularRes.results)
        setTopRated(topRatedRes.results)
        setHero(trendingRes.results[0])
      } catch (err) {
        console.error(err)
      }
    }
    loadMovies()
  }, [trendingTime])

  // Fetch trailers based on trailersTime
  useEffect(() => {
    async function loadTrailers() {
      try {
        const endpoint = trailersTime === 'popular'
          ? '/movie/popular?language=en-US&page=1'
          : '/movie/now_playing?language=en-US&page=1'
        const trailersRes = await fetchFromTMDB(endpoint)
        setTrailers(trailersRes.results)
      } catch (err) {
        console.error(err)
      }
    }
    loadTrailers()
  }, [trailersTime])

  // Play Trailer Function
  // TMDB Video type
  interface TMDBVideo {
    id: string
    key: string
    name: string
    site: string
    type: string
  }

  const handlePlayTrailer = async (movieId: number) => {
    try {
      const data = await fetchFromTMDB(`/movie/${movieId}/videos?language=en-US`)
      const trailer = data.results.find((vid: TMDBVideo) => vid.type === 'Trailer' && vid.site === 'YouTube')
      if (trailer?.key) {
        window.open(`https://www.youtube.com/watch?v=${trailer.key}`, '_blank')
      } else {
        alert('Trailer not available')
      }
    } catch (err) {
      console.error(err)
      alert('Trailer not available')
    }
  }

  return (
    <main className="bg-black text-white min-h-screen">

      {/* 🌟 Welcome Hero Section */}
      <section
        className="relative h-[500px] flex flex-col justify-center items-center text-center text-white bg-cover bg-center"
        style={{ backgroundImage: "url('/Hero.jpg')" }}
      >
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative z-10 max-w-3xl px-4">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">Welcome.</h1>
          <p className="text-lg sm:text-2xl mb-6">
            Millions of movies, TV shows and people to discover. Explore now.
          </p>
          <div className="flex w-full gap-2 border border-gray-600 rounded-full overflow-hidden">
            <input
              type="text"
              placeholder="Search for a movie, tv show, person..."
              className="flex-1 py-3 px-6 text-black focus:outline-none rounded-l-full"
            />
            <button className="bg-gradient-to-r from-[#01b4e4] to-[#90cea1] px-6 py-3 font-semibold hover:opacity-90 rounded-r-full transition">
              Search
            </button>
          </div>
        </div>
      </section>

      {/* 🎬 TMDB Hero Banner */}
      {hero && (
        <section className="relative h-[70vh] w-full mt-10">
          <Image
            src={`https://image.tmdb.org/t/p/original${hero.backdrop_path}`}
            alt={hero.title || hero.name || 'Hero movie'}
            fill
            className="object-cover brightness-50"
            priority
          />
          <div className="absolute bottom-20 left-10 max-w-xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              {hero.title || hero.name}
            </h1>
            <p className="text-lg text-gray-200 mb-6">
              ⭐ {hero.vote_average.toFixed(1)} | {hero.release_date?.slice(0, 4)}
            </p>
            <button
              className="px-6 py-3 bg-red-600 hover:bg-red-700 rounded-lg font-semibold text-lg"
              onClick={() => hero && handlePlayTrailer(hero.id)}
            >
              ▶ Play Trailer
            </button>
          </div>
        </section>
      )}

      {/* 🎥 Trending Section */}
      <section className="p-6">
        <div className="flex items-center gap-4 mb-4">
          <h2 className="text-2xl font-semibold">Trending</h2>
          <div className="relative inline-flex border border-gray-700 rounded-full p-1 bg-[#041f34] w-[220px] h-[36px]">
            <div
              className="absolute top-0 bottom-0 w-1/2 rounded-full transition-transform duration-300 ease-in-out bg-gradient-to-r from-[#01b4e4] to-[#90cea1]"
              style={{ transform: trendingTime === 'day' ? 'translateX(0%)' : 'translateX(100%)' }}
            ></div>
            <button
              className={`relative z-10 w-1/2 text-center text-sm font-semibold ${trendingTime === 'day' ? 'text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-200' : 'text-white'}`}
              onClick={() => setTrendingTime('day')}
            >
              Today
            </button>
            <button
              className={`relative z-10 w-1/2 text-center text-sm font-semibold ${trendingTime === 'week' ? 'text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-200' : 'text-white'}`}
              onClick={() => setTrendingTime('week')}
            >
              This Week
            </button>
          </div>
        </div>
        <MovieRow movies={trending} />
      </section>

      {/* 🎥 Latest Trailers Section */}
      <section className="p-6">
        <div className="flex items-center gap-4 mb-4">
          <h2 className="text-2xl font-semibold">Latest Trailers</h2>
          <div className="relative inline-flex border border-gray-700 rounded-full p-1 bg-[#041f34] w-[240px] h-[36px]">
            <div
              className="absolute top-0 bottom-0 w-1/2 rounded-full transition-transform duration-300 ease-in-out bg-gradient-to-r from-[#01b4e4] to-[#90cea1]"
              style={{ transform: trailersTime === 'popular' ? 'translateX(0%)' : 'translateX(100%)' }}
            ></div>
            <button
              className={`relative z-10 w-1/2 text-center text-sm font-semibold ${trailersTime === 'popular' ? 'text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-200' : 'text-white'}`}
              onClick={() => setTrailersTime('popular')}
            >
              Popular
            </button>
            <button
              className={`relative z-10 w-1/2 text-center text-sm font-semibold ${trailersTime === 'intheaters' ? 'text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-200' : 'text-white'}`}
              onClick={() => setTrailersTime('intheaters')}
            >
              In Theaters
            </button>
          </div>
        </div>
        <MovieRow movies={trailers} />
      </section>

      {/* 🎥 Other Sections */}
      <section className="p-6 space-y-10">
        <MovieRow title="Popular Movies" movies={popular} />
        <MovieRow title="Top Rated Movies" movies={topRated} />
      </section>
    </main>
  )
}

/* 🎬 Movie Row Component */
function MovieRow({ title, movies }: { title?: string; movies: Movie[] }) {
  return (
    <div>
      {title && <h2 className="text-2xl font-semibold mb-4">{title}</h2>}
      <div className="flex space-x-4 overflow-x-scroll scrollbar-hide">
        {movies.map((movie) => (
          <div
            key={movie.id}
            className="min-w-[150px] bg-gray-900 rounded-lg overflow-hidden shadow-md"
          >
            {movie.poster_path ? (
              <Image
                src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                alt={movie.title || movie.name || 'Movie poster'}
                width={300}
                height={450}
                className="object-cover w-full h-[225px]"
              />
            ) : (
              <div className="bg-gray-700 h-[225px] flex items-center justify-center">
                No Image
              </div>
            )}
            <div className="p-2">
              <h3 className="text-sm font-semibold truncate">
                {movie.title || movie.name}
              </h3>
              <p className="text-xs text-gray-400">
                ⭐ {movie.vote_average.toFixed(1)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
