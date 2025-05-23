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
  rating: string;
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
  meta: {
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
    poster_url: string;
    banner_url: string;
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

// ------------------ Signup (Vishal API with /api/v1/users) ------------------
export const signupUser = async (userData: SignupData): Promise<AuthResponse> => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/users`,
      {
        user: {
          email: userData.email,
          password: userData.password,
          first_name: userData.name.split(' ')[0],
          last_name: userData.name.split(' ').slice(1).join(' ') || '',
          mobile_number: userData.mobile_number,
          role: userData.role ? 'user' : undefined,
        },
      },
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

// ------------------ Login (Vishal API with /api/v1/users/sign_in) ------------------
export const loginUser = async (credentials: LoginData): Promise<AuthResponse> => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/users/sign_in`,
      credentials,
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

// ------------------ Logout (Vishal API with /api/v1/users/sign_out) ------------------
export const logoutUser = async (): Promise<{ message: string; jti: string }> => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No token found. User might not be logged in.');
    }

    const response = await axios.delete(
      `${API_BASE_URL}/users/sign_out`,
      {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data as { message: string; jti: string };
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || 'Failed to log out';
    console.error('Logout error:', error.response?.data || error.message);
    throw new Error(errorMessage);
  }
};

// ------------------ Get Movies ------------------
export async function getMovies(filters?: { page?: number; title?: string; genre?: string }): Promise<MoviesResponse> {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_BASE_URL}/movies`, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        // Authorization: token ? `Bearer ${token}` : undefined,
      },
      params: {
        page: filters?.page,
        title: filters?.title,
        genre: filters?.genre,
      },
    });
    return response.data as MoviesResponse;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || 'Failed to fetch movies';
    console.error('Get movies error:', error.response?.data || error.message);
    throw new Error(errorMessage);
  }
}

// ------------------ Get Movie by ID ------------------
export const getMovieById = async (id: number): Promise<Movie> => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(
      `${API_BASE_URL}/movies/${id}`,
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
      meta: (response.data as MoviesResponse).meta || {
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

    formData.append('title', movieData.title);
    formData.append('genre', movieData.genre);
    formData.append('release_year', movieData.release_year.toString());
    formData.append('director', movieData.director);
    formData.append('duration', movieData.duration.toString());
    formData.append('description', movieData.description);
    formData.append('main_lead', movieData.main_lead);
    formData.append('streaming_platform', movieData.streaming_platform);

    if (movieData.rating !== undefined) {
      formData.append('rating', movieData.rating.toString());
    }
    if (movieData.premium !== undefined) {
      formData.append('premium', movieData.premium.toString());
    }
    if (movieData.poster) {
      formData.append('poster', movieData.poster);
    }
    if (movieData.banner) {
      formData.append('banner', movieData.banner);
    }

    const response = await axios.post(
      `${API_BASE_URL}/movies`,
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

    formData.append('title', movieData.title);
    formData.append('genre', movieData.genre);
    formData.append('release_year', movieData.release_year.toString());
    formData.append('director', movieData.director);
    formData.append('duration', movieData.duration.toString());
    formData.append('description', movieData.description);
    formData.append('main_lead', movieData.main_lead);
    formData.append('streaming_platform', movieData.streaming_platform);

    if (movieData.rating !== undefined) {
      formData.append('rating', movieData.rating.toString());
    }
    if (movieData.premium !== undefined) {
      formData.append('premium', movieData.premium.toString());
    }
    if (movieData.poster) {
      formData.append('poster', movieData.poster);
    }
    if (movieData.banner) {
      formData.append('banner', movieData.banner);
    }

    const response = await axios.patch(
      `${API_BASE_URL}/movies/${id}`,
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
    console.log("AUTH TOKEN FOR API CALL: ", authToken);
    if (!authToken) {
      throw new Error('No user data found. User might not be logged in.');
    }

    console.log('Sending FCM token to backend:', token);
    console.log('Using auth token:', authToken);

    const response = await axios.patch(
      `${API_BASE_URL}/users/update_device_token`,
      { device_token: token },
      {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
      }
    );

    console.log('Device token sent to backend successfully:', response.data);
    return response.data;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || 'Failed to send device token';
    console.error('Error sending device token to backend:', error.response?.data || error.message);
    throw new Error(errorMessage);
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
      `${API_BASE_URL}/movies/${id}`,
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

// ------------------ Update Profile Picture ------------------
export const updateProfilePicture = async (imageFile: File): Promise<{ message: string; profile_picture_url: string }> => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No token found. User might not be logged in.');
    }

    // Validate file type and size
    if (!imageFile.name.toLowerCase().match(/\.(jpg|jpeg|png)$/)) {
      throw new Error('Only PNG or JPEG files are allowed');
    }
    if (imageFile.size > 5 * 1024 * 1024) {
      throw new Error('Image file exceeds 5MB limit');
    }

    const formData = new FormData();
    formData.append('profile_picture', imageFile);

    const response = await axios.patch(
      `${API_BASE_URL}/users/update_profile_picture`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data as { message: string; profile_picture_url: string };
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || 'Failed to update profile picture';
    console.error('Update profile picture error:', error.response?.data || error.message);
    throw new Error(errorMessage);
  }
};

// ------------------ Get Profile Picture ------------------
export const getProfilePicture = async (): Promise<{ profile_picture_url: string }> => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No token found. User might not be logged in.');
    }

    const response = await axios.get(
      `${API_BASE_URL}/users/show_profile_picture`,
      {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data as { profile_picture_url: string };
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || 'Failed to retrieve profile picture';
    console.error('Get profile picture error:', error.response?.data || error.message);
    throw new Error(errorMessage);
  }
};

// ------------------ Cancel Subscription ------------------
export const cancelSubscription = async (): Promise<{ message: string; plan: string; status: string; current_period_end: string }> => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No token found. User might not be logged in.');
    }

    const response = await axios.post(
      `${API_BASE_URL}/subscriptions/cancel`,
      {},
      {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data as { message: string; plan: string; status: string; current_period_end: string };
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || 'Failed to cancel subscription';
    console.error('Cancel subscription error:', error.response?.data || error.message);
    throw new Error(errorMessage);
  }
};
