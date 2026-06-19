import React from 'react';
import { Skeleton } from '../ui/Skeleton';

export const BlogCardSkeleton: React.FC = () => {
  return (
    <div className="w-full aspect-[3/4] rounded-2xl bg-surface border border-white/5 p-6 md:p-8 flex flex-col justify-between overflow-hidden relative shadow-xl">
      {/* Simulate the background gradient effect slightly */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
      
      {/* Top section */}
      <div className="space-y-4 relative z-10">
        <Skeleton className="h-6 w-24 rounded-full" /> {/* Badge */}
        <Skeleton className="h-4 w-20" /> {/* Date */}
        
        <div className="pt-4 space-y-2">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-3/4" />
        </div>
        
        <div className="pt-4 space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>
      </div>
      
      {/* Bottom section (Button) */}
      <div className="mt-8 pt-4 relative z-10">
        <Skeleton className="h-11 w-full rounded-md" />
      </div>
    </div>
  );
};
