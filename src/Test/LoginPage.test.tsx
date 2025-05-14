import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginPage from '../pages/LoginPage'; // update path as needed
import { loginUser } from '../Api'; // update path as needed
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';

// Mocks
jest.mock('../Api', () => ({
  loginUser: jest.fn(),
}));

const mockedNavigate = jest.fn();

jest.mock('../withNavigate', () => ({
  withNavigate: (Component: any) => (props: any) =>
    <Component {...props} navigate={mockedNavigate} />,
}));

describe('LoginPage Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  it('renders email, password fields and sign in button', () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('logs in successfully and navigates to home', async () => {
    const mockResponse = {
      user: { id: 1, email: 'test@example.com' },
      token: 'mock-token',
      role: 'user',
    };

    (loginUser as jest.Mock).mockResolvedValue(mockResponse);
    window.alert = jest.fn();

    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText('Email'), {
      target: { value: 'test@example.com' },
    });

    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'password123' },
    });

    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(loginUser).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
    });

    expect(localStorage.getItem('role')).toBe('user');
    expect(localStorage.getItem('token')).toBe('mock-token');
    expect(localStorage.getItem('user')).toBe(JSON.stringify(mockResponse.user));
    expect(mockedNavigate).toHaveBeenCalledWith('/home');
    expect(window.alert).toHaveBeenCalledWith('Login successful!');
  });

  it('shows error alert on failed login', async () => {
    (loginUser as jest.Mock).mockRejectedValue(new Error('Invalid credentials'));
    window.alert = jest.fn();
    console.error = jest.fn(); // suppress error logs

    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText('Email'), {
      target: { value: 'wrong@example.com' },
    });

    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'wrongpass' },
    });

    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(loginUser).toHaveBeenCalled();
    });

    expect(window.alert).toHaveBeenCalledWith(
      'Login failed. Please check your email and password.'
    );
  });

  it('throttles rapid sign-in attempts', async () => {
    const mockResponse = {
      user: { id: 1, email: 'test@example.com' },
      token: 'mock-token',
      role: 'user',
    };
    (loginUser as jest.Mock).mockResolvedValue(mockResponse);

    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText('Email'), {
      target: { value: 'test@example.com' },
    });

    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'password123' },
    });

    const signInButton = screen.getByRole('button', { name: /sign in/i });

    fireEvent.click(signInButton);
    fireEvent.click(signInButton); // second click should be throttled

    await waitFor(() => {
      expect(loginUser).toHaveBeenCalledTimes(1);
    });
  });

  it('navigates to signup on button click', () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    const signUpButton = screen.getByRole('button', { name: /sign up/i });
    fireEvent.click(signUpButton);

    expect(mockedNavigate).toHaveBeenCalledWith('/signup');
  });
});
