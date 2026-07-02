// import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SearchBar from './SearchBar';

describe('SearchBar', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('updates the input immediately without calling onChange right away', async () => {
    const user = userEvent.setup({ delay: null });
    const onChange = jest.fn();
    render(<SearchBar value="" onChange={onChange} debounceMs={300} />);

    await user.type(screen.getByLabelText('Search users'), 'alice');

    expect(screen.getByLabelText('Search users')).toHaveValue('alice');
    expect(onChange).not.toHaveBeenCalledWith('alice');
  });

  it('calls onChange with the typed value after the debounce delay', async () => {
    const user = userEvent.setup({ delay: null });
    const onChange = jest.fn();
    render(<SearchBar value="" onChange={onChange} debounceMs={300} />);

    await user.type(screen.getByLabelText('Search users'), 'alice');

    jest.advanceTimersByTime(300);

    expect(onChange).toHaveBeenCalledWith('alice');
  });

  it('resets the debounce timer on each keystroke (only fires once for the final value)', async () => {
    const user = userEvent.setup({ delay: null });
    const onChange = jest.fn();
    render(<SearchBar value="" onChange={onChange} debounceMs={300} />);

    const input = screen.getByLabelText('Search users');
    await user.type(input, 'a');
    jest.advanceTimersByTime(100);
    await user.type(input, 'l');
    jest.advanceTimersByTime(100);
    await user.type(input, 'i');
    jest.advanceTimersByTime(300);

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith('ali');
  });

  it('shows a clear button only when there is text, and clears on click', async () => {
    const user = userEvent.setup({ delay: null });
    render(<SearchBar value="" onChange={jest.fn()} />);

    expect(screen.queryByLabelText('Clear search')).not.toBeInTheDocument();

    await user.type(screen.getByLabelText('Search users'), 'bob');
    expect(screen.getByLabelText('Clear search')).toBeInTheDocument();

    await user.click(screen.getByLabelText('Clear search'));
    expect(screen.getByLabelText('Search users')).toHaveValue('');
  });
});