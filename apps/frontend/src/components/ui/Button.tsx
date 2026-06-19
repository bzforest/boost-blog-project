import React, { ButtonHTMLAttributes } from 'react';

type ButtonVariant = 'primary' | 'outline' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'primary', size = 'md', children, ...props }, ref) => {
    
    const baseStyles = 'inline-flex items-center justify-center rounded-md font-medium transition-all duration-300 ease-out focus:outline-none disabled:opacity-50 disabled:pointer-events-none active:scale-95 cursor-pointer';
    
    const variants: Record<ButtonVariant, string> = {
      primary: 'bg-primary text-white hover:bg-orange-600 shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 hover:-translate-y-0.5',
      outline: 'border border-primary text-primary hover:bg-primary/10 hover:-translate-y-0.5',
      ghost: 'text-text-main hover:bg-surface hover:text-primary',
    };

    const sizes: Record<ButtonSize, string> = {
      sm: 'h-9 px-4 text-sm',
      md: 'h-11 px-6 text-base',
      lg: 'h-14 px-8 text-lg',
    };

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
