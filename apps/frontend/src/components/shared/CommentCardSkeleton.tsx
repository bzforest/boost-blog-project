import React from 'react';
import { Skeleton } from '../ui/Skeleton';

export const CommentCardSkeleton: React.FC = () => {
  return (
    <div className="w-full p-6 md:p-8 bg-transparent border border-white/10 rounded-2xl flex flex-col gap-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          {/* Mock Accent Dot */}
          <Skeleton className="w-1.5 h-1.5 rounded-full hidden md:block" />
          <div className="flex flex-col gap-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
      </div>
      
      <div className="mt-2 space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-4/6" />
      </div>
    </div>
  );
};
