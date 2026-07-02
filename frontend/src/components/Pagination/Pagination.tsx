// import React from 'react';
import { PAGE_SIZE_OPTIONS } from '../../hooks/usePagination';
import './Pagination.css';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  totalItems: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (size: number) => void;
}

/**
 * Purely presentational pagination controls. All page-math lives in
 * usePagination — this component just renders the current state and
 * forwards user intent (prev/next/page-size change) back up via props.
 */
function Pagination({
  currentPage,
  totalPages,
  itemsPerPage,
  totalItems,
  hasNextPage,
  hasPrevPage,
  onPageChange,
  onItemsPerPageChange,
}: PaginationProps) {
  if (totalItems === 0) {
    return null;
  }

  return (
    <div className="pagination-controls">
      <label className="pagination-page-size">
        Show
        <select
          value={itemsPerPage}
          onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
        >
          {PAGE_SIZE_OPTIONS.map((size) => (
            <option key={size} value={size}>{size}</option>
          ))}
        </select>
        per page
      </label>

      <div className="pagination-nav">
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={!hasPrevPage}
          aria-label="Previous page"
        >
          Prev
        </button>

        <span className="pagination-status">
          Page {currentPage} of {totalPages}
        </span>

        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!hasNextPage}
          aria-label="Next page"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default Pagination;