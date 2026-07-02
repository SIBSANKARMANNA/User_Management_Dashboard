// import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Pagination from './Pagination';

const defaultProps = {
  currentPage: 2,
  totalPages: 5,
  itemsPerPage: 10,
  totalItems: 45,
  hasNextPage: true,
  hasPrevPage: true,
  onPageChange: jest.fn(),
  onItemsPerPageChange: jest.fn(),
};

describe('Pagination', () => {
  it('renders nothing when totalItems is 0', () => {
    render(<Pagination {...defaultProps} totalItems={0} />);
    expect(screen.queryByText(/Page/)).not.toBeInTheDocument();
  });

  it('displays the current page and total pages', () => {
    render(<Pagination {...defaultProps} />);
    expect(screen.getByText('Page 2 of 5')).toBeInTheDocument();
  });

  it('renders all page size options', () => {
    render(<Pagination {...defaultProps} />);
    [10, 25, 50, 100].forEach((size) => {
      expect(screen.getByRole('option', { name: String(size) })).toBeInTheDocument();
    });
  });

  it('calls onPageChange with currentPage + 1 when Next is clicked', async () => {
    const user = userEvent.setup();
    const onPageChange = jest.fn();
    render(<Pagination {...defaultProps} onPageChange={onPageChange} />);

    await user.click(screen.getByLabelText('Next page'));
    expect(onPageChange).toHaveBeenCalledWith(3);
  });

  it('calls onPageChange with currentPage - 1 when Prev is clicked', async () => {
    const user = userEvent.setup();
    const onPageChange = jest.fn();
    render(<Pagination {...defaultProps} onPageChange={onPageChange} />);

    await user.click(screen.getByLabelText('Previous page'));
    expect(onPageChange).toHaveBeenCalledWith(1);
  });

  it('disables Prev on the first page', () => {
    render(<Pagination {...defaultProps} currentPage={1} hasPrevPage={false} />);
    expect(screen.getByLabelText('Previous page')).toBeDisabled();
  });

  it('disables Next on the last page', () => {
    render(<Pagination {...defaultProps} currentPage={5} hasNextPage={false} />);
    expect(screen.getByLabelText('Next page')).toBeDisabled();
  });

  it('calls onItemsPerPageChange with the selected value', async () => {
    const user = userEvent.setup();
    const onItemsPerPageChange = jest.fn();
    render(<Pagination {...defaultProps} onItemsPerPageChange={onItemsPerPageChange} />);

    await user.selectOptions(screen.getByRole('combobox'), '50');
    expect(onItemsPerPageChange).toHaveBeenCalledWith(50);
  });
});