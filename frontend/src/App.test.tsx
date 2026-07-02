// // import React from 'react';
// import { render, screen } from '@testing-library/react';
// import userEvent from '@testing-library/user-event';
// import App from './App';
// import useUsers from './hooks/useUsers';
// import type { User } from './types/user';

// // Mock the hook so App's rendering logic can be tested independently
// // of real fetching/timers — each test controls exactly what the
// // hook "returns" for that scenario.
// jest.mock('./hooks/useUsers');
// const mockedUseUsers = useUsers as jest.MockedFunction<typeof useUsers>;

// const mockUsers: User[] = [
//   { id: 1, firstName: 'Leanne', lastName: 'Graham', email: 'leanne@example.com', department: 'Romaguera-Crona' },
// ];

// const baseHookReturn = {
//   users: [] as User[],
//   loading: false,
//   error: null,
//   addUser: jest.fn(),
//   editUser: jest.fn(),
//   removeUser: jest.fn(),
//   refetch: jest.fn(),
// };

// beforeEach(() => {
//   jest.clearAllMocks();
// });

// describe('App', () => {
//   it('shows the loading spinner while data is loading', () => {
//     mockedUseUsers.mockReturnValue({ ...baseHookReturn, loading: true });

//     render(<App />);

//     expect(screen.getByRole('status')).toHaveTextContent('Loading users...');
//     expect(screen.queryByRole('table')).not.toBeInTheDocument();
//   });

//   it('renders the user table once loading finishes with data', () => {
//     mockedUseUsers.mockReturnValue({ ...baseHookReturn, users: mockUsers, loading: false });

//     render(<App />);

//     expect(screen.getByText('Leanne')).toBeInTheDocument();
//     expect(screen.getByRole('table')).toBeInTheDocument();
//   });

//   it('shows an error banner and a retry button when fetch fails with no data', async () => {
//     const refetch = jest.fn();
//     mockedUseUsers.mockReturnValue({
//       ...baseHookReturn,
//       users: [],
//       loading: false,
//       error: { message: 'Network Error' },
//       refetch,
//     });

//     const user = userEvent.setup();
//     render(<App />);

//     expect(screen.getByRole('alert')).toHaveTextContent('Network Error');

//     await user.click(screen.getByText('Retry'));
//     expect(refetch).toHaveBeenCalledTimes(1);
//   });

//   it('does not show a retry button when there is an error but users are already loaded', () => {
//     mockedUseUsers.mockReturnValue({
//       ...baseHookReturn,
//       users: mockUsers,
//       loading: false,
//       error: { message: 'A background refresh failed' },
//     });

//     render(<App />);

//     expect(screen.getByRole('alert')).toBeInTheDocument();
//     expect(screen.queryByText('Retry')).not.toBeInTheDocument();
//   });

//   it('dismisses the error banner when the dismiss button is clicked', async () => {
//     mockedUseUsers.mockReturnValue({
//       ...baseHookReturn,
//       users: mockUsers,
//       loading: false,
//       error: { message: 'Some error' },
//     });

//     const user = userEvent.setup();
//     render(<App />);

//     expect(screen.getByRole('alert')).toBeInTheDocument();
//     await user.click(screen.getByLabelText('Dismiss error'));

//     expect(screen.queryByRole('alert')).not.toBeInTheDocument();
//   });

//   it('shows the empty state when there are no users and no error', () => {
//     mockedUseUsers.mockReturnValue({ ...baseHookReturn, users: [], loading: false });

//     render(<App />);

//     expect(screen.getByText('No users found.')).toBeInTheDocument();
//   });
// });


// import React from 'react';

// import { render, screen, waitFor } from '@testing-library/react';
// import userEvent from '@testing-library/user-event';
// import App from './App';
// import useUsers from './hooks/useUsers';
// import type { User } from './types/user';

