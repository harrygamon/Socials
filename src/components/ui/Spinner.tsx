import React from 'react';

export function Spinner({ className = '', size = 24, label = 'Loading...' }) {
  return (
    <span className={`inline-flex items-center justify-center ${className}`} role="status" aria-label={label}>
      <svg
        className="animate-spin text-primary-500"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v8z"
        />
      </svg>
      <span className="sr-only">{label}</span>
    </span>
  );
} 