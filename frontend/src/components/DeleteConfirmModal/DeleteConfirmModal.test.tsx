// import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DeleteConfirmModal from './DeleteConfirmModal';
import type { User } from '../../types/user';

const mockUser: User = {
  id: 1,
  firstName: 'Leanne',
  lastName: 'Graham',
  email: 'leanne@example.com',
  department: 'Romaguera-Crona',
};

describe('DeleteConfirmModal', () => {
  it('renders nothing when user is null', () => {
    render(
      <DeleteConfirmModal isOpen user={null} onRequestClose={jest.fn()} onConfirm={jest.fn()} />
    );
    expect(screen.queryByText('Delete User')).not.toBeInTheDocument();
  });

  it("shows the target user's full name in the confirmation message", () => {
    render(
      <DeleteConfirmModal isOpen user={mockUser} onRequestClose={jest.fn()} onConfirm={jest.fn()} />
    );
    expect(screen.getByText(/Leanne Graham/)).toBeInTheDocument();
  });

  it('calls onConfirm and then onRequestClose when deletion succeeds', async () => {
    const user = userEvent.setup();
    const onConfirm = jest.fn().mockResolvedValue(true);
    const onRequestClose = jest.fn();

    render(
      <DeleteConfirmModal isOpen user={mockUser} onRequestClose={onRequestClose} onConfirm={onConfirm} />
    );

    await user.click(screen.getByText('Delete'));

    await waitFor(() => expect(onConfirm).toHaveBeenCalledTimes(1));
    await waitFor(() => expect(onRequestClose).toHaveBeenCalledTimes(1));
  });

  it('shows an error and keeps the modal open when deletion fails', async () => {
    const user = userEvent.setup();
    const onConfirm = jest.fn().mockResolvedValue(false);
    const onRequestClose = jest.fn();

    render(
      <DeleteConfirmModal isOpen user={mockUser} onRequestClose={onRequestClose} onConfirm={onConfirm} />
    );

    await user.click(screen.getByText('Delete'));

    expect(await screen.findByText('Could not delete this user. Please try again.')).toBeInTheDocument();
    expect(onRequestClose).not.toHaveBeenCalled();
  });

  it('calls onRequestClose when Cancel is clicked, without calling onConfirm', async () => {
    const user = userEvent.setup();
    const onConfirm = jest.fn();
    const onRequestClose = jest.fn();

    render(
      <DeleteConfirmModal isOpen user={mockUser} onRequestClose={onRequestClose} onConfirm={onConfirm} />
    );

    await user.click(screen.getByText('Cancel'));

    expect(onRequestClose).toHaveBeenCalledTimes(1);
    expect(onConfirm).not.toHaveBeenCalled();
  });

  it('disables both buttons while the delete request is in flight', async () => {
    const user = userEvent.setup();
    let resolveConfirm: (value: boolean) => void = () => {};
    const onConfirm = jest.fn(() => new Promise<boolean>((resolve) => { resolveConfirm = resolve; }));

    render(
      <DeleteConfirmModal isOpen user={mockUser} onRequestClose={jest.fn()} onConfirm={onConfirm} />
    );

    await user.click(screen.getByText('Delete'));

    expect(screen.getByText('Deleting...')).toBeDisabled();
    expect(screen.getByText('Cancel')).toBeDisabled();

    resolveConfirm(true);
    await waitFor(() => expect(screen.queryByText('Deleting...')).not.toBeInTheDocument());
  });
});