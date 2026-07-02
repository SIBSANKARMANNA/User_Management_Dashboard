import { renderHook, act } from '@testing-library/react';
import useUserFilters from './useUserFilters';
import type { User } from '../types/user';

const users: User[] = [
  { id: 1, firstName: 'Leanne', lastName: 'Graham', email: 'leanne@example.com', department: 'Engineering' },
  { id: 2, firstName: 'Ervin', lastName: 'Howell', email: 'ervin@example.com', department: 'Sales' },
];

describe('useUserFilters', () => {
  it('returns all users unsorted when no search/filter/sort is applied', () => {
    const { result } = renderHook(() => useUserFilters(users));
    expect(result.current.processedUsers).toHaveLength(2);
    expect(result.current.sortField).toBeNull();
  });

  it('filters processedUsers as searchTerm changes', () => {
    const { result } = renderHook(() => useUserFilters(users));

    act(() => result.current.setSearchTerm('ervin'));

    expect(result.current.processedUsers).toHaveLength(1);
    expect(result.current.processedUsers[0].firstName).toBe('Ervin');
  });

  it('filters processedUsers as filters change', () => {
    const { result } = renderHook(() => useUserFilters(users));

    act(() => result.current.setFilters({ firstName: '', lastName: '', email: '', department: 'Sales' }));

    expect(result.current.processedUsers).toHaveLength(1);
    expect(result.current.processedUsers[0].department).toBe('Sales');
  });

  it('clearFilters resets filters back to empty', () => {
    const { result } = renderHook(() => useUserFilters(users));

    act(() => result.current.setFilters({ firstName: '', lastName: '', email: '', department: 'Sales' }));
    expect(result.current.processedUsers).toHaveLength(1);

    act(() => result.current.clearFilters());
    expect(result.current.processedUsers).toHaveLength(2);
  });

  describe('toggleSort', () => {
    it('sets sortField and defaults to ascending on first click', () => {
      const { result } = renderHook(() => useUserFilters(users));

      act(() => result.current.toggleSort('firstName'));

      expect(result.current.sortField).toBe('firstName');
      expect(result.current.sortDirection).toBe('asc');
      expect(result.current.processedUsers.map((u) => u.firstName)).toEqual(['Ervin', 'Leanne']);
    });

    it('flips direction to descending on a second click of the same field', () => {
      const { result } = renderHook(() => useUserFilters(users));

      act(() => result.current.toggleSort('firstName'));
      act(() => result.current.toggleSort('firstName'));

      expect(result.current.sortDirection).toBe('desc');
      expect(result.current.processedUsers.map((u) => u.firstName)).toEqual(['Leanne', 'Ervin']);
    });

    it('switches to the new field at ascending when a different column is clicked', () => {
      const { result } = renderHook(() => useUserFilters(users));

      act(() => result.current.toggleSort('firstName'));
      act(() => result.current.toggleSort('firstName')); // now desc
      act(() => result.current.toggleSort('department')); // switch column

      expect(result.current.sortField).toBe('department');
      expect(result.current.sortDirection).toBe('asc');
    });
  });

  it('recomputes processedUsers when the underlying users array changes', () => {
    const { result, rerender } = renderHook(
      ({ userList }) => useUserFilters(userList),
      { initialProps: { userList: users } }
    );
    expect(result.current.processedUsers).toHaveLength(2);

    const updatedUsers = [...users, {
      id: 3, firstName: 'Clementine', lastName: 'Bauch', email: 'c@example.com', department: 'Marketing',
    }];
    rerender({ userList: updatedUsers });

    expect(result.current.processedUsers).toHaveLength(3);
  });
});