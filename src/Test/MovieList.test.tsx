import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MovieList from '../MovieList';
import { Movie } from '../Api';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';

// Mock Swiper components
jest.mock('swiper/react', () => ({
  Swiper: jest.fn(({ children, onSwiper, ...props }) => {
    if (onSwiper) onSwiper({ autoplay: { stop: jest.fn(), start: jest.fn() } });
    return <div data-testid="swiper" {...props}>{children}</div>;
  }),
  SwiperSlide: jest.fn(({ children }) => <div data-testid="swiper-slide">{children}</div>),
}));

// Mock MovieCard component
jest.mock('./MovieCard', () => ({
  MovieCard: jest.fn(({ movie, onMovieClick, onDeleteMovie }) => (
    <div data-testid={`movie-card-${movie.id}`}>
      <h3>{movie.title}</h3>
      <button onClick={() => onMovieClick(movie)}>Click Movie</button>
      {onDeleteMovie && (
        <button onClick={() => onDeleteMovie(movie.id)}>Delete Movie</button>
      )}
    </div>
  )),
}));

// Mock localStorage
const mockLocalStorage = {
  store: {} as Record<string, string>,
  getItem: jest.fn((key: string) => mockLocalStorage.store[key] || null),
  setItem: jest.fn((key: string, value: string) => {
    mockLocalStorage.store[key] = value;
  }),
  removeItem: jest.fn((key: string) => {
    delete mockLocalStorage.store[key];
  }),
  clear: jest.fn(() => {
    mockLocalStorage.store = {};
  }),
};
Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });

