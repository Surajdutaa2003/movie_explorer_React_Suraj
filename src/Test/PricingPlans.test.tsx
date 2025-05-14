import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SubscriptionPage from '../component/PricingPlans';
import * as subApi from '../subApi';
import toast from 'react-hot-toast';
import { Plan } from '../Types';
import { MemoryRouter } from 'react-router-dom';

// Mock dependencies
jest.mock('../subApi');
jest.mock('react-hot-toast');
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

// Mock localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
};
Object.defineProperty(window, 'location', {
  value: { href: '' },
  writable: true,
});
Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });

const mockPlans: Plan[] = [
  {
    id: '1_day',
    name: '1 Day Pass',
    price: '$1.99',
    features: ['Full access to all movies', 'Unlimited streaming', 'HD quality', 'No ads'],
    duration: '24 hours of premium access',
  },
  {
    id: '7_days',
    name: '7 Day Pass',
    price: '$7.99',
    features: [
      'Full access to all movies',
      'Unlimited streaming',
      'HD & 4K quality',
      'No ads',
      'Offline downloads',
    ],
    duration: '7 days of premium access',
    popular: true,
  },
  {
    id: '1_month',
    name: '1 Month Premium',
    price: '$19.99',
    features: [
      'Full access to all movies',
      'Unlimited streaming',
      'HD & 4K quality',
      'No ads',
      'Offline downloads',
      'Priority customer support',
      'Early access to new releases',
    ],
    duration: '30 days of premium access',
  },
];

describe('SubscriptionPage', () => {
  const mockNavigate = jest.fn();
  const mockCreateSubscription = jest.fn();
  const mockGetSubscriptionStatus = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (subApi.createSubscription as jest.Mock).mockImplementation(mockCreateSubscription);
    (subApi.getSubscriptionStatus as jest.Mock).mockImplementation(mockGetSubscriptionStatus);
    (require('react-router-dom').useNavigate as jest.Mock).mockReturnValue(mockNavigate);
    mockLocalStorage.getItem.mockReturnValue('mock-token');
    window.location.href = '';
  });

  it('renders all subscription plans with correct details', () => {
    render(
      <MemoryRouter>
        <SubscriptionPage />
      </MemoryRouter>
    );

    // Check page title and subtitle
    expect(screen.getByText('Choose Your Movie Explorer Plan')).toBeInTheDocument();
    expect(
      screen.getByText('Unlock premium content with a subscription that fits your schedule')
    ).toBeInTheDocument();

    // Check each plan
    mockPlans.forEach((plan) => {
      expect(screen.getByText(plan.name)).toBeInTheDocument();
      expect(screen.getByText(plan.price)).toBeInTheDocument();
      expect(screen.getByText(plan.duration)).toBeInTheDocument();
      plan.features.forEach((feature) => {
        expect(screen.getByText(feature)).toBeInTheDocument();
      });
      if (plan.popular) {
        expect(screen.getByText('MOST POPULAR')).toBeInTheDocument();
      }
    });
  });

  it('allows selecting a plan and shows confirmation section', async () => {
    render(
      <MemoryRouter>
        <SubscriptionPage />
      </MemoryRouter>
    );

    const selectButton = screen.getAllByText('Select Plan')[0]; // 1 Day Pass
    await userEvent.click(selectButton);

    expect(screen.getByText('Confirm Your Subscription')).toBeInTheDocument();
    expect(
      screen.getByText(
        'You have selected the 1 Day Pass for $1.99.'
      )
    ).toBeInTheDocument();
    expect(screen.getByText('Subscribe Now')).toBeInTheDocument();
    expect(selectButton).toHaveTextContent('Selected');
  });

  it('shows error when subscribing without selecting a plan', async () => {
    render(
      <MemoryRouter>
        <SubscriptionPage />
      </MemoryRouter>
    );

    const subscribeButton = screen.getByText('Subscribe Now');
    await userEvent.click(subscribeButton);

    expect(toast.error).toHaveBeenCalledWith('Please select a plan.');
    expect(screen.getByText('Please select a plan.')).toBeInTheDocument();
  });

  it('redirects to login when subscribing without a token', async () => {
    mockLocalStorage.getItem.mockReturnValue(null);
    render(
      <MemoryRouter>
        <SubscriptionPage />
      </MemoryRouter>
    );

    await userEvent.click(screen.getAllByText('Select Plan')[0]); // Select 1 Day Pass
    await userEvent.click(screen.getByText('Subscribe Now'));

    expect(toast.error).toHaveBeenCalledWith('Please sign in to continue.');
    expect(mockNavigate).toHaveBeenCalledWith('/login');
    expect(screen.getByText('You need to sign in to subscribe.')).toBeInTheDocument();
  });

  it('blocks subscription if user has an active premium subscription', async () => {
    mockGetSubscriptionStatus.mockResolvedValue({ is_active: true, plan_type: 'premium' });
    render(
      <MemoryRouter>
        <SubscriptionPage />
      </MemoryRouter>
    );

    await userEvent.click(screen.getAllByText('Select Plan')[0]); // Select 1 Day Pass
    await userEvent.click(screen.getByText('Subscribe Now'));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('You already have an active premium subscription.');
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  it('successfully initiates subscription and redirects to checkout', async () => {
    mockGetSubscriptionStatus.mockResolvedValue({ is_active: false, plan_type: 'basic' });
    mockCreateSubscription.mockResolvedValue('https://checkout.example.com');
    render(
      <MemoryRouter>
        <SubscriptionPage />
      </MemoryRouter>
    );

    await userEvent.click(screen.getAllByText('Select Plan')[0]); // Select 1 Day Pass
    await userEvent.click(screen.getByText('Subscribe Now'));

    await waitFor(() => {
      expect(mockCreateSubscription).toHaveBeenCalledWith('1_day');
      expect(window.location.href).toBe('https://checkout.example.com');
    });
  });

  it('shows error when subscription creation fails', async () => {
    mockGetSubscriptionStatus.mockResolvedValue({ is_active: false, plan_type: 'basic' });
    mockCreateSubscription.mockRejectedValue(new Error('Payment gateway error'));
    render(
      <MemoryRouter>
        <SubscriptionPage />
      </MemoryRouter>
    );

    await userEvent.click(screen.getAllByText('Select Plan')[0]); // Select 1 Day Pass
    await userEvent.click(screen.getByText('Subscribe Now'));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Payment gateway error');
      expect(screen.getByText('Payment gateway error')).toBeInTheDocument();
    });
  });

  it('renders success state after subscription', () => {
    // Simulate success state by manipulating component state (e.g., via a wrapper)
    const Wrapper = () => {
      const [showSuccess, setShowSuccess] = React.useState(true);
      return (
        <MemoryRouter>
          <SubscriptionPage />
        </MemoryRouter>
      );
    };
    render(<Wrapper />);

    expect(screen.getByText('Subscription Activated!')).toBeInTheDocument();
    expect(
      screen.getByText(/Thank you for subscribing to Movie Explorer/)
    ).toBeInTheDocument();
    expect(screen.getByText('Start Exploring Movies')).toBeInTheDocument();
  });

  it('navigates to dashboard when clicking Start Exploring Movies in success state', async () => {
    const Wrapper = () => {
      const [showSuccess, setShowSuccess] = React.useState(true);
      return (
        <MemoryRouter>
          <SubscriptionPage />
        </MemoryRouter>
      );
    };
    render(<Wrapper />);

    await userEvent.click(screen.getByText('Start Exploring Movies'));

    expect(window.location.href).toBe('/dashboard');
  })
  });
