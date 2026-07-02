// import React from 'react';
import './LoadingSpinner.css';

interface LoadingSpinnerProps {
  label?: string;
}

/**
 * Simple loading indicator shown while the initial user fetch is in flight.
 * `role="status"` + visually-hidden label keeps this accessible to
 * screen readers without needing extra markup at each call site.
 */
function LoadingSpinner({ label = 'Loading...' }: LoadingSpinnerProps) {
  return (
    <div className="loading-spinner-container" role="status">
      <div className="loading-spinner" />
      <span className="loading-spinner-label">{label}</span>
    </div>
  );
}

export default LoadingSpinner;