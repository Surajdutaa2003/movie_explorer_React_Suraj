import React, { useState, useRef } from 'react';
import { Movie } from './Api';
import { useNavigate } from 'react-router-dom';

interface MovieCardProps {
  movie: Movie;
  onDeleteMovie?: (movieId: number) => Promise<void>;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie, onDeleteMovie }) => {
  const navigate = useNavigate();
  const userRole = localStorage.getItem('role');
  const token = localStorage.getItem('token');
  const [showButtons, setShowButtons] = useState(false);
  const clickTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const clickCountRef = useRef(0);

  const handleClick = () => {
    clickCountRef.current += 1;

    if (clickCountRef.current === 1) {
      clickTimeoutRef.current = setTimeout(() => {
        setShowButtons(true);
        setTimeout(() => setShowButtons(false), 5000);
        clickCountRef.current = 0;
      }, 1000);
    } else if (clickCountRef.current === 2) {
      if (clickTimeoutRef.current) {
        clearTimeout(clickTimeoutRef.current);
        clickTimeoutRef.current = null;
      }
      setShowButtons(false);

      // Check if user is logged in
      if (!token) {
        alert('Please log in to view movie details');
        navigate('/'); // Changed from '/login' to '/'
        return;
      }

      navigate(`/movieDetails/${movie.id}`);
      clickCountRef.current = 0;
    }
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering click handler
    setShowButtons(false); // Hide buttons
    navigate('/admin', { state: { movie } });
  };

  const handleDeleteClick = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering click handler
    setShowButtons(false); // Hide buttons
    if (onDeleteMovie && window.confirm('Are you sure you want to delete this movie?')) {
      try {
        await onDeleteMovie(movie.id);
      } catch (err) {
        console.error('Error deleting movie:', err);
      }
    }
  };

  return (
    <div
      className="relative group overflow-hidden rounded-lg shadow-lg transition-transform transform hover:scale-105 cursor-pointer"
      onClick={handleClick}
    >
      <img
        src={movie.poster_url}
        alt={movie.title}
        className="w-full h-[300px] object-cover"
      />
      {userRole === 'supervisor' && (
        <div className="absolute top-2 right-2 flex space-x-2">
          <button
            onClick={handleEditClick}
            className={`${
              showButtons ? 'opacity-100' : 'opacity-0'
            } md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 focus:outline-none z-10`}
            title="Edit Movie"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </button>
          <button
            onClick={handleDeleteClick}
            className={`${
              showButtons ? 'opacity-100' : 'opacity-0'
            } md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 bg-red-600 text-white p-2 rounded-full hover:bg-red-700 focus:outline-none z-10`}
            title="Delete Movie"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5-4h4m-4 4v12m4-12v12"
              />
            </svg>
          </button>
        </div>
      )}
      <div className="absolute inset-0 bg-gray-900 bg-opacity-70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
        <h3 className="text-white text-lg font-semibold">{movie.title}</h3>
        <p className="text-gray-200 text-sm">{movie.genre}</p>
        <p className="text-yellow-300 text-sm">Rating: {movie.rating.toFixed(1)}</p>
      </div>
    </div>
  );
};

export default MovieCard;