import React, { useState, useEffect, useCallback } from 'react';
import MovieList from './MovieList';
import { searchMovieAPI } from './Api';
import { Link, useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

// Use the Movie interface from Api.ts
import { Movie } from './Api';

const Dashboard: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  // Removed explicit debouncedSearchQuery state as we'll use the custom hook
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [genres, setGenres] = useState<string[]>(['All']);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navItems = ['Home', 'Movies', 'Series', 'My List'];
  const navigate = useNavigate();

  // Custom debounce hook implementation to properly handle the debounce effect
  const useDebounce = (value, delay) => {
    const [debouncedValue, setDebouncedValue] = useState(value);
    
    useEffect(() => {
      // Set up the timeout
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);
      
      // Clean up on every value change or unmount
      return () => {
        clearTimeout(handler);
      };
    }, [value, delay]);
    
    return debouncedValue;
  };
  
  // Use the custom hook to debounce the search query
  const debouncedSearch = useDebounce(searchQuery, 3000); // 3 seconds delay
  
  // Fetch movies with useCallback to prevent unnecessary re-renders
  const fetchMovies = useCallback(async () => {
    try {
      setLoading(true);
      const title = debouncedSearch.trim();
      const genre = selectedGenre === 'All' ? undefined : selectedGenre;
      const response = await searchMovieAPI(page, title || '', genre);
      if (!response || !response.movies || !response.pagination) {
        throw new Error('Invalid API response');
      }
      setMovies(response.movies || []);
      setTotalPages(response.pagination.total_pages || 1);
      const uniqueGenres = [
        'All',
        ...Array.from(new Set(response.movies.map((movie: Movie) => movie.genre))),
      ];
      setGenres(uniqueGenres);
    } catch (err: any) {
      console.error('Error fetching movies:', err);
      setError(err.message || 'Failed to load movies. Please try again later.');
      setMovies([]);
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, selectedGenre]);

  // Effect that triggers the fetch when debounced search query changes
  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);

  if (loading) return <div className="text-gray-900 text-center min-h-screen bg-white flex items-center justify-center">Loading...</div>;
  if (error) return <div className="text-red-500 text-center min-h-screen bg-white flex items-center justify-center">{error}</div>;

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">
      {/* Sticky Navbar */}
      <nav className="fixed w-full top-0 z-10 bg-white shadow-lg border-b border-gray-200 p-4 flex items-center justify-between">
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
            <Link
              to="/pricing"
              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              Subscribe
            </Link>
            <div className="relative group">
              <div className="flex items-center space-x-2 cursor-pointer">
                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQuvwJG3J0AvDmbaE8_obrEW5IHHEB2zDaYEw&s" alt="User" className="w-8 h-8 rounded-full" />
                <span className="text-sm text-gray-700">Rachel</span>
              </div>
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 invisible group-hover:visible">
                <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Profile</Link>
                <Link to="/logout" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Logout</Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
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
            <Link
              to="/pricing"
              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 text-center"
              onClick={() => setMenuOpen(false)}
            >
              Subscribe
            </Link>
          </div>
        </div>
      )}

      {/* Main Content with Padding for Sticky Navbar */}
      <main className="pt-20 p-6 bg-gray-50">
        {/* Hero Section with Swiper */}
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
            <SwiperSlide>
              <div className="relative">
                <img
                  src="https://as2.ftcdn.net/v2/jpg/02/91/07/81/1000_F_291078168_brNo333mAG6320GrKdtLDEuIxFFxERlg.jpg"
                  alt="Slide 1"
                  className="w-full h-96 object-cover rounded-lg"
                />
                <div className="absolute top-1/2 left-6 transform -translate-y-1/2 text-white">
                  <h1 className="text-4xl font-bold">Welcome to Movie+</h1>
                  <p className="text-lg mt-2">Discover your favorite movies!</p>
                </div>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="relative">
                <img
                  src="https://as1.ftcdn.net/v2/jpg/06/29/64/84/1000_F_629648449_bRGasDmR5liYBd1IsHx6Ow8g8H1BiV2w.jpg"
                  alt="Slide 2"
                  className="w-full h-96 object-cover rounded-lg"
                />
                <div className="absolute top-1/2 left-6 transform -translate-y-1/2 text-white">
                  <h1 className="text-4xl font-bold">Explore New Releases</h1>
                  <p className="text-lg mt-2">Discover the latest movies now!</p>
                </div>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="relative">
                <img
                  src="https://img.freepik.com/free-vector/satan-horror-text-effect-editable-scary-red-text-style_314614-671.jpg?t=st=1745993976~exp=1745997576~hmac=29c44942f3521135910d9d629ceb6d07527b6ff85de6d9341c6f3867b01f5627&w=1800"
                  alt="Slide 3"
                  className="w-full h-96 object-cover rounded-lg"
                />
                <div className="absolute top-1/2 left-6 transform -translate-y-1/2 text-white">
                  <h1 className="text-4xl font-bold">Exclusive Content</h1>
                  <p className="text-lg mt-2">Enjoy premium movies today!</p>
                </div>
              </div>
            </SwiperSlide>
          </Swiper>
        </div>

        {/* Filters */}
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

        {/* Movie List */}
        <MovieList movies={movies} />

        {/* Pagination Controls */}
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

      {/* Footer */}
      <footer className="bg-gray-200 text-gray-600 p-6 text-center border-t border-gray-300">
        <p className="text-lg">© {new Date().getFullYear()} Movie+. All rights reserved.</p>
        <div className="mt-4 flex justify-center space-x-6 text-sm">
          <a href="#" className="text-gray-600 hover:text-blue-600 transition_colors duration-200">Privacy</a>
          <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors duration-200">Terms</a>
          <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors duration-200">Help</a>
          <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors duration-200">Contact</a>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;