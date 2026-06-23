import { Metadata } from "next";
import { format } from "date-fns";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PublicBlogSearchBar } from "@/components/blogs/PublicBlogSearchBar";
import { BlogCard } from "@/components/shared/BlogCard";
import { Pagination } from "@/components/shared/Pagination";
import { FadeIn } from "@/components/ui/FadeIn";

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

  // Build query string
  const queryParams = new URLSearchParams();
  queryParams.set("page", page.toString());
  if (q) queryParams.set("search", q);
  if (dateStr) queryParams.set("date", dateStr);
  if (sort) queryParams.set("sort", sort);

  // Fetch data from backend
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api"}/blogs?${queryParams.toString()}`, {
    next: { revalidate: 60 }
  });
  
  const { data: blogs = [], meta }: { data: any[], meta: { total: number } } = res.ok ? await res.json() : { data: [], meta: { total: 0 } };
  const totalBlogs = meta.total || 0;
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
