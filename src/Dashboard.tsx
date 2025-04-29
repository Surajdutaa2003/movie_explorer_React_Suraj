import React, { useState, useEffect } from 'react';
import MovieList from './MovieList';
import { getMovies } from './Api';
import { Link } from 'react-router-dom';

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

const Dashboard: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [genres, setGenres] = useState<string[]>(['All']);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navItems = ['Home', 'Movies', 'Series', 'My List'];

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        const response = await getMovies(page);
        setMovies(response.data);
        setTotalPages(response.meta.total_pages);
        // Derive unique genres
        const uniqueGenres = ['All', ...new Set(response.data.map((movie) => movie.genre))];
        setGenres(uniqueGenres);
      } catch (err) {
        console.error('Error fetching movies:', err);
        setError('Failed to load movies. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [page]);

  const filteredMovies = movies.filter((movie) => {
    const matchesTitle = movie.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGenre = selectedGenre === 'All' || movie.genre === selectedGenre;
    return matchesTitle && matchesGenre;
  });

  if (loading) {
    return <div className="text-gray-900 text-center min-h-screen bg-gray-100">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center min-h-screen bg-gray-100">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 flex flex-col justify-between">
      {/* Navbar */}
      <nav className="flex items-center justify-between p-4 border-b border-gray-300 bg-white">
        <div className="text-2xl font-bold text-gray-900">Movie+</div>
        <div className="md:hidden">
          <button onClick={() => setMenuOpen(!menuOpen)}>
            <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
            >
              {item}
            </Link>
          ))}
          <Link
            to="/pricing"
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            Subscribe
          </Link>
        </div>
      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white p-4 border-b border-gray-300">
          <div className="flex flex-col space-y-2">
            {navItems.map((item) => (
              <Link
                key={item}
                to={item === 'Home' ? '/home' : `/${item.toLowerCase()}`}
                className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                {item}
              </Link>
            ))}
            <Link
              to="/pricing"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 text-center"
              onClick={() => setMenuOpen(false)}
            >
              Subscribe
            </Link>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="p-6 flex flex-col md:flex-row md:items-center md:space-x-4 space-y-4 md:space-y-0">
        <input
          type="text"
          placeholder="Search by title..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="px-4 py-2 rounded bg-gray-50 text-gray-900 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          value={selectedGenre}
          onChange={(e) => setSelectedGenre(e.target.value)}
          className="px-4 py-2 rounded bg-gray-50 text-gray-900 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {genres.map((genre) => (
            <option key={genre} value={genre}>
              {genre}
            </option>
          ))}
        </select>
      </div>

      {/* Main Content */}
      <main className="flex-1 p-6 bg-gray-100">
        <MovieList movies={filteredMovies} />
        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="mt-6 flex justify-center space-x-4">
            <button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded disabled:opacity-50 hover:bg-blue-500 hover:text-white transition-colors"
            >
              Previous
            </button>
            <span className="px-4 py-2 text-gray-700">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={page === totalPages}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded disabled:opacity-50 hover:bg-blue-500 hover:text-white transition-colors"
            >
              Next
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-200 text-gray-600 p-4 text-center text-sm border-t border-gray-300">
        <p>© {new Date().getFullYear()} Movie+. All rights reserved.</p>
        <div className="mt-2 flex justify-center space-x-4 text-xs">
          <a href="#" className="text-gray-600 hover:text-blue-600">Privacy</a>
          <a href="#" className="text-gray-600 hover:text-blue-600">Terms</a>
          <a href="#" className="text-gray-600 hover:text-blue-600">Help</a>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;