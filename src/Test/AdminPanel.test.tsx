import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AdminPanel from '../AdminPanel';

describe('AdminPanel Component', () => {
  test('renders form fields correctly', () => {
    render(<AdminPanel />);
    expect(screen.getByLabelText(/Movie Title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Genre/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Release Year/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Rating/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Actors/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Country/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Director/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Duration/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Language/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Budget/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Box Office/i)).toBeInTheDocument();
    expect(screen.getByText(/Poster URLs/i)).toBeInTheDocument();
  });

  test('allows adding another poster URL field', () => {
    render(<AdminPanel />);
    const addButton = screen.getByRole('button', { name: /Add Another URL/i });
    fireEvent.click(addButton);
    const posterInputs = screen.getAllByPlaceholderText('https://example.com/poster.jpg');
    expect(posterInputs.length).toBe(2);
  });

  test('submits the form and shows success message', async () => {
    render(<AdminPanel />);
    fireEvent.change(screen.getByLabelText(/Movie Title/i), { target: { value: 'Test Movie' } });
    fireEvent.change(screen.getByLabelText(/Genre/i), { target: { value: 'Drama' } });
    fireEvent.change(screen.getByLabelText(/Release Year/i), { target: { value: '2023' } });
    fireEvent.change(screen.getByLabelText(/Rating/i), { target: { value: '8.5' } });
    fireEvent.change(screen.getByLabelText(/Actors/i), { target: { value: 'Actor One, Actor Two' } });
    fireEvent.change(screen.getByLabelText(/Country/i), { target: { value: 'USA' } });
    fireEvent.change(screen.getByLabelText(/Director/i), { target: { value: 'Director Name' } });
    fireEvent.change(screen.getByLabelText(/Duration/i), { target: { value: '120' } });
    fireEvent.change(screen.getByLabelText(/Description/i), { target: { value: 'A great movie.' } });
    fireEvent.change(screen.getByLabelText(/Language/i), { target: { value: 'English' } });
    fireEvent.change(screen.getByLabelText(/Budget/i), { target: { value: '$10M' } });
    fireEvent.change(screen.getByLabelText(/Box Office/i), { target: { value: '$50M' } });
    fireEvent.change(screen.getAllByPlaceholderText('https://example.com/poster.jpg')[0], { target: { value: 'https://example.com/poster1.jpg' } });

    fireEvent.click(screen.getByRole('button', { name: /Add Movie/i }));

    await waitFor(() => {
      expect(screen.getByText(/Movie added successfully/i)).toBeInTheDocument();
    });
  });

  test('shows error message on form submission failure', async () => {
    // To simulate error, we can temporarily override console.log to throw error
    const originalConsoleLog = console.log;
    console.log = () => { throw new Error('Test error'); };

    render(<AdminPanel />);
    fireEvent.change(screen.getByLabelText(/Movie Title/i), { target: { value: 'Test Movie' } });
    fireEvent.change(screen.getByLabelText(/Genre/i), { target: { value: 'Drama' } });
    fireEvent.change(screen.getByLabelText(/Release Year/i), { target: { value: '2023' } });
    fireEvent.change(screen.getByLabelText(/Rating/i), { target: { value: '8.5' } });
    fireEvent.change(screen.getByLabelText(/Actors/i), { target: { value: 'Actor One, Actor Two' } });
    fireEvent.change(screen.getByLabelText(/Country/i), { target: { value: 'USA' } });
    fireEvent.change(screen.getByLabelText(/Director/i), { target: { value: 'Director Name' } });
    fireEvent.change(screen.getByLabelText(/Duration/i), { target: { value: '120' } });
    fireEvent.change(screen.getByLabelText(/Description/i), { target: { value: 'A great movie.' } });
    fireEvent.change(screen.getByLabelText(/Language/i), { target: { value: 'English' } });
    fireEvent.change(screen.getByLabelText(/Budget/i), { target: { value: '$10M' } });
    fireEvent.change(screen.getByLabelText(/Box Office/i), { target: { value: '$50M' } });
    fireEvent.change(screen.getAllByPlaceholderText('https://example.com/poster.jpg')[0], { target: { value: 'https://example.com/poster1.jpg' } });

    fireEvent.click(screen.getByRole('button', { name: /Add Movie/i }));

    await waitFor(() => {
      expect(screen.getByText(/Failed to process the form/i)).toBeInTheDocument();
    });

    // Restore original console.log
    console.log = originalConsoleLog;
  });
});
