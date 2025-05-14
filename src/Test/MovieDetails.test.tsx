import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import MovieDetail from '../component/MovieDetails';
import { getMovieById } from '../Api';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';

// Mock API
jest.mock('../Api', () => ({
  getMovieById: jest.fn(),
}));

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const mockMovie = {
  id: 1,
  title: 'Inception',
  poster_url: 'https://example.com/poster.jpg',
  genre: 'Sci-Fi',
  rating: 8.8,
  description: 'A mind-bending thriller.',
  release_year: 2010,
  duration: 148,
  director: 'Christopher Nolan',
};

describe('MovieDetail', () => {
  beforeEach(() => {
    localStorage.setItem('token', 'dummy_token');
  });

  afterEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  const renderWithRouter = (ui: React.ReactNode, route: string) => {
    window.history.pushState({}, 'Test page', route);
    return render(
      <MemoryRouter initialEntries={[route]}>
        <Routes>
          <Route path="/movie/:id" element={ui} />
        </Routes>
      </MemoryRouter>
    );
  };

  test('renders loading spinner initially', async () => {
    (getMovieById as jest.Mock).mockResolvedValueOnce(mockMovie);

    renderWithRouter(<MovieDetail />, '/movie/1');

    expect(screen.getByRole('status')).toBeInTheDocument();

    await waitFor(() => expect(getMovieById).toHaveBeenCalledWith(1));
  });

  test('renders movie details on successful fetch', async () => {
    (getMovieById as jest.Mock).mockResolvedValueOnce(mockMovie);

    renderWithRouter(<MovieDetail />, '/movie/1');

    await screen.findByText('Inception');
    expect(screen.getByText('A mind-bending thriller.')).toBeInTheDocument();
    expect(screen.getByText('Release Year:')).toBeInTheDocument();
    expect(screen.getByText('148 min')).toBeInTheDocument();
    expect(screen.getByText('Christopher Nolan')).toBeInTheDocument();
  });

  test('shows error message if fetch fails', async () => {
    (getMovieById as jest.Mock).mockRejectedValueOnce(new Error('Fetch failed'));

    renderWithRouter(<MovieDetail />, '/movie/1');

    const error = await screen.findByText(/Fetch failed/i);
    expect(error).toBeInTheDocument();
  });

  test('calls onClose and navigates when close button clicked', async () => {
    (getMovieById as jest.Mock).mockResolvedValueOnce(mockMovie);
    const onCloseMock = jest.fn();

    renderWithRouter(<MovieDetail onClose={onCloseMock} />, '/movie/1');

    const closeButton = await screen.findByRole('button', { name: '' }); // SVG button
    fireEvent.click(closeButton);

    expect(onCloseMock).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith('/home');
  });

  test('navigates and calls onClose when clicking on backdrop', async () => {
    (getMovieById as jest.Mock).mockResolvedValueOnce(mockMovie);
    const onCloseMock = jest.fn();

    const { container } = renderWithRouter(<MovieDetail onClose={onCloseMock} />, '/movie/1');

    await screen.findByText('Inception');

    const backdrop = container.querySelector('div.fixed') as HTMLElement;
    fireEvent.click(backdrop);

    expect(onCloseMock).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith('/home');
  });

  test('redirects if token is missing', () => {
    localStorage.removeItem('token');
    renderWithRouter(<MovieDetail />, '/movie/1');
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });
});
