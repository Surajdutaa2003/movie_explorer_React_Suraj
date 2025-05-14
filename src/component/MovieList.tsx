import React from 'react';
import MovieCard from './MovieCard';
import CustomSwiper from '../customSwiper';
import { Movie } from '../Api';

interface MovieListProps {
  movies: Movie[];
  onMovieClick: (movie: Movie) => void;
  onDeleteMovie?: (movieId: number) => Promise<void>;
}

const MovieList: React.FC<MovieListProps> = ({ movies, onMovieClick, onDeleteMovie }) => {
  const allTimeFavorites = movies.filter((movie) => movie.rating >= 7.5);
  const trendingMovies = movies.filter((movie) => movie.rating > 7);

  return (
    <div className="space-y-12 px-4">
      {/* All Movies */}
      <section>
        <h2 className="text-xl font-semibold mb-4 text-gray-800">All Movies</h2>
        {movies.length > 0 ? (
          <CustomSwiper
            items={movies}
            renderItem={(movie) => (
              <MovieCard
                movie={movie}
                onMovieClick={onMovieClick}
                onDeleteMovie={onDeleteMovie}
              />
            )}
            sectionName="all"
          />
        ) : (
          <p className="text-gray-500">No movies available.</p>
        )}
      </section>

      {/* Trending Now */}
      <section>
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Trending Now</h2>
        {trendingMovies.length > 0 ? (
          <CustomSwiper
            items={trendingMovies}
            renderItem={(movie) => (
              <MovieCard
                movie={movie}
                onMovieClick={onMovieClick}
                onDeleteMovie={onDeleteMovie}
              />
            )}
            sectionName="trending"
          />
        ) : (
          <p className="text-gray-500">No trending movies available.</p>
        )}
      </section>

      {/* All time Favourites */}
      <section>
        <h2 className="text-xl font-semibold mb-4 text-gray-800">All time Favourites</h2>
        {allTimeFavorites.length > 0 ? (
          <CustomSwiper
            items={allTimeFavorites}
            renderItem={(movie) => (
              <MovieCard
                movie={movie}
                onMovieClick={onMovieClick}
                onDeleteMovie={onDeleteMovie}
              />
            )}
            sectionName="favorites"
          />
        ) : (
          <p className="text-gray-500">No movies with rating 8.8 or higher available.</p>
        )}
      </section>
    </div>
  );
};

export default MovieList;