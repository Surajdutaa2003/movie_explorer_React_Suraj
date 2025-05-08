import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import LoginPage from '../LoginPage'; // Adjust the path as needed
import * as Api from '../Api'; // Import the API module

// Mock the loginUser function in the Api module and provide types for the mock
vi.mock('./Api', () => ({
  loginUser: vi.fn() as unknown as jest.MockedFunction<typeof Api.loginUser>,
}));

describe('LoginPage Component', () => {
  beforeEach(() => {
    vi.clearAllMocks(); // Reset all mocks before each test
  });

  test('renders LoginPage correctly', () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    // Check for the presence of email and password input fields
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Sign In/i })).toBeInTheDocument();
  });

  test('submits the login form with correct credentials', async () => {
    const mockLoginResponse = {
      user: {
        id: 1,
        email: 'test@example.com',
      },
      token: 'mock-token',
      role: 'user',
    };

    // Mocking loginUser to resolve with mockLoginResponse
    (Api.loginUser as jest.MockedFunction<typeof Api.loginUser>).mockResolvedValue(mockLoginResponse);

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

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /Sign In/i }));

    // Wait for the login function to be called and check the behavior
    await waitFor(() => expect(Api.loginUser).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
    }));

    // Ensure the navigation happens after login
    expect(localStorage.getItem('role')).toBe('user');
    expect(localStorage.getItem('user')).toBe(JSON.stringify(mockLoginResponse.user));
    expect(localStorage.getItem('token')).toBe(mockLoginResponse.token);

    // You can also mock `navigate` and verify it was called with the correct route
    expect(screen.getByText(/Login successful!/i)).toBeInTheDocument();
  });

  test('shows an error when login fails', async () => {
    const mockError = new Error('Login failed');

    // Mocking loginUser to reject with mockError
    (Api.loginUser as jest.MockedFunction<typeof Api.loginUser>).mockRejectedValue(mockError);

    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText('Email'), {
      target: { value: 'invalid@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'wrongpassword' },
    });

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /Sign In/i }));

    // Wait for the error alert to appear
    await waitFor(() => expect(screen.getByText(/Login failed. Please check your email and password./i)).toBeInTheDocument());
  });

  test('triggers throttled login function', async () => {
    const mockLoginResponse = {
      user: {
        id: 1,
        email: 'test@example.com',
      },
      token: 'mock-token',
      role: 'user',
    };

    // Mocking loginUser to resolve with mockLoginResponse
    (Api.loginUser as jest.MockedFunction<typeof Api.loginUser>).mockResolvedValue(mockLoginResponse);

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

    // Submit the form multiple times to ensure throttle is working
    fireEvent.click(screen.getByRole('button', { name: /Sign In/i }));
    fireEvent.click(screen.getByRole('button', { name: /Sign In/i }));

    // Wait for the login function to be called only once due to throttling
    await waitFor(() => expect(Api.loginUser).toHaveBeenCalledTimes(1));
  });
});
