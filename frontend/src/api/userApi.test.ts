import { AxiosError } from 'axios';
import httpClient from './httpClient';
import { getUsers, createUser, updateUser, deleteUser } from './userApi';
import type { RawApiUser, UserFormData } from '../types/user';



jest.mock('./httpClient');
const mockedHttpClient = httpClient as jest.Mocked<typeof httpClient>;

const mockRawUser: RawApiUser = {
  id: 1,
  name: 'Leanne Graham',
  username: 'Bret',
  email: 'leanne@example.com',
  address: { street: 'Kulas Light', suite: 'Apt. 556', city: 'Gwenborough', zipcode: '92998-3874' },
  phone: '1-770-736-8031',
  website: 'hildegard.org',
  company: { name: 'Romaguera-Crona', catchPhrase: 'Multi-layered client-server neural-net', bs: 'harness real-time e-markets' },
};

const mockFormData: UserFormData = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
  department: 'Engineering',
};

describe('getUsers', () => {
  it('returns the list of users on success', async () => {
    mockedHttpClient.get.mockResolvedValueOnce({ data: [mockRawUser] });

    const result = await getUsers();

    expect(mockedHttpClient.get).toHaveBeenCalledWith('/users');
    expect(result).toEqual([mockRawUser]);
  });

  it('throws a normalized error when the request fails', async () => {
    const axiosError = new AxiosError('Network Error');
    mockedHttpClient.get.mockRejectedValueOnce(axiosError);

    await expect(getUsers()).rejects.toEqual({
      message: 'Network Error',
      status: undefined,
    });
  });

  it('includes the response status in the normalized error for a server error', async () => {
    const axiosError = new AxiosError('Request failed with status code 500');
    axiosError.response = { status: 500, data: {}, statusText: '', headers: {}, config: {} as any };
    mockedHttpClient.get.mockRejectedValueOnce(axiosError);

    await expect(getUsers()).rejects.toEqual({
      message: 'Request failed with status code 500',
      status: 500,
    });
  });
});

describe('createUser', () => {
  it('posts form data to /users and returns the created user', async () => {
    mockedHttpClient.post.mockResolvedValueOnce({ data: { ...mockRawUser, id: 11 } });

    const result = await createUser(mockFormData);

    expect(mockedHttpClient.post).toHaveBeenCalledWith('/users', mockFormData);
    expect(result.id).toBe(11);
  });

  it('throws a normalized error when create fails', async () => {
    mockedHttpClient.post.mockRejectedValueOnce(new AxiosError('Bad Request'));

    await expect(createUser(mockFormData)).rejects.toEqual({
      message: 'Bad Request',
      status: undefined,
    });
  });
});

describe('updateUser', () => {
  it('puts form data to /users/:id and returns the updated user', async () => {
    mockedHttpClient.put.mockResolvedValueOnce({ data: { ...mockRawUser, name: 'John Doe' } });

    const result = await updateUser(1, mockFormData);

    expect(mockedHttpClient.put).toHaveBeenCalledWith('/users/1', mockFormData);
    expect(result.name).toBe('John Doe');
  });

  it('throws a normalized error when update fails', async () => {
    mockedHttpClient.put.mockRejectedValueOnce(new AxiosError('Not Found'));

    await expect(updateUser(1, mockFormData)).rejects.toEqual({
      message: 'Not Found',
      status: undefined,
    });
  });
});

describe('deleteUser', () => {
  it('sends a delete request to /users/:id', async () => {
    mockedHttpClient.delete.mockResolvedValueOnce({ data: {} });

    await deleteUser(1);

    expect(mockedHttpClient.delete).toHaveBeenCalledWith('/users/1');
  });

  it('throws a normalized error when delete fails', async () => {
    mockedHttpClient.delete.mockRejectedValueOnce(new AxiosError('Server Error'));

    await expect(deleteUser(1)).rejects.toEqual({
      message: 'Server Error',
      status: undefined,
    });
  });
});