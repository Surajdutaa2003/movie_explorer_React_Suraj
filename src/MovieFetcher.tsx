import React, { useEffect } from 'react';
import axios from 'axios';

// Define the Movie interface based on the API response structure
interface Movie {
  id: number;
  title: string;
  genre: string;
  release_year: number;
  rating: string;
  director: string;
  duration: number;
  main_lead: string;
  streaming_platform: string;
  description: string;
  premium: boolean;
  poster_url: string;
  banner_url: string | null;
  created_at: string;
  updated_at: string;
}

// Define the API response structure
interface MovieResponse {
  movies: Movie[];
  meta: {
    current_page: number;
    total_pages: number;
    total_count: number;
  };
}

const MovieFetcher: React.FC = () => {
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axios.get<MovieResponse>(
          'https://movie-explorer-ror-vishal-kanojia.onrender.com/api/v1/movies',
          {
            headers: {
              Accept: 'application/json',
              Authorization:
                `Bearer eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoyLCJyb2xlIjoic3VwZXJ2aXNvciIsImp0aSI6IjAwNmFiMDQ5LTUxODAtNGY5YS1hYTA1LWM5MjdiNzJkZDAwNyIsImV4cCI6MTc0NzIxMTc3MX0.i-osRsW64txh4vpFQhhaI9YVd5AE_SD8X2H-pqE0QII`,
            },
          }
        );
      //         const response = await fetch(
      //   'https://movie-explorer-ror-vishal-kanojia.onrender.com/api/v1/movies',
      //   {
      //     method: 'GET',
      //     headers: {
      //       'accept': 'application/json',
      //     }
      //   }
      // );
        console.log('API Response:', response);
      } catch (error: any) {
        console.error('API Error:', error.response?.data || error.message);
      }
    };

    fetchMovies();
  }, []); // Empty dependency array to run once on mount

  return (
    <div>
      <h1>Movie Fetcher</h1>
      <p>Check the console for the API response.</p>
    </div>
  );
};

export default MovieFetcher;