// // Mock the hook so App's rendering/wiring logic can be tested independently
// // of real fetching/timers — each test controls exactly what the
// // hook "returns" for that scenario. UserFormModal and DeleteConfirmModal
// // are NOT mocked, so these tests also verify the real wiring between
// // App and those modals (open on click, correct data passed, correct
// // hook function called on submit/confirm).
// jest.mock('./hooks/useUsers');
// const mockedUseUsers = useUsers as jest.MockedFunction<typeof useUsers>;

// const mockUsers: User[] = [
//   { id: 1, firstName: 'Leanne', lastName: 'Graham', email: 'leanne@example.com', department: 'Romaguera-Crona' },
// ];

// const baseHookReturn = {
//   users: [] as User[],
//   loading: false,
//   error: null,
//   addUser: jest.fn(),
//   editUser: jest.fn(),
//   removeUser: jest.fn(),
//   refetch: jest.fn(),
// };

// beforeEach(() => {
//   jest.clearAllMocks();
// });

// describe('App - loading/error/empty states', () => {
//   it('shows the loading spinner while data is loading', () => {
//     mockedUseUsers.mockReturnValue({ ...baseHookReturn, loading: true });
//     render(<App />);
//     expect(screen.getByRole('status')).toHaveTextContent('Loading users...');
//     expect(screen.queryByRole('table')).not.toBeInTheDocument();
//   });

//   it('renders the user table once loading finishes with data', () => {
//     mockedUseUsers.mockReturnValue({ ...baseHookReturn, users: mockUsers, loading: false });
//     render(<App />);
//     expect(screen.getByText('Leanne')).toBeInTheDocument();
//   });

//   it('shows an error banner and a retry button when fetch fails with no data', async () => {
//     const refetch = jest.fn();
//     mockedUseUsers.mockReturnValue({
//       ...baseHookReturn, users: [], loading: false, error: { message: 'Network Error' }, refetch,
//     });
//     const user = userEvent.setup();
//     render(<App />);
//     expect(screen.getByRole('alert')).toHaveTextContent('Network Error');
//     await user.click(screen.getByText('Retry'));
//     expect(refetch).toHaveBeenCalledTimes(1);
//   });

//   it('shows the empty state when there are no users and no error', () => {
//     mockedUseUsers.mockReturnValue({ ...baseHookReturn, users: [], loading: false });
//     render(<App />);
//     expect(screen.getByText('No users found.')).toBeInTheDocument();
//   });
// });

// describe('App - Add user flow', () => {
//   it('opens the Add modal when the floating add button is clicked', async () => {
//     mockedUseUsers.mockReturnValue({ ...baseHookReturn, users: mockUsers, loading: false });
//     const user = userEvent.setup();
//     render(<App />);

//     await user.click(screen.getByLabelText('Add User'));

//     expect(screen.getByText('Add User', { selector: 'h2' })).toBeInTheDocument();
//   });

//   it('calls addUser with form data and closes the modal on successful submit', async () => {
//     const addUser = jest.fn().mockResolvedValue(true);
//     mockedUseUsers.mockReturnValue({ ...baseHookReturn, users: mockUsers, loading: false, addUser });
//     const user = userEvent.setup();
//     render(<App />);

//     await user.click(screen.getByLabelText('Add User'));
//     await user.type(screen.getByLabelText('First Name'), 'New');
//     await user.type(screen.getByLabelText('Last Name'), 'Person');
//     await user.type(screen.getByLabelText('Email'), 'new.person@example.com');
//     await user.type(screen.getByLabelText('Department'), 'Sales');
//     await user.click(screen.getByText('Save'));

//     await waitFor(() => expect(addUser).toHaveBeenCalledWith({
//       firstName: 'New', lastName: 'Person', email: 'new.person@example.com', department: 'Sales',
//     }));
//     await waitFor(() => expect(screen.queryByText('Add User', { selector: 'h2' })).not.toBeInTheDocument());
//   });
// });

// describe('App - Edit user flow', () => {
//   it('opens the Edit modal pre-filled with the selected user\'s data', async () => {
//     mockedUseUsers.mockReturnValue({ ...baseHookReturn, users: mockUsers, loading: false });
//     const user = userEvent.setup();
//     render(<App />);

