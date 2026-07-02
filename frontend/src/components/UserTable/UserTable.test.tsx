// import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import UserTable from './UserTable';
import type { User } from '../../types/user';

const mockUsers: User[] = [
  { id: 1, firstName: 'Leanne', lastName: 'Graham', email: 'leanne@example.com', department: 'Romaguera-Crona' },
  { id: 2, firstName: 'Ervin', lastName: 'Howell', email: 'ervin@example.com', department: 'Deckow-Crist' },
];

describe('UserTable', () => {
  it('renders a row for each user with all expected fields', () => {
    render(<UserTable users={mockUsers} onEdit={jest.fn()} onDelete={jest.fn()} />);

    expect(screen.getByText('Leanne')).toBeInTheDocument();
    expect(screen.getByText('Graham')).toBeInTheDocument();
    expect(screen.getByText('leanne@example.com')).toBeInTheDocument();
    expect(screen.getByText('Romaguera-Crona')).toBeInTheDocument();

    expect(screen.getByText('Ervin')).toBeInTheDocument();
    expect(screen.getByText('Howell')).toBeInTheDocument();
  });

  it('renders column headers', () => {
    render(<UserTable users={mockUsers} onEdit={jest.fn()} onDelete={jest.fn()} />);

    expect(screen.getByText('ID')).toBeInTheDocument();
    expect(screen.getByText('First Name')).toBeInTheDocument();
    expect(screen.getByText('Last Name')).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByText('Department')).toBeInTheDocument();
  });

  it('shows an empty state message when there are no users', () => {
    render(<UserTable users={[]} onEdit={jest.fn()} onDelete={jest.fn()} />);

    expect(screen.getByText('No users found.')).toBeInTheDocument();
    expect(screen.queryByRole('table')).not.toBeInTheDocument();
  });

  it('calls onEdit with the correct user when Edit is clicked', async () => {
    const user = userEvent.setup();
    const onEdit = jest.fn();
    render(<UserTable users={mockUsers} onEdit={onEdit} onDelete={jest.fn()} />);

    await user.click(screen.getByLabelText('Edit Leanne Graham'));

    expect(onEdit).toHaveBeenCalledTimes(1);
    expect(onEdit).toHaveBeenCalledWith(mockUsers[0]);
  });

  it('calls onDelete with the correct user when Delete is clicked', async () => {
    const user = userEvent.setup();
    const onDelete = jest.fn();
    render(<UserTable users={mockUsers} onEdit={jest.fn()} onDelete={onDelete} />);

    await user.click(screen.getByLabelText('Delete Ervin Howell'));

    expect(onDelete).toHaveBeenCalledTimes(1);
    expect(onDelete).toHaveBeenCalledWith(mockUsers[1]);
  });
});