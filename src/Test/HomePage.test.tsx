import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import HomePage from '../pages/HomePage';

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

describe('HomePage Component', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  test('renders the main heading and subheading', () => {
    render(<HomePage />);
    expect(screen.getByText(/Movie Explore\+/i)).toBeInTheDocument();
    expect(screen.getByText(/Dive into a world of cinema like never before./i)).toBeInTheDocument();
  });

  test('renders login button and navigates on click', () => {
    render(<HomePage />);
    const loginButton = screen.getByRole('button', { name: /login/i });
    expect(loginButton).toBeInTheDocument();

    fireEvent.click(loginButton);
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  test('renders custom cursor div', () => {
    render(<HomePage />);
    const cursorDiv = document.querySelector('div.pointer-events-none.fixed.w-5.h-5.rounded-full.bg-white.z-50.mix-blend-difference.transition-all.duration-100');
    expect(cursorDiv).toBeInTheDocument();
  });

  test('renders poster images', () => {
    render(<HomePage />);
    const images = screen.getAllByRole('img');
    expect(images.length).toBeGreaterThanOrEqual(4);
    images.forEach((img, index) => {
      expect(img).toHaveAttribute('alt', `Poster ${index + 1}`);
    });
  });
});
