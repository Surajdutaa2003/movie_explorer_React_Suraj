import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Movie, getMovies } from '../services/Api';

interface MoviesResponse {
  movies: Movie[];
  meta: {
    current_page: number;
    total_pages: number;
    total_count: number;
    per_page?: number;
  };
}

interface MovieState {
  movies: Movie[];
  genres: string[];
  loading: boolean;
  error: string | null;
  successMessage: string | null;
  page: number;
  totalPages: number;
  searchQuery: string;
  selectedGenre: string;
}

const initialState: MovieState = {
  movies: [],
  genres: ['All', 'Comedy', 'Horror', 'Thriller', 'Sci-Fi', 'Romance'], // Changed 'Genre' to 'All'
  loading: false,
  error: null,
  successMessage: null,
  page: 1,
  totalPages: 1,
  searchQuery: '',
  selectedGenre: 'All', // Changed from 'Genre' to 'All'
};

export const fetchMovies = createAsyncThunk(
  'movies/fetchMovies',
  async ({ page, searchQuery, genre }: { page: number; searchQuery: string; genre: string }) => {
    const filters: { page?: number; title?: string; genre?: string } = { page };
    if (searchQuery) filters.title = searchQuery;
    if (genre !== 'All') filters.genre = genre; // Changed from 'Genre' to 'All'
    
    const response = await getMovies(filters);
    return response;
  }
);

const movieSlice = createSlice({
  name: 'movies',
  initialState,
  reducers: {
    setPage: (state, action) => {
      state.page = action.payload;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
      state.page = 1; // Reset to first page on new search
    },
    setSelectedGenre: (state, action) => {
      state.selectedGenre = action.payload;
      state.page = 1; // Reset to first page on genre change
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMovies.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(fetchMovies.fulfilled, (state, action) => {
        state.loading = false;
        state.movies = action.payload.movies;
        state.totalPages = action.payload.meta?.total_pages || 1;
        
        const fetchedGenres = Array.from(new Set(action.payload.movies.map((movie: Movie) => movie.genre)));
        state.genres = [
          'All', // Changed from 'Genre' to 'All'
          ...new Set([...state.genres.filter(g => g !== 'All'), ...fetchedGenres]), // Changed from 'Genre' to 'All'
        ];
      })
      .addCase(fetchMovies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to load movies';
        state.movies = [];
      });
  },
});

export const { setPage, setSearchQuery, setSelectedGenre } = movieSlice.actions;
export default movieSlice.reducer;