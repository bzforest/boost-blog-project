import React, { TextareaHTMLAttributes } from 'react';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className = '', label, error, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-2 w-full">
        {label && (
          <label className="text-sm font-medium text-text-main">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          className={`
            w-full rounded-md bg-surface p-4 text-base text-text-main 
            border border-white/10 transition-all duration-300 ease-out
            placeholder:text-text-muted focus:outline-none focus:border-primary 
            focus:ring-1 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed
            resize-y min-h-[120px]
            ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}
            ${className}
          `}
          {...props}
        />
        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
