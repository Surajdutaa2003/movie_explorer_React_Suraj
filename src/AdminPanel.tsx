import React, { useState } from 'react';

interface MovieFormData {
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
}

const AdminPanel: React.FC = () => {
  const [formData, setFormData] = useState<MovieFormData>({
    title: '',
    genre: '',
    release_year: new Date().getFullYear(),
    rating: 0,
    actors: '',
    country: '',
    director: '',
    duration: 0,
    description: '',
    language: '',
    budget: '',
    box_office: '',
    poster_urls: [''],
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'release_year' || name === 'rating' || name === 'duration' ? Number(value) : value,
    }));
  };

  const handlePosterUrlChange = (index: number, value: string) => {
    setFormData((prev) => {
      const updatedUrls = [...prev.poster_urls];
      updatedUrls[index] = value;
      return { ...prev, poster_urls: updatedUrls };
    });
  };

  const addPosterUrlField = () => {
    setFormData((prev) => ({
      ...prev,
      poster_urls: [...prev.poster_urls, ''],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      const movieData = {
        ...formData,
        poster_urls: formData.poster_urls.filter((url) => url.trim() !== ''),
      };
      console.log('Movie Data:', movieData); // Log the form data to the console
      setSuccess('Movie added successfully (logged to console)!');
      setFormData({
        title: '',
        genre: '',
        release_year: new Date().getFullYear(),
        rating: 0,
        actors: '',
        country: '',
        director: '',
        duration: 0,
        description: '',
        language: '',
        budget: '',
        box_office: '',
        poster_urls: [''],
      });
    } catch (err: any) {
      setError('Failed to process the form. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-50 p-8">
      <div className="max-w-3xl mx-auto">
        <header className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-gray-800 bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent drop-shadow-md">
            Admin Panel - Add Movie
          </h1>
          <p className="text-gray-600 mt-2">Create a new movie entry with ease.</p>
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
              <label htmlFor="title" className="block text-sm font-semibold text-gray-700">Movie Title</label>
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
              <label htmlFor="genre" className="block text-sm font-semibold text-gray-700">Genre</label>
              <input
                type="text"
                id="genre"
                name="genre"
                value={formData.genre}
                onChange={handleChange}
                required
                className="mt-2 block w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-200 shadow-inner"
                placeholder="e.g., Drama"
              />
            </div>

            <div>
              <label htmlFor="release_year" className="block text-sm font-semibold text-gray-700">Release Year</label>
              <input
                type="number"
                id="release_year"
                name="release_year"
                value={formData.release_year}
                onChange={handleChange}
                required
                min="1900"
                max={new Date().getFullYear()}
                className="mt-2 block w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-200 shadow-inner"
                placeholder="e.g., 1994"
              />
            </div>

            <div>
              <label htmlFor="rating" className="block text-sm font-semibold text-gray-700">Rating (0-10)</label>
              <input
                type="number"
                id="rating"
                name="rating"
                value={formData.rating}
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
              <label htmlFor="actors" className="block text-sm font-semibold text-gray-700">Actors (comma-separated)</label>
              <input
                type="text"
                id="actors"
                name="actors"
                value={formData.actors}
                onChange={handleChange}
                required
                className="mt-2 block w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-200 shadow-inner"
                placeholder="e.g., Tim Robbins, Morgan Freeman"
              />
            </div>

            <div>
              <label htmlFor="country" className="block text-sm font-semibold text-gray-700">Country</label>
              <input
                type="text"
                id="country"
                name="country"
                value={formData.country}
                onChange={handleChange}
                required
                className="mt-2 block w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-200 shadow-inner"
                placeholder="e.g., USA"
              />
            </div>

            <div>
              <label htmlFor="director" className="block text-sm font-semibold text-gray-700">Director</label>
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
              <label htmlFor="duration" className="block text-sm font-semibold text-gray-700">Duration (minutes)</label>
              <input
                type="number"
                id="duration"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                required
                min="1"
                className="mt-2 block w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-200 shadow-inner"
                placeholder="e.g., 142"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-semibold text-gray-700">Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={4}
                className="mt-2 block w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-200 shadow-inner"
                placeholder="e.g., Two imprisoned men bond over decades..."
              />
            </div>

            <div>
              <label htmlFor="language" className="block text-sm font-semibold text-gray-700">Language</label>
              <input
                type="text"
                id="language"
                name="language"
                value={formData.language}
                onChange={handleChange}
                required
                className="mt-2 block w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-200 shadow-inner"
                placeholder="e.g., English"
              />
            </div>

            <div>
              <label htmlFor="budget" className="block text-sm font-semibold text-gray-700">Budget</label>
              <input
                type="text"
                id="budget"
                name="budget"
                value={formData.budget}
                onChange={handleChange}
                required
                className="mt-2 block w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-200 shadow-inner"
                placeholder="e.g., $25M"
              />
            </div>

            <div>
              <label htmlFor="box_office" className="block text-sm font-semibold text-gray-700">Box Office</label>
              <input
                type="text"
                id="box_office"
                name="box_office"
                value={formData.box_office}
                onChange={handleChange}
                required
                className="mt-2 block w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-200 shadow-inner"
                placeholder="e.g., $58.3M"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700">Poster URLs</label>
              {formData.poster_urls.map((url, index) => (
                <div key={index} className="flex items-center space-x-2 mt-2">
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => handlePosterUrlChange(index, e.target.value)}
                    placeholder="https://example.com/poster.jpg"
                    className="block w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-200 shadow-inner"
                  />
                </div>
              ))}
              <button
                type="button"
                onClick={addPosterUrlField}
                className="mt-3 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200 transform hover:scale-105"
              >
                Add Another URL
              </button>
            </div>

            <button
              type="submit"
              className="w-full mt-6 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300 shadow-lg transform hover:scale-105"
            >
              Add Movie
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;