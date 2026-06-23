import { Metadata } from "next";
import { format } from "date-fns";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PublicBlogSearchBar } from "@/components/blogs/PublicBlogSearchBar";
import { BlogCard } from "@/components/shared/BlogCard";
import { Pagination } from "@/components/shared/Pagination";
import { FadeIn } from "@/components/ui/FadeIn";
import { prisma } from "@/lib/db";
import { Prisma } from "@prisma/client";

export const metadata: Metadata = {
  title: "All Stories | Boost Blog",
  description: "Explore all our travel destinations and experiences.",
};

// Next.js config for dynamic rendering when searchParams are used
export const dynamic = "force-dynamic";

export default async function BlogsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  
  const pageStr = params.page as string | undefined;
  const page = pageStr ? parseInt(pageStr, 10) : 1;
  const ITEMS_PER_PAGE = 10;

  const q = (params.q as string) || "";
  const dateStr = params.date as string | undefined;
  const sort = (params.sort as string) || "date_desc";

  // Build where clause
  const where: Prisma.BlogWhereInput = {
    isPublished: true,
  };

  if (q) {
    where.OR = [
      { title: { contains: q, mode: "insensitive" } },
      { excerpt: { contains: q, mode: "insensitive" } },
    ];
  }

  if (dateStr) {
    const selectedDate = new Date(dateStr);
    const nextDate = new Date(selectedDate);
    nextDate.setDate(nextDate.getDate() + 1);

    where.createdAt = {
      gte: selectedDate,
      lt: nextDate, // Blogs created on that specific day
    };
  }

  // Build orderBy
  let orderBy: Prisma.BlogOrderByWithRelationInput = { createdAt: "desc" };
  if (sort === "date_asc") orderBy = { createdAt: "asc" };
  else if (sort === "views_desc") orderBy = { views: "desc" };
  else if (sort === "views_asc") orderBy = { views: "asc" };
  else if (sort === "title_asc") orderBy = { title: "asc" };

  // Fetch data
  const [blogs, totalBlogs] = await Promise.all([
    prisma.blog.findMany({
      where,
      orderBy,
      skip: (page - 1) * ITEMS_PER_PAGE,
      take: ITEMS_PER_PAGE,
    }),
    prisma.blog.count({ where }),
  ]);

  const totalPages = Math.ceil(totalBlogs / ITEMS_PER_PAGE);

  return (
    <>
      <Navbar />

      <main className="min-h-screen pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-6 md:px-12 space-y-12">
          
          {/* Header Section */}
          <FadeIn className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white">
              All Stories
            </h1>
            <p className="text-primary text-lg max-w-2xl mx-auto font-light">
              Explore all our travel destinations and experiences.
            </p>
          </FadeIn>

          {/* Search & Filter Bar */}
          <FadeIn delay={0.1}>
            <PublicBlogSearchBar />
          </FadeIn>

          {/* Blogs Grid */}
          <FadeIn delay={0.2}>
            {blogs.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {blogs.map((blog) => (
                  <BlogCard 
                    key={blog.id} 
                    {...blog} 
                    createdAt={format(new Date(blog.createdAt), "dd MMM yyyy").toUpperCase()}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-32 text-center bg-[#111111] border border-white/5 rounded-2xl">
                <p className="text-xl text-text-muted font-light">
                  No stories found matching your criteria.
                </p>
              </div>
            )}
          </FadeIn>

          {/* Pagination */}
          <FadeIn delay={0.3}>
            <Pagination 
              currentPage={page} 
              totalPages={totalPages} 
              searchParams={params as Record<string, string>} 
            />
          </FadeIn>
          
        </div>
      </main>

      <Footer />
    </>
  );
}
