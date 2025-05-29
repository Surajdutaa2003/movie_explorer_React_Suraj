import React, { Component, ErrorInfo, ReactNode, useEffect } from 'react';
import MovieCard from './MovieCard';
import useSwiper from '../hooks/useSwiper';
import { Movie } from '../services/Api';

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
  useEffect(() => {
    console.log("mounted");
    console.log("movie list", movies);
  }, []);

  // Filter movies with rating >= 8.5 for All Time Favorites
  const allTimeFavorites = movies.filter((movie) => Number(movie.rating) >= 8.0);

  // Trending movies with rating > 7
  const trendingMovies = movies.filter((movie) => Number(movie.rating) > 7 );

  const topActors = [
    { name: 'Leonardo DiCaprio', image: 'https://cdn.britannica.com/65/227665-050-D74A477E/American-actor-Leonardo-DiCaprio-2016.jpg?w=400&h=300&c=crop' },
    { name: 'Emma Watson', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTfY-AEO2Xb5_NydkrBuT0D6S-5cSvVtYfZ-Jh04P3KOs6D-qi4u3a4EimQ1d3YIuJJG6fLURaWS7HFyk749I0Uk8_xbSHOys3V9EMxtQ' },
    { name: 'Tom Holland', image: 'data:image/webp;base64,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' },
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
      {/* All Movies */}
      <section>
        <h2 className="text-xl font-semibold mb-4 text-gray-800">All Movies</h2>
        {movies.length > 0 ? <AllMoviesSwiper /> : <p className="text-gray-500">No movies available.</p>}
      </section>

      {/* Trending Now */}
      <section>
        <h2 className="text-xl font-semibold mb-4 text-gray-800">All Time Trending </h2>
        {trendingMovies.length > 0 ? <TrendingSwiper /> : <p className="text-gray-500">No trending movies available.</p>}
      </section>

      {/* All Time Favorites */}
      <section>
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Top Rated</h2>
        {allTimeFavorites.length > 0 ? <TopSwiper /> : <p className="text-gray-500">No movies with rating 8.5 or higher available.</p>}
      </section>

      {/* Top Actors */}
      <section>
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Top Actors</h2>
        {topActors.length > 0 ? <ActorsSwiper /> : <p className="text-gray-500">No actors available.</p>}
      </section>
    </div>
  );
};

export default MovieList;