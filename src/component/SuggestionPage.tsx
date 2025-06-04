import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { fetchMovies, setSelectedGenre } from '../redux/movieSlice';
import { RootState, AppDispatch } from '../redux/store';
import MovieList from './MovieList';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import '../styles/DashboardAnimations.css';

interface MoodMap {
  [key: string]: string;
}

const moodToGenreMap: MoodMap = {
  Happy: 'Comedy',
  Sad: 'Drama',
  Excited: 'Action',
  Romantic: 'Romance',
  Scared: 'Horror',
  Adventurous: 'Adventure',
  Mysterious: 'Mystery',
  Thoughtful: 'Documentary',
};

// Custom debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

const SuggestionPage: React.FC = () => {
  // Initialize state from sessionStorage or localStorage to persist across navigation
  const getInitialMood = () => {
    const savedMood = sessionStorage.getItem('selectedMood');
    return savedMood || '';
  };

  const getInitialMoodInput = () => {
    const savedMoodInput = sessionStorage.getItem('moodInput');
    return savedMoodInput || '';
  };

  const [selectedMood, setSelectedMood] = useState<string>(getInitialMood);
  const [moodInput, setMoodInput] = useState<string>(getInitialMoodInput);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { movies, loading, error, page, selectedGenre } = useSelector((state: RootState) => state.movies);

  // Debounce the mood input with a 3-second delay
  const debouncedMoodInput = useDebounce(moodInput, 3000);

  // Save state to sessionStorage whenever it changes
  useEffect(() => {
    if (selectedMood) {
      sessionStorage.setItem('selectedMood', selectedMood);
    } else {
      sessionStorage.removeItem('selectedMood');
    }
  }, [selectedMood]);

  useEffect(() => {
    if (moodInput) {
      sessionStorage.setItem('moodInput', moodInput);
    } else {
      sessionStorage.removeItem('moodInput');
    }
  }, [moodInput]);

  // Handle mood input changes and matching
  useEffect(() => {
    if (debouncedMoodInput) {
      const inputLower = debouncedMoodInput.toLowerCase();
      const matchedMood = Object.keys(moodToGenreMap).find(mood =>
        inputLower.includes(mood.toLowerCase())
      );

      if (matchedMood) {
        setSelectedMood(matchedMood);
      } else {
        setSelectedMood(''); // Clear selected mood if no match
      }
    } else {
      setSelectedMood(''); // Clear selected mood if input is empty
    }
  }, [debouncedMoodInput]);

  // Fetch movies when mood changes or on component mount
  useEffect(() => {
    if (selectedMood) {
      const genre = moodToGenreMap[selectedMood];
      dispatch(setSelectedGenre(genre));
      dispatch(fetchMovies({ page, searchQuery: '', genre }));
    }
  }, [dispatch, selectedMood, page]);

  // On component mount, if we have a selected mood but no movies, refetch
  useEffect(() => {
    if (selectedMood && movies.length === 0 && !loading) {
      const genre = moodToGenreMap[selectedMood];
      dispatch(setSelectedGenre(genre));
      dispatch(fetchMovies({ page, searchQuery: '', genre }));
    }
  }, []); // Empty dependency array means this runs only on mount

  const handleMoodInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMoodInput(e.target.value);
  };

  const handleMoodButtonClick = (mood: string) => {
    setSelectedMood(mood);
    setMoodInput(mood);
  };

  const handleMovieClick = (movie: any) => {
    // Store current state before navigation
    sessionStorage.setItem('selectedMood', selectedMood);
    sessionStorage.setItem('moodInput', moodInput);
    
    const navigationState = { fromSuggestions: true };
    console.log('Navigating from suggestions with state:', navigationState);
    localStorage.setItem('fromSuggestions', 'true');
    navigate(`/movie/${movie.id}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Back button */}
        <motion.button
          onClick={() => navigate('/')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mb-6 flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors duration-300"
        >
          <ArrowBackIcon />
          <span>Go Back</span>
        </motion.button>

        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          How are you feeling today?
        </h1>

        <div className="mb-8">
          <input
            type="text"
            value={moodInput}
            onChange={handleMoodInputChange}
            placeholder="Describe your mood (e.g., happy, sad, romantic)"
            className="w-full p-3 rounded-lg shadow-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {moodInput && !selectedMood && (
            <p className="text-gray-600 mt-2">
              Try using words like {Object.keys(moodToGenreMap).join(', ').toLowerCase()}
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {Object.keys(moodToGenreMap).map((mood) => (
            <motion.button
              key={mood}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleMoodButtonClick(mood)}
              className={`p-4 rounded-lg shadow-md transition-colors duration-300 ${selectedMood === mood
                ? 'bg-blue-500 text-white'
                : 'bg-white hover:bg-blue-50'
                }`}
            >
              <div className="text-2xl mb-2">
                {getMoodEmoji(mood)}
              </div>
              <div className="font-medium">
                {mood}
              </div>
            </motion.button>
          ))}
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center h-96 gap-4">
            <div className="film-reel"></div>
            <p className="text-gray-600 font-medium animate-pulse">
              Finding movies for your {selectedMood.toLowerCase()} mood...
            </p>
          </div>
        ) : error ? (
          <div className="text-red-500 text-center">{error}</div>
        ) : selectedMood && movies.length > 0 ? (
          <div>
            <h2 className="text-2xl font-semibold mb-6 text-center">
              Recommended movies for your {selectedMood.toLowerCase()} mood
            </h2>
            <MovieList
              movies={movies}
              onMovieClick={handleMovieClick}
            />
          </div>
        ) : selectedMood && (
          <div className="text-center text-gray-600">
            No movies found for this mood. Try another one!
          </div>
        )}
      </div>
    </div>
  );
};

// Helper function to get emoji for each mood
function getMoodEmoji(mood: string): string {
  const emojiMap: MoodMap = {
    Happy: '😊',
    Sad: '😢',
    Excited: '🤩',
    Romantic: '💝',
    Scared: '😱',
    Adventurous: '🏃‍♂️',
    Mysterious: '🔍',
    Thoughtful: '🤔',
  };
  return emojiMap[mood] || '🎬';
}

export default SuggestionPage;