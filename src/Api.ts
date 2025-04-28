import axios from 'axios';

interface SignupData {
  full_name: string;
  email: string;
  mobile_number: string;
  password: string;
  role: number;
}

interface LoginData {
  email: string;
  password: string;
}

interface Movie {
  id: number;
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
  created_at: string;
  updated_at: string;
  user_id: number;
}

interface MoviesResponse {
  data: Movie[];
  meta: {
    current_page: number;
    total_pages: number;
    total_count: number;
  };
}

interface AuthResponse {
  user: any;
  token: string;
}

export const signup = async (userData: SignupData): Promise<AuthResponse> => {
  try {
    const response = await axios.post(
      'https://movie-explorer-ror-vishal-kanojia.onrender.com/api/v1/signup',
      userData,
      {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      }
    );
    return response.data as AuthResponse;
  } catch (error) {
    throw error;
  }
};

export const login = async (credentials: LoginData): Promise<AuthResponse> => {
  try {
    const response = await axios.post(
      'https://movie-explorer-ror-vishal-kanojia.onrender.com/api/v1/login',
      credentials,
      {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      }
    );
    return response.data as AuthResponse;
  } catch (error) {
    console.error('Login error: ', error);
    throw error;
  }
};

export const getMovies = async (page: number = 1): Promise<MoviesResponse> => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(
      'https://movie-explorer-ror-vishal-kanojia.onrender.com/api/v1/movies',
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
  } catch (error) {
    console.error('Get movies error: ', error);
    throw error;
  }
};  