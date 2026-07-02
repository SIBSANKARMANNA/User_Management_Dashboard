// import React from 'react';
import type { ApiError } from '../../types/user';
import './ErrorBanner.css';

interface ErrorBannerProps {
  error: ApiError;
  onDismiss?: () => void;
}

/**
 * Displays an API error to the user in a consistent format.
 * Kept as its own component (rather than inlined in App) so any
 * screen/feature that surfaces an ApiError can reuse the same UI —
 * one place to change the look/behavior of error messaging (DRY).
 */
function ErrorBanner({ error, onDismiss }: ErrorBannerProps) {
  return (
    <div className="error-banner" role="alert">
      <span className="error-banner-message">
        {error.message}
        {error.status ? ` (status ${error.status})` : ''}
      </span>
      {onDismiss && (
        <button
          type="button"
          className="error-banner-dismiss"
          onClick={onDismiss}
          aria-label="Dismiss error"
        >
          ×
        </button>
      )}
    </div>
  );
}

export default ErrorBanner;