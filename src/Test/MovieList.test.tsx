import { render, screen } from '@testing-library/react';
import MovieList from '../component/MovieList';
import { Movie } from '../services/Api';

// Mock the child components
jest.mock('../component/MovieCard', () => {
  return jest.fn(({ movie, onMovieClick, onDeleteMovie }) => (
    <div data-testid={`movie-card-${movie.id}`}>
      {movie.title}
      <button onClick={() => onMovieClick(movie)}>Click</button>
      {onDeleteMovie && <button onClick={() => onDeleteMovie(movie.id)}>Delete</button>}
    </div>
  ));
});

jest.mock('../hooks/useSwiper', () => {
  return jest.fn(({ items, renderItem, sectionName }) => (
    <div data-testid={`swiper-${sectionName}`}>
      {items.map((item: Movie) => (
        <div key={item.id}>{renderItem(item)}</div>
      ))}
    </div>
  ));
});

const mockMovies: Movie[] = [
  {
    id: 1,
    title: 'Movie 1',
    genre: 'Action',
    release_year: 2020,
    rating: "8.0",
    director: 'John Doe',
    duration: 120,
    description: 'An action-packed adventure.',
    premium: false,
    main_lead: 'Jane Smith',
    streaming_platform: 'Netflix',
    poster_url: 'poster1.jpg',
    banner_url: 'banner1.jpg',
  },
  {
    id: 2,
    title: 'Movie 2',
    genre: 'Comedy',
    release_year: 2021,
    rating: "7.0",
    director: 'Alice Brown',
    duration: 100,
    description: 'A hilarious comedy.',
    premium: true,
    main_lead: 'Bob Johnson',
    streaming_platform: 'Hulu',
    poster_url: 'poster2.jpg',
    banner_url: 'banner2.jpg',
  },
  {
    id: 3,
    title: 'Movie 3',
    genre: 'Drama',
    release_year: 2022,
    rating:" 9.0",
    director: 'Emma Wilson',
    duration: 140,
    description: 'A gripping drama.',
    premium: false,
    main_lead: 'Tom Davis',
    streaming_platform: 'Amazon Prime',
    poster_url: 'poster3.jpg',
    banner_url: 'banner3.jpg',
  },
];

const mockOnMovieClick = jest.fn();
const mockOnDeleteMovie = jest.fn();

describe('MovieList', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all sections with movies', () => {
    render(
      <MovieList
        movies={mockMovies}
        onMovieClick={mockOnMovieClick}
        onDeleteMovie={mockOnDeleteMovie}
      />
    );

    // Check section headers
    expect(screen.getByText('All Movies')).toBeInTheDocument();
    expect(screen.getByText('Trending Now')).toBeInTheDocument();
    expect(screen.getByText('All time Favourites')).toBeInTheDocument();

    // Check swipers
    expect(screen.getByTestId('swiper-all')).toBeInTheDocument();
    expect(screen.getByTestId('swiper-trending')).toBeInTheDocument();
    expect(screen.getByTestId('swiper-favorites')).toBeInTheDocument();

    // Check movie cards in each section
    expect(screen.getAllByTestId(/movie-card-/).length).toBe(7); // 3 in all, 3 in trending, 2 in favorites

  });

  it('renders no movies message when movies array is empty', () => {
    render(
      <MovieList
        movies={[]}
        onMovieClick={mockOnMovieClick}
        onDeleteMovie={mockOnDeleteMovie}
      />
    );

    expect(screen.getAllByText('No movies available.')).toHaveLength(1);
    expect(screen.getAllByText('No trending movies available.')).toHaveLength(1);
    expect(screen.getAllByText('No movies with rating 8.8 or higher available.')).toHaveLength(1);
    expect(screen.queryByTestId(/swiper-/)).not.toBeInTheDocument();
  });

  it('filters trending movies correctly', () => {
    render(
      <MovieList
        movies={mockMovies}
        onMovieClick={mockOnMovieClick}
        onDeleteMovie={mockOnDeleteMovie}
      />
    );

    const trendingSwiper = screen.getByTestId('swiper-trending');
    expect(trendingSwiper).toContainElement(screen.getByText('Movie 1'));
    expect(trendingSwiper).toContainElement(screen.getByText('Movie 3'));
    expect(trendingSwiper).not.toContainElement(screen.getByText('Movie 2'));
  });

  it('filters all time favorites correctly', () => {
    render(
      <MovieList
        movies={mockMovies}
        onMovieClick={mockOnMovieClick}
        onDeleteMovie={mockOnDeleteMovie}
      />
    );

    const favoritesSwiper = screen.getByTestId('swiper-favorites');
    expect(favoritesSwiper).toContainElement(screen.getByText('Movie 1'));
    expect(favoritesSwiper).toContainElement(screen.getByText('Movie 3'));
    expect(favoritesSwiper).not.toContainElement(screen.getByText('Movie 2'));
  });

  it('calls onMovieClick when movie card is clicked', () => {
    render(
      <MovieList
        movies={mockMovies}
        onMovieClick={mockOnMovieClick}
        onDeleteMovie={mockOnDeleteMovie}
      />
    );

    const movieButton = screen.getAllByText('Click')[0];
    movieButton.click();
    expect(mockOnMovieClick).toHaveBeenCalledWith(mockMovies[0]);
  });

  it('calls onDeleteMovie when delete button is clicked', () => {
    render(
      <MovieList
        movies={mockMovies}
        onMovieClick={mockOnMovieClick}
        onDeleteMovie={mockOnDeleteMovie}
      />
    );

    const deleteButton = screen.getAllByText('Delete')[0];
    deleteButton.click();
    expect(mockOnDeleteMovie).toHaveBeenCalledWith(mockMovies[0].id);
  });

  it('renders without onDeleteMovie prop', () => {
    render(
      <MovieList
        movies={mockMovies}
        onMovieClick={mockOnMovieClick}
      />
    );

    expect(screen.getByText('All Movies')).toBeInTheDocument();
    expect(screen.queryAllByText('Delete')).toHaveLength(0);
  });
});