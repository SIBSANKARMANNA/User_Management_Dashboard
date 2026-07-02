/**
 * Per-field filter values for the Filter popup (Step 10).
 * All fields optional/empty-string means "no filter applied" for that field.
 */
export interface FilterCriteria {
  firstName: string;
  lastName: string;
  email: string;
  department: string;
}

export const EMPTY_FILTERS: FilterCriteria = {
  firstName: '',
  lastName: '',
  email: '',
  department: '',
};

export type SortableField = 'id' | 'firstName' | 'lastName' | 'email' | 'department';
export type SortDirection = 'asc' | 'desc';

export interface SortConfig {
  key: SortableField | null;
  direction: SortDirection;
}

export const DEFAULT_SORT: SortConfig = { key: null, direction: 'asc' };