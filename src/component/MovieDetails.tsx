import React, { useEffect, useState, useCallback, memo } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { motion, Variants } from 'framer-motion';
import { getMovieById } from '../services/Api';
import { getSubscriptionStatus } from '../services/subApi';
import { Movie } from '../services/Api';
import '../styles/MovieDetails.css';
import CloseIcon from '@mui/icons-material/Close';
import StarIcon from '@mui/icons-material/Star';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import MovieIcon from '@mui/icons-material/Movie';
import PersonIcon from '@mui/icons-material/Person';
import ConnectedTvIcon from '@mui/icons-material/ConnectedTv';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import PauseIcon from '@mui/icons-material/Pause';

interface MovieDetailProps {
  onClose?: () => void;
}

const MovieDetail: React.FC<MovieDetailProps> = ({ onClose = () => { } }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [userPlan, setUserPlan] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [utterance, setUtterance] = useState<SpeechSynthesisUtterance | null>(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    console.log('MovieDetail mounted with location:', {
      state: location.state,
      pathname: location.pathname,
      search: location.search
    }); if (!token) {
      console.log('No token, redirecting to /');
      navigate('/');
    }
  }, [navigate, token]);

  useEffect(() => {
    const fetchSubscriptionStatus = async () => {
      try {
        const response = await getSubscriptionStatus();
        setUserPlan(response.plan || 'free');
      } catch (err: any) {
        console.error('Error fetching subscription status:', err);
      }
    };

    fetchSubscriptionStatus();
  }, []);

  useEffect(() => {
    const fetchMovieDetail = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const data = await getMovieById(Number(id));
        setMovie(data);
        setError(null);
      } catch (err: any) {
        console.error('Error fetching movie details:', err);
        setError(err.message || 'Failed to load movie details');
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetail();
  }, [id]);

  useEffect(() => {
    return () => {
      if (isSpeaking) {
        speechSynthesis.cancel();
        setIsSpeaking(false);
        setIsPaused(false);
        setUtterance(null);
      }
    };
  }, [isSpeaking]);

  const handleTextToSpeech = useCallback(() => {
    if (!movie?.description) return;

    if (isSpeaking && !isPaused) {
      speechSynthesis.pause();
      setIsPaused(true);
    } else if (isSpeaking && isPaused) {
      speechSynthesis.resume();
      setIsPaused(false);
    } else {
      speechSynthesis.cancel();
      const newUtterance = new SpeechSynthesisUtterance(movie.description);
      newUtterance.lang = 'en-US';
      newUtterance.rate = 1.0;
      newUtterance.pitch = 1.0;
      newUtterance.volume = 1.0;

      newUtterance.onend = () => {
        setIsSpeaking(false);
        setIsPaused(false);
        setUtterance(null);
      };

      newUtterance.onerror = () => {
        console.error('Speech synthesis error');
        setIsSpeaking(false);
        setIsPaused(false);
        setUtterance(null);
      };

      setUtterance(newUtterance);
      speechSynthesis.speak(newUtterance);
      setIsSpeaking(true);
      setIsPaused(false);
    }
  }, [movie?.description, isSpeaking, isPaused]);

  if (!id || !token) return null;

  // Check for 'from' in query params as fallback
  const queryParams = new URLSearchParams(location.search);
  const fromQuery = queryParams.get('from');

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      console.log('Backdrop clicked, state:', location.state, 'query from:', fromQuery);
      onClose();
      console.log("fromSuggestions in localStorage:", localStorage.getItem("fromSuggestions"));
      const fromSuggestions = localStorage.getItem("fromSuggestions")
      // Navigate based on state or query param
      const destination = fromSuggestions ? '/suggestions' : '/';
      console.log('Navigating to:', destination);
      localStorage.removeItem("fromSuggestions")
      navigate(destination);
    }
  };

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isSpeaking) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
      setIsPaused(false);
      setUtterance(null);
    }
    console.log('Close button clicked, state:', location.state, 'query from:', fromQuery);
    onClose();
    // Navigate based on state or query param

    const fromSuggestions = localStorage.getItem("fromSuggestions");
    console.log("fromSuggestions in localStorage:", fromSuggestions);
    const destination = fromSuggestions ? '/suggestions' : '/';
    console.log('Navigating to:', destination);
    localStorage.removeItem("fromSuggestions")
    navigate(destination);
  };

  const handleSubscribe = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('Navigating to pricing page');
    navigate('/pricing');
  };

  // Animation variants
  const cardVariants = {
    hidden: { rotateY: -180, opacity: 0 },
    visible: {
      rotateY: 0,
      opacity: 1,
      transition: { duration: 0.8, ease: 'easeOut' },
    },
  };

  const textContainerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.03,
        delayChildren: 0.8,
      },
    },
  };

  const textChildVariants: Variants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.3, ease: 'easeOut' },
    },
  };

  const AnimatedText = memo<{ text: string; className?: string }>(
    ({ text, className }) => {
      return (
        <motion.span
          className={className}
          variants={textContainerVariants}
          initial="hidden"
          animate="visible"
        >
          {text.split('').map((char, index) => (
            <motion.span key={index} variants={textChildVariants} className="inline-block">
              {char === ' ' ? '\u00A0' : char}
            </motion.span>
          ))}
        </motion.span>
      );
    }
  );

  return (
    <div
      className="movie-detail-backdrop"
      style={{
        backgroundImage: `url(${movie?.poster_url ||
          'https://encrypted-tbn0.gstatic.com/shopping?q=tbn9GcQoSOgjBmQN9GUg3GQnTNKJHlyuZjP8ESr8AMgf7fYTu9rOr9G5Ewd9IMMi6nuCu8LNp_I8xIMBrlRbt_AJ8fLyVysNlk93Q0so4nyU5c0Hdw9Pd4Q1bemJ'
          })`,
      }}
      onClick={handleBackdropClick}
    >
      <motion.div
        className="movie-detail-card"
        variants={cardVariants}
        initial="hidden"
        animate="visible"
      >
        {loading ? (
          <div className="flex items-center justify-center h-96">
            <div className="loading-spinner"></div>
          </div>
        ) : error ? (
          <div className="p-6 text-center">
            <AnimatedText text="Subscribe to premium to watch this content" className="text-blue-500" />
            <button className="subscribe-button" onClick={handleSubscribe}>
              Subscribe Now
            </button>
          </div>
        ) : movie && userPlan === 'free' && movie.premium ? (
          <div className="p-6 text-center">
            <AnimatedText text="Subscribe to premium to watch this content" className="text-blue-500" />
            <button className="subscribe-button" onClick={handleSubscribe}>
              Subscribe Now
            </button>
          </div>
        ) : movie ? (
          <div className="relative">
            <button className="close-button" onClick={handleClose}>
              <CloseIcon />
            </button>

            <div className="md:flex">
              <div className="md:w-1/3 p-4">
                <div className="poster-container">
                  <img
                    src={
                      movie.poster_url ||
                      'https://encrypted-tbn0.gstatic.com/shopping?q=tbn9GcQoSOgjBmQN9GUg3GQnTNKJHlyuZjP8ESr8AMgf7fYTu9rOr9G5Ewd9IMMi6nuCu8LNp_I8xIMBrlRbt_AJ8fLyVysNlk93Q0so4nyU5c0Hdw9Pd4Q1bemJ'
                    }
                    alt={movie.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              <div className="md:w-2/3 p-6">
                <AnimatedText
                  text={movie.title}
                  className="text-3xl font-bold text-gray-800 mb-2"
                />
                <div className="flex items-center space-x-2 mb-4">
                  <AnimatedText
                    text={movie.genre}
                    className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded"
                  />
                  <div className="flex items-center text-yellow-500">
                    <StarIcon sx={{ width: 16, height: 16 }} />
                    <AnimatedText text={Number(movie.rating).toFixed(1)} className="ml-1 text-yellow-500" />
                  </div>
                </div>

                <div className="flex items-center">
                  <AnimatedText
                    text={movie.description}
                    className="text-gray-700 mb-6"
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleTextToSpeech();
                    }}
                    className="ml-2 text-gray-500 hover:text-gray-800 transition"
                    title={isSpeaking && !isPaused ? 'Pause description' : 'Listen to description'}
                  >
                    {isSpeaking && !isPaused ? <PauseIcon /> : <VolumeUpIcon />}
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center">
                    <CalendarMonthIcon className="text-gray-500 mr-2" sx={{ width: 16, height: 16 }} />
                    <AnimatedText text="Release Year:" className="text-sm text-gray-600" />
                    <AnimatedText
                      text={movie.release_year.toString()}
                      className="ml-2 text-gray-800"
                    />
                  </div>

                  <div className="flex items-center">
                    <AccessTimeIcon className="text-gray-500 mr-2" sx={{ width: 16, height: 16 }} />
                    <AnimatedText text="Duration:" className="text-sm text-gray-600" />
                    <AnimatedText
                      text={`${movie.duration} min`}
                      className="ml-2 text-gray-800"
                    />
                  </div>

                  <div className="flex items-center">
                    <MovieIcon className="text-gray-500 mr-2" sx={{ width: 16, height: 16 }} />
                    <AnimatedText text="Director:" className="text-sm text-gray-600" />
                    <AnimatedText text={movie.director} className="ml-2 text-gray-800" />
                  </div>

                  <div className="flex items-center">
                    <PersonIcon className="text-gray-500 mr-2" sx={{ width: 16, height: 16 }} />
                    <AnimatedText text="Main Lead:" className="text-sm text-gray-600" />
                    <AnimatedText text={movie.main_lead} className="ml-2 text-gray-800" />
                  </div>

                  <div className="flex items-center">
                    <ConnectedTvIcon className="text-gray-500 mr-2" sx={{ width: 16, height: 16 }} />
                    <AnimatedText text="Streaming Platform:" className="text-sm text-gray-600" />
                    <AnimatedText
                      text={movie.streaming_platform}
                      className="ml-2 text-gray-800"
                    />
                  </div>

                  <div className="flex items-center">
                    <WorkspacePremiumIcon className="text-gray-500 mr-2" sx={{ width: 16, height: 16 }} />
                    <AnimatedText text="Premium:" className="text-sm text-gray-600" />
                    <AnimatedText
                      text={movie.premium ? 'Yes' : 'No'}
                      className="ml-2 text-gray-800"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <AnimatedText text="Movie not found" className="text-center text-gray-600" />
        )}
      </motion.div>
    </div>
  );
};

export default MovieDetail;
// ss