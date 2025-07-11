import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import MovieList from './MovieList';
import { Movie, logoutUser, deleteMovie } from '../services/Api';
import { Link, useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import '../styles/Dashboard.css'; // Import the CSS file
import '../styles/DashboardAnimations.css'; // Add this import
import useDebounce from '../hooks/useDebounce';
import { fetchMovies, setPage, setSearchQuery, setSelectedGenre } from '../redux/movieSlice';
import { fetchSliderMovies } from '../redux/sliderSlice';
import { RootState, AppDispatch } from '../redux/store';
import ChatBot from './ChatBot';
import VoiceSearch from './VoiceSearch';
import NearbyTheaters from './NearbyTheaters';

interface MovieListProps {
  movies: Movie[];
  onMovieClick: (movie: Movie) => void;
  onDeleteMovie?: (movieId: number) => Promise<void>;
}

const Dashboard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [isContentVisible, setIsContentVisible] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [showScrollArrow, setShowScrollArrow] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false); // Add initialization flag
  
  // Movie state from Redux
  const { 
    movies, 
    genres, 
    loading, 
    error, 
    successMessage, 
    page, 
    totalPages, 
    searchQuery, 
    selectedGenre 
  } = useSelector((state: RootState) => state.movies);
  
  // Slider state from Redux
  const { sliderMovies, sliderLoading, sliderError } = useSelector((state: RootState) => state.slider);
  
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  
  const userRole = localStorage.getItem('role');
  const token = localStorage.getItem('token');

  useEffect(() => {
    dispatch(fetchSliderMovies());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchMovies({ page, searchQuery: debouncedSearchQuery, genre: selectedGenre }));
  }, [dispatch, page, debouncedSearchQuery, selectedGenre]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrollY(currentScrollY);
      
      if (currentScrollY > 50) {
        setIsContentVisible(true);
        setShowScrollArrow(false);
      } else {
        setIsContentVisible(false);
        setShowScrollArrow(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Modified useEffect - only reset on first load, not on every mount
  useEffect(() => {
    if (!isInitialized) {
      // Only reset genre selection and fetch movies on initial load
      // Check if we have any existing state, if not, reset to defaults
      if (!selectedGenre || selectedGenre === 'Genre') {
        dispatch(setSelectedGenre('All'));
      }
      
      // Only fetch if we don't have movies or if it's truly the first load
      if (movies.length === 0) {
        dispatch(fetchMovies({ 
          page: page || 1, 
          searchQuery: debouncedSearchQuery, 
          genre: selectedGenre === 'Genre' ? 'All' : selectedGenre 
        }));
      }
      
      setIsInitialized(true);
    }
  }, [isInitialized, dispatch, selectedGenre, movies.length, page, debouncedSearchQuery]);

  const openMovieDetail = (movie: Movie) => {
    setSelectedMovie(movie);
  };

  const closeMovieDetail = () => {
    setSelectedMovie(null);
  };

  const handleDeleteMovie = async (movieId: number) => {
    try {
      await deleteMovie(movieId);
      dispatch(fetchMovies({ page, searchQuery: debouncedSearchQuery, genre: selectedGenre }));
    } catch (err: any) {
      console.error('Delete movie error:', err);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      localStorage.clear();
      navigate('/goodbye');
    } catch (err: any) {
      console.error('Logout error:', err.message);
    }
  };

  const handleScrollToContent = () => {
    const contentElement = document.querySelector('main');
    if (contentElement) {
      contentElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleVoiceResult = (transcript: string) => {
    dispatch(setSearchQuery(transcript));
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">
      {/* Static logo in banner */}
      

      {/* Animated scroll arrow */}
      {showScrollArrow && (
        <div className="fixed bottom-10 left-1/2 transform -translate-x-1/2 z-50">
          <button
            onClick={handleScrollToContent}
            className="group flex flex-col items-center animate-bounce cursor-pointer"
            style={{
              animation: 'bounce 2s infinite, wave 3s ease-in-out infinite'
            }}
          >
            <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-full p-4 border border-white border-opacity-30 group-hover:bg-opacity-30 transition-all duration-300">
              <svg 
                className="w-6 h-6 text-white group-hover:text-blue-200 transition-colors duration-300" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
            <span className="text-white text-sm mt-2 font-medium opacity-80 group-hover:opacity-100 transition-opacity duration-300">
              Scroll to explore
            </span>
          </button>
        </div>
      )}

      <nav className={`fixed w-full top-0 z-50 bg-white shadow-lg border-b border-gray-200 p-4 flex items-center justify-between transition-all duration-300 ${isContentVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full'}`}>
        <div className="flex items-center space-x-4">
          <span className="text-3xl font-extrabold text-blue-600">Movie Explor</span>
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
            {userRole === 'supervisor' && (
              <Link to="/admin" className="text-sm font-medium text-gray-700 hover:text-blue-600">
                Add Movie
              </Link>
            )}
            {userRole === 'user' && (
              <Link to="/pricing" className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg">
                Subscribe
              </Link>
            )}
            <Link 
              to="/suggestions" 
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300"
            >
              <span role="img" aria-label="mood">🎭</span>
              <span>Movie Mood</span>
            </Link>
            {token ? (
              <div className="relative group">
                <div className="flex items-center space-x-2 cursor-pointer">
                  <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg dropdown-menu">
                  <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Profile
                  </Link>
                  <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <Link 
                to="/login" 
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </nav>

      {menuOpen && isContentVisible && (
        <div className="md:hidden fixed top-16 left-0 right-0 bg-white p-4 border-b border-gray-200 shadow-lg z-40">
          <div className="flex flex-col space-y-4">
            {userRole === 'supervisor' && (
              <Link to="/admin" className="text-sm font-medium text-gray-700 hover:text-blue-600" onClick={() => setMenuOpen(false)}>
                Add Movie
              </Link>
            )}
            {userRole === 'user' && (
              <Link to="/pricing" className="text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-2 rounded-lg" onClick={() => setMenuOpen(false)}>
                Subscribe Now
              </Link>
            )}
            <Link to="/profile" className="text-sm font-medium text-gray-700 hover:text-blue-600" onClick={() => setMenuOpen(false)}>
              Profile
            </Link>
            <button onClick={handleLogout} className="text-sm font-medium text-gray-700 hover:text-blue-600 text-left">
              Logout
            </button>
            <Link 
              to="/suggestions" 
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg"
              onClick={() => setMenuOpen(false)}
            >
              <span role="img" aria-label="mood">🎭</span>
              <span>Movie Mood</span>
            </Link>
            {!token && (
              <Link 
                to="/login" 
                className="text-sm font-medium text-white bg-blue-500 px-4 py-2 rounded-lg hover:bg-blue-600" 
                onClick={() => setMenuOpen(false)}
              >
                Login
              </Link>
            )}
          </div>
        </div>
      )}

      <div className={`swiper-container ${isContentVisible ? 'shrunk' : ''}`}>
        <Swiper
          modules={[Pagination, Autoplay]}
          spaceBetween={30}
          slidesPerView={1}
          pagination={{ clickable: true }}
          autoplay={{ delay: 3000, disableOnInteraction: false, pauseOnMouseEnter: true }}
          className="rounded-lg shadow-lg"
        >
          {sliderLoading ? (
            <SwiperSlide>
              <div className="flex flex-col items-center justify-center h-full gap-4">
                <div className="film-reel"></div>
                <p className="text-gray-600 font-medium animate-pulse">Loading Movies...</p>
              </div>
            </SwiperSlide>
          ) : sliderError ? (
            <SwiperSlide>
              <div className="text-red-500 text-center h-full flex items-center justify-center">
                {sliderError}
              </div>
            </SwiperSlide>
          ) : sliderMovies.length === 0 ? (
            <SwiperSlide>
              <div className="text-gray-700 text-center h-full flex items-center justify-center">
                No movies available for the slider.
              </div>
            </SwiperSlide>
          ) : (
            sliderMovies.map((movie) => (
              <SwiperSlide key={movie.id}>
                <div className="relative h-full">
                  <img
                    src={movie.banner_url || 'https://via.placeholder.com/1200x400?text=No+Banner'}
                    alt={movie.title}
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <div className="absolute top-1/2 left-6 transform -translate-y-1/2 text-white">
                    <h1 className="text-4xl font-bold banner-text title">{movie.title}</h1>
                    <p className="text-lg mt-2 banner-text description">{movie.description.slice(0, 100)}...</p>
                  </div>
                </div>
              </SwiperSlide>
            ))
          )}
        </Swiper>
      </div>

      <main className={`pt-20 p-6 bg-gray-50 transition-all duration-500 ${isContentVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
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

        <div className="mb-6 flex flex-col md:flex-row md:items-center md:space-x-4 space-y-4 md:space-y-0">
          <div className="relative flex items-center w-full md:w-auto">
            <input
              type="text"
              placeholder="Search by title..."
              value={searchQuery}
              onChange={(e) => dispatch(setSearchQuery(e.target.value))}
              className="px-4 py-2 pr-12 rounded-lg bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
            />
            <div className="absolute right-2">
              <VoiceSearch onResult={handleVoiceResult} />
            </div>
          </div>
          <select
            value={selectedGenre}
            onChange={(e) => dispatch(setSelectedGenre(e.target.value))}
            className="px-4 py-2 rounded-lg bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            <div className="flex flex-col items-center justify-center h-96 gap-4">
              <div className="film-reel"></div>
              <p className="text-gray-600 font-medium animate-pulse">Loading Movies...</p>
            </div>
          ) : error && !successMessage ? (
            <div className="text-red-500 text-center h-96 flex items-center justify-center">
              {error}
            </div>
          ) : (
            <div className={`movie-list-container transition-all duration-500 ${isContentVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <MovieList 
                movies={movies} 
                onMovieClick={openMovieDetail} 
                onDeleteMovie={userRole === 'supervisor' ? handleDeleteMovie : undefined} 
              />
            </div>
          )}
        </div>

        {/* Add Nearby Theaters section */}
        <section className="mt-8">
          <NearbyTheaters />
        </section>

        {totalPages > 1 && (
          <div className="mt-8 flex justify-center space-x-4">
            <button
              onClick={() => dispatch(setPage(Math.max(page - 1, 1)))}
              disabled={page === 1}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg disabled:opacity-50 hover:bg-blue-500 hover:text-white"
            >
              Previous
            </button>
            <span className="px-4 py-2 text-gray-700 font-medium">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => dispatch(setPage(Math.min(page + 1, totalPages)))}
              disabled={page === totalPages}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg disabled:opacity-50 hover:bg-blue-500 hover:text-white"
            >
              Next
            </button>
          </div>
        )}
        <ChatBot/>
      </main>

      <footer className={`bg-gray-200 text-gray-600 p-6 text-center border-t border-gray-300 transition-all duration-500 ${isContentVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <p className="text-lg">© {new Date().getFullYear()} Movie+. All rights reserved.</p>
        <div className="mt-4 flex justify-center space-x-6 text-sm">
          <a href="#" className="text-gray-600 hover:text-blue-600">Privacy</a>
          <a href="#" className="text-gray-600 hover:text-blue-600">Terms</a>
          <a href="#" className="text-gray-600 hover:text-blue-600">Help</a>
          <a href="#" className="text-gray-600 hover:text-blue-600">Contact</a>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
// ss