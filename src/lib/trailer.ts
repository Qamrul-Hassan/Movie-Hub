export async function playTrailer(movieId: number, mediaType: 'movie' | 'tv' = 'movie') {
  const response = await fetch(
    `https://api.themoviedb.org/3/${mediaType}/${movieId}/videos?language=en-US&api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`
  )

  if (!response.ok) {
    throw new Error('Trailer fetch failed')
  }

  const data = await response.json()
  const trailer = data.results?.find(
    (video: { key: string; type: string; site: string }) =>
      video.type === 'Trailer' && video.site === 'YouTube'
  )

  if (!trailer?.key) {
    throw new Error('Trailer not available')
  }

  window.open(`https://www.youtube.com/watch?v=${trailer.key}`, '_blank', 'noopener,noreferrer')
}
