import React from "react";
import { format } from "date-fns";
import { FadeIn } from "@/components/ui/FadeIn";
import { BlogCard } from "@/components/shared/BlogCard";

interface PopularSectionProps {
  blogs: any[];
}

export const PopularSection = ({ blogs }: PopularSectionProps) => {
  return (
    <section id="popular" className="py-24 md:py-32 bg-surface/30 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <FadeIn className="text-center mb-16">
          <p className="text-primary font-medium tracking-[0.2em] text-sm mb-3">
            TRENDING NOW
          </p>
          <h2
            className="text-3xl md:text-4xl lg:text-[2.75rem] font-semibold"
            style={{ textWrap: "balance" }}
          >
            Popular Stories
          </h2>
        </FadeIn>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {blogs.map((blog) => (
            <BlogCard 
              key={blog.slug} 
              {...blog} 
              createdAt={format(new Date(blog.createdAt), "dd MMM yyyy").toUpperCase()}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
