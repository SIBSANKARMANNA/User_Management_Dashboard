import {
  mapRawUserToUser,
  mapRawUsersToUsers,
  mapFormDataToApiPayload,
  mapUserToFormData,
} from './userMapper';
import type { RawApiUser, User } from '../types/user';

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

describe('mapRawUserToUser', () => {
  it('splits a two-word name into firstName and lastName', () => {
    const result = mapRawUserToUser(buildRawUser({ name: 'Leanne Graham' }));
    expect(result.firstName).toBe('Leanne');
    expect(result.lastName).toBe('Graham');
  });

  it('treats everything after the first word as lastName for multi-word names', () => {
    const result = mapRawUserToUser(buildRawUser({ name: 'Mrs. Dennis Schulist' }));
    expect(result.firstName).toBe('Mrs.');
    expect(result.lastName).toBe('Dennis Schulist');
  });

  it('handles a single-word name with an empty lastName', () => {
    const result = mapRawUserToUser(buildRawUser({ name: 'Madonna' }));
    expect(result.firstName).toBe('Madonna');
    expect(result.lastName).toBe('');
  });

  it('maps company.name to department', () => {
    const result = mapRawUserToUser(buildRawUser({ company: { name: 'Acme Corp', catchPhrase: '', bs: '' } }));
    expect(result.department).toBe('Acme Corp');
  });

  // it('falls back to "Unassigned" when company is missing', () => {
  //   const rawUser = buildRawUser();
  //   delete rawUser.company;
  //   const result = mapRawUserToUser(rawUser);
  //   expect(result.department).toBe('Unassigned');
  // });

  it('falls back to "Unassigned" when company is missing', () => {
  const rawUser = {
    ...buildRawUser(),
  } as Partial<RawApiUser>;

  delete rawUser.company;

  const result = mapRawUserToUser(rawUser as RawApiUser);

  expect(result.department).toBe('Unassigned');
});

  it('carries id and email through unchanged', () => {
    const result = mapRawUserToUser(buildRawUser({ id: 42, email: 'test@test.com' }));
    expect(result.id).toBe(42);
    expect(result.email).toBe('test@test.com');
  });
});

describe('mapRawUsersToUsers', () => {
  it('maps an array of raw users to an array of Users', () => {
    const result = mapRawUsersToUsers([buildRawUser({ id: 1 }), buildRawUser({ id: 2 })]);
    expect(result).toHaveLength(2);
    expect(result[0].id).toBe(1);
    expect(result[1].id).toBe(2);
  });

  it('returns an empty array when given an empty array', () => {
    expect(mapRawUsersToUsers([])).toEqual([]);
  });
});

describe('mapFormDataToApiPayload', () => {
  it('combines firstName and lastName into a single name field', () => {
    const payload = mapFormDataToApiPayload({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@test.com',
      department: 'Sales',
    });
    expect(payload.name).toBe('John Doe');
    expect(payload.company?.name).toBe('Sales');
    expect(payload.email).toBe('john@test.com');
  });
});

describe('mapUserToFormData', () => {
  it('converts a User back into UserFormData for pre-filling the edit form', () => {
    const user: User = { id: 1, firstName: 'Jane', lastName: 'Smith', email: 'jane@test.com', department: 'HR' };
    const formData = mapUserToFormData(user);
    expect(formData).toEqual({
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane@test.com',
      department: 'HR',
    });
  });
});