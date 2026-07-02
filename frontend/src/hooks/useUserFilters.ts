import { useState, useMemo, useCallback } from 'react';
import type { User } from '../types/user';
import type { FilterCriteria, SortableField, SortDirection, SortConfig } from '../types/filters';
import  {EMPTY_FILTERS } from '../types/filters';
import { processUsers } from '../utils/filterSortUsers';

interface UseUserFiltersResult {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filters: FilterCriteria;
  setFilters: (filters: FilterCriteria) => void;
  clearFilters: () => void;
  sortField: SortableField | null;
  sortDirection: SortDirection;
  toggleSort: (field: SortableField) => void;
  processedUsers: User[];
}

/**
 * Owns search/filter/sort state and derives the fully processed user
 * list from it via useMemo. All the actual matching/sorting logic lives
 * in utils/filterSortUsers.ts (pure functions, unit tested independently)
 * — this hook is state management + wiring on top of those.
 *
 * Colocating this state here (rather than in App) keeps App from having
 * to know about search/filter/sort internals at all — it just renders
 * `processedUsers` and passes the setters down to SearchBar/FilterPopup.
 */
function useUserFilters(users: User[]): UseUserFiltersResult {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filters, setFilters] = useState<FilterCriteria>(EMPTY_FILTERS);
  const [sortField, setSortField] = useState<SortableField | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const clearFilters = useCallback(() => {
    setFilters(EMPTY_FILTERS);
  }, []);

  /**
   * Clicking the same column header again flips direction (asc -> desc
   * -> asc...); clicking a different column switches to that column,
   * starting at ascending.
   */
  const toggleSort = useCallback((field: SortableField) => {
    setSortField((currentField) => {
      if (currentField === field) {
        setSortDirection((currentDirection) => (currentDirection === 'asc' ? 'desc' : 'asc'));
        return currentField;
      }
      setSortDirection('asc');
      return field;
    });
  }, []);

  // Recompute only when an actual input changes, not on every render.
  const processedUsers = useMemo(() => {
    const sortConfig: SortConfig = { key: sortField, direction: sortDirection };
    return processUsers(users, searchTerm, filters, sortConfig);
  }, [users, searchTerm, filters, sortField, sortDirection]);

  return {
    searchTerm,
    setSearchTerm,
    filters,
    setFilters,
    clearFilters,
    sortField,
    sortDirection,
    toggleSort,
    processedUsers,
  };
}

export default useUserFilters;