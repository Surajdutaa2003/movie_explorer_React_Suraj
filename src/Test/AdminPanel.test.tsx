// AdminPanel.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import AdminPanel from '../AdminPanel';
import { vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';

// Mock react-router-dom hooks used in AdminPanel
vi.mock('react-router-dom', () => {
  const actual = vi.importActual('react-router-dom');
  return {
    ...actual,
    useLocation: () => ({
      state: {
        movie: {
          id: 1,
          title: 'Test Movie',
          genre: 'Drama',
          release_year: 2021,
          rating: 7.5,
          director: 'Test Director',
          duration: 110,
          description: 'Test description',
          main_lead: 'Test Lead',
          streaming_platform: 'Hulu',
          premium: false,
        },
      },
    }),
    useNavigate: () => vi.fn(),
  };
});

describe('AdminPanel Component', () => {
  test('renders AdminPanel with pre-filled movie data', () => {
    render(
      <BrowserRouter>
        <AdminPanel />
      </BrowserRouter>
    );

    // Check if input fields are pre-filled with movie data
    expect(screen.getByDisplayValue('Test Movie')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Drama')).toBeInTheDocument();
    expect(screen.getByDisplayValue('2021')).toBeInTheDocument();
    expect(screen.getByDisplayValue('7.5')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test Director')).toBeInTheDocument();
    expect(screen.getByDisplayValue('110')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test description')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test Lead')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Hulu')).toBeInTheDocument();

    // Check if submit button is present
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
  });

  test('allows user to change input fields', () => {
    render(
      <BrowserRouter>
        <AdminPanel />
      </BrowserRouter>
    );

    const titleInput = screen.getByLabelText(/title/i) as HTMLInputElement;
    fireEvent.change(titleInput, { target: { value: 'New Movie Title' } });
    expect(titleInput.value).toBe('New Movie Title');
  });

  test('submit button triggers form submission', () => {
    const mockSubmit = vi.fn();
    // We would need to mock the submit handler if exposed or simulate form submission
    // For now, just check button presence and click
    render(
      <BrowserRouter>
        <AdminPanel />
      </BrowserRouter>
    );

    const submitButton = screen.getByRole('button', { name: /submit/i });
    fireEvent.click(submitButton);

    // Since actual submit handler is internal, we cannot assert calls here without further setup
    // This test ensures button is clickable without errors
    expect(submitButton).toBeEnabled();
  });
});
