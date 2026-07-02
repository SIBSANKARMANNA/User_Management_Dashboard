import { renderHook, act } from '@testing-library/react';
import usePagination from './usePagination';

const buildItems = (count: number) => Array.from({ length: count }, (_, i) => i + 1);

describe('usePagination', () => {
  it('defaults to page 1 with 10 items per page', () => {
    const { result } = renderHook(() => usePagination(buildItems(25)));
    expect(result.current.currentPage).toBe(1);
    expect(result.current.itemsPerPage).toBe(10);
    expect(result.current.visibleItems).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  });

  it('calculates totalPages as ceil(totalItems / itemsPerPage)', () => {
    const { result } = renderHook(() => usePagination(buildItems(25), 10));
    expect(result.current.totalPages).toBe(3);
  });

  it('returns the correct slice for a page beyond the first', () => {
    const { result } = renderHook(() => usePagination(buildItems(25), 10));
    act(() => result.current.goToPage(2));
    expect(result.current.visibleItems).toEqual([11, 12, 13, 14, 15, 16, 17, 18, 19, 20]);
  });

  it('returns a partial page for the last page', () => {
    const { result } = renderHook(() => usePagination(buildItems(25), 10));
    act(() => result.current.goToPage(3));
    expect(result.current.visibleItems).toEqual([21, 22, 23, 24, 25]);
  });

  it('clamps goToPage above totalPages to the last page', () => {
    const { result } = renderHook(() => usePagination(buildItems(25), 10));
    act(() => result.current.goToPage(99));
    expect(result.current.currentPage).toBe(3);
  });

  it('clamps goToPage below 1 to page 1', () => {
    const { result } = renderHook(() => usePagination(buildItems(25), 10));
    act(() => result.current.goToPage(-5));
    expect(result.current.currentPage).toBe(1);
  });

  it('resets to page 1 when itemsPerPage changes', () => {
    const { result } = renderHook(() => usePagination(buildItems(50), 10));
    act(() => result.current.goToPage(4));
    act(() => result.current.changeItemsPerPage(25));
    expect(result.current.currentPage).toBe(1);
    expect(result.current.itemsPerPage).toBe(25);
    expect(result.current.visibleItems).toHaveLength(25);
  });

  it('snaps currentPage back to the last valid page when the item list shrinks', () => {
    const { result, rerender } = renderHook(
      ({ items }) => usePagination(items, 10),
      { initialProps: { items: buildItems(30) } }
    );
    act(() => result.current.goToPage(3));
    expect(result.current.currentPage).toBe(3);

    rerender({ items: buildItems(5) }); // simulate deletes/filter shrinking the list
    expect(result.current.currentPage).toBe(1);
    expect(result.current.visibleItems).toEqual([1, 2, 3, 4, 5]);
  });

  it('reports hasNextPage and hasPrevPage correctly at the boundaries', () => {
    const { result } = renderHook(() => usePagination(buildItems(25), 10));
    expect(result.current.hasPrevPage).toBe(false);
    expect(result.current.hasNextPage).toBe(true);

    act(() => result.current.goToPage(3));
    expect(result.current.hasPrevPage).toBe(true);
    expect(result.current.hasNextPage).toBe(false);
  });

  it('treats an empty item list as a single page with no items', () => {
    const { result } = renderHook(() => usePagination([], 10));
    expect(result.current.totalPages).toBe(1);
    expect(result.current.visibleItems).toEqual([]);
    expect(result.current.hasNextPage).toBe(false);
    expect(result.current.hasPrevPage).toBe(false);
  });
});