import React, { useState, useRef } from 'react';
import { Movie } from '../services/Api';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from "react-hot-toast";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

interface MovieCardProps {
  movie: Movie;
  onDeleteMovie?: (movieId: number) => Promise<void>;
  onMovieClick?: (movie: Movie) => void;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie, onDeleteMovie, onMovieClick }) => {
  const navigate = useNavigate();
  const userRole = localStorage.getItem('role');
  const token = localStorage.getItem('token');
  const [showButtons, setShowButtons] = useState(false);
  const clickTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const clickCountRef = useRef(0);

  // Validate movie prop
  if (!movie || !movie.id || !movie.title) {
    return (
      <div className="relative group overflow-hidden rounded-lg shadow-lg p-4 bg-red-50 text-red-700">
        Invalid movie data
      </div>
    );
  }

  const handleClick = () => {
    clickCountRef.current += 1;

    if (clickCountRef.current === 1) {
      setShowButtons(true);
      clickTimeoutRef.current = setTimeout(() => {
        setShowButtons(false);
        clickCountRef.current = 0;
      }, 5000);
    } else if (clickCountRef.current === 2) {
      if (clickTimeoutRef.current) {
        clearTimeout(clickTimeoutRef.current);
        clickTimeoutRef.current = null;
      }
      setShowButtons(false);

      if (!token) {
        alert('Please log in to view movie details');
        // use Settimeout to navigate to./home after 2 seconds
        navigate('/home');
        return;
      }

      if (onMovieClick) {
        onMovieClick(movie);
      }
      navigate(`/movie/${movie.id}`);
      clickCountRef.current = 0;
    }
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowButtons(false);
    navigate('/admin', { state: { movie } });
  };

  const handleDeleteClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowButtons(false);
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
        src={movie.poster_url ||'no movie'}
        alt={movie.title}
        className="w-full h-[300px] object-cover"
       
      />
      {userRole === 'supervisor' && (
        <div className="absolute top-2 right-2 flex space-x-2">
          <button
            className={`${
              showButtons ? 'opacity-100' : 'opacity-0'
            } md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 focus:outline-none z-10`}
            title="Edit Movie"
            onClick={handleEditClick}
          >
            <EditIcon sx={{ width: 20, height: 20 }} />
          </button>
          <button
            onClick={handleDeleteClick}
            className={`${
              showButtons ? 'opacity-100' : 'opacity-0'
            } md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 bg-red-600 text-white p-2 rounded-full hover:bg-red-700 focus:outline-none z-10`}
            title="Delete Movie"
          >
            <DeleteIcon sx={{ width: 20, height: 20 }} />
          </button>
        </div>
      )}
      <div className="absolute inset-0 bg-gray-900 bg-opacity-70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
        <h3 className="text-white text-lg font-semibold">{movie.title}</h3>
        <p className="text-gray-200 text-sm">{movie.genre || 'Unknown'}</p>
       <p className="text-yellow-300 text-sm">
  Rating: {parseFloat(movie.rating.toString()) ? parseFloat(movie.rating.toString()).toFixed(1) : 'N/A'}
</p>

      </div>
    </div>
  );
};

export default MovieCard;