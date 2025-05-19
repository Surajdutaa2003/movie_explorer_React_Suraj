import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import * as Api from '../services/Api';
import { withNavigate } from '../withNavigate';

// Mock the API service
jest.mock('../services/Api', () => ({
  loginUser: jest.fn(),
}));

// Mock the withNavigate HOC
jest.mock('../withNavigate', () => ({
  withNavigate: (Component: React.ComponentType<any>) => (props: any) => (
    <Component {...props} navigate={jest.fn()} />
  ),
}));

// Mock react-hot-toast
jest.mock('react-hot-toast', () => ({
  error: jest.fn(),
  success: jest.fn(),
  Toaster: () => null,
}));

describe('LoginPage', () => {
  const mockNavigate = jest.fn();
  const mockLoginUser = Api.loginUser as jest.Mock;

  // Wrapper to provide router context
  const renderWithRouter = (component: React.ReactElement) => {
    return render(<BrowserRouter>{component}</BrowserRouter>);
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the login form correctly', () => {
    const LoginPageWithNavigate = withNavigate(LoginPage);
    renderWithRouter(<LoginPageWithNavigate />);

    expect(screen.getByAltText('logo')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sign In' })).toBeInTheDocument();
    expect(screen.getByText(/Don't have an account\?/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sign Up' })).toBeInTheDocument();
  });

  it('handles input changes', () => {
    const LoginPageWithNavigate = withNavigate(LoginPage);
    renderWithRouter(<LoginPageWithNavigate />);

    const emailInput = screen.getByPlaceholderText('Email');
    const passwordInput = screen.getByPlaceholderText('Password');

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    expect(emailInput).toHaveValue('test@example.com');
    expect(passwordInput).toHaveValue('password123');
  });

  it('shows error for empty fields on submit', async () => {
    const LoginPageWithNavigate = withNavigate(LoginPage);
    renderWithRouter(<LoginPageWithNavigate />);

    const signInButton = screen.getByRole('button', { name: 'Sign In' });
    fireEvent.click(signInButton);

    await waitFor(() => {
      expect(screen.getByText('Please fill in both email and password')).toBeInTheDocument();
      expect(require('react-hot-toast').error).toHaveBeenCalledWith(
        'Please fill in both email and password',
        expect.any(Object)
      );
    });
  });

  it('shows error for invalid email', async () => {
    const LoginPageWithNavigate = withNavigate(LoginPage);
    renderWithRouter(<LoginPageWithNavigate />);

    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'invalid-email' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password123' } });

    const signInButton = screen.getByRole('button', { name: 'Sign In' });
    fireEvent.click(signInButton);

    await waitFor(() => {
      expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument();
      expect(require('react-hot-toast').error).toHaveBeenCalledWith(
        'Please enter a valid email address',
        expect.any(Object)
      );
    });
  });

  it('shows error for password less than 8 characters', async () => {
    const LoginPageWithNavigate = withNavigate(LoginPage);
    renderWithRouter(<LoginPageWithNavigate />);

    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'short' } });

    const signInButton = screen.getByRole('button', { name: 'Sign In' });
    fireEvent.click(signInButton);

    await waitFor(() => {
      expect(screen.getByText('Password must be at least 8 characters long')).toBeInTheDocument();
      expect(require('react-hot-toast').error).toHaveBeenCalledWith(
        'Password must be at least 8 characters long',
        expect.any(Object)
      );
    });
  });

  it('successfully logs in with valid credentials', async () => {
    const mockResponse = {
      user: {
        id: 1,
        email: 'test@example.com',
        first_name: 'Test',
        last_name: 'User',
        mobile_number: '1234567890',
        role: 'user',
        created_at: '2025-05-16',
        updated_at: '2025-05-16',
      },
      token: 'mock-token',
    };
    mockLoginUser.mockResolvedValue(mockResponse);

    // Mock localStorage
    const localStorageMock = {
      setItem: jest.fn(),
      getItem: jest.fn(),
    };
    Object.defineProperty(window, 'localStorage', { value: localStorageMock });

    const LoginPageWithNavigate = withNavigate(LoginPage);
    renderWithRouter(<LoginPageWithNavigate />);

    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password123' } });

    const signInButton = screen.getByRole('button', { name: 'Sign In' });
    fireEvent.click(signInButton);

    await waitFor(() => {
      expect(mockLoginUser).toHaveBeenCalledWith({ email: 'test@example.com', password: 'password123' });
      expect(localStorageMock.setItem).toHaveBeenCalledWith('role', 'user');
      expect(localStorageMock.setItem).toHaveBeenCalledWith('user', JSON.stringify(mockResponse.user));
      expect(localStorageMock.setItem).toHaveBeenCalledWith('token', 'mock-token');
      expect(require('react-hot-toast').success).toHaveBeenCalledWith(
        'Login successful!',
        expect.any(Object)
      );
      // expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  it('handles login failure', async () => {
    mockLoginUser.mockRejectedValue(new Error('Invalid credentials'));

    const LoginPageWithNavigate = withNavigate(LoginPage);
    renderWithRouter(<LoginPageWithNavigate />);

    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password123' } });

    const signInButton = screen.getByRole('button', { name: 'Sign In' });
    fireEvent.click(signInButton);

    await waitFor(() => {
      expect(mockLoginUser).toHaveBeenCalledWith({ email: 'test@example.com', password: 'password123' });
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
      expect(require('react-hot-toast').error).toHaveBeenCalledWith(
        'Invalid credentials',
        expect.any(Object)
      );
    });
  });

 
  });
