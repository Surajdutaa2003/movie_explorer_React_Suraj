import React, { useState, useEffect, useCallback } from 'react';
import MovieList from './MovieList';
import { Movie, logoutUser, deleteMovie } from './Api';
import { searchMovieAPI } from './Api';
import { Link, useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

interface MovieListProps {
  movies: Movie[];
  onMovieClick: (movie: Movie) => void;
  onDeleteMovie?: (movieId: number) => Promise<void>;
}

interface MovieDetailProps {
  movie: Movie;
  onClose: () => void;
}

const Dashboard: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [genres, setGenres] = useState<string[]>(['All']);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [sliderMovies, setSliderMovies] = useState<Movie[]>([]);
  const [sliderLoading, setSliderLoading] = useState<boolean>(true);
  const [sliderError, setSliderError] = useState<string | null>(null);
  const navItems = ['Home', 'Movies', 'Series', 'My List'];
  const navigate = useNavigate();

  const userRole = localStorage.getItem('role');
  const email = localStorage.getItem('email') || 'user@example.com';
  const displayName = (() => {
    const alphabets = email.match(/[a-zA-Z]/g) || [];
    const firstFour = alphabets.slice(0, 4).join('');
    if (!firstFour) {
      return 'User';
    }
    return firstFour.charAt(0).toUpperCase() + firstFour.slice(1);
  })();

  const useDebounce = (value: string, delay: number) => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);

      return () => {
        clearTimeout(handler);
      };
    }, [value, delay]);

    return debouncedValue;
  };

  const debouncedSearch = useDebounce(searchQuery, 3000);

  const fetchMovies = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      setSuccessMessage(null);
      const title = debouncedSearch.trim();
      const genre = selectedGenre === 'All' ? undefined : selectedGenre;
      
      // Fetch all pages if there's a search query
      if (title) {
        let allMovies: Movie[] = [];
        let currentPage = 1;
        let hasMorePages = true;

        while (hasMorePages) {
          const response = await searchMovieAPI(currentPage, title, genre);
          if (!response || !response.movies || !response.pagination) {
            throw new Error('Invalid API response');
          }

          allMovies = [...allMovies, ...response.movies];
          
          if (currentPage >= response.pagination.total_pages) {
            hasMorePages = false;
          }
          currentPage++;
        }

        setMovies(allMovies);
        setTotalPages(1); // Set to 1 since we're showing all results
      } else {
        // Normal pagination when there's no search
        const response = await searchMovieAPI(page, title, genre);
        if (!response || !response.movies || !response.pagination) {
          throw new Error('Invalid API response');
        }
        setMovies(response.movies || []);
        setTotalPages(response.pagination.total_pages || 1);
      }

      // Update genres list
      const uniqueGenres = [
        'All',
        ...Array.from(new Set(movies.map((movie: Movie) => movie.genre))),
      ];
      setGenres(uniqueGenres);
    } catch (err: any) {
      console.error('Error fetching movies:', err);
      setError(err.message || 'Failed to load movies. Please try again later.');
      setMovies([]);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, selectedGenre, page]);

  useEffect(() => {
    const fetchSliderMovies = async () => {
      try {
        setSliderLoading(true);
        const response = await searchMovieAPI(1, '', undefined);
        if (!response || !response.movies) {
          throw new Error('Invalid API response for slider');
        }
        setSliderMovies(response.movies.slice(0, 3));
      } catch (err: any) {
        console.error('Error fetching slider movies:', err);
        setSliderError('Failed to load slider content. Please try again.');
        setSliderMovies([]);
      } finally {
        setSliderLoading(false);
      }
    };

    fetchSliderMovies();
  }, []);

  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);

  const openMovieDetail = (movie: Movie) => {
    setSelectedMovie(movie);
  };

  const closeMovieDetail = () => {
    setSelectedMovie(null);
  };

  const handleDeleteMovie = async (movieId: number) => {
    try {
      setError(null);
      setSuccessMessage(null);
      await deleteMovie(movieId);
      setSuccessMessage('Movie deleted successfully');
      await fetchMovies();
    } catch (err: any) {
      console.error('Delete movie error:', err);
      setError(err.message || 'Failed to delete movie. Please try again.');
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      // Remove all auth-related items from localStorage
      localStorage.removeItem('authData');
      localStorage.removeItem('role');
      localStorage.removeItem('email');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('loginResponse'); // Add this line
      navigate('/login');
    } catch (err: any) {
      console.error('Logout error:', err.message);
      setError('Failed to log out. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">
      <style>
        {`
          .swiper-button-prev,
          .swiper-button-next {
            z-index: 5 !important;
          }
          .dropdown-menu {
            transition: opacity 0.3s ease, visibility 0.3s ease;
            transition-delay: 0.2s;
            opacity: 0;
            visibility: hidden;
          }
          .group:hover .dropdown-menu {
            opacity: 1;
            visibility: visible;
          }
        `}
      </style>

      <nav className="fixed w-full top-0 z-150 bg-white shadow-lg border-b border-gray-200 p-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <span className="text-3xl font-extrabold text-blue-600">Movie+</span>
        </div>
        <div className="flex items-center space-x-6">
          <div className="md:hidden">
            <button onClick={() => setMenuOpen(!menuOpen)} className="text-gray-900 hover:text-blue-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {menuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
          <div className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <Link
                key={item}
                to={item === 'Home' ? '/home' : `/${item.toLowerCase()}`}
                className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors duration-200"
              >
                {item}
              </Link>
            ))}
            {userRole === 'supervisor' && (
              <Link
                to="/admin"
                className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors duration-200"
              >
                Add Movie
              </Link>
            )}
            {userRole === 'user' && (
              <Link
                to="/pricing"
                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                Subscribe
              </Link>
            )}
            <div className="relative group">
              <div className="flex items-center space-x-2 cursor-pointer">
                <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQuvwJG3J0AvDmbaE8_obrEW5IHHEB2zDaYEw&s"
                  alt="User"
                  className="w-8 h-8 rounded-full"
                />
                <span className="text-sm text-gray-700">{displayName}</span>
              </div>
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg dropdown-menu">
                <Link
                  to="/profile"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {menuOpen && (
        <div className="md:hidden bg-white p-4 border-b border-gray-200 shadow-lg">
          <div className="flex flex-col space-y-2">
            {navItems.map((item) => (
              <Link
                key={item}
                to={item === 'Home' ? '/home' : `/${item.toLowerCase()}`}
                className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors duration-200"
                onClick={() => setMenuOpen(false)}
              >
                {item}
              </Link>
            ))}
            {userRole === 'supervisor' && (
              <Link
                to="/admin"
                className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors duration-200"
                onClick={() => setMenuOpen(false)}
              >
                Add Movie
              </Link>
            )}
            {userRole === 'user' && (
              <Link
                to="/pricing"
                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 text-center"
                onClick={() => setMenuOpen(false)}
              >
                Subscribe
              </Link>
            )}
            <button
              onClick={handleLogout}
              className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors duration-200 text-left"
            >
              Logout
            </button>
          </div>
        </div>
      )}

      <main className="pt-20 p-6 bg-gray-50">
        {successMessage && (
          <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-lg">
            {successMessage}
          </div>
        )}
        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <div className="mb-8">
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={30}
            slidesPerView={1}
            navigation
            pagination={{ clickable: true }}
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            className="rounded-lg shadow-lg"
          >
            {sliderLoading ? (
              <SwiperSlide>
                <div className="flex items-center justify-center h-96">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              </SwiperSlide>
            ) : sliderError ? (
              <SwiperSlide>
                <div className="text-red-500 text-center h-96 flex items-center justify-center">
                  {sliderError}
                </div>
              </SwiperSlide>
            ) : sliderMovies.length === 0 ? (
              <SwiperSlide>
                <div className="text-gray-700 text-center h-96 flex items-center justify-center">
                  No movies available for the slider.
                </div>
              </SwiperSlide>
            ) : (
              sliderMovies.map((movie) => (
                <SwiperSlide key={movie.id}>
                  <div className="relative">
                    <img
                      src={movie.banner_url || 'https://via.placeholder.com/1200x400?text=No+Banner'}
                      alt={movie.title}
                      className="w-full h-96 object-cover rounded-lg"
                    />
                    <div className="absolute top-1/2 left-6 transform -translate-y-1/2 text-white">
                      <h1 className="text-4xl font-bold">{movie.title}</h1>
                      <p className="text-lg mt-2">{movie.description.slice(0, 100)}...</p>
                    </div>
                  </div>
                </SwiperSlide>
              ))
            )}
          </Swiper>
        </div>

        <div className="mb-6 flex flex-col md:flex-row md:items-center md:space-x-4 space-y-4 md:space-y-0">
          <input
            type="text"
            placeholder="Search by title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-4 py-2 rounded-lg bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
          />
          <select
            value={selectedGenre}
            onChange={(e) => setSelectedGenre(e.target.value)}
            className="px-4 py-2 rounded-lg bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
          >
            {genres.map((genre) => (
              <option key={genre} value={genre} className="text-gray-900">
                {genre}
              </option>
            ))}
          </select>
        </div>

        <div className="min-h-[400px] bg-white rounded-lg shadow-md p-4">
          {loading ? (
            <div className="flex items-center justify-center h-96">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : error && !successMessage ? (
            <div className="text-red-500 text-center h-96 flex items-center justify-center">
              {error}
            </div>
          ) : (
            <MovieList movies={movies} onMovieClick={openMovieDetail} onDeleteMovie={handleDeleteMovie} />
          )}
        </div>

        {totalPages > 1 && (
          <div className="mt-8 flex justify-center space-x-4">
            <button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg disabled:opacity-50 hover:bg-blue-500 hover:text-white transition-all duration-300"
            >
              Previous
            </button>
            <span className="px-4 py-2 text-gray-700 font-medium">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={page === totalPages}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg disabled:opacity-50 hover:bg-blue-500 hover:text-white transition-all duration-300"
            >
              Next
            </button>
          </div>
        )}
      </main>

      <footer className="bg-gray-200 text-gray-600 p-6 text-center border-t border-gray-300">
        <p className="text-lg">© {new Date().getFullYear()} Movie+. All rights reserved.</p>
        <div className="mt-4 flex justify-center space-x-6 text-sm">
          <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors duration-200">Privacy</a>
          <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors duration-200">Terms</a>
          <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors duration-200">Help</a>
          <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors duration-200">Contact</a>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
// ss