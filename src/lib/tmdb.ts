import axios from 'axios'

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_TMDB_BASE_URL,
  params: {
    api_key: process.env.NEXT_PUBLIC_TMDB_API_KEY,
    language: 'en-US',
  },
})

export async function getNowPlaying() {
  const res = await api.get('/movie/now_playing')
  return res.data.results
}
