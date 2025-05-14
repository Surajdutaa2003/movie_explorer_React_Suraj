import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useLocation, useNavigate } from 'react-router-dom';
import AdminPanel from '../component/AdminPanel';
import { createMovie, updateMovie } from '../Api';

// Mock dependencies
jest.mock('react-router-dom', () => ({
  useLocation: jest.fn(),
  useNavigate: jest.fn(),
}));

jest.mock('../Api', () => ({
  createMovie: jest.fn(),
  updateMovie: jest.fn(),
}));

// Mock data
const mockMovie = {
  id: 1,
  title: 'Test Movie',
  genre: 'Drama',
  release_year: 2020,
  rating: 8.5,
  director: 'John Doe',
  duration: 120,
  description: 'A test movie description',
  main_lead: 'Jane Doe',
  streaming_platform: 'Netflix',
  premium: true,
};

const mockInitialFormData = {
  title: '',
  genre: '',
  release_year: new Date().getFullYear(),
  rating: undefined,
  director: '',
  duration: 0,
  description: '',
  main_lead: '',
  streaming_platform: '',
  premium: false,
  poster: undefined,
  banner: undefined,
};

describe('AdminPanel Component', () => {
  const mockNavigate = jest.fn();
  const mockLocation = { state: {} };

  beforeEach(() => {
    jest.clearAllMocks();
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
    (useLocation as jest.Mock).mockReturnValue(mockLocation);
  });

  test('renders Add Movie form when no movie is provided', () => {
    render(<AdminPanel />);
    expect(screen.getByText('Admin Panel - Add Movie')).toBeInTheDocument();
    expect(screen.getByText('Create a new movie entry with ease.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Add Movie/i })).toBeInTheDocument();
  });

  test('renders Edit Movie form when movie is provided', () => {
    (useLocation as jest.Mock).mockReturnValue({ state: { movie: mockMovie } });
    render(<AdminPanel />);
    expect(screen.getByText('Admin Panel - Edit Movie')).toBeInTheDocument();
    expect(screen.getByText('Update the movie details below.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Update Movie/i })).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test Movie')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Drama')).toBeInTheDocument();
  });

  test('updates form input values correctly', () => {
    render(<AdminPanel />);
    const titleInput = screen.getByLabelText('Movie Title *');
    fireEvent.change(titleInput, { target: { value: 'New Movie' } });
    expect(titleInput).toHaveValue('New Movie');

    const premiumCheckbox = screen.getByLabelText('Premium Content');
    fireEvent.click(premiumCheckbox);
    expect(premiumCheckbox).toBeChecked();
  });

  test('displays error when required fields are missing', async () => {
    render(<AdminPanel />);
    const submitButton = screen.getByRole('button', { name: /Add Movie/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Please fill in the title field.')).toBeInTheDocument();
    });
  });

  test('displays error for invalid streaming platform', async () => {
    render(<AdminPanel />);
    const formInputs = {
      title: screen.getByLabelText('Movie Title *'),
      genre: screen.getByLabelText('Genre *'),
      release_year: screen.getByLabelText('Release Year *'),
      director: screen.getByLabelText('Director *'),
      duration: screen.getByLabelText('Duration (minutes) *'),
      description: screen.getByLabelText('Description (max 1000 characters) *'),
      main_lead: screen.getByLabelText('Main Lead *'),
      streaming_platform: screen.getByLabelText('Streaming Platform *'),
    };

    fireEvent.change(formInputs.title, { target: { value: 'Test Movie' } });
    fireEvent.change(formInputs.genre, { target: { value: 'Drama' } });
    fireEvent.change(formInputs.release_year, { target: { value: '2020' } });
    fireEvent.change(formInputs.director, { target: { value: 'John Doe' } });
    fireEvent.change(formInputs.duration, { target: { value: '120' } });
    fireEvent.change(formInputs.description, { target: { value: 'Test description' } });
    fireEvent.change(formInputs.main_lead, { target: { value: 'Jane Doe' } });
    fireEvent.change(formInputs.streaming_platform, { target: { value: 'InvalidPlatform' } });

    const submitButton = screen.getByRole('button', { name: /Add Movie/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Please select a valid streaming platform.')).toBeInTheDocument();
    });
  });

  test('successfully submits form and resets for adding new movie', async () => {
    (createMovie as jest.Mock).mockResolvedValue({ message: 'Movie added successfully!' });

    render(<AdminPanel />);
    const formInputs = {
      title: screen.getByLabelText('Movie Title *'),
      genre: screen.getByLabelText('Genre *'),
      release_year: screen.getByLabelText('Release Year *'),
      director: screen.getByLabelText('Director *'),
      duration: screen.getByLabelText('Duration (minutes) *'),
      description: screen.getByLabelText('Description (max 1000 characters) *'),
      main_lead: screen.getByLabelText('Main Lead *'),
      streaming_platform: screen.getByLabelText('Streaming Platform *'),
    };

    fireEvent.change(formInputs.title, { target: { value: 'Test Movie' } });
    fireEvent.change(formInputs.genre, { target: { value: 'Drama' } });
    fireEvent.change(formInputs.release_year, { target: { value: '2020' } });
    fireEvent.change(formInputs.director, { target: { value: 'John Doe' } });
    fireEvent.change(formInputs.duration, { target: { value: '120' } });
    fireEvent.change(formInputs.description, { target: { value: 'Test description' } });
    fireEvent.change(formInputs.main_lead, { target: { value: 'Jane Doe' } });
    fireEvent.change(formInputs.streaming_platform, { target: { value: 'Netflix' } });

    const submitButton = screen.getByRole('button', { name: /Add Movie/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Movie added successfully!')).toBeInTheDocument();
      expect(formInputs.title).toHaveValue('');
      expect(createMovie).toHaveBeenCalledWith(expect.objectContaining({
        title: 'Test Movie',
        genre: 'Drama',
        release_year: 2020,
        director: 'John Doe',
        duration: 120,
        description: 'Test description',
        main_lead: 'Jane Doe',
        streaming_platform: 'Netflix',
      }));
    });
  });

  test('successfully updates movie and navigates', async () => {
    (useLocation as jest.Mock).mockReturnValue({ state: { movie: mockMovie } });
    (updateMovie as jest.Mock).mockResolvedValue({ message: 'Movie updated successfully!' });

    render(<AdminPanel />);
    const submitButton = screen.getByRole('button', { name: /Update Movie/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Movie updated successfully!')).toBeInTheDocument();
      expect(updateMovie).toHaveBeenCalledWith(mockMovie.id, expect.objectContaining({
        title: 'Test Movie',
        genre: 'Drama',
        release_year: 2020,
      }));
      expect(mockNavigate).toHaveBeenCalledWith('/home');
    });
  });

  test('navigates back to home when Go Back button is clicked', () => {
    render(<AdminPanel />);
    const goBackButton = screen.getByRole('button', { name: /Go Back Home/i });
    fireEvent.click(goBackButton);
    expect(mockNavigate).toHaveBeenCalledWith('/home');
  });

  test('handles file input changes', () => {
    render(<AdminPanel />);
    const posterInput = screen.getByLabelText('Poster Image (JPEG/PNG)') as HTMLInputElement;
    const file = new File(['poster'], 'poster.jpg', { type: 'image/jpeg' });
    fireEvent.change(posterInput, { target: { files: [file] } });
    expect(posterInput.files?.[0]).toBe(file);
  });
});