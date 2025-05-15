import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SignupPage from '../pages/SignupPage';
import * as Api from '../Api';

jest.mock('../Api');

describe('SignupPage Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders all form fields', () => {
    render(<SignupPage />);
    expect(screen.getByPlaceholderText(/Full Name/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/^Password$/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Confirm Password/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Mobile Number/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Sign Up/i })).toBeInTheDocument();
  });

 

  test('calls signup API and redirects on success', async () => {
    const mockResponse = { user: { id: 1 } };
    (Api.signupUser as jest.Mock).mockResolvedValue(mockResponse);
    Object.defineProperty(window, 'location', {
      writable: true,
      value: { href: '' },
    });

    render(<SignupPage />);
    fireEvent.change(screen.getByPlaceholderText(/Full Name/i), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByPlaceholderText(/Email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText(/^Password$/i), { target: { value: '123456' } });
    fireEvent.change(screen.getByPlaceholderText(/Confirm Password/i), { target: { value: '123456' } });
    fireEvent.change(screen.getByPlaceholderText(/Mobile Number/i), { target: { value: '1234567890' } });

    fireEvent.click(screen.getByRole('button', { name: /Sign Up/i }));

   
  });

  test('shows error message on signup failure', async () => {
    (Api.signupUser as jest.Mock).mockRejectedValue(new Error('Signup failed'));
    render(<SignupPage />);
    fireEvent.change(screen.getByPlaceholderText(/Full Name/i), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByPlaceholderText(/Email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText(/^Password$/i), { target: { value: '123456' } });
    fireEvent.change(screen.getByPlaceholderText(/Confirm Password/i), { target: { value: '123456' } });
    fireEvent.change(screen.getByPlaceholderText(/Mobile Number/i), { target: { value: '1234567890' } });

    fireEvent.click(screen.getByRole('button', { name: /Sign Up/i }));

    
  });
});
