import React, { Component, ErrorInfo, ReactNode, useEffect } from 'react';
import MovieCard from './MovieCard';
import useSwiper from '../hooks/useSwiper';
import { Movie } from '../services/Api';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';

interface MovieListProps {
  movies: Movie[];
  onMovieClick: (movie: Movie) => void;
  onDeleteMovie?: (movieId: number) => Promise<void>;
}

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  errorMessage: string;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false, errorMessage: '' };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, errorMessage: error.message };
  }

  componentDidMount(): void {
    console.log("component mounted");
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught in ErrorBoundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="text-red-500 text-center p-4 bg-red-50 rounded-lg">
          <h3>Error: {this.state.errorMessage}</h3>
          <p>Please try refreshing the page or contact support.</p>
        </div>
      );
    }
    return this.props.children;
  }
}

const MovieList: React.FC<MovieListProps> = ({ movies, onMovieClick, onDeleteMovie }) => {
  const searchQuery = useSelector((state: RootState) => state.movies.searchQuery);

  // Filter movies only if there's no search query
  const allTimeFavorites = !searchQuery ? 
    movies.filter((movie) => Number(movie.rating) >= 8.0) : [];

  const trendingMovies = !searchQuery ? 
    movies.filter((movie) => Number(movie.rating) > 7) : [];

  const topActors = [
    { name: 'Leonardo DiCaprio', image: 'https://cdn.britannica.com/65/227665-050-D74A477E/American-actor-Leonardo-DiCaprio-2016.jpg?w=400&h=300&c=crop' },
    { name: 'Emma Watson', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTfY-AEO2Xb5_NydkrBuT0D6S-5cSvVtYfZ-Jh04P3KOs6D-qi4u3a4EimQ1d3YIuJJG6fLURaWS7HFyk749I0Uk8_xbSHOys3V9EMxtQ' },
    { name: 'Brad Pitt', image: 'https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcQ-o4HkzB6uH9YSxFGOHuvJMMbekmjontRoCdbgqd0cUvMa4N6siJ-DgX589Pz7wUM-dz5CTbE2FFLIsHsadrz3Co0-hRxzbxYch0pLyHZznA' },
    { name: 'Robert Downey Jr.', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSM2x2eeYUrh06Zi32o3cgRhImhmxchWRKMj6snwepLPHo1l-27kOo7ry1gbe_WaOKnKEY&usqp=CAU' },
    { name: 'Scarlett Johansson', image: 'https://ichef.bbci.co.uk/ace/standard/976/cpsprodpb/4a6d/live/826aa090-160c-11f0-8a1e-3ff815141b98.jpg' },
    { name: 'Tom Hardy', image: 'https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcQY2H53gvNDgr7L7P9IX9SE8pcM9FHlfDzBkfEQ4eiDJMosP8ReLCO-0VvSEDhXX0LtH4at6Oly4bZ9_gOkcL7PgQ' },
    { name: 'Zendaya', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTtki5-7izlBYgPUu4aHC3FGNFC10Xr4gwxtvGKcT7j_5pOSAbu4wqUYsoHz2OnVCc5Qwk&usqp=CAU' },
    { name: 'Robert Pattinson', image: 'https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcQb5FIceUA04UrDpy6simwQKCAyVMEwJhj9KMHt2KhfYuleRrdLOHd95KudjVK27Rli3qfyMxRA9HZHMPXnC_mwhY1a71C4VLdtwyUwxg' },
  ];

  // All Movies Swiper
  const { SwiperComponent: AllMoviesSwiper } = useSwiper({
    items: movies,
    renderSlide: (movie: Movie) => (
      <ErrorBoundary>
        <MovieCard
          movie={movie}
          onMovieClick={onMovieClick}
          onDeleteMovie={onDeleteMovie}
        />
      </ErrorBoundary>
    ),
    navigationPrefix: 'all',
  });

  // Trending Now Swiper
  const { SwiperComponent: TrendingSwiper } = useSwiper({
    items: trendingMovies,
    renderSlide: (movie: Movie) => (
      <ErrorBoundary>
        <MovieCard
          movie={movie}
          onMovieClick={onMovieClick}
          onDeleteMovie={onDeleteMovie}
        />
      </ErrorBoundary>
    ),
    navigationPrefix: 'trending',
  });

  // All Time Favorites Swiper
  const { SwiperComponent: TopSwiper } = useSwiper({
    items: allTimeFavorites,
    renderSlide: (movie: Movie) => (
      <ErrorBoundary>
        <MovieCard
          movie={movie}
          onMovieClick={onMovieClick}
          onDeleteMovie={onDeleteMovie}
        />
      </ErrorBoundary>
    ),
    navigationPrefix: 'top',
  });

  // Top Actors Swiper
  const { SwiperComponent: ActorsSwiper } = useSwiper({
    items: topActors,
    renderSlide: (actor: { name: string; image: string }) => (
      <div className="flex flex-col items-center space-y-2">
        <img
          src={actor.image}
          alt={actor.name}
          className="w-60 h-60 rounded-full object-cover shadow-md"
          onError={(e) => {
            e.currentTarget.src = 'https://via.placeholder.com/150?text=No+Image';
          }}
        />
        <p className="text-base font-medium text-gray-700 text-center">{actor.name}</p>
      </div>
    ),
    slidesPerView: 2,
    spaceBetween: 20,
    autoplayDelay: 2500,
    breakpoints: {
      640: { slidesPerView: 3 },
      1024: { slidesPerView: 5 },
    },
    navigationPrefix: 'actors',
  });

  return (
    <div className="space-y-12 px-4">
      {/* Search Results or All Movies */}
      <section>
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          {searchQuery ? 'Search Results' : 'All Movies'}
        </h2>
        {movies.length > 0 ? (
          <AllMoviesSwiper />
        ) : (
          <p className="text-gray-500">No movies available.</p>
        )}
      </section>

      {/* Show these sections only when not searching */}
      {!searchQuery && (
        <>
          {/* Trending Now */}
          <section>
            <h2 className="text-xl font-semibold mb-4 text-gray-800">All Time Trending</h2>
            {trendingMovies.length > 0 ? (
              <TrendingSwiper />
            ) : (
              <p className="text-gray-500">No trending movies available.</p>
            )}
          </section>

          {/* All Time Favorites */}
          <section>
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Top Rated Movies</h2>
            {allTimeFavorites.length > 0 ? (
              <TopSwiper />
            ) : (
              <p className="text-gray-500">No top rated movies available.</p>
            )}
          </section>

          {/* Top Actors section */}
          <section>
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Top Actors</h2>
            {topActors.length > 0 ? (
              <ActorsSwiper />
            ) : (
              <p className="text-gray-500">No actors available.</p>
            )}
          </section>
        </>
      )}
    </div>
  );
};

export default MovieList;
// ss