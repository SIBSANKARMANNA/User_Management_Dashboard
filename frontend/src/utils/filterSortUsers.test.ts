import { searchUsers, filterUsers, sortUsers, processUsers } from './filterSortUsers';
import type { User } from '../types/user';
import { EMPTY_FILTERS, DEFAULT_SORT } from '../types/filters';

const users: User[] = [
  { id: 3, firstName: 'Clementine', lastName: 'Bauch', email: 'clementine@example.com', department: 'Sales' },
  { id: 1, firstName: 'Leanne', lastName: 'Graham', email: 'leanne@example.com', department: 'Engineering' },
  { id: 2, firstName: 'Ervin', lastName: 'Howell', email: 'ervin@example.com', department: 'Engineering' },
];

describe('searchUsers', () => {
  it('returns all users when searchTerm is empty', () => {
    expect(searchUsers(users, '')).toHaveLength(3);
  });

  it('matches on firstName case-insensitively', () => {
    const result = searchUsers(users, 'leanne');
    expect(result).toHaveLength(1);
    expect(result[0].firstName).toBe('Leanne');
  });

  it('matches on partial email', () => {
    const result = searchUsers(users, 'ervin@');
    expect(result).toHaveLength(1);
    expect(result[0].lastName).toBe('Howell');
  });

  it('matches on department', () => {
    const result = searchUsers(users, 'engineering');
    expect(result).toHaveLength(2);
  });

  it('returns an empty array when nothing matches', () => {
    expect(searchUsers(users, 'nonexistent')).toEqual([]);
  });

  it('ignores leading/trailing whitespace in the search term', () => {
    const result = searchUsers(users, '  leanne  ');
    expect(result).toHaveLength(1);
  });
});

describe('filterUsers', () => {
  it('returns all users when no filters are set', () => {
    expect(filterUsers(users, EMPTY_FILTERS)).toHaveLength(3);
  });

  it('filters by a single field', () => {
    const result = filterUsers(users, { ...EMPTY_FILTERS, department: 'Engineering' });
    expect(result).toHaveLength(2);
  });

  it('applies multiple filters with AND logic', () => {
    const result = filterUsers(users, {
      ...EMPTY_FILTERS,
      department: 'Engineering',
      lastName: 'Howell',
    });
    expect(result).toHaveLength(1);
    expect(result[0].firstName).toBe('Ervin');
  });

  it('returns an empty array when filters match no one', () => {
    const result = filterUsers(users, { ...EMPTY_FILTERS, department: 'Marketing' });
    expect(result).toEqual([]);
  });

  it('matches as a case-insensitive substring, not an exact match', () => {
    const result = filterUsers(users, { ...EMPTY_FILTERS, firstName: 'clem' });
    expect(result).toHaveLength(1);
  });
});

describe('sortUsers', () => {
  it('returns an unsorted copy when key is null', () => {
    const result = sortUsers(users, DEFAULT_SORT);
    expect(result).toEqual(users);
    expect(result).not.toBe(users); // must be a new array, not the same reference
  });

  it('sorts by id ascending numerically', () => {
    const result = sortUsers(users, { key: 'id', direction: 'asc' });
    expect(result.map((u) => u.id)).toEqual([1, 2, 3]);
  });

  it('sorts by id descending numerically', () => {
    const result = sortUsers(users, { key: 'id', direction: 'desc' });
    expect(result.map((u) => u.id)).toEqual([3, 2, 1]);
  });

  it('sorts by firstName alphabetically ascending', () => {
    const result = sortUsers(users, { key: 'firstName', direction: 'asc' });
    expect(result.map((u) => u.firstName)).toEqual(['Clementine', 'Ervin', 'Leanne']);
  });

  it('sorts by firstName alphabetically descending', () => {
    const result = sortUsers(users, { key: 'firstName', direction: 'desc' });
    expect(result.map((u) => u.firstName)).toEqual(['Leanne', 'Ervin', 'Clementine']);
  });

  it('does not mutate the original array', () => {
    const original = [...users];
    sortUsers(users, { key: 'firstName', direction: 'asc' });
    expect(users).toEqual(original);
  });
});

describe('processUsers', () => {
  it('applies search, filter, and sort together', () => {
    const result = processUsers(
      users,
      'e', // matches most names/emails
      { ...EMPTY_FILTERS, department: 'Engineering' },
      { key: 'firstName', direction: 'asc' }
    );

    expect(result.map((u) => u.firstName)).toEqual(['Ervin', 'Leanne']);
  });

  it('returns an empty array when search and filter combined match nobody', () => {
    const result = processUsers(users, 'leanne', { ...EMPTY_FILTERS, department: 'Sales' }, DEFAULT_SORT);
    expect(result).toEqual([]);
  });

  it('returns all users sorted when search and filters are empty', () => {
    const result = processUsers(users, '', EMPTY_FILTERS, { key: 'id', direction: 'asc' });
    expect(result.map((u) => u.id)).toEqual([1, 2, 3]);
  });
});