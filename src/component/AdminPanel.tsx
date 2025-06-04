import React, { useState, useEffect } from 'react';
import { createMovie, updateMovie, Movie } from '../services/Api';
import { useLocation, useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

interface MovieFormData {
  title: string;
  genre: string;
  release_year: number;
  rating: number;
  director: string;
  duration: number;
  description: string;
  main_lead: string;
  streaming_platform: string;
  premium: boolean;
  poster?: File;
  banner?: File;
}

const AdminPanel: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const movie: Movie | undefined = location.state?.movie;

  const initialFormData: MovieFormData = movie
    ? {
        title: movie.title,
        genre: movie.genre,
        release_year: movie.release_year,
        rating: Number(movie.rating),
        director: movie.director,
        duration: movie.duration,
        description: movie.description,
        main_lead: movie.main_lead,
        streaming_platform: movie.streaming_platform,
        premium: movie.premium,
        poster: undefined,
        banner: undefined,
      }
    : {
        title: '',
        genre: '',
        release_year: new Date().getFullYear(),
        rating: 0,
        director: '',
        duration: 0,
        description: '',
        main_lead: '',
        streaming_platform: '',
        premium: false,
        poster: undefined,
        banner: undefined,
      };

  const [formData, setFormData] = useState<MovieFormData>(initialFormData);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false); // New state for loading
  const isEditMode = !!movie;

  useEffect(() => {
    setFormData(initialFormData);
    window.scrollTo(0, 0); // Scroll to top when component mounts or location.state changes
  }, [location.state]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === 'number' ? (value ? Number(value) : 0) :
        name === 'premium' ? (e.target as HTMLInputElement).checked :
        value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files && files.length > 0 ? files[0] : undefined,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsLoading(true); // Disable button

    const loadingToast = toast.loading(isEditMode ? 'Updating movie...' : 'Adding movie...');

    try {
      const requiredFields: (keyof MovieFormData)[] = [
        'title', 'genre', 'release_year', 'rating', 'director', 'duration',
        'description', 'main_lead', 'streaming_platform'
      ];
      for (const field of requiredFields) {
        if (!formData[field] || (typeof formData[field] === 'string' && formData[field].trim() === '')) {
          throw new Error(`Please fill in the ${field.replace('_', ' ')} field.`);
        }
      }

      if (formData.rating < 0 || formData.rating > 10) {
        throw new Error('Rating must be between 0 and 10.');
      }

      if (formData.description.length > 1000) {
        throw new Error('Description must be 1000 characters or less.');
      }

      const validPlatforms = ['Amazon Prime', 'Netflix', 'Jio Hotstar', 'Netflix Zee5', 'Netflix Amazon Prime'];
      if (!validPlatforms.includes(formData.streaming_platform)) {
        throw new Error('Please select a valid streaming platform.');
      }

      const movieData: MovieFormData = {
        ...formData,
        rating: formData.rating,
        premium: formData.premium !== undefined ? formData.premium : false,
      };

      if (isEditMode && movie) {
        const response = await updateMovie(movie.id, movieData);
        toast.success('Movie updated successfully!', { id: loadingToast });
        navigate('/');
      } else {
        const response = await createMovie(movieData);
        toast.success('Movie added successfully!', { id: loadingToast });
        setFormData({
          title: '',
          genre: '',
          release_year: new Date().getFullYear(),
          rating: 0,
          director: '',
          duration: 0,
          description: '',
          main_lead: '',
          streaming_platform: '',
          premium: false,
          poster: undefined,
          banner: undefined,
        });
      }
    } catch (err: any) {
      if (err.message.includes('Session expired') || err.message.includes('Unauthorized')) {
        toast.error('Your session has expired. Please log in again.', { id: loadingToast });
        navigate('/login');
      } else {
        toast.error(err.message || `Failed to ${isEditMode ? 'update' : 'add'} movie.`, { id: loadingToast });
      }
    } finally {
      setIsLoading(false); // Re-enable button
    }
  };

  const handleGoBack = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-50 p-8">
      <Toaster position="top-right" />
      <div className="max-w-3xl mx-auto">
        <header className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-gray-800 bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent drop-shadow-md">
            Admin Panel - {isEditMode ? 'Edit Movie' : 'Add Movie'}
          </h1>
          <p className="text-gray-600 mt-2">{isEditMode ? 'Update the movie details below.' : 'Create a new movie entry with ease.'}</p>
          <button
            onClick={handleGoBack}
            className="mt-4 px-4 py-2 bg-transparent border border-blue-500 text-blue-500 rounded-lg hover:bg-blue-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300"
          >
            Go Back Home
          </button>
        </header>

        <div className="bg-white rounded-xl shadow-2xl p-6 border border-gray-100 transform hover:scale-[1.02] transition-transform duration-300">
          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200 animate-pulse">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-lg border border-green-200 animate-pulse">
              {success}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-semibold text-gray-700">Movie Title *</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="mt-2 block w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-200 shadow-inner"
                placeholder="e.g., The Shawshank Redemption"
              />
            </div>

            <div>
              <label htmlFor="genre" className="block text-sm font-semibold text-gray-700">Genre *</label>
              <select
                id="genre"
                name="genre"
                value={formData.genre}
                onChange={handleChange}
                required
                className="mt-2 block w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-200 shadow-inner"
              >
                <option value="" disabled>Select a genre</option>
                <option value="Action">Action</option>
                <option value="Comedy">Comedy</option>
                <option value="Drama">Drama</option>
                <option value="Horror">Horror</option>
                <option value="Science Fiction">Sci-fi</option>
                <option value="Romance">Romance</option>
                <option value="Thriller">Thriller</option>
                <option value="Crime">Crime</option>
                <option value="Anime">Anime</option>
              </select>
            </div>

            <div>
              <label htmlFor="release_year" className="block text-sm font-semibold text-gray-700">Release Year *</label>
              <input
                type="number"
                id="release_year"
                name="release_year"
                value={formData.release_year || ''}
                onChange={handleChange}
                required
                min="1900"
                max={new Date().getFullYear()}
                className="mt-2 block w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-200 shadow-inner"
                placeholder="e.g., 1994"
              />
            </div>

            <div>
              <label htmlFor="rating" className="block text-sm font-semibold text-gray-700">Rating (0-10) *</label>
              <input
                type="number"
                id="rating"
                name="rating"
                value={formData.rating !== undefined ? formData.rating : ''}
                onChange={handleChange}
                required
                min="0"
                max="10"
                step="0.1"
                className="mt-2 block w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-200 shadow-inner"
                placeholder="e.g., 9.2"
              />
            </div>

            <div>
              <label htmlFor="director" className="block text-sm font-semibold text-gray-700">Director *</label>
              <input
                type="text"
                id="director"
                name="director"
                value={formData.director}
                onChange={handleChange}
                required
                className="mt-2 block w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-200 shadow-inner"
                placeholder="e.g., Frank Darabont"
              />
            </div>

            <div>
              <label htmlFor="duration" className="block text-sm font-semibold text-gray-700">Duration (minutes) *</label>
              <input
                type="number"
                id="duration"
                name="duration"
                value={formData.duration || ''}
                onChange={handleChange}
                required
                min="1"
                className="mt-2 block w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-200 shadow-inner"
                placeholder="e.g., 142"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-semibold text-gray-700">Description (max 1000 characters) *</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={4}
                maxLength={1000}
                className="mt-2 block w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-200 shadow-inner"
                placeholder="e.g., Two imprisoned men bond over decades..."
              />
            </div>

            <div>
              <label htmlFor="main_lead" className="block text-sm font-semibold text-gray-700">Main Lead *</label>
              <input
                type="text"
                id="main_lead"
                name="main_lead"
                value={formData.main_lead}
                onChange={handleChange}
                required
                className="mt-2 block w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-200 shadow-inner"
                placeholder="e.g., Tim Robbins"
              />
            </div>

            <div>
              <label htmlFor="streaming_platform" className="block text-sm font-semibold text-gray-700">Streaming Platform *</label>
              <select
                id="streaming_platform"
                name="streaming_platform"
                value={formData.streaming_platform}
                onChange={handleChange}
                required
                className="mt-2 block w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-200 shadow-inner"
              >
                <option value="" disabled>Select a platform</option>
                <option value="Amazon Prime">Amazon Prime</option>
                <option value="Netflix">Netflix</option>
                <option value="Jio Hotstar">Jio Hotstar</option>
                <option value="HBO">HBO</option>
                <option value="HULU">HULU</option>
              </select>
            </div>

            <div>
              <label htmlFor="premium" className="block text-sm font-semibold text-gray-700">Premium Content *</label>
              <input
                type="checkbox"
                id="premium"
                name="premium"
                checked={formData.premium}
                onChange={handleChange}
                className="mt-2 h-5 w-5 text-blue-600 border-gray-200 rounded focus:ring-blue-400"
              />
            </div>

            <div>
              <label htmlFor="poster" className="block text-sm font-semibold text-gray-700">Poster Image (JPEG/PNG)</label>
              <input
                type="file"
                id="poster"
                name="poster"
                accept="image/jpeg,image/png"
                onChange={handleFileChange}
                className="mt-2 block w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-200 shadow-inner"
              />
            </div>

            <div>
              <label htmlFor="banner" className="block text-sm font-semibold text-gray-700">Banner Image (JPEG/PNG)</label>
              <input
                type="file"
                id="banner"
                name="banner"
                accept="image/jpeg,image/png"
                onChange={handleFileChange}
                className="mt-2 block w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-200 shadow-inner"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading} // Disable button when loading
              className={`w-full mt-6 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300 shadow-lg transform ${
                isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:from-blue-600 hover:to-indigo-700 hover:scale-105'
              }`}
            >
              {isEditMode ? 'Update Movie' : 'Add Movie'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;