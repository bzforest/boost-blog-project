import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { FlipButton } from '../ui/FlipButton';

interface BlogCardProps {
  title: string;
  excerpt: string;
  coverImage: string;
  slug: string;
  createdAt: string;
}

export const BlogCard: React.FC<BlogCardProps> = ({
  title,
  excerpt,
  coverImage,
  slug,
  createdAt,
}) => {
  return (
    <div className="group/card relative w-full aspect-[4/5] cursor-pointer outline-none [perspective:1000px]">
      <div className="relative h-full w-full rounded-2xl transition-transform duration-700 ease-out [transform-style:preserve-3d] group-hover/card:[transform:rotateY(180deg)] group-focus-visible/card:[transform:rotateY(180deg)]">
        
        {/* Front Face */}
        <div className="absolute inset-0 h-full w-full rounded-2xl overflow-hidden bg-surface [backface-visibility:hidden]">
          <Image 
            src={coverImage} 
            alt={title} 
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-1000 group-hover:scale-110"
          />
          {/* Gradient Overlay for Text Readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
          
          <div className="absolute bottom-5 left-5 right-5">
            <h3 className="text-xl font-medium text-white line-clamp-2 leading-snug drop-shadow-md">
              {title}
            </h3>
          </div>
        </div>

        {/* Back Face */}
        <div className="absolute inset-0 flex flex-col justify-between p-5 h-full w-full rounded-2xl bg-surface border border-white/5 shadow-2xl shadow-black/60 overflow-hidden [backface-visibility:hidden] [transform:rotateY(180deg)]">
          
          <div className="flex flex-col h-full">
            <div className="space-y-4 flex-grow">
              {/* Date */}
              <div className="flex items-center justify-end border-b border-white/5 pb-4">
                <span className="text-xs text-text-muted/60 uppercase tracking-wider font-medium">{createdAt}</span>
              </div>
              
              {/* Title */}
              <h3 className="text-lg md:text-xl font-semibold text-text-main line-clamp-2 leading-tight pt-1">
                {title}
              </h3>
              
              {/* Excerpt */}
              <p className="text-xs md:text-sm text-text-muted/90 line-clamp-2 leading-relaxed font-light">
                {excerpt}
              </p>
            </div>
            
            {/* Button */}
            <div className="mt-auto pt-4">
              <Link href={`/blog/${slug}`} className="block w-full outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-md">
                <FlipButton 
                  frontText="Read More" 
                  backText="Let's Go !" 
                  className="w-full tracking-wide shadow-primary/20 shadow-lg" 
                  tabIndex={-1} 
                />
              </Link>
            </div>
          </div>

        </div>
        
      </div>
    </div>
  );
};
