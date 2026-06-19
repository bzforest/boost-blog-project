import React from 'react';
import Link from 'next/link';

interface LogoProps {
  className?: string;
  textSize?: string;
  interactive?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ 
  className = '', 
  textSize = 'text-3xl',
  interactive = true 
}) => {
  if (!interactive) {
    return (
      <div className={`flex items-baseline gap-1 ${className}`}>
        <span className={`${textSize} font-bold text-primary tracking-tight`}>BOOST</span>
        <span className={`${textSize} font-cursive text-text-main`}>Blog</span>
      </div>
    );
  }

  return (
    <Link href="/" className={`flex items-baseline gap-1 group outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-md ${className}`}>
      <span className={`${textSize} font-bold text-primary tracking-tight group-hover:text-white transition-colors duration-300`}>
        BOOST
      </span>
      <span className={`${textSize} font-cursive text-text-main group-hover:text-primary transition-colors duration-300`}>
        Blog
      </span>
    </Link>
  );
};
