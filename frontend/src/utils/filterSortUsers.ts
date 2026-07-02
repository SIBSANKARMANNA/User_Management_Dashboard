import type { User } from '../types/user';
import type { FilterCriteria, SortConfig } from '../types/filters';

/**
 * Returns users where searchTerm appears (case-insensitively) in any of
 * firstName, lastName, email, or department. An empty/whitespace-only
 * searchTerm matches everything.
 */
export function searchUsers(users: User[], searchTerm: string): User[] {
  const term = searchTerm.trim().toLowerCase();
  if (term === '') return users;

  return users.filter((user) =>
    [user.firstName, user.lastName, user.email, user.department]
      .some((field) => field.toLowerCase().includes(term))
  );
}

/**
 * Returns users matching all provided per-field filters (AND logic).
 * Each field's filter value is matched as a case-insensitive substring;
 * an empty value for a field means "don't filter on this field".
 */
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

/**
 * Returns a new sorted array (does not mutate input) according to sortConfig.
 * A null key means "no sorting" and returns the array as-is (still a copy).
 * Numeric fields (id) sort numerically; text fields use localeCompare for
 * correct alphabetical ordering.
 */
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

/**
 * Composes search -> filter -> sort into a single pipeline.
 * Order matters for correctness but not for the final result set here,
 * since search/filter are independent AND conditions — sort is applied
 * last since it only reorders, never removes.
 */
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