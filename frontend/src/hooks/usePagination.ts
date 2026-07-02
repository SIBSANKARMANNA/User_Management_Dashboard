import { useState, useEffect } from 'react';

export const PAGE_SIZE_OPTIONS = [5,10, 25, 50, 100] as const;

interface UsePaginationResult<T> {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  visibleItems: T[];
  totalItems: number;
  goToPage: (page: number) => void;
  changeItemsPerPage: (size: number) => void;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

/**
 * Client-side pagination over an already-processed array (e.g. after
 * search/filter/sort have been applied). JSONPlaceholder's /users
 * endpoint has no server-side pagination, so all paging here happens
 * against data already held in memory — see README for this assumption.
 *
 * currentPage and itemsPerPage are the only state this hook owns;
 * totalPages, startIndex, and visibleItems are all derived on every
 * render rather than stored, so they can never drift out of sync
 * with the underlying `items` array.
 */
function usePagination<T>(items: T[], initialItemsPerPage: number = 10): UsePaginationResult<T> {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(initialItemsPerPage);

  const totalItems = items.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));

  // Guard: if the underlying list shrinks (delete, or a new filter/search
  // applied) such that currentPage no longer exists, snap back to the
  // last valid page instead of rendering an empty page.
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const visibleItems = items.slice(startIndex, startIndex + itemsPerPage);

  const goToPage = (page: number) => {
    setCurrentPage(Math.min(Math.max(1, page), totalPages));
  };

  const changeItemsPerPage = (size: number) => {
    setItemsPerPage(size);
    setCurrentPage(1); // always restart at page 1 when the page size changes
  };

  return {
    currentPage,
    totalPages,
    itemsPerPage,
    visibleItems,
    totalItems,
    goToPage,
    changeItemsPerPage,
    hasNextPage: currentPage < totalPages,
    hasPrevPage: currentPage > 1,
  };
}

export default usePagination;