//     await user.click(screen.getByLabelText('Edit Leanne Graham'));

//     expect(screen.getByText('Edit User', { selector: 'h2' })).toBeInTheDocument();
//     expect(screen.getByLabelText('First Name')).toHaveValue('Leanne');
//   });

//   it('calls editUser with the correct id and form data on submit', async () => {
//     const editUser = jest.fn().mockResolvedValue(true);
//     mockedUseUsers.mockReturnValue({ ...baseHookReturn, users: mockUsers, loading: false, editUser });
//     const user = userEvent.setup();
//     render(<App />);

//     await user.click(screen.getByLabelText('Edit Leanne Graham'));
//     const firstNameInput = screen.getByLabelText('First Name');
//     await user.clear(firstNameInput);
//     await user.type(firstNameInput, 'Updated');
//     await user.click(screen.getByText('Save'));

//     await waitFor(() => expect(editUser).toHaveBeenCalledWith(1, expect.objectContaining({ firstName: 'Updated' })));
//   });
// });

// describe('App - Delete user flow', () => {
//   it('opens the delete confirmation modal for the selected user', async () => {
//     mockedUseUsers.mockReturnValue({ ...baseHookReturn, users: mockUsers, loading: false });
//     const user = userEvent.setup();
//     render(<App />);

//     await user.click(screen.getByLabelText('Delete Leanne Graham'));

//     expect(screen.getByText(/Leanne Graham/)).toBeInTheDocument();
//     expect(screen.getByText('Delete User')).toBeInTheDocument();
//   });

//   it('calls removeUser with the correct id when delete is confirmed', async () => {
//     const removeUser = jest.fn().mockResolvedValue(true);
//     mockedUseUsers.mockReturnValue({ ...baseHookReturn, users: mockUsers, loading: false, removeUser });
//     const user = userEvent.setup();
//     render(<App />);

//     await user.click(screen.getByLabelText('Delete Leanne Graham'));
//     await user.click(screen.getByText('Delete', { selector: 'button.btn-confirm-delete' }));

//     await waitFor(() => expect(removeUser).toHaveBeenCalledWith(1));
//   });
// });




// import React from 'react';
// import { render, screen, waitFor } from '@testing-library/react';
// import userEvent from '@testing-library/user-event';
// import App from './App';
// import useUsers from './hooks/useUsers';
// import type { User } from './types/user';

// // Mock the hook so App's rendering/wiring logic can be tested independently
// // of real fetching/timers — each test controls exactly what the
// // hook "returns" for that scenario. UserFormModal and DeleteConfirmModal
// // are NOT mocked, so these tests also verify the real wiring between
// // App and those modals (open on click, correct data passed, correct
// // hook function called on submit/confirm).
// jest.mock('./hooks/useUsers');
// const mockedUseUsers = useUsers as jest.MockedFunction<typeof useUsers>;

// const mockUsers: User[] = [
//   { id: 1, firstName: 'Leanne', lastName: 'Graham', email: 'leanne@example.com', department: 'Romaguera-Crona' },
// ];

// const baseHookReturn = {
//   users: [] as User[],
//   loading: false,
//   error: null,
//   addUser: jest.fn(),
//   editUser: jest.fn(),
//   removeUser: jest.fn(),
//   refetch: jest.fn(),
// };

// beforeEach(() => {
//   jest.clearAllMocks();
// });

// describe('App - loading/error/empty states', () => {
//   it('shows the loading spinner while data is loading', () => {
//     mockedUseUsers.mockReturnValue({ ...baseHookReturn, loading: true });
//     render(<App />);
//     expect(screen.getByRole('status')).toHaveTextContent('Loading users...');
//     expect(screen.queryByRole('table')).not.toBeInTheDocument();
//   });

//   it('renders the user table once loading finishes with data', () => {
//     mockedUseUsers.mockReturnValue({ ...baseHookReturn, users: mockUsers, loading: false });
//     render(<App />);
//     expect(screen.getByText('Leanne')).toBeInTheDocument();
//   });

