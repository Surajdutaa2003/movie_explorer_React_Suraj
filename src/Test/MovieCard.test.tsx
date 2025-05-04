import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import MovieCard from '../MovieCard';

describe('MovieCard Component', () => {
  const mockOnMovieClick = jest.fn();

  const defaultProps = {
    id: 1,
    title: 'Test Movie',
    poster: 'https://example.com/poster.jpg',
    genre: 'Drama',
    rating: 8.5,
    year: 2023,
    onMovieClick: mockOnMovieClick,
  };

  beforeEach(() => {
    mockOnMovieClick.mockClear();
  });

  test('renders movie details correctly', () => {
    render(<MovieCard {...defaultProps} />);
    expect(screen.getByAltText('Test Movie')).toBeInTheDocument();
    expect(screen.getByText('Test Movie')).toBeInTheDocument();
    expect(screen.getByText('Drama')).toBeInTheDocument();
    expect(screen.getByText('Rating: 8.5')).toBeInTheDocument();
  });

  test('calls onMovieClick with correct id when clicked', () => {
    render(<MovieCard {...defaultProps} />);
    const card = screen.getByAltText('Test Movie').parentElement;
    if (card) {
      fireEvent.click(card);
    }
    expect(mockOnMovieClick).toHaveBeenCalledTimes(1);
    expect(mockOnMovieClick).toHaveBeenCalledWith(1);
  });
});
