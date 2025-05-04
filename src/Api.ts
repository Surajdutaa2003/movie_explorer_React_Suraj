import axios from 'axios';

interface SignupData {
  name: string;
  email: string;
  mobile_number: string;
  password: string;
  role?: number;
}

interface LoginData {
  email: string;
  password: string;
}

export interface Movie {
  id: number;
  title: string;
  genre: string;
  release_year: number;
  rating: number;
  director: string;
  duration: number;
  description: string;
  premium: boolean;
  main_lead: string;
  streaming_platform: string;
  poster_url: string;
  banner_url: string;
}

interface MoviesResponse {
  movies: Movie[];
  pagination: {
    current_page: number;
    total_pages: number;
    total_count: number;
    per_page: number;
  };
}

interface AuthResponse {
  user: any;
  token: string;
}

const API_BASE_URL = 'https://movie-explorer-ror-vishal-kanojia.onrender.com/api/v1';
const AALEKH_API_BASE_URL = 'https://movie-explorer-ror-aalekh-2ewg.onrender.com';

// ------------------ Signup (Aalekh API with /users) ------------------
export const signupUser = async (userData: SignupData): Promise<AuthResponse> => {
  try {
    const response = await axios.post(
      `${AALEKH_API_BASE_URL}/users`,
      { user: userData },
      {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      }
    );
    return response.data as AuthResponse;
  } catch (error: any) {
    const errorMessage = error.response?.data?.errors
      ? Array.isArray(error.response.data.errors)
        ? error.response.data.errors.join(', ')
        : String(error.response.data.errors)
      : error.response?.data?.message || 'Failed to sign up';
    console.error('Signup error:', error.response?.data || error.message);
    throw new Error(errorMessage);
  }
};

// ------------------ Login (Vishal API) ------------------
// export const login = async (credentials: LoginData): Promise<AuthResponse> => {
//   try {
//     const response = await axios.get(
//       `${API_BASE_URL}/login`,
//       credentials,
//       {
//         headers: {
//           'Content-Type': 'application/json',
//           Accept: 'application/json',
//         },
//       }
//     );
//     return response.data as AuthResponse;
//   } catch (error) {
//     console.error('Login error:', error);
//     throw error;
//   }
// };

// ------------------ Login (Aalekh API with /users/sign_in) ------------------
export const loginUser = async (credentials: LoginData): Promise<AuthResponse> => {
  try {
    const response = await axios.post(
      `${AALEKH_API_BASE_URL}/users/sign_in`,
      { user: credentials },
      {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      }
    );
    return response.data as AuthResponse;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || 'Failed to log in';
    console.error('Login error:', error.response?.data || error.message);
    throw new Error(errorMessage);
  }
};

// ------------------ Get Movies ------------------
export const getMovies = async (page: number = 1): Promise<MoviesResponse> => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(
      `${AALEKH_API_BASE_URL}/api/v1/movies`,
      {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: token ? `Bearer ${token}` : undefined,
        },
        params: { page },
      }
    );
    return response.data as MoviesResponse;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || 'Failed to fetch movies';
    console.error('Get movies error:', error.response?.data || error.message);
    throw new Error(errorMessage);
  }
};

// ------------------ Get Movie by ID ------------------
export const getMovieById = async (id: number): Promise<Movie> => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(
      `${AALEKH_API_BASE_URL}/api/v1/movies/${id}`,
      {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: token ? `Bearer ${token}` : undefined,
        },
      }
    );
    return response.data as Movie;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || `Failed to fetch movie with ID ${id}`;
    console.error(`Error fetching movie with ID ${id}:`, error.response?.data || error.message);
    throw new Error(errorMessage);
  }
};

// ------------------ Search Movies ------------------
export const searchMovieAPI = async (page: number = 1, title: string, genre?: string): Promise<MoviesResponse> => {
  const params: Record<string, any> = {
    title,
    page,
  };

  if (genre && genre !== 'all') {
    params.genre = genre;
  }

  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(
      `${AALEKH_API_BASE_URL}/api/v1/movies`,
      {
        params,
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: token ? `Bearer ${token}` : undefined,
        },
      }
    );

    const movieData: MoviesResponse = {
      movies: (response.data as MoviesResponse).movies || [],
      pagination: (response.data as MoviesResponse).pagination || {
        current_page: page,
        total_pages: 1,
        total_count: (response.data as MoviesResponse).movies?.length || 0,
        per_page: 10,
      },
    };

    return movieData;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || 'Failed to search movies';
    console.error(`Error searching movies with title "${title}" and genre "${genre}":`, error.response?.data || error.message);
    throw new Error(errorMessage);
  }
};