//   it('shows an error banner and a retry button when fetch fails with no data', async () => {
//     const refetch = jest.fn();
//     mockedUseUsers.mockReturnValue({
//       ...baseHookReturn, users: [], loading: false, error: { message: 'Network Error' }, refetch,
//     });
//     const user = userEvent.setup();
//     render(<App />);
//     expect(screen.getByRole('alert')).toHaveTextContent('Network Error');
//     await user.click(screen.getByText('Retry'));
//     expect(refetch).toHaveBeenCalledTimes(1);
//   });

//   it('shows the empty state when there are no users and no error', () => {
//     mockedUseUsers.mockReturnValue({ ...baseHookReturn, users: [], loading: false });
//     render(<App />);
//     expect(screen.getByText('No users found.')).toBeInTheDocument();
//   });
// });

// describe('App - Add user flow', () => {
//   it('opens the Add modal when the floating add button is clicked', async () => {
//     mockedUseUsers.mockReturnValue({ ...baseHookReturn, users: mockUsers, loading: false });
//     const user = userEvent.setup();
//     render(<App />);

//     await user.click(screen.getByLabelText('Add User'));

//     expect(screen.getByText('Add User', { selector: 'h2' })).toBeInTheDocument();
//   });

//   it('calls addUser with form data and closes the modal on successful submit', async () => {
//     const addUser = jest.fn().mockResolvedValue(true);
//     mockedUseUsers.mockReturnValue({ ...baseHookReturn, users: mockUsers, loading: false, addUser });
//     const user = userEvent.setup();
//     render(<App />);

//     await user.click(screen.getByLabelText('Add User'));
//     await user.type(screen.getByLabelText('First Name'), 'New');
//     await user.type(screen.getByLabelText('Last Name'), 'Person');
//     await user.type(screen.getByLabelText('Email'), 'new.person@example.com');
//     await user.type(screen.getByLabelText('Department'), 'Sales');
//     await user.click(screen.getByText('Save'));

//     await waitFor(() => expect(addUser).toHaveBeenCalledWith({
//       firstName: 'New', lastName: 'Person', email: 'new.person@example.com', department: 'Sales',
//     }));
//     await waitFor(() => expect(screen.queryByText('Add User', { selector: 'h2' })).not.toBeInTheDocument());
//   });
// });

// describe('App - Edit user flow', () => {
//   it('opens the Edit modal pre-filled with the selected user\'s data', async () => {
//     mockedUseUsers.mockReturnValue({ ...baseHookReturn, users: mockUsers, loading: false });
//     const user = userEvent.setup();
//     render(<App />);

//     await user.click(screen.getByLabelText('Edit Leanne Graham'));

//     expect(screen.getByText('Edit User', { selector: 'h2' })).toBeInTheDocument();
//     expect(screen.getByLabelText('First Name')).toHaveValue('Leanne');
//   });

//   it('calls editUser with the correct id and form data on submit', async () => {
//     const editUser = jest.fn().mockResolvedValue(true);
//     mockedUseUsers.mockReturnValue({ ...baseHookReturn, users: mockUsers, loading: false, editUser });
//     const user = userEvent.setup();
//     render(<App />);

//     await user.click(screen.getByLabelText('Edit Leanne Graham'));
//     const firstNameInput = screen.getByLabelText('First Name');
//     await user.clear(firstNameInput);
//     await user.type(firstNameInput, 'Updated');
//     await user.click(screen.getByText('Save'));

//     await waitFor(() => expect(editUser).toHaveBeenCalledWith(1, expect.objectContaining({ firstName: 'Updated' })));
//   });
// });

// describe('App - Search', () => {
//   it('filters the visible table rows as the user types in the search box', async () => {
//     const multiUsers: User[] = [
//       { id: 1, firstName: 'Leanne', lastName: 'Graham', email: 'leanne@example.com', department: 'Engineering' },
//       { id: 2, firstName: 'Ervin', lastName: 'Howell', email: 'ervin@example.com', department: 'Sales' },
//     ];
//     mockedUseUsers.mockReturnValue({ ...baseHookReturn, users: multiUsers, loading: false });
//     const user = userEvent.setup();
//     render(<App />);

