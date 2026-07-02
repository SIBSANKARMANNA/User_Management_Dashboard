import { useState, useEffect } from 'react';
import './SearchBar.css';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  debounceMs?: number;
}

/**
 * Text input for searching users. Keeps its own local state for
 * instant typing feedback, but only calls `onChange` (which triggers
 * re-filtering upstream) after the user pauses typing for `debounceMs`.
 * This avoids re-filtering/re-rendering the table on every keystroke.
 */
function SearchBar({ value, onChange, placeholder = 'Search users...', debounceMs = 300 }: SearchBarProps) {
  const [localValue, setLocalValue] = useState<string>(value);

  // Keep local state in sync if the parent resets the search externally
  // (e.g. a "clear all filters" action).
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onChange(localValue);
    }, debounceMs);

    return () => clearTimeout(timeoutId); // cancel the pending call if the user keeps typing
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localValue, debounceMs]);

  return (
    <div className="search-bar">
      <input
        type="text"
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        placeholder={placeholder}
        aria-label="Search users"
      />
      {localValue && (
        <button
          type="button"
          className="search-bar-clear"
          onClick={() => setLocalValue('')}
          aria-label="Clear search"
        >
          ×
        </button>
      )}
    </div>
  );
}

export default SearchBar;