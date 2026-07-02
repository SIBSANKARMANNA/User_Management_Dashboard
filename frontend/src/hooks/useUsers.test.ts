import { renderHook, act, waitFor } from '@testing-library/react';
import useUsers from './useUsers';
import { getUsers, createUser, updateUser, deleteUser } from '../api/userApi';
import type { RawApiUser, UserFormData } from '../types/user';


jest.mock('../api/userApi');
const mockedGetUsers = getUsers as jest.MockedFunction<typeof getUsers>;
const mockedCreateUser = createUser as jest.MockedFunction<typeof createUser>;
const mockedUpdateUser = updateUser as jest.MockedFunction<typeof updateUser>;
const mockedDeleteUser = deleteUser as jest.MockedFunction<typeof deleteUser>;

const buildRawUser = (overrides: Partial<RawApiUser> = {}): RawApiUser => ({
  id: 1,
  name: 'Leanne Graham',
  username: 'Bret',
  email: 'leanne@example.com',
  address: { street: 'Kulas Light', suite: 'Apt. 556', city: 'Gwenborough', zipcode: '92998-3874' },
  phone: '1-770-736-8031',
  website: 'hildegard.org',
  company: { name: 'Romaguera-Crona', catchPhrase: '', bs: '' },
  ...overrides,
});

const formData: UserFormData = {
  firstName: 'New',
  lastName: 'Person',
  email: 'new.person@example.com',
  department: 'Marketing',
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe('useUsers - initial fetch', () => {
  it('loads users on mount and maps them to the UI shape', async () => {
    mockedGetUsers.mockResolvedValueOnce([buildRawUser()]);

    const { result } = renderHook(() => useUsers());

    expect(result.current.loading).toBe(true);

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.users).toHaveLength(1);
    expect(result.current.users[0].firstName).toBe('Leanne');
    expect(result.current.error).toBeNull();
  });

  it('sets an error and stops loading when the initial fetch fails', async () => {
    mockedGetUsers.mockRejectedValueOnce({ message: 'Network Error' });

    const { result } = renderHook(() => useUsers());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.error).toEqual({ message: 'Network Error' });
    expect(result.current.users).toEqual([]);
  });
});

describe('useUsers - addUser', () => {
  it('appends a new user with a generated id on success', async () => {
    mockedGetUsers.mockResolvedValueOnce([buildRawUser({ id: 1 })]);
    mockedCreateUser.mockResolvedValueOnce(buildRawUser({ id: 11 })); // API always fakes id: 11

    const { result } = renderHook(() => useUsers());
    await waitFor(() => expect(result.current.loading).toBe(false));

    let success: boolean = false;
    await act(async () => {
      success = await result.current.addUser(formData);
    });

    expect(success).toBe(true);
    expect(result.current.users).toHaveLength(2);
    // Generated id should be max existing id (1) + 1 = 2, NOT the fake id: 11 from the API
    expect(result.current.users[1]).toEqual({ id: 2, ...formData });
  });

  it('sets an error and does not add a user when the API call fails', async () => {
    mockedGetUsers.mockResolvedValueOnce([]);
    mockedCreateUser.mockRejectedValueOnce({ message: 'Create failed', status: 500 });

    const { result } = renderHook(() => useUsers());
    await waitFor(() => expect(result.current.loading).toBe(false));

    let success: boolean = true;
    await act(async () => {
      success = await result.current.addUser(formData);
    });

    expect(success).toBe(false);
    expect(result.current.users).toHaveLength(0);
    expect(result.current.error).toEqual({ message: 'Create failed', status: 500 });
  });
});

describe('useUsers - editUser', () => {
  it('updates the matching user in local state on success', async () => {
    mockedGetUsers.mockResolvedValueOnce([buildRawUser({ id: 1, name: 'Leanne Graham' })]);
    mockedUpdateUser.mockResolvedValueOnce(buildRawUser({ id: 1 }));

    const { result } = renderHook(() => useUsers());
    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => {
      await result.current.editUser(1, { ...formData, firstName: 'Updated' });
    });

    expect(result.current.users[0].firstName).toBe('Updated');
  });

  it('leaves local state untouched when the update fails', async () => {
    mockedGetUsers.mockResolvedValueOnce([buildRawUser({ id: 1, name: 'Leanne Graham' })]);
    mockedUpdateUser.mockRejectedValueOnce({ message: 'Update failed' });

    const { result } = renderHook(() => useUsers());
    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => {
      await result.current.editUser(1, { ...formData, firstName: 'ShouldNotApply' });
    });

    expect(result.current.users[0].firstName).toBe('Leanne');
    expect(result.current.error).toEqual({ message: 'Update failed' });
  });
});

describe('useUsers - removeUser', () => {
  it('removes the matching user from local state on success', async () => {
    mockedGetUsers.mockResolvedValueOnce([buildRawUser({ id: 1 }), buildRawUser({ id: 2 })]);
    mockedDeleteUser.mockResolvedValueOnce(undefined);

    const { result } = renderHook(() => useUsers());
    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => {
      await result.current.removeUser(1);
    });

    expect(result.current.users).toHaveLength(1);
    expect(result.current.users[0].id).toBe(2);
  });

  it('keeps the user in local state when delete fails', async () => {
    mockedGetUsers.mockResolvedValueOnce([buildRawUser({ id: 1 })]);
    mockedDeleteUser.mockRejectedValueOnce({ message: 'Delete failed' });

    const { result } = renderHook(() => useUsers());
    await waitFor(() => expect(result.current.loading).toBe(false));

    let success: boolean = true;
    await act(async () => {
      success = await result.current.removeUser(1);
    });

    expect(success).toBe(false);
    expect(result.current.users).toHaveLength(1);
  });
});