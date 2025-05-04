import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import MovieDetail from '../MovieDetails';
import * as Api from '../Api';

jest.mock('../Api');

describe('MovieDetail Component', () => {
  const mockOnClose = jest.fn();

  const mockMovie = {
    id: 1,
    title: 'Test Movie',
    genre: 'Action',
    release_year: 2022,
    rating: 8.5,
    actors: JSON.stringify(['Actor 1', 'Actor 2']),
    country: 'USA',
    director: 'Director Name',
    duration: 120,
    description: 'Test movie description',
    language: 'English',
    budget: '100000000',
    box_office: '300000000',
    poster_urls: ['https://example.com/poster.jpg'],
    created_at: '2023-01-01',
    updated_at: '2023-01-02',
    user_id: 1,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders loading state initially', () => {
    (Api.getMovieById as jest.Mock).mockReturnValue(new Promise(() => {})); // never resolves
    render(<MovieDetail movieId={1} onClose={mockOnClose} />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  test('renders movie details after loading', async () => {
    (Api.getMovieById as jest.Mock).mockResolvedValue(mockMovie);
    render(<MovieDetail movieId={1} onClose={mockOnClose} />);
    await waitFor(() => expect(screen.getByText(mockMovie.title)).toBeInTheDocument());
    expect(screen.getByText(mockMovie.description)).toBeInTheDocument();
    expect(screen.getByText(`Release Year:`)).toBeInTheDocument();
    expect(screen.getByText(mockMovie.release_year.toString())).toBeInTheDocument();
    expect(screen.getByText(`Duration:`)).toBeInTheDocument();
    expect(screen.getByText(`${mockMovie.duration} min`)).toBeInTheDocument();
    expect(screen.getByText(`Director:`)).toBeInTheDocument();
    expect(screen.getByText(mockMovie.director)).toBeInTheDocument();
    expect(screen.getByText(`Country:`)).toBeInTheDocument();
    expect(screen.getByText(mockMovie.country)).toBeInTheDocument();
    expect(screen.getByText(`Language:`)).toBeInTheDocument();
    expect(screen.getByText(mockMovie.language)).toBeInTheDocument();
    expect(screen.getByText(`Budget:`)).toBeInTheDocument();
    expect(screen.getByText(`$100.0M`)).toBeInTheDocument();
    expect(screen.getByText(`Box Office:`)).toBeInTheDocument();
    expect(screen.getByText(`$300.0M`)).toBeInTheDocument();
    expect(screen.getByText('Cast')).toBeInTheDocument();
    expect(screen.getByText('Actor 1')).toBeInTheDocument();
    expect(screen.getByText('Actor 2')).toBeInTheDocument();
  });

  test('renders error message on fetch failure', async () => {
    (Api.getMovieById as jest.Mock).mockRejectedValue(new Error('Failed to fetch'));
    render(<MovieDetail movieId={1} onClose={mockOnClose} />);
    await waitFor(() => expect(screen.getByText(/Failed to load movie details/i)).toBeInTheDocument());
  });

  test('calls onClose when backdrop is clicked', () => {
    (Api.getMovieById as jest.Mock).mockResolvedValue(mockMovie);
    const { container } = render(<MovieDetail movieId={1} onClose={mockOnClose} />);
    const backdrop = container.firstChild;
    if (backdrop) {
      fireEvent.click(backdrop);
      expect(mockOnClose).toHaveBeenCalled();
    }
  });

  test('does not call onClose when content is clicked', () => {
    (Api.getMovieById as jest.Mock).mockResolvedValue(mockMovie);
    const { container } = render(<MovieDetail movieId={1} onClose={mockOnClose} />);
    const content = container.querySelector('div > div > div > div:nth-child(2)');
    if (content) {
      fireEvent.click(content);
      expect(mockOnClose).not.toHaveBeenCalled();
    }
  });
});
