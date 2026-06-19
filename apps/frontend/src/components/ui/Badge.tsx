import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ children, className = '' }) => {
  return (
    <span
      className={`
        inline-flex items-center rounded-full px-3 py-1 text-xs font-medium 
        bg-surface border border-white/10 text-text-secondary
        ${className}
      `}
    >
      {children}
    </span>
  );
};
