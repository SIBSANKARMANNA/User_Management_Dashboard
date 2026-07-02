// import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import UserFormModal from './UserFormModal';
import type { UserFormData } from '../../types/user';

const existingUser: UserFormData = {
  firstName: 'Jane',
  lastName: 'Smith',
  email: 'jane.smith@example.com',
  department: 'HR',
};

describe('UserFormModal - Add mode', () => {
  it('renders empty fields and "Add User" title when no initialData is given', () => {
    render(<UserFormModal isOpen onRequestClose={jest.fn()} onSubmit={jest.fn()} />);

    expect(screen.getByText('Add User')).toBeInTheDocument();
    expect(screen.getByLabelText('First Name')).toHaveValue('');
    expect(screen.getByLabelText('Last Name')).toHaveValue('');
    expect(screen.getByLabelText('Email')).toHaveValue('');
    expect(screen.getByLabelText('Department')).toHaveValue('');
  });

  it('does not render form content when isOpen is false', () => {
    render(<UserFormModal isOpen={false} onRequestClose={jest.fn()} onSubmit={jest.fn()} />);
    expect(screen.queryByText('Add User')).not.toBeInTheDocument();
  });
});

describe('UserFormModal - Edit mode', () => {
  it('renders pre-filled fields and "Edit User" title when initialData is given', () => {
    render(
      <UserFormModal isOpen onRequestClose={jest.fn()} onSubmit={jest.fn()} initialData={existingUser} />
    );

    expect(screen.getByText('Edit User')).toBeInTheDocument();
    expect(screen.getByLabelText('First Name')).toHaveValue('Jane');
    expect(screen.getByLabelText('Email')).toHaveValue('jane.smith@example.com');
  });
});

describe('UserFormModal - validation', () => {
  it('shows field errors and does not call onSubmit when the form is empty', async () => {
    const user = userEvent.setup();
    const onSubmit = jest.fn();
    render(<UserFormModal isOpen onRequestClose={jest.fn()} onSubmit={onSubmit} />);

    await user.click(screen.getByText('Save'));

    expect(await screen.findByText('First name is required')).toBeInTheDocument();
    expect(screen.getByText('Last name is required')).toBeInTheDocument();
    expect(screen.getByText('Email is required')).toBeInTheDocument();
    expect(screen.getByText('Department is required')).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('clears a field error as soon as the user edits that field', async () => {
    const user = userEvent.setup();
    render(<UserFormModal isOpen onRequestClose={jest.fn()} onSubmit={jest.fn()} />);

    await user.click(screen.getByText('Save'));
    expect(await screen.findByText('First name is required')).toBeInTheDocument();

    await user.type(screen.getByLabelText('First Name'), 'A');
    expect(screen.queryByText('First name is required')).not.toBeInTheDocument();
  });

  it('shows an error for an invalid email format', async () => {
    const user = userEvent.setup();
    render(
      <UserFormModal isOpen onRequestClose={jest.fn()} onSubmit={jest.fn()} initialData={existingUser} />
    );

    await user.clear(screen.getByLabelText('Email'));
    await user.type(screen.getByLabelText('Email'), 'not-an-email');
    await user.click(screen.getByText('Save'));

    expect(await screen.findByText('Enter a valid email address')).toBeInTheDocument();
  });
});

describe('UserFormModal - submit behavior', () => {
  it('calls onSubmit with form data and closes the modal on success', async () => {
    const user = userEvent.setup();
    const onSubmit = jest.fn().mockResolvedValue(true);
    const onRequestClose = jest.fn();

    render(<UserFormModal isOpen onRequestClose={onRequestClose} onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText('First Name'), 'John');
    await user.type(screen.getByLabelText('Last Name'), 'Doe');
    await user.type(screen.getByLabelText('Email'), 'john.doe@example.com');
    await user.type(screen.getByLabelText('Department'), 'Engineering');
    await user.click(screen.getByText('Save'));

    await waitFor(() => expect(onSubmit).toHaveBeenCalledWith({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      department: 'Engineering',
    }));
    await waitFor(() => expect(onRequestClose).toHaveBeenCalledTimes(1));
  });

  it('keeps the modal open and shows a submit error when onSubmit resolves false', async () => {
    const user = userEvent.setup();
    const onSubmit = jest.fn().mockResolvedValue(false);
    const onRequestClose = jest.fn();

    render(
      <UserFormModal isOpen onRequestClose={onRequestClose} onSubmit={onSubmit} initialData={existingUser} />
    );

    await user.click(screen.getByText('Save'));

    expect(await screen.findByText('Could not save this user. Please try again.')).toBeInTheDocument();
    expect(onRequestClose).not.toHaveBeenCalled();
    // Entered data should still be intact so the user doesn't lose their input
    expect(screen.getByLabelText('First Name')).toHaveValue('Jane');
  });

  it('calls onRequestClose when Cancel is clicked', async () => {
    const user = userEvent.setup();
    const onRequestClose = jest.fn();
    render(<UserFormModal isOpen onRequestClose={onRequestClose} onSubmit={jest.fn()} />);

    await user.click(screen.getByText('Cancel'));

    expect(onRequestClose).toHaveBeenCalledTimes(1);
  });
});