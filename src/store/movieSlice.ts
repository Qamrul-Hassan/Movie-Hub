import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { fetchFromTMDB } from '@/lib/tmdb'

export interface Movie {
  id: number
  title?: string
  name?: string
  poster_path: string | null
  backdrop_path: string | null
  vote_average: number
  release_date?: string
}

interface MoviesState {
  trending: Movie[]
  popular: Movie[]
  topRated: Movie[]
  trailers: Movie[]
  hero: Movie | null
  trendingTime: 'day' | 'week'
  trailersTime: 'popular' | 'intheaters'
}

const initialState: MoviesState = {
  trending: [],
  popular: [],
  topRated: [],
  trailers: [],
  hero: null,
  trendingTime: 'week',
  trailersTime: 'popular',
}

// Thunks
export const fetchTrending = createAsyncThunk(
  'movies/fetchTrending',
  async (time: 'day' | 'week') => {
    const data = await fetchFromTMDB(`/trending/movie/${time}?language=en-US`)
    return data.results
  }
)

export const fetchPopular = createAsyncThunk('movies/fetchPopular', async () => {
  const data = await fetchFromTMDB('/movie/popular?language=en-US&page=1')
  return data.results
})

export const fetchTopRated = createAsyncThunk('movies/fetchTopRated', async () => {
  const data = await fetchFromTMDB('/movie/top_rated?language=en-US&page=1')
  return data.results
})

export const fetchTrailers = createAsyncThunk(
  'movies/fetchTrailers',
  async (type: 'popular' | 'intheaters') => {
    const endpoint =
      type === 'popular'
        ? '/movie/popular?language=en-US&page=1'
        : '/movie/now_playing?language=en-US&page=1'
    const data = await fetchFromTMDB(endpoint)
    return data.results
  }
)

// Slice
export const movieSlice = createSlice({
  name: 'movies',
  initialState,
  reducers: {
    setTrendingTime(state, action: PayloadAction<'day' | 'week'>) {
      state.trendingTime = action.payload
    },
    setTrailersTime(state, action: PayloadAction<'popular' | 'intheaters'>) {
      state.trailersTime = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTrending.fulfilled, (state, action) => {
        state.trending = action.payload
        state.hero = action.payload[0] || null
      })
      .addCase(fetchPopular.fulfilled, (state, action) => {
        state.popular = action.payload
      })
      .addCase(fetchTopRated.fulfilled, (state, action) => {
        state.topRated = action.payload
      })
      .addCase(fetchTrailers.fulfilled, (state, action) => {
        state.trailers = action.payload
      })
  },
})

export const { setTrendingTime, setTrailersTime } = movieSlice.actions
export default movieSlice.reducer