//     expect(screen.getByText('Leanne')).toBeInTheDocument();
//     expect(screen.getByText('Ervin')).toBeInTheDocument();

//     await user.type(screen.getByLabelText('Search users'), 'ervin');

//     await waitFor(() => expect(screen.queryByText('Leanne')).not.toBeInTheDocument());
//     expect(screen.getByText('Ervin')).toBeInTheDocument();
//   });

//   it('shows the empty state when the search term matches no one', async () => {
//     mockedUseUsers.mockReturnValue({ ...baseHookReturn, users: mockUsers, loading: false });
//     const user = userEvent.setup();
//     render(<App />);

//     await user.type(screen.getByLabelText('Search users'), 'nonexistentperson');

//     expect(await screen.findByText('No users found.')).toBeInTheDocument();
//   });
// });
//   it('opens the delete confirmation modal for the selected user', async () => {
//     mockedUseUsers.mockReturnValue({ ...baseHookReturn, users: mockUsers, loading: false });
//     const user = userEvent.setup();
//     render(<App />);

//     await user.click(screen.getByLabelText('Delete Leanne Graham'));

//     expect(screen.getByText(/Leanne Graham/)).toBeInTheDocument();
//     expect(screen.getByText('Delete User')).toBeInTheDocument();
//   });

//   it('calls removeUser with the correct id when delete is confirmed', async () => {
//     const removeUser = jest.fn().mockResolvedValue(true);
//     mockedUseUsers.mockReturnValue({ ...baseHookReturn, users: mockUsers, loading: false, removeUser });
//     const user = userEvent.setup();
//     render(<App />);

//     await user.click(screen.getByLabelText('Delete Leanne Graham'));
//     await user.click(screen.getByText('Delete', { selector: 'button.btn-confirm-delete' }));

//     await waitFor(() => expect(removeUser).toHaveBeenCalledWith(1));
//   });



import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';
import useUsers from './hooks/useUsers';
import type { User } from './types/user';

// Mock the hook so App's rendering/wiring logic can be tested independently
// of real fetching/timers — each test controls exactly what the
// hook "returns" for that scenario. UserFormModal and DeleteConfirmModal
// are NOT mocked, so these tests also verify the real wiring between
// App and those modals (open on click, correct data passed, correct
// hook function called on submit/confirm).
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

describe('App - loading/error/empty states', () => {
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
  });

  it('shows an error banner and a retry button when fetch fails with no data', async () => {
    const refetch = jest.fn();
    mockedUseUsers.mockReturnValue({
      ...baseHookReturn, users: [], loading: false, error: { message: 'Network Error' }, refetch,
    });
    const user = userEvent.setup();
    render(<App />);
    expect(screen.getByRole('alert')).toHaveTextContent('Network Error');
    await user.click(screen.getByText('Retry'));
    expect(refetch).toHaveBeenCalledTimes(1);
  });

  it('shows the empty state when there are no users and no error', () => {
    mockedUseUsers.mockReturnValue({ ...baseHookReturn, users: [], loading: false });
    render(<App />);
    expect(screen.getByText('No users found.')).toBeInTheDocument();
  });
});

