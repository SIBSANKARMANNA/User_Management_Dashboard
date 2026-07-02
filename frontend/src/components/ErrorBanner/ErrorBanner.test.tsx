
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ErrorBanner from './ErrorBanner';

describe('ErrorBanner', () => {
  it('renders the error message', () => {
    render(<ErrorBanner error={{ message: 'Something went wrong' }} />);
    expect(screen.getByRole('alert')).toHaveTextContent('Something went wrong');
  });

  it('includes the status code when present', () => {
    render(<ErrorBanner error={{ message: 'Server error', status: 500 }} />);
    expect(screen.getByRole('alert')).toHaveTextContent('Server error (status 500)');
  });

  it('does not render a dismiss button when onDismiss is not provided', () => {
    render(<ErrorBanner error={{ message: 'Oops' }} />);
    expect(screen.queryByLabelText('Dismiss error')).not.toBeInTheDocument();
  });

  it('calls onDismiss when the dismiss button is clicked', async () => {
    const user = userEvent.setup();
    const onDismiss = jest.fn();
    render(<ErrorBanner error={{ message: 'Oops' }} onDismiss={onDismiss} />);

    await user.click(screen.getByLabelText('Dismiss error'));

    expect(onDismiss).toHaveBeenCalledTimes(1);
  });
});