// import React from 'react';
import { render, screen } from '@testing-library/react';
import LoadingSpinner from './LoadingSpinner';

describe('LoadingSpinner', () => {
  it('renders the default label', () => {
    render(<LoadingSpinner />);
    expect(screen.getByRole('status')).toHaveTextContent('Loading...');
  });

  it('renders a custom label when provided', () => {
    render(<LoadingSpinner label="Fetching users..." />);
    expect(screen.getByRole('status')).toHaveTextContent('Fetching users...');
  });
});