import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import MovieCard from '../component/MovieCard';
import { Movie } from '../Api';

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Sample movie data
const mockMovie: Movie = {
  id: 1,
  title: 'Test Movie',
  genre: 'Action',
  rating: 8.5,
  poster_url: 'http://example.com/poster.jpg',
  release_year: 2023,
  director: 'John Doe',
  duration: 120,
  description: 'A thrilling action movie.',
  premium: false,
  main_lead: 'Jane Smith',
  streaming_platform: 'Netflix',
  banner_url: 'http://example.com/banner.jpg',
};

// Mock onDeleteMovie function
const mockOnDeleteMovie = jest.fn();

// Setup for localStorage mock
const localStorageMock = (() => {
  let store: { [key: string]: string } = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    clear: () => {
      store = {};
    },
  };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('MovieCard Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  test('renders movie details correctly', () => {
    render(
      <MemoryRouter>
        <MovieCard movie={mockMovie} />
      </MemoryRouter>
    );

    expect(screen.getByText('Test Movie')).toBeInTheDocument();
    expect(screen.getByText('Action')).toBeInTheDocument();
    expect(screen.getByText('Rating: 8.5')).toBeInTheDocument();
    expect(screen.getByAltText('Test Movie')).toHaveAttribute('src', mockMovie.poster_url);
  });

  test('shows edit and delete buttons for supervisor role on single click', async () => {
    localStorage.setItem('role', 'supervisor');

    render(
      <MemoryRouter>
        <MovieCard movie={mockMovie} onDeleteMovie={mockOnDeleteMovie} />
      </MemoryRouter>
    );

    // Trigger the click
    fireEvent.click(screen.getByRole('img', { name: /Test Movie/i }));

    // Wait for and verify the buttons are visible by checking their existence
    await waitFor(() => {
      const editButton = screen.getByTitle('Edit Movie');
      const deleteButton = screen.getByTitle('Delete Movie');
      
      expect(editButton).toBeInTheDocument();
      expect(deleteButton).toBeInTheDocument();
      
      // Check if buttons have the hover state classes
      expect(editButton.className).toContain('md:group-hover:opacity-100');
      expect(deleteButton.className).toContain('md:group-hover:opacity-100');
    });
  });

  test('does not show edit and delete buttons for non-supervisor roles', async () => {
    localStorage.setItem('role', 'user');

    render(
      <MemoryRouter>
        <MovieCard movie={mockMovie} />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole('img', { name: /Test Movie/i }));

    // Wait for and verify the buttons are NOT visible
    await waitFor(() => {
      const editButton = screen.queryByTitle('Edit Movie');
      const deleteButton = screen.queryByTitle('Delete Movie');
      
      expect(editButton).toBeNull();
      expect(deleteButton).toBeNull();
    });
  });
});
