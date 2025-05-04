import React from 'react';

interface MovieCardProps {
  id: number;
  title: string;
  poster: string;
  genre: string;
  rating: number;
  onMovieClick: (movieId: number) => void;
}

const MovieCard: React.FC<MovieCardProps> = ({ id, title, poster, genre, rating, onMovieClick }) => {
  const handleClick = () => {
    onMovieClick(id);
  };

  return (
    <div 
      className="relative group overflow-hidden rounded-lg shadow-lg transition-transform transform hover:scale-105 cursor-pointer"
      onClick={handleClick}
    >
      <img
        src={poster}
        alt={title}
        className="w-full h-[300px] object-cover"
      />
      <div className="absolute inset-0 bg-gray-900 bg-opacity-70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
        <h3 className="text-white text-lg font-semibold">{title}</h3>
        <p className="text-gray-200 text-sm">{genre}</p>
        <p className="text-yellow-300 text-sm">Rating: {rating.toFixed(1)}</p>
      </div>
    </div>
  );
};

export default MovieCard;
// ss