describe('App - Add user flow', () => {
  it('opens the Add modal when the floating add button is clicked', async () => {
    mockedUseUsers.mockReturnValue({ ...baseHookReturn, users: mockUsers, loading: false });
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByLabelText('Add User'));

    expect(screen.getByText('Add User', { selector: 'h2' })).toBeInTheDocument();
  });

  it('calls addUser with form data and closes the modal on successful submit', async () => {
    const addUser = jest.fn().mockResolvedValue(true);
    mockedUseUsers.mockReturnValue({ ...baseHookReturn, users: mockUsers, loading: false, addUser });
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByLabelText('Add User'));
    await user.type(screen.getByLabelText('First Name'), 'New');
    await user.type(screen.getByLabelText('Last Name'), 'Person');
    await user.type(screen.getByLabelText('Email'), 'new.person@example.com');
    await user.type(screen.getByLabelText('Department'), 'Sales');
    await user.click(screen.getByText('Save'));

    await waitFor(() => expect(addUser).toHaveBeenCalledWith({
      firstName: 'New', lastName: 'Person', email: 'new.person@example.com', department: 'Sales',
    }));
    await waitFor(() => expect(screen.queryByText('Add User', { selector: 'h2' })).not.toBeInTheDocument());
  });
});

describe('App - Edit user flow', () => {
  it('opens the Edit modal pre-filled with the selected user\'s data', async () => {
    mockedUseUsers.mockReturnValue({ ...baseHookReturn, users: mockUsers, loading: false });
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByLabelText('Edit Leanne Graham'));

    expect(screen.getByText('Edit User', { selector: 'h2' })).toBeInTheDocument();
    expect(screen.getByLabelText('First Name')).toHaveValue('Leanne');
  });

  it('calls editUser with the correct id and form data on submit', async () => {
    const editUser = jest.fn().mockResolvedValue(true);
    mockedUseUsers.mockReturnValue({ ...baseHookReturn, users: mockUsers, loading: false, editUser });
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByLabelText('Edit Leanne Graham'));
    const firstNameInput = screen.getByLabelText('First Name');
    await user.clear(firstNameInput);
    await user.type(firstNameInput, 'Updated');
    await user.click(screen.getByText('Save'));

    await waitFor(() => expect(editUser).toHaveBeenCalledWith(1, expect.objectContaining({ firstName: 'Updated' })));
  });
});

describe('App - Search', () => {
  it('filters the visible table rows as the user types in the search box', async () => {
    const multiUsers: User[] = [
      { id: 1, firstName: 'Leanne', lastName: 'Graham', email: 'leanne@example.com', department: 'Engineering' },
      { id: 2, firstName: 'Ervin', lastName: 'Howell', email: 'ervin@example.com', department: 'Sales' },
    ];
    mockedUseUsers.mockReturnValue({ ...baseHookReturn, users: multiUsers, loading: false });
    const user = userEvent.setup();
    render(<App />);

    expect(screen.getByText('Leanne')).toBeInTheDocument();
    expect(screen.getByText('Ervin')).toBeInTheDocument();

    await user.type(screen.getByLabelText('Search users'), 'ervin');

    await waitFor(() => expect(screen.queryByText('Leanne')).not.toBeInTheDocument());
    expect(screen.getByText('Ervin')).toBeInTheDocument();
  });

  it('shows the empty state when the search term matches no one', async () => {
    mockedUseUsers.mockReturnValue({ ...baseHookReturn, users: mockUsers, loading: false });
    const user = userEvent.setup();
    render(<App />);

    await user.type(screen.getByLabelText('Search users'), 'nonexistentperson');

    expect(await screen.findByText('No users found.')).toBeInTheDocument();
  });
});

describe('App - Delete user flow', () => {
  it('opens the delete confirmation modal for the selected user', async () => {
    mockedUseUsers.mockReturnValue({ ...baseHookReturn, users: mockUsers, loading: false });
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByLabelText('Delete Leanne Graham'));

    expect(screen.getByText(/Leanne Graham/)).toBeInTheDocument();
    expect(screen.getByText('Delete User')).toBeInTheDocument();
  });

  it('calls removeUser with the correct id when delete is confirmed', async () => {
    const removeUser = jest.fn().mockResolvedValue(true);
    mockedUseUsers.mockReturnValue({ ...baseHookReturn, users: mockUsers, loading: false, removeUser });
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByLabelText('Delete Leanne Graham'));
    await user.click(screen.getByText('Delete', { selector: 'button.btn-confirm-delete' }));

    await waitFor(() => expect(removeUser).toHaveBeenCalledWith(1));
  });
});