describe('MovieList', () => {
  const mockMovies: Movie[] = [
    {
      id: 1,
      title: 'Inception',
      genre: 'Sci-Fi',
      rating: 8.8,
      poster_url: 'https://example.com/inception.jpg',
      description: 'A thief who steals secrets through dreams.',
      banner_url: '',
      release_year: 2010,
      director: 'Christopher Nolan',
      duration: 148,
      premium: false,
    },
    {
      id: 2,
      title: 'The Matrix',
      genre: 'Action',
      rating: 7.5,
      poster_url: 'https://example.com/matrix.jpg',
      description: 'A hacker discovers a simulated reality.',
      banner_url: '',
      release_year: 1999,
      director: 'Lana Wachowski, Lilly Wachowski',
      duration: 136,
      premium: false,
    },
    {
      id: 3,
      title: 'Titanic',
      genre: 'Romance',
      rating: 6.5,
      poster_url: 'https://example.com/titanic.jpg',
      description: 'A love story on a doomed ship.',
      banner_url: '',
      release_year: 1997,
      director: 'James Cameron',
      duration: 195,
      premium: true,
    },
  ];

  const mockOnMovieClick = jest.fn();
  const mockOnDeleteMovie = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockLocalStorage.clear();
  });

  it('renders all sections correctly', () => {
    render(<MovieList movies={mockMovies} onMovieClick={mockOnMovieClick} />);

    expect(screen.getByText('All Movies')).toBeInTheDocument();
    expect(screen.getByText('Trending Now')).toBeInTheDocument();
    expect(screen.getByText('All time Favourites')).toBeInTheDocument();
    expect(screen.getByText('Top Actors')).toBeInTheDocument();
  });

  it('renders all movies in All Movies section', () => {
    render(<MovieList movies={mockMovies} onMovieClick={mockOnMovieClick} />);

    expect(screen.getByTestId('movie-card-1')).toHaveTextContent('Inception');
    expect(screen.getByTestId('movie-card-2')).toHaveTextContent('The Matrix');
    expect(screen.getByTestId('movie-card-3')).toHaveTextContent('Titanic');
  });

  it('filters trending movies with rating > 7', () => {
    render(<MovieList movies={mockMovies} onMovieClick={mockOnMovieClick} />);

    const trendingSection = screen.getByText('Trending Now').closest('section')!;
    expect(trendingSection).toContainElement(screen.getByTestId('movie-card-1')); // Inception (8.8)
    expect(trendingSection).toContainElement(screen.getByTestId('movie-card-2')); // Matrix (7.5)
    expect(trendingSection).not.toContainElement(screen.getByTestId('movie-card-3')); // Titanic (6.5)
  });

  it('filters all time favorites with rating >= 8.5', () => {
    render(<MovieList movies={mockMovies} onMovieClick={mockOnMovieClick} />);

    const favoritesSection = screen.getByText('All time Favourites').closest('section')!;
    expect(favoritesSection).toContainElement(screen.getByTestId('movie-card-1')); // Inception (8.8)
    expect(favoritesSection).not.toContainElement(screen.getByTestId('movie-card-2')); // Matrix (7.5)
    expect(favoritesSection).not.toContainElement(screen.getByTestId('movie-card-3')); // Titanic (6.5)
  });

  it('renders top actors correctly', () => {
    render(<MovieList movies={mockMovies} onMovieClick={mockOnMovieClick} />);

    expect(screen.getByText('Leonardo DiCaprio')).toBeInTheDocument();
    expect(screen.getByText('Emma Watson')).toBeInTheDocument();
    expect(screen.getByText('Tom Holland')).toBeInTheDocument();
    expect(screen.getByText('Robert Downey Jr.')).toBeInTheDocument();
    expect(screen.getByText('Scarlett Johansson')).toBeInTheDocument();
    expect(screen.getByText('Tom Hardy')).toBeInTheDocument();
    expect(screen.getByText('Zendaya')).toBeInTheDocument();
    expect(screen.getByText('Robert Pattinson')).toBeInTheDocument();
  });

  it('displays no movies message when movies array is empty', () => {
    render(<MovieList movies={[]} onMovieClick={mockOnMovieClick} />);

    expect(screen.getByText('No movies available.')).toBeInTheDocument();
    expect(screen.getByText('No trending movies available.')).toBeInTheDocument();
    expect(screen.getByText('No movies with rating 8.8 or higher available.')).toBeInTheDocument();
    expect(screen.getByText('Top Actors')).toBeInTheDocument(); // Actors still render
  });

  it('initializes Swiper instances for each section', () => {
    render(<MovieList movies={mockMovies} onMovieClick={mockOnMovieClick} />);

    expect(Swiper).toHaveBeenCalledTimes(4); // One for each section
    expect(screen.getAllByTestId('swiper')).toHaveLength(4);
    expect(screen.getAllByTestId('swiper-slide')).toHaveLength(
      mockMovies.length + // All Movies
      2 + // Trending (Inception, Matrix)
      1 + // Favorites (Inception)
      9 // Actors
    );
  });

  it('renders navigation buttons for each section', () => {
    render(<MovieList movies={mockMovies} onMovieClick={mockOnMovieClick} />);

    expect(screen.getByTestId('swiper').parentElement).toContainElement(
      screen.getByText('←', { selector: '.custom-prev-all' })
    );
    expect(screen.getByTestId('swiper').parentElement).toContainElement(
      screen.getByText('→', { selector: '.custom-next-all' })
    );
    expect(screen.getByText('←', { selector: '.custom-prev-trending' })).toBeInTheDocument();
    expect(screen.getByText('→', { selector: '.custom-next-trending' })).toBeInTheDocument();
    expect(screen.getByText('←', { selector: '.custom-prev-top' })).toBeInTheDocument();
    expect(screen.getByText('→', { selector: '.custom-next-top' })).toBeInTheDocument();
    expect(screen.getByText('←', { selector: '.custom-prev-actors' })).toBeInTheDocument();
    expect(screen.getByText('→', { selector: '.custom-next-actors' })).toBeInTheDocument();
  });

  it('stops and starts autoplay on mouse enter/leave', async () => {
    render(<MovieList movies={mockMovies} onMovieClick={mockOnMovieClick} />);

    const allMoviesSection = screen.getByText('All Movies').closest('section')!;
    const swiperDiv = allMoviesSection.querySelector('[data-testid="swiper"]')!;

    fireEvent.mouseEnter(swiperDiv);
    expect(Swiper.mock.calls[0][0].onSwiper().autoplay.stop).toHaveBeenCalled();

    fireEvent.mouseLeave(swiperDiv);
    expect(Swiper.mock.calls[0][0].onSwiper().autoplay.start).toHaveBeenCalled();
  });

  it('calls onMovieClick when movie is clicked', async () => {
    render(<MovieList movies={mockMovies} onMovieClick={mockOnMovieClick} />);

    const movieCard = screen.getByTestId('movie-card-1');
    const clickButton = movieCard.querySelector('button')!;
    await userEvent.click(clickButton);

    expect(mockOnMovieClick).toHaveBeenCalledWith(mockMovies[0]);
  });

  it('calls onDeleteMovie when delete is triggered', async () => {
    mockLocalStorage.setItem('role', 'supervisor');
    render(
      <MovieList
        movies={mockMovies}
        onMovieClick={mockOnMovieClick}
        onDeleteMovie={mockOnDeleteMovie}
      />
    );

    const movieCard = screen.getByTestId('movie-card-1');
    const deleteButton = movieCard.querySelector('button:last-child')!;
    await userEvent.click(deleteButton);

    expect(mockOnDeleteMovie).toHaveBeenCalledWith(mockMovies[0].id);
  });

  it('handles missing onDeleteMovie prop gracefully', () => {
    mockLocalStorage.setItem('role', 'supervisor');
    render(<MovieList movies={mockMovies} onMovieClick={mockOnMovieClick} />);

    const movieCard = screen.getByTestId('movie-card-1');
    expect(movieCard).not.toContainElement(screen.queryByText('Delete Movie'));
  });

  it('applies responsive breakpoints correctly', () => {
    render(<MovieList movies={mockMovies} onMovieClick={mockOnMovieClick} />);

    const allMoviesSwiper = Swiper.mock.calls[0][0];
    expect(allMoviesSwiper.breakpoints).toEqual({
      640: { slidesPerView: 3 },
      1024: { slidesPerView: 4 },
    });
    expect(allMoviesSwiper.slidesPerView).toBe(2);
  });

  it('disables loop for All time Favourites with fewer than 2 movies', () => {
    const singleMovie = [mockMovies[0]]; // Only Inception (8.8)
    render(<MovieList movies={singleMovie} onMovieClick={mockOnMovieClick} />);

    const favoritesSwiper = Swiper.mock.calls[2][0];
    expect(favoritesSwiper.loop).toBe(false);
  });

  it('renders duplicate actors correctly', () => {
    render(<MovieList movies={mockMovies} onMovieClick={mockOnMovieClick} />);

    const actorElements = screen.getAllByText('Leonardo DiCaprio');
    expect(actorElements).toHaveLength(2);
    expect(actorElements[0].closest('[data-testid="swiper-slide"]')).toBeInTheDocument();
    expect(actorElements[1].closest('[data-testid="swiper-slide"]')).toBeInTheDocument();
  });
});