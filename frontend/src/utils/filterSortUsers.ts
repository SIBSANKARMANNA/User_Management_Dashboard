import type { User } from '../types/user';
import type { FilterCriteria, SortConfig } from '../types/filters';


export function searchUsers(users: User[], searchTerm: string): User[] {
  const term = searchTerm.trim().toLowerCase();
  if (term === '') return users;

  return users.filter((user) =>
    [user.firstName, user.lastName, user.email, user.department]
      .some((field) => field.toLowerCase().includes(term))
  );
}

export function filterUsers(users: User[], filters: FilterCriteria): User[] {
  const activeEntries = (Object.entries(filters) as [keyof FilterCriteria, string][])
    .filter(([, value]) => value.trim() !== '');

  if (activeEntries.length === 0) return users;

  return users.filter((user) =>
    activeEntries.every(([field, value]) =>
      user[field].toLowerCase().includes(value.trim().toLowerCase())
    )
  );
}


export function sortUsers(users: User[], sortConfig: SortConfig): User[] {
  const { key, direction } = sortConfig;
  if (!key) return [...users];

  const sorted = [...users].sort((a, b) => {
    const aValue = a[key];
    const bValue = b[key];

    const comparison =
      typeof aValue === 'number' && typeof bValue === 'number'
        ? aValue - bValue
        : String(aValue).localeCompare(String(bValue));

    return direction === 'asc' ? comparison : -comparison;
  });

  return sorted;
}


export function processUsers(
  users: User[],
  searchTerm: string,
  filters: FilterCriteria,
  sortConfig: SortConfig
): User[] {
  const searched = searchUsers(users, searchTerm);
  const filtered = filterUsers(searched, filters);
  return sortUsers(filtered, sortConfig);
}