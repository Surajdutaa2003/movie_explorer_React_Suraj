import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMovieById } from '../Api';
import { Movie } from '../Api';
import { createSubscription, getSubscriptionStatus } from '../subApi';
import {toast} from 'react-hot-toast';

interface MovieDetailProps {
  onClose?: () => void;
}

const MovieDetail: React.FC<MovieDetailProps> = ({ onClose = () => {} }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [subscriptionStatus, setSubscriptionStatus] = useState<{
    is_active: boolean;
    plan_type?: string;
  } | null>(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      navigate('/home');
    }
  }, [navigate, token]);

  useEffect(() => {
    const fetchMovieDetailAndSubscription = async () => {
      if (!id || !token) return;

      try {
        setLoading(true);

        // Fetch movie details
        const movieData = await getMovieById(Number(id));
        setMovie(movieData);

        // Fetch subscription status
        const status = await getSubscriptionStatus(token);
        setSubscriptionStatus(status);

        setError(null);
      } catch (err: any) {
        console.error('Error fetching data:', err);
        setError(err.message || 'Failed to load movie details or subscription status');
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetailAndSubscription();
  }, [id, token]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      console.log('Backdrop clicked, calling onClose and navigating');
      onClose();
      navigate('/');
    }
  };

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('Close button clicked, calling onClose and navigating');
    onClose();
    navigate('/');
  };

  const handleSubscribe = () => {
    navigate('/pricing');
  };
  

  if (!id || !token) return null;

  const isPremiumMovie = movie?.premium;
  const isSubscribed = subscriptionStatus?.is_active ?? false;
  const isPremiumSubscriber = isSubscribed && subscriptionStatus?.plan_type === 'premium';

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 p-4 overflow-y-auto"
      style={{
        backgroundImage: `url(${
          movie?.poster_url ||
          'https://encrypted-tbn0.gstatic.com/shopping?q=tbn9GcQoSOgjBmQN9GUg3GQnTNKJHlyuZjP8ESr8AMgf7fYTu9rOr9G5Ewd9IMMi6nuCu8LNp_I8xIMBrlRbt_AJ8fLyVysNlk93Q0so4nyU5c0Hdw9Pd4Q1bemJ'
        })`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backdropFilter: 'blur(220px)',
        WebkitBackdropFilter: 'blur(120px)',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
      }}
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center h-96">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="p-6 text-center">
            <p className="text-red-500">{error}</p>
            <button
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              onClick={handleClose}
            >
              Close
            </button>
          </div>
        ) : movie && isPremiumMovie && !isPremiumSubscriber ? (
          <div className="p-6 text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Premium Content</h2>
            <p className="text-gray-600 mb-6">
              This movie is exclusive to premium subscribers. Subscribe to a premium plan to unlock access!
            </p>
            <button
              className="px-6 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
              onClick={handleSubscribe}
            >
              Subscribe to Premium
            </button>
            <button
              className="mt-4 ml-4 px-6 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
              onClick={handleClose}
            >
              Close
            </button>
          </div>
        ) : movie ? (
          <div className="relative">
            <button
              className="absolute top-4 right-4 text-gray-700 hover:text-gray-900 bg-white rounded-full p-1 shadow-md z-10"
              onClick={handleClose}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>

            <div className="md:flex">
              <div className="md:w-1/3 p-4">
                <div className="h-[400px] overflow-hidden rounded-lg shadow-lg">
                  <img
                    src={movie.poster_url || 'https://encrypted-tbn0.gstatic.com/shopping?q=tbn9GcQoSOgjBmQN9GUg3GQnTNKJHlyuZjP8ESr8AMgf7fYTu9rOr9G5Ewd9IMMi6nuCu8LNp_I8xIMBrlRbt_AJ8fLyVysNlk93Q0so4nyU5c0Hdw9Pd4Q1bemJ'}
                    alt={movie.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              <div className="md:w-2/3 p-6">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">{movie.title}</h2>

                <div className="flex items-center space-x-2 mb-4">
                  <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded">
                    {movie.genre}
                  </span>
                  <div className="flex items-center text-yellow-500">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                    </svg>
                    <span className="ml-1">{movie.rating.toFixed(1)}</span>
                  </div>
                  <span
                    className={`text-sm font-medium px-2.5 py-0.5 rounded ${
                      movie.premium ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                    }`}
                  >
                    {movie.premium ? 'Premium' : 'Free'}
                  </span>
                </div>

                <p className="text-gray-700 mb-6">{movie.description}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-gray-500 mr-2"
                    >
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                      <line x1="16" y1="2" x2="16" y2="6"></line>
                      <line x1="8" y1="2" x2="8" y2="6"></line>
                      <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                    <span className="text-sm text-gray-600">Release Year:</span>
                    <span className="ml-2 text-gray-800">{movie.release_year}</span>
                  </div>

                  <div className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-gray-500 mr-2"
                    >
                      <circle cx="12" cy="12" r="10"></circle>
                      <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                    <span className="text-sm text-gray-600">Duration:</span>
                    <span className="ml-2 text-gray-800">{movie.duration} min</span>
                  </div>

                  <div className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-gray-500 mr-2"
                    >
                      <path d="M12 20.99V20H8A4 4 0 018 12h1M12 8V4a4 4 0 100 8z"></path>
                    </svg>
                    <span className="text-sm text-gray-600">Director:</span>
                    <span className="ml-2 text-gray-800">{movie.director}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-700">Movie not found</p>
        )}
      </div>
    </div>
  );
};

export default MovieDetail;
// working