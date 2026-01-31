import React from 'react';

export default function Button({ children, onClick, className = '', title }) {
  return (
    <button onClick={onClick} className={`ds-btn ${className}`} aria-label={title}>
      {children}
    </button>
  );
}
