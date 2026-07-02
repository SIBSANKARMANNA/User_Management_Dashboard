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


function useUserFilters(users: User[]): UseUserFiltersResult {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filters, setFilters] = useState<FilterCriteria>(EMPTY_FILTERS);
  const [sortField, setSortField] = useState<SortableField | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const clearFilters = useCallback(() => {
    setFilters(EMPTY_FILTERS);
  }, []);

 
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