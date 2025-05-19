import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Movie, getMovies } from '../services/Api';

interface SliderState {
  sliderMovies: Movie[];
  sliderLoading: boolean;
  sliderError: string | null;
}

const initialState: SliderState = {
  sliderMovies: [],
  sliderLoading: false,
  sliderError: null,
};

export const fetchSliderMovies = createAsyncThunk(
  'slider/fetchSliderMovies',
  async () => {
    const response = await getMovies();
    return response.movies.slice(0, 3);
  }
);

const sliderSlice = createSlice({
  name: 'slider',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSliderMovies.pending, (state) => {
        state.sliderLoading = true;
        state.sliderError = null;
      })
      .addCase(fetchSliderMovies.fulfilled, (state, action) => {
        state.sliderLoading = false;
        state.sliderMovies = action.payload;
      })
      .addCase(fetchSliderMovies.rejected, (state, action) => {
        state.sliderLoading = false;
        state.sliderError = action.error.message || 'Failed to load slider movies';
        state.sliderMovies = [];
      });
  },
});

export default sliderSlice.reducer;