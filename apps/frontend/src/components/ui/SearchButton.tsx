import React, { ButtonHTMLAttributes } from 'react';

export interface SearchButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {}

export const SearchButton = React.forwardRef<HTMLButtonElement, SearchButtonProps>(
  ({ className = '', ...props }, ref) => {
    return (
      <button 
        ref={ref}
        className={`p-2 text-text-muted hover:text-text-main transition-colors duration-300 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-full cursor-pointer ${className}`}
        aria-label="Search"
        {...props}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
      </button>
    );
  }
);

SearchButton.displayName = 'SearchButton';
