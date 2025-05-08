import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MovieCard from '../MovieCard';
import { Movie } from '../Api';
import { MemoryRouter } from 'react-router-dom';
import * as router from 'react-router-dom';

// Mock useNavigate
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
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

describe('MovieCard', () => {
  const mockMovie: Movie = {
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
    main_lead: 'Leonardo DiCaprio',
    streaming_platform: 'Netflix',
  };

  const mockOnDeleteMovie = jest.fn();
  const mockNavigate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (router.useNavigate as jest.Mock).mockReturnValue(mockNavigate);
    mockLocalStorage.clear();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('renders movie details correctly', () => {
    render(
      <MemoryRouter>
        <MovieCard movie={mockMovie} />
      </MemoryRouter>
    );

    expect(screen.getByAltText('Inception')).toHaveAttribute('src', mockMovie.poster_url);
    expect(screen.getByText('Inception')).toBeInTheDocument();
    expect(screen.getByText('Sci-Fi')).toBeInTheDocument();
    expect(screen.getByText('Rating: 8.8')).toBeInTheDocument();
  });

  it('does not show edit/delete buttons for user role', () => {
    mockLocalStorage.setItem('role', 'user');
    render(
      <MemoryRouter>
        <MovieCard movie={mockMovie} onDeleteMovie={mockOnDeleteMovie} />
      </MemoryRouter>
    );

    expect(screen.queryByTitle('Edit Movie')).not.toBeInTheDocument();
    expect(screen.queryByTitle('Delete Movie')).not.toBeInTheDocument();
  });

  it('shows edit/delete buttons for supervisor role', () => {
    mockLocalStorage.setItem('role', 'supervisor');
    render(
      <MemoryRouter>
        <MovieCard movie={mockMovie} onDeleteMovie={mockOnDeleteMovie} />
      </MemoryRouter>
    );

    expect(screen.getByTitle('Edit Movie')).toBeInTheDocument();
    expect(screen.getByTitle('Delete Movie')).toBeInTheDocument();
  });

  it('shows buttons on single click and hides after 5 seconds', async () => {
    mockLocalStorage.setItem('role', 'supervisor');
    render(
      <MemoryRouter>
        <MovieCard movie={mockMovie} onDeleteMovie={mockOnDeleteMovie} />
      </MemoryRouter>
    );

    const card = screen.getByAltText('Inception').parentElement!;
    await userEvent.click(card);

    const editButton = screen.getByTitle('Edit Movie');
    const deleteButton = screen.getByTitle('Delete Movie');
    expect(editButton).toHaveClass('opacity-100');
    expect(deleteButton).toHaveClass('opacity-100');

    jest.advanceTimersByTime(5000);
    await waitFor(() => {
      expect(editButton).toHaveClass('opacity-0');
      expect(deleteButton).toHaveClass('opacity-0');
    });
  });

  it('navigates to movie details on double click', async () => {
    render(
      <MemoryRouter>
        <MovieCard movie={mockMovie} />
      </MemoryRouter>
    );

    const card = screen.getByAltText('Inception').parentElement!;
    await userEvent.dblClick(card);

    expect(mockNavigate).toHaveBeenCalledWith(`/movieDetails/${mockMovie.id}`);
  });

  it('navigates to admin page on edit button click', async () => {
    mockLocalStorage.setItem('role', 'supervisor');
    render(
      <MemoryRouter>
        <MovieCard movie={mockMovie} onDeleteMovie={mockOnDeleteMovie} />
      </MemoryRouter>
    );

    const editButton = screen.getByTitle('Edit Movie');
    await userEvent.click(editButton);

    expect(mockNavigate).toHaveBeenCalledWith('/admin', { state: { movie: mockMovie } });
  });

  it('calls onDeleteMovie on delete button click with confirmation', async () => {
    mockLocalStorage.setItem('role', 'supervisor');
    window.confirm = jest.fn().mockReturnValue(true);
    render(
      <MemoryRouter>
        <MovieCard movie={mockMovie} onDeleteMovie={mockOnDeleteMovie} />
      </MemoryRouter>
    );

    const deleteButton = screen.getByTitle('Delete Movie');
    await userEvent.click(deleteButton);

    expect(window.confirm).toHaveBeenCalledWith('Are you sure you want to delete this movie?');
    expect(mockOnDeleteMovie).toHaveBeenCalledWith(mockMovie.id);
  });

  it('does not call onDeleteMovie if confirmation is cancelled', async () => {
    mockLocalStorage.setItem('role', 'supervisor');
    window.confirm = jest.fn().mockReturnValue(false);
    render(
      <MemoryRouter>
        <MovieCard movie={mockMovie} onDeleteMovie={mockOnDeleteMovie} />
      </MemoryRouter>
    );

    const deleteButton = screen.getByTitle('Delete Movie');
    await userEvent.click(deleteButton);

    expect(window.confirm).toHaveBeenCalledWith('Are you sure you want to delete this movie?');
    expect(mockOnDeleteMovie).not.toHaveBeenCalled();
  });

  it('handles missing onDeleteMovie prop gracefully', async () => {
    mockLocalStorage.setItem('role', 'supervisor');
    window.confirm = jest.fn().mockReturnValue(true);
    render(
      <MemoryRouter>
        <MovieCard movie={mockMovie} />
      </MemoryRouter>
    );

    const deleteButton = screen.getByTitle('Delete Movie');
    await userEvent.click(deleteButton);

    expect(window.confirm).toHaveBeenCalled();
    // No errors should be thrown, and no console errors
    expect(mockOnDeleteMovie).not.toHaveBeenCalled();
  });

  it('logs error if onDeleteMovie fails', async () => {
    mockLocalStorage.setItem('role', 'supervisor');
    window.confirm = jest.fn().mockReturnValue(true);
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    mockOnDeleteMovie.mockRejectedValue(new Error('Delete failed'));

    render(
      <MemoryRouter>
        <MovieCard movie={mockMovie} onDeleteMovie={mockOnDeleteMovie} />
      </MemoryRouter>
    );

    const deleteButton = screen.getByTitle('Delete Movie');
    await userEvent.click(deleteButton);

    await waitFor(() => {
      expect(mockOnDeleteMovie).toHaveBeenCalledWith(mockMovie.id);
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error deleting movie:', expect.any(Error));
    });

    consoleErrorSpy.mockRestore();
  });
});