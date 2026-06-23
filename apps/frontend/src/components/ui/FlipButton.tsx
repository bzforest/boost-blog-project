import React, { ButtonHTMLAttributes } from 'react';

export interface FlipButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  frontText: string;
  backText: string;
  className?: string;
}

export const FlipButton = React.forwardRef<HTMLButtonElement, FlipButtonProps>(
  ({ frontText, backText, className = '', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={`group/btn relative h-11 w-40 cursor-pointer outline-none [perspective:1000px] ${className}`}
        {...props}
      >
        <div className="relative h-full w-full rounded-md font-medium transition-transform duration-500 ease-out [transform-style:preserve-3d] group-hover/btn:[transform:rotateX(-180deg)] group-focus-visible/btn:[transform:rotateX(-180deg)]">
          
          {/* Front Face */}
          <div className="absolute inset-0 flex items-center justify-center rounded-md bg-surface text-text-main border border-primary/80 [backface-visibility:hidden]">
            {frontText}
          </div>
          
          {/* Back Face */}
          <div className="absolute inset-0 flex items-center justify-center rounded-md bg-primary text-white [backface-visibility:hidden] [transform:rotateX(180deg)] shadow-lg shadow-orange-500/20">
            {backText}
          </div>
          
        </div>
      </button>
    );
  }
);

FlipButton.displayName = 'FlipButton';
