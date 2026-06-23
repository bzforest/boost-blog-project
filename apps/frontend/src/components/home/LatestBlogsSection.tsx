import React from "react";
import { format } from "date-fns";
import Link from "next/link";
import { FadeIn } from "@/components/ui/FadeIn";
import { BlogCard } from "@/components/shared/BlogCard";
import { Button } from "@/components/ui/Button";

interface LatestBlogsSectionProps {
  blogs: any[];
}

export const LatestBlogsSection = ({ blogs }: LatestBlogsSectionProps) => {
  return (
    <section id="blog" className="py-24 md:py-32 scroll-mt-20">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <FadeIn className="text-center mb-16">
          <p className="text-primary font-medium tracking-[0.2em] text-sm mb-3">
            FRESH FROM THE ROAD
          </p>
          <h2
            className="text-3xl md:text-4xl lg:text-[2.75rem] font-semibold"
            style={{ textWrap: "balance" }}
          >
            Latest Stories
          </h2>
        </FadeIn>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 md:gap-8">
          {blogs.map((blog) => (
            <BlogCard 
              key={blog.slug} 
              {...blog} 
              createdAt={format(new Date(blog.createdAt), "dd MMM yyyy").toUpperCase()}
            />
          ))}
        </div>

        <FadeIn className="flex justify-center mt-16">
          <Link href="/blogs">
            <Button variant="outline" size="lg" className="tracking-wider px-12">
              View All Blogs
            </Button>
          </Link>
        </FadeIn>
      </div>
    </section>
  );
};
