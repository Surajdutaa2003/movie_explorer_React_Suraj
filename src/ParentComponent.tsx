// // ParentComponent.tsx
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import MovieList from './MovieList';
// import { Movie } from './Api';

// const ParentComponent: React.FC = () => {
//   const [movies, setMovies] = useState<Movie[]>([]); // Initialize as empty array
//   const [top10Movies, setTop10Movies] = useState<Movie[]>([]); // Initialize as empty array
//   const [page, setPage] = useState(1);
//   const [titleFilter, setTitleFilter] = useState<string>('');
//   const [genreFilter, setGenreFilter] = useState<string>('');
//   const [isLoadingMovies, setIsLoadingMovies] = useState(false);
//   const [isLoadingTop10, setIsLoadingTop10] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const perPage = 10;

//   // Fetch top 10 movies (unfiltered) on mount
//   useEffect(() => {
//     const fetchTop10Movies = async () => {
//       setIsLoadingTop10(true);
//       setError(null);
//       try {
//         let allMovies: Movie[] = [];
//         let currentPage = 1;
//         let totalPages = 1;

//         while (currentPage <= totalPages) {
//           const response = await axios.get<{ movies: Movie[]; pagination: { total_pages: number } }>('https://movie-explorer-ror-aalekh-2ewg.onrender.com/api/v1/movies', {
//             params: { page: currentPage, per_page: 20 },
//             headers: { accept: 'application/json' },
//           });
//           allMovies = [...allMovies, ...response.data.movies];
//           totalPages = response.data.pagination.total_pages;
//           currentPage++;
//         }

//         const top10 = allMovies
//           .sort((a, b) => b.rating - a.rating)
//           .slice(0, 10);
//         setTop10Movies(top10);
//       } catch (error) {
//         console.error('Error fetching top 10 movies:', error);
//         setError('Failed to load top 10 movies.');
//       } finally {
//         setIsLoadingTop10(false);
//       }
//     };
//     fetchTop10Movies();
//   }, []);

//   // Fetch paginated movies with filters
//   useEffect(() => {
//     const fetchMovies = async () => {
//       setIsLoadingMovies(true);
//       setError(null);
//       try {
//         const response = await axios.get<{ movies: Movie[] }>('https://movie-explorer-ror-aalekh-2ewg.onrender.com/api/v1/movies', {
//           params: {
//             page,
//             per_page: perPage,
//             title: titleFilter || undefined,
//             genre: genreFilter || undefined,
//           },
//           headers: { accept: 'application/json' },
//         });
//         setMovies(response.data.movies || []); // Ensure array even if API returns null
//       } catch (error) {
//         console.error('Error fetching movies:', error);
//         setError('Failed to load movies.');
//         setMovies([]); // Reset to empty array on error
//       } finally {
//         setIsLoadingMovies(false);
//       }
//     };
//     fetchMovies();
//   }, [page, titleFilter, genreFilter]);

//   return (
//     <div className="p-4">
//       {/* Filter Inputs */}
//       <div className="mb-4 flex space-x-4">
//         <input
//           type="text"
//           placeholder="Filter by title"
//           value={titleFilter}
//           onChange={(e) => setTitleFilter(e.target.value)}
//           className="px-3 py-2 border rounded"
//         />
//         <input
//           type="text"
//           placeholder="Filter by genre"
//           value={genreFilter}
//           onChange={(e) => setGenreFilter(e.target.value)}
//           className="px-3 py-2 border rounded"
//         />
//       </div>

//       {/* Error Message */}
//       {error && <p className="text-red-500 mb-4">{error}</p>}

//       {/* Movie List */}
//       <MovieList
//         movies={movies}
//         top10Movies={top10Movies}
//         isLoadingMovies={isLoadingMovies}
//         isLoadingTop10={isLoadingTop10}
//       />

//       {/* Pagination Controls */}
//       <div className="flex justify-center space-x-4 mt-4">
//         <button
//           onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
//           disabled={page === 1 || isLoadingMovies}
//           className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
//         >
//           Previous
//         </button>
//         <span>Page {page}</span>
//         <button
//           onClick={() => setPage((prev) => prev + 1)}
//           disabled={isLoadingMovies}
//           className="px-4 py-2 bg-gray-200 rounded"
//         >
//           Next
//         </button>
//       </div>
//     </div>
//   );
// };

// export default ParentComponent;