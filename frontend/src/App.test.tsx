// import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';
import useUsers from './hooks/useUsers';
import type { User } from './types/user';

// Mock the hook so App's rendering logic can be tested independently
// of real fetching/timers — each test controls exactly what the
// hook "returns" for that scenario.
jest.mock('./hooks/useUsers');
const mockedUseUsers = useUsers as jest.MockedFunction<typeof useUsers>;

const mockUsers: User[] = [
  { id: 1, firstName: 'Leanne', lastName: 'Graham', email: 'leanne@example.com', department: 'Romaguera-Crona' },
];

const baseHookReturn = {
  users: [] as User[],
  loading: false,
  error: null,
  addUser: jest.fn(),
  editUser: jest.fn(),
  removeUser: jest.fn(),
  refetch: jest.fn(),
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe('App', () => {
  it('shows the loading spinner while data is loading', () => {
    mockedUseUsers.mockReturnValue({ ...baseHookReturn, loading: true });

    render(<App />);

    expect(screen.getByRole('status')).toHaveTextContent('Loading users...');
    expect(screen.queryByRole('table')).not.toBeInTheDocument();
  });

  it('renders the user table once loading finishes with data', () => {
    mockedUseUsers.mockReturnValue({ ...baseHookReturn, users: mockUsers, loading: false });

    render(<App />);

    expect(screen.getByText('Leanne')).toBeInTheDocument();
    expect(screen.getByRole('table')).toBeInTheDocument();
  });

  it('shows an error banner and a retry button when fetch fails with no data', async () => {
    const refetch = jest.fn();
    mockedUseUsers.mockReturnValue({
      ...baseHookReturn,
      users: [],
      loading: false,
      error: { message: 'Network Error' },
      refetch,
    });

    const user = userEvent.setup();
    render(<App />);

    expect(screen.getByRole('alert')).toHaveTextContent('Network Error');

    await user.click(screen.getByText('Retry'));
    expect(refetch).toHaveBeenCalledTimes(1);
  });

  it('does not show a retry button when there is an error but users are already loaded', () => {
    mockedUseUsers.mockReturnValue({
      ...baseHookReturn,
      users: mockUsers,
      loading: false,
      error: { message: 'A background refresh failed' },
    });

    render(<App />);

    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.queryByText('Retry')).not.toBeInTheDocument();
  });

  it('dismisses the error banner when the dismiss button is clicked', async () => {
    mockedUseUsers.mockReturnValue({
      ...baseHookReturn,
      users: mockUsers,
      loading: false,
      error: { message: 'Some error' },
    });

    const user = userEvent.setup();
    render(<App />);

    expect(screen.getByRole('alert')).toBeInTheDocument();
    await user.click(screen.getByLabelText('Dismiss error'));

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('shows the empty state when there are no users and no error', () => {
    mockedUseUsers.mockReturnValue({ ...baseHookReturn, users: [], loading: false });

    render(<App />);

    expect(screen.getByText('No users found.')).toBeInTheDocument();
  });
});