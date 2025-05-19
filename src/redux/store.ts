import { configureStore } from '@reduxjs/toolkit';
import movieReducer from './movieSlice';
import sliderReducer from './sliderSlice';

export const store = configureStore({
  reducer: {
    movies: movieReducer,
    slider: sliderReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;