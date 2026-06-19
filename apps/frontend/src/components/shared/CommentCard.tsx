"use client";

import React, { useState } from 'react';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { ChevronDown, Reply } from 'lucide-react';

export interface CommentCardProps {
  author: string;
  createdAt: string;
  content: string;
  status?: 'pending' | 'approved' | 'rejected' | string;
  repliesCount?: number;
}

export const CommentCard: React.FC<CommentCardProps> = ({
  author,
  createdAt,
  content,
  status,
  repliesCount = 0,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Determine badge styling based on status
  let badgeClasses = 'bg-surface border-white/10 text-text-muted';
  if (status === 'pending') {
    badgeClasses = 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
  } else if (status === 'approved') {
    badgeClasses = 'bg-green-500/10 text-green-500 border-green-500/20';
  } else if (status === 'rejected') {
    badgeClasses = 'bg-red-500/10 text-red-500 border-red-500/20';
  }

  return (
    <div 
      className="group relative w-full p-6 md:p-8 bg-transparent border border-white/10 rounded-2xl flex flex-col gap-4 hover:border-primary/40 hover:bg-primary/5 transition-all duration-300 cursor-pointer overflow-hidden"
      onClick={() => setIsExpanded(!isExpanded)}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          {/* Primary Accent Dot on Hover */}
          <div className="w-1.5 h-1.5 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden md:block"></div>
          <div className="flex flex-col gap-1.5">
            <span className="font-medium text-text-main tracking-wide group-hover:text-primary transition-colors duration-300">{author}</span>
            <span className="text-xs text-text-muted/60 uppercase tracking-widest">{createdAt}</span>
          </div>
        </div>
        
        {status && (
          <Badge className={badgeClasses}>
            {status.toUpperCase()}
          </Badge>
        )}
      </div>
      
      {/* Main Content */}
      <p className={`text-sm md:text-base text-text-muted/90 leading-relaxed font-light whitespace-pre-wrap mt-2 ${!isExpanded ? 'line-clamp-1' : ''}`}>
        {content}
      </p>

      {/* Unexpanded Overlays */}
      {!isExpanded && (
        <>
          {/* Replies Indicator (Bottom Right) */}
          {repliesCount > 0 && (
            <div className="absolute bottom-4 right-6 flex items-center gap-1.5 text-primary/80 text-xs font-medium">
              <Reply size={14} />
              <span>{repliesCount}</span>
            </div>
          )}

          {/* Bounce Chevron (Bottom Center) */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <ChevronDown size={18} className="text-primary animate-bounce" />
          </div>
        </>
      )}

      {/* Expanded Area */}
      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-white/5 flex flex-col gap-6 animate-in fade-in duration-300">
          <div className="flex justify-start">
            <Button size="sm" variant="ghost" className="gap-2 text-text-muted hover:text-primary hover:bg-primary/10" onClick={(e) => e.stopPropagation()}>
              <Reply size={16} />
              Reply
            </Button>
          </div>

          {/* Mock Reply Thread */}
          {repliesCount > 0 && (
            <div className="pl-4 border-l-2 border-primary/30 flex flex-col gap-4" onClick={(e) => e.stopPropagation()}>
              <div className="flex flex-col gap-2">
                <div className="flex items-baseline gap-2">
                  <span className="font-medium text-sm text-primary">Boost Admin</span>
                  <span className="text-[10px] text-text-muted/60 uppercase tracking-widest">Just now</span>
                </div>
                <p className="text-sm text-text-muted/80 leading-relaxed font-light">
                  Thank you for your feedback! We will keep exploring more amazing places.
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
