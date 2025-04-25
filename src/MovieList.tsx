import React from 'react';
import MovieCard from './MovieCard';

interface Movie {
  id: number;
  title: string;
  genre: string;
  release_year: number;
  rating: number;
  actors: string;
  country: string;
  director: string;
  duration: number;
  description: string;
  language: string;
  budget: string;
  box_office: string;
  poster_urls: string[];
  created_at: string;
  updated_at: string;
  user_id: number;
}

interface MovieListProps {
  movies: Movie[];
}

const MovieList: React.FC<MovieListProps> = ({ movies }) => {
  // Filter for Featured (rating >= 9) and Trending (release_year >= 2010)
  const featuredMovies = movies.filter((movie) => movie.rating >= 9);
  const trendingMovies = movies.filter((movie) => movie.release_year >= 2010);

  return (
    <div className="space-y-8">
      {/* Featured */}
      <section>
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Featured Movies</h2>
        {featuredMovies.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featuredMovies.map((movie) => (
              <MovieCard
                key={movie.id}
                title={movie.title}
                poster={movie.poster_urls[0] || 'https://via.placeholder.com/200x300?text=No+Poster'}
                genre={movie.genre}
                rating={movie.rating}
              />
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No featured movies available.</p>
        )}
      </section>

      {/* Trending */}
      <section>
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Trending Now</h2>
        {trendingMovies.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {trendingMovies.map((movie) => (
              <MovieCard
                key={movie.id}
                title={movie.title}
                poster={movie.poster_urls[0] || 'https://via.placeholder.com/200x300?text=No+Poster'}
                genre={movie.genre}
                rating={movie.rating}
              />
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No trending movies available.</p>
        )}
      </section>
    </div>
  );
};

export default MovieList;