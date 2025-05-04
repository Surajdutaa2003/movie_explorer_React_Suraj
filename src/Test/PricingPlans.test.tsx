import React from 'react';
import { render, screen } from '@testing-library/react';
import PricingPlans from '../PricingPlans';

describe('PricingPlans Component', () => {
  test('renders heading and go back button', () => {
    render(<PricingPlans />);
    expect(screen.getByText(/Choose Your Experience/i)).toBeInTheDocument();
    expect(screen.getByText(/← Go Back Home/i)).toBeInTheDocument();
  });

  test('renders all pricing tiers', () => {
    render(<PricingPlans />);
    expect(screen.getByText(/Starter/i)).toBeInTheDocument();
    expect(screen.getByText(/Cinephile/i)).toBeInTheDocument();
    expect(screen.getByText(/Director’s Cut/i)).toBeInTheDocument();
  });

  test('renders features for each tier', () => {
    render(<PricingPlans />);
    expect(screen.getByText(/Browse movie database/i)).toBeInTheDocument();
    expect(screen.getByText(/Director biographies/i)).toBeInTheDocument();
    expect(screen.getByText(/Behind-the-scenes interviews/i)).toBeInTheDocument();
  });

  test('renders prices and per month text', () => {
    render(<PricingPlans />);
    expect(screen.getByText(/\$5/i)).toBeInTheDocument();
    expect(screen.getByText(/\$10/i)).toBeInTheDocument();
    expect(screen.getByText(/\$20/i)).toBeInTheDocument();
    expect(screen.getAllByText(/per month/i).length).toBeGreaterThanOrEqual(3);
  });

  test('renders sign up buttons', () => {
    render(<PricingPlans />);
    const buttons = screen.getAllByRole('button', { name: /sign up/i });
    expect(buttons.length).toBe(3);
  });
});
