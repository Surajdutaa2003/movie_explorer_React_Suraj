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

// interface AuthResponse {
//   user: any;
//   token: string;
// }
interface AuthResponse {
  id: number;
  email: string;
  role: string;
  token: string;
}

interface MovieCreateData {
  title: string;
  genre: string;
  release_year: number;
  director: string;
  duration: number;
  description: string;
  main_lead: string;
  streaming_platform: string;
  rating?: number;
  premium?: boolean;
  poster?: File;
  banner?: File;
}

interface MovieCreateResponse {
  message: string;
  movie: {
    id: number;
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
    created_at: string;
    updated_at: string;
  };
}

interface UserData {
  token?: string;
}

interface ApiErrorResponse {
  message?: string;
}

const API_BASE_URL = 'https://movie-explorer-ror-vishal-kanojia.onrender.com/api/v1';
const AALEKH_API_BASE_URL = 'https://movie-explorer-ror-aalekh-2ewg.onrender.com';

// ------------------ Signup (Aalekh API with /users) ------------------
// export const signupUser = async (userData: SignupData): Promise<AuthResponse> => {
//   try {
//     const response = await axios.post(
//       `${AALEKH_API_BASE_URL}/users`,
//       { user: userData },
//       {
//         headers: {
//           'Content-Type': 'application/json',
//           Accept: 'application/json',
//         },
//       }
//     );
//     return response.data as AuthResponse;
//   } catch (error: any) {
//     const errorMessage = error.response?.data?.errors
//       ? Array.isArray(error.response.data.errors)
//         ? error.response.data.errors.join(', ')
//         : String(error.response.data.errors)
//       : error.response?.data?.message || 'Failed to sign up';
//     console.error('Signup error:', error.response?.data || error.message);
//     throw new Error(errorMessage);
//   }
// };

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
// ------------------ Login (Aalekh API with /users/sign_in) ------------------
// export const loginUser = async (credentials: LoginData): Promise<AuthResponse> => {
//   try {
//     const response = await axios.post(
//       `${AALEKH_API_BASE_URL}/users/sign_in`,
//       { user: credentials },
//       {
//         headers: {
//           'Content-Type': 'application/json',
//           Accept: 'application/json',
//         },
//       }
//     );
//     return response.data as AuthResponse;
//   } catch (error: any) {
//     const errorMessage = error.response?.data?.message || 'Failed to log in';
//     console.error('Login error:', error.response?.data || error.message);
//     throw new Error(errorMessage);
//   }
// };
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
// ------------------ Logout (Aalekh API with /users/sign_out) ------------------
export const logoutUser = async (): Promise<{ message: string }> => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No token found. User might not be logged in.');
    }
    const response = await axios.delete(
      `${AALEKH_API_BASE_URL}/users/sign_out`,
      {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data as { message: string };
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || 'Failed to log out';
    console.error('Logout error:', error.response?.data || error.message);
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

// ------------------ Create Movie ------------------
export const createMovie = async (movieData: MovieCreateData): Promise<MovieCreateResponse> => {
  try {
    const token = localStorage.getItem('token');
    const formData = new FormData();
    
    // Append required fields
    formData.append('movie[title]', movieData.title);
    formData.append('movie[genre]', movieData.genre);
    formData.append('movie[release_year]', movieData.release_year.toString());
    formData.append('movie[director]', movieData.director);
    formData.append('movie[duration]', movieData.duration.toString());
    formData.append('movie[description]', movieData.description);
    formData.append('movie[main_lead]', movieData.main_lead);
    formData.append('movie[streaming_platform]', movieData.streaming_platform);
    
    // Append optional fields if provided
    if (movieData.rating !== undefined) {
      formData.append('movie[rating]', movieData.rating.toString());
    }
    if (movieData.premium !== undefined) {
      formData.append('movie[premium]', movieData.premium.toString());
    }
    if (movieData.poster) {
      formData.append('movie[poster]', movieData.poster);
    }
    if (movieData.banner) {
      formData.append('movie[banner]', movieData.banner);
    }

    const response = await axios.post(
      `${AALEKH_API_BASE_URL}/api/v1/movies`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          Accept: 'application/json',
          Authorization: token ? `Bearer ${token}` : undefined,
        },
      }
    );
    return response.data as MovieCreateResponse;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || 'Failed to create movie';
    console.error('Create movie error:', error.response?.data || error.message);
    throw new Error(errorMessage);
  }
};

// ------------------ Update Movie ------------------
export const updateMovie = async (id: number, movieData: MovieCreateData): Promise<Movie> => {
  try {
    const token = localStorage.getItem('token');
    const formData = new FormData();
    
    // Append required fields
    formData.append('movie[title]', movieData.title);
    formData.append('movie[genre]', movieData.genre);
    formData.append('movie[release_year]', movieData.release_year.toString());
    formData.append('movie[director]', movieData.director);
    formData.append('movie[duration]', movieData.duration.toString());
    formData.append('movie[description]', movieData.description);
    formData.append('movie[main_lead]', movieData.main_lead);
    formData.append('movie[streaming_platform]', movieData.streaming_platform);
    
    // Append optional fields if provided
    if (movieData.rating !== undefined) {
      formData.append('movie[rating]', movieData.rating.toString());
    }
    if (movieData.premium !== undefined) {
      formData.append('movie[premium]', movieData.premium.toString());
    }
    if (movieData.poster) {
      formData.append('movie[poster]', movieData.poster);
    }
    if (movieData.banner) {
      formData.append('movie[banner]', movieData.banner);
    }

    const response = await axios.patch(
      `${AALEKH_API_BASE_URL}/api/v1/movies/${id}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          Accept: 'application/json',
          Authorization: token ? `Bearer ${token}` : undefined,
        },
      }
    );
    return response.data as Movie;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || `Failed to update movie with ID ${id}`;
    console.error(`Update movie error for ID ${id}:`, error.response?.data || error.message);
    throw new Error(errorMessage);
  }
};

// ------------------ Send Device Token ------------------
export const sendTokenToBackend = async (token: string): Promise<any> => {
  try {
    const authToken = localStorage.getItem('token');
    if (!authToken) {
      throw new Error('No user data found. User might not be logged in.');
    }

    console.log('Sending FCM token to backend:', token);
    console.log('Using auth token:', authToken);

    const response = await fetch(`${AALEKH_API_BASE_URL}/api/v1/update_device_token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
      },
      body: JSON.stringify({ device_token: token }),
    });

    if (!response.ok) {
      const errorData: ApiErrorResponse = await response.json().catch(() => ({}));
      throw new Error(`Failed to send device token: ${response.status} ${response.statusText} - ${errorData.message || 'Unknown error'}`);
    }

    const data = await response.json();
    console.log('Device token sent to backend successfully:', data);
    return data;
  } catch (error) {
    console.error('Error sending device token to backend:', error);
    throw error;
  }
};
// ------------------ Delete Movie ------------------
export const deleteMovie = async (id: number): Promise<{ message: string }> => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No token found. User might not be logged in.');
    }

    const response = await axios.delete(
      `${AALEKH_API_BASE_URL}/api/v1/movies/${id}`,
      {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data as { message: string };
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || `Failed to delete movie with ID ${id}`;
    console.error(`Delete movie error for ID ${id}:`, error.response?.data || error.message);
    throw new Error(errorMessage);
  }
};


