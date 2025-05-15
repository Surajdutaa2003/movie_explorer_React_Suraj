import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import MovieList from '../component/MovieList';
import { Movie } from '../Api'; // Import Movie interface from Api file

// Mock Swiper and its components
jest.mock('swiper/react', () => ({
  Swiper: ({ children }: any) => <div>{children}</div>,
  SwiperSlide: ({ children }: any) => <div>{children}</div>,
}));

const mockMovies: Movie[] = [
  {
    id: 1,
    title: 'Inception',
    poster_url: 'https://example.com/inception.jpg',
    genre: 'Sci-Fi',
    rating: 8.8,
    release_year: 2010,
    director: 'Christopher Nolan',
    duration: 148,
    description: 'A thief who steals corporate secrets through dream-sharing technology.',
    premium: false,
    main_lead: 'Leonardo DiCaprio',
    streaming_platform: 'Netflix',
    banner_url: 'https://example.com/inception-banner.jpg'
  },
  {
    id: 2,
    title: 'Interstellar',
    poster_url: 'https://example.com/interstellar.jpg',
    genre: 'Adventure',
    rating: 8.6,
    release_year: 2014,
    director: 'Christopher Nolan',
    duration: 169,
    description: 'A team of explorers travel through a wormhole in space.',
    premium: false,
    main_lead: 'Matthew McConaughey',
    streaming_platform: 'Amazon Prime',
    banner_url: 'https://example.com/interstellar-banner.jpg'
  },
];

describe('MovieList Component', () => {
  const onMovieClick = jest.fn();
  const onDeleteMovie = jest.fn();

  beforeEach(() => {
    render(
      <MovieList
        movies={mockMovies}
        onMovieClick={onMovieClick}
        onDeleteMovie={onDeleteMovie}
      />
    );
  });

  it('renders All Movies section', () => {
    expect(screen.getByText('All Movies')).toBeInTheDocument();
    expect(screen.getByText('Inception')).toBeInTheDocument();
    expect(screen.getByText('Interstellar')).toBeInTheDocument();
  });

  it('renders Watchlist section correctly', () => {
    expect(screen.getByText('Watchlist')).toBeInTheDocument();
    expect(screen.getByText('Interstellar')).toBeInTheDocument();
    expect(screen.queryByText('Inception')).not.toHaveTextContent('Watchlist');
  });

  it('renders Favourites section correctly', () => {
    expect(screen.getByText('Favourites')).toBeInTheDocument();
    expect(screen.getByText('Inception')).toBeInTheDocument();
    expect(screen.queryByText('Interstellar')).not.toHaveTextContent('Favourites');
  });

  it('calls onMovieClick when movie image is clicked', () => {
    const image = screen.getByAltText('Inception');
    fireEvent.click(image);
    expect(onMovieClick).toHaveBeenCalledWith(mockMovies[0]);
  });

  it('calls onDeleteMovie when delete icon is clicked', () => {
    const deleteButtons = screen.getAllByLabelText('Delete');
    fireEvent.click(deleteButtons[0]);
    expect(onDeleteMovie).toHaveBeenCalledWith(mockMovies[0].id);
